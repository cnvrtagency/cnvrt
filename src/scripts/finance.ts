import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type Client = { id: string; company_name: string; billing_address: string | null; imported_balance_pence: number; legacy_source: string | null };
type Invoice = { id: string; client_id: string | null; client_name: string; display_number: string; issue_date: string; invoice_state: 'draft' | 'invoiced' | 'void'; payment_state: 'paid' | 'overdue' | 'unpaid' | 'void'; total_pence: number; source: string };
type Payment = { id: string; client_id: string; payment_date: string; amount_pence: number; method: string | null; reference: string | null; source: string };
const query = <T extends Element>(root: ParentNode, selector: string) => root.querySelector<T>(selector);
const money = (pence: number, digits = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(pence / 100);
const date = (value: string) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
const label = (value: string) => value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const initialiseFinanceAdmin = () => {
  const root = document.querySelector<HTMLElement>('[data-finance-admin]');
  if (!root) return;
  const auth = query<HTMLElement>(root, '[data-auth-view]'); const workspace = query<HTMLElement>(root, '[data-workspace]');
  const form = query<HTMLFormElement>(root, '[data-login-form]'); const loginStatus = query<HTMLElement>(root, '[data-login-status]');
  const list = query<HTMLElement>(root, '[data-finance-list]'); const head = query<HTMLElement>(root, '[data-finance-head]');
  const search = query<HTMLInputElement>(root, '[data-finance-search]'); const statusFilter = query<HTMLSelectElement>(root, '[data-finance-status]');
  const periodSelect = query<HTMLSelectElement>(root, '[data-finance-period]');
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL?.trim(); const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();
  let client: SupabaseClient | null = null; let clients: Client[] = []; let invoices: Invoice[] = []; let payments: Payment[] = []; let view = 'invoices';
  const clientName = (id: string | null) => clients.find((record) => record.id === id)?.company_name || 'Client not linked';
  const showWorkspace = () => { if (auth) auth.hidden = true; if (workspace) workspace.hidden = false; };
  const showAuth = () => { if (auth) auth.hidden = false; if (workspace) workspace.hidden = true; };
  const metric = (name: string, value: string) => { const element = query<HTMLElement>(root, `[data-finance-metric="${name}"]`); if (element) element.textContent = value; };
  const selectedRange = () => {
    const now = new Date(); const period = periodSelect?.value || 'this-month'; let start: Date | null = null; let end: Date | null = null;
    if (period === 'this-month') { start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 1); }
    if (period === 'last-month') { start = new Date(now.getFullYear(), now.getMonth() - 1, 1); end = new Date(now.getFullYear(), now.getMonth(), 1); }
    if (period === 'this-quarter') { const quarter = Math.floor(now.getMonth() / 3) * 3; start = new Date(now.getFullYear(), quarter, 1); end = new Date(now.getFullYear(), quarter + 3, 1); }
    if (period === 'this-year') { start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear() + 1, 0, 1); }
    const iso = (value: Date | null) => value ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}` : null;
    return { start: iso(start), end: iso(end), label: periodSelect?.selectedOptions[0]?.textContent || 'This month' };
  };
  const inSelectedRange = (value: string) => { const range = selectedRange(); return (!range.start || value >= range.start) && (!range.end || value < range.end); };
  const periodInvoices = () => invoices.filter(({ issue_date }) => inSelectedRange(issue_date));
  const periodPayments = () => payments.filter(({ payment_date }) => inSelectedRange(payment_date));

  const renderMetrics = () => {
    const selectedInvoices = periodInvoices(); const selectedPayments = periodPayments();
    const issuedRecords = selectedInvoices.filter(({ invoice_state }) => invoice_state === 'invoiced');
    const issued = issuedRecords.reduce((sum, invoice) => sum + invoice.total_pence, 0);
    const received = selectedPayments.reduce((sum, payment) => sum + payment.amount_pence, 0);
    const outstanding = clients.reduce((sum, record) => sum + Math.max(0, record.imported_balance_pence || 0), 0);
    const credits = clients.reduce((sum, record) => sum + Math.abs(Math.min(0, record.imported_balance_pence || 0)), 0);
    metric('invoiced', money(issued)); metric('payments', money(received)); metric('outstanding', money(outstanding)); metric('credits', money(credits));
    const drafts = selectedInvoices.filter(({ invoice_state }) => invoice_state === 'draft').length;
    const invoiceCount = query<HTMLElement>(root, '[data-finance-count="invoices"]'); if (invoiceCount) invoiceCount.textContent = `${issuedRecords.length} invoiced${drafts ? ` · ${drafts} draft` : ''} · ${selectedRange().label}`;
    const paymentCount = query<HTMLElement>(root, '[data-finance-count="payments"]'); if (paymentCount) paymentCount.textContent = `${selectedPayments.length} payments · ${selectedRange().label}`;
  };

  const renderChart = () => {
    const chart = query<HTMLElement>(root, '[data-finance-chart]'); if (!chart) return;
    const months = new Map<string, { invoiced: number; paid: number }>();
    periodInvoices().filter(({ invoice_state }) => invoice_state === 'invoiced').forEach((invoice) => { const key = invoice.issue_date.slice(0, 7); const point = months.get(key) || { invoiced: 0, paid: 0 }; point.invoiced += invoice.total_pence; months.set(key, point); });
    periodPayments().forEach((payment) => { const key = payment.payment_date.slice(0, 7); const point = months.get(key) || { invoiced: 0, paid: 0 }; point.paid += payment.amount_pence; months.set(key, point); });
    const points = [...months.entries()].sort(([a], [b]) => a.localeCompare(b)); const largest = Math.max(1, ...points.flatMap(([, point]) => [point.invoiced, point.paid]));
    chart.innerHTML = points.length ? points.map(([month, point]) => `<div class="finance-chart__month" title="${money(point.invoiced, 2)} invoiced, ${money(point.paid, 2)} paid"><div><i data-series="invoice" style="height:${Math.max(2, point.invoiced / largest * 100)}%"></i><i data-series="payment" style="height:${Math.max(2, point.paid / largest * 100)}%"></i></div><span>${new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${month}-01T12:00:00`))}</span><small>${month.slice(2, 4)}</small></div>`).join('') : '<p class="finance-empty">No invoice or payment activity in this period.</p>';
    const periodLabel = query<HTMLElement>(root, '[data-finance-period-label]'); if (periodLabel) periodLabel.textContent = selectedRange().label;
  };

  const renderHealth = () => {
    const health = query<HTMLElement>(root, '[data-finance-health]'); if (!health) return;
    const rows = clients.filter(({ imported_balance_pence }) => imported_balance_pence !== 0).sort((a, b) => b.imported_balance_pence - a.imported_balance_pence);
    health.innerHTML = rows.map((record) => `<article data-state="${record.imported_balance_pence > 0 ? 'due' : 'credit'}"><div><strong>${record.company_name}</strong><span>${record.imported_balance_pence > 0 ? 'Outstanding balance' : 'Account credit'}</span></div><b>${money(Math.abs(record.imported_balance_pence), 2)}</b></article>`).join('') || '<p class="finance-empty">Every client account is balanced.</p>';
  };

  const renderLedger = () => {
    if (!list || !head) return; const term = search?.value.trim().toLowerCase() || '';
    list.dataset.view = view;
    statusFilter!.hidden = view !== 'invoices';
    if (view === 'invoices') {
      head.innerHTML = '<span>Date</span><span>Invoice</span><span>Client</span><span>Status</span><span>Amount</span>';
      const records = periodInvoices().filter((record) => (!term || `${record.display_number} ${record.client_name}`.toLowerCase().includes(term)) && (statusFilter?.value === 'all' || record.invoice_state === statusFilter?.value || record.payment_state === statusFilter?.value)).sort((a, b) => b.issue_date.localeCompare(a.issue_date));
      list.innerHTML = records.map((record) => { const href = record.source === 'uploaded' ? `/invoice/?legacy=${encodeURIComponent(record.id)}` : `/invoice/?admin=${encodeURIComponent(record.id)}`; const viewLabel = record.invoice_state === 'draft' ? 'Draft invoice · View' : record.source === 'uploaded' ? 'Uploaded invoice · View' : 'CNVRT invoice · View'; return `<article><time>${date(record.issue_date)}</time><strong><a href="${href}" target="_blank" rel="noreferrer" aria-label="View invoice ${record.display_number}">${record.display_number}</a><small>${viewLabel}</small></strong><span>${record.client_name}</span><div class="finance-invoice-states"><i data-status="${record.invoice_state}">${label(record.invoice_state)}</i>${record.invoice_state === 'invoiced' ? `<i data-status="${record.payment_state}">${label(record.payment_state)}</i>` : ''}</div><b>${money(record.total_pence, 2)}</b></article>`; }).join('') || '<p class="finance-empty">No matching invoices.</p>';
    } else if (view === 'payments') {
      head.innerHTML = '<span>Date</span><span>Reference</span><span>Client</span><span>Method</span><span>Amount</span>';
      const records = periodPayments().filter((record) => !term || `${record.reference || ''} ${clientName(record.client_id)}`.toLowerCase().includes(term)).sort((a, b) => b.payment_date.localeCompare(a.payment_date));
      list.innerHTML = records.map((record) => `<article><time>${date(record.payment_date)}</time><strong>${record.reference || 'Unallocated'}<small>${label(record.source)}</small></strong><span>${clientName(record.client_id)}</span><span>${record.method || 'Not recorded'}</span><b>${money(record.amount_pence, 2)}</b></article>`).join('') || '<p class="finance-empty">No matching payments.</p>';
    } else {
      head.innerHTML = '<span>Client</span><span>Source</span><span>Invoices</span><span>Payments</span><span>Balance</span>';
      const records = clients.filter((record) => !term || record.company_name.toLowerCase().includes(term)).sort((a, b) => a.company_name.localeCompare(b.company_name));
      list.innerHTML = records.map((record) => { const inv = periodInvoices().filter(({ client_id }) => client_id === record.id); const pay = periodPayments().filter(({ client_id }) => client_id === record.id); return `<article><strong>${record.company_name}<small>${record.billing_address || 'Address not supplied'}</small></strong><span>${label(record.legacy_source || 'CNVRT')}</span><span>${inv.length} · ${money(inv.reduce((sum, item) => sum + item.total_pence, 0))}</span><span>${pay.length} · ${money(pay.reduce((sum, item) => sum + item.amount_pence, 0))}</span><b data-balance="${record.imported_balance_pence > 0 ? 'due' : record.imported_balance_pence < 0 ? 'credit' : 'clear'}">${record.imported_balance_pence < 0 ? `${money(Math.abs(record.imported_balance_pence), 2)} credit` : money(record.imported_balance_pence, 2)}</b></article>`; }).join('') || '<p class="finance-empty">No matching clients.</p>';
    }
    const summary = query<HTMLElement>(root, '[data-finance-summary]'); if (summary) summary.textContent = `${periodInvoices().length} invoices and ${periodPayments().length} payments in ${selectedRange().label.toLowerCase()}; ${clients.length} clients overall.`;
  };

  const load = async () => {
    if (!client) return; const sync = query<HTMLElement>(root, '[data-sync-status]'); if (sync) sync.textContent = 'Refreshing finance data';
    const [clientResult, invoiceResult, paymentResult, cnvrtResult] = await Promise.all([
      client.from('clients').select('id,company_name,billing_address,imported_balance_pence,legacy_source').order('company_name'),
      client.from('finance_invoices').select('id,client_id,display_number,issue_date,status,platform_state,total_pence,source'),
      client.from('finance_payments').select('id,client_id,payment_date,amount_pence,method,reference,source'),
      client.from('invoices').select('id,client_name,client_company,invoice_number,issue_date,status,total_pence'),
    ]);
    const error = clientResult.error || invoiceResult.error || paymentResult.error || cnvrtResult.error; if (error) { if (sync) sync.textContent = error.message; return; }
    clients = (clientResult.data || []) as Client[];
    invoices = (invoiceResult.data || []).map((record) => ({ id: record.id, client_id: record.client_id, client_name: clientName(record.client_id), display_number: record.display_number, issue_date: record.issue_date, invoice_state: record.platform_state || 'invoiced', payment_state: record.status === 'paid' ? 'paid' : record.status === 'overdue' ? 'overdue' : 'unpaid', total_pence: record.total_pence, source: 'uploaded' })) as Invoice[];
    invoices.push(...(cnvrtResult.data || []).map((record) => ({ id: record.id, client_id: null, client_name: record.client_company || record.client_name, display_number: record.invoice_number, issue_date: record.issue_date, invoice_state: record.status === 'draft' ? 'draft' as const : record.status === 'void' ? 'void' as const : 'invoiced' as const, payment_state: record.status === 'paid' ? 'paid' as const : record.status === 'void' ? 'void' as const : 'unpaid' as const, total_pence: record.total_pence, source: 'cnvrt' })));
    payments = (paymentResult.data || []) as Payment[];
    renderMetrics(); renderChart(); renderHealth(); renderLedger(); if (sync) sync.textContent = `Synced ${new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date())}`;
  };

  form?.addEventListener('submit', async (event) => { event.preventDefault(); if (!client) return; const values = new FormData(form); const result = await client.auth.signInWithPassword({ email: String(values.get('email') || ''), password: String(values.get('password') || '') }); if (result.error) { if (loginStatus) loginStatus.textContent = 'The email or password was not accepted.'; return; } showWorkspace(); await load(); });
  query<HTMLButtonElement>(root, '[data-sign-out]')?.addEventListener('click', async () => { await client?.auth.signOut(); showAuth(); }); query<HTMLButtonElement>(root, '[data-refresh]')?.addEventListener('click', () => void load());
  query<HTMLElement>(root, '[data-finance-tabs]')?.addEventListener('click', (event) => { const button = (event.target as Element).closest<HTMLButtonElement>('[data-view]'); if (!button) return; view = button.dataset.view || 'invoices'; root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((item) => item.setAttribute('aria-pressed', String(item === button))); renderLedger(); });
  search?.addEventListener('input', renderLedger); statusFilter?.addEventListener('change', renderLedger);
  periodSelect?.addEventListener('change', () => { renderMetrics(); renderChart(); renderLedger(); });
  const boot = async () => { if (!supabaseUrl || !supabaseKey) { if (loginStatus) loginStatus.textContent = 'Supabase configuration is missing.'; return; } client = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } }); const session = await client.auth.getSession(); if (session.data.session) { showWorkspace(); await load(); } else showAuth(); };
  void boot();
};
