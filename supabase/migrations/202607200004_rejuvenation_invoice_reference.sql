update public.invoices
set invoice_number = 'TRD-P1',
    bank_details = jsonb_set(coalesce(bank_details, '{}'::jsonb), '{reference}', '"TRD-P1"'::jsonb, true)
where enquiry_id = 'ce91ccc1-8940-4f63-9d10-9bd0b294c59a'
  and invoice_number = 'CNVRT-2026-0001';
