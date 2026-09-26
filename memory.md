# Memory — Auth FE/BE Wiring + Axios Layer, Tested E2E

Last updated: 2026-09-23

## What was built

- BE (`server/src/auth/`): register sets session cookie + returns `{success, data}` like login; JWT signs standard `sub` claim (was `{userId}` — broke ALL guarded routes); `GET /me` wrapped in `{success, data}`; duplicate-email → `ConflictException` 409; logout `clearCookie` matches set attrs; password `@MinLength(8) @MaxLength(72)`; `fullName` `@IsNotEmpty()`; new `server/.env.example`.
- FE (`client/`): axios installed; `services/api.ts` (shared instance + response interceptors: `success:false` rejection, message normalization, 401/network fallbacks); `services/auth.service.ts` (login/register/me/logout, thin); `components/auth/AuthContext.tsx` + `Providers.tsx` (mounted in root layout); Navbar shows user + Logout / Sign-in; both auth pages submit per-mode with correct payload (vendor checkbox → role); Apple provider filtered with comment; `client/.env.example` (+ `!.env.example` exception in `client/.gitignore` so it can commit).
- Font loading fixed properly: `<link>` with `precedence="default"` in layout, removed duplicate CSS `@import` (killed React hydration console errors).
- Topology locked: BE `:3000`, FE `:3001` (`next dev --port 3001`), `NEXT_PUBLIC_API_URL=http://localhost:3000`.

## Decisions made

- Blueprint (/architect) decisions, all approved: BE-side register session; BE:3000/FE:3001; AuthContext + /me (not server-first); full scope incl. leftovers.
- Review overrides (mine, reviewer overruled with rationale): kept `sameSite: "strict"` (correct for localhost, CSRF posture; revisit for split-domain prod); kept Apple entry behind filter (one-line re-enable).
- Dummy OAuth placeholders (`dev-placeholder`) in local `server/.env` so BE boots without real apps; OAuth buttons fail at provider until real creds exist.
- Dev-only JWT secret generated locally (gitignored). Real secrets never in repo/chat/memory.

## Problems solved

- Stale Next dev server squatting on `:3000` masked as BE (Next 404 HTML on `/auth/me`) — killed all node, restarted cleanly.
- BE boot crash: `OAuth2Strategy requires a clientID option` (empty-string env passes `getOrThrow` but passport rejects) — dummy placeholders.
- `next/font/google` can't load Material Symbols (Next 16) — CDN link + `precedence` (verified: single css2 request, `document.fonts.status=loaded`, zero hydration errors).
- PS 5.1 Invoke-WebRequest POST quirk → `-UseBasicParsing`; curl.exe Windows quoting → JSON via `@file`.
- chrome-devtools unavailable this session → Playwright (Python) + HTTP-level tests instead.

## Current state

- E2E verified live (BE:3000 + FE:3001, both running): register 201+cookie, /me 200 (proves sub fix), duplicate 409, short-pw 400, login 201, wrong-pw 401 with exact server message, logout→/me 401, Set-Cookie attrs (sub/Max-Age/Path/HttpOnly/Strict), Google+GitHub 302s, Apple 404.
- Playwright: 6/6 flows pass (register→Navbar name, reload persistence, logout, wrong-pw message, login→Navbar, tab toggle), 0 failed requests, 0 console errors (only benign 401 probe log). Screenshots in Temp\opencode\shots\ (02 home logged-in, 04 login error, 07 mobile, 08 desktop fixed).
- Tree ready to commit on `feature/auth-module` (only intended files; `.env` + `.env.local` gitignored and excluded).

## Next session starts with

1. Commit the batch (if not done): auth wiring + axios layer + interceptors + fixes.
2. Real OAuth creds (user task, guide delivered in chat): Google Cloud + GitHub OAuth apps with callbacks `http://localhost:3000/auth/google/callback` and `.../github/callback` → paste into local `server/.env` → restart BE → click-test buttons.
3. Then: marketplace_home screen or route guards (deferred).

## Open questions

- None blocking. Toast/visible-success-message system deferred (interceptor ready to feed it). `memory.md` commit precedent: included in past commits, keep consistent.
- Catalog slice deferrals (decided 2026-09-23, revisit later):
  - Reviews subsystem — the source of truth that will maintain `Product.ratingAvg`/`ratingCount` (seeded honestly until then)
  - Real shipping logic — currently a seller-provided `freeShipping` boolean (matches mock pills without faking a subsystem)
