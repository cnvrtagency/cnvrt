create or replace function public.create_manual_enquiry(
  p_name text,
  p_email text,
  p_company text default null,
  p_website text default null,
  p_service text default null,
  p_project_type text default null,
  p_budget text default null,
  p_timing text default null,
  p_brief text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_id uuid;
  clean_name text := trim(coalesce(p_name, ''));
  clean_email text := lower(trim(coalesce(p_email, '')));
  clean_brief text := trim(coalesce(p_brief, ''));
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if char_length(clean_name) < 2 then raise exception 'Enter the contact name'; end if;
  if clean_email = '' then clean_email := 'pending+' || replace(gen_random_uuid()::text, '-', '') || '@cnvrtdigital.co.uk'; end if;
  if clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Enter a valid email address'; end if;
  if char_length(clean_brief) < 10 then raise exception 'Add a useful requirement of at least 10 characters'; end if;

  insert into public.enquiries (
    form_name, enquiry_type, source_page, name, email, company, website,
    service, project_type, budget, timing, brief, payload_hash
  ) values (
    'manual-enquiry', 'project', '/admin/', left(clean_name, 120), left(clean_email, 254),
    nullif(left(trim(coalesce(p_company, '')), 160), ''),
    nullif(left(trim(coalesce(p_website, '')), 500), ''),
    nullif(left(trim(coalesce(p_service, '')), 100), ''),
    nullif(left(trim(coalesce(p_project_type, '')), 100), ''),
    nullif(left(trim(coalesce(p_budget, '')), 100), ''),
    nullif(left(trim(coalesce(p_timing, '')), 240), ''),
    left(clean_brief, 2000),
    encode(extensions.digest(clean_email || ':' || clock_timestamp()::text || ':' || extensions.gen_random_bytes(16)::text, 'sha256'), 'hex')
  ) returning id into created_id;

  return created_id;
end;
$$;

revoke all on function public.create_manual_enquiry(text, text, text, text, text, text, text, text, text) from public, anon;
grant execute on function public.create_manual_enquiry(text, text, text, text, text, text, text, text, text) to authenticated;

comment on function public.create_manual_enquiry is 'Creates an enquiry from an administrator-entered lead or referral.';
