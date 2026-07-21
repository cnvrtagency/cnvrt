import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedFormNames = new Set(['homepage-enquiry', 'contact-enquiry', 'project-enquiry', 'audit-request', 'web-design-discovery']);
const allowedTypes = new Set(['homepage', 'contact', 'project', 'audit', 'discovery']);
const allowedStatuses = {
  service: new Set(['branding', 'web-design-ecommerce', 'web-design', 'shopify', 'paid-media', 'ecommerce-ppc', 'email-marketing', 'conversion-optimisation', 'analytics-tracking', 'website-support', 'seo-aeo', 'custom-development', 'custom-tools', 'not-sure']),
  projectType: new Set(['website', 'branding', 'shopify', 'migration', 'custom-development', 'custom-tool', 'other']),
  budget: new Set(['1000-3000', '3000-7500', '7500-15000', '15000-plus', 'not-sure']),
  auditArea: new Set(['website', 'branding', 'shopify', 'google-ads', 'ecommerce-ppc', 'meta-ads', 'email', 'cro', 'analytics', 'seo', 'aeo']),
  dataAccess: new Set(['yes', 'partial', 'no', 'not-sure']),
  discoveryBackground: new Set(['new-website', 'redesign', 'replacement']),
  discoveryGoal: new Set(['qualified-enquiries', 'online-sales', 'bookings', 'credibility', 'recruitment', 'information', 'operational-efficiency']),
  discoveryContent: new Set(['ready', 'some-ready', 'needs-support', 'starting-from-scratch']),
  discoveryBrand: new Set(['established', 'partial', 'rebrand-required', 'no-brand-system']),
  discoveryPlatform: new Set(['recommend', 'wordpress', 'shopify', 'custom', 'other']),
  discoveryAccess: new Set(['full', 'partial', 'none', 'not-sure']),
  discoveryFeatures: new Set(['ecommerce', 'booking', 'lead-forms', 'customer-accounts', 'search-filtering', 'third-party-integrations', 'multilingual', 'blog-resources', 'accessibility', 'other']),
};

const json = (body: Record<string, unknown>, status: number, origin: string) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, accept',
    'Vary': 'Origin',
  },
});

