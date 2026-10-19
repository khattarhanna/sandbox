# Motorzone Auto Parts — storefront prototype

**Status:** Production-deployed visual prototype only. No customer orders or payments are processed.

## Design brief

- Uses the logo mark traced from the owner's supplied image (black/white and Motorzone orange).
- Reinterprets the owner's "Analogue" UI reference: black product gallery, monochrome typography, rounded 17.6px cards, light catalog section, white pill CTA.
- Hero shows an illustrative automotive front-end assembly. During scrolling, separate SVG components animate from exploded offsets to aligned positions. Reduced-motion preference is respected.
- Hyundai Kona product examples derive from a Motorzone reference advertisement uploaded by the owner.

## Features

- Responsive desktop/mobile UI and accessible navigation
- Filterable and searchable sample catalog of 15 body parts
- Vehicle selector preview (Hyundai Kona only)
- Local-browser parts list and copyable quotation-request draft
- Scroll-driven component assembly; no external animation library
- Illustration labels avoid pretending real product photography
- No fake prices, live inventory, fitment guarantees, orders, payments, or live contact service

## Production build

Static project: `index.html`, `styles.css`, `app.js`, `logo-light.svg`, `logo-dark.svg`, `robots.txt`.

No build or install command. Vercel framework setting: Other. Both development and production deployments can serve the root.

## Needed to become real e-commerce

1. Confirm Motorzone company details, domain and contact channels.
2. Obtain part SKUs, high-resolution product imagery, makes/models/years/fitment identifiers, stock, pricing, taxation and currency.
3. Choose checkout policies, shipping zones, returns, payment gateway.
4. Set up backend (catalog, authentication, inventory, orders, secure admin panel) with protected keys, webhook verification and storage.
5. Test ordering and delivery end-to-end before accepting sales.

The prior Al Hashem POS app was replaced on the active branch on 2026-10-19; earlier Git history and historical Vercel deployments may retain earlier code. Old POS Supabase Vercel environment variables were disabled in the preceding step, but original credentials must still be revoked from their source if they are active.


## Realistic Motorzone concept imagery (2026-10-19)

The site uses /assets/hero-hyundai-kona-exploded.webp as the Hyundai Kona exploded-assembly concept hero and nine /assets/hyundai-kona-*.webp photosimulated product images. They were generated for design purposes, are not SKU/OEM photos and should not be considered actual parts stock or guaranteed vehicle compatibility. Six sample entries have SVG placeholders pending genuine matching visuals. /media.js and /media.css layer the images onto the existing catalog and animate a gentle scroll-based hero photo transform. A single flattened image does not allow mechanically accurate parts assembly; a 3D model or independently rendered matched layers would be necessary for that effect.
