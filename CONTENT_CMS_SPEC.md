# Content and CMS specification

**Purpose:** Define content types, fields, and editor workflows for the new Southern Navigators site so the CMS (e.g. Decap CMS) and templates match committee expectations.

**Status:** Filled from CMS screen recording — screenshots captured at 17 timestamps (see “Screenshots by timestamp” in Your notes).  
Video: https://drive.google.com/file/d/1Y5quQXl0frm8eJdhAwK4OgrqUIH0gaSG/view?usp=sharing

---

## Instructions for technical reviewer

1. Watch the screen recording of the current (Craft) CMS.
2. Note for each content type: **name**, **fields** (labels and types), **workflow** (e.g. draft → publish, categories).
3. Paste or type your notes below under the relevant section.
4. Save this file; the build phase will use it to configure the new CMS.

---

## 1. Events

**From CMS video (Entries — `?p=admin/entries`):**

- **Entry types (New entry dropdown):** Events | Information | News/Articles | Repeatable Series details.
- **Create/Edit:** “Create a new entry” with **Save** button (dropdown: Save Draft / Publish).
- **Tabs:** General Info | Pre-Event Info | Results.
- **General Info tab:**
  - **Location** — single-line input (geographical/virtual location).
  - **Contacts/Officials** — table: **Position**, **Name**, **Email**, **Phone**; “+ Add a row”.
  - **Registration and start times** — rich text (code, bold, italic, align, link; word count).
  - **Entry details/costs** — rich text (same toolbar).
- **Pre-Event Info tab (Events entry type):**
  - **Event Level** — radio: Activity | Course | Local | Regional | National | Major.
  - **Event type** — checkboxes (multi): Race, Coaching, Training, Juniors, Schools, Relay, Score, Social, Urban, Night.
  - **Summary** — rich text (20–40 words guideline).
  - **Series details** — section for repeatable series info.
- **Results tab:**
  - **Location** — input.
  - **Results** — “+ Add a block” dropdown: **AutoDownload Results files** | **Other Results files** | **Other links** (e.g. RouteGadget, Winsplits, BOF rankings).
  - **Post Date**, **Expiry Date** — date inputs.
  - **Enabled** — toggle.
  - **Notes about your changes** — text.

**Planned (from site audit):**

- Date, title, slug, location (“Near”), level (Local / Regional / National / Major / Activity), description, link to external event page.
- List view: future events first; optional past events.

---

## 2. News / Archive

**From CMS video:**

- **Entries list** (`?p=admin/entries`): “All entries”, search, sort “desc Post Date”. List columns: Title (green dot), Section, Post Date, Link, ID. Sections: News/Articles, Events, Information.
- **News/Articles entry form** (breadcrumb: Home > entries > News/Articles > newsitem):
  - **Title*** (required).
  - **Sub Title** — optional; hint: “use this to keep the main title shorter” (e.g. “Star Posts, 25 January 2026”).
  - **Entry type:** “News Item or Longer Article” (News Item selected).
  - **Categories of News / Information** — “+ Select which Categories apply to this entry” (multi-select); hint: “Categorising this entry enables people to search for news and information related to a specific category.”
  - **Summary** — rich text (30–40 words for homepage and entry detail).
- **Categories** (`/admin/categories`): Section “News/Information”; “+ New category”; search; sort “asc Structured Pages”. List: **Title** | **world** (locale). Categories: Juniors, Training, Coaching, Social, Events, Members, Leagues, Resources.

**Planned:**

- Title, date, slug, excerpt, body (rich text), optional featured image.
- **Categories:** Juniors, Training, Coaching, Social, Events, Members, Leagues, Resources (use for News/Archive filtering or tagging).

---

## 3. Static / info pages

**From CMS video (Information entry type):**

- **Series Info** — “Series / League Name” input.
- **Summary** — rich text (homepage and detail; 30–40 words).
- **Body** — rich text (code, bold, italic, link, blockquote, media, lists, undo/redo; word count).
- **Registration and start dates** — (section visible, fields not fully captured.)
- **Prizes/casts** — (section visible.)

*(Hierarchy/parent page and full info-page workflow not shown in captured frames.)*

**Planned:**

- Title, slug, body, parent page (for tree: e.g. New to O → FAQ, Contacts → Coaches).

---

## 4. Contacts

**From CMS video:**

