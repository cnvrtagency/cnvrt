alter table public.clients alter column primary_contact_email drop not null;
alter table public.clients add column if not exists billing_address text;
alter table public.clients add column if not exists phone text;
alter table public.clients add column if not exists legacy_source text;
alter table public.clients add column if not exists legacy_key text;
alter table public.clients add column if not exists imported_balance_pence bigint not null default 0;

create unique index if not exists clients_legacy_source_key_idx
  on public.clients (legacy_source, legacy_key)
  where legacy_source is not null and legacy_key is not null;

create table if not exists public.finance_invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  display_number text not null,
  source text not null default 'cnvrt',
  source_key text not null,
  issue_date date not null,
  due_date date,
  status text not null check (status in ('draft', 'sent', 'paid', 'overdue', 'void')),
  subtotal_pence bigint not null check (subtotal_pence >= 0),
  tax_pence bigint not null default 0 check (tax_pence >= 0),
  total_pence bigint not null check (total_pence >= 0),
  currency text not null default 'GBP' check (currency = 'GBP'),
  description text,
  source_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, source_key)
);

create table if not exists public.finance_payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  invoice_id uuid references public.finance_invoices(id) on delete set null,
  source text not null default 'cnvrt',
  source_key text not null,
  payment_date date not null,
  amount_pence bigint not null check (amount_pence > 0),
  method text,
  reference text,
  currency text not null default 'GBP' check (currency = 'GBP'),
  source_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source, source_key)
);

create index if not exists finance_invoices_client_date_idx on public.finance_invoices (client_id, issue_date desc);
create index if not exists finance_invoices_status_date_idx on public.finance_invoices (status, issue_date desc);
create index if not exists finance_payments_client_date_idx on public.finance_payments (client_id, payment_date desc);
create index if not exists finance_payments_invoice_idx on public.finance_payments (invoice_id);

drop trigger if exists finance_invoices_set_updated_at on public.finance_invoices;
create trigger finance_invoices_set_updated_at before update on public.finance_invoices
for each row execute function public.set_updated_at();

alter table public.finance_invoices enable row level security;
alter table public.finance_payments enable row level security;
revoke all on table public.finance_invoices, public.finance_payments from anon, authenticated;
grant select, insert, update on table public.finance_invoices, public.finance_payments to authenticated;

drop policy if exists "Admins manage finance invoices" on public.finance_invoices;
create policy "Admins manage finance invoices" on public.finance_invoices for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins manage finance payments" on public.finance_payments;
create policy "Admins manage finance payments" on public.finance_payments for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

comment on table public.finance_invoices is 'Normalised CNVRT and imported historical invoice ledger.';
comment on table public.finance_payments is 'Payments linked to finance invoices where a reliable source match exists.';
