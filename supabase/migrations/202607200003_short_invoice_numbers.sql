alter table public.invoices
drop constraint if exists invoices_invoice_number_check;

alter table public.invoices
add constraint invoices_invoice_number_check
check (invoice_number ~ '^[A-Z0-9][A-Z0-9-]{2,24}$');

create or replace function public.generate_invoice_number()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate text;
begin
  perform pg_advisory_xact_lock(hashtext('cnvrt-invoice-number'));
  loop
    candidate := 'CNVRT-' || lpad(floor(random() * 10000)::integer::text, 4, '0');
    exit when not exists (select 1 from public.invoices where invoice_number = candidate);
  end loop;
  return candidate;
end;
$$;

alter table public.invoices
alter column invoice_number set default public.generate_invoice_number();

create or replace function public.save_enquiry_invoice(
  p_enquiry_id uuid, p_invoice_id uuid, p_status text, p_issue_date date, p_due_date date,
  p_client_name text, p_client_email text, p_client_company text, p_line_items jsonb,
  p_vat_rate numeric, p_notes text, p_payment_url text
)
returns table (invoice_id uuid, invoice_number text, invoice_token text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_invoice public.invoices%rowtype;
  raw_token text;
  calculated_subtotal bigint;
  calculated_vat bigint;
  calculated_total bigint;
  generated_number text;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if p_status not in ('draft', 'sent', 'paid', 'void') then raise exception 'Invalid invoice status'; end if;
  if p_due_date < p_issue_date then raise exception 'Due date cannot be before issue date'; end if;
  if jsonb_typeof(p_line_items) <> 'array' or jsonb_array_length(p_line_items) < 1 then raise exception 'Add at least one invoice item'; end if;

  select coalesce(sum(
    greatest(1, least(10000, coalesce((item->>'quantity')::integer, 1)))
    * greatest(0, least(1000000000, coalesce((item->>'unit_pence')::bigint, 0)))
  ), 0)::bigint into calculated_subtotal
  from jsonb_array_elements(p_line_items) item;
  calculated_vat := round(calculated_subtotal * greatest(0, least(100, coalesce(p_vat_rate, 0))) / 100.0);
  calculated_total := calculated_subtotal + calculated_vat;
  raw_token := encode(extensions.gen_random_bytes(32), 'hex');

  if p_invoice_id is null then
    generated_number := public.generate_invoice_number();
    insert into public.invoices (
      enquiry_id, invoice_number, status, issue_date, due_date, client_name, client_email, client_company,
      line_items, subtotal_pence, vat_rate, vat_pence, total_pence, notes, payment_url, token_hash, sent_at, paid_at
    ) values (
      p_enquiry_id, generated_number, p_status, p_issue_date, p_due_date, trim(p_client_name), lower(trim(p_client_email)), nullif(trim(p_client_company), ''),
      p_line_items, calculated_subtotal, p_vat_rate, calculated_vat, calculated_total, nullif(trim(p_notes), ''), nullif(trim(p_payment_url), ''),
      encode(extensions.digest(raw_token, 'sha256'), 'hex'), case when p_status = 'sent' then now() else null end, case when p_status = 'paid' then now() else null end
    ) returning * into selected_invoice;
  else
    update public.invoices set
      status = p_status, issue_date = p_issue_date, due_date = p_due_date, client_name = trim(p_client_name), client_email = lower(trim(p_client_email)),
      client_company = nullif(trim(p_client_company), ''), line_items = p_line_items, subtotal_pence = calculated_subtotal,
      vat_rate = p_vat_rate, vat_pence = calculated_vat, total_pence = calculated_total, notes = nullif(trim(p_notes), ''),
      payment_url = nullif(trim(p_payment_url), ''), token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex'),
      sent_at = case when p_status = 'sent' then coalesce(sent_at, now()) else sent_at end,
      paid_at = case when p_status = 'paid' then coalesce(paid_at, now()) else null end
    where id = p_invoice_id and enquiry_id = p_enquiry_id returning * into selected_invoice;
    if not found then raise exception 'Invoice not found'; end if;
  end if;

  return query select selected_invoice.id, selected_invoice.invoice_number, raw_token;
end;
$$;
