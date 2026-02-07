# Task S0.1 — Infrastructure: Tooling + Error Boundaries + Security

**Block:** S0.1
**Status:** PASSED (2026-02-07 — 3rd submission)
**Prerequisites:** Phase 4 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Set up the production infrastructure that should have existed from Phase 1. This is a single block covering: test framework, error/loading boundaries, Sentry observability, security headers, rate limiting, env validation, DB hardening, and API error patterns.

After this block, the codebase has a test runner, every route group has error/loading boundaries, Sentry captures exceptions, and the reveal endpoint is rate-limited.

---

## Deliverable 1: Vitest + React Testing Library

### Install (dev dependencies):
- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `jsdom`
- `@vitejs/plugin-react`

### Create: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Create: `tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
```

### Update: `package.json`

Add script:
```json
"test": "vitest run",
"test:watch": "vitest"
```

### Update: `tsconfig.json`

Ensure `tests/` directory is included in TypeScript compilation. Add `"tests"` to `include` array if not present.

---

## Deliverable 2: Playwright E2E

### Install (dev dependency):
- `@playwright/test`

### Create: `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

### Update: `package.json`

Add script:
```json
"test:e2e": "playwright test"
```

---

## Deliverable 3: Error Boundaries

### Create: `src/app/global-error.tsx`

Client Component (`'use client'`). Root-level error boundary for unrecoverable errors.

- Display: BMN logo (text), "Something went wrong" heading, error message (dev only), "Go Home" button linking to `/`
- Style: Centered, full-screen, `bg-bmn-light-bg`
- Must import its own `<html>` and `<body>` tags (Next.js requirement for global-error)
- Calls `Sentry.captureException(error)` — wire in Deliverable 6

### Create: `src/app/(auth)/error.tsx`

Client Component. Auth-specific error boundary.
- Display: "Something went wrong" + "Return to Login" link
- Style: Matches auth layout (centered card)

### Create: `src/app/(dashboard)/error.tsx`

Client Component. Dashboard error boundary.
- Display: "Something went wrong" + "Return to Dashboard" link + "Try Again" button (calls `reset()`)
- Style: Matches dashboard layout

### Create: `src/app/(admin)/error.tsx`

Client Component. Admin error boundary.
- Display: "Something went wrong" + "Return to Admin Dashboard" link + "Try Again" button
- Style: Matches admin dark theme

### Create: `src/app/(legal)/error.tsx`

Client Component. Legal pages error boundary.
- Display: "Something went wrong" + "Return to Home" link
- Style: Simple, centered

All error boundaries must:
- Accept `{ error, reset }` props
- Log `error.message` to console
- Call `Sentry.captureException(error)` (wired in D6)
- Show user-friendly message (never expose stack traces in production)

---

## Deliverable 4: Not Found Page

### Create: `src/app/not-found.tsx`

Server Component. Custom 404 page.
- Display: "404" large number, "Page not found" heading, "The page you're looking for doesn't exist or has been moved." description, "Go Home" button
- Style: Centered, full-screen, BMN branding (`text-bmn-blue` for 404 number)

---

## Deliverable 5: Loading States

Create `loading.tsx` skeleton screens for every route group and key pages.

### Route group loading states:

| File | Skeleton |
|------|----------|
| `src/app/(auth)/loading.tsx` | Centered card placeholder with pulse animation |
| `src/app/(dashboard)/loading.tsx` | Sidebar + main area skeleton with 3 card placeholders |
| `src/app/(admin)/loading.tsx` | Dark sidebar + main area skeleton |
| `src/app/(legal)/loading.tsx` | Header + content area placeholder |

### Page-level loading states:

| File | Skeleton |
|------|----------|
| `src/app/(dashboard)/dashboard/loading.tsx` | 3 stat cards (pulse) + recent matches list skeleton |
| `src/app/(dashboard)/matches/loading.tsx` | Filter bar + 4 match card skeletons |
| `src/app/(dashboard)/matches/[id]/loading.tsx` | Full match detail skeleton (header + content cards) |
| `src/app/(dashboard)/campaigns/loading.tsx` | 4 campaign card skeletons |
| `src/app/(dashboard)/campaigns/[id]/loading.tsx` | Campaign detail skeleton |
| `src/app/(dashboard)/profile/loading.tsx` | 5-card profile layout skeleton |

All loading states:
- Use Tailwind `animate-pulse` on `bg-gray-200 rounded` placeholder elements
- Match the actual page layout dimensions so content doesn't shift on load
- Are Server Components (no `'use client'` needed)

