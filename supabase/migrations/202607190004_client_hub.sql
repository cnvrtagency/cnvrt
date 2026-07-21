create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid unique references public.enquiries(id) on delete set null,
  company_name text not null check (char_length(company_name) between 2 and 160),
  primary_contact_name text not null check (char_length(primary_contact_name) between 2 and 120),
  primary_contact_email text not null check (char_length(primary_contact_email) between 3 and 254),
  website text check (website is null or char_length(website) <= 500),
  status text not null default 'onboarding' check (status in ('onboarding', 'active', 'paused', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique check (template_key ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 2 and 100),
  description text not null check (char_length(description) between 10 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.onboarding_templates(id) on delete cascade,
  position integer not null check (position between 1 and 100),
  title text not null check (char_length(title) between 2 and 140),
  guidance text not null check (char_length(guidance) between 5 and 1000),
  owner text not null check (owner in ('client', 'cnvrt', 'both')),
  response_type text not null default 'text' check (response_type in ('text', 'url', 'confirmation')),
  is_required boolean not null default true,
  unique (template_id, position)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  enquiry_id uuid unique references public.enquiries(id) on delete set null,
  template_id uuid references public.onboarding_templates(id) on delete set null,
  name text not null check (char_length(name) between 2 and 180),
  service text check (service is null or char_length(service) <= 100),
  status text not null default 'awaiting_client' check (status in ('preparing', 'awaiting_client', 'ready', 'active', 'complete', 'paused')),
  value_pence bigint check (value_pence is null or value_pence between 0 and 10000000000),
  target_start_date date,
  portal_token_hash text not null unique check (char_length(portal_token_hash) = 64),
  portal_enabled boolean not null default true,
  invited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_onboarding_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  position integer not null check (position between 1 and 100),
  title text not null check (char_length(title) between 2 and 140),
  guidance text not null check (char_length(guidance) between 5 and 1000),
  owner text not null check (owner in ('client', 'cnvrt', 'both')),
  response_type text not null default 'text' check (response_type in ('text', 'url', 'confirmation')),
  is_required boolean not null default true,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'complete', 'not_applicable')),
  response_text text check (response_text is null or char_length(response_text) <= 4000),
  completed_at timestamptz,
  completed_by text check (completed_by is null or completed_by in ('client', 'cnvrt')),
  updated_at timestamptz not null default now(),
  unique (project_id, position)
);

create table if not exists public.project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_type text not null check (actor_type in ('client', 'cnvrt', 'system')),
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in ('created', 'portal_opened', 'item_updated', 'status_changed', 'note')),
  summary text not null check (char_length(summary) between 1 and 300),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists clients_status_created_idx on public.clients (status, created_at desc);
create index if not exists projects_client_status_idx on public.projects (client_id, status, created_at desc);
create index if not exists project_items_project_position_idx on public.project_onboarding_items (project_id, position);
create index if not exists project_activity_project_created_idx on public.project_activity (project_id, created_at desc);

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists project_items_set_updated_at on public.project_onboarding_items;
create trigger project_items_set_updated_at before update on public.project_onboarding_items
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.onboarding_templates enable row level security;
alter table public.onboarding_template_items enable row level security;
alter table public.projects enable row level security;
alter table public.project_onboarding_items enable row level security;
alter table public.project_activity enable row level security;

revoke all on table public.clients from anon, authenticated;
revoke all on table public.onboarding_templates from anon, authenticated;
revoke all on table public.onboarding_template_items from anon, authenticated;
revoke all on table public.projects from anon, authenticated;
revoke all on table public.project_onboarding_items from anon, authenticated;
revoke all on table public.project_activity from anon, authenticated;

grant select, insert, update on table public.clients to authenticated;
grant select on table public.onboarding_templates, public.onboarding_template_items to authenticated;
grant select, insert, update on table public.projects to authenticated;
grant select, insert, update on table public.project_onboarding_items to authenticated;
grant select, insert on table public.project_activity to authenticated;

