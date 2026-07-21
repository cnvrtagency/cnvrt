import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const distDir = resolve(process.argv[2] || 'dist');
const productionOrigin = 'https://cnvrtdigital.co.uk';

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const decode = (value = '') => value
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');

const text = (value = '') => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return decode(match?.[1] ?? match?.[2] ?? '');
};
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
const paired = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'gi'))];

const htmlFiles = walk(distDir).filter((file) => file.endsWith('.html'));
const pagePath = (file) => {
  const path = `/${relative(distDir, file).replaceAll('\\', '/')}`;
  return path === '/index.html' ? '/' : path.replace(/index\.html$/, '');
};
const pages = new Map(htmlFiles.map((file) => [pagePath(file), { file, html: readFileSync(file, 'utf8') }]));
const indexability = new Map();

const findings = [];
const add = (severity, page, check, detail) => findings.push({ severity, page, check, detail });

const resolveInternal = (href, fromPage) => {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return null;
  let url;
  try {
    url = new URL(href, `${productionOrigin}${fromPage}`);
  } catch {
    return { invalid: true, href };
  }
  if (url.origin !== productionOrigin) return null;
  return { pathname: decodeURIComponent(url.pathname), hash: decodeURIComponent(url.hash.slice(1)), href };
};

const outputExists = (pathname) => {
  if (pages.has(pathname) || pages.has(pathname.endsWith('/') ? pathname : `${pathname}/`)) return true;
  const assetPath = join(distDir, pathname.replace(/^\//, ''));
  return existsSync(assetPath) || existsSync(join(assetPath, 'index.html'));
};

const targetHtml = (pathname) => pages.get(pathname)?.html || pages.get(pathname.endsWith('/') ? pathname : `${pathname}/`)?.html;

for (const [page, { html }] of pages) {
  const titleMatches = paired(html, 'title');
  const title = text(titleMatches[0]?.[1]);
  const descriptions = tags(html, 'meta').filter((tag) => attribute(tag, 'name').toLowerCase() === 'description');
  const description = attribute(descriptions[0] || '', 'content');
  const robotsTags = tags(html, 'meta').filter((tag) => attribute(tag, 'name').toLowerCase() === 'robots');
  const robots = attribute(robotsTags[0] || '', 'content').toLowerCase();
  const indexable = !robots.includes('noindex');
  indexability.set(page, indexable);
  const canonicalTags = tags(html, 'link').filter((tag) => attribute(tag, 'rel').toLowerCase() === 'canonical');
  const canonical = attribute(canonicalTags[0] || '', 'href');
  const expectedCanonical = `${productionOrigin}${page}`;
  const h1s = paired(html, 'h1');
  const mains = tags(html, 'main');

  if (titleMatches.length !== 1 || !title) add('error', page, 'title', `Expected one non-empty title, found ${titleMatches.length}.`);
  if (descriptions.length !== 1 || !description) add('error', page, 'description', `Expected one non-empty meta description, found ${descriptions.length}.`);
  if (robotsTags.length !== 1) add('error', page, 'robots', `Expected one robots meta tag, found ${robotsTags.length}.`);
  if (indexable && canonicalTags.length !== 1) add('error', page, 'canonical', `Expected one canonical, found ${canonicalTags.length}.`);
  if (indexable && canonical && canonical !== expectedCanonical) add('error', page, 'canonical', `Expected ${expectedCanonical}, found ${canonical}.`);
  if (page !== '/admin/' && h1s.length !== 1) add('error', page, 'h1', `Expected one H1, found ${h1s.length}.`);
  if (page !== '/admin/' && mains.length !== 1) add('error', page, 'main', `Expected one main landmark, found ${mains.length}.`);
  if (!/<html\b[^>]*\blang="en-GB"/i.test(html)) add('error', page, 'language', 'Missing html lang="en-GB".');
  if (!/<meta\b[^>]*name="viewport"[^>]*>/i.test(html)) add('error', page, 'viewport', 'Missing viewport meta tag.');
  if (title.length > 65) add('review', page, 'title length', `${title.length} characters: ${title}`);
  if (description.length > 165 || (description && description.length < 70)) add('review', page, 'description length', `${description.length} characters.`);

  const ids = tags(html, '[a-z][a-z0-9:-]*').flatMap((tag) => {
    const id = attribute(tag, 'id');
    return id ? [id] : [];
  });
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) add('error', page, 'duplicate IDs', duplicateIds.join(', '));

  for (const image of tags(html, 'img')) {
    if (!/\salt(?:\s|=|>)/i.test(image)) add('error', page, 'image alt', attribute(image, 'src') || 'Image without src');
    if (!attribute(image, 'width') || !attribute(image, 'height')) add('review', page, 'image dimensions', attribute(image, 'src') || 'Image without src');
    const src = attribute(image, 'src');
    if (src?.startsWith('/') && !outputExists(src.split(/[?#]/)[0])) add('error', page, 'image source', `Missing ${src}.`);
  }

  for (const script of paired(html, 'script')) {
    if (!/type=(?:"application\/ld\+json"|'application\/ld\+json')/i.test(script[0])) continue;
    try {
      JSON.parse(script[1]);
    } catch (error) {
      add('error', page, 'JSON-LD', error.message);
    }
  }

  for (const anchor of paired(html, 'a')) {
    const openingTag = anchor[0].slice(0, anchor[0].indexOf('>') + 1);
    const href = attribute(openingTag, 'href');
    const resolved = resolveInternal(href, page);
    if (resolved?.invalid) {
      add('error', page, 'link URL', `Invalid href: ${href}`);
      continue;
    }
    if (resolved && !outputExists(resolved.pathname)) add('error', page, 'internal link', `Missing target ${href}.`);
    if (resolved?.hash && outputExists(resolved.pathname)) {
      const target = targetHtml(resolved.pathname);
      if (target && !new RegExp(`\\sid=(?:"${resolved.hash}"|'${resolved.hash}')`, 'i').test(target)) {
        add('error', page, 'fragment link', `Missing #${resolved.hash} in ${resolved.pathname}.`);
      }
    }
    const accessibleText = text(anchor[1]) || attribute(openingTag, 'aria-label') || attribute(openingTag, 'title');
    const imageAlt = tags(anchor[1], 'img').map((image) => attribute(image, 'alt')).join(' ').trim();
    if (!accessibleText && !imageAlt) add('error', page, 'link name', `Unnamed link to ${href || '(empty href)'}.`);
  }
}

for (const key of ['title', 'description']) {
  const values = new Map();
  for (const [page, { html }] of pages) {
    const value = key === 'title'
      ? text(paired(html, 'title')[0]?.[1])
      : attribute(tags(html, 'meta').find((tag) => attribute(tag, 'name').toLowerCase() === 'description') || '', 'content');
    if (!value) continue;
    values.set(value, [...(values.get(value) || []), page]);
  }
  for (const [value, matchedPages] of values) {
    if (matchedPages.length > 1) add('error', matchedPages.join(', '), `duplicate ${key}`, value);
  }
}

const robotsPath = join(distDir, 'robots.txt');
if (!existsSync(robotsPath)) {
  add('error', '/robots.txt', 'robots file', 'Missing robots.txt.');
} else {
  const robotsFile = readFileSync(robotsPath, 'utf8');
  if (!/^User-agent:\s*\*/im.test(robotsFile)) add('error', '/robots.txt', 'robots file', 'Missing wildcard user-agent directive.');
  if (!/^Allow:\s*\/$/im.test(robotsFile)) add('error', '/robots.txt', 'robots file', 'Missing Allow: / directive.');
  if (!new RegExp(`^Sitemap:\\s*${productionOrigin.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}/sitemap-index\\.xml$`, 'im').test(robotsFile)) {
    add('error', '/robots.txt', 'robots file', 'Missing production sitemap index directive.');
  }
}

const sitemapIndexPath = join(distDir, 'sitemap-index.xml');
if (!existsSync(sitemapIndexPath)) add('error', '/sitemap-index.xml', 'sitemap index', 'Missing sitemap index.');

const sitemapFiles = walk(distDir).filter((file) => /sitemap-(?!index)[^/]*\.xml$/.test(file));
if (!sitemapFiles.length) {
  add('error', '/sitemap-index.xml', 'sitemap', 'No generated child sitemap found.');
} else {
  const sitemapUrls = new Set(sitemapFiles.flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]))));
  const expectedUrls = new Set([...indexability].filter(([, indexable]) => indexable).map(([page]) => `${productionOrigin}${page}`));

  for (const url of expectedUrls) {
    if (!sitemapUrls.has(url)) add('error', new URL(url).pathname, 'sitemap membership', 'Indexable page is missing from the sitemap.');
  }
  for (const url of sitemapUrls) {
    if (!expectedUrls.has(url)) add('error', new URL(url).pathname, 'sitemap membership', 'Noindexed or unknown page is present in the sitemap.');
  }
}

const summary = {
  pages: pages.size,
  errors: findings.filter((finding) => finding.severity === 'error').length,
  reviews: findings.filter((finding) => finding.severity === 'review').length,
};

console.log(JSON.stringify({ summary, findings }, null, 2));
process.exitCode = summary.errors ? 1 : 0;
