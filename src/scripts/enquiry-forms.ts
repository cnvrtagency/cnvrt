const LAST_SUBMISSION_KEY = 'cnvrt:last-enquiry';
const SUCCESS_KEY = 'cnvrt:enquiry-success';
const DUPLICATE_WINDOW = 90_000;

const formValues = (form: HTMLFormElement) => {
  const values = new FormData(form);
  values.delete('started-at');
  values.delete('form-duration-ms');
  values.delete('company-website-confirmation');
  return Array.from(values.entries())
    .map(([key, value]) => `${key}:${String(value).trim().toLowerCase()}`)
    .sort()
    .join('|');
};

const readStoredSubmission = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LAST_SUBMISSION_KEY) || 'null') as { fingerprint: string; time: number } | null;
  } catch {
    return null;
  }
};

const setStatus = (form: HTMLFormElement, message: string, state: 'idle' | 'error' | 'success' = 'idle') => {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
};

const setSubmitting = (form: HTMLFormElement, submitting: boolean) => {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!button) return;
  button.disabled = submitting;
  button.setAttribute('aria-busy', String(submitting));
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.innerHTML;
  button.innerHTML = submitting ? 'Sending enquiry&hellip;' : button.dataset.defaultLabel;
};

const rememberSuccess = (form: HTMLFormElement) => {
  sessionStorage.setItem(SUCCESS_KEY, JSON.stringify({
    form: form.dataset.formName || form.getAttribute('name') || 'enquiry',
    time: Date.now(),
  }));
  window.dispatchEvent(new CustomEvent('cnvrt:enquiry-sent', {
    detail: { form: form.dataset.formName || form.getAttribute('name') || 'enquiry' },
  }));
};

const redirectToSuccess = (form: HTMLFormElement) => {
  rememberSuccess(form);
  window.location.assign(form.dataset.successUrl || '/thank-you/');
};

const postToEndpoint = async (form: HTMLFormElement, endpoint: string) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(form),
  });

  if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
};

const initialiseForm = (form: HTMLFormElement) => {
  if (form.dataset.formReady === 'true') return;
  form.dataset.formReady = 'true';

  const startedAt = Date.now();
  const startedAtField = form.querySelector<HTMLInputElement>('input[name="started-at"]');
  if (startedAtField) startedAtField.value = new Date(startedAt).toISOString();

  form.addEventListener('invalid', () => {
    setStatus(form, 'Please check the highlighted fields before sending your enquiry.', 'error');
  }, true);

  form.addEventListener('input', () => {
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    if (status?.dataset.state === 'error') status.hidden = true;
  });

  form.addEventListener('submit', async (event) => {
    if (!form.checkValidity()) return;

    const honeypot = form.elements.namedItem('company-website-confirmation') as HTMLInputElement | null;
    if (honeypot?.value) {
      event.preventDefault();
      redirectToSuccess(form);
      return;
    }

    const duration = Date.now() - startedAt;
    const durationField = form.querySelector<HTMLInputElement>('input[name="form-duration-ms"]');
    if (durationField) durationField.value = String(duration);

    const fingerprint = formValues(form);
    const previous = readStoredSubmission();
    if (previous && previous.fingerprint === fingerprint && Date.now() - previous.time < DUPLICATE_WINDOW) {
      event.preventDefault();
      setStatus(form, 'This enquiry was already sent. Please wait before sending the same details again.', 'error');
      return;
    }

    sessionStorage.setItem(LAST_SUBMISSION_KEY, JSON.stringify({ fingerprint, time: Date.now() }));
    setSubmitting(form, true);
    setStatus(form, 'Sending your enquiry securely.', 'idle');

    const testMode = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      ? new URLSearchParams(window.location.search).get('form-test')
      : null;

    if (testMode === 'success') {
      event.preventDefault();
      window.setTimeout(() => redirectToSuccess(form), 350);
      return;
    }

    if (testMode === 'failure') {
      event.preventDefault();
      window.setTimeout(() => {
        sessionStorage.removeItem(LAST_SUBMISSION_KEY);
        setSubmitting(form, false);
        setStatus(form, 'The enquiry could not be sent. Please try again or email hello@cnvrtdigital.co.uk.', 'error');
      }, 350);
      return;
    }

    const endpoint = form.dataset.formEndpoint;
    if (endpoint) {
      event.preventDefault();
      try {
        await postToEndpoint(form, endpoint);
        redirectToSuccess(form);
      } catch {
        sessionStorage.removeItem(LAST_SUBMISSION_KEY);
        setSubmitting(form, false);
        setStatus(form, 'The enquiry could not be sent. Please try again or email hello@cnvrtdigital.co.uk.', 'error');
      }
      return;
    }

    event.preventDefault();
    sessionStorage.removeItem(LAST_SUBMISSION_KEY);
    setSubmitting(form, false);
    setStatus(form, 'Secure form delivery is not configured yet. Please email hello@cnvrtdigital.co.uk.', 'error');
  });
};

export const initialiseEnquiryForms = () => {
  document.querySelectorAll<HTMLFormElement>('[data-enquiry-form]').forEach(initialiseForm);
};
