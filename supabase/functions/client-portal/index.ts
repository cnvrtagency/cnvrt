import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Content-Type': 'application/json; charset=utf-8',
  'Vary': 'Origin',
});

const response = (body: Record<string, unknown>, status: number, origin: string) =>
  new Response(JSON.stringify(body), { status, headers: cors(origin) });

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  const requestOrigin = (request.headers.get('origin') || '').replace(/\/$/, '');
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://cnvrtdigital.co.uk,http://127.0.0.1:4321,http://localhost:4321')
    .split(',').map((item) => item.trim().replace(/\/$/, '')).filter(Boolean);
  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

  if (request.method === 'OPTIONS') {
    return allowedOrigins.includes(requestOrigin) ? response({ ok: true }, 200, origin) : response({ error: 'Origin not allowed.' }, 403, origin);
  }
  if (!allowedOrigins.includes(requestOrigin)) return response({ error: 'Origin not allowed.' }, 403, origin);
  if (!['GET', 'POST'].includes(request.method)) return response({ error: 'Method not allowed.' }, 405, origin);

  const url = new URL(request.url);
  let token = url.searchParams.get('token')?.trim() || '';
  let payload: Record<string, unknown> = {};
  if (request.method === 'POST') {
    try {
      payload = await request.json();
      token = String(payload.token || '').trim();
    } catch {
      return response({ error: 'Invalid request.' }, 400, origin);
    }
  }
  if (!/^[a-f0-9]{64}$/.test(token)) return response({ error: 'This onboarding link is invalid.' }, 401, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const secretKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !secretKey) return response({ error: 'The portal is not configured.' }, 503, origin);
  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const tokenHash = await sha256(token);

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id,name,status,target_start_date,portal_enabled,clients(company_name,primary_contact_name),project_onboarding_items(id,position,title,guidance,owner,response_type,is_required,status,response_text,completed_at)')
    .eq('portal_token_hash', tokenHash)
    .maybeSingle();
  if (projectError) return response({ error: 'The onboarding workspace could not be loaded.' }, 500, origin);
  if (!project || !project.portal_enabled) return response({ error: 'This onboarding link is no longer active.' }, 401, origin);

  if (request.method === 'POST') {
    const itemId = String(payload.itemId || '');
    const responseText = String(payload.responseText || '').trim().slice(0, 4000);
    const complete = payload.complete === true;
    const items = Array.isArray(project.project_onboarding_items) ? project.project_onboarding_items : [];
    const item = items.find((candidate: { id?: string }) => candidate.id === itemId) as { id: string; owner: string; response_type: string } | undefined;
    if (!item || !['client', 'both'].includes(item.owner)) return response({ error: 'This onboarding item cannot be changed.' }, 403, origin);
    if (complete && item.response_type !== 'confirmation' && !responseText) return response({ error: 'Please add the requested information before completing this item.' }, 422, origin);

    const { error: updateError } = await supabase.from('project_onboarding_items').update({
      response_text: responseText || null,
      status: complete ? 'complete' : responseText ? 'in_progress' : 'pending',
      completed_at: complete ? new Date().toISOString() : null,
      completed_by: complete ? 'client' : null,
    }).eq('id', item.id).eq('project_id', project.id);
    if (updateError) return response({ error: 'Your update could not be saved.' }, 500, origin);

    await supabase.from('project_activity').insert({
      project_id: project.id,
      actor_type: 'client',
      event_type: 'item_updated',
      summary: complete ? 'Client completed an onboarding item' : 'Client updated an onboarding item',
      metadata: { item_id: item.id },
    });
  } else {
    await supabase.from('project_activity').insert({
      project_id: project.id,
      actor_type: 'client',
      event_type: 'portal_opened',
      summary: 'Client opened the onboarding portal',
    });
  }

  const { data: refreshed, error: refreshError } = await supabase
    .from('projects')
    .select('id,name,status,target_start_date,clients(company_name,primary_contact_name),project_onboarding_items(id,position,title,guidance,owner,response_type,is_required,status,response_text,completed_at)')
    .eq('id', project.id).single();
  if (refreshError) return response({ error: 'Your update was saved but the workspace could not be refreshed.' }, 500, origin);

  const items = (refreshed.project_onboarding_items || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position);
  const required = items.filter((item: { is_required: boolean }) => item.is_required);
  const completed = required.filter((item: { status: string }) => item.status === 'complete').length;
  return response({
    ok: true,
    project: {
      id: refreshed.id,
      name: refreshed.name,
      status: refreshed.status,
      targetStartDate: refreshed.target_start_date,
      client: refreshed.clients,
      progress: required.length ? Math.round((completed / required.length) * 100) : 100,
      completed,
      total: required.length,
      items,
    },
  }, 200, origin);
});
