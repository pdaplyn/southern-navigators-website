# Southern Navigators site — maintenance

Rare tasks for the technical contact. Day-to-day content is edited via the CMS (see **COMMITTEE_CMS_GUIDE.md**).

---

## Node.js version

The site is built with Astro 5. It needs **Node.js ≥ 18.20.8** (or 20.x / 22.x). Check with:

```bash
node -v
```

If build fails with an “unsupported” Node message, upgrade Node (e.g. from https://nodejs.org/) or use a version manager (nvm, fnm).

---

## Dependency updates

Every few months you can refresh dependencies:

```bash
npm update
npm run build
```

If something breaks, check Astro and Decap CMS release notes. You can pin versions in `package.json` if needed.

---

## Adding a content type

1. Add the collection in **CONTENT_CMS_SPEC.md** (for reference).
2. In Astro: add a schema in `src/content/config.ts`, create `src/content/<collection>/` and a sample file.
3. In Decap: add a collection in `public/admin/config.yml` pointing at the same folder/file.
4. Add a page (or dynamic route) in `src/pages/` that uses `getCollection('<collection>')`.

---

## Header / hero photo

To use a photo in the hero band on the home page: add an image at `public/images/header.jpg`. Then in `src/layouts/Layout.astro`, add the class `has-image` to the hero band div (the one with `class="hero-band"` when `hero` is true). The gradient will still show behind the image for contrast. Replace with your own club/event photos as needed.

## Redirects (old URLs → new)

- **Netlify:** Edit `public/_redirects`. Format: `old-path  new-path  302`.
- **Cloudflare Pages:** Use the dashboard Redirects (or `_redirects` if supported).

Add redirects as you migrate content (e.g. `/archive/slug` → `/news/slug`).

---

## CMS login / Identity

- **Netlify Identity:** Invite editors in Netlify dashboard → Identity → Invite users. They set a password from the invite email.
- **GitHub backend:** If you switch to GitHub auth, change `backend` in `public/admin/config.yml` and configure OAuth.

---

## Who to contact

- **Content / CMS access:** Chair or committee (see COMMITTEE_CMS_GUIDE).
- **Hosting / DNS:** Whoever manages southernnavigators.com and the Netlify/Cloudflare account.
- **Code / automation:** Technical club member or volunteer.
