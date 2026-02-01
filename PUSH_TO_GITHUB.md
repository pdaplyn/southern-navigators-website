# Push to GitHub — run these after creating the repo

The project is already a **Git repo** with one commit on `main` (308 files). You only need to create the repo on GitHub and push.

## 1. Create the repo on GitHub

1. Go to **[github.com/new](https://github.com/new)**.
2. **Repository name:** e.g. `southern-navigators-website`.
3. **Public**.
4. **Do not** add a README, .gitignore, or license (they’re already in the project).
5. Click **Create repository**.

## 2. Add the remote and push

In a terminal, from the project folder (`c:\Users\Dad\southern-navigators-website`), run (replace **YOUR_USERNAME** with your GitHub username or org):

```bash
git remote add origin https://github.com/YOUR_USERNAME/southern-navigators-website.git
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/southern-navigators-website.git
git push -u origin main
```

## 3. Deploy on Netlify

Then follow **DEPLOY.md**: Netlify → Import from GitHub → build `npm run build`, publish `dist` → enable Identity + Git Gateway → invite committee.

---

**Summary:** Local repo is ready. Create the empty repo on GitHub, then run the two `git` commands above.