---

## Deliverable 6: Sentry Configuration

### Create: `sentry.client.config.ts` (project root)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});
```

### Create: `sentry.server.config.ts` (project root)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

### Create: `sentry.edge.config.ts` (project root)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

### Update: `next.config.ts`

Wrap the config with `withSentryConfig()`:

```typescript
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = { /* existing config */ };

export default withSentryConfig(nextConfig, {
  silent: true,
  org: 'bmn',
  project: 'bmn-site',
});
```

### Update: Error boundaries (D3)

All 5 error boundaries must import `* as Sentry from '@sentry/nextjs'` and call `Sentry.captureException(error)` in a `useEffect` on mount.

### Update: `.env.example`

Add `NEXT_PUBLIC_SENTRY_DSN=` to the example file.

---

## Deliverable 7: Security Headers

### Update: `next.config.ts` headers function

Add these headers to the existing `/:path*` source (alongside existing X-Frame-Options, X-Content-Type-Options, Referrer-Policy):

```typescript
{
  key: 'Content-Security-Policy-Report-Only',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://*.sentry.io;"
},
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
},
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=()'
},
```

**Note:** CSP starts as `Report-Only` to avoid breaking anything. Upgrade to enforcing after verification in a future block.

---

## Deliverable 8: Rate Limiting

### Create: `src/lib/rate-limit.ts`

In-memory sliding window rate limiter. Acceptable for single-server Vercel deployment.

```typescript
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}
```

### Update: `src/app/api/matches/[id]/reveal/route.ts`

At the top of the POST handler, after auth check:

```typescript
import { rateLimit } from '@/lib/rate-limit';

// After auth check:
const { success, remaining } = rateLimit(`reveal:${user.id}`, 10, 60 * 1000);
if (!success) {
  return NextResponse.json(
    { error: 'Too many requests', code: 'RATE_LIMITED' },
    { status: 429, headers: { 'Retry-After': '60' } }
  );
}
```

---

## Deliverable 9: Environment Validation

### Update: `src/lib/env.ts`

Expand to validate all environment variables:

```typescript
import { z } from 'zod';

// Client-safe env vars (exposed to browser)
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

// Server-only env vars (never exposed to browser)
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

// Only parse server env when running on server
export const serverEnv = typeof window === 'undefined'
  ? serverSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
  : null;
```

**Important:** Do NOT break existing imports of `env`. If existing code imports `env` from this file, export a backwards-compatible alias.

---

## Deliverable 10: DB Connection Hardening

### Update: `src/lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
```

---

## Deliverable 11: API Error Class

### Create: `src/lib/api-error.ts`

```typescript
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled error:', error);
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}
```

Do NOT refactor existing API routes to use this yet. That happens incrementally via the Retrofit Rule as routes are touched in future blocks.

---

## Deliverable 12: Health Check Endpoint

### Create: `src/app/api/health/route.ts`

```typescript
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: 'ok', db: 'connected' });
  } catch {
    return NextResponse.json({ status: 'error', db: 'disconnected' }, { status: 503 });
  }
}
```

No auth required — this is a public health check for monitoring.

---

## Deliverable 13: First Unit Tests

### Create: `tests/lib/api-error.test.ts`

Test the `ApiError` class and `handleApiError`:
- `ApiError` returns correct JSON shape and status code
- `handleApiError` with ApiError returns structured response
- `handleApiError` with unknown error returns 500

### Create: `tests/lib/rate-limit.test.ts`

Test the rate limiter:
- First request succeeds with correct remaining count
- Request at limit returns success=false
- After window expires, counter resets

### Create: `tests/lib/env.test.ts`

Test env validation:
- Valid env vars parse successfully
- Missing required var throws ZodError

At least **3 test files with 8+ test cases total**. Must all pass with `npm run test`.

---

## Deliverable 14: First E2E Smoke Test

### Create: `e2e/smoke.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/BMN/);
  expect(page.url()).not.toContain('error');
});

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
});

