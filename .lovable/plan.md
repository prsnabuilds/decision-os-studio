# Fix remaining dashes + make DecisionOS installable on your phone

## What's actually going on with the dashes

Viewing in Chrome on mobile is not the cause. A scan of the app's source found only three remaining dash-like characters in visible copy, all in the Leave section of My Work:

- `Casual leave · 12 Aug – 13 Aug` (en dash, twice)

Everything else that looks like a long dash is either a normal hyphen `-` or a middot separator `·` used between metadata items.

Two likely reasons you still see them on your phone:

1. You are on the published site (`decision-os-studio.lovable.app`), which still serves the older build. Frontend changes only go live after publishing again.
2. The `·` middot separators and en dashes in date ranges read like dashes at small sizes.

## Changes

1. Replace the two `–` date-range dashes in My Work / Leave with `to` (e.g. `12 Aug to 13 Aug`).
2. Sweep every route and component for `—`, `–`, and stray dash-like characters in user-visible copy, including the landing page and login, and normalise them.
3. Replace `·` separators in dense metadata lines with spacing where they read as clutter on mobile, keeping them only where they genuinely separate two short values.
4. Publish afterwards so the phone sees the current build.

## Installable app (PWA)

Add home-screen installability only, no offline caching:

- `public/manifest.webmanifest` with app name "DecisionOS", short name "DecisionOS", `display: standalone`, indigo theme colour, and background colour matching the app surface.
- App icons at 192px, 512px, and a maskable 512px, generated from the existing brand mark, plus an Apple touch icon.
- Manifest, `theme-color`, and `apple-touch-icon` tags added to the head in `src/routes/__root.tsx`.

No service worker is added, so there is no risk of a stale cached build on your phone. After publishing, open the published URL on Android (Chrome menu > Add to Home screen) or iOS (Share > Add to Home Screen) and it installs as a standalone app with its own icon.

## Technical notes

- Manifest-only path per the PWA guidance; no `vite-plugin-pwa`, no `sw.js`, no registration code.
- Icons live under `public/` and are referenced by absolute paths.
- Installability requires the published URL; the editor preview iframe will not offer the install prompt.
