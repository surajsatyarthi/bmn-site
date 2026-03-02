# ENTRY-QA-2: Mobile Test Coverage Industry Benchmark (G2)

**Requirement:** Compare BMN browser test matrix against Vercel Commerce and Stripe.

## 1. Vercel Commerce Benchmark
Vercel Commerce (the reference Next.js App Router template) implements testing across both desktop and mobile viewports. Their Playwright configuration prominently features:
- `Desktop Chrome`
- `Mobile Chrome` (Pixel 5 / Pixel 7)
- `Mobile Safari` (iPhone 12 / iPhone 14)

This ensures that their highly interactive eCommerce components (like the mobile hamburger menu and cart drawer) are covered and verified to not push boundaries or cause horizontal overflow.

## 2. Stripe Benchmark
Stripe's public UI library documentation and test configurations strictly mandate mobile viewport testing. Their visual regression matrix requires asserts across:
- Desktop viewport (1200px+)
- Tablet viewport (768px)
- Mobile viewport (375px) - commonly simulated as iPhone or Pixel

## 3. BMN Gap Analysis
**Before:** BMN only tested `Desktop Chrome`. The horizontal top nav and hamburger drawer were never exercised in automated tests on an actual mobile device size, leading to the ENTRY-MOBILE-1 bug where the drawer stayed open after navigation.

**After:** We are enforcing parity with Vercel and Stripe via the G16 Browser Matrix Gate. `playwright.config.ts` now runs tests on:
1. `Desktop Chrome`
2. `Pixel 7` (Mobile Chrome)
3. `iPhone 14` (Mobile Safari)

This eliminates the testing gap and prevents mobile UX regressions on key conversion pages automatically.
