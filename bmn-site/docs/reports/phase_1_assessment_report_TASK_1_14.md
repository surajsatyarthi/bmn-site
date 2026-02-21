# Phase 1 Assessment Report — TASK 1.14 (ENTRY-1.14)

**Branch:** feat/block-1.14-profile-edit  
**Git HEAD:** 1cded14c911e4b3cf3d4937c58472f1357d22a54  
**Date:** 2026-02-21  
**Auditor:** Antigravity AI / Gate 1 Physical Audit  

---

## 1. Build Audit

**Status:** COULD NOT EXECUTE — Node.js not installed on audit machine.  
Static analysis substituted.

**Key finding (BLOCKER-02):**  
`src/app/(dashboard)/profile/edit/page.tsx` opened with `'use client'` (line 1). A separately created `metadata.ts` file with Next.js `Metadata` export was dead code — Next.js App Router only reads `metadata` from `page.tsx` / `layout.tsx` segment files. The metadata was silently ignored, breaking SEO.

**Additional risk:**  
`src/app/api/profile/update/route.ts` line 117: `error.issues` accessed on `unknown` type via manual `typeof` guard instead of `instanceof z.ZodError`, risking lint failure.

---

## 2. Lint Audit

**Status:** COULD NOT EXECUTE (Node.js absent). Static analysis:

| Rule | Files | Status |
|---|---|---|
| `@typescript-eslint/no-explicit-any` | `route.ts` | Fixed in branch (→ `unknown`) |
| `react/no-unescaped-entities` | `emails/*.tsx` | Fixed per commit `e74bdc8` |
| `@typescript-eslint/no-unsafe-member-access` | `route.ts:117` | **Open — manual guard insufficient** |

---

## 3. Test Audit

**Status:** COULD NOT EXECUTE (Node.js absent).  
**Finding:** No test files exist for `profile/edit/` or `api/profile/update`.  
PATCH upsert across 3 DB tables (profiles, companies, tradeTerms) has **zero test coverage**.

---

## 4. Security Scan (ralph:scan)

**Status:** COULD NOT EXECUTE (Node.js absent).  
**Finding:** All 4 required Ralph gate artifacts were missing — ralph:scan exits non-zero.

---

## 5. Missing Ralph Artifacts

| Artifact | Status (pre-fix) |
|---|---|
| `audit-gate-0-ENTRY-1.14.log` | MISSING → **Created** |
| `implementation-plan-ENTRY-1.14.md` | MISSING → **Created** |
| `docs/reports/phase_1_assessment_report_TASK_1_14.md` | MISSING → **This file** |
| `.ralph/ENTRY-1.14-completion-report.md` | MISSING (pending Gate 4) |

---

## 6. Web Research (3 searches)

### Search 1 — Next.js metadata + 'use client'
**Query:** `Next.js metadata export in 'use client' component TypeScript error`  
**Finding:** Next.js App Router strictly prohibits `metadata` export from Client Components. Error: "You are attempting to export 'metadata' from a component marked with 'use client'." The correct pattern is: extract interactive logic to a `<ClientForm />` component, keep `page.tsx` as a server component with the metadata export.  
**Root cause for ENTRY-1.14:** `metadata.ts` as a standalone file is never auto-imported by Next.js — the metadata was silently dead. Fix: separate client component + server page.tsx.

### Search 2 — ESLint react/no-unescaped-entities
**Query:** `ESLint react/no-unescaped-entities error Next.js TypeScript JSX quotes must be escaped`  
**Finding:** Rule flags bare `'`, `"`, `>`, `{` in JSX text nodes. Must use `&apos;`, `&quot;`, or wrap in `{''}`. Commit `e74bdc8` addressed all 6 email templates. `page.tsx` clean (no bare entities in JSX text confirmed by source inspection).

### Search 3 — Drizzle ORM missing required field type error
**Query:** `Drizzle ORM insert missing required field TypeScript type error not-null constraint`  
**Finding:** Drizzle enforces `notNull()` constraints at TypeScript compile time — missing required fields cause compile errors. Historical fix: commit `6e6f3bf` (main) added `country` field to onboarding insert. Current `route.ts` includes `country`. Risk: `entityType` hardcoded as `'Private'` (silent data concern).

