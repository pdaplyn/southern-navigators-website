#!/usr/bin/env node
/**
 * Scrape ALL content from southernnavigators.com for migration.
 * Run: npm run scrape
 * Output: src/content/events/, news/, pages/, public/images/, public/_redirects.
 */

import { load } from 'cheerio';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const BASE = 'https://www.southernnavigators.com';
const BASE_ORIGIN = new URL(BASE).origin;
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');

const FETCH_TIMEOUT_MS = 20000;
const DELAY_BETWEEN_REQUESTS_MS = 800;
const MAX_ARCHIVE_PAGES = 50;
const MAX_RETRIES = 2;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveUrl(href, baseUrl) {
  if (!href || href.startsWith('data:')) return null;
  try {
    const u = new URL(href.trim(), baseUrl || BASE);
    return u.origin === BASE_ORIGIN ? u.href : null;
  } catch {
    return null;
  }
}

function imageExt(url, contentType) {
  const u = (url || '').split('?')[0].toLowerCase();
  if (u.endsWith('.jpg') || u.endsWith('.jpeg') || /jpe?g$/i.test(contentType)) return '.jpg';
  if (u.endsWith('.png') || /png$/i.test(contentType)) return '.png';
  if (u.endsWith('.gif') || /gif$/i.test(contentType)) return '.gif';
  if (u.endsWith('.webp') || /webp$/i.test(contentType)) return '.webp';
  return '.jpg';
}

async function downloadImage(url, savePath) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SouthernNavigators-Migration/1.0' },
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(savePath), { recursive: true });
      await writeFile(savePath, buf);
      return savePath;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === MAX_RETRIES) throw err;
      await delay(1000);
    }
  }
}

/** Extract img tags from body HTML, download same-origin images, return replacement list and body with img -> markdown. */
async function extractAndReplaceImages(bodyHtml, context, slug, pageUrl) {
  const $ = load(bodyHtml);
  const imgs = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    const alt = ($(el).attr('alt') || '').replace(/\]/g, '');
    const resolved = resolveUrl(src, pageUrl);
    if (resolved) imgs.push({ src: resolved, alt });
  });
  if (imgs.length === 0) return bodyHtml;

  const subDir = join(IMAGES_DIR, context);
  await mkdir(subDir, { recursive: true });
  const paths = [];
  for (let i = 0; i < imgs.length; i++) {
    const { src } = imgs[i];
    const ext = imageExt(src);
    const baseName = `${slug}-${i + 1}${ext}`;
    const savePath = join(subDir, baseName);
    try {
      await delay(300);
      await downloadImage(src, savePath);
      paths.push(`/images/${context}/${baseName}`);
    } catch (err) {
      console.warn('   Image skip', src, err.message);
      paths.push(null);
    }
  }

  let idx = 0;
  const newBody = bodyHtml.replace(/<img[^>]*>/gi, () => {
    const alt = imgs[idx]?.alt ?? '';
    const path = paths[idx];
    idx++;
    return path ? `![${alt}](${path})` : '';
  });
  return newBody;
}

async function fetchHtml(url) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SouthernNavigators-Migration/1.0' },
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      return await res.text();
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === MAX_RETRIES) throw err;
      await delay(2000);
    }
  }
}

function slugFromUrl(url) {
  const path = new URL(url, BASE).pathname.replace(/\/$/, '');
  return path.split('/').pop() || 'index';
}

function extractText($, sel) {
  const el = $(sel).first();
  return el.text().replace(/\s+/g, ' ').trim() || null;
}

// --- Events ---
async function getEventUrls() {
  const html = await fetchHtml(`${BASE}/events`);
  const $ = load(html);
  const urls = new Set();
  $('a[href*="/events/"]').each((_, a) => {
    const href = $(a).attr('href');
    if (!href || href.includes('calendar.ics') || href === '/events' || href === '/events/') return;
    urls.add(href.startsWith('http') ? href : BASE + href);
  });
  return [...urls];
}

