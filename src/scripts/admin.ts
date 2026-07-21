import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'spam';
type EnquiryPriority = 'low' | 'normal' | 'high';
type EnquiryFit = 'unreviewed' | 'strong' | 'possible' | 'unsuitable';

type Enquiry = {
  id: string;
  created_at: string;
  updated_at: string;
  form_name: string;
  enquiry_type: string;
  source_page: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  service: string | null;
  project_type: string | null;
  budget: string | null;
  timing: string | null;
  audit_area: string | null;
  data_access: string | null;
  brief: string;
  discovery_data: Record<string, unknown> | null;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  fit: EnquiryFit;
  next_action: string | null;
  next_action_due_at: string | null;
  opportunity_value_pence: number | null;
  expected_close_date: string | null;
  lost_reason: string | null;
  archived_at: string | null;
};

type EnquiryNote = {
  id: string;
  enquiry_id: string;
  body: string;
  created_at: string;
  author_id: string;
};

type EnquiryEvent = {
  id: string;
  enquiry_id: string;
  actor_id: string | null;
  event_type: 'created' | 'status_changed' | 'workflow_updated' | 'action_completed' | 'note_added' | 'archived';
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type InvoiceLineItem = { description: string; quantity: number; unit_pence: number };
type InvoiceBankDetails = { account_name?: string; sort_code?: string; account_number?: string; reference?: string };
type Invoice = {
  id: string;
  enquiry_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'void';
  issue_date: string;
  due_date: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  line_items: InvoiceLineItem[];
  vat_rate: number;
  notes: string | null;
  payment_url: string | null;
  bank_details: InvoiceBankDetails | null;
  total_pence: number;
};

const statusLabels: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
  spam: 'Spam',
};

const fieldLabels: Record<string, string> = {
  company: 'Company',
  website: 'Website',
  service: 'Service',
  project_type: 'Project type',
  budget: 'Budget',
  timing: 'Timing',
  audit_area: 'Audit area',
  data_access: 'Existing access',
  source_page: 'Source page',
};

const discoveryFieldLabels: Record<string, string> = {
  main_result: 'Main website result', priority_treatments: 'Five priority treatments', treatment_priority: 'Hair restoration or aesthetics priority', patient_choice: 'Why patients choose the clinic', competitor_sites: 'Competitors and website references',
  current_services_accuracy: 'Accuracy of current services', treatment_changes: 'Treatments being introduced or removed', content_rewrite_approval: 'Permission to restructure and rewrite', treatment_pricing: 'Publishing treatment prices', hair_finance: 'Hair transplant finance', medical_accuracy_owner: 'Medical accuracy approver',
  clinic_locations: 'Active clinics and treatments', clinic_contact_details: 'Addresses, hours and public contact details', consultation_formats: 'Consultation formats', consultation_fees: 'Consultation fees',
  online_appointments: 'Appointments available online', direct_booking_scope: 'Consultation or treatment booking', booking_payment: 'Booking payment or deposit', cancellation_rules: 'Cancellation and rescheduling', calendar_sync: 'Calendar synchronisation', booking_information: 'Patient booking information', hair_photo_upload: 'Hair patient photo uploads', automatic_messages: 'Automatic booking messages', reminder_channels: 'Reminder channels',
  enquiry_sources: 'Enquiry sources', patient_stages: 'Patient pipeline stages', admin_users: 'Admin users', admin_capabilities: 'Admin panel capabilities', clinical_software: 'Clinical record software', records_separation: 'Website and clinical record separation',
  available_media: 'Available photography and video', before_after_volume: 'Available before-and-after cases', patient_permissions: 'Patient permissions', result_clinical_info: 'Clinical result information', google_reviews: 'Google reviews',
  professional_details: 'Professional details', cqc_details: 'CQC details', required_policies: 'Required policies', personal_story: 'Personal hair-transplant and career story',
  seo_locations: 'SEO target locations', patient_questions: 'Frequently asked patient questions', seo_article_selection: 'Initial SEO article selection', article_approver: 'Article approver',
  platform_access: 'Website and marketing access', data_migration: 'Data migration', final_approval: 'Final design and content approval', launch_dates: 'Launch dates and campaigns', ongoing_content_owner: 'Ongoing content owner',
};

const discoveryEnumFields = new Set<string>();

const query = <T extends Element>(root: ParentNode, selector: string) => root.querySelector<T>(selector);
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character));

const formatLabel = (value: string) => value
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, (character) => character.toUpperCase());

const budgetLabels: Record<string, string> = {
  '1000-3000': '£1,000 to £3,000',
  '3000-7500': '£3,000 to £7,500',
  '7500-15000': '£7,500 to £15,000',
  '15000-plus': '£15,000+',
  unsure: 'Not sure yet',
};

const formatDate = (value: string, includeTime = true) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
}).format(new Date(value));

const formatMoney = (pence: number | null, compact = false) => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
  ...(compact ? { notation: 'compact' as const } : {}),
}).format((pence || 0) / 100);

const formatInvoiceMoney = (pence: number) => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(pence / 100);

const terminalStatuses = new Set<EnquiryStatus>(['won', 'lost', 'spam']);
const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
const endOfToday = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};
const isOverdue = (enquiry: Enquiry) => Boolean(enquiry.next_action_due_at)
  && new Date(enquiry.next_action_due_at!).getTime() < startOfToday().getTime()
  && !terminalStatuses.has(enquiry.status);
const isDueToday = (enquiry: Enquiry) => Boolean(enquiry.next_action_due_at)
  && new Date(enquiry.next_action_due_at!).getTime() >= startOfToday().getTime()
  && new Date(enquiry.next_action_due_at!).getTime() <= endOfToday().getTime()
  && !terminalStatuses.has(enquiry.status);

const toDateTimeLocal = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
};

const relativeDate = (value: string) => {
  const difference = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 8) return `${days}d ago`;
  return formatDate(value, false);
};

const safeCsvCell = (value: unknown) => {
  let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};

