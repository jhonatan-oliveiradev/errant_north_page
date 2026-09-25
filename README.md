# ERRANT NORTH — Cartography of the Impossible

Official cinematic website for **ERRANT NORTH**, migrated from the original React/Vite implementation to **Next.js App Router + Tailwind CSS v4** while preserving the existing interface, motion language, responsive behavior, GSAP timelines and Lenis smooth scrolling.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Lenis

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run typecheck
npm run build
```

The visual layer intentionally stays close to the source implementation. Migration-specific changes are limited to framework bootstrap, metadata/fonts, Tailwind's Next.js PostCSS integration and SSR-safe client boundaries.
