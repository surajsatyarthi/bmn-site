# Task 4.0 — Production Readiness (PRD Phase 4)

**Block:** 4.0
**Status:** SUBMITTED
**Prerequisites:** Phases 1-3 COMPLETE, Sprint 0 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Execute PRD Phase 4 (Production Readiness) which was skipped. Make the app production-ready by:
1. Fixing P1 security warning (rate limiting)
2. Verifying end-to-end quality
3. Deploying to Vercel
4. Smoke testing production

**No deployment until this block PASSES.**

---

## Deliverable 1: P1 Security Fix

### Fix: Rate Limiting on Reveal Endpoint

**File:** `src/app/api/matches/[id]/reveal/route.ts`

**Requirement:** Add rate limiting using existing `rateLimit` utility from S0.1.

**Implementation:**
```typescript
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await limiter.check(10, 'REVEAL_ENDPOINT'); // 10 requests per minute
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // ... existing reveal logic
}
```

**Acceptance:**
- Ralph scan must show 6/6 PASSED (no P1 warnings)
- Test: Send 11 requests in 1 minute → 11th should return 429

---

## Deliverable 2: End-to-End Flow Testing

### Test: Complete User Journey

**Flow:**
1. Sign up (new email)
2. Verify email (Supabase inbox)
3. Complete 6-step onboarding
4. View dashboard (stats populated)
5. View matches (tier badges visible)
6. Reveal a match (free tier: 3 reveals)
7. Attempt 4th reveal → blocked by paywall
8. View campaign (metrics visible)
9. Edit profile
10. Logout

**Evidence Required:**
- `e2e-flow-screenshots/` directory with 10+ screenshots
- Document in `e2e-test-walkthrough.md` with pass/fail for each step

**Acceptance:**
- All 10 steps complete without errors
- No blank screens, no hydration errors, no 500s

---

## Deliverable 3: Error Handling Audit

### Verify: All Forms and APIs Handle Errors Gracefully

**Forms to Audit:**
- `/signup` → duplicate email, weak password
- `/login` → wrong password, unverified email
- `/forgot-password` → invalid email
- `/onboarding` → incomplete required fields, invalid HS codes
- `/profile` → edit validation

**APIs to Audit:**
- All POST/PATCH routes return proper error responses (400/401/403/500)
- All API routes use `ApiError` from S0.1
- All API routes return structured JSON errors

**Evidence Required:**
- `error-handling-audit.md` with test cases + screenshots

**Acceptance:**
- No generic "Something went wrong" messages
- All errors show user-friendly messages
- All API errors return JSON (not HTML)

---

## Deliverable 4: Loading States & Skeletons

### Verify: No Blank Screens During Data Fetch

**Pages to Audit:**
- `/dashboard` → loading skeleton for stats
- `/matches` → loading skeleton for match list
- `/matches/[id]` → loading skeleton for match detail
- `/campaigns` → loading skeleton for campaign list
- `/campaigns/[id]` → loading skeleton for campaign detail
- `/profile` → loading skeleton for profile data

**Evidence Required:**
- `loading-states.md` documenting each page's loading UX
- Screenshots of loading states

**Acceptance:**
- All data-fetching pages have `loading.tsx` with skeleton UI
- No pages show blank white screen during load

---

## Deliverable 5: Empty States

### Verify: First-Run UX

**Scenarios:**
- User has 0 matches → show "No matches yet" with helpful message
- User has 0 campaigns → show "No campaigns yet"
- User has 0 reveals left → show paywall message

**Evidence Required:**
- `empty-states.md` with screenshots of each scenario

**Acceptance:**
- All empty states have friendly copy + clear next action
- No pages show empty lists without explanation

---

## Deliverable 6: Mobile Responsive Audit

### Verify: All Pages Work at 375px (iPhone SE)

**Pages to Test:**
- Landing page
- Signup/Login
- Onboarding (all 6 steps)
- Dashboard
- Matches list + detail
- Campaigns list + detail
- Profile

