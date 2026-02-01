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

## Step 3: Enable the CMS (authentication)

**Netlify Identity is deprecated** (as of February 2025). Netlify now recommends **Auth0** for authentication. **This project uses Option A (GitHub backend)** below.

---

### Option A: GitHub backend (recommended – use this)

Editors log in with **GitHub** and need push access to the repo. No Netlify Identity, no Auth0, no extra services.

1. **Use the GitHub backend** – The repo is already set up for this. In `public/admin/config.yml` the backend is:
   - `name: github`
   - `repo: pdaplyn/southern-navigators-website` (or your `owner/repo`)
   Do **not** enable Netlify Identity or Git Gateway.

2. **Register the app with GitHub** (one-time):
   - GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
   - **Application name:** e.g. "Southern Navigators CMS".
   - **Homepage URL:** `https://yoursite.netlify.app` (your live Netlify URL).
   - **Authorization callback URL:** use **`https://api.netlify.com/auth/done`** (Netlify’s OAuth endpoint; do *not* use your site’s `/admin/`).
   - Create the app and note the **Client ID**. Generate a **Client secret** and keep it safe.

3. **Add the credentials in Netlify** (either method):
   - **Option A – Environment variables:** **Site configuration** → **Environment variables** → add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, then redeploy.
   - **Option B – OAuth UI (recommended):** **Site configuration** → **Access & security** → **OAuth** → **Install Provider** → **GitHub** → enter Client ID and Client secret, then save.
   - Redeploy after adding env vars so the CMS picks them up.

4. **Give editors access:** Add each committee member as a **collaborator** on the GitHub repo (Settings → Collaborators). They log in at **yoursite.netlify.app/admin/** with GitHub.

---

### Option B: Auth0 (as Netlify suggests)

Netlify recommends **Install Auth0** instead of the deprecated "Enable Identity". Auth0 protects your site or routes; for Decap CMS you still need a way for the CMS to write to GitHub:

- **Option B1 – DecapBridge:** Use [DecapBridge](https://decapbridge.com/) as the auth layer for Decap CMS. You invite editors by email (they can use Google, Microsoft, or a password). No GitHub account required for editors. See [DecapBridge docs](https://decapbridge.com/docs/getting-started).
- **Option B2 – Auth0 + GitHub:** Use the [Auth0 extension for Netlify](https://docs.netlify.com/integrations/auth0/) for site auth; the CMS would need to be configured with the GitHub backend and your Auth0 setup would control who can reach `/admin/`. This is more involved; Option A or DecapBridge is usually simpler for a committee CMS.

**Summary:** Prefer **Option A** if your editors can have GitHub accounts and repo access. Use **DecapBridge** (Option B1) if you want email invites and no GitHub for editors.


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
   - **GitHub backend:** Log in with GitHub (they need collaborator access to the repo).  
   - **DecapBridge:** Log in with the email they were invited to and the password or social login they set.  
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
| CMS shows "Failed to load config" | For **GitHub backend**: ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in Netlify env vars and you've redeployed. For **DecapBridge**: check DecapBridge docs. |
| "Log in with GitHub" does nothing / 404 | Open **/admin/** on the **deployed** site (not localhost). Ensure the GitHub OAuth app **Authorization callback URL** is `https://api.netlify.com/auth/done`. Add credentials under **Access & security → OAuth → Install Provider (GitHub)** if needed. |
| 404 on /admin/ | The `public/admin/` folder is in the repo and published; clear cache or redeploy. |
| Changes in CMS don’t appear | Wait 1–2 minutes for the rebuild, then refresh the site. Check **Deploys** in Netlify for errors. |

---

## Summary

1. Push repo to **GitHub**.
2. **Netlify** → Import project → build command `npm run build`, publish `dist`.
3. Set up CMS auth: **GitHub backend** (recommended) or **Auth0 / DecapBridge**; give editors access (repo collaborators or DecapBridge invites).
4. Share **site URL** and **/admin/** with the committee; point them to **COMMITTEE_CMS_GUIDE.md**.

After that, the committee can browse the preview and try editing content in the CMS without touching code or Git.
