alter table public.invoices
add column if not exists bank_details jsonb not null default '{}'::jsonb;

alter table public.invoices
drop constraint if exists invoices_bank_details_check;

alter table public.invoices
add constraint invoices_bank_details_check check (jsonb_typeof(bank_details) = 'object');
