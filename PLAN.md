# Southern Navigators Website Replacement — Plan of Action

**Version:** 1.0  
**Date:** 1 February 2026  
**Status:** For technical review — awaiting go-ahead to execute  
**Owner:** Southern Navigators Orienteering Club (Chair: Peter Daplyn)

---

## 1. Executive summary

The club’s current website (southernnavigators.com) runs on **Craft CMS v2** and **PHP 5/7**, which are end-of-life. The developer (Paul Frost, pfweb.co.uk) has given notice: hosting is paid to **June 2026** and he cannot promise to keep the site running after that. This plan proposes replacing the site and CMS with a modern stack, migrating existing content, and providing a **non-technical CMS** for committee use, with **minimal ongoing maintenance and hosting cost**.

---

## 2. Current state (from agency email and site audit)

### 2.1 Developer email (Gmail – FW: SN website hosting.pdf)

- **Hosting:** £135/year; invoice covers hosting to **June 2026**.
- **Stack:** Craft CMS v2, PHP 5 (currently running on PHP 7). Craft is now v5.8 (PHP 8.3); Craft 2 does not run on later PHP.
- **Position:** Developer is not taking new business or major updates; will only do minor updates (e.g. recent Coaching changes). Site needs a **major update** soon.
- **Risks:** Site 8+ years old; underlying web stack changes (security, hosting) mean things will increasingly “not work quite right”; many hosts will not run old PHP; his own server costs for security and legacy PHP are rising.
- **Recommendation:** Treat as **build from scratch** (or longer) due to content transfer; aim to have a **new site/developer by June 2026**.

### 2.2 Site structure (from southernnavigators.com)

| Section | Purpose | Content type |
|--------|---------|--------------|
| **Home** | Future events teaser, latest news, newcomer CTA | Dynamic (events + archive) |
| **Events** | Club events list, calendar.ics subscription, neighbouring clubs table | Events (date, title, location, level, link) |
| **Archive** | News/articles (e.g. results, team events, membership) | News entries (title, date, body, optional image) |
| **Results** | (Linked from nav) | Likely results/links |
| **Newcomers / Information** | What is orienteering, FAQ, contacts, juniors, policies, POCs, roll of honour, leagues | Static + nested pages |
| **Membership** | Join/renew | Static |
| **Contacts** | Committee/roles, coaches, event controllers | Structured contacts |
| **Juniors** | Junior league, Clubmark, past winners | Mixed static + lists |
| **Mapped Areas** | Map info | Static |
| **Photos** | Gallery | Media |
| **Sitemap** | Full list of news + events + info pages | Generated |

**Key features to replicate**

- **Events:** List by date, “Near”, level; link to event detail; **calendar.ics** for subscription.
- **Archive/News:** Chronological list; entry = title, date, excerpt, image (optional), “Read more” to full post.
- **Info tree:** Hierarchical pages (e.g. New to O → FAQ, Contacts → Coaches/Event Controllers).
- **Header image:** Rotatable/customizable (current: header photos).
- **RSS** (mentioned in search results).
- **British Orienteering / external links** (e.g. neighbouring events).

**Content volume (from sitemap)**

- **News/archive:** ~100+ entries.
- **Events:** Many past + future; need future + recent past.
- **Info:** Dozens of static/nested pages.

---

## 3. Goals and constraints

| Goal | Detail |
|------|--------|
| **Replace site and CMS** | New front-end and CMS; no dependency on Craft 2 / legacy PHP. |
| **Migrate content** | Events, archive/news, info pages, contacts, key images and structure. |
| **Committee-friendly CMS** | Non-technical editors (chair, committee) can add/edit events, news, and static pages without coding. |
| **Low ongoing cost** | Minimize hosting + maintenance after launch. |
| **Documentation and automation** | Plan, prompts, and runbooks documented so a technical club member (or AI agent) can review and continue work. |

**Constraints**

- **Deadline:** New site live (or clearly on track) by **June 2026**.
- **Budget:** Not specified; plan assumes **minimal recurring cost** (see hosting options below).
- **Editor skill:** No technical knowledge required for day-to-day content.

---

## 4. Recommended approach: static site + headless CMS (Jamstack-style)

To minimize cost and maintenance while keeping the site fast and secure:

### 4.1 Option A (recommended): Static site generator + Git-based or hosted headless CMS

