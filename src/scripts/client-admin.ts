import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type Client = { id: string; company_name: string; primary_contact_name: string | null; primary_contact_email: string | null; status: string };
type Item = { id: string; position: number; title: string; guidance: string; owner: 'client' | 'cnvrt' | 'both'; response_type: string; is_required: boolean; status: string; response_text: string | null };
type Project = { id: string; client_id: string; enquiry_id: string | null; name: string; service: string | null; status: string; target_start_date: string | null; clients: Client; enquiries: { discovery_data: Record<string, unknown> | null } | null; project_onboarding_items: Item[] };

const discoveryFieldLabels: Record<string, string> = {
  main_result: 'Main website result', priority_treatments: 'Five priority treatments', treatment_priority: 'Hair restoration or aesthetics priority', patient_choice: 'Why patients choose the clinic', competitor_sites: 'Competitors and website references', current_services_accuracy: 'Accuracy of current services', treatment_changes: 'Treatments being introduced or removed', content_rewrite_approval: 'Permission to restructure and rewrite', treatment_pricing: 'Publishing treatment prices', hair_finance: 'Hair transplant finance', medical_accuracy_owner: 'Medical accuracy approver', clinic_locations: 'Active clinics and treatments', clinic_contact_details: 'Addresses, hours and public contact details', consultation_formats: 'Consultation formats', consultation_fees: 'Consultation fees', online_appointments: 'Appointments available online', direct_booking_scope: 'Consultation or treatment booking', booking_payment: 'Booking payment or deposit', cancellation_rules: 'Cancellation and rescheduling', calendar_sync: 'Calendar synchronisation', booking_information: 'Patient booking information', hair_photo_upload: 'Hair patient photo uploads', automatic_messages: 'Automatic booking messages', reminder_channels: 'Reminder channels', enquiry_sources: 'Enquiry sources', patient_stages: 'Patient pipeline stages', admin_users: 'Admin users', admin_capabilities: 'Admin panel capabilities', clinical_software: 'Clinical record software', records_separation: 'Website and clinical record separation', available_media: 'Available photography and video', before_after_volume: 'Available before-and-after cases', patient_permissions: 'Patient permissions', result_clinical_info: 'Clinical result information', google_reviews: 'Google reviews', professional_details: 'Professional details', cqc_details: 'CQC details', required_policies: 'Required policies', personal_story: 'Personal hair-transplant and career story', seo_locations: 'SEO target locations', patient_questions: 'Frequently asked patient questions', seo_article_selection: 'Initial SEO article selection', article_approver: 'Article approver', platform_access: 'Website and marketing access', data_migration: 'Data migration', final_approval: 'Final design and content approval', launch_dates: 'Launch dates and campaigns', ongoing_content_owner: 'Ongoing content owner'
};

const discoveryTemplateAnswers: Record<string, string> = {
  main_result: 'Generate more qualified consultation bookings, with a particular focus on high-value hair restoration enquiries, while presenting the full medical aesthetics offer clearly and credibly.',
  priority_treatments: 'FUE hair transplant surgery; general hair-loss consultations and treatment plans; PRP and polynucleotides for hair loss; anti-wrinkle treatment; advanced dermal filler treatments including non-surgical rhinoplasty.',
  treatment_priority: 'Hair restoration should take priority, with medical aesthetics retained as a strong secondary service line. The current site says hair restoration is Dr Jamie’s real passion and gives FUE the strongest commercial treatment page.',
  patient_choice: 'Doctor-led treatment, medical and ethical planning rather than sales pressure, natural-looking results, detailed individual assessment, structured aftercare, and Dr Jamie’s ability to explain hair transplantation from both a doctor’s and patient’s perspective.',
  current_services_accuracy: 'No, not without a final medical and operational review. The current site contains useful treatment detail, but there are conflicting prices, locations and contact details across treatment, booking and contact pages.',
  treatment_pricing: 'Yes. The current website already publishes prices and starting prices for consultations, hair transplants, injectables, skin boosters and other treatments.',
  medical_accuracy_owner: 'Dr Jamie should have final responsibility for approving medical claims, treatment information, risks, contraindications and clinical result descriptions.',
  hair_photo_upload: 'Yes. The FUE page already invites prospective patients to send photographs by WhatsApp for a quote, so a secure pre-consultation photo-upload route would formalise an existing patient journey.',
  enquiry_sources: 'Website contact forms, Wix online bookings, telephone, email, WhatsApp, Instagram and Facebook should be represented as enquiry sources.',
  patient_stages: 'New enquiry; Contacted; Consultation booked; Consultation completed; Treatment plan sent; Treatment booked; Completed; Not proceeding.',
  admin_capabilities: 'Manage appointments and availability; view and update leads; add notes and follow-up actions; manage treatments and prices; publish articles; upload patient results; export data; and report on bookings, lead sources and conversion.',
  records_separation: 'Yes. The website system should manage marketing enquiries and consultation bookings only. Confidential clinical records should remain in an appropriate dedicated clinical record system.',
  personal_story: 'Yes. The existing site already explains that Dr Jamie had a hair transplant in 2020 and that the experience led him to retrain in hair transplant surgery. It is one of the clearest differentiators in the current positioning.',
  seo_locations: 'Primary focus: Manchester and Bury. Secondary local reach: Darwen, Blackburn and Lancashire, subject to confirming the active clinic locations and avoiding claims for places without a genuine operating presence.',
  seo_article_selection: 'Yes. The existing blog is already weighted toward hair loss, including finasteride, minoxidil, dutasteride, treatment options and transplant costs. The first four new articles should fill the strongest commercial and local-search gaps rather than duplicate those topics.'
};

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character));
const label = (value: string) => value === 'cnvrt' ? 'CNVRT' : value.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());

