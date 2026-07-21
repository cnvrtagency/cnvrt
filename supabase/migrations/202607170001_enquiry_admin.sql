create extension if not exists pgcrypto;

do $$
begin
  create type public.enquiry_status as enum (
    'new',
    'contacted',
    'qualified',
    'proposal',
    'won',
    'lost',
    'spam'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  form_name text not null check (char_length(form_name) between 1 and 80),
  enquiry_type text not null check (enquiry_type in ('homepage', 'contact', 'project', 'audit')),
  source_page text not null check (char_length(source_page) between 1 and 300),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company text check (company is null or char_length(company) <= 160),
  website text check (website is null or char_length(website) <= 500),
  service text check (service is null or char_length(service) <= 100),
  project_type text check (project_type is null or char_length(project_type) <= 100),
  budget text check (budget is null or char_length(budget) <= 100),
  timing text check (timing is null or char_length(timing) <= 240),
  audit_area text check (audit_area is null or char_length(audit_area) <= 100),
  data_access text check (data_access is null or char_length(data_access) <= 100),
  brief text not null check (char_length(brief) between 10 and 2000),
  status public.enquiry_status not null default 'new',
  payload_hash text not null check (char_length(payload_hash) = 64),
  form_started_at timestamptz,
  form_duration_ms integer check (form_duration_ms is null or form_duration_ms between 0 and 86400000),
  archived_at timestamptz
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_created_at_idx on public.enquiries (status, created_at desc) where archived_at is null;
create index if not exists enquiries_email_idx on public.enquiries (lower(email));
create index if not exists enquiries_payload_hash_idx on public.enquiries (payload_hash, created_at desc);

create table if not exists public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists enquiry_notes_enquiry_created_idx on public.enquiry_notes (enquiry_id, created_at desc);

create table if not exists public.enquiry_rate_limits (
  id bigint generated always as identity primary key,
  rate_key text not null check (char_length(rate_key) = 64),
  created_at timestamptz not null default now()
);

create index if not exists enquiry_rate_limits_key_created_idx on public.enquiry_rate_limits (rate_key, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
before update on public.enquiries
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.check_enquiry_rate_limit(
  p_rate_key text,
  p_max_attempts integer default 5,
  p_window_minutes integer default 60
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  attempt_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_rate_key));

  delete from public.enquiry_rate_limits
  where created_at < now() - interval '48 hours';

  select count(*) into attempt_count
  from public.enquiry_rate_limits
  where rate_key = p_rate_key
    and created_at >= now() - make_interval(mins => p_window_minutes);

  if attempt_count >= p_max_attempts then
    return false;
  end if;

  insert into public.enquiry_rate_limits (rate_key) values (p_rate_key);
  return true;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.enquiry_rate_limits enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.enquiries from anon, authenticated;
revoke all on table public.enquiry_notes from anon, authenticated;
revoke all on table public.enquiry_rate_limits from anon, authenticated;
revoke all on function public.is_admin() from public;
revoke all on function public.check_enquiry_rate_limit(text, integer, integer) from public;

grant select on table public.admin_users to authenticated;
grant select on table public.enquiries to authenticated;
grant update (status, archived_at) on table public.enquiries to authenticated;
grant select, insert on table public.enquiry_notes to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.check_enquiry_rate_limit(text, integer, integer) to service_role;

drop policy if exists "Admins can verify their access" on public.admin_users;
create policy "Admins can verify their access"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
on public.enquiries for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
on public.enquiries for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can read enquiry notes" on public.enquiry_notes;
create policy "Admins can read enquiry notes"
on public.enquiry_notes for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins can add enquiry notes" on public.enquiry_notes;
create policy "Admins can add enquiry notes"
on public.enquiry_notes for insert
to authenticated
with check ((select public.is_admin()) and author_id = auth.uid());

comment on table public.admin_users is 'Invite-only allowlist for the CNVRT enquiry admin.';
comment on table public.enquiries is 'Validated website enquiries inserted only by the submit-enquiry Edge Function.';
comment on table public.enquiry_notes is 'Internal notes visible only to allowlisted administrators.';
comment on table public.enquiry_rate_limits is 'Hashed, short-lived submission counters. No raw IP addresses are stored.';
