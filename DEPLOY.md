# Deploying the Southern Navigators site (preview for committee)

This guide gets the site and CMS live so you can share a link with the committee and try the CMS. It uses **Netlify** (recommended for Decap CMS) and **GitHub**.

---

## Prerequisites

- A **GitHub** account (free).
- A **Netlify** account (free at [netlify.com](https://www.netlify.com)).
- This repo built and tested locally (`npm run build` succeeds).

---

## Step 1: Push the repo to GitHub

1. **Create a new repository on GitHub** (e.g. `southern-navigators-website`).  
   Do **not** initialise with a README if the repo already exists locally.

2. **From your project folder**, if Git isn’t set up yet:
   ```bash
   git init
   git add .
   git commit -m "Initial site and CMS"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/southern-navigators-website.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username (or org name).

3. If the repo is already a Git repo and you just need to push:
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```

---

## Step 2: Deploy on Netlify

1. Log in at [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** and authorise Netlify if asked.
4. Select the **southern-navigators-website** repo (or whatever you named it).
5. **Build settings** (Netlify usually detects these; if not, set manually):
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** leave blank (or set if the project lives in a subfolder).
6. Click **Deploy site**.  
   Netlify will run `npm install` and `npm run build` and publish the `dist/` folder. The first deploy may take a few minutes.

7. When it’s done, Netlify gives you a URL like **`https://random-name-12345.netlify.app`**.  
   That is your **live preview** — share it with the committee for the site.  
   The CMS will be at **`https://random-name-12345.netlify.app/admin/`**.

---

## Step 3: Enable the CMS (Netlify Identity + Git Gateway)

Decap CMS is configured with **git-gateway**, so Netlify Identity must be on.

1. In Netlify: **Site overview** → **Site configuration** (or **Site settings**).
2. Go to **Identity** in the left sidebar.
3. Click **Enable Identity**.
4. Under **Registration preferences**, set **Allow external registrations** to **Invite only** (so only people you invite can log in).
5. Go to **Services** → **Git Gateway** and click **Enable Git Gateway** (one click).  
   This lets the CMS read/write content in your repo on your behalf.

6. **Invite committee members:**
   - **Identity** → **Invite users**.
   - Enter their email addresses and send invites.  
   They’ll get an email to set a password; after that they can log in at **yoursite.netlify.app/admin/**.

7. **Optional:** In **Identity** → **Settings and usage** you can set a **Site name** (e.g. “Southern Navigators CMS”) so the login screen is clearer.

---

## Step 4: Share with the committee

Send them:

1. **Site URL**  
   e.g. `https://random-name-12345.netlify.app`  
   — for browsing the new site.

2. **CMS URL**  
   e.g. `https://random-name-12345.netlify.app/admin/`  
   — for editing events, news, contacts, and info pages.

3. **CMS guide**  
   Point them to **COMMITTEE_CMS_GUIDE.md** (or a copy of it / a short note):  
   - Log in with the email they were invited with and the password they set.  
   - Use **Events**, **News & Archive**, **Info pages**, **Contacts** in the left menu.

---

## Step 5: What happens when they edit in the CMS

- When someone clicks **Save** (or **Publish**) in the CMS, Netlify **commits the change to your GitHub repo** and triggers a **new deploy**.
- The site rebuilds (usually 1–2 minutes) and the live preview updates.
- No one needs to touch Git or run commands; the CMS and Netlify handle it.

---

## Optional: Custom subdomain

- In Netlify: **Domain management** → **Add custom domain** (or **Options** → **Change site name**).
- You can set a free Netlify subdomain like **`southern-navigators-preview.netlify.app`** so the URL is easier to share.

---

## Later: Point southernnavigators.com to the new site

When you’re ready to switch the live domain:

1. In Netlify: **Domain management** → **Add custom domain** → add **southernnavigators.com** (and **www.southernnavigators.com** if you use it).
2. Netlify will show the DNS records to add (e.g. A record or CNAME).
3. At your domain registrar, add those records; Netlify can provide **HTTPS** automatically.
4. See **PLAN.md** §7 for DNS and cutover notes.

Until then, keep using the Netlify URL (e.g. `https://yoursite.netlify.app`) for the committee preview.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails on Netlify | **Deploy log**: ensure Node version is ≥ 18. In Netlify **Site configuration** → **Environment** you can set **NODE_VERSION** = `20`. |
| CMS shows “Failed to load config” | Ensure **Git Gateway** is enabled under **Identity** → **Services**. |
| “Log in with Netlify Identity” does nothing | Ensure **Identity** is enabled and that you’ve opened **/admin/** on the **deployed** site (not localhost). |
| 404 on /admin/ | The `public/admin/` folder is in the repo and published; clear cache or redeploy. |
| Changes in CMS don’t appear | Wait 1–2 minutes for the rebuild, then refresh the site. Check **Deploys** in Netlify for errors. |

---

## Summary

1. Push repo to **GitHub**.
2. **Netlify** → Import project → build command `npm run build`, publish `dist`.
3. Enable **Identity** and **Git Gateway**; invite users.
4. Share **site URL** and **/admin/** with the committee; point them to **COMMITTEE_CMS_GUIDE.md**.

After that, the committee can browse the preview and try editing content in the CMS without touching code or Git.