const demoEnquiries = (): Enquiry[] => {
  const now = Date.now();
  const record = (values: Partial<Enquiry> & Pick<Enquiry, 'id' | 'name' | 'email' | 'brief' | 'status'>, age: number): Enquiry => ({
    created_at: new Date(now - age).toISOString(),
    updated_at: new Date(now - age).toISOString(),
    form_name: 'contact-enquiry',
    enquiry_type: 'contact',
    source_page: '/contact/',
    company: null,
    website: null,
    service: null,
    project_type: null,
    budget: null,
    timing: null,
    audit_area: null,
    data_access: null,
    discovery_data: null,
    priority: 'normal',
    fit: 'unreviewed',
    next_action: null,
    next_action_due_at: null,
    opportunity_value_pence: null,
    expected_close_date: null,
    lost_reason: null,
    archived_at: null,
    ...values,
  });
  return [
    record({
      id: '797c117d-0ea5-4be1-9e71-000000000001',
      name: 'Olivia Bennett',
      email: 'olivia@example.co.uk',
      company: 'Bennett & Rowe',
      website: 'https://example.co.uk',
      service: 'web-design',
      project_type: 'website',
      budget: '7500-15000',
      timing: 'Launch within twelve weeks',
      brief: 'Create a more credible website that explains the consultancy clearly and turns the right visitors into qualified conversations.',
      status: 'new',
      priority: 'high',
      enquiry_type: 'discovery',
      form_name: 'web-design-discovery',
      source_page: '/web-design-discovery/',
      discovery_data: {
        business_summary: 'A specialist commercial consultancy working with established owner-managed businesses across the UK.',
        audience: 'Managing directors and commercial leaders who have outgrown informal processes and need clearer strategic support.',
        audience_location: 'UK-wide',
        primary_offer: 'Retained commercial advisory and focused transformation projects.',
        project_background: 'replacement',
        current_site_problems: 'The current site feels generic, is difficult to update and does not explain the difference between the two core offers.',
        primary_goal: 'qualified-enquiries',
        success_measures: 'More suitable discovery calls and stronger confidence among referred prospects before they make contact.',
        required_pages: 'Home, About, Advisory, Transformation Projects, Insights and Contact.',
        features: ['lead-forms', 'blog-resources', 'third-party-integrations'],
        content_status: 'some-ready',
        brand_status: 'partial',
        visual_direction: 'Assured, intelligent and calm. More editorial than corporate.',
        platform_preference: 'recommend',
        integrations: 'HubSpot, Calendly and GA4.',
        domain_access: 'full',
        decision_makers: 'Managing director has final approval. Operations director will review content.',
      },
    }, 8 * 60_000),
    record({ id: '3c335a42-55b4-4ce3-9882-111111111111', name: 'Amelia Hart', email: 'amelia@example.co.uk', company: 'North & Field', service: 'web-design', brief: 'The current website no longer reflects the business or gives prospective clients a clear route into the right service.', status: 'new', priority: 'high' }, 18 * 60_000),
    record({ id: '6ac5ea02-6627-42bb-b56c-222222222222', name: 'Lewis Moore', email: 'lewis@example.co.uk', company: 'Civic Supply', service: 'shopify', brief: 'We need to move a growing catalogue into Shopify and protect the organic traffic attached to existing category pages.', status: 'contacted', enquiry_type: 'project', form_name: 'project-enquiry', project_type: 'migration', budget: '7500-15000', website: 'https://example.co.uk', source_page: '/submit-a-project/', priority: 'high', fit: 'possible', next_action: 'Send the migration discovery questions', next_action_due_at: new Date(now - 24 * 60 * 60_000).toISOString(), opportunity_value_pence: 1200000, expected_close_date: new Date(now + 18 * 24 * 60 * 60_000).toISOString().slice(0, 10) }, 5 * 60 * 60_000),
    record({ id: 'f1e87514-54e2-4702-a804-333333333333', name: 'Priya Shah', email: 'priya@example.co.uk', company: 'Form Studio', service: 'google-ads', brief: 'Paid search is producing leads but the quality and commercial outcome are difficult to see in the current reporting.', status: 'qualified', enquiry_type: 'audit', form_name: 'audit-request', audit_area: 'google-ads', data_access: 'yes', website: 'https://example.com', source_page: '/request-an-audit/', fit: 'strong', next_action: 'Confirm audit review call', next_action_due_at: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), opportunity_value_pence: 400000, expected_close_date: new Date(now + 10 * 24 * 60 * 60_000).toISOString().slice(0, 10) }, 28 * 60 * 60_000),
    record({ id: '185519f2-12dc-4e35-89a8-444444444444', name: 'Daniel Reed', email: 'daniel@example.co.uk', company: 'Kindred Living', service: 'email-marketing', brief: 'The ecommerce store has useful first-party data but very little automation after a customer places their first order.', status: 'proposal', fit: 'strong', next_action: 'Follow up on the proposal', next_action_due_at: new Date(now + 2 * 24 * 60 * 60_000).toISOString(), opportunity_value_pence: 2000000, expected_close_date: new Date(now + 14 * 24 * 60 * 60_000).toISOString().slice(0, 10) }, 4 * 24 * 60 * 60_000),
    record({ id: 'e18a11a4-dd53-49f4-9f52-555555555555', name: 'Sophie King', email: 'sophie@example.co.uk', company: 'Arc Workshop', service: 'branding', brief: 'A new identity and website are needed before the business expands into a second location later this year.', status: 'won', fit: 'strong', opportunity_value_pence: 800000 }, 9 * 24 * 60 * 60_000),
  ];
};