- **Within Entries (General Info):** **Contacts/Officials** table — Position, Name, Email, Phone; “+ Add a row”.
- **Users** (`?p=admin/users`): “+ New user”; filter by role (e.g. “News reporter”); search; sort “asc Email”; list/grid. Columns: User (email + green dot), Full Name, Email, Date Created, Last Login. (Committee/role names appear as user accounts.)

**Planned:**

- Role name, person name, email (and any other fields currently used).

---

## 5. Site settings / global

*(Not visible in sampled video frames.)*

**Planned:**

- Header image(s); footer/copyright; optional social links.

---

## 6. Media (Assets)

**From CMS video (`?p=admin/assets`):**

- **Actions:** “Upload files” (red button).
- **Filters:** **Images** | **Documents** | **Results Archive** (with dropdowns).
- **Search** — text input.
- **Sort:** “asc Title” / “desc Title”.
- **View:** **list** | **grid**.
- **List columns:** Title (with thumbnail), Filename, File Size, File Modified Date.
- Supports JPG, PNG, PDF (e.g. “2023 Team Standings After 3.pdf”).

**Planned:**

- Single upload per event/news; optional gallery; header images.

---

## 7. Results archive (from video)

**From CMS video (~2:18–2:45):**

- **Results Archive** — sidebar/list with **year** navigation (2019 down to 2006).
- **Expandable years:** e.g. 2016 (collapsed), 2017 (expanded).
- **Per year:** entries as `YYYY-MM-DD slug`, e.g. 2017-01-14 wisley, 2017-02-04 horsell-common, 2017-03-04 frensham-heights-school-farnham, 2017-03-25 frimley-fuel-allotments, 2017-06-14 wel-mead-common-fleet, 2017-07-06 hawley-place-school, 2017-09-16 lord-wandsworth-college, 2017-09-20 farnborough, 2017-09-16 merrist-wood.
- Collapse/expand by year; scrollable list.
- Use for: date-based results archive; new CMS should support date + slug and optional year grouping.

---

## Your notes (paste below)

**Screenshots by timestamp (1 Feb 2026):**

| Time  | Content captured |
|-------|-------------------|
| 0:26  | News/Articles entry: Title*, Sub Title, “News Item or Longer Article”, Categories of News/Information (+ Select), Summary. |
| 0:38  | Entries list; “+ New entry” dropdown: Events, Information, News/Articles, Repeatable Series details. |
| 0:44  | Event entry: Event Level (Activity–Major), Event type (Race, Coaching, …), Summary, Series details. |
| 0:47  | Same Event form (Event Level, Event type, Summary, Series details). |
| 0:52  | Create a new entry — **Results** tab: Location, Results (“+ Add a block”: AutoDownload/Other Results files, Other links), Post Date, Expiry Date, Enabled, Notes. |
| 0:55  | Results tab with “Add a block” dropdown visible. |
| 1:04  | Entries list: All entries, search, desc Post Date; entries with Section, Post Date, Link, ID. |
| 1:17  | Information entry: Series Info (Series/League Name), Summary, Body (rich text), Registration and start dates, Prizes/casts. |
| 1:27  | Categories: News/Information, + New category, search, asc Structured Pages; Juniors, Training, Coaching, Social, Events, Members, Leagues, Resources. |
| 1:33  | **Assets**: Upload files, Images filter, search, asc Title, list/grid; Title, Filename, File Size, File Modified Date. |
| 1:40  | Assets list view (same). |
| 1:41  | Assets with filters: Images, Documents, Results Archive. |
| 2:00  | Assets — Results Archive section, list/grid. |
| 2:18  | **Results Archive**: years 2019–2006; 2016 collapsed, 2017 expanded; entries 2017-01-14 wisley, horsell-common, etc. |
| 2:34  | **Users**: + New user, role filter (e.g. News reporter), search, asc Email, list/grid; User (email), Full Name, Email, Date Created, Last Login. |
| 2:53  | (End of video / black.) |
| 3:03  | (End of video / black.) |

**Summary:** Login (`?p=admin/login`), Entries (`?p=admin/entries`), Categories (`/admin/categories`), Assets (`?p=admin/assets`), Users (`?p=admin/users`), and Results Archive (year-tree) are documented. Site settings / global (header, footer) were not shown. Build can use this spec for Decap CMS collections and templates.
