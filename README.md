# Stop Getting Ignored Starter Workspace

This workspace implements the first operating version of the `Painkiller Pack Engine`:

- `site/` contains the GitHub Pages landing site and free lead magnet download.
- `product/` contains the paid offer, the product copy, and the actual starter kit assets.
- `content/` contains the launch content batch and email follow-up sequence.
- `ops/` contains prompts, SOPs, brand guidance, and the launch checklist.
- `tracking/` contains the KPI tracker and validation rules.

## Fast Start

1. Install local dependencies with `.\scripts\npm.ps1 install`.
2. Regenerate the queue with `node scripts/generate-post-queue.mjs`.
3. Push to `main` and let `.github/workflows/deploy-site.yml` publish `site/` to GitHub Pages.
4. Log in once with `node scripts/login-profiles.mjs`.
5. Run `node scripts/check-sessions.mjs`, then `node scripts/post-next.mjs`.

## Current Defaults

- Brand: `Stop Getting Ignored`
- Subtitle: `Cold DM & Email Templates That Convert`
- Entry product: `Stop Getting Ignored`
- Launch price: `$19`
- Raise price to `$29` after 5 sales or 5% conversion on 100 visitors
- Primary CTA: free lead magnet download
- Secondary CTA: paid kit purchase
- Live Gumroad URL: `https://ferguson558.gumroad.com/l/StopGettingIgnored`

## Required User-Side Setup

- Gumroad account and payout details
- GitHub auth if repo publishing is delegated to the agent
- Social accounts for X and Threads
- One-time manual browser login for the persistent automation profile
- A repo with GitHub Pages enabled for Actions deployments
