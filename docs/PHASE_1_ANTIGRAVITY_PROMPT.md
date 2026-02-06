# PHASE 1 PROMPT — Antigravity AI Coder
## BMN v2: Database, Auth & Onboarding

**Role:** You are the AI coder for BMN. You will implement Phase 1 of the PRD exactly as specified. You must record every decision, file created, file modified, and any deviation from the PRD.

**PM:** Claude (PM Protocol). At the end of this phase, you will present a detailed report. The PM will verify every deliverable before approving. Do not proceed to Phase 2 until Phase 1 is approved.

**Rule:** If you are unsure about any requirement, refer to the PRD. If the PRD doesn't cover it, ask — do not assume.

---

## CONTEXT: What Already Exists

Read these files first to understand the current codebase:

### Core Config
- `bmn-site/package.json` — Dependencies, scripts. Next.js 16.1.6, React 19, Tailwind v4, Supabase, Drizzle ORM (installed but unused), Zod, Lucide React, Resend.
- `bmn-site/tsconfig.json` — TypeScript config. Strict mode. Path alias: `@/* → ./src/*`
- `bmn-site/next.config.ts` — Security headers, React Compiler enabled
- `bmn-site/postcss.config.mjs` — `@tailwindcss/postcss` plugin (DO NOT DELETE)
- `bmn-site/.env.example` — Environment variables template
- `bmn-site/.env.local` — Actual env vars (DO NOT commit, DO NOT read contents into output)

