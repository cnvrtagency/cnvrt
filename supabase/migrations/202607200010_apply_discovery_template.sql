create or replace function public.apply_discovery_template_answers(
  p_enquiry_id uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_answers jsonb;
  cleaned_existing jsonb;
  merged_answers jsonb;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if jsonb_typeof(p_answers) <> 'object' then raise exception 'Answers must be an object'; end if;

  select coalesce(discovery_data, '{}'::jsonb)
  into existing_answers
  from public.enquiries
  where id = p_enquiry_id and archived_at is null
  for update;

  if not found then raise exception 'Enquiry not found'; end if;

  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
  into cleaned_existing
  from jsonb_each(existing_answers)
  where value not in ('null'::jsonb, '""'::jsonb, '[]'::jsonb);

  merged_answers := p_answers || cleaned_existing;
  update public.enquiries set discovery_data = merged_answers where id = p_enquiry_id;
  return merged_answers;
end;
$$;

revoke all on function public.apply_discovery_template_answers(uuid, jsonb) from public, anon;
grant execute on function public.apply_discovery_template_answers(uuid, jsonb) to authenticated;

comment on function public.apply_discovery_template_answers(uuid, jsonb) is 'Adds approved discovery template answers while preserving every non-empty client response.';
