# Memory — BE Auth Module Scaffold + Prisma Setup

Last updated: 2026-09-11 (evening session)

## What was built

- `server/` — fresh NestJS v11 scaffold with auth deps installed (@nestjs/config, @nestjs/jwt, @nestjs/passport, @nestjs/swagger@11, Prisma v7, @prisma/adapter-pg, pg, bcrypt, class-validator/-transformer, cookie-parser, passport + passport-jwt/-google-oauth20/-github2)
- `server/prisma/schema.prisma` — `User` model (uuid id, unique email, nullable passwordHash/googleId/githubId, Role enum buyer/seller/admin default buyer, optional SellerStatus pending/approved/rejected, avatarUrl, timestamps) + generator/datasource blocks; initial migration applied to Neon Postgres
- `server/src/prisma/prisma.service.ts` + `prisma.module.ts` skeletons (user-written, import error under investigation — see below)
- `client/` — fresh Next.js scaffold (user-created, untouched since)
- `store-api/` deleted; `AGENTS.md` created at repo root; `context/` planning docs written (project-overview, architecture, build-plan, progress-tracker, code-standards, library-docs, ui-registry, ui-rules, ui-tokens, command-log); `context/` added to root `.gitignore`
- Committed as 96e6388 on branch `feature/auth-module` (not pushed). `server/.env` holds the real Neon DATABASE_URL and is gitignored — verify never staged.

## Decisions made

- No external backend: NestJS `server/` is the sole backend and sole JWT issuer (InsForge references in context docs are stale, need update)
- Flat repo layout: `server/` + `client/` side by side (architecture.md still shows old `apps/` + Turborepo layout — needs update)
- Auth pattern: NestJS Passport (local + Google + GitHub strategies), HTTP-only cookie JWT, global JwtAuthGuard with `@Public()`, `@CurrentUser()`, role from JWT + `seller_status` always checked fresh from DB
- Single `users` table, one account per email across all strategies; seller registration sets `seller_status=pending`
- CORS with credentials between client and server (separate domains)
- Prisma v7 pinned (v8 RC rejected); `@nestjs/swagger` pinned to v11 (v12 needs Nest 12)
- Password reset + refresh-token rotation explicitly deferred to post-MVP (logged in progress-tracker.md Notes)
- Pairing mode: user builds, assistant guides with explanations (user is FE dev learning BE — explain every BE concept in FE terms)
- Branch-per-feature, never main; never commit/push without explicit user approval

## Problems solved

- swagger v12 vs Nest 11 peer conflict → pinned `@nestjs/swagger@^11.0.0`
- Prisma 8 RC installed by default, `--datasource-provider` flag gone → pinned `prisma@7`, `@prisma/client@7`, `@prisma/adapter-pg@7`, plain `prisma init`
- `prisma7.config.ts` not picked up by migration engine → renamed to default `prisma.config.ts`
- P1001 Neon unreachable → idle-compute cold start; fix was waking the project in Neon dashboard + retry (URL already direct/unpooled, correct for migrate)
- `prisma generate` "no generators defined" → the User-model snippet had replaced the whole schema file; re-prepended `generator client` + `datasource db` blocks
- Nested `server/.git` from `nest new` removed so server/ is tracked by the main repo

## Current state

- Migration `20260911204004_init` applied; Prisma client generated to `server/generated/` (gitignored)
- `prisma.service.ts` reports TS2307 cannot find `../../generated/prisma/client` — generate succeeded after the error appeared, so likely just needs a TS server restart; unverified
- `server/src/auth/` holds three empty placeholder files (controller/module/service)
- Todos: scaffold ✅, PrismaService/PrismaModule in progress; auth-core, auth, CORS/wiring, Swagger/tests, doc updates pending

## Next session starts with

1. Confirm TS2307 is gone after TS server restart (or paste the exact import line)
2. Review `prisma.service.ts` + `prisma.module.ts`, wire `PrismaModule` into `AppModule`
3. Build `auth-core/` (JWT module, JwtStrategy, JwtAuthGuard global, `@Public()`, `@CurrentUser()`, roles guard)

## Open questions

- None blocking. Stale docs to fix later: architecture.md layout diagram, AGENTS.md/context InsForge-backend references.
