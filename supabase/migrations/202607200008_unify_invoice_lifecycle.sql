alter table public.finance_invoices
  add column if not exists platform_state text not null default 'invoiced'
  check (platform_state in ('draft', 'invoiced', 'void'));

alter table public.finance_invoices
  add column if not exists uploaded_at timestamptz;

update public.finance_invoices
set platform_state = 'invoiced',
    uploaded_at = coalesce(uploaded_at, issue_date::timestamptz)
where source = 'brisk';

comment on column public.finance_invoices.platform_state is 'Shared CNVRT invoice lifecycle state. Historical uploads are invoiced records, not revenue-only transactions.';