- **Site:** [Astro](https://astro.build) or [Next.js](https://nextjs.org) (static export) — fast, no server runtime, cheap/free hosting.
- **CMS:**  
  - **Decap CMS (formerly Netlify CMS)** — Git-based, free, non-technical UI, content stored in repo (YAML/Markdown).  
  - **Or** [Payload CMS](https://payloadcms.com) / [Strapi](https://strapi.io) self-hosted if committee strongly prefers a “traditional” admin panel (higher hosting/maintenance).
- **Hosting:**  
  - **Netlify** or **Vercel** — free tier usually sufficient for a club site; automatic builds from Git.  
  - **Or** **Cloudflare Pages** — free, good performance.
- **Domain:** Keep southernnavigators.com; point DNS to chosen host.

**Pros:** No PHP, no Craft; free/very low hosting; content in Git (versioned, recoverable); committee edits via browser CMS.  
**Cons:** Decap CMS is Git-based (requires Git repo and build pipeline); small learning curve for “publish” = commit + build.

### 4.2 Option B: Single hosted CMS with built-in hosting

- **e.g. WordPress.com** (managed), **Webflow**, or **Squarespace**.
- **Pros:** One vendor, familiar UIs, no build step.  
**Cons:** Higher annual cost; migration from Craft still custom; less control and possible lock-in.

### 4.3 Recommendation

**Option A** with **Astro + Decap CMS + Netlify (or Cloudflare Pages)** best matches “minimize maintenance and hosting cost” and “committee can manage content without technical knowledge.” Decap CMS can be configured so editors only use forms and media upload; they do not need to touch Git or code.

---

## 5. Content migration strategy

1. **Inventory**
   - Export or scrape: events (future + recent past), archive entries, info pages, contacts.
   - List all images (header, inline, gallery) and assets.
   - Capture calendar.ics URL/format for reimplementation.

2. **Structure in new CMS**
   - **Collections:** Events (date, title, slug, location, level, description, external link).  
   - **Collections:** News/Archive (title, date, slug, body, excerpt, image).  
   - **Collections:** Pages (title, slug, body, parent for hierarchy).  
   - **Config:** Contacts, header image(s), site settings.

3. **Migration execution**
   - Script or semi-automated conversion: current URLs → new slugs; HTML → Markdown where applicable.
   - Import events and news into CMS (or into Markdown files in repo for Decap).
   - Recreate info tree as pages; fix internal links.

4. **Redirects**
   - Map old URLs to new (e.g. `/archive/sn-success-at-southern-championships` → `/news/sn-success-at-southern-championships` or equivalent). Implement via host (Netlify/Cloudflare) `_redirects` or `redirects` config.

5. **Validation**
   - Checklist: all main nav items, key archive and events, calendar.ics, contact pages, and critical newcomer info present and correct.

---

## 6. CMS requirements (non-technical committee use)

Editors must be able to, **without using code or Git**:

- **Events:** Create/edit/delete events; set date, title, location, level, description, link; reorder or filter by date.
- **News/Archive:** Create/edit/delete posts; set title, date, excerpt, body, featured image; publish/unpublish.
- **Static pages:** Edit info pages (About, Newcomers, Juniors, policies, etc.); simple hierarchy (parent/child) if needed.
- **Media:** Upload images (events, news, header); optional simple gallery.
- **Site settings:** Update contact names/roles, header image(s), footer text if needed.

Implementation:

- **Decap CMS:** Configure `config.yml` with these collections and fields; editors use Netlify (or similar) “Edit with Decap” or direct CMS URL; login via Netlify Identity or GitHub OAuth.
- **Alternative (Payload/Strapi):** Model same entities; provide roles for “editor” so committee cannot change schema or delete site.

**Current CMS behaviour:** A screen recording of the current CMS was provided ([Google Drive](https://drive.google.com/file/d/1Y5quQXl0frm8eJdhAwK4OgrqUIH0gaSG/view?usp=sharing)). The automation agent cannot access Google Drive. **Action for technical reviewer:** Watch the video and note any workflows (e.g. event types, image handling, permissions) that should be reflected in the new CMS spec and in this plan.

---

## 7. Hosting and cost minimization

| Item | Current | Proposed (Option A) |
|------|---------|----------------------|
| Hosting | £135/year (Paul Frost) | **£0** (Netlify/Cloudflare Pages free tier) |
| CMS | Craft (EOL) | **£0** (Decap CMS, Git-based) |
| Domain | southernnavigators.com | **~£10–15/year** (registrar only if not already included) |
| SSL | Included | **£0** (included on Netlify/Cloudflare) |
| **Rough total** | **£135/year** | **~£10–15/year** (domain only) |

Maintenance after launch:

- **Content:** Committee only (via CMS).
- **Build/deploy:** Automatic on push to main (or on CMS save if using Decap + Git).
- **Updates:** Occasional dependency updates (e.g. Astro, Decap); technical member or volunteer can run `npm update` and test, or automation can be added later.

---

## 8. Phases and tasks (execution order)

### Phase 1: Setup and content capture (before build)

| # | Task | Owner / Tool |
|---|------|---------------|
| 1.1 | Create project repo (e.g. GitHub/GitLab) and project folder structure | Technical member / automation |
| 1.2 | Document original prompt and automation context (see `ORIGINAL_PROMPT.md`) | Done in this repo |
| 1.3 | Capture full content inventory: sitemap URLs, events list, archive list | Scrape or export |
| 1.4 | Obtain calendar.ics spec or sample (URL, fields) from current site | Manual or fetch |
| 1.5 | (If possible) Export from Craft or get DB/content dump from Paul Frost | Club to request from developer |
| 1.6 | Technical reviewer watches CMS screen recording; add notes to plan or `CONTENT_CMS_SPEC.md` | Technical member |

### Phase 2: Build new site and CMS

| # | Task | Owner / Tool |
|---|------|---------------|
| 2.1 | Initialize Astro (or chosen SSG) project; configure for static export | Automation |
| 2.2 | Define content models (events, news, pages) as Markdown/JSON or CMS schema | Automation |
| 2.3 | Implement Decap CMS `config.yml` and collections (events, news, pages, media, settings) | Automation |
| 2.4 | Build layout: header (with image), nav, footer; responsive | Automation |
| 2.5 | Build templates: Home, Events list, Event detail, Archive list, Archive post, Info pages, Contacts | Automation |
| 2.6 | Implement calendar.ics generation from events data | Automation |
| 2.7 | Add redirects file (old URLs → new) | Automation |
| 2.8 | Document how to log in to CMS and publish (for committee) in `COMMITTEE_CMS_GUIDE.md` | Automation |

### Phase 3: Content migration

| # | Task | Owner / Tool |
|---|------|---------------|
| 3.1 | Migrate events (future + selected past) into CMS/content files | Script + manual check |
| 3.2 | Migrate archive/news into CMS/content files | Script + manual check |
| 3.3 | Migrate info pages (About, Newcomers, Juniors, policies, etc.) | Script + manual check |
| 3.4 | Migrate or recreate contacts (committee, coaches, controllers) | Manual or import |
| 3.5 | Copy and link images (headers, inline, gallery) | Script + manual check |
| 3.6 | Fix internal links and validate redirects | Automation + manual spot-check |

### Phase 4: Deploy and go-live

| # | Task | Owner / Tool |
|---|------|---------------|
| 4.1 | Connect repo to Netlify (or Cloudflare Pages); set build command and publish directory | Technical member / automation |
| 4.2 | Configure Netlify Identity (or GitHub OAuth) for Decap CMS login | Technical member |
| 4.3 | Point southernnavigators.com DNS to new host (after cutover) | Domain owner |
| 4.4 | Smoke test: Home, Events, Archive, key info pages, calendar.ics, CMS login | Technical member + chair |
| 4.5 | Communicate cutover to committee and members; set “go-live” date | Chair |
| 4.6 | Retire old hosting after a short parallel period (optional) | Club / Paul Frost |

### Phase 5: Handover and documentation

| # | Task | Owner / Tool |
|---|------|---------------|
| 5.1 | Finalize `README.md` (how to run locally, build, deploy) | Automation |
| 5.2 | Finalize `COMMITTEE_CMS_GUIDE.md` (screenshots/steps for editors) | Automation |
| 5.3 | Add `MAINTENANCE.md` (dependency updates, how to add a page type, who to contact) | Automation |
| 5.4 | Store this plan and `ORIGINAL_PROMPT.md` in repo; link from README | Done |

---

## 9. Documentation and automation continuity

The following are created or referenced so that a technical club member or a future AI agent can continue work without losing context:

| Document | Purpose |
|----------|---------|
| **PLAN.md** (this file) | Full plan, phases, tech choices, CMS and hosting. |
| **ORIGINAL_PROMPT.md** | Verbatim or near-verbatim user prompt and key constraints (see below). |
| **CONTENT_CMS_SPEC.md** (to create) | Detailed CMS fields and workflows; filled after reviewer watches CMS video. |
| **README.md** | Local dev, build, deploy, repo layout. |
| **COMMITTEE_CMS_GUIDE.md** | How to add/edit events and news, upload images, use CMS. |
| **MAINTENANCE.md** | Rare tasks: dependency updates, adding a content type, redirects. |

**Original prompt (summary)**  
Stored in full in `ORIGINAL_PROMPT.md`. In short: replace site and CMS; migrate content; build a CMS usable by non-technical committee; minimize maintenance and hosting cost; produce a detailed plan for technical review; document everything (including the prompt) for seamless automation; suggest follow-up prompts; self-critique; ask for missing info.

---

## 10. Suggested follow-up prompts (for technical reviewer or chair)

Use these to instruct the AI/automation in the next steps:

1. **“Execute Phase 1 of the Southern Navigators plan: create repo structure, document the prompt in ORIGINAL_PROMPT.md, and run a content inventory from southernnavigators.com. Assume project path C:\Users\Dad\southern-navigators-website.”**

2. **“Execute Phase 2 of the Southern Navigators plan: scaffold Astro site and Decap CMS in the southern-navigators-website repo; implement layout, Events and Archive templates, and calendar.ics generation. Follow PLAN.md and CONTENT_CMS_SPEC.md.”**

3. **“Execute Phase 3 of the Southern Navigators plan: migrate events and archive from the inventory (or from the CSV/export I’ve added) into the new content files. Preserve URLs or document redirects.”**

4. **“Prepare deployment: add Netlify (or Cloudflare Pages) config and COMMITTEE_CMS_GUIDE.md for the Southern Navigators site. Document DNS steps for southernnavigators.com.”**

5. **“I’ve watched the CMS screen recording; here are the workflows we use: [paste]. Update CONTENT_CMS_SPEC.md and PLAN.md to match.”**

---

## 11. Self-critique and open risks

**Strengths of this plan**

- Aligns with “minimal cost” and “no technical knowledge” via static site + Decap CMS.
- Phases are ordered and assignable; documentation list supports handover and automation.
- Content scope is informed by live sitemap and developer email.

**Gaps and risks**

- **No direct access to current CMS or DB:** Migration may rely on scraping and manual checks unless Paul Frost provides an export. Migration scripts might need to handle HTML cleanup and image paths.
- **CMS video not viewed by automation:** Workflows (e.g. event categories, image rules) might be slightly off until a human reviews the recording and updates the spec.
- **Calendar.ics:** Fetch failed in this audit; needs to be re-tested or spec’d from current site to replicate behaviour.
- **Results:** “Results” section was not fully audited; may be links to external systems (e.g. BOF). Confirm with club whether it’s only links or also stored content.
- **Photos:** Gallery structure (one page vs many, captions) not fully defined; can be scoped in Phase 2 or from CMS video.

**Assumptions**

- Club is willing to use a Git-backed workflow (editors use Decap UI only; Git is behind the scenes).
- Domain southernnavigators.com can be pointed to a new host.
- One technical member can approve PRs or run occasional npm/security updates.

---

## 12. What we need from you

To proceed smoothly, please:

1. **Confirm go-ahead** to execute this plan (or which phases to run first), and confirm the project path (e.g. `C:\Users\Dad\southern-navigators-website` or a different folder/repo).
2. **Technical reviewer:** Watch the [CMS screen recording](https://drive.google.com/file/d/1Y5quQXl0frm8eJdhAwK4OgrqUIH0gaSG/view?usp=sharing) and either (a) add a short “CMS workflows” section to this plan or (b) create `CONTENT_CMS_SPEC.md` with fields and workflows so the build matches current usage.
3. **Content export:** If possible, ask Paul Frost (paul@pfweb.co.uk) whether he can provide a content/database export (events, entries, pages) to simplify migration.
4. **Clarify (optional):**  
   - Is “Results” only links to external sites, or does the club want to store result summaries on the site?  
   - Any strong preference for Netlify vs Cloudflare Pages vs other host?  
   - Any pages or sections that can be dropped or simplified for v1?

Once the above are confirmed (and, if possible, the CMS notes and export received), the next step is **Phase 1** (repo setup, prompt documentation, content inventory) and then **Phase 2** (build) as approved.

---

*End of plan. Document maintained in `C:\Users\Dad\southern-navigators-website\`.*
