begin;

-- The Brisk customer report contains carried-forward credits and the payment report
-- contains duplicated, combined and pre-period rows. The user confirmed that the
-- only current receivable is Libertybelle invoice 102092 for GBP 2,500.
update public.clients
set imported_balance_pence = case when legacy_key = 'libertybelle-uk' then 250000 else 0 end
where legacy_source = 'brisk';

create temporary table brisk_payment_source on commit drop as
select * from public.finance_payments where source = 'brisk';

delete from public.finance_payments where source = 'brisk';

-- Rebuild one payment per paid invoice. Preserve a reliable Brisk payment date
-- when customer and reference match; otherwise use the invoice issue date.
insert into public.finance_payments (
  client_id, invoice_id, source, source_key, payment_date, amount_pence,
  method, reference, currency, source_data
)
select
  invoice.client_id,
  invoice.id,
  'brisk',
  'reconciled|' || invoice.source_key,
  coalesce(matched.payment_date, invoice.issue_date),
  invoice.total_pence,
  coalesce(matched.method, 'Imported payment'),
  invoice.display_number,
  'GBP',
  jsonb_build_object(
    'reconciled', true,
    'invoice_source_key', invoice.source_key,
    'original_payment', matched.source_data
  )
from public.finance_invoices invoice
left join lateral (
  select payment.*
  from brisk_payment_source payment
  where payment.client_id = invoice.client_id
    and payment.source_data->>'Customer' = invoice.source_data->>'Customer'
    and position(invoice.display_number in coalesce(payment.reference, '')) > 0
  order by
    case when payment.reference = invoice.display_number then 0 else 1 end,
    abs(payment.payment_date - invoice.issue_date)
  limit 1
) matched on true
where invoice.source = 'brisk' and invoice.status = 'paid'
on conflict (source, source_key) do update set
  invoice_id = excluded.invoice_id,
  payment_date = excluded.payment_date,
  amount_pence = excluded.amount_pence,
  method = excluded.method,
  reference = excluded.reference,
  source_data = excluded.source_data;

commit;