export const initialiseAdmin = () => {
  const root = document.querySelector<HTMLElement>('[data-admin-root]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const authView = query<HTMLElement>(root, '[data-auth-view]');
  const workspace = query<HTMLElement>(root, '[data-workspace]');
  const loginForm = query<HTMLFormElement>(root, '[data-login-form]');
  const loginStatus = query<HTMLElement>(root, '[data-login-status]');
  const configWarning = query<HTMLElement>(root, '[data-config-warning]');
  const list = query<HTMLElement>(root, '[data-enquiry-list]');
  const search = query<HTMLInputElement>(root, '[data-search]');
  const dialog = query<HTMLDialogElement>(root, '[data-detail-dialog]');
  const createDialog = query<HTMLDialogElement>(root, '[data-create-dialog]');
  const createForm = query<HTMLFormElement>(root, '[data-create-form]');
  const noteForm = query<HTMLFormElement>(root, '[data-note-form]');
  const configured = root.dataset.configured === 'true';
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();

  let client: SupabaseClient | null = null;
  let user: User | null = null;
  let enquiries: Enquiry[] = [];
  let currentFilter = 'all';
  let activeEnquiry: Enquiry | null = null;
  let activeInvoice: Invoice | null = null;
  const previewNotes = new Map<string, EnquiryNote[]>();
  const previewEvents = new Map<string, EnquiryEvent[]>();
  const previewMode = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get('admin-preview') === '1';
  const todayDate = query<HTMLElement>(root, '[data-today-date]');
  if (todayDate) todayDate.textContent = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  const setLoginStatus = (message: string, state: 'error' | 'idle' = 'idle') => {
    if (!loginStatus) return;
    loginStatus.textContent = message;
    loginStatus.dataset.state = state;
  };

  const setSyncStatus = (message: string) => {
    const status = query<HTMLElement>(root, '[data-sync-status]');
    if (status) status.textContent = message;
  };

  const showAuth = () => {
    if (authView) authView.hidden = false;
    if (workspace) workspace.hidden = true;
  };

  const showWorkspace = () => {
    if (authView) authView.hidden = true;
    if (workspace) workspace.hidden = false;
  };

  const visibleEnquiries = () => {
    const term = search?.value.trim().toLowerCase() || '';
    return enquiries.filter((enquiry) => {
      const matchesStatus = currentFilter === 'all'
        || (currentFilter === 'discovery' ? enquiry.enquiry_type === 'discovery' : enquiry.status === currentFilter);
      const haystack = [enquiry.name, enquiry.email, enquiry.company, enquiry.brief, enquiry.service, enquiry.project_type, JSON.stringify(enquiry.discovery_data || {})]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!term || haystack.includes(term));
    });
  };

  const renderMetrics = () => {
    const open = enquiries.filter(({ status }) => !terminalStatuses.has(status));
    const values: Record<string, string> = {
      overdue: String(open.filter(isOverdue).length).padStart(2, '0'),
      due: String(open.filter(isDueToday).length).padStart(2, '0'),
      new: String(open.filter(({ status }) => status === 'new').length).padStart(2, '0'),
      pipeline: formatMoney(open.reduce((total, enquiry) => total + (enquiry.opportunity_value_pence || 0), 0), true),
    };
    Object.entries(values).forEach(([name, value]) => {
      const element = query<HTMLElement>(root, `[data-metric="${name}"]`);
      if (element) element.textContent = value;
    });
  };

  const renderPipeline = () => {
    const stages: EnquiryStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won'];
    const stageTotals = stages.map((stage) => {
      const records = enquiries.filter(({ status }) => status === stage);
      return {
        stage,
        count: records.length,
        value: records.reduce((total, enquiry) => total + (enquiry.opportunity_value_pence || 0), 0),
      };
    });
    const largestStage = Math.max(1, ...stageTotals.map(({ count }) => count));

    stageTotals.forEach(({ stage, count, value }) => {
      const row = query<HTMLElement>(root, `[data-stage="${stage}"]`);
      if (!row) return;
      const countElement = query<HTMLElement>(row, '[data-stage-count]');
      const valueElement = query<HTMLElement>(row, '[data-stage-value]');
      const bar = query<HTMLElement>(row, '[data-stage-bar]');
      if (countElement) countElement.textContent = String(count).padStart(2, '0');
      if (valueElement) valueElement.textContent = formatMoney(value, true);
      if (bar) bar.style.width = count ? `${Math.max(18, (count / largestStage) * 100)}%` : '0%';
    });
  };

  const renderToday = () => {
    const todayList = query<HTMLElement>(root, '[data-today-list]');
    const summary = query<HTMLElement>(root, '[data-today-summary]');
    const active = enquiries.filter(({ status }) => !terminalStatuses.has(status));
    const attention = active
      .filter((enquiry) => isOverdue(enquiry) || isDueToday(enquiry) || enquiry.status === 'new' || !enquiry.next_action)
      .sort((a, b) => {
        const urgency = (enquiry: Enquiry) => isOverdue(enquiry) ? 0 : isDueToday(enquiry) ? 1 : enquiry.status === 'new' ? 2 : 3;
        const difference = urgency(a) - urgency(b);
        if (difference) return difference;
        if (a.priority !== b.priority) return a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0;
        return new Date(a.next_action_due_at || a.created_at).getTime() - new Date(b.next_action_due_at || b.created_at).getTime();
      });

    if (summary) {
      summary.textContent = attention.length
        ? `${attention.length} ${attention.length === 1 ? 'conversation needs' : 'conversations need'} a decision or action.`
        : 'Nothing is overdue and every active enquiry has a clear next move.';
    }
    if (!todayList) return;
    todayList.replaceChildren();

    if (!attention.length) {
      const empty = document.createElement('div');
      empty.className = 'admin-today__empty';
      empty.innerHTML = '<span>Clear</span><strong>No enquiry needs attention today.</strong>';
      todayList.append(empty);
      return;
    }

    attention.forEach((enquiry) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'admin-today-row';
      button.dataset.enquiryId = enquiry.id;
      const state = isOverdue(enquiry) ? 'overdue' : isDueToday(enquiry) ? 'due' : enquiry.status === 'new' ? 'new' : 'unplanned';
      button.dataset.state = state;
      button.innerHTML = '<span class="admin-today-row__state"></span><span class="admin-today-row__contact"><b></b><small></small></span><span class="admin-today-row__action"><b></b><small></small></span><span class="admin-today-row__value"></span><span class="admin-today-row__open" aria-hidden="true">↗</span>';
      query<HTMLElement>(button, '.admin-today-row__state')!.textContent = state === 'overdue' ? 'Overdue' : state === 'due' ? 'Due today' : state === 'new' ? 'New enquiry' : 'No next action';
      query<HTMLElement>(button, '.admin-today-row__contact b')!.textContent = enquiry.name;
      query<HTMLElement>(button, '.admin-today-row__contact small')!.textContent = enquiry.company || enquiry.email;
      query<HTMLElement>(button, '.admin-today-row__action b')!.textContent = enquiry.next_action || 'Decide the next commercial action';
      query<HTMLElement>(button, '.admin-today-row__action small')!.textContent = enquiry.next_action_due_at
        ? `${formatDate(enquiry.next_action_due_at)} · ${formatLabel(enquiry.priority)} priority`
        : `${statusLabels[enquiry.status]} · ${formatLabel(enquiry.priority)} priority`;
      query<HTMLElement>(button, '.admin-today-row__value')!.textContent = enquiry.opportunity_value_pence
        ? formatMoney(enquiry.opportunity_value_pence)
        : 'Value not set';
      button.addEventListener('click', () => openDetail(enquiry.id));
      todayList.append(button);
    });
  };

  const renderList = () => {
    if (!list) return;
    const records = visibleEnquiries();
    list.replaceChildren();

    if (!records.length) {
      const empty = document.createElement('div');
      empty.className = 'admin-empty-state';
      const marker = document.createElement('span');
      marker.textContent = '00';
      const title = document.createElement('strong');
      title.textContent = enquiries.length ? 'No matching enquiries' : 'No enquiries yet';
      const copy = document.createElement('p');
      copy.textContent = enquiries.length
        ? 'Change the search or stage filter to widen the result set.'
        : 'New website submissions will appear here as soon as they arrive.';
      empty.append(marker, title, copy);
      list.append(empty);
      return;
    }

    records.forEach((enquiry) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'admin-enquiry-row';
      button.dataset.enquiryId = enquiry.id;
      button.innerHTML = `
        <span class="admin-enquiry-row__received"><b>${relativeDate(enquiry.created_at)}</b><i data-status="${enquiry.status}">${statusLabels[enquiry.status]}</i></span>
        <span class="admin-enquiry-row__contact"><b></b><small></small></span>
        <span class="admin-enquiry-row__requirement"><b></b><small></small></span>
        <span class="admin-enquiry-row__source"><b></b><small></small></span>
        <span class="admin-enquiry-row__open" aria-hidden="true">↗</span>`;
      const contact = query<HTMLElement>(button, '.admin-enquiry-row__contact');
      const requirement = query<HTMLElement>(button, '.admin-enquiry-row__requirement');
      const source = query<HTMLElement>(button, '.admin-enquiry-row__source');
      if (contact) {
        query<HTMLElement>(contact, 'b')!.textContent = enquiry.name;
        query<HTMLElement>(contact, 'small')!.textContent = enquiry.company || enquiry.email;
      }
      if (requirement) {
        query<HTMLElement>(requirement, 'b')!.textContent = enquiry.enquiry_type === 'discovery'
          ? 'Web design discovery'
          : formatLabel(enquiry.service || enquiry.project_type || enquiry.audit_area || enquiry.enquiry_type);
        query<HTMLElement>(requirement, 'small')!.textContent = enquiry.brief;
      }
      if (source) {
        query<HTMLElement>(source, 'b')!.textContent = enquiry.next_action || 'No next action';
        query<HTMLElement>(source, 'small')!.textContent = enquiry.next_action_due_at
          ? `${isOverdue(enquiry) ? 'Overdue · ' : ''}${formatDate(enquiry.next_action_due_at)}`
          : formatLabel(enquiry.priority);
        source.dataset.state = isOverdue(enquiry) ? 'overdue' : enquiry.next_action ? 'planned' : 'unplanned';
      }
      button.addEventListener('click', () => openDetail(enquiry.id));
      list.append(button);
    });
  };

  const renderActivity = (notes: EnquiryNote[], events: EnquiryEvent[]) => {
    const activityList = query<HTMLElement>(root, '[data-activity-list]');
    if (!activityList) return;
    activityList.replaceChildren();
    const items = [
      ...notes.map((note) => ({ id: note.id, type: 'Internal note', text: note.body, createdAt: note.created_at, isNote: true })),
      ...events
        .filter(({ event_type }) => event_type !== 'note_added')
        .map((event) => ({ id: event.id, type: formatLabel(event.event_type), text: event.summary, createdAt: event.created_at, isNote: false })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!items.length) {
      const status = document.createElement('p');
      status.className = 'admin-activity-list__status';
      status.textContent = 'No activity has been recorded yet.';
      activityList.append(status);
      return;
    }

    items.forEach((item) => {
      const article = document.createElement('article');
      article.dataset.activityType = item.isNote ? 'note' : 'change';
      const rail = document.createElement('span');
      rail.className = 'admin-activity-list__rail';
      const content = document.createElement('div');
      const meta = document.createElement('span');
      meta.textContent = item.type;
      const copy = document.createElement('p');
      copy.textContent = item.text;
      const date = document.createElement('time');
      date.dateTime = item.createdAt;
      date.textContent = formatDate(item.createdAt);
      content.append(meta, copy, date);
      article.append(rail, content);
      activityList.append(article);
    });
  };

  const loadActivity = async (enquiryId: string) => {
    const activityList = query<HTMLElement>(root, '[data-activity-list]');
    if (!activityList) return;
    if (previewMode) {
      const enquiry = enquiries.find(({ id }) => id === enquiryId);
      const baseEvents: EnquiryEvent[] = enquiry ? [
        { id: `${enquiry.id}-updated`, enquiry_id: enquiry.id, actor_id: null, event_type: 'workflow_updated', summary: enquiry.next_action ? 'Commercial context updated' : 'Enquiry awaiting its first action', metadata: {}, created_at: enquiry.updated_at },
        { id: `${enquiry.id}-created`, enquiry_id: enquiry.id, actor_id: null, event_type: 'created', summary: 'Enquiry received', metadata: {}, created_at: enquiry.created_at },
      ] : [];
      const baseNotes: EnquiryNote[] = enquiry?.status === 'proposal' ? [{ id: `${enquiry.id}-note`, enquiry_id: enquiry.id, author_id: 'preview', body: 'Proposal shared after the discovery call. Follow up on the commercial questions before the next decision date.', created_at: new Date(Date.now() - 18 * 60 * 60_000).toISOString() }] : [];
      renderActivity(
        [...(previewNotes.get(enquiryId) || []), ...baseNotes],
        [...(previewEvents.get(enquiryId) || []), ...baseEvents],
      );
      return;
    }
    if (!client) return;
    activityList.innerHTML = '<p class="admin-activity-list__status">Loading the activity history.</p>';
    const [notesResult, eventsResult] = await Promise.all([
      client.from('enquiry_notes').select('id,enquiry_id,body,created_at,author_id').eq('enquiry_id', enquiryId).order('created_at', { ascending: false }),
      client.from('enquiry_events').select('id,enquiry_id,actor_id,event_type,summary,metadata,created_at').eq('enquiry_id', enquiryId).order('created_at', { ascending: false }),
    ]);
    if (notesResult.error || eventsResult.error) {
      activityList.innerHTML = '<p class="admin-activity-list__status">The activity history could not be loaded.</p>';
      return;
    }
    renderActivity((notesResult.data || []) as EnquiryNote[], (eventsResult.data || []) as EnquiryEvent[]);
  };

  const invoiceDate = (offsetDays = 0) => {
    const value = new Date();
    value.setDate(value.getDate() + offsetDays);
    return value.toISOString().slice(0, 10);
  };

  const generateInvoiceNumber = () => `CNVRT-${Math.floor(1000 + Math.random() * 9000)}`;

  const invoiceItemMarkup = (item: InvoiceLineItem = { description: '', quantity: 1, unit_pence: 0 }) => `<div class="admin-invoice-item" data-invoice-item>
    <label>Description<input type="text" maxlength="300" value="${escapeHtml(item.description)}" placeholder="Website design deposit" data-invoice-description /></label>
    <label>Qty<input type="number" min="1" max="10000" step="1" value="${item.quantity}" data-invoice-quantity /></label>
    <label>Unit price<input type="number" min="0" step="0.01" value="${(item.unit_pence / 100).toFixed(2)}" data-invoice-unit /></label>
    <button type="button" aria-label="Remove invoice item" data-invoice-remove>×</button>
  </div>`;

  const readInvoiceItems = () => Array.from(root.querySelectorAll<HTMLElement>('[data-invoice-item]')).map((row) => ({
    description: query<HTMLInputElement>(row, '[data-invoice-description]')?.value.trim() || '',
    quantity: Math.max(1, Number(query<HTMLInputElement>(row, '[data-invoice-quantity]')?.value || 1)),
    unit_pence: Math.max(0, Math.round(Number(query<HTMLInputElement>(row, '[data-invoice-unit]')?.value || 0) * 100)),
  }));

  const updateInvoiceTotal = () => {
    const subtotal = readInvoiceItems().reduce((sum, item) => sum + item.quantity * item.unit_pence, 0);
    const vatRate = Number(query<HTMLSelectElement>(root, '[data-invoice-vat]')?.value || 0);
    const total = subtotal + Math.round(subtotal * vatRate / 100);
    const output = query<HTMLElement>(root, '[data-invoice-total]');
    if (output) output.textContent = formatInvoiceMoney(total);
    return total;
  };

  const renderInvoiceForm = (invoice: Invoice | null) => {
    if (!activeEnquiry) return;
    activeInvoice = invoice;
    query<HTMLElement>(root, '[data-invoice-number-label]')!.textContent = invoice?.invoice_number || 'New invoice';
    query<HTMLInputElement>(root, '[data-invoice-number]')!.value = invoice?.invoice_number || generateInvoiceNumber();
    query<HTMLSelectElement>(root, '[data-invoice-status]')!.value = invoice?.status || 'draft';
    query<HTMLSelectElement>(root, '[data-invoice-vat]')!.value = String(Number(invoice?.vat_rate || 0));
    query<HTMLInputElement>(root, '[data-invoice-issued]')!.value = invoice?.issue_date || invoiceDate();
    query<HTMLInputElement>(root, '[data-invoice-due]')!.value = invoice?.due_date || invoiceDate(7);
    query<HTMLInputElement>(root, '[data-invoice-client]')!.value = invoice?.client_name || activeEnquiry.name;
    query<HTMLInputElement>(root, '[data-invoice-email]')!.value = invoice?.client_email || activeEnquiry.email;
    query<HTMLInputElement>(root, '[data-invoice-company]')!.value = invoice?.client_company || activeEnquiry.company || '';
    query<HTMLInputElement>(root, '[data-invoice-payment-url]')!.value = invoice?.payment_url || '';
    query<HTMLInputElement>(root, '[data-invoice-account-name]')!.value = invoice?.bank_details?.account_name || '';
    query<HTMLInputElement>(root, '[data-invoice-sort-code]')!.value = invoice?.bank_details?.sort_code || '';
    query<HTMLInputElement>(root, '[data-invoice-account-number]')!.value = invoice?.bank_details?.account_number || '';
    query<HTMLInputElement>(root, '[data-invoice-reference]')!.value = invoice?.bank_details?.reference || invoice?.invoice_number || '';
    query<HTMLTextAreaElement>(root, '[data-invoice-notes]')!.value = invoice?.notes || 'Project deposit. Work is scheduled once payment and the discovery questionnaire are complete.';
    const items = query<HTMLElement>(root, '[data-invoice-items]');
    if (items) items.innerHTML = (invoice?.line_items?.length ? invoice.line_items : [{ description: `${activeEnquiry.company || activeEnquiry.name} website design deposit`, quantity: 1, unit_pence: Math.round((activeEnquiry.opportunity_value_pence || 0) / 2) }]).map(invoiceItemMarkup).join('');
    const message = query<HTMLElement>(root, '[data-invoice-message]');
    if (message) message.textContent = invoice ? 'Saved invoice loaded.' : 'Create the deposit invoice, then copy its private client link.';
    updateInvoiceTotal();
  };

  const loadInvoice = async (enquiryId: string) => {
    if (previewMode || !client) return renderInvoiceForm(null);
    const message = query<HTMLElement>(root, '[data-invoice-message]');
    if (message) message.textContent = 'Loading invoice…';
    const { data, error } = await client.from('invoices').select('id,enquiry_id,invoice_number,status,issue_date,due_date,client_name,client_email,client_company,line_items,vat_rate,notes,payment_url,bank_details,total_pence').eq('enquiry_id', enquiryId).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (error) { renderInvoiceForm(null); if (message) message.textContent = 'Invoice storage is not ready. Apply the invoice database migration.'; return; }
    renderInvoiceForm((data as Invoice | null) || null);
  };

  const invoicePayload = () => ({
    invoiceNumber: query<HTMLInputElement>(root, '[data-invoice-number]')?.value.trim().toUpperCase() || generateInvoiceNumber(),
    status: query<HTMLSelectElement>(root, '[data-invoice-status]')?.value || 'draft',
    vatRate: Number(query<HTMLSelectElement>(root, '[data-invoice-vat]')?.value || 0),
    issueDate: query<HTMLInputElement>(root, '[data-invoice-issued]')?.value || '',
    dueDate: query<HTMLInputElement>(root, '[data-invoice-due]')?.value || '',
    clientName: query<HTMLInputElement>(root, '[data-invoice-client]')?.value.trim() || '',
    clientEmail: query<HTMLInputElement>(root, '[data-invoice-email]')?.value.trim() || '',
    clientCompany: query<HTMLInputElement>(root, '[data-invoice-company]')?.value.trim() || '',
    paymentUrl: query<HTMLInputElement>(root, '[data-invoice-payment-url]')?.value.trim() || '',
    bankDetails: {
      account_name: query<HTMLInputElement>(root, '[data-invoice-account-name]')?.value.trim() || '',
      sort_code: query<HTMLInputElement>(root, '[data-invoice-sort-code]')?.value.trim() || '',
      account_number: query<HTMLInputElement>(root, '[data-invoice-account-number]')?.value.trim() || '',
      reference: query<HTMLInputElement>(root, '[data-invoice-reference]')?.value.trim() || '',
    },
    notes: query<HTMLTextAreaElement>(root, '[data-invoice-notes]')?.value.trim() || '',
    items: readInvoiceItems(),
  });

  const previewInvoice = () => {
    if (!activeEnquiry) return;
    const payload = invoicePayload();
    const subtotal = payload.items.reduce((sum, item) => sum + item.quantity * item.unit_pence, 0);
    const vat = Math.round(subtotal * payload.vatRate / 100);
    const itemRows = payload.items.map((item) => `<tr><td>${escapeHtml(item.description)}</td><td>${item.quantity}</td><td>${formatInvoiceMoney(item.unit_pence)}</td><td>${formatInvoiceMoney(item.quantity * item.unit_pence)}</td></tr>`).join('');
    const bank = payload.bankDetails;
    const bankMarkup = bank.account_name || bank.sort_code || bank.account_number ? `<section class="bank"><small>Pay by bank transfer</small><p><b>Account name</b> ${escapeHtml(bank.account_name)}<br><b>Sort code</b> ${escapeHtml(bank.sort_code)}<br><b>Account number</b> ${escapeHtml(bank.account_number)}<br><b>Reference</b> ${escapeHtml(bank.reference || payload.invoiceNumber)}</p></section>` : '';
    const frame = query<HTMLIFrameElement>(root, '[data-invoice-preview-frame]');
    const panel = query<HTMLElement>(root, '[data-invoice-preview-panel]');
    if (!frame || !panel) return;
    frame.srcdoc = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(activeInvoice?.invoice_number || 'Draft invoice')}</title><style>body{margin:0;padding:48px;color:#17171a;background:#fff;font:14px Arial,sans-serif}main{max-width:800px;margin:auto}header{display:flex;justify-content:space-between;border-bottom:4px solid #c3b4d6;padding-bottom:24px}.logo{display:block;width:120px;height:auto;filter:invert(1)}h2{margin:0;font-size:26px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:32px;padding:28px 0}small{display:block;color:#69666e;text-transform:uppercase}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{padding:14px 10px;border-bottom:1px solid #ddd;text-align:left;overflow-wrap:anywhere}th:not(:first-child),td:not(:first-child){text-align:right}.total{margin:24px 0 0 auto;width:280px}.total div{display:flex;justify-content:space-between;padding:8px 0}.total div:last-child{border-top:2px solid #17171a;font-size:18px;font-weight:bold}.notes{white-space:pre-wrap;margin-top:32px;color:#555}.bank{width:max-content;max-width:100%;margin-top:24px;padding:16px;border:1px solid #d8d2df;background:#f8f6fa}.bank p{line-height:1.8}.bank b{display:inline-block;width:120px}@media(max-width:600px){body{padding:20px}header{gap:16px}.logo{width:104px}.meta{grid-template-columns:1fr}.bank b{display:block}.total{width:100%}th,td{padding-inline:5px}th:nth-child(2),td:nth-child(2){display:none}th:first-child,td:first-child{width:52%}}</style></head><body><main><header><div><img class="logo" src="/brand/cnvrt-logo.png" alt="CNVRT" width="800" height="200"><small>Websites. Commerce. Growth.</small></div><div><h2>Invoice</h2><p>${escapeHtml(activeInvoice?.invoice_number || 'Draft preview')}</p></div></header><section class="meta"><div><small>Bill to</small><strong>${escapeHtml(payload.clientName)}</strong><p>${escapeHtml(payload.clientCompany)}</p></div><div><small>Dates</small><p>Issued ${escapeHtml(payload.issueDate)}<br>Due ${escapeHtml(payload.dueDate)}</p></div></section><table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${itemRows}</tbody></table><div class="total"><div><span>Subtotal</span><span>${formatInvoiceMoney(subtotal)}</span></div>${payload.vatRate ? `<div><span>VAT (${payload.vatRate}%)</span><span>${formatInvoiceMoney(vat)}</span></div>` : ''}<div><span>Total</span><span>${formatInvoiceMoney(subtotal + vat)}</span></div></div><p class="notes">${escapeHtml(payload.notes)}</p>${bankMarkup}</main></body></html>`;
    frame.addEventListener('load', () => {
      if (!frame.contentDocument) return;
      frame.contentDocument.title = payload.invoiceNumber;
      const number = frame.contentDocument.querySelector('header > div:last-child > p');
      if (number) number.textContent = payload.invoiceNumber;
    }, { once: true });
    panel.hidden = false;
  };

  const openDetail = (id: string) => {
    const enquiry = enquiries.find((record) => record.id === id);
    if (!enquiry || !dialog) return;
    activeEnquiry = enquiry;
    query<HTMLElement>(root, '[data-detail-reference]')!.textContent = `ENQ / ${enquiry.id.slice(0, 8).toUpperCase()}`;
    query<HTMLElement>(root, '[data-detail-date]')!.textContent = formatDate(enquiry.created_at);
    query<HTMLElement>(root, '[data-detail-type]')!.textContent = enquiry.enquiry_type === 'discovery' ? 'Web design discovery' : formatLabel(enquiry.enquiry_type);
    query<HTMLElement>(root, '[data-detail-name]')!.textContent = enquiry.name;
    const email = query<HTMLAnchorElement>(root, '[data-detail-email]')!;
    email.href = `mailto:${enquiry.email}`;
    email.textContent = enquiry.email;
    query<HTMLElement>(root, '[data-detail-brief]')!.textContent = enquiry.brief;
    query<HTMLSelectElement>(root, '[data-detail-status]')!.value = enquiry.status;
    query<HTMLSelectElement>(root, '[data-detail-priority]')!.value = enquiry.priority;
    query<HTMLSelectElement>(root, '[data-detail-fit]')!.value = enquiry.fit;
    query<HTMLInputElement>(root, '[data-detail-next-action]')!.value = enquiry.next_action || '';
    query<HTMLInputElement>(root, '[data-detail-action-due]')!.value = toDateTimeLocal(enquiry.next_action_due_at);
    query<HTMLInputElement>(root, '[data-detail-value]')!.value = enquiry.opportunity_value_pence == null ? '' : String(enquiry.opportunity_value_pence / 100);
    query<HTMLInputElement>(root, '[data-detail-close-date]')!.value = enquiry.expected_close_date || '';
    query<HTMLTextAreaElement>(root, '[data-detail-lost-reason]')!.value = enquiry.lost_reason || '';
    const convertSection = query<HTMLElement>(root, '[data-convert-section]');
    if (convertSection) convertSection.hidden = enquiry.status !== 'won';
    const convertName = query<HTMLInputElement>(root, '[data-convert-project-name]');
    if (convertName) convertName.value = `${enquiry.company || enquiry.name} — ${formatLabel(enquiry.service || enquiry.project_type || 'Project')}`;
    const convertStatus = query<HTMLElement>(root, '[data-convert-status]');
    if (convertStatus) convertStatus.textContent = '';
    const invoiceSection = query<HTMLElement>(root, '[data-invoice-section]');
    if (invoiceSection) invoiceSection.hidden = !['proposal', 'won'].includes(enquiry.status);
    const discoveryLinkStatus = query<HTMLElement>(root, '[data-discovery-link-status]');
    if (discoveryLinkStatus) discoveryLinkStatus.textContent = enquiry.discovery_data ? 'Discovery response received. Generate a new link only if the client needs to amend it.' : '';
    const completeAction = query<HTMLButtonElement>(root, '[data-complete-action]');
    if (completeAction) completeAction.disabled = !enquiry.next_action;
    query<HTMLElement>(root, '[data-detail-status-message]')!.textContent = '';

    const discoverySection = query<HTMLElement>(root, '[data-detail-discovery]');
    const discoveryAnswers = query<HTMLElement>(root, '[data-detail-discovery-answers]');
    if (discoverySection && discoveryAnswers) {
      discoveryAnswers.replaceChildren();
      const entries = enquiry.discovery_data
        ? Object.entries(discoveryFieldLabels).map(([key, label]) => ({ key, label, value: enquiry.discovery_data?.[key] })).filter(({ value }) => Array.isArray(value) ? value.length > 0 : Boolean(value))
        : [];
      discoverySection.hidden = entries.length === 0;
      entries.forEach(({ key, label: itemLabel, value }) => {
        const item = document.createElement('article');
        const label = document.createElement('span');
        const copy = document.createElement('p');
        label.textContent = itemLabel;
        copy.textContent = Array.isArray(value)
          ? value.map((entry) => formatLabel(String(entry))).join(', ')
          : discoveryEnumFields.has(key)
            ? formatLabel(String(value))
            : String(value);
        item.append(label, copy);
        discoveryAnswers.append(item);
      });
    }

    const facts = query<HTMLElement>(root, '[data-detail-facts]')!;
    facts.replaceChildren();
    (Object.keys(fieldLabels) as Array<keyof Enquiry>).forEach((key) => {
      const value = enquiry[key];
      if (!value) return;
      const item = document.createElement('div');
      const label = document.createElement('span');
      label.textContent = fieldLabels[key] || formatLabel(String(key));
      const content = key === 'website' ? document.createElement('a') : document.createElement('strong');
      content.textContent = key === 'website'
        ? String(value)
        : key === 'budget'
          ? budgetLabels[String(value)] || formatLabel(String(value))
          : formatLabel(String(value));
      if (content instanceof HTMLAnchorElement) {
        content.href = String(value);
        content.target = '_blank';
        content.rel = 'noreferrer';
      }
      item.append(label, content);
      facts.append(item);
    });
    void loadActivity(enquiry.id);
    if (['proposal', 'won'].includes(enquiry.status)) void loadInvoice(enquiry.id);
    dialog.showModal();
  };

  const loadEnquiries = async () => {
    if (!client) return;
    setSyncStatus('Refreshing enquiries');
    const { data, error } = await client
      .from('enquiries')
      .select('id,created_at,updated_at,form_name,enquiry_type,source_page,name,email,company,website,service,project_type,budget,timing,audit_area,data_access,brief,discovery_data,status,priority,fit,next_action,next_action_due_at,opportunity_value_pence,expected_close_date,lost_reason,archived_at')
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      setSyncStatus('Unable to load enquiries');
      if (list) {
        list.innerHTML = '<div class="admin-empty-state"><span>!</span><strong>Enquiries could not be loaded</strong><p>Check the administrator record and row-level security setup.</p></div>';
      }
      return;
    }
    enquiries = (data || []) as Enquiry[];
    renderMetrics();
    renderPipeline();
    renderToday();
    renderList();
    setSyncStatus(`Synced ${formatDate(new Date().toISOString())}`);
  };

  const boot = async () => {
    if (previewMode) {
      enquiries = demoEnquiries();
      showWorkspace();
      renderMetrics();
      renderPipeline();
      renderToday();
      renderList();
      setSyncStatus('Local design preview');
      return;
    }
    if (!configured || !supabaseUrl || !supabaseKey) {
      if (configWarning) configWarning.hidden = false;
      loginForm?.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button').forEach((element) => { element.disabled = true; });
      setLoginStatus('Configuration is required before this workspace can connect.', 'error');
      return;
    }
    client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    const { data } = await client.auth.getSession();
    user = data.session?.user || null;
    if (user) {
      showWorkspace();
      await loadEnquiries();
    } else {
      showAuth();
    }

    client.auth.onAuthStateChange((_event, session) => {
      user = session?.user || null;
      if (!user) showAuth();
    });
  };

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client) return;
    const formData = new FormData(loginForm);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const button = query<HTMLButtonElement>(loginForm, 'button[type="submit"]');
    if (button) button.disabled = true;
    setLoginStatus('Checking secure access.');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (button) button.disabled = false;
    if (error || !data.user) {
      setLoginStatus('The email or password was not accepted.', 'error');
      return;
    }
    user = data.user;
    loginForm.reset();
    showWorkspace();
    await loadEnquiries();
  });

  query<HTMLButtonElement>(root, '[data-sign-out]')?.addEventListener('click', async () => {
    await client?.auth.signOut();
    enquiries = [];
    showAuth();
  });

  query<HTMLButtonElement>(root, '[data-refresh]')?.addEventListener('click', () => void loadEnquiries());
  search?.addEventListener('input', renderList);

  query<HTMLElement>(root, '[data-filters]')?.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (!button) return;
    currentFilter = button.dataset.filter || 'all';
    root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderList();
  });

  query<HTMLButtonElement>(root, '[data-detail-close]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  query<HTMLButtonElement>(root, '[data-create-enquiry]')?.addEventListener('click', () => {
    const createStatus = query<HTMLElement>(root, '[data-create-status]');
    if (createStatus) createStatus.textContent = '';
    createDialog?.showModal();
    window.setTimeout(() => query<HTMLInputElement>(root, '#create-name')?.focus(), 50);
  });
  query<HTMLButtonElement>(root, '[data-create-close]')?.addEventListener('click', () => createDialog?.close());
  createDialog?.addEventListener('click', (event) => { if (event.target === createDialog) createDialog.close(); });
  createForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client) return;
    const form = new FormData(createForm);
    const status = query<HTMLElement>(root, '[data-create-status]');
    const button = query<HTMLButtonElement>(createForm, 'button[type="submit"]');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Creating enquiry…';
    const value = (name: string) => String(form.get(name) || '').trim() || null;
    const { data, error } = await client.rpc('create_manual_enquiry', {
      p_name: value('name'), p_email: value('email'), p_company: value('company'),
      p_website: value('website'), p_service: value('service'), p_project_type: value('project-type'),
      p_budget: value('budget'), p_timing: value('timing'), p_brief: value('brief'),
    });
    if (button) button.disabled = false;
    if (error) { if (status) status.textContent = error.message; return; }
    createForm.reset();
    createDialog?.close();
    await loadEnquiries();
    if (typeof data === 'string') openDetail(data);
  });

  type EnquiryPatch = Partial<Pick<Enquiry, 'status' | 'priority' | 'fit' | 'next_action' | 'next_action_due_at' | 'opportunity_value_pence' | 'expected_close_date' | 'lost_reason' | 'archived_at'>>;

  const refreshWorkflowViews = () => {
    renderMetrics();
    renderPipeline();
    renderToday();
    renderList();
  };

  const saveEnquiryPatch = async (patch: EnquiryPatch) => {
    if (!activeEnquiry) return false;
    const message = query<HTMLElement>(root, '[data-detail-status-message]');
    if (previewMode) {
      Object.assign(activeEnquiry, patch, { updated_at: new Date().toISOString() });
      refreshWorkflowViews();
      return true;
    }
    if (!client) return false;
    const previousUpdatedAt = activeEnquiry.updated_at;
    const { data, error } = await client
      .from('enquiries')
      .update(patch)
      .eq('id', activeEnquiry.id)
      .eq('updated_at', previousUpdatedAt)
      .select('updated_at')
      .maybeSingle();
    if (error) {
      if (message) message.textContent = 'The opportunity could not be saved.';
      return false;
    }
    if (!data) {
      if (message) message.textContent = 'This enquiry changed in another session. Refresh it before saving again.';
      return false;
    }
    Object.assign(activeEnquiry, patch, { updated_at: data.updated_at });
    refreshWorkflowViews();
    return true;
  };

  query<HTMLButtonElement>(root, '[data-save-opportunity]')?.addEventListener('click', async () => {
    if (!activeEnquiry) return;
    const message = query<HTMLElement>(root, '[data-detail-status-message]');
    const nextAction = query<HTMLInputElement>(root, '[data-detail-next-action]')?.value.trim() || null;
    const dueInput = query<HTMLInputElement>(root, '[data-detail-action-due]')?.value || '';
    const status = query<HTMLSelectElement>(root, '[data-detail-status]')?.value as EnquiryStatus;
    const priority = query<HTMLSelectElement>(root, '[data-detail-priority]')?.value as EnquiryPriority;
    const fit = query<HTMLSelectElement>(root, '[data-detail-fit]')?.value as EnquiryFit;
    const valueInput = query<HTMLInputElement>(root, '[data-detail-value]')?.value.trim() || '';
    const lostReason = query<HTMLTextAreaElement>(root, '[data-detail-lost-reason]')?.value.trim() || null;
    if (dueInput && !nextAction) {
      if (message) message.textContent = 'Add the next action before setting its due date.';
      return;
    }
    if ((status === 'lost' || fit === 'unsuitable') && !lostReason) {
      if (message) message.textContent = 'Record why this opportunity was lost or unsuitable.';
      return;
    }
    const numericValue = valueInput ? Number(valueInput) : null;
    if (numericValue != null && (!Number.isFinite(numericValue) || numericValue < 0)) {
      if (message) message.textContent = 'Enter a valid opportunity value.';
      return;
    }
    const button = query<HTMLButtonElement>(root, '[data-save-opportunity]');
    if (button) button.disabled = true;
    const saved = await saveEnquiryPatch({
      status,
      priority,
      fit,
      next_action: nextAction,
      next_action_due_at: dueInput ? new Date(dueInput).toISOString() : null,
      opportunity_value_pence: numericValue == null ? null : Math.round(numericValue * 100),
      expected_close_date: query<HTMLInputElement>(root, '[data-detail-close-date]')?.value || null,
      lost_reason: lostReason,
    });
    if (button) button.disabled = false;
    if (message && saved) message.textContent = 'Opportunity and next action saved.';
    if (saved && status === 'won' && client && !previewMode) {
      if (message) message.textContent = 'Won. Creating the client workspace…';
      const conversion = await client.rpc('convert_enquiry_to_client', {
        p_enquiry_id: activeEnquiry.id,
        p_project_name: null,
        p_template_key: null,
        p_target_start_date: null,
      });
      const alreadyConnected = conversion.error?.message.includes('already connected');
      if (message) message.innerHTML = conversion.error && !alreadyConnected
        ? `The opportunity was saved as won, but the client workspace could not be created: ${escapeHtml(conversion.error.message)}`
        : `Won and added to the client hub. <a href="/admin/clients/">Open client hub ↗</a>`;
      const convertButton = query<HTMLButtonElement>(root, '[data-convert-client]');
      if (convertButton && (!conversion.error || alreadyConnected)) convertButton.disabled = true;
    }
    const completeAction = query<HTMLButtonElement>(root, '[data-complete-action]');
    if (completeAction) completeAction.disabled = !activeEnquiry.next_action;
    if (saved) await loadActivity(activeEnquiry.id);
  });

  query<HTMLButtonElement>(root, '[data-complete-action]')?.addEventListener('click', async () => {
    if (!activeEnquiry?.next_action) return;
    const completedAction = activeEnquiry.next_action;
    const saved = await saveEnquiryPatch({ next_action: null, next_action_due_at: null });
    const message = query<HTMLElement>(root, '[data-detail-status-message]');
    if (!saved) return;
    query<HTMLInputElement>(root, '[data-detail-next-action]')!.value = '';
    query<HTMLInputElement>(root, '[data-detail-action-due]')!.value = '';
    const button = query<HTMLButtonElement>(root, '[data-complete-action]');
    if (button) button.disabled = true;
    if (message) message.textContent = `Completed: ${completedAction}`;
    if (previewMode) {
      const events = previewEvents.get(activeEnquiry.id) || [];
      events.unshift({
        id: `${activeEnquiry.id}-completed-${Date.now()}`,
        enquiry_id: activeEnquiry.id,
        actor_id: null,
        event_type: 'action_completed',
        summary: `Completed: ${completedAction}`,
        metadata: {},
        created_at: new Date().toISOString(),
      });
      previewEvents.set(activeEnquiry.id, events);
    }
    await loadActivity(activeEnquiry.id);
  });

  query<HTMLButtonElement>(root, '[data-convert-client]')?.addEventListener('click', async () => {
    if (!activeEnquiry || !client || previewMode) return;
    const button = query<HTMLButtonElement>(root, '[data-convert-client]');
    const status = query<HTMLElement>(root, '[data-convert-status]');
    if (activeEnquiry.status !== 'won') { if (status) status.textContent = 'Save this enquiry as won before starting onboarding.'; return; }
    if (button) button.disabled = true;
    if (status) status.textContent = 'Creating the client workspace…';
    const { data, error } = await client.rpc('convert_enquiry_to_client', {
      p_enquiry_id: activeEnquiry.id,
      p_project_name: query<HTMLInputElement>(root, '[data-convert-project-name]')?.value.trim() || null,
      p_template_key: query<HTMLSelectElement>(root, '[data-convert-template]')?.value || null,
      p_target_start_date: query<HTMLInputElement>(root, '[data-convert-start]')?.value || null,
    });
    if (button) button.disabled = false;
    if (error) { if (status) status.textContent = error.message.includes('already connected') ? 'This enquiry already has a client project. Open it from the client hub.' : error.message; return; }
    const result = Array.isArray(data) ? data[0] : data;
    const token = result?.portal_token;
    if (!token) { if (status) status.textContent = 'The project was created, but the client link was not returned. Open the client hub to regenerate it.'; return; }
    const link = `${window.location.origin}/client/?token=${token}`;
    await navigator.clipboard.writeText(link);
    if (status) status.innerHTML = 'Client and project created. The private link is copied. <a href="/admin/clients/">Open client hub ↗</a>';
    if (button) button.disabled = true;
  });

  query<HTMLButtonElement>(root, '[data-generate-discovery]')?.addEventListener('click', async () => {
    if (!activeEnquiry || !client || previewMode) return;
    const button = query<HTMLButtonElement>(root, '[data-generate-discovery]');
    const status = query<HTMLElement>(root, '[data-discovery-link-status]');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Generating a private questionnaire link…';
    const { data, error } = await client.rpc('generate_discovery_questionnaire_token', { p_enquiry_id: activeEnquiry.id });
    if (button) button.disabled = false;
    if (error || !data) { if (status) status.textContent = error?.message || 'The questionnaire link could not be generated.'; return; }
    const link = `${window.location.origin}/web-design-discovery/?token=${data}`;
    await navigator.clipboard.writeText(link);
    if (status) status.innerHTML = `Private discovery link copied. <a href="${escapeHtml(link)}" target="_blank" rel="noopener">Open questionnaire ↗</a>`;
  });

  query<HTMLButtonElement>(root, '[data-invoice-add]')?.addEventListener('click', () => {
    query<HTMLElement>(root, '[data-invoice-items]')?.insertAdjacentHTML('beforeend', invoiceItemMarkup());
    updateInvoiceTotal();
  });
  query<HTMLElement>(root, '[data-invoice-items]')?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-invoice-remove]');
    if (!button) return;
    const rows = root.querySelectorAll('[data-invoice-item]');
    if (rows.length <= 1) { const message = query<HTMLElement>(root, '[data-invoice-message]'); if (message) message.textContent = 'An invoice needs at least one line item.'; return; }
    button.closest('[data-invoice-item]')?.remove(); updateInvoiceTotal();
  });
  query<HTMLElement>(root, '[data-invoice-section]')?.addEventListener('input', updateInvoiceTotal);
  query<HTMLElement>(root, '[data-invoice-section]')?.addEventListener('change', updateInvoiceTotal);
  query<HTMLButtonElement>(root, '[data-invoice-preview]')?.addEventListener('click', previewInvoice);
  query<HTMLButtonElement>(root, '[data-invoice-preview-close]')?.addEventListener('click', () => {
    const panel = query<HTMLElement>(root, '[data-invoice-preview-panel]');
    if (panel) panel.hidden = true;
  });
  query<HTMLButtonElement>(root, '[data-invoice-save]')?.addEventListener('click', async () => {
    if (!activeEnquiry || !client) return;
    const payload = invoicePayload();
    const message = query<HTMLElement>(root, '[data-invoice-message]');
    if (!/^[A-Z0-9][A-Z0-9-]{2,24}$/.test(payload.invoiceNumber) || !payload.clientName || !payload.clientEmail || !payload.issueDate || !payload.dueDate || payload.items.some((item) => !item.description || item.unit_pence <= 0)) {
      if (message) message.textContent = 'Use a short invoice number containing letters, numbers or hyphens, then complete the client, dates and prices.';
      return;
    }
    const button = query<HTMLButtonElement>(root, '[data-invoice-save]');
    if (button) button.disabled = true;
    if (message) message.textContent = 'Saving invoice…';
    const { data, error } = await client.rpc('save_enquiry_invoice', {
      p_enquiry_id: activeEnquiry.id,
      p_invoice_id: activeInvoice?.id || null,
      p_status: payload.status,
      p_issue_date: payload.issueDate,
      p_due_date: payload.dueDate,
      p_client_name: payload.clientName,
      p_client_email: payload.clientEmail,
      p_client_company: payload.clientCompany || null,
      p_line_items: payload.items,
      p_vat_rate: payload.vatRate,
      p_notes: payload.notes || null,
      p_payment_url: payload.paymentUrl || null,
    });
    if (button) button.disabled = false;
    if (error) { if (message) message.textContent = error.message; return; }
    const result = Array.isArray(data) ? data[0] : data;
    if (!result?.invoice_token) { if (message) message.textContent = 'Invoice saved, but the private link was not returned.'; return; }
    const { error: bankError } = await client.from('invoices').update({ invoice_number: payload.invoiceNumber, bank_details: payload.bankDetails }).eq('id', result.invoice_id);
    if (bankError) { if (message) message.textContent = `Invoice saved, but bank details could not be added: ${bankError.message}`; return; }
    const link = `${window.location.origin}/invoice/?token=${result.invoice_token}`;
    await navigator.clipboard.writeText(link);
    if (message) message.textContent = `${payload.invoiceNumber} saved. Private invoice link copied.`;
    await loadInvoice(activeEnquiry.id);
  });

  noteForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!activeEnquiry) return;
    const textarea = query<HTMLTextAreaElement>(noteForm, 'textarea[name="note"]');
    const body = textarea?.value.trim() || '';
    if (!body) return;
    const button = query<HTMLButtonElement>(noteForm, 'button[type="submit"]');
    if (button) button.disabled = true;
    if (previewMode) {
      if (button) button.disabled = false;
      noteForm.reset();
      const notes = previewNotes.get(activeEnquiry.id) || [];
      notes.unshift({ id: `${activeEnquiry.id}-note-${Date.now()}`, enquiry_id: activeEnquiry.id, author_id: 'preview', body, created_at: new Date().toISOString() });
      previewNotes.set(activeEnquiry.id, notes);
      const message = query<HTMLElement>(root, '[data-detail-status-message]');
      if (message) message.textContent = 'Internal note added in this preview.';
      await loadActivity(activeEnquiry.id);
      return;
    }
    if (!client || !user) return;
    const { error } = await client.from('enquiry_notes').insert({ enquiry_id: activeEnquiry.id, body, author_id: user.id });
    if (button) button.disabled = false;
    const message = query<HTMLElement>(root, '[data-detail-status-message]');
    if (error) {
      if (message) message.textContent = 'The note could not be added.';
      return;
    }
    noteForm.reset();
    if (message) message.textContent = 'Internal note added.';
    await loadActivity(activeEnquiry.id);
  });

  query<HTMLButtonElement>(root, '[data-archive]')?.addEventListener('click', async () => {
    if (!activeEnquiry) return;
    const confirmed = window.confirm('Archive this enquiry? It will leave the active ledger but remain in Supabase.');
    if (!confirmed) return;
    const saved = await saveEnquiryPatch({ archived_at: new Date().toISOString() });
    if (!saved) return;
    enquiries = enquiries.filter(({ id }) => id !== activeEnquiry?.id);
    activeEnquiry = null;
    dialog?.close();
    refreshWorkflowViews();
  });

  query<HTMLButtonElement>(root, '[data-export]')?.addEventListener('click', () => {
    const columns: Array<keyof Enquiry> = ['created_at', 'status', 'priority', 'fit', 'next_action', 'next_action_due_at', 'opportunity_value_pence', 'expected_close_date', 'name', 'email', 'company', 'website', 'enquiry_type', 'service', 'project_type', 'budget', 'timing', 'audit_area', 'brief', 'discovery_data', 'source_page'];
    const rows = [columns.map(safeCsvCell).join(','), ...visibleEnquiries().map((enquiry) => columns.map((column) => safeCsvCell(enquiry[column])).join(','))];
    const blob = new Blob([`\uFEFF${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cnvrt-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  });

  void boot();
};