create policy "Admins manage clients" on public.clients for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins read templates" on public.onboarding_templates for select to authenticated
using ((select public.is_admin()));
create policy "Admins read template items" on public.onboarding_template_items for select to authenticated
using ((select public.is_admin()));
create policy "Admins manage projects" on public.projects for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage onboarding items" on public.project_onboarding_items for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins read project activity" on public.project_activity for select to authenticated
using ((select public.is_admin()));
create policy "Admins add project activity" on public.project_activity for insert to authenticated
with check ((select public.is_admin()) and actor_type = 'cnvrt' and actor_id = auth.uid());

insert into public.onboarding_templates (template_key, name, description) values
  ('general', 'General project', 'A focused onboarding route for projects that do not need a specialist checklist.'),
  ('website', 'Website project', 'Content, brand, access and technical decisions required before website production begins.'),
  ('shopify', 'Shopify and ecommerce', 'Commerce, catalogue, fulfilment and platform access required before ecommerce delivery.'),
  ('growth', 'Ongoing growth', 'Commercial goals, measurement and channel access required before ongoing activity begins.')
on conflict (template_key) do update set name = excluded.name, description = excluded.description;

with template as (select id from public.onboarding_templates where template_key = 'general')
insert into public.onboarding_template_items (template_id, position, title, guidance, owner, response_type) select id, position, title, guidance, owner, response_type from template cross join (values
  (1, 'Confirm the commercial objective', 'Describe the result this engagement needs to create and how the business will judge success.', 'client', 'text'),
  (2, 'Confirm the decision makers', 'List everyone who will review work or provide final approval.', 'client', 'text'),
  (3, 'Share existing assets and access', 'Provide a secure link to the relevant files or password-manager collection. Never paste passwords here.', 'client', 'url'),
  (4, 'Confirm scope and delivery plan', 'CNVRT will turn the agreed requirement into milestones, owners and review points.', 'cnvrt', 'confirmation'),
  (5, 'Approve project start', 'Both sides confirm that the information, access and delivery plan are ready.', 'both', 'confirmation')
) as items(position, title, guidance, owner, response_type)
on conflict (template_id, position) do update set title = excluded.title, guidance = excluded.guidance, owner = excluded.owner, response_type = excluded.response_type;

with template as (select id from public.onboarding_templates where template_key = 'website')
insert into public.onboarding_template_items (template_id, position, title, guidance, owner, response_type) select id, position, title, guidance, owner, response_type from template cross join (values
  (1, 'Confirm website goals', 'Explain the priority action visitors should take and the commercial outcome the website must support.', 'client', 'text'),
  (2, 'Share brand and content assets', 'Provide a secure Drive, Dropbox or project-folder link containing logos, brand guidance, photography and available copy.', 'client', 'url'),
  (3, 'Confirm pages and functionality', 'List required pages, forms, integrations and any operational requirements that must be included.', 'client', 'text'),
  (4, 'Provide domain and platform access', 'Share access through a password manager or invite hello@cnvrtdigital.co.uk directly. Never paste passwords here.', 'client', 'text'),
  (5, 'Approve sitemap and delivery plan', 'CNVRT will prepare the proposed structure, milestones and review points for approval.', 'both', 'confirmation'),
  (6, 'Ready for production', 'CNVRT confirms that the agreed inputs are complete and production can begin.', 'cnvrt', 'confirmation')
) as items(position, title, guidance, owner, response_type)
on conflict (template_id, position) do update set title = excluded.title, guidance = excluded.guidance, owner = excluded.owner, response_type = excluded.response_type;

