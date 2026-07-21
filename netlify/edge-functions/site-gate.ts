type EdgeContext = {
  next: () => Promise<Response>;
};

declare const Netlify: {
  env: {
    get: (name: string) => string | undefined;
  };
};

const COOKIE_NAME = 'cnvrt_preview';
const COOKIE_DURATION = 60 * 60 * 24;

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const secureEqual = (first: string, second: string) => {
  if (first.length !== second.length) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }
  return difference === 0;
};

const readCookie = (request: Request, name: string) => {
  const cookies = request.headers.get('cookie')?.split(';') || [];
  const match = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.trim().slice(name.length + 1)) : '';
};

const renderGate = (path: string, message = '') => `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <meta name="theme-color" content="#f7f6f2" />
    <title>Private preview | CNVRT</title>
    <style>
      :root { color-scheme: light; --ink: #171719; --paper: #f7f6f2; --muted: #68656d; --line: rgba(23,23,25,.15); --accent: #775fc0; --accent-light: #d9d0ef; --ease: cubic-bezier(.2,.8,.2,1); }
      * { box-sizing: border-box; }
      html { min-width: 320px; background: var(--paper); }
      body { min-height: 100svh; margin: 0; background: var(--paper); color: var(--ink); font-family: Arial, Helvetica, sans-serif; }
      button, input { font: inherit; }
      .skip { position: fixed; z-index: 5; top: .75rem; left: .75rem; padding: .7rem 1rem; background: var(--ink); color: var(--paper); transform: translateY(-160%); }
      .skip:focus { transform: none; }
      .gate { display: grid; min-height: 100svh; grid-template-rows: auto 1fr auto; width: min(100% - 2.5rem, 76rem); margin: 0 auto; }
      .gate__top, .gate__bottom { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.2rem 0; border-color: var(--line); }
      .gate__top { border-bottom: 1px solid var(--line); }
      .gate__bottom { border-top: 1px solid var(--line); color: var(--muted); font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; }
      .brand img { display:block; width:7.25rem; height:auto; filter:invert(1); }
      .status { color: var(--accent); font-size: .66rem; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
      .gate__main { display: grid; align-items: center; gap: clamp(2.5rem, 7vw, 6rem); padding: clamp(3rem, 8vw, 6rem) 0; }
      .gate__copy { display: grid; max-width: 44rem; gap: 1.15rem; }
      .eyebrow { color: var(--accent); font-size: .66rem; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
      h1 { max-width: 13ch; margin: 0; font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 520; letter-spacing: -.06em; line-height: .93; }
      h1 span { color: var(--accent); }
      .intro { max-width: 35rem; margin: 0; color: var(--muted); font-size: .95rem; line-height: 1.6; }
      .gate__form { display: grid; max-width: 32rem; gap: .8rem; }
      .gate__form label { font-size: .68rem; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
      .gate__control { display: grid; gap: .75rem; }
      .gate__control input { width: 100%; min-width: 0; min-height: 3.25rem; padding: .8rem .9rem; border: 1px solid var(--line); border-radius: .35rem; outline: 0; background: #fff; color: var(--ink); }
      .gate__control input:focus { border-color: var(--accent-light); box-shadow: 0 0 0 3px rgba(201,185,238,.14); }
      .gate__control button { min-height: 3.25rem; padding: .8rem 1.15rem; border: 1px solid var(--ink); border-radius: .35rem; background: var(--ink); color: #fff; cursor: pointer; font-weight: 650; transition: background 180ms ease, color 180ms ease, transform 220ms var(--ease); }
      .gate__control button:hover, .gate__control button:focus-visible { background: var(--accent); border-color: var(--accent); transform: translateY(-1px); }
      .error { min-height: 1.3rem; margin: 0; color: #9b4e3e; font-size: .82rem; }
      @media (min-width: 42rem) { .gate { width: min(100% - 5rem, 101rem); } .gate__control { grid-template-columns: minmax(0, 1fr) auto; } .gate__control button { min-width: 10.5rem; } }
      @media (min-width: 64rem) { .gate__main { grid-template-columns: minmax(0, 1.2fr) minmax(22rem, .8fr); } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; } }
    </style>
  </head>
  <body>
    <a class="skip" href="#preview-access">Skip to preview access</a>
    <main class="gate">
      <header class="gate__top"><span class="brand"><img src="/brand/cnvrt-logo.png" alt="CNVRT" width="800" height="200"></span><span class="status">Private preview</span></header>
      <div class="gate__main">
        <div class="gate__copy">
          <span class="eyebrow">Manchester / UK</span>
          <h1>A sharper digital agency is <span>taking shape.</span></h1>
          <p class="intro">The new CNVRT website is being reviewed before launch. Enter the shared preview password to explore the work in progress.</p>
        </div>
        <form class="gate__form" id="preview-access" method="post" action="${escapeHtml(path)}">
          <label for="preview-password">Preview password</label>
          <div class="gate__control">
            <input id="preview-password" name="password" type="password" autocomplete="current-password" required autofocus />
            <button type="submit">Enter the site <span aria-hidden="true">↗</span></button>
          </div>
          <p class="error" role="alert">${escapeHtml(message)}</p>
        </form>
      </div>
      <footer class="gate__bottom"><span>CNVRT / 2026</span><span>Preview access only</span></footer>
    </main>
  </body>
</html>`;

export default async (request: Request, context: EdgeContext) => {
  const url = new URL(request.url);
  const publicClientPaths = new Set(['/invoice', '/web-design-discovery', '/thank-you', '/client']);
  const normalisedPath = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : url.pathname;
  if (publicClientPaths.has(normalisedPath)) return context.next();
  // Client-facing routes depend on the same compiled scripts, styles, fonts and
  // brand assets as the gated site. Static assets contain no private content and
  // must remain public or the forms render without their save/submit behaviour.
  if (['/_astro/', '/fonts/', '/brand/', '/images/'].some((prefix) => url.pathname.startsWith(prefix))) return context.next();
  const password = Netlify.env.get('SITE_PREVIEW_PASSWORD');

  if (!password) {
    return new Response(renderGate(url.pathname, 'Preview access is not configured yet.'), {
      status: 503,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  const expectedToken = await sha256(`cnvrt-preview:${password}`);

  if (url.searchParams.get('preview') === 'logout') {
    return new Response(null, {
      status: 303,
      headers: {
        location: '/',
        'set-cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      },
    });
  }

  const cookieToken = readCookie(request, COOKIE_NAME);
  if (cookieToken && secureEqual(cookieToken, expectedToken)) return context.next();

  if (request.method === 'POST') {
    const formData = await request.formData();
    const submittedPassword = String(formData.get('password') || '');
    const submittedToken = await sha256(`cnvrt-preview:${submittedPassword}`);

    if (secureEqual(submittedToken, expectedToken)) {
      return new Response(null, {
        status: 303,
        headers: {
          location: `${url.pathname}${url.search}`,
          'set-cookie': `${COOKIE_NAME}=${encodeURIComponent(expectedToken)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_DURATION}`,
          'cache-control': 'no-store',
        },
      });
    }

    return new Response(renderGate(url.pathname, 'That password is not correct. Please try again.'), {
      status: 401,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  return new Response(renderGate(url.pathname), {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
};
