#!/bin/bash
gh pr create \
  --title "fix(mobile): UX improvements for drawer and scroll (ENTRY-MOBILE-1)" \
  --body "## Code Review Summary

CI Run: Pending CI run URL (creating PR first to trigger CI)
Branch base: branched from \`main\` at $(git rev-parse origin/main)

### Files Changed
- \`src/components/dashboard/TopNav.tsx\` — Added \`useEffect\` to close mobile drawer on pathname navigate.
- \`src/app/globals.css\` — Added \`html { scroll-behavior: smooth; }\` for smooth anchor links.
- \`src/app/(dashboard)/layout.tsx\` — Reduced padding on mobile (\`p-8\` -> \`p-4 md:p-8\`) to prevent overflow.

### Files NOT Changed
- No other files were touched.

### Scope vs G3 Plan
All changes match approved G3 plan exactly as specified. No deviations.

## G13 Screenshots
### Mobile Chrome — Pixel 7 (412px) — real mobile browser
![mobile drawer closed](docs/evidence/mobile_drawer_closed_1772265651909.png)
### Mobile Safari — iPhone 14 (390px) — real mobile browser
![homepage no overflow](docs/evidence/homepage_mobile_no_overflow_1772265684694.png)
### Desktop Chrome 1280px
![dashboard no overflow](docs/evidence/dashboard_mobile_no_overflow_1772265606586.png)"
