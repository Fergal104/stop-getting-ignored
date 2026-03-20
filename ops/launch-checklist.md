# Launch Checklist

## Accounts

- [ ] Create Gumroad account
- [ ] Create public GitHub repository for the site
- [ ] Reserve Stop Getting Ignored handle or closest available variant on X and Threads
- [ ] Update bios from `ops/brand-kit.md`

## Product Setup

- [ ] Create Gumroad product: `Stop Getting Ignored`
- [ ] Paste copy from `product/gumroad-product-page.md`
- [ ] Upload `product/client-reply-kit.md`
- [ ] Set launch price to $19
- [ ] Add a simple cover image later if desired

## Site Setup

- [ ] Confirm the live Gumroad URL is present in `site/index.html`
- [ ] Publish `site/` through GitHub Pages
- [ ] Test landing page on mobile and desktop
- [ ] Confirm `site/free/21-first-lines.txt` downloads correctly

## Launch

- [ ] Publish posts 1-10 from `content/launch-posts.md`
- [ ] Add profile link to the landing page
- [ ] Log traffic and downloads in `tracking/kpi-tracker.csv`
- [ ] Run `node scripts/generate-post-queue.mjs`
- [ ] Run `node scripts/login-profiles.mjs`
- [ ] Run `node scripts/check-sessions.mjs`
- [ ] Run `node scripts/post-next.mjs`

## Review

- [ ] Review numbers on day 3
- [ ] Review numbers on day 7
- [ ] Review numbers on day 14
- [ ] Apply the pivot rules from `ops/sops.md` before expanding scope
