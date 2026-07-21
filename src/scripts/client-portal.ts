type PortalItem = {
  id: string;
  position: number;
  title: string;
  guidance: string;
  owner: 'client' | 'cnvrt' | 'both';
  response_type: 'text' | 'url' | 'confirmation';
  is_required: boolean;
  status: 'pending' | 'in_progress' | 'complete' | 'not_applicable';
  response_text: string | null;
};

type PortalProject = {
  id: string;
  name: string;
  status: string;
  progress: number;
  completed: number;
  total: number;
  items: PortalItem[];
};

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character] || character));
const cleanClientText = (value: string) => value.replaceAll(' — ', ' | ').replaceAll('—', '-');

export const initialiseClientPortal = () => {
  const root = document.querySelector<HTMLElement>('[data-client-portal]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  const endpoint = root.dataset.endpoint || '';
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const loading = root.querySelector<HTMLElement>('[data-portal-loading]');
  const errorView = root.querySelector<HTMLElement>('[data-portal-error]');
  const workspace = root.querySelector<HTMLElement>('[data-portal-workspace]');
  const itemsRoot = root.querySelector<HTMLElement>('[data-portal-items]');
  let project: PortalProject | null = null;

  const showError = (message: string) => {
    if (loading) loading.hidden = true;
    if (workspace) workspace.hidden = true;
    if (errorView) errorView.hidden = false;
    const messageElement = root.querySelector<HTMLElement>('[data-portal-error-message]');
    if (messageElement) messageElement.textContent = message;
  };

  const updateSummary = () => {
    if (!project) return;
    const title = root.querySelector<HTMLElement>('[data-portal-title]');
    const progress = root.querySelector<HTMLElement>('[data-portal-progress]');
    const complete = root.querySelector<HTMLElement>('[data-portal-completed]');
    const total = root.querySelector<HTMLElement>('[data-portal-total]');
    const bar = root.querySelector<HTMLElement>('[data-portal-progress-bar]');
    if (title) title.textContent = cleanClientText(project.name);
    if (progress) progress.textContent = `${project.progress}%`;
    if (complete) complete.textContent = String(project.completed);
    if (total) total.textContent = String(project.total);
    if (bar) bar.style.width = `${project.progress}%`;
  };

  const render = () => {
    if (!project || !itemsRoot) return;
    updateSummary();
    itemsRoot.innerHTML = project.items.map((item) => {
      const clientCanEdit = item.owner === 'client' || item.owner === 'both';
      const complete = item.status === 'complete';
      const field = item.response_type === 'confirmation'
        ? ''
        : `<label><span>${item.response_type === 'url' ? 'Secure link' : 'Your response'}</span><textarea rows="4" ${clientCanEdit ? '' : 'disabled'} data-item-response placeholder="${item.response_type === 'url' ? 'https://drive.google.com/…' : 'Add the useful information here…'}">${escapeHtml(item.response_text || '')}</textarea></label>`;
      const resourceLink = item.response_type === 'url' && /^https:\/\//.test(item.response_text || '')
        ? `<a class="portal-resource-link" href="${escapeHtml(item.response_text || '')}" target="_blank" rel="noopener">Open upload folder <span>↗</span></a>`
        : '';
      return `<article class="portal-item" data-portal-item="${item.id}" data-state="${item.status}">
        <div class="portal-item__number">${String(item.position).padStart(2, '0')}</div>
        <div class="portal-item__body">
          <div class="portal-item__meta"><span>${escapeHtml(item.owner === 'cnvrt' ? 'CNVRT action' : 'Your action')}</span><i>${complete ? 'Complete' : item.status === 'in_progress' ? 'In progress' : 'Pending'}</i></div>
          <h3>${escapeHtml(cleanClientText(item.title))}</h3><p>${escapeHtml(cleanClientText(item.guidance))}</p>${resourceLink}${field}
          ${clientCanEdit ? `<div class="portal-item__actions"><p data-item-status role="status" aria-live="polite"></p><button type="button" data-item-save>${complete ? 'Update response' : 'Save progress'}</button><button type="button" class="portal-complete" data-item-complete>${complete ? 'Mark incomplete' : 'Mark complete'} <span>↗</span></button></div>` : '<small>CNVRT will complete this step.</small>'}
        </div>
      </article>`;
    }).join('');
  };

  const load = async () => {
    if (!endpoint || !token) return showError('Check that you opened the complete private link supplied by CNVRT.');
    try {
      const response = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The workspace could not be loaded.');
      project = result.project;
      if (loading) loading.hidden = true;
      if (errorView) errorView.hidden = true;
      if (workspace) workspace.hidden = false;
      render();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'The workspace could not be loaded.');
    }
  };

  const save = async (article: HTMLElement, complete: boolean) => {
    if (!project) return;
    const itemId = article.dataset.portalItem || '';
    const item = project.items.find(({ id }) => id === itemId);
    if (!item) return;
    const textarea = article.querySelector<HTMLTextAreaElement>('[data-item-response]');
    const status = article.querySelector<HTMLElement>('[data-item-status]');
    const saveButtons = article.querySelectorAll<HTMLButtonElement>('button');
    saveButtons.forEach((button) => { button.disabled = true; });
    if (status) status.textContent = 'Saving…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, itemId, responseText: textarea?.value || '', complete }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your update could not be saved.');
      project = result.project;
      render();
    } catch (error) {
      if (status) status.textContent = error instanceof Error ? error.message : 'Your update could not be saved.';
      saveButtons.forEach((button) => { button.disabled = false; });
    }
  };

  itemsRoot?.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
    const article = button?.closest<HTMLElement>('[data-portal-item]');
    if (!button || !article) return;
    const item = project?.items.find(({ id }) => id === article.dataset.portalItem);
    save(article, button.hasAttribute('data-item-complete') ? item?.status !== 'complete' : false);
  });

  load();
};
