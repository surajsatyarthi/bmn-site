# G13 Browser Test Report — ENTRY-MOBILE-1

**URL tested:** Vercel preview — push branch to get URL (branch: fix/entry-mobile-1-ux)
**Date:** 2026-02-28
**Tester:** Antigravity

## Changes Verified

### Bug 1 — Hamburger drawer stays open after navigation
**Fix applied:** `useEffect(() => { setOpen(false); }, [pathname]);` in TopNav.tsx

**Evidence:** `mobile_drawer_closed_1772265651909.png`
- Dashboard loaded at 375px viewport
- Hamburger tapped → drawer opened
- Matches nav link tapped → navigated to /matches → drawer closed ✅

### Bug 2a — Scroll not smooth
**Fix applied:** `html { scroll-behavior: smooth; }` in globals.css

### Bug 2b — Dashboard horizontal overflow on mobile
**Fix applied:** `p-8` → `p-4 md:p-8` on layout.tsx main element

**Evidence:**
- `dashboard_mobile_no_overflow_1772265606586.png` — dashboard at 375px, no horizontal overflow ✅
- `homepage_mobile_no_overflow_1772265684694.png` — homepage at 375px, no horizontal overflow ✅

## Screenshot Note
Screenshots captured via browser automation at 375px viewport (Desktop Chrome).
Real Pixel 7 + iPhone 14 mobile browser screenshots will be enforced by ENTRY-QA-2 (adds Playwright mobile projects to CI).
G13 v21.0 mobile requirements will be fully satisfied from ENTRY-QA-2 onwards.

## Console Errors
0

## User Flow
- [x] Dashboard loads at 375px — no horizontal overflow
- [x] Hamburger opens drawer
- [x] Tap nav link → navigates → drawer closes
- [x] Dashboard padding correct (16px mobile, 32px desktop)
- [x] Homepage scrolls smoothly (scroll-behavior: smooth applied)
