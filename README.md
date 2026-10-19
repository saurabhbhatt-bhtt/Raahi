# Raahi — mountain travel community

Raahi is a mobile-friendly community for solo travellers exploring Himachal Pradesh, Uttarakhand and other mountain destinations.

## Working now

- Email and password sign-up and sign-in through Supabase Auth
- Public traveller profiles, posts, recommendations and photo uploads
- Story filters, likes, comments, follow/unfollow and post deletion by the author
- Private post reports for signed-in members
- Raahi AI travel Q&A through the Cloudflare Pages Function when its Workers AI binding is connected
- Mobile layout, keyboard focus styles, screen-reader labels and reduced-motion support

## Community and privacy

Profile names, posts, comments and uploaded photos are public. Email addresses are not shown on the site. Photo uploads accept JPG, PNG and WebP up to 5 MB. Users should only share details and images they are comfortable making public. The `travel-photos` bucket has owner-folder upload and delete rules. Database tables use row-level security.

Stays and adventure cards are area/category previews, not confirmed operator listings. Raahi does not yet take trip registrations, bookings, payments or product orders. AI travel answers do not verify live weather, road conditions, permits, prices or operator availability.

## Supabase setup

The connected project is `trailfolk` in Mumbai. The client uses only its publishable key; never add a service-role key to this site. The existing database already contains account profiles, posts, likes, comments and the `travel-photos` bucket. The additional follow, private-report and longer-story schema is recorded in `supabase/migrations/`.

For confirmation emails to return to the live site, open **Authentication → URL Configuration** in Supabase and set:

- **Site URL:** `https://raahi-85r.pages.dev`
- **Redirect URL:** `https://raahi-85r.pages.dev/`

Then test sign-up with an email address you control and follow Supabase's confirmation email. Supabase may require email confirmation before a new member can post.

## Cloudflare Pages

This repository is connected to the private GitHub repository. Keep the production branch as `main`, build command as `exit 0`, build output directory as `.`, and project root as the repository root so Cloudflare can load `index.html`, `community.js` and `functions/`.

The production AI function expects a Workers AI binding named `AI`. See [AI-SETUP.md](AI-SETUP.md) for Cloudflare setup details and the travel guide's limits.
