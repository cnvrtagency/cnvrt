import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || 'https://cnvrtdigital.co.uk,http://127.0.0.1:4321,http://localhost:4321').split(',').map((value) => value.trim().replace(/\/$/, '')).filter(Boolean);
const headers = (origin: string) => ({ 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, OPTIONS', Vary: 'Origin' });
const reply = (body: Record<string, unknown>, status: number, origin: string) => new Response(JSON.stringify(body), { status, headers: headers(origin) });
const sha256 = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');

Deno.serve(async (request) => {
  const requestOrigin = (request.headers.get('origin') || '').replace(/\/$/, '');
  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
  if (request.method === 'OPTIONS') return allowedOrigins.includes(requestOrigin) ? reply({ ok: true }, 200, origin) : reply({ error: 'Origin not allowed.' }, 403, origin);
  if (!allowedOrigins.includes(requestOrigin)) return reply({ error: 'Origin not allowed.' }, 403, origin);
  if (request.method !== 'GET') return reply({ error: 'Method not allowed.' }, 405, origin);
  const token = new URL(request.url).searchParams.get('token')?.trim() || '';
  if (!/^[a-f0-9]{64}$/.test(token)) return reply({ error: 'This invoice link is invalid.' }, 401, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const secretKey = Deno.env.get('SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !secretKey) return reply({ error: 'The invoice service is not configured.' }, 503, origin);
  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from('invoices')
    .select('invoice_number,status,issue_date,due_date,client_name,client_company,line_items,subtotal_pence,vat_rate,vat_pence,total_pence,notes,payment_url,bank_details')
    .eq('token_hash', await sha256(token)).maybeSingle();
  if (error) return reply({ error: 'The invoice could not be loaded.' }, 500, origin);
  if (!data || data.status === 'void') return reply({ error: 'This invoice is no longer available.' }, 404, origin);
  return reply({ ok: true, invoice: data }, 200, origin);
});
