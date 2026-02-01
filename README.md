# Southern Navigators — website replacement project

This repo contains the **new Southern Navigators Orienteering Club website** (Astro + Decap CMS) and the plan/docs for the replacement. The live site is https://www.southernnavigators.com/; the old stack (Craft CMS v2, PHP 5/7) is end-of-life.

## Contents

| File / folder | Purpose |
|---------------|---------|
| **PLAN.md** | Full plan: current state, stack, phases, hosting. |
| **ORIGINAL_PROMPT.md** | Chairman’s request and constraints. |
| **CONTENT_CMS_SPEC.md** | Content types and CMS fields (from current CMS video). |
| **COMMITTEE_CMS_GUIDE.md** | How to log in and edit events, news, contacts (for committee). |
| **README.md** | This file. |
| **src/** | Astro site: pages, layouts, content collections. |
| **public/** | Static assets, `/admin` (Decap CMS), `_redirects`, favicon. |

## Requirements

- **Node.js** ≥ 18.20.8 (or ≥ 20.x recommended). Check with `node -v`.
- npm (or pnpm/yarn).

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:4321/. The dev server reloads when you change content or code.

## Build

```bash
npm run build
```

Output is in `dist/` (static HTML, CSS, assets). Preview with:

```bash
npm run preview
```

## Content migration (scrape)

To pull **all** content from the current southernnavigators.com site:

```bash
npm run scrape
```

This fetches (with delays and retries to avoid overloading the server):

- **Site images** — Header photos (e.g. `Header-9.jpg` → `public/images/header.jpg`, `header_events.jpg`) so the hero band can use the real header after scrape.
- **Events** — `/events` and each event detail page → `src/content/events/*.md`. Any images in event body content are downloaded to `public/images/events/` and rewritten to local paths in the markdown.
- **News / Archive** — All archive pages and each post → `src/content/news/*.md`. Images in post bodies → `public/images/news/`.
- **Info pages** — `/info` and each info page → `src/content/pages/*.md`. Images in page bodies → `public/images/pages/`.
- **Redirects** — `public/_redirects`: old URLs → new paths.

Only images hosted on southernnavigators.com are downloaded (external URLs like maps are skipped). The layout uses the scraped `header.jpg` for the hero band when that file exists after running the scraper. Category and pagination links on the archive are skipped. Re-run after adding new content on the old site if needed. The script takes several minutes due to per-request delays.

## Deploy (preview for committee)

To get the site and CMS live so you can share a link and try editing:

1. **Push this repo to GitHub** (create a repo, then `git init` / `git add .` / `git commit` / `git remote add origin ...` / `git push -u origin main`).
2. **Deploy on Netlify:** [app.netlify.com](https://app.netlify.com) → Add new site → Import from GitHub → select repo → build command **`npm run build`**, publish directory **`dist`** → Deploy.
3. **Enable the CMS:** In Netlify → Site configuration → **Identity** → Enable Identity → **Services** → **Enable Git Gateway**. Then **Identity** → Invite users (committee emails).
4. **Share:** Send the Netlify URL (e.g. `https://yoursite.netlify.app`) and **`/admin/`** to the committee; they log in with the email they were invited to.

Full step-by-step: **DEPLOY.md**. CMS guide for editors: **COMMITTEE_CMS_GUIDE.md**.

## Repo layout

- `src/pages/` — Routes (home, events, news, contacts, calendar.ics, catch‑all for info pages).
- `src/layouts/Layout.astro` — Header, nav, footer.
- `src/content/` — Content collections: `events/`, `news/`, `pages/`, `contacts/`.
- `public/admin/` — Decap CMS (`config.yml`, `index.html`).
- `public/_redirects` — Netlify redirects (old URLs → new).

## Next steps (from PLAN.md)

- **Phase 3:** Migrate content from the current site (see PLAN.md §5).
- **Phase 4:** Deploy and point southernnavigators.com DNS to the new host.
- **Phase 5:** Finalise MAINTENANCE.md and handover.
