import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://cnvrtdigital.co.uk,http://127.0.0.1:4321,http://localhost:4321').split(',').map((value) => value.trim().replace(/\/$/, '')).filter(Boolean);
const headers = (origin: string) => ({ 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type, accept', Vary: 'Origin' });
const reply = (body: Record<string, unknown>, status: number, origin: string) => new Response(JSON.stringify(body), { status, headers: headers(origin) });
const text = (form: FormData, name: string, maximum: number) => String(form.get(name) || '').trim().slice(0, maximum);
const sha256 = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const questionnaireFields = ['main-result','patient-audience','priority-treatments','treatment-priority','patient-choice','competitor-sites','visual-direction','current-services-accuracy','treatment-changes','content-rewrite-approval','treatment-pricing','hair-finance','medical-accuracy-owner','clinic-locations','clinic-contact-details','consultation-formats','consultation-fees','online-appointments','direct-booking-scope','booking-payment','cancellation-rules','calendar-sync','booking-information','hair-photo-upload','automatic-messages','reminder-channels','enquiry-sources','patient-stages','admin-users','admin-capabilities','clinical-software','records-separation','available-media','before-after-volume','patient-permissions','result-clinical-info','google-reviews','professional-details','cqc-details','required-policies','personal-story','seo-locations','patient-questions','seo-article-selection','article-approver','platform-access','data-migration','final-approval','launch-dates','ongoing-content-owner'] as const;

Deno.serve(async (request) => {
  const requestOrigin = (request.headers.get('origin') || '').replace(/\/$/, '');
  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
  if (request.method === 'OPTIONS') return allowedOrigins.includes(requestOrigin) ? reply({ ok: true }, 200, origin) : reply({ error: 'Origin not allowed.' }, 403, origin);
  if (!allowedOrigins.includes(requestOrigin)) return reply({ error: 'Origin not allowed.' }, 403, origin);
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const secretKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !secretKey) return reply({ error: 'Questionnaire service is not configured.' }, 503, origin);
  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });

  let token = new URL(request.url).searchParams.get('token')?.trim() || '';
  let form: FormData | null = null;
  if (request.method === 'POST') { try { form = await request.formData(); token = text(form, 'discovery-token', 128); } catch { return reply({ error: 'Invalid questionnaire submission.' }, 400, origin); } }
  if (!/^[a-f0-9]{64}$/.test(token)) return reply({ error: 'This questionnaire link is invalid.' }, 401, origin);
  const tokenHash = await sha256(token);
  const { data: invite, error: inviteError } = await supabase.from('discovery_invites').select('id,enquiry_id,completed_at,revoked_at,draft_data,draft_updated_at,enquiries(id,name,email,company,website,status)').eq('token_hash', tokenHash).maybeSingle();
  if (inviteError) return reply({ error: 'The questionnaire could not be loaded.' }, 500, origin);
  if (!invite || invite.revoked_at) return reply({ error: 'This questionnaire link is no longer active.' }, 401, origin);
  const enquiry = invite.enquiries as unknown as { id: string; name: string; email: string; company: string | null; website: string | null; status: string };

  if (request.method === 'GET') return reply({ ok: true, completed: Boolean(invite.completed_at), draft: invite.draft_data || {}, draftUpdatedAt: invite.draft_updated_at, enquiry: { name: enquiry.name, email: enquiry.email.startsWith('pending+') ? '' : enquiry.email, company: enquiry.company || '', website: enquiry.website || '' } }, 200, origin);
  if (request.method !== 'POST' || !form) return reply({ error: 'Method not allowed.' }, 405, origin);

  const name = text(form, 'name', 120), email = text(form, 'email', 254).toLowerCase(), company = text(form, 'company', 160), website = text(form, 'website', 500);
  const discovery = Object.fromEntries(questionnaireFields.map((field) => [field.replaceAll('-', '_'), text(form, field, 2400)]));
  const draft = { name, email, company, website, ...discovery };
  if (text(form, 'submission-mode', 20) === 'draft') {
    const { error: draftError } = await supabase.from('discovery_invites').update({ draft_data: draft, draft_updated_at: new Date().toISOString() }).eq('id', invite.id);
    return draftError ? reply({ error: 'The secure draft could not be saved.' }, 500, origin) : reply({ ok: true, draftSaved: true }, 200, origin);
  }
  const brief = discovery.main_result;
  const complete = name.length >= 2 && validEmail(email) && company.length >= 2 && brief.length >= 10;
  if (!complete) return reply({ error: 'Please complete every required discovery question.' }, 422, origin);

  const { error: updateError } = await supabase.from('enquiries').update({ name, email, company, website: website || null, brief, discovery_data: discovery, status: enquiry.status === 'new' ? 'contacted' : enquiry.status, next_action: 'Review completed discovery questionnaire', next_action_due_at: new Date().toISOString() }).eq('id', enquiry.id);
  if (updateError) return reply({ error: 'The discovery response could not be saved.' }, 500, origin);
  await supabase.from('discovery_invites').update({ completed_at: new Date().toISOString() }).eq('id', invite.id);
  return reply({ ok: true, enquiryId: enquiry.id }, 200, origin);
});
