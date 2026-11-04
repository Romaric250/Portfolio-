# SEO launch checklist — rlonfonyuy.online

Use this after production deploy and before announcing the site.

## Search engines

- [ ] **Google Search Console** — add property for `https://rlonfonyuy.online`, verify via `GOOGLE_SITE_VERIFICATION` or DNS/HTML tag in Site Settings.
- [ ] **Bing Webmaster Tools** — add site, verify with `BING_SITE_VERIFICATION`.
- [ ] Submit **sitemap**: `https://rlonfonyuy.online/sitemap.xml`
- [ ] Submit **RSS** (optional): `https://rlonfonyuy.online/rss.xml`
- [ ] Request indexing for home, `/about`, `/projects`, `/certificates`, top blog posts.

## Rich results & previews

- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) — home, project, blog post, certificates.
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) / LinkedIn Post Inspector — OG image and title.
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) (or post preview in X).
- [ ] Confirm root `opengraph-image` shows RL mark + name + headline (no default Vercel asset).

## On-site SEO (admin)

- [ ] **Site Settings** — default title, description, keywords, `siteUrl`.
- [ ] **SEO overrides** — critical paths (`/`, `/about`, `/services`, `/contact`).
- [ ] **Redirects** — legacy URLs from old site if any remain.
- [ ] **Certificates / projects / blog** — published status, slugs, excerpts, cover alt text.
- [ ] `/robots.txt` allows public routes; `/admin` and `/login` disallowed or noindex.

## Internal linking

- [ ] Home → projects, services, certificates, blog, contact.
- [ ] Project pages → related stack skills and GitHub/repo links.
- [ ] Blog posts → projects and services where relevant.
- [ ] Footer → GitHub, LinkedIn, CV, newsletter.

## Profiles & backlinks

Cross-link the live site from authoritative profiles (same name, photo, URL):

- [ ] [GitHub — Romaric250](https://github.com/Romaric250) — profile README + pinned repos link to portfolio.
- [ ] [LinkedIn — romaric-lonfonyuy](https://linkedin.com/in/romaric-lonfonyuy) — featured link + About URL.
- [ ] **Ashesi University** — student/engineer profiles, project pages, newsletters where appropriate.
- [ ] **Tech4Girls / community** — leadership and mentorship pages reference portfolio URL.
- [ ] X (@romaric250) — bio link to canonical domain.

## Performance & trust

- [ ] Lighthouse (mobile) — LCP, CLS, accessibility on home and one project page.
- [ ] HTTPS only; www redirects to apex (configured in `next.config.ts`).
- [ ] Contact form and newsletter tested in production (Resend if enabled).

## Post-launch (30 days)

- [ ] Search Console — coverage, Core Web Vitals, query impressions for “Romaric Lonfonyuy”.
- [ ] Fix crawl errors and 404s; add redirects in admin if needed.
- [ ] Publish 1–2 blog posts with internal links to projects.

---

**Canonical URL:** `https://rlonfonyuy.online`  
**Admin SEO tools:** `/admin/settings`, `/admin/seo`