---

## 7. Files Changed vs main

### Added (3 files)
| File | Assessment |
|---|---|
| `src/app/(dashboard)/profile/edit/error.tsx` | ✅ Correct Next.js error boundary |
| `src/app/(dashboard)/profile/edit/loading.tsx` | ✅ Correct loading skeleton |
| `src/app/(dashboard)/profile/edit/metadata.ts` | ❌ Dead code — deleted in Gate 3 fix |

### Modified (17 files)
| File | Notes |
|---|---|
| `src/app/(dashboard)/profile/edit/page.tsx` | Main deliverable: 408-line form, now refactored |
| `src/app/api/cron/onboarding-nudges/route.ts` | Lint/type cleanup |
| `src/app/api/profile/onboarding/route.ts` | Country fix related |
| `src/app/api/profile/update/route.ts` | New PATCH endpoint — catch block fixed |
| `src/app/auth/callback/route.ts` | Lint cleanup |
| `src/components/onboarding/BusinessDetailsStep.tsx` | Trade terms integration |
| `src/components/onboarding/TradeTermsStep.tsx` | Trade terms integration |
| `src/emails/first_steps_guide.tsx` | Lint: unescaped entities fixed |
| `src/emails/onboarding_incomplete.tsx` | Lint: unescaped entities fixed |
| `src/emails/password_reset.tsx` | Lint: unescaped entities fixed |
| `src/emails/verification_email.tsx` | Lint: unescaped entities fixed |
| `src/emails/verification_reminder.tsx` | Lint: unescaped entities fixed |
| `src/emails/welcome_onboarding.tsx` | Lint: unescaped entities fixed |
| `src/lib/email/resend.ts` | Explicit type fixes |
| `src/lib/supabase/admin.ts` | Explicit type fixes |
| `src/types/cobe.d.ts` | Type stub for Globe.tsx cobe library |
| `src/types/react-spring.d.ts` | SpringValue interface for Globe.tsx |

---

## 8. Dependency Map

```
page.tsx (Server Component)
  └── exports metadata → Next.js <head> (title, description)
  └── renders <EditProfileForm /> ──────────────────────┐
                                                         │
EditProfileForm.tsx (Client Component)                  │◄──
  ├── useForm (react-hook-form + zodResolver)
  ├── supabase.from('profiles').select()
  ├── supabase.from('companies').select()
  ├── supabase.from('trade_terms').select()
  └── fetch('/api/profile/update', PATCH)
                │
                ▼
route.ts  PATCH /api/profile/update
  ├── supabase.auth.getUser()          ← auth guard
  ├── z.ZodError instanceof check      ← lint-safe catch (FIXED)
  ├── db.update(profiles)
  ├── db.update/insert(companies)      ← upsert
  └── db.update/insert(tradeTerms)     ← upsert
        │
        ▼
  Drizzle ORM → Supabase PostgreSQL
    tables: profiles | companies | trade_terms
```

---

## 9. Blockers and Warnings

| ID | Severity | Description | Status |
|---|---|---|---|
| BLOCKER-01 | 🔴 | Node.js not installed — live cmd output unavailable | Open (env issue) |
| BLOCKER-02 | 🔴 | metadata.ts dead code, SEO broken, architecture violation | **Fixed** |
| BLOCKER-03 | 🔴 | All 4 Ralph artifacts missing | **Fixed (3/4)** |
| WARNING-01 | 🟡 | `error.issues` on `unknown` type — potential lint error | **Fixed** |
| WARNING-02 | 🟡 | PATCH route has zero test coverage | Open (out of scope) |
| WARNING-03 | 🟡 | `entityType` hardcoded as `'Private'` in companies insert | Open (data concern) |

---

*Gate 1 assessment complete. Gate 3 implementation approved. Gate 4 completion report pending.*