const text = (value: FormDataEntryValue | null, maximum: number) => String(value || '').trim().slice(0, maximum);
const optional = (value: string) => value || null;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isWebUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://cnvrtdigital.co.uk,http://127.0.0.1:4321,http://localhost:4321')
    .split(',')
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const responseOrigin = allowedOrigins.includes(origin.replace(/\/$/, '')) ? origin : allowedOrigins[0];

  if (request.method === 'OPTIONS') {
    if (!allowedOrigins.includes(origin.replace(/\/$/, ''))) return json({ error: 'Origin not allowed.' }, 403, responseOrigin);
    return json({ ok: true }, 200, responseOrigin);
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, responseOrigin);
  if (!allowedOrigins.includes(origin.replace(/\/$/, ''))) return json({ error: 'Origin not allowed.' }, 403, responseOrigin);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 64_000) return json({ error: 'Submission is too large.' }, 413, responseOrigin);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Invalid form submission.' }, 400, responseOrigin);
  }

  const honeypot = text(form.get('company-website-confirmation'), 200);
  const durationMs = Number.parseInt(text(form.get('form-duration-ms'), 12), 10);
  if (honeypot || (Number.isFinite(durationMs) && durationMs < 400)) {
    return json({ ok: true }, 202, responseOrigin);
  }

  const formName = text(form.get('form-name'), 80);
  const enquiryType = text(form.get('enquiry-type'), 40);
  const sourcePage = text(form.get('source-page'), 300) || '/';
  const name = text(form.get('name'), 120);
  const email = text(form.get('email'), 254).toLowerCase();
  const company = text(form.get('company'), 160);
  const website = text(form.get('website'), 500);
  const service = text(form.get('service'), 100);
  const projectType = text(form.get('project-type'), 100);
  const budget = text(form.get('budget'), 100);
  const timing = text(form.get('timing'), 240);
  const auditArea = text(form.get('audit-area'), 100);
  const dataAccess = text(form.get('data-access'), 100);
  const brief = enquiryType === 'discovery' ? text(form.get('main-result'), 2000) : text(form.get('brief'), 2000);
  const startedAtRaw = text(form.get('started-at'), 80);
  const questionnaireFields = ['main-result','priority-treatments','treatment-priority','patient-choice','competitor-sites','current-services-accuracy','treatment-changes','content-rewrite-approval','treatment-pricing','hair-finance','medical-accuracy-owner','clinic-locations','clinic-contact-details','consultation-formats','consultation-fees','online-appointments','direct-booking-scope','booking-payment','cancellation-rules','calendar-sync','booking-information','hair-photo-upload','automatic-messages','reminder-channels','enquiry-sources','patient-stages','admin-users','admin-capabilities','clinical-software','records-separation','available-media','before-after-volume','patient-permissions','result-clinical-info','google-reviews','professional-details','cqc-details','required-policies','personal-story','seo-locations','patient-questions','seo-article-selection','article-approver','platform-access','data-migration','final-approval','launch-dates','ongoing-content-owner'] as const;
  const discoveryData = enquiryType === 'discovery' ? Object.fromEntries(questionnaireFields.map((field) => [field.replaceAll('-', '_'), text(form.get(field), 2400)])) : null;

  if (!allowedFormNames.has(formName) || !allowedTypes.has(enquiryType)) return json({ error: 'Unknown enquiry form.' }, 400, responseOrigin);
  if (name.length < 2 || !isEmail(email) || brief.length < 10) return json({ error: 'Please complete the required fields.' }, 422, responseOrigin);
  if (website && !isWebUrl(website)) return json({ error: 'Please provide a valid website URL.' }, 422, responseOrigin);
  if (enquiryType === 'homepage' && !allowedStatuses.service.has(service)) return json({ error: 'Please select an area of support.' }, 422, responseOrigin);
  if (enquiryType === 'contact' && !allowedStatuses.service.has(service)) return json({ error: 'Please select a service.' }, 422, responseOrigin);
  if (enquiryType === 'project' && (!allowedStatuses.projectType.has(projectType) || !allowedStatuses.budget.has(budget))) return json({ error: 'Please complete the project details.' }, 422, responseOrigin);
  if (enquiryType === 'audit' && (!website || !allowedStatuses.auditArea.has(auditArea) || !allowedStatuses.dataAccess.has(dataAccess))) return json({ error: 'Please complete the audit details.' }, 422, responseOrigin);
  if (enquiryType === 'discovery') {
    const discoveryIsComplete = company && discoveryData && discoveryData.main_result.length >= 10;
    if (!discoveryIsComplete) return json({ error: 'Please complete the required discovery questions.' }, 422, responseOrigin);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const secretKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const rateLimitSalt = Deno.env.get('RATE_LIMIT_SALT');
  if (!supabaseUrl || !secretKey || !rateLimitSalt) return json({ error: 'Submission service is not configured.' }, 503, responseOrigin);

  const forwardedIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateKey = await sha256(`${rateLimitSalt}:${forwardedIp}:${email}`);
  const payloadHash = await sha256([formName, email, name.toLowerCase(), brief.toLowerCase(), JSON.stringify(discoveryData)].join('|'));
  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: allowed, error: rateError } = await supabase.rpc('check_enquiry_rate_limit', {
    p_rate_key: rateKey,
    p_max_attempts: 5,
    p_window_minutes: 60,
  });
  if (rateError) return json({ error: 'Submission could not be checked.' }, 503, responseOrigin);
  if (!allowed) return json({ error: 'Too many submissions. Please try again later.' }, 429, responseOrigin);

  const duplicateSince = new Date(Date.now() - 90_000).toISOString();
  const { data: duplicate } = await supabase
    .from('enquiries')
    .select('id')
    .eq('payload_hash', payloadHash)
    .gte('created_at', duplicateSince)
    .maybeSingle();
  if (duplicate) return json({ ok: true, duplicate: true }, 200, responseOrigin);

  const startedAt = startedAtRaw && !Number.isNaN(Date.parse(startedAtRaw)) ? new Date(startedAtRaw).toISOString() : null;
  const { data, error } = await supabase.from('enquiries').insert({
    form_name: formName,
    enquiry_type: enquiryType,
    source_page: sourcePage,
    name,
    email,
    company: optional(company),
    website: optional(website),
    service: optional(service),
    project_type: optional(projectType),
    budget: optional(budget),
    timing: optional(timing),
    audit_area: optional(auditArea),
    data_access: optional(dataAccess),
    brief,
    discovery_data: discoveryData,
    payload_hash: payloadHash,
    form_started_at: startedAt,
    form_duration_ms: Number.isFinite(durationMs) ? Math.max(0, Math.min(durationMs, 86_400_000)) : null,
  }).select('id').single();

  if (error) {
    console.error('Enquiry insert failed', { code: error.code });
    return json({ error: 'The enquiry could not be saved.' }, 500, responseOrigin);
  }

  return json({ ok: true, submissionId: data.id }, 201, responseOrigin);
});