**Evidence Required:**
- `mobile-screenshots/` directory with 375px screenshots (10+ pages)
- `mobile-audit.md` documenting any layout breaks

**Acceptance:**
- No horizontal scroll
- All buttons/forms usable on mobile
- Text readable without zoom

---

## Deliverable 7: SEO Metadata

### Add: Metadata to All Pages

**Pages Missing Metadata:**
- Check all route pages for `export const metadata` or `generateMetadata()`

**Required Fields:**
- `title`
- `description`
- `openGraph` (optional but recommended)

**Evidence Required:**
- `seo-audit.md` listing all pages + their metadata

**Acceptance:**
- All public pages have unique titles and descriptions
- No pages show default "Create Next App" metadata

---

## Deliverable 8: 404 and Error Pages

### Verify: Error Page Quality

**Files:**
- `src/app/not-found.tsx` (404 page)
- `src/app/error.tsx` (500 page)
- `src/app/global-error.tsx` (global error boundary)

**Evidence Required:**
- Screenshots of 404 page
- Screenshots of error page (simulate error in dev)

**Acceptance:**
- Error pages match BMN branding
- Error pages have "Go Home" or "Try Again" buttons
- No generic Next.js default error pages

---

## Deliverable 9: Vercel Deployment

### Deploy: Production Environment

**Steps:**
1. Create Vercel project (link to GitHub repo)
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for migrations)
3. Deploy main branch
4. Run database migrations on production
5. Seed production DB with test data (1 admin user, 5 matches, 2 campaigns)

**Evidence Required:**
- Production URL
- Screenshot of Vercel deployment success
- Screenshot of production homepage
- Screenshot of production dashboard (logged in)

**Acceptance:**
- App loads on production URL
- Signup/login works on production
- Database connected (no connection errors)

---

## Deliverable 10: Production Smoke Test

### Test: Critical Paths on Production

**Tests:**
1. Sign up new user on production
2. Verify email (check Supabase inbox)
3. Complete onboarding
4. View dashboard
5. View matches
6. Reveal a match

**Evidence Required:**
- `production-smoke-test.md` with pass/fail for each test
- Production screenshots

**Acceptance:**
- All tests pass on production environment
- No console errors in browser
- Performance: Pages load in <3 seconds

---

## Constraints

- **Do not modify core features** — only add error handling, loading states, metadata
- **Do not skip Vercel deployment** — this is a hard requirement
- **Do not deploy if P1 warning exists** — must pass Ralph 6/6 first
- **Mobile testing at 375px** — iPhone SE viewport (narrowest common device)

---

## Evidence Required

Save all to `docs/evidence/block-4.0/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph + test) | `gates.txt` |
| Pre-submission gate run | `pre-submission-gate.txt` |
| Ralph scan output (must show 6/6 PASSED) | `ralph-clean.txt` |
| E2E test walkthrough | `e2e-test-walkthrough.md` |
| E2E screenshots | `e2e-flow-screenshots/*.png` |
| Error handling audit | `error-handling-audit.md` |
| Loading states documentation | `loading-states.md` |
| Empty states documentation | `empty-states.md` |
| Mobile screenshots (375px) | `mobile-screenshots/*.png` |
| Mobile audit report | `mobile-audit.md` |
| SEO audit | `seo-audit.md` |
| Error page screenshots | `error-pages/*.png` |
| Production URL | `production-url.txt` |
| Vercel deployment screenshot | `vercel-deployment.png` |
| Production smoke test report | `production-smoke-test.md` |
| Production screenshots | `production-screenshots/*.png` |
| Test output | `test-output.txt` |
| Self-audit checklist | `self-audit.txt` |

**No evidence, no PASS.**

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # 0 errors, warnings OK if existing
npm run ralph:scan     # Must show 6/6 PASSED (no P1 warnings)
npm run test           # All unit tests pass
```

All four gates must pass. Production URL must be live and functional.

Update `docs/governance/project_ledger.md` under Block 4.0. Mark as **`SUBMITTED`**.
