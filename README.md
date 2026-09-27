# A Monster’s Mother — website

An Astro static website for **A Monster’s Mother: A Cradle Made of Embers**, by YH. Markdown publishing, no database, no visitor tracking, no client framework. Node 22.12+ required.

## Preview

```sh
npm ci
npm run dev
```

Open the address printed in the terminal. Build with `npm run check`, `npm run build`, then `npm run verify`. Preview production output with `npm run preview`.

## Publish through GitHub Pages

1. Create an empty repository named `monsters-mother` under your account and push this folder to its `main` branch. This folder is the repository root, not its parent.
2. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Push a change or run **Actions → Deploy Astro to GitHub Pages → Run workflow**.

The included workflow discovers the correct domain and subdirectory from GitHub Pages, builds, checks all local links, and publishes `dist`. It supports project pages, account pages and a custom domain configured in Pages. Do not hardcode a speculative domain into the site.

```sh
gh auth login
gh repo create monsters-mother --public --source=. --remote=origin --push
```

GitHub authentication was expired in the authoring environment, so no remote repository was created and no public deployment was performed.

## Cloudflare Pages alternative

Connect the same GitHub repository to Cloudflare Pages. Use **npm run build** as the build command, **dist** as the output folder, Node 22.12+ and these build environment variables:

- `SITE_URL`: your actual production origin, such as `https://your-site.pages.dev`.
- `BASE_PATH`: `/`.

Set the production branch to `main`. Every pushed Markdown change publishes automatically. For a custom domain, update `SITE_URL` and rebuild. Do not enable both publishing destinations for the same indexed content unless one is deliberately canonicalized to the other.

## Content editing

- `src/content/blog/*.md`: articles. Copy an existing file, edit the front matter and body, commit. Filename becomes the URL. `draft: true` excludes an article from routes, listings, RSS and sitemap. Dates are explicit, not build times.
- `src/content/books/*.md`: books. Add Book II/III with a new file, unique `order`, title, subtitle, description, author and optional Amazon URL. Set `published: true` when ready. The first published book supplies the global CTA; additional published books appear on Story.
- `src/pages/[section].astro`: World and Lore summaries plus the reading room. World and Lore draw only on the opening chapters.
- `src/data/archive.ts`: spoiler-light character profiles, each tagged with `bookId`.
- `src/content/chapters/book-one-chapter-one.md`: the complete opening chapter, copied verbatim from the active chapters-v04 source (body only; original headings become page headings). The reading room is included in the sitemap.
- `src/site.ts`: global branding and navigation.
- `src/styles/global.css`: colors, responsive layout and reduced-motion behavior.

## Content status / launch checklist

The title, author YH and ASIN **B0HKYDF7BY** were transcribed from the supplied KDP screenshot. Confirm the ASIN/destination in your target marketplace. No price, review, ISBN, stock status or release-date claim is invented. The screenshot's low-resolution cover is not reused as a high-resolution cover.

The heroine and dragon are the exact artwork from the book project’s approved cover source (prepublication-v08), recovered through the “Mothers monster” task. No redesign was used in the final site. The hero tagline and synopsis reproduce the back-cover copy. World, Lore and character summaries are grounded in chapters 1, 3 and 6 of the active chapters-v04 manuscript. The four journal articles are original editorial starter copy for review, not research-backed scholarship. The video-to-book article links the identified MYTHRA source without making new affiliation or sequel claims.

Before public launch: review the editorial articles, confirm the Amazon destination, choose the domain and review the extracted opening chapter. Chapter One is now available in the reading room. No fictional locations, names or chapter text have been invented. Only Chapter One is copied into this repository; the remaining manuscript stays in the book project.

## SEO and accessibility

Canonical URLs, Open Graph and Twitter cards, Book/WebSite/BlogPosting JSON-LD, sitemap index, robots.txt and RSS are generated. Structured data contains only supported fields. Default `example.com` builds are deliberately noindex and robots-blocked until `SITE_URL` is configured. Staging hosts should also be access-controlled or noindexed by their deployment configuration.

Base-aware internal links work at `/` and a repository subpath. The layout includes a keyboard skip link, mobile menu with Escape support, focus outlines, responsive text and reduced-motion preferences. Google Fonts are requested externally with system fallbacks; artwork is local and optimized. No cookie banner is necessary for the current implementation because it sets no tracking cookies.

## Assets

`public/cover-art.webp`: optimized copy of the approved Elara/Ember artwork, 1024×1536. `public/social.jpg`: JPEG of the same original artwork, with matching declared dimensions. `public/favicon.svg`: original ember mark. The unrelated first concept was removed from the deliverable. Originals in the book project remain untouched.

Astro collection API reference: https://docs.astro.build/en/guides/content-collections/
Deployment reference: https://docs.astro.build/en/guides/deploy/github/
