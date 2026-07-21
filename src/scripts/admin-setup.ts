import { createClient } from '@supabase/supabase-js';

export const initialiseAdminSetup = () => {
  const root = document.querySelector<HTMLElement>('[data-admin-setup]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  const url = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();
  const form = root.querySelector<HTMLFormElement>('[data-setup-form]');
  const status = root.querySelector<HTMLElement>('[data-setup-status]');
  const error = root.querySelector<HTMLElement>('[data-setup-error]');
  const errorMessage = root.querySelector<HTMLElement>('[data-setup-error-message]');
  if (!url || !key) { if (error) error.hidden = false; if (errorMessage) errorMessage.textContent = 'The secure workspace is not configured.'; return; }
  const client = createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true } });

  const showSession = async () => {
    const { data } = await client.auth.getSession();
    if (data.session) { if (form) form.hidden = false; if (error) error.hidden = true; if (status) status.textContent = 'Invitation accepted. Choose your password to continue.'; return; }
    window.setTimeout(async () => {
      const refreshed = await client.auth.getSession();
      if (refreshed.data.session) { if (form) form.hidden = false; if (status) status.textContent = 'Invitation accepted. Choose your password to continue.'; }
      else { if (error) error.hidden = false; if (errorMessage) errorMessage.textContent = 'This invitation is invalid or has expired. Ask for a new invitation link.'; }
    }, 600);
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const password = String(data.get('password') || '');
    const confirm = String(data.get('confirm') || '');
    if (password.length < 12) { if (status) status.textContent = 'Use a password with at least 12 characters.'; return; }
    if (password !== confirm) { if (status) status.textContent = 'The two passwords do not match.'; return; }
    const button = form.querySelector<HTMLButtonElement>('button');
    if (button) button.disabled = true;
    if (status) status.textContent = 'Securing your workspace account…';
    const { error: updateError } = await client.auth.updateUser({ password });
    if (updateError) { if (button) button.disabled = false; if (status) status.textContent = updateError.message; return; }
    window.location.assign('/admin/');
  });

  void showSession();
};
