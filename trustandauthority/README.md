# trustandauthority.com — v1

The waitlist site from Molly's v1 brief (Oct 6, 2026): one home page, a waitlist with the optional course question, a thank-you page, and a draft welcome email. It's built with [Astro](https://astro.build) as a static site and hosted on Netlify.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:4321
```

The forms won't submit in local dev because Netlify handles submissions. Everything else works.

## Deploy to Netlify (first time)

1. Push this folder to a GitHub repo.
2. In Netlify, go to **Add new site → Import an existing project** and pick the repo. `netlify.toml` already sets the build command and the publish folder.
3. Go to **Site configuration → Forms** and turn on **form detection**, then trigger a redeploy. The `waitlist` form appears after that deploy.
4. Under **Forms → Form notifications**, add an email notification so you see signups while you wait for the newsletter platform.
5. Under **Domain management**, add `trustandauthority.com` and follow the DNS steps. HTTPS is automatic.

### The production build stays blocked until Molly's items are in

Molly's undecided items live in `src/data/site.js` as `null`. How each build treats them:

| Build | What happens |
| :---- | :---- |
| `npm run dev`, deploy previews, branch deploys | Each `null` shows as a highlighted **[Molly to supply: …]** marker. Send Molly the deploy-preview URL to review. |
| Production deploy (`CONTEXT=production`) | The build **fails** and lists what's missing, so placeholder text can't go live. |

To make the first deploy a preview, create the site from a `preview` branch, or set **Build settings → Branches** so `main` isn't the production branch yet. Run `npm run check` locally to see the list.

## Where things live

| What | File |
| :---- | :---- |
| Molly's decisions (headline, launch window, pricing, photo, bio, quotes) | `src/data/site.js` |
| Page sections and FAQ | `src/pages/index.astro` |
| Waitlist form, validation, and submit | `src/components/WaitlistForm.astro` |
| Thank-you page | `src/pages/thanks.astro` |
| Colors, type, and buttons | `src/styles/global.css` |
| Self-hosted fonts | `public/fonts/`, `src/styles/fonts.css` |
| Netlify build, headers, and caching | `netlify.toml` |
| AI crawler policy | `public/robots.txt` |
| Welcome email draft | `emails/welcome.md` |
| Share image (1200×630) | `public/og-image.png`, regenerated with `node scripts/og-image.mjs` |

### Filling in Molly's items

- **Headline, launch window, pricing:** set the strings in `site.js`.
- **Photo:** put the file in `public/images/`, then set `photo: { src, alt, width, height }`. The same photo fills the hero and the About section.
- **Bio and "why I teach" lines:** set `aboutBio` and `aboutQuote`. The drafts from the brief, with the typos fixed, are in `aboutBioDraft` and `aboutQuoteDraft`.
- **Student quote:** set `studentQuotePermission: true` only after her written permission is on file.

## The waitlist

**What each submission carries:** `first_name`, `email`, `consent`, `course` (blank for the hero form, which doesn't ask), and `source` (`hero` or `closing`).

**Where submissions go today:** Netlify Forms. Spam is filtered by a honeypot field plus Netlify's own filtering. You can export a CSV from the Forms tab at any time, and the course counts come from the `course` column.

**When Molly picks a newsletter platform:** connect it with Netlify's Zapier integration, or with a small `netlify/functions/submission-created.js` function. Netlify runs that function on every verified submission, and it can call the platform's API to add the subscriber, tagged with `course`. Then load `emails/welcome.md` as the platform's welcome automation. The welcome email has to wait for this, because Netlify Forms can't email subscribers.

**How the form behaves:**
- **With JavaScript:** it shows inline text errors, posts in the background, and stores the first name in sessionStorage so the thank-you page can greet the person by name. The name never goes in the URL.
- **Without JavaScript:** it falls back to a plain POST, and the thank-you page says "Thank you." without the name.

## Analytics

The site is wired for [Plausible](https://plausible.io), which is cookieless and privacy-friendly. To switch it on, set `PUBLIC_PLAUSIBLE_DOMAIN=trustandauthority.com` in Netlify's environment variables. Every signup sends a `Waitlist signup` event with `course` and `source` properties and nothing personal. That gives you the brief's two numbers: total signups, and the count for each course. Analytics stays off until the variable is set.

## Accessibility (WCAG 2.1 AA)

```bash
npm run build
npx playwright install chromium   # first time only
npm run test:a11y
```

The `test:a11y` script runs these checks:
- axe-core on every page, including with form errors showing
- exactly one H1 per page
- no sideways scroll at 320px wide
- nothing clipped at 200% text size
- keyboard tab order through the hero form, with the focus outline at every stop
- error behavior: errors in text, focus moved to the first bad field, errors linked with `aria-describedby`

All checks pass as of the first build.

Still to do by hand before launch:
- Do one real keyboard-only pass through both forms.
- Run WAVE on the live URL.

Build rules followed throughout:
- **Color:** only pairings marked "Pass" in the brief's contrast table. The button is Ink on Aged Gold, and turns Parchment on Deep Plume on hover.
- **Labels:** every field has a visible label above it, with no placeholder-only labels.
- **Links:** always underlined.
- **Focus:** a 2px Peacock outline on everything interactive. It switches to Parchment inside the Deep Plume footer and band, where Peacock can't be seen.
- **Structure:** semantic landmarks and a skip link.
- **New colors:** Umber Deep and Brass Deep are in use, pending Molly's approval.

## Choices made beyond the brief

- **Self-hosted fonts.** These are the same Google Fonts files, Cormorant Garamond and Jost under the OFL. Self-hosting lets the actual font files be preloaded, and it means visitors' browsers never call Google, which suits a site about trust.
- **Error color `#8A2A1C`.** The palette had no error color. This one is 7.3:1 on Parchment.
- **robots.txt allows AI crawlers by default**, because the FAQ and schema exist to get cited. A commented-out block opts out of training crawlers only. This is pending Molly's best-practices file.
- **Schema:** Person (Molly), Organization, WebSite, and FAQPage. The pending FAQ answers are left out of the markup until they're written.
- **Thank-you page** is `noindex` and left out of the sitemap.
