create table if not exists public.document_templates (
  id uuid primary key default gen_random_uuid(), template_key text not null unique, name text not null,
  description text not null default '', document_type text not null default 'proposal', version integer not null default 1 check (version > 0),
  storage_path text, codex_instructions text not null default '', is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(), template_id uuid references public.document_templates(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null, enquiry_id uuid references public.enquiries(id) on delete set null,
  title text not null, document_type text not null default 'proposal', status text not null default 'draft' check (status in ('draft','ready','sent','accepted','superseded')),
  version integer not null default 1 check (version > 0), storage_path text, source_filename text,
  generation_brief jsonb not null default '{}'::jsonb, created_by uuid default auth.uid(), sent_at timestamptz, accepted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.document_templates enable row level security;
alter table public.client_documents enable row level security;
create policy "Staff manage document templates" on public.document_templates for all to authenticated using (true) with check (true);
create policy "Staff manage client documents" on public.client_documents for all to authenticated using (true) with check (true);
insert into storage.buckets (id, name, public) values ('client-documents', 'client-documents', false) on conflict (id) do update set public = false;
create policy "Staff read document files" on storage.objects for select to authenticated using (bucket_id = 'client-documents');
create policy "Staff upload document files" on storage.objects for insert to authenticated with check (bucket_id = 'client-documents');
create policy "Staff update document files" on storage.objects for update to authenticated using (bucket_id = 'client-documents') with check (bucket_id = 'client-documents');
insert into public.document_templates (template_key,name,description,document_type,version,storage_path,codex_instructions) values (
  'website-proposal','Website proposal','Formal CNVRT proposal with scope, delivery, investment and agreement.','proposal',1,
  'templates/cnvrt-website-proposal-template-v1.docx',
  'Use the attached CNVRT template as the structural and visual source. Replace every bracketed field using the client CRM record, approved discovery answers and agreed commercial terms. Preserve the logo, typography, spacing, page furniture and agreement section. Do not invent factual claims, credentials, pricing, dates or deliverables. Flag missing information clearly. Return an editable DOCX and a visually verified PDF.'
) on conflict (template_key) do update set name=excluded.name,description=excluded.description,codex_instructions=excluded.codex_instructions,updated_at=now();
create index if not exists client_documents_client_idx on public.client_documents(client_id, updated_at desc);
