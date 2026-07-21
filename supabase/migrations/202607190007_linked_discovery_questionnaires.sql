create table if not exists public.discovery_invites (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null unique references public.enquiries(id) on delete cascade,
  token_hash text not null unique check (char_length(token_hash) = 64),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  revoked_at timestamptz
);

create index if not exists discovery_invites_enquiry_idx on public.discovery_invites (enquiry_id);

alter table public.discovery_invites enable row level security;
revoke all on table public.discovery_invites from anon, authenticated;
grant select on table public.discovery_invites to authenticated;

create policy "Admins read discovery invites" on public.discovery_invites for select to authenticated
using ((select public.is_admin()));

create or replace function public.generate_discovery_questionnaire_token(p_enquiry_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare raw_token text;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if not exists (select 1 from public.enquiries where id = p_enquiry_id and archived_at is null) then raise exception 'Enquiry not found'; end if;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.discovery_invites (enquiry_id, token_hash, created_by)
  values (p_enquiry_id, encode(extensions.digest(raw_token, 'sha256'), 'hex'), auth.uid())
  on conflict (enquiry_id) do update set
    token_hash = excluded.token_hash,
    created_by = excluded.created_by,
    created_at = now(),
    completed_at = null,
    revoked_at = null;
  return raw_token;
end;
$$;

revoke all on function public.generate_discovery_questionnaire_token(uuid) from public, anon;
grant execute on function public.generate_discovery_questionnaire_token(uuid) to authenticated;

comment on table public.discovery_invites is 'Hashed, revocable links that attach a client discovery response to an existing enquiry.';
