alter table public.discovery_invites
  add column if not exists draft_data jsonb not null default '{}'::jsonb,
  add column if not exists draft_updated_at timestamptz;

alter table public.discovery_invites
  drop constraint if exists discovery_invites_draft_object;

alter table public.discovery_invites
  add constraint discovery_invites_draft_object
  check (jsonb_typeof(draft_data) = 'object');

comment on column public.discovery_invites.draft_data is 'Secure server-side questionnaire draft attached to the private invite token.';
