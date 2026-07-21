create or replace function public.convert_enquiry_to_client(
  p_enquiry_id uuid,
  p_project_name text default null,
  p_template_key text default null,
  p_target_start_date date default null
)
returns table (client_id uuid, project_id uuid, portal_token text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_enquiry public.enquiries%rowtype;
  selected_template public.onboarding_templates%rowtype;
  created_client_id uuid;
  created_project_id uuid;
  raw_token text;
  inferred_template_key text;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  select * into selected_enquiry from public.enquiries where id = p_enquiry_id and archived_at is null for update;
  if not found then raise exception 'Enquiry not found'; end if;
  if selected_enquiry.status <> 'won' then raise exception 'Only won enquiries can be converted'; end if;
  if exists (select 1 from public.projects where enquiry_id = p_enquiry_id) then raise exception 'This enquiry is already connected to a project'; end if;
  inferred_template_key := coalesce(p_template_key, case
    when selected_enquiry.project_type in ('shopify', 'migration') or selected_enquiry.service in ('shopify', 'ecommerce-ppc') then 'shopify'
    when selected_enquiry.project_type = 'website' or selected_enquiry.service in ('web-design', 'web-design-ecommerce', 'custom-development') then 'website'
    when selected_enquiry.service in ('paid-media', 'google-ads', 'meta-ads', 'email-marketing', 'seo-aeo', 'seo', 'aeo') then 'growth'
    else 'general'
  end);
  select * into selected_template from public.onboarding_templates where template_key = inferred_template_key;
  if not found then raise exception 'Onboarding template not found'; end if;
  insert into public.clients (enquiry_id, company_name, primary_contact_name, primary_contact_email, website)
  values (p_enquiry_id, coalesce(nullif(selected_enquiry.company, ''), selected_enquiry.name), selected_enquiry.name, lower(selected_enquiry.email), selected_enquiry.website)
  returning id into created_client_id;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.projects (client_id, enquiry_id, template_id, name, service, value_pence, target_start_date, portal_token_hash, invited_at)
  values (created_client_id, p_enquiry_id, selected_template.id, coalesce(nullif(trim(p_project_name), ''), coalesce(nullif(selected_enquiry.company, ''), selected_enquiry.name) || ' — ' || selected_template.name), coalesce(selected_enquiry.service, selected_enquiry.project_type), selected_enquiry.opportunity_value_pence, p_target_start_date, encode(extensions.digest(raw_token, 'sha256'), 'hex'), now())
  returning id into created_project_id;
  insert into public.project_onboarding_items (project_id, position, title, guidance, owner, response_type, is_required)
  select created_project_id, position, title, guidance, owner, response_type, is_required from public.onboarding_template_items where template_id = selected_template.id order by position;
  insert into public.project_activity (project_id, actor_type, actor_id, event_type, summary, metadata)
  values (created_project_id, 'cnvrt', auth.uid(), 'created', 'Client and onboarding project created', jsonb_build_object('enquiry_id', p_enquiry_id, 'template', inferred_template_key));
  return query select created_client_id, created_project_id, raw_token;
end;
$$;

create or replace function public.rotate_project_portal_token(p_project_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare raw_token text;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  update public.projects set portal_token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex'), portal_enabled = true, invited_at = now() where id = p_project_id;
  if not found then raise exception 'Project not found'; end if;
  insert into public.project_activity (project_id, actor_type, actor_id, event_type, summary)
  values (p_project_id, 'cnvrt', auth.uid(), 'status_changed', 'Client portal link regenerated');
  return raw_token;
end;
$$;