export const initialiseClientAdmin = () => {
  const root = document.querySelector<HTMLElement>('[data-client-admin]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  const url = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();
  const authView = root.querySelector<HTMLElement>('[data-auth-view]');
  const workspace = root.querySelector<HTMLElement>('[data-workspace]');
  const loginForm = root.querySelector<HTMLFormElement>('[data-login-form]');
  const loginStatus = root.querySelector<HTMLElement>('[data-login-status]');
  const list = root.querySelector<HTMLElement>('[data-client-list]');
  const dialog = root.querySelector<HTMLDialogElement>('[data-client-dialog]');
  let client: SupabaseClient | null = url && key ? createClient(url, key) : null;
  let clients: Client[] = [];
  let projects: Project[] = [];
  let active: Project | null = null;

  const showAuth = () => { if (authView) authView.hidden = false; if (workspace) workspace.hidden = true; };
  const showWorkspace = () => { if (authView) authView.hidden = true; if (workspace) workspace.hidden = false; };
  const setSync = (message: string) => { const element = root.querySelector<HTMLElement>('[data-sync-status]'); if (element) element.textContent = message; };

  const progress = (project: Project) => {
    const required = project.project_onboarding_items.filter(({ is_required }) => is_required);
    const complete = required.filter(({ status }) => status === 'complete').length;
    return { complete, total: required.length, percentage: required.length ? Math.round(complete / required.length * 100) : 100 };
  };

  const renderMetrics = () => {
    const values = {
      clients: clients.length,
      client: projects.reduce((sum, project) => sum + project.project_onboarding_items.filter((item) => ['client', 'both'].includes(item.owner) && item.status !== 'complete').length, 0),
      cnvrt: projects.reduce((sum, project) => sum + project.project_onboarding_items.filter((item) => ['cnvrt', 'both'].includes(item.owner) && item.status !== 'complete').length, 0),
      ready: projects.filter((project) => progress(project).percentage === 100).length,
    };
    Object.entries(values).forEach(([name, value]) => { const element = root.querySelector<HTMLElement>(`[data-client-metric="${name}"]`); if (element) element.textContent = String(value).padStart(2, '0'); });
  };

  const renderList = () => {
    if (!list) return;
    if (!clients.length) { list.innerHTML = '<div class="admin-empty-state"><span>00</span><strong>No clients yet</strong><p>Convert a qualified enquiry into a client, or add a client through the finance workspace.</p></div>'; return; }
    const projectRows = projects.map((project) => {
      const state = progress(project);
      const hasDiscovery = Boolean(project.enquiries?.discovery_data && Object.keys(project.enquiries.discovery_data).length);
      return `<button class="client-row" type="button" data-project-id="${project.id}"><span><i>${escapeHtml(label(project.status))}</i><small>${escapeHtml(project.service ? label(project.service) : 'Focused project')}</small></span><span><b>${escapeHtml(project.clients.company_name)}</b><small>${escapeHtml(project.clients.primary_contact_name || project.clients.primary_contact_email || 'Contact not supplied')}</small></span><span><b>${escapeHtml(project.name)}</b><small>${hasDiscovery ? 'Questionnaire complete · ' : ''}${state.complete} of ${state.total} steps complete</small></span><span class="client-row__progress"><strong>${state.percentage}%</strong><i><b style="width:${state.percentage}%"></b></i></span><span>↗</span></button>`;
    });
    const projectClientIds = new Set(projects.map(({ client_id }) => client_id));
    const directoryRows = clients.filter(({ id }) => !projectClientIds.has(id)).sort((a, b) => a.company_name.localeCompare(b.company_name)).map((record) => `<div class="client-row client-row--record"><span><i>${escapeHtml(label(record.status || 'client'))}</i><small>CRM client</small></span><span><b>${escapeHtml(record.company_name)}</b><small>${escapeHtml(record.primary_contact_name || record.primary_contact_email || 'Contact not supplied')}</small></span><span><b>Client record</b><small>No active onboarding project</small></span><span class="client-row__progress"><strong>Recorded</strong></span><span aria-hidden="true">•</span></div>`);
    list.innerHTML = [...projectRows, ...directoryRows].join('');
  };

  const renderDialog = () => {
    if (!active || !dialog) return;
    const state = progress(active);
    const name = dialog.querySelector<HTMLElement>('[data-client-project-name]');
    const company = dialog.querySelector<HTMLElement>('[data-client-company]');
    const email = dialog.querySelector<HTMLAnchorElement>('[data-client-email]');
    const projectStatus = dialog.querySelector<HTMLElement>('[data-client-project-status]');
    const progressText = dialog.querySelector<HTMLElement>('[data-client-progress]');
    const progressBar = dialog.querySelector<HTMLElement>('[data-client-progress-bar]');
    const tasks = dialog.querySelector<HTMLElement>('[data-client-tasks]');
    const discoverySection = dialog.querySelector<HTMLElement>('[data-client-discovery]');
    const discoveryAnswers = dialog.querySelector<HTMLElement>('[data-client-discovery-answers]');
    if (name) name.textContent = active.name;
    if (company) company.textContent = active.clients.company_name;
    if (email) { email.textContent = active.clients.primary_contact_email || 'Email not supplied'; email.href = active.clients.primary_contact_email ? `mailto:${active.clients.primary_contact_email}` : '#'; }
    if (projectStatus) projectStatus.textContent = label(active.status);
    if (progressText) progressText.textContent = `${state.percentage}%`;
    if (progressBar) progressBar.style.width = `${state.percentage}%`;
    const discoveryEntries = Object.entries(active.enquiries?.discovery_data || {}).filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value));
    if (discoverySection && discoveryAnswers) {
      discoverySection.hidden = discoveryEntries.length === 0;
      discoveryAnswers.innerHTML = discoveryEntries.map(([key, value]) => `<article><span>${escapeHtml(discoveryFieldLabels[key] || label(key))}</span><p>${escapeHtml(Array.isArray(value) ? value.join(', ') : String(value))}</p></article>`).join('');
    }
    if (tasks) tasks.innerHTML = active.project_onboarding_items.sort((a, b) => a.position - b.position).map((item) => `<article class="client-task" data-task-id="${item.id}" data-state="${item.status}"><div><span>${String(item.position).padStart(2, '0')} / ${escapeHtml(label(item.owner))}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.guidance)}</p>${item.response_text ? `<blockquote>${escapeHtml(item.response_text)}</blockquote>` : ''}</div><label><span>Status</span><select data-task-status><option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option><option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>In progress</option><option value="complete" ${item.status === 'complete' ? 'selected' : ''}>Complete</option><option value="not_applicable" ${item.status === 'not_applicable' ? 'selected' : ''}>Not applicable</option></select></label></article>`).join('');
  };

  const load = async () => {
    if (!client) return;
    setSync('Syncing client workspaces');
    const [clientResult, projectResult] = await Promise.all([
      client.from('clients').select('id,company_name,primary_contact_name,primary_contact_email,status').order('company_name'),
      client.from('projects').select('id,client_id,enquiry_id,name,service,status,target_start_date,clients(id,company_name,primary_contact_name,primary_contact_email,status),enquiries(discovery_data),project_onboarding_items(id,position,title,guidance,owner,response_type,is_required,status,response_text)').order('created_at', { ascending: false }),
    ]);
    const error = clientResult.error || projectResult.error;
    if (error) { setSync('Client data unavailable'); if (list) list.innerHTML = `<div class="admin-empty-state"><strong>Could not load clients</strong><p>${escapeHtml(error.message)}</p></div>`; return; }
    clients = (clientResult.data || []) as Client[];
    projects = (projectResult.data || []) as unknown as Project[];
    renderMetrics(); renderList(); setSync('Client data is current');
    if (active) { active = projects.find(({ id }) => id === active?.id) || null; if (active) renderDialog(); }
  };

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client) return;
    const form = new FormData(loginForm);
    const { error } = await client.auth.signInWithPassword({ email: String(form.get('email') || ''), password: String(form.get('password') || '') });
    if (error) { if (loginStatus) loginStatus.textContent = error.message; return; }
    showWorkspace(); load();
  });
  root.querySelector('[data-sign-out]')?.addEventListener('click', async () => { await client?.auth.signOut(); showAuth(); });
  root.querySelector('[data-refresh]')?.addEventListener('click', load);
  root.querySelector('[data-client-refresh]')?.addEventListener('click', load);
  list?.addEventListener('click', (event) => { const button = (event.target as HTMLElement).closest<HTMLElement>('[data-project-id]'); if (!button) return; active = projects.find(({ id }) => id === button.dataset.projectId) || null; if (active) { renderDialog(); dialog?.showModal(); } });
  dialog?.querySelector('[data-client-close]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog?.querySelector('[data-client-link]')?.addEventListener('click', async () => {
    if (!client || !active) return;
    const status = dialog.querySelector<HTMLElement>('[data-client-link-status]');
    if (status) status.textContent = 'Generating a new private link…';
    const { data, error } = await client.rpc('rotate_project_portal_token', { p_project_id: active.id });
    if (error) { if (status) status.textContent = error.message; return; }
    const link = `${window.location.origin}/client/?token=${data}`;
    await navigator.clipboard.writeText(link);
    if (status) status.innerHTML = `Access link copied. <a href="${escapeHtml(link)}" target="_blank" rel="noopener">Open access checklist ↗</a>`;
  });
  dialog?.querySelector('[data-client-questionnaire-link]')?.addEventListener('click', async () => {
    if (!client || !active?.enquiry_id) return;
    const status = dialog.querySelector<HTMLElement>('[data-client-questionnaire-status]');
    const button = dialog.querySelector<HTMLButtonElement>('[data-client-questionnaire-link]');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Creating the private questionnaire link…';
    const { data, error } = await client.rpc('generate_discovery_questionnaire_token', { p_enquiry_id: active.enquiry_id });
    if (button) button.disabled = false;
    if (error || !data) { if (status) status.textContent = error?.message || 'The questionnaire link could not be created.'; return; }
    const link = `${window.location.origin}/web-design-discovery/?token=${data}`;
    await navigator.clipboard.writeText(link);
    if (status) status.innerHTML = `Questionnaire link copied. <a href="${escapeHtml(link)}" target="_blank" rel="noopener">Open and check form ↗</a>`;
  });
  dialog?.querySelector('[data-copy-discovery]')?.addEventListener('click', async () => {
    if (!active) return;
    const status = dialog.querySelector<HTMLElement>('[data-client-discovery-status]');
    const entries = Object.entries(active.enquiries?.discovery_data || {}).filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value));
    const text = entries.map(([key, value]) => `${discoveryFieldLabels[key] || label(key)}\n${Array.isArray(value) ? value.join(', ') : String(value)}`).join('\n\n');
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = 'All questionnaire answers copied.';
  });
  dialog?.querySelector('[data-apply-discovery-template]')?.addEventListener('click', async () => {
    if (!active || !client || !active.enquiry_id) return;
    const status = dialog.querySelector<HTMLElement>('[data-client-discovery-status]');
    const button = dialog.querySelector<HTMLButtonElement>('[data-apply-discovery-template]');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Adding the suggested answers…';
    const { error } = await client.rpc('apply_discovery_template_answers', { p_enquiry_id: active.enquiry_id, p_answers: discoveryTemplateAnswers });
    if (button) button.disabled = false;
    if (error) { if (status) status.textContent = error.message; return; }
    if (status) status.textContent = 'Suggested answers added. Existing client answers were preserved.';
    await load();
  });
  dialog?.querySelector('[data-client-tasks]')?.addEventListener('change', async (event) => {
    const select = (event.target as HTMLElement).closest<HTMLSelectElement>('[data-task-status]');
    const task = select?.closest<HTMLElement>('[data-task-id]');
    if (!select || !task || !client) return;
    const complete = select.value === 'complete';
    const { error } = await client.from('project_onboarding_items').update({ status: select.value, completed_at: complete ? new Date().toISOString() : null, completed_by: complete ? 'cnvrt' : null }).eq('id', task.dataset.taskId);
    const status = dialog.querySelector<HTMLElement>('[data-client-save-status]');
    if (status) status.textContent = error ? error.message : 'Checklist updated.';
    if (!error) load();
  });

  client?.auth.getSession().then(({ data }) => { if (data.session) { showWorkspace(); load(); } else showAuth(); });
};
