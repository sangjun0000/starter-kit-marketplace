# Code Analyzer Memory - starter-kit-marketplace

## Project Overview
- Next.js 16.1.6, React 19, TypeScript strict, Tailwind CSS 4, TanStack Query 5, Zustand 5
- Architecture: types -> lib -> services -> hooks -> features/components -> app (pages/routes)
- i18n: Manual inline ko/en translation objects (next-intl installed but mostly unused)
- Mock data layer (no database); API routes serve from in-memory arrays

## Key Architecture Patterns
- Clean layered architecture: types, lib/api, services, hooks, features, app
- API routes under `src/app/api/` with NextRequest/NextResponse
- State: Zustand with persist middleware for client state, React Query for server state
- Localization: Manual `locale` prop threading, `localize()` helper for LocalizedString

## Known Issues (from Feb 2026 analysis)
- Nested `<html>` tags: root layout AND locale layout both render `<html>` (Critical)
- Duplicate `toKitSummary()` in kits/route.ts and search/route.ts (DRY violation)
- i18n messages files exist but are not imported anywhere (dead code / incomplete integration)
- No rate limiting on any API routes
- No input validation on review POST endpoints (no POST handler exists for review creation)
- FriendlyTermBadge tooltip `aria-label` is Korean-only, not locale-aware
- ReviewSection pagination replaces results instead of appending (load more behavior)
- `useCategories` hook calls api.get directly instead of going through a service layer
