# Memory — Auth Screens Redesigned to Match Design Spec

Last updated: 2026-09-22

## What was built

- Auth screens redesigned to match `client/design/sign_in_register/` and `sign_in_register_desktop/` HTML designs
- `client/app/(auth)/login/page.tsx` — full responsive rewrite (mobile + desktop split layout)
- `client/app/(auth)/register/page.tsx` — full responsive rewrite (mobile + desktop split layout)
- `client/components/ui/AuthCard.tsx` — complete rewrite with `default` (mobile) and `split` (desktop) layouts
- `client/components/ui/Input.tsx` — added `icon` + `iconPosition` props, updated focus ring
- `client/components/ui/Button.tsx` — added `icon` prop, new `SocialButton` component
- `client/app/globals.css` — added 33 Aura Material Design 3 surface tokens + 10 typography utilities
- `client/app/layout.tsx` — added Material Symbols Outlined font via `<link>` tag
- `client/design/` added to `.gitignore`

## Decisions made

- Responsive approach: mobile uses centered `max-w-md` card, desktop uses `lg:grid-cols-12` split layout with brand panel left + form right
- Material Symbols Outlined loaded via CDN `<link>` in layout (not next/font/google due to Next.js 16 font import limitations)
- Design tokens use CSS custom properties in `@theme` block, no raw hex in components
- Tab switching between Sign In / Create Account on mobile reveals/hides name field, vendor checkbox, and changes submit text
- Desktop shows all form fields always visible, with Apple social login and "Forgot password?" link

## Problems solved

- Material Symbols Outlined icons showing as colored text instead of glyphs — fixed by loading font via `<link rel="stylesheet">` in layout.tsx and adding minimal `.material-symbols-outlined` class in globals.css
- Next.js 16 `next/font/google` doesn't support Material Symbols Outlined font family — workaround using direct CDN link
- Icons now render correctly on both mobile and desktop breakpoints

## Current state

- Auth pages at `/login` and `/register` fully match design files
- Build succeeds (`npx next build` — 7/7 routes)
- Dev server running at `http://localhost:3000`
- All design tokens in globals.css, responsive layouts working
- Icons rendering correctly (verified in screenshots)

## Next session starts with

1. Continue building remaining screens from `client/design/` (marketplace_home, product_listing, product_detail, cart_checkout, seller_dashboard, admin_dashboard, user_profile_orders, vendor_application_review, add_edit_product)
2. Or test auth flow end-to-end with backend

## Open questions

- None — auth screens complete and matching design spec