test('signup page loads', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.getByRole('heading', { name: /create.*account/i })).toBeVisible();
});
```

Must pass with `npm run test:e2e` (requires dev server running).

---

## Constraints

- **Authorized new dependencies (dev only):** vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @vitejs/plugin-react, @playwright/test
- **No production dependencies** — all testing deps are devDependencies
- **No refactoring existing code** — only add new files and minimal modifications to existing files
- **Do not modify any existing page.tsx** — only add error.tsx, loading.tsx, not-found.tsx
- **Do not modify any existing API route** except `reveal/route.ts` (rate limiter)
- **Sentry DSN may be empty** — `NEXT_PUBLIC_SENTRY_DSN` is optional in env schema. Sentry init should gracefully no-op if DSN is missing.
- **CSP is Report-Only** — do not use enforcing CSP yet
- **Design system:** Error/loading/404 pages use existing BMN tokens: `bg-bmn-light-bg`, `text-text-primary`, `text-bmn-blue`, `btn-primary`, `font-display`
- **Icons from `lucide-react` only**

---

## Evidence Required

Save all to `docs/evidence/block-S0.1/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph + test) | `gates.txt` |
| `npm run test` output | `test-output.txt` |
| `npm run test:e2e` output | `e2e-output.txt` |
| 404 page screenshot | `screenshot-404.png` |
| Dashboard loading skeleton screenshot | `screenshot-loading-dashboard.png` |
| Error boundary screenshot (trigger via dev tools) | `screenshot-error-boundary.png` |
| `curl -I localhost:3000` showing security headers | `headers-output.txt` |
| Rate limit test: 11 rapid curls to reveal endpoint | `rate-limit-test.txt` |
| `curl localhost:3000/api/health` | `health-check.txt` |

**No evidence, no PASS.**

---

## PM Audit Notes (2026-02-07)

**PM VERDICT: FAIL** (evidence missing)

**Code Review: ✅ PASS** — All 14 deliverables implemented correctly:
- D1-D14: All files exist, implementations match spec
- Sentry wired into all 5 error boundaries
- Rate limiter protecting reveal endpoint (10 req/min)
- Security headers correct (CSP Report-Only, HSTS, Permissions-Policy)
- DB connection hardened (max: 10, timeouts set)
- 8 unit tests passing, 3 E2E tests passing

**Gates: ✅ 4/4 PASSED**
- Build: PASSED (0 errors)
- Lint: PASSED (scripts/ excluded, 0 errors on src/)
- Ralph: 5/6 PASSED (P1 rate limiting warning accepted per spec)
- Test: 8/8 unit tests PASSED

**Evidence: ❌ 1/9 files**
- Only `verification_log.txt` present
- Missing: gates.txt, test-output.txt, e2e-output.txt, 6 screenshots/curl outputs
- Auto-fail per Standing Orders 3B

**Remediation:** Evidence collection only — no code changes needed.

---

## PM Re-Audit Notes (2026-02-07, Re-Submission #2)

**PM VERDICT: FAIL** (3 narrow evidence issues)

**Gates: ✅ 4/4 PASSED** (independently verified by PM)
- Build: PASSED (0 errors, 60s compile, 28 static pages)
- Lint: PASSED (0 errors, 0 warnings)
- Ralph: 5/6 (P1 rate limiting advisory — accepted per spec)
- Test: 8/8 unit tests PASSED

**Code Review: ✅ 14/14 PASSED** — Independent spot-check confirms all deliverables.

**Evidence: ❌ 3 issues remain**

| # | Issue | Severity |
|---|-------|----------|
| 1 | `e2e-output.txt` shows `landing page loads` FAILED (`net::ERR_ABORTED`, 35.1s timeout). `verification_log.txt` falsely claims "3 passed". | BLOCKING |
| 2 | `self-audit.txt` missing (mandatory per Standing Orders 3C) | BLOCKING |
| 3 | `screenshot-loading-dashboard.png` shows login page, not dashboard skeleton. Misleading filename. | MINOR — rename or remove |

**Accepted Exceptions:**
- Rate limit test SKIPPED (auth-blocked, Supabase down) — code verified in first audit
- Dashboard loading screenshot auth-blocked — accepted if file is renamed/removed
- Health check returns 503 (db disconnected) — correct behavior

**Remediation (narrow scope, <30 min):**
1. Investigate E2E `ERR_ABORTED` on landing page. Likely needs `waitUntil: 'domcontentloaded'` or increased timeout in `e2e/smoke.spec.ts`. Fix, re-run, update `e2e-output.txt`.
2. Correct `verification_log.txt` to reflect accurate results. Do not claim tests pass when evidence shows failure.
3. Create `self-audit.txt` per Standing Orders 3C template.
4. Delete or rename `screenshot-loading-dashboard.png` to avoid misleading filename.

**No deliverable code changes required.**

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass
npm run test           # All unit tests pass
```

All four gates must pass. Update `docs/governance/project_ledger.md` under Block S0.1. Mark as **`SUBMITTED`**.
