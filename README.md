# Raahi — mountain travel community MVP

Raahi is an early, mobile-friendly discovery prototype for solo travellers exploring Himachal Pradesh, Uttarakhand and other mountain destinations.

## What is in this MVP

- Mountain adventure activities and destination discovery
- A monthly strangers-trip concept
- Traveller community and trip story previews
- A travel Q&A chat interface powered by a Cloudflare Pages Function when Workers AI is connected

The community cards are sample content. This first version does not yet include traveller accounts, a persistent social feed, verified stays or activity operators, bookings, payments, or trip registration. Check current local conditions and qualified operators before undertaking mountain or adventure activities.

## Deploy on Cloudflare Pages

This repository is prepared for Cloudflare Pages Git integration. Set the production branch to `main`, build command to `exit 0`, and build output directory to `.`. Keep the repository root as the Pages project root so Cloudflare can see both `index.html` and the top-level `functions/` directory.

After the first deploy, add a Workers AI binding named `AI` under the Pages project's production Functions bindings and redeploy. See [AI-SETUP.md](AI-SETUP.md) for setup steps and limitations.