async function scrapeEvent(url) {
  const html = await fetchHtml(url);
  const $ = load(html);
  const title = extractText($, 'h1') || 'Untitled event';
  const slug = slugFromUrl(url);

  let dateStr = null;
  let location = null;
  let level = null;
  let eventTypes = [];

  $('p, .content, main, article').each((_, el) => {
    const text = $(el).text();
    const m = text.match(/Near:\s*([^\n]+?)(?=\s+Level|$)/i);
    if (m) location = m[1].trim();
    const m2 = text.match(/Level of event:\s*(\w+)/i);
    if (m2) level = m2[1];
    const m3 = text.match(/Type of event:\s*([^\n]+)/i);
    if (m3) eventTypes = m3[1].split(',').map((s) => s.trim()).filter(Boolean);
  });

  const months = { jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12 };
  const dateMatch = $('h2, h3, p').text().match(/(\w{3})\s+(\d{1,2})\s+(\w+),?\s*(\d{4})|(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (dateMatch) {
    const parts = dateMatch[0].replace(/,/g, '').split(/\s+/).filter(Boolean);
    const day = parseInt(parts[0], 10) || parseInt(parts[1], 10);
    const monthStr = (parts[1] || parts[2] || '').toLowerCase().replace(/\./g, '');
    const year = parseInt(parts[parts.length - 1], 10) || new Date().getFullYear();
    const month = months[monthStr] || months[monthStr?.slice(0, 3)] || 1;
    if (day && year) dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (!dateStr && slug.match(/\d{4}-\d{2}-\d{2}/)) {
    dateStr = slug.match(/(\d{4}-\d{2}-\d{2})/)[1];
  }

  const mainContent = $('main, .content, article').first();
  mainContent.find('h1, h2, h3').first().remove();
  let body = mainContent.html() || '';
  body = await extractAndReplaceImages(body, 'events', slug, url);
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  body = body.replace(/<[^>]+>/g, (tag) => {
    const lower = tag.toLowerCase();
    if (lower.startsWith('<h')) return '\n\n';
    if (lower.startsWith('<p')) return '\n\n';
    if (lower.startsWith('<li')) return '\n- ';
    if (lower.startsWith('<br')) return '\n';
    if (lower.startsWith('<a ')) return '';
    if (lower === '</a>') return '';
    if (lower.startsWith('<tr')) return '\n';
    return '';
  });
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  const levelMap = { Local: 'Local', Regional: 'Regional', National: 'National', Major: 'Major', Activity: 'Activity', Course: 'Course' };
  const levelVal = level && levelMap[level] ? levelMap[level] : undefined;

  return {
    slug,
    title,
    date: dateStr || '2026-01-01',
    location: location || undefined,
    level: levelVal,
    eventTypes: eventTypes.length ? eventTypes : undefined,
    body: body || title,
  };
}

// --- Archive / News (with pagination) ---
const ARCHIVE_SKIP_SLUGS = new Set([
  'juniors', 'training', 'coaching', 'social', 'events', 'members', 'leagues', 'resources',
  'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15',
]);

async function getArchiveUrls() {
  const allUrls = new Set();
  for (let pageNum = 1; pageNum <= MAX_ARCHIVE_PAGES; pageNum++) {
    const url = pageNum === 1 ? `${BASE}/archive` : `${BASE}/archive/p${pageNum}`;
    let html;
    try {
      html = await fetchHtml(url);
    } catch (err) {
      if (pageNum > 1) break;
      throw err;
    }
    const $ = load(html);
    let found = 0;
    $('a[href*="/archive/"]').each((_, a) => {
      const href = $(a).attr('href');
      if (!href || href === '/archive' || href === '/archive/') return;
      const slug = (href.split('/archive/')[1] || '').replace(/\/$/, '').split('?')[0];
      if (ARCHIVE_SKIP_SLUGS.has(slug)) return;
      const full = href.startsWith('http') ? href : BASE + href;
      if (!allUrls.has(full)) found++;
      allUrls.add(full);
    });
    if (pageNum > 1 && found === 0) break;
    await delay(DELAY_BETWEEN_REQUESTS_MS);
  }
  return [...allUrls];
}

async function scrapeArchivePost(url) {
  const html = await fetchHtml(url);
  const $ = load(html);
  const title = extractText($, 'h1') || 'Untitled';
  const slug = slugFromUrl(url);
  const subTitle = extractText($, 'h2');

  let dateStr = null;
  const bodyEl = $('main, .content, article').first();
  bodyEl.find('h1').remove();
  bodyEl.find('h2').first().remove();
  const fullText = bodyEl.text();
  const dateMatch = fullText.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/);
  if (dateMatch) {
    const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    dateStr = `${dateMatch[4]}-${String(months[dateMatch[3]] || 1).padStart(2, '0')}-${String(parseInt(dateMatch[2], 10)).padStart(2, '0')}`;
  }
  if (!dateStr) dateStr = '2026-01-01';

  let body = bodyEl.html() || '';
  body = await extractAndReplaceImages(body, 'news', slug, url);
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  body = body.replace(/<[^>]+>/g, (tag) => {
    const lower = tag.toLowerCase();
    if (lower.startsWith('<h')) return '\n\n';
    if (lower.startsWith('<p')) return '\n\n';
    if (lower.startsWith('<li')) return '\n- ';
    if (lower.startsWith('<br')) return '\n';
    if (lower.startsWith('<a ')) return '';
    if (lower === '</a>') return '';
    return '';
  });
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  return { slug, title, subTitle: subTitle || undefined, date: dateStr, body: body || title };
}

// --- Info pages ---
function normalizeInfoEntry(href) {
  if (!href || (!href.includes('/info') && !href.includes('p=info'))) return null;
  const parsed = new URL(href.startsWith('http') ? href : BASE + (href.startsWith('/') ? href : '/' + href), BASE);
  if (!parsed.origin.includes('southernnavigators.com')) return null;
  let fetchUrl = parsed.origin + parsed.pathname + (parsed.search || '');
  let slug;
  const p = parsed.searchParams.get('p');
  if (p && p.startsWith('info')) {
    const rest = p.replace(/^info\/?/, '').replace(/\/$/, '');
    slug = rest ? rest.replace(/\//g, '-') : 'information';
  } else {
    const path = parsed.pathname.replace(/^\/info\/?/, '').replace(/\/$/, '');
    slug = path ? path.replace(/\//g, '-') : 'information';
  }
  if (!slug) return null;
  return { fetchUrl, slug };
}

async function getInfoUrls() {
  const entries = new Map(); // slug -> fetchUrl
  const toFetch = [`${BASE}/info`, `${BASE}/`];
  const seen = new Set();

  while (toFetch.length) {
    const url = toFetch.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let html;
    try {
      html = await fetchHtml(url);
    } catch (err) {
      console.warn('   Skip (fetch):', url, err.message);
      continue;
    }
    const $ = load(html);
    $('a[href*="/info"], a[href*="?p=info"], a[href*="&p=info"]').each((_, a) => {
      const href = $(a).attr('href');
      const entry = normalizeInfoEntry(href);
      if (!entry) return;
      if (entry.slug === 'information' && entry.fetchUrl === `${BASE}/info`) return;
      entries.set(entry.slug, entry.fetchUrl);
      const path = new URL(entry.fetchUrl, BASE).pathname;
      if (path.startsWith('/info/') && path !== '/info') {
        const parentPath = path.replace(/\/[^/]+$/, '') || '/info';
        const parentFull = BASE + parentPath;
        if (!seen.has(parentFull) && parentPath !== '/info') toFetch.push(parentFull);
      }
    });
    await delay(DELAY_BETWEEN_REQUESTS_MS);
  }

  return [...entries.entries()].map(([slug, fetchUrl]) => ({ slug, fetchUrl }));
}

function infoUrlToRedirectPath(slug) {
  return slug;
}

async function scrapeInfoPage(fetchUrl, slug) {
  const html = await fetchHtml(fetchUrl);
  const $ = load(html);
  const title = extractText($, 'h1') || 'Untitled';

  const bodyEl = $('main, .content, article').first();
  bodyEl.find('h1').remove();
  let body = bodyEl.html() || '';
  body = await extractAndReplaceImages(body, 'pages', slug, fetchUrl);
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  body = body.replace(/<[^>]+>/g, (tag) => {
    const lower = tag.toLowerCase();
    if (lower.startsWith('<h')) return '\n\n';
    if (lower.startsWith('<p')) return '\n\n';
    if (lower.startsWith('<li')) return '\n- ';
    if (lower.startsWith('<br')) return '\n';
    if (lower.startsWith('<a ')) return '';
    if (lower === '</a>') return '';
    return '';
  });
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  const parts = slug.split('-');
  const parent = parts.length > 1 ? parts.slice(0, -1).join('-') : undefined;

  return { slug, title, parent, body: body || title };
}

// --- Write content files ---
function eventToFrontmatter(e) {
  const lines = ['---', `title: ${JSON.stringify(e.title)}`, `date: ${e.date}`];
  if (e.location) lines.push(`location: ${JSON.stringify(e.location)}`);
  if (e.level) lines.push(`level: ${e.level}`);
  if (e.eventTypes?.length) lines.push(`eventTypes: [${e.eventTypes.map((t) => JSON.stringify(t)).join(', ')}]`);
  lines.push('---', '', e.body);
  return lines.join('\n');
}

function newsToFrontmatter(n) {
  const lines = ['---', `title: ${JSON.stringify(n.title)}`, `date: ${n.date}`];
  if (n.subTitle) lines.push(`subTitle: ${JSON.stringify(n.subTitle)}`);
  lines.push('---', '', n.body);
  return lines.join('\n');
}

function pageToFrontmatter(p) {
  const lines = ['---', `title: ${JSON.stringify(p.title)}`];
  if (p.parent) lines.push(`parent: ${JSON.stringify(p.parent)}`);
  lines.push('---', '', p.body);
  return lines.join('\n');
}

const SITE_IMAGES = [
  { url: `${BASE}/images/header-photos/Header-9.jpg`, path: join(IMAGES_DIR, 'header.jpg') },
  { url: `${BASE}/assets/images/header_events.jpg`, path: join(IMAGES_DIR, 'header_events.jpg') },
  { url: `${BASE}/assets/images/logo_100.png`, path: join(ROOT, 'public', 'logo.png') },
];

async function main() {
  console.log('Scraping ALL content from southernnavigators.com...\n');
  const redirects = [];

  // --- Site-wide images (headers + logo) ---
  console.log('0. Site images (headers + logo)');
  await mkdir(IMAGES_DIR, { recursive: true });
  for (const { url, path } of SITE_IMAGES) {
    try {
      await delay(400);
      await downloadImage(url, path);
      const rel = path.startsWith(ROOT) ? path.slice(ROOT.length) : path;
      console.log('   Downloaded', rel.replace(/\\/g, '/'));
    } catch (err) {
      console.warn('   Skip', url, err.message);
    }
  }

  // --- Events ---
  console.log('1. Events');
  const eventUrls = await getEventUrls();
  console.log(`   Found ${eventUrls.length} event(s).`);
  await mkdir(join(ROOT, 'src/content/events'), { recursive: true });
  for (const url of eventUrls) {
    const slug = slugFromUrl(url);
    try {
      await delay(DELAY_BETWEEN_REQUESTS_MS);
      const e = await scrapeEvent(url);
      await writeFile(join(ROOT, 'src/content/events', `${e.slug}.md`), eventToFrontmatter(e), 'utf8');
      console.log('   Event:', e.title);
      redirects.push({ from: `/events/${slug}`, to: `/events/${e.slug}/` });
    } catch (err) {
      console.warn('   Skip', url, err.message);
    }
  }

  // --- Archive (all pages) ---
  console.log('\n2. News / Archive (with pagination)');
  let archiveUrls;
  try {
    archiveUrls = await getArchiveUrls();
  } catch (err) {
    console.warn('   Fallback: archive page 1 only.');
    archiveUrls = await getArchiveUrlsFromSinglePage();
  }
  console.log(`   Found ${archiveUrls.length} archive post(s).`);
  await mkdir(join(ROOT, 'src/content/news'), { recursive: true });
  for (const url of archiveUrls) {
    const slug = slugFromUrl(url);
    try {
      await delay(DELAY_BETWEEN_REQUESTS_MS);
      const n = await scrapeArchivePost(url);
      const path = join(ROOT, 'src/content/news', `${n.slug}.md`);
      await writeFile(path, newsToFrontmatter(n), 'utf8');
      console.log('   News:', n.title);
      redirects.push({ from: `/archive/${slug}`, to: `/news/${n.slug}/` });
    } catch (err) {
      console.warn('   Skip', url, err.message);
    }
  }

  // --- Info pages ---
  console.log('\n3. Info pages');
  let infoEntries;
  try {
    infoEntries = await getInfoUrls();
  } catch (err) {
    console.warn('   Fallback: no info pages.');
    infoEntries = [];
  }
  console.log(`   Found ${infoEntries.length} info page(s).`);
  await mkdir(join(ROOT, 'src/content/pages'), { recursive: true });
  for (const { slug, fetchUrl } of infoEntries) {
    try {
      await delay(DELAY_BETWEEN_REQUESTS_MS);
      const p = await scrapeInfoPage(fetchUrl, slug);
      const path = join(ROOT, 'src/content/pages', `${p.slug}.md`);
      await writeFile(path, pageToFrontmatter(p), 'utf8');
      console.log('   Page:', p.title);
      const toPath = infoUrlToRedirectPath(slug);
      const fromPath = new URL(fetchUrl, BASE).pathname.replace(/\/$/, '') || '/';
      if (fromPath !== '/' && fromPath !== '/info') redirects.push({ from: fromPath, to: `/${toPath}/` });
    } catch (err) {
      console.warn('   Skip', fetchUrl, err.message);
    }
  }

  // --- Redirects ---
  redirects.unshift({ from: '/archive', to: '/news/', comment: true });
  const redirectLines = [
    '# Old southernnavigators.com → new site',
    '/archive  /news/  302',
    ...redirects
      .filter((r) => !r.comment)
      .map((r) => `${r.from}  ${r.to}  302`),
  ];
  await writeFile(join(ROOT, 'public/_redirects'), redirectLines.join('\n') + '\n', 'utf8');
  console.log('\nWrote public/_redirects with', redirects.filter((r) => !r.comment).length, 'redirect(s).');
  console.log('\nDone. Run npm run build to verify.');
}

async function getArchiveUrlsFromSinglePage() {
  const html = await fetchHtml(`${BASE}/archive`);
  const $ = load(html);
  const urls = new Set();
  $('a[href*="/archive/"]').each((_, a) => {
    const href = $(a).attr('href');
    if (!href || href === '/archive' || href === '/archive/') return;
    const slug = (href.split('/archive/')[1] || '').replace(/\/$/, '').split('?')[0];
    if (ARCHIVE_SKIP_SLUGS.has(slug)) return;
    urls.add(href.startsWith('http') ? href : BASE + href);
  });
  return [...urls];
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