### Design System
- `bmn-site/src/app/globals.css` — Tailwind v4 theme with BMN design tokens. Colors: bmn-blue (#2046f5), bmn-gold (#FF8C00), bmn-light-bg (#fafbfc), bmn-border (#e5e7eb), text-primary (#0f172a), text-secondary (#64748b). Fonts: Inter (body), Oswald (display). Button: blue diagonal gradient. **Do not change existing tokens. You may add new ones.**
- `bmn-site/src/app/layout.tsx` — Root layout with Inter + Oswald fonts from Google Fonts. Metadata: "BMN - Connect Grow Succeed"

### Existing Pages
- `bmn-site/src/app/page.tsx` — Homepage/landing page. Must be updated with new copy (see Task 1.13).
- `bmn-site/src/app/login/page.tsx` — Login page. Client component. Uses Supabase `signInWithPassword`. Keep mostly as-is.
- `bmn-site/src/app/signup/page.tsx` — Signup page. Client component. Currently collects Full Name, Company Name, Email, Password. Must be simplified (see Task 1.7).

### Existing Components
- `bmn-site/src/components/layout/Header.tsx` — Sticky navigation. BMN logo, nav links (Features, Pricing, About — currently unmapped), Login + Get Started buttons. Mobile hamburger.

### Existing Lib
- `bmn-site/src/lib/supabase/client.ts` — Supabase browser client. Uses `@supabase/ssr`. Has build-time fallback values.
- `bmn-site/src/lib/env.ts` — Zod env validation for SUPABASE_URL and ANON_KEY.
- `bmn-site/src/lib/utils.ts` — `cn()` utility for Tailwind class merging.
- `bmn-site/src/lib/payment/placeholder.ts` — Payment placeholder. Leave as-is.

### API
- `bmn-site/src/app/api/route_placeholder.ts` — Empty placeholder. Replace with real routes.

### QA System
- `bmn-site/scripts/ralph-security-scanner.ts` — Security scanner. Must pass at end of phase.
- `bmn-site/scripts/ralph-validator.sh` — Pre-commit hook.
- `bmn-site/ralph-protocol.yml` — Protocol definition.

### PRD (Source of Truth)
- `bmn-site/docs/PRD_V2_EXPORT_DONE_FOR_YOU.md` — **Read this entire file before starting. It contains all specs, database schema, design guidelines, and founder decisions.**

---

## TASKS — Execute in Order

### Task 1.1: Install Dependencies

```bash
cd bmn-site
npm install react-hook-form @hookform/resolvers @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-progress @radix-ui/react-tabs @radix-ui/react-avatar
```

**Record:** Paste the exact install output showing versions installed.

---

### Task 1.2: Database Schema (Drizzle ORM)

Create `src/lib/db/schema.ts` with Drizzle ORM table definitions for ALL of these tables:

1. **profiles** — id (uuid PK, references auth.users.id), full_name, phone, whatsapp, trade_role (enum: exporter/importer/both), monthly_volume, onboarding_step (int, default 1), onboarding_completed (boolean, default false), plan (text, default 'free'), created_at, updated_at
2. **companies** — id, profile_id (FK), name, entity_type, founding_year, size, street, city, state, country (default 'India'), pin_code, website, iec_number, created_at, updated_at
3. **products** — id, profile_id (FK), hs_code (2-6 digit WCO international), name, description, trade_type (enum: export/import/both), created_at
4. **trade_interests** — id, profile_id (FK), country_code (ISO 3166-1 alpha-2), country_name, interest_type (enum: export_to/import_from), created_at
5. **certifications** — id, profile_id (FK), type, certificate_number, valid_until, document_url, created_at

Create `src/lib/db/index.ts` — DB client that connects using DATABASE_URL env var.

**Reference:** PRD Section 5 "Database Schema" has the complete column specs.

**Record:** Paste the full schema.ts file content in your report.

---

### Task 1.3: Supabase Migration SQL

Create `supabase/migrations/001_initial_schema.sql` with the raw SQL to create all tables from Task 1.2. Include:
- Proper UUID defaults (`gen_random_uuid()`)
- Foreign key constraints with `ON DELETE CASCADE`
- RLS policies: users can only read/write their own data
- Indexes on profile_id for all child tables
- Timestamps with `DEFAULT now()`

**Record:** Paste the full SQL file in your report.

---

### Task 1.4: Auth Middleware

Create `src/middleware.ts` (Next.js middleware) that:
- Checks for authenticated Supabase session
- Redirects unauthenticated users to `/login` for protected routes: `/dashboard`, `/onboarding`, `/matches`, `/campaigns`, `/profile`
- Allows public access to: `/`, `/login`, `/signup`, `/forgot-password`, `/verify-email`, `/api/*`
- Redirects authenticated users from `/login` and `/signup` to `/dashboard`

Also create `src/lib/supabase/server.ts` — Supabase server client for use in Server Components and API routes.

**Record:** Paste middleware.ts and server.ts in your report. Show a test of accessing /dashboard when logged out (should redirect to /login).

---

### Task 1.5: Email Verification Enforcement

After login, check if the user's email is verified (`user.email_confirmed_at`). If not verified:
- Redirect to `/verify-email` page
- Show: "Check your email. We sent a verification link to {email}."
- Button: "Resend verification email"
- Do NOT allow access to /dashboard or /onboarding until verified

**Record:** Screenshot of verify-email page.

---

### Task 1.6: Forgot Password

Create `/forgot-password` page:
- Email input
- "Send Reset Link" button → calls `supabase.auth.resetPasswordForEmail()`
- Success state: "Check your email for a password reset link."
- Link back to Login
- Styling: match login page exactly

**Record:** Screenshot of forgot-password page.

---

### Task 1.7: Simplify Signup

Modify `src/app/signup/page.tsx`:
- **Remove** "Company Name" field (moves to onboarding)
- **Keep** Full Name, Email, Password
- **Add** "I agree to the Terms of Service" checkbox (required, link to /terms placeholder)
- After successful signup → redirect to `/verify-email` (not login)

**Record:** Before/after screenshots of signup page. Paste code diff.

---

### Task 1.8: Onboarding Flow (6 Steps)

This is the biggest task. Build a multi-step onboarding wizard at `/onboarding`.

**Route structure:**
```
src/app/(dashboard)/onboarding/page.tsx        — Main wrapper, reads current step
src/app/(dashboard)/onboarding/layout.tsx       — Onboarding layout (no sidebar, just progress bar)
```

**Components to create:**
```
src/components/onboarding/StepProgress.tsx      — Progress bar showing Step X of 6
src/components/onboarding/TradeRoleStep.tsx      — Step 1: Exporter/Importer/Both
src/components/onboarding/ProductStep.tsx        — Step 2: Product/HS code selection
src/components/onboarding/TradeInterestsStep.tsx — Step 3: Target countries + volume
src/components/onboarding/BusinessDetailsStep.tsx— Step 4: Company info
src/components/onboarding/CertificationsStep.tsx — Step 5: Certs + IEC (optional)
src/components/onboarding/ReviewStep.tsx         — Step 6: Review all + submit
```

**Behavior:**
- Progress bar at top: "Step X of 6" with visual progress
- Each step saves to DB via API route on "Next"
- "Back" button on every step (except step 1)
- "Save & Continue Later" — saves current step, returns to dashboard
- Current step tracked in `profiles.onboarding_step`
- If user returns to /onboarding, resume at their saved step
- After step 6 submit → set `profiles.onboarding_completed = true` → redirect to /dashboard
- All form validation with Zod + react-hook-form
- All form data persists across page refreshes (read from DB on mount)

**Step Details:** See PRD Section 4.2 for exact fields, options, and data captured per step.

**API route:** Create `src/app/api/profile/onboarding/route.ts`
- PUT: accepts `{ step: number, data: object }`, validates with Zod, upserts to correct table

**Record:** Screenshot of every step (6 screenshots). Paste the onboarding page.tsx, each step component, and the API route.

---

### Task 1.9: HS Code Dataset & Search Component

Create `src/lib/data/hs-codes.json`:
- Include all 99 chapters (2-digit) with descriptions
- Include all ~1,244 headings (4-digit) with descriptions
- Format: `{ code, level, description, parent_code, section, chapter }`
- Source: WCO Harmonized System. 6-digit international standard only.

Create `src/components/onboarding/HSCodeSearch.tsx`:
- Search input that filters HS codes by description (fuzzy match)
- Shows popular categories as clickable chips for quick selection
- Expandable tree: Chapter → Heading
- User can select multiple codes
- Each selected code shows as a removable chip/tag
- Minimum 1 selection required

**Record:** Screenshot of HS code search with results. Paste hs-codes.json structure (first 10 entries + count of total entries).

---

### Task 1.10: Country Selection Component

Create `src/lib/data/countries.json`:
- All countries with ISO 3166-1 alpha-2 codes and display names
- Include common trade partners prominently

Create `src/components/onboarding/CountrySelect.tsx`:
- Multi-select with search
- Popular countries shown as quick-select chips (USA, UK, UAE, Germany, Saudi, Japan, Singapore, Australia)
- Selected countries shown as removable tags

**Record:** Screenshot of country selector. Count of countries in dataset.

---

### Task 1.11: Certification Selection Component

Create `src/components/onboarding/CertificationSelect.tsx`:
- Checkbox list of common certifications (see PRD Step 5 for full list)
- "Other" option with free-text input
- IEC Number field (text input, optional, with "Recommended" badge)

**Record:** Screenshot of certification step.

---

### Task 1.12: Profile Page

Create `src/app/(dashboard)/profile/page.tsx`:
- Displays all onboarding data in editable form sections
- Sections: Personal Info, Company Info, Products & HS Codes, Trade Interests, Certifications, Account Settings
- Each section has "Edit" toggle → inline editing → "Save" button
- Uses same components as onboarding (HSCodeSearch, CountrySelect, etc.)
- API routes for updates: `src/app/api/profile/route.ts` (GET, PUT)

**Record:** Screenshot of profile page. Paste the page component and API route.

---

### Task 1.13: Update Landing Page

Rewrite `src/app/page.tsx` with new sections (see PRD Section 4.7):

1. **Hero** — "We Find Your Buyers. You Ship." + subheadline + CTAs
2. **How It Works** — 4 steps with icons
3. **Trusted By** — Logo bar (Maersk, Walmart, Toyota, Samsung, Adani)
4. **Numbers** — 200+ Companies, 30+ Countries, 1M+ Database Entries
5. **Who Is This For** — 4 bullets
6. **Pricing** — Free vs Pro (Coming Soon) cards
7. **Footer** — BMN branding, links, copyright

Keep `Header.tsx` for public pages. Update nav links to match new pages.

**Record:** Full screenshot of new landing page (full scroll). Paste page.tsx.

---

### Task 1.14: Route Group Restructure

Restructure `src/app/` into route groups:

```
src/app/
├── (auth)/              ← No header/sidebar, auth-specific layout
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── verify-email/page.tsx
├── (dashboard)/         ← Authenticated layout (with navigation)
│   ├── layout.tsx
│   ├── dashboard/page.tsx    ← placeholder for Phase 2
│   ├── onboarding/page.tsx
│   ├── profile/page.tsx
│   ├── matches/page.tsx      ← placeholder for Phase 2
│   └── campaigns/page.tsx    ← placeholder for Phase 2
├── page.tsx             ← Public landing page
├── layout.tsx           ← Root layout
├── globals.css
└── api/
    └── ...
```

Move existing login and signup pages into (auth) group. Create placeholder pages for Phase 2 routes (just a centered "Coming in Phase 2" text).

**Record:** Paste `tree` output of final src/app/ directory structure.

---

## REPORT TEMPLATE

At the end of Phase 1, submit this report:

```markdown
# Phase 1 Completion Report

## Summary
- Total files created: [count]
- Total files modified: [count]
- New dependencies installed: [list with versions]

## Deliverables Checklist
- [ ] 1.1 Dependencies installed (list versions)
- [ ] 1.2 Drizzle schema (paste schema.ts)
- [ ] 1.3 Migration SQL (paste SQL)
- [ ] 1.4 Auth middleware (screenshot: blocked access proof)
- [ ] 1.5 Email verification page (screenshot)
- [ ] 1.6 Forgot password page (screenshot)
- [ ] 1.7 Simplified signup (before/after screenshots)
- [ ] 1.8 Onboarding (6 screenshots, one per step)
- [ ] 1.9 HS code search (screenshot + entry count)
- [ ] 1.10 Country selector (screenshot + country count)
- [ ] 1.11 Certification selector (screenshot)
- [ ] 1.12 Profile page (screenshot)
- [ ] 1.13 Landing page (full scroll screenshot)
- [ ] 1.14 Route structure (tree output)

## Quality Checks
- [ ] `npm run build` passes (paste output)
- [ ] `npm run lint` passes (paste output)
- [ ] `npm run ralph:scan` passes (paste output)
- [ ] No TypeScript errors
- [ ] No hardcoded secrets in code
- [ ] All new pages are mobile responsive

## Deviations from PRD
List any changes made that differ from the PRD, with justification:
1. [deviation + reason]

## Known Issues
1. [any issues discovered during implementation]

## Files Created
[List every new file with path]

## Files Modified
[List every modified file with path and what changed]
```

---

## RULES

1. **Read the full PRD before writing any code.** File: `bmn-site/docs/PRD_V2_EXPORT_DONE_FOR_YOU.md`
2. **Do not modify** `globals.css` design tokens, `postcss.config.mjs`, `next.config.ts`, or ralph protocol files — unless adding to them.
3. **Follow existing patterns.** Check how `login/page.tsx` handles Supabase auth before building new auth flows.
4. **Use the BMN design system.** All buttons use `btn-primary` class. All inputs use `rounded-lg border-bmn-border`. All headings use `font-display`. Check `globals.css` for available tokens.
5. **Validate everything with Zod.** Every form step, every API route input.
6. **No placeholder/dummy data in production code.** HS codes and countries must be real data.
7. **Record everything.** Every file you create, every file you modify, every decision you make.
8. **Build must pass.** `npm run build` must complete without errors before submitting your report.
9. **ESLint must pass.** `npm run lint` must complete without errors.
10. **Security scan must pass.** `npm run ralph:scan` must pass.
