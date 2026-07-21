alter table public.enquiries
  drop constraint if exists enquiries_enquiry_type_check;

alter table public.enquiries
  add constraint enquiries_enquiry_type_check
  check (enquiry_type in ('homepage', 'contact', 'project', 'audit', 'discovery'));

alter table public.enquiries
  add column if not exists discovery_data jsonb;

alter table public.enquiries
  drop constraint if exists enquiries_discovery_data_object;

alter table public.enquiries
  add constraint enquiries_discovery_data_object
  check (discovery_data is null or jsonb_typeof(discovery_data) = 'object');

comment on column public.enquiries.discovery_data is 'Structured answers submitted through a client discovery questionnaire.';
