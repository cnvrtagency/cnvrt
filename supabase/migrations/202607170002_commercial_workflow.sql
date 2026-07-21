alter table public.enquiries
  add column if not exists priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high')),
  add column if not exists fit text not null default 'unreviewed'
    check (fit in ('unreviewed', 'strong', 'possible', 'unsuitable')),
  add column if not exists next_action text
    check (next_action is null or char_length(next_action) between 1 and 300),
  add column if not exists next_action_due_at timestamptz,
  add column if not exists opportunity_value_pence bigint
    check (opportunity_value_pence is null or opportunity_value_pence between 0 and 10000000000),
  add column if not exists expected_close_date date,
  add column if not exists lost_reason text
    check (lost_reason is null or char_length(lost_reason) <= 500);

alter table public.enquiries
  add constraint enquiries_due_requires_action
  check (next_action_due_at is null or next_action is not null);

create index if not exists enquiries_next_action_due_idx
on public.enquiries (next_action_due_at)
where archived_at is null and status not in ('won', 'lost', 'spam');

create index if not exists enquiries_fit_status_idx
on public.enquiries (fit, status)
where archived_at is null;

create index if not exists enquiries_expected_close_idx
on public.enquiries (expected_close_date)
where archived_at is null and expected_close_date is not null and status not in ('won', 'lost', 'spam');

create table if not exists public.enquiry_events (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in (
    'created',
    'status_changed',
    'workflow_updated',
    'action_completed',
    'note_added',
    'archived'
  )),
  summary text not null check (char_length(summary) between 1 and 300),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_events_enquiry_created_idx
on public.enquiry_events (enquiry_id, created_at desc);

alter table public.enquiry_events enable row level security;
revoke all on table public.enquiry_events from anon, authenticated;
grant select on table public.enquiry_events to authenticated;

drop policy if exists "Admins can read enquiry events" on public.enquiry_events;
create policy "Admins can read enquiry events"
on public.enquiry_events for select
to authenticated
using ((select public.is_admin()));

revoke update on table public.enquiries from authenticated;
grant update (
  status,
  archived_at,
  priority,
  fit,
  next_action,
  next_action_due_at,
  opportunity_value_pence,
  expected_close_date,
  lost_reason
) on table public.enquiries to authenticated;

create or replace function public.record_enquiry_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_fields text[] := array[]::text[];
begin
  if tg_op = 'INSERT' then
    insert into public.enquiry_events (
      enquiry_id,
      actor_id,
      event_type,
      summary,
      metadata,
      created_at
    ) values (
      new.id,
      auth.uid(),
      'created',
      'Enquiry received',
      jsonb_build_object('form_name', new.form_name, 'enquiry_type', new.enquiry_type),
      new.created_at
    );
    return new;
  end if;

  if old.status is distinct from new.status then
    insert into public.enquiry_events (enquiry_id, actor_id, event_type, summary, metadata)
    values (
      new.id,
      auth.uid(),
      'status_changed',
      'Commercial stage changed to ' || initcap(replace(new.status::text, '_', ' ')),
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;

  if old.archived_at is null and new.archived_at is not null then
    insert into public.enquiry_events (enquiry_id, actor_id, event_type, summary, metadata)
    values (new.id, auth.uid(), 'archived', 'Enquiry archived', '{}'::jsonb);
  end if;

  if old.next_action is not null and new.next_action is null then
    insert into public.enquiry_events (enquiry_id, actor_id, event_type, summary, metadata)
    values (
      new.id,
      auth.uid(),
      'action_completed',
      left('Completed: ' || old.next_action, 300),
      jsonb_build_object('due_at', old.next_action_due_at)
    );
  end if;

  if old.priority is distinct from new.priority then changed_fields := array_append(changed_fields, 'priority'); end if;
  if old.fit is distinct from new.fit then changed_fields := array_append(changed_fields, 'fit'); end if;
  if old.next_action is distinct from new.next_action then changed_fields := array_append(changed_fields, 'next_action'); end if;
  if old.next_action_due_at is distinct from new.next_action_due_at then changed_fields := array_append(changed_fields, 'next_action_due_at'); end if;
  if old.opportunity_value_pence is distinct from new.opportunity_value_pence then changed_fields := array_append(changed_fields, 'opportunity_value_pence'); end if;
  if old.expected_close_date is distinct from new.expected_close_date then changed_fields := array_append(changed_fields, 'expected_close_date'); end if;
  if old.lost_reason is distinct from new.lost_reason then changed_fields := array_append(changed_fields, 'lost_reason'); end if;

  if cardinality(changed_fields) > 0 then
    insert into public.enquiry_events (enquiry_id, actor_id, event_type, summary, metadata)
    values (
      new.id,
      auth.uid(),
      'workflow_updated',
      'Commercial context updated',
      jsonb_build_object('fields', changed_fields)
    );
  end if;

  return new;
end;
$$;

create or replace function public.record_enquiry_note_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.enquiry_events (enquiry_id, actor_id, event_type, summary, metadata, created_at)
  values (
    new.enquiry_id,
    new.author_id,
    'note_added',
    'Internal note added',
    jsonb_build_object('note_id', new.id),
    new.created_at
  );
  return new;
end;
$$;

revoke all on function public.record_enquiry_event() from public, anon, authenticated;
revoke all on function public.record_enquiry_note_event() from public, anon, authenticated;

drop trigger if exists enquiries_record_event on public.enquiries;
create trigger enquiries_record_event
after insert or update on public.enquiries
for each row execute function public.record_enquiry_event();

drop trigger if exists enquiry_notes_record_event on public.enquiry_notes;
create trigger enquiry_notes_record_event
after insert on public.enquiry_notes
for each row execute function public.record_enquiry_note_event();

insert into public.enquiry_events (enquiry_id, actor_id, event_type, summary, metadata, created_at)
select
  enquiries.id,
  null,
  'created',
  'Enquiry received',
  jsonb_build_object('form_name', enquiries.form_name, 'enquiry_type', enquiries.enquiry_type),
  enquiries.created_at
from public.enquiries
where not exists (
  select 1
  from public.enquiry_events
  where enquiry_events.enquiry_id = enquiries.id
    and enquiry_events.event_type = 'created'
);

comment on table public.enquiry_events is 'Immutable activity history generated by database triggers for administrator-visible workflow changes.';
