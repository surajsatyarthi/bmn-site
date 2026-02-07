# Task 1.14 — Route Group Restructure

**Block:** 2.3
**Status:** TODO
**Prerequisites:** Blocks 2.1 and 2.2 PASSED

---

## Objective

Restructure the app directory to use Next.js Route Groups for clean separation between public auth pages and protected dashboard pages. File move + layout refactor — no new features, no UI changes, no behavior changes.

---

## Pre-task: Cosmetic Fix

In `src/app/page.tsx` line 110, `-tr-y-1/2` is an invalid Tailwind class. Fix to `-translate-y-1/2`. One-line change, do it first.

---

## Current State

```
src/app/
├── layout.tsx              # Root layout
├── page.tsx                # Landing page (public)
├── login/page.tsx
├── signup/page.tsx
├── verify-email/page.tsx
├── forgot-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── onboarding/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
└── api/
    └── profile/
        ├── route.ts
        └── onboarding/route.ts
```

## Target State

```
src/app/
├── layout.tsx              # Root layout (DO NOT MODIFY)
├── page.tsx                # Landing page (cosmetic fix only)
├── (auth)/
│   ├── layout.tsx          # NEW — Auth layout (centered card)
│   ├── login/page.tsx      # MOVED
│   ├── signup/page.tsx     # MOVED
│   ├── verify-email/page.tsx    # MOVED
│   └── forgot-password/page.tsx # MOVED
├── (dashboard)/
│   ├── layout.tsx          # EXISTS — enhance with sidebar
│   ├── dashboard/
│   │   └── page.tsx        # NEW — Dashboard home stub
│   ├── onboarding/
│   │   ├── layout.tsx      # EXISTS — DO NOT MODIFY
│   │   └── page.tsx        # EXISTS — DO NOT MODIFY
│   └── profile/
│       └── page.tsx        # EXISTS — DO NOT MODIFY
└── api/                    # DO NOT TOUCH
```

---

## Deliverable 1: `(auth)` Route Group

### Create: `src/app/(auth)/layout.tsx`

- Full-height centered layout: `min-h-screen flex items-center justify-center`
- Background: `bg-bmn-light-bg`
- "BMN" logo text linking to `/` at the top
- Content card: `bg-white rounded-xl border border-bmn-border p-8 shadow-sm w-full max-w-md`
- No sidebar, no header nav

### Move pages into `(auth)/`:

- `src/app/login/page.tsx` → `src/app/(auth)/login/page.tsx`
- `src/app/signup/page.tsx` → `src/app/(auth)/signup/page.tsx`
- `src/app/verify-email/page.tsx` → `src/app/(auth)/verify-email/page.tsx`
- `src/app/forgot-password/page.tsx` → `src/app/(auth)/forgot-password/page.tsx`

### Post-move checklist:

- Delete old empty directories
- Verify all import paths still resolve
- Route Groups don't affect URLs — `/login` stays `/login`
- Middleware uses path strings, not filesystem paths — should work, but verify

---

## Deliverable 2: Dashboard Home Stub

### Create: `src/app/(dashboard)/dashboard/page.tsx`

Server Component. Read profile from DB (same pattern as `profile/page.tsx`):
- Redirect to `/login` if unauthenticated
- Redirect to `/onboarding` if `onboardingCompleted === false`

Display:
- Header: "Dashboard" with subtitle "Welcome back. Your trade overview is coming soon."
- Single placeholder card: "Your buyer matches, campaign stats, and trade analytics will appear here."
- Card style: `bg-white rounded-xl border border-bmn-border p-8 shadow-sm`
- No client-side state

---

## Deliverable 3: Enhance `(dashboard)/layout.tsx`

Add a sidebar + top bar shell:

### Top bar
- "BMN" logo (links to `/`)
- Right side: "Account" placeholder text

### Sidebar
- Width: `w-64`
- Style: `bg-white border-r border-bmn-border`
- Hidden on mobile: `hidden md:flex`
- Nav links using `Link` from `next/link`:
  - "Dashboard" → `/dashboard` (icon: `LayoutDashboard`)
  - "Profile" → `/profile` (icon: `User`)
  - "Matches" → `/matches` — disabled (`opacity-50 cursor-not-allowed`), no href
  - "Campaigns" → `/campaigns` — disabled, same treatment

### Active link detection
- Use `usePathname()` from `next/navigation`
- **Extract nav into a separate client component:** `src/components/dashboard/DashboardNav.tsx`
- Keep the layout itself as a Server Component

### Main content area
- `flex-1 p-8 bg-bmn-light-bg min-h-screen`

### Onboarding compatibility
- The onboarding pages have their own nested layout
- The sidebar should appear on `/dashboard` and `/profile`
- Onboarding layout already overrides the chrome — do not break it

---

## Constraints

- No new dependencies
- Do not modify `src/app/layout.tsx` (root layout)
- Do not modify any API routes
- Do not modify any onboarding components or the profile page content
- Do not modify `src/middleware.ts` unless route moves break path matching (they shouldn't)
- Icons from `lucide-react` only

---

## Verification Gate

```bash
npm run build
npm run lint
```

Zero errors, zero warnings on all new/modified files.

### Route verification (manually confirm):
- `/` → Landing page
- `/login` → Auth login (centered card layout)
- `/signup` → Auth signup (centered card layout)
- `/dashboard` → Dashboard stub (with sidebar)
- `/profile` → Profile page (with sidebar)
- `/onboarding` → Onboarding wizard (its own layout, no sidebar)

---

## Submission

Update `docs/governance/project_ledger.md` under Block 2.3. Mark as **`SUBMITTED`** — not `PASSED`.