with template as (select id from public.onboarding_templates where template_key = 'shopify')
insert into public.onboarding_template_items (template_id, position, title, guidance, owner, response_type) select id, position, title, guidance, owner, response_type from template cross join (values
  (1, 'Confirm ecommerce goals', 'Describe the priority products, audiences and commercial targets for the store.', 'client', 'text'),
  (2, 'Share catalogue and content', 'Provide a secure link to product data, imagery, collections, policies and available copy.', 'client', 'url'),
  (3, 'Confirm fulfilment and payments', 'Explain payment methods, shipping rules, tax requirements, fulfilment and returns.', 'client', 'text'),
  (4, 'Provide Shopify and domain access', 'Invite hello@cnvrtdigital.co.uk to the relevant systems. Never paste passwords here.', 'client', 'text'),
  (5, 'Approve migration and launch plan', 'Both sides approve data migration, redirects, testing, review points and launch ownership.', 'both', 'confirmation'),
  (6, 'Ready for production', 'CNVRT confirms that the agreed inputs are complete and production can begin.', 'cnvrt', 'confirmation')
) as items(position, title, guidance, owner, response_type)
on conflict (template_id, position) do update set title = excluded.title, guidance = excluded.guidance, owner = excluded.owner, response_type = excluded.response_type;

with template as (select id from public.onboarding_templates where template_key = 'growth')
insert into public.onboarding_template_items (template_id, position, title, guidance, owner, response_type) select id, position, title, guidance, owner, response_type from template cross join (values
  (1, 'Confirm growth priorities', 'Describe the commercial target, priority products or services and the most important constraint.', 'client', 'text'),
  (2, 'Share performance context', 'Provide a secure link to relevant reports, plans and previous campaign information.', 'client', 'url'),
  (3, 'Grant channel and analytics access', 'Invite hello@cnvrtdigital.co.uk to the agreed platforms with the minimum appropriate permissions.', 'client', 'text'),
  (4, 'Confirm measurement plan', 'CNVRT documents the primary conversions, reporting cadence and decision-making measures.', 'cnvrt', 'confirmation'),
  (5, 'Approve first 30-day plan', 'Both sides approve the initial priorities, responsibilities and review date.', 'both', 'confirmation')
) as items(position, title, guidance, owner, response_type)
on conflict (template_id, position) do update set title = excluded.title, guidance = excluded.guidance, owner = excluded.owner, response_type = excluded.response_type;

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
  values (
    created_client_id,
    p_enquiry_id,
    selected_template.id,
    coalesce(nullif(trim(p_project_name), ''), coalesce(nullif(selected_enquiry.company, ''), selected_enquiry.name) || ' — ' || selected_template.name),
    coalesce(selected_enquiry.service, selected_enquiry.project_type),
    selected_enquiry.opportunity_value_pence,
    p_target_start_date,
    encode(extensions.digest(raw_token, 'sha256'), 'hex'),
    now()
  ) returning id into created_project_id;

  insert into public.project_onboarding_items (project_id, position, title, guidance, owner, response_type, is_required)
  select created_project_id, position, title, guidance, owner, response_type, is_required
  from public.onboarding_template_items where template_id = selected_template.id order by position;

  insert into public.project_activity (project_id, actor_type, actor_id, event_type, summary, metadata)
  values (created_project_id, 'cnvrt', auth.uid(), 'created', 'Client and onboarding project created', jsonb_build_object('enquiry_id', p_enquiry_id, 'template', inferred_template_key));

  return query select created_client_id, created_project_id, raw_token;
end;
$$;

revoke all on function public.convert_enquiry_to_client(uuid, text, text, date) from public, anon;
grant execute on function public.convert_enquiry_to_client(uuid, text, text, date) to authenticated;

create or replace function public.rotate_project_portal_token(p_project_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  raw_token text;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  update public.projects
  set portal_token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex'), portal_enabled = true, invited_at = now()
  where id = p_project_id;
  if not found then raise exception 'Project not found'; end if;
  insert into public.project_activity (project_id, actor_type, actor_id, event_type, summary)
  values (p_project_id, 'cnvrt', auth.uid(), 'status_changed', 'Client portal link regenerated');
  return raw_token;
end;
$$;

revoke all on function public.rotate_project_portal_token(uuid) from public, anon;
grant execute on function public.rotate_project_portal_token(uuid) to authenticated;

comment on table public.clients is 'CNVRT client records created from won enquiries.';
comment on table public.projects is 'Client projects and hashed access tokens for the onboarding portal.';
comment on table public.project_onboarding_items is 'Project-specific onboarding checklist copied from a reusable template.';
