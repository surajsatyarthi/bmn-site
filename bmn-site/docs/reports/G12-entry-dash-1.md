# G12 Release Document: ENTRY-DASH-1
**Feature:** Remove NetworkComingSoon + Add Trade News Widget
**Branch:** `feat/entry-dash-1-news`
**Date:** 2026-03-01

## 1. Scope Verification (G4)
| File | Change |
|------|--------|
| `src/app/(dashboard)/dashboard/page.tsx` | Removed NetworkComingSoon import + usage. Rendered TradeNewsWidget. |
| `src/components/dashboard/TradeNewsWidget.tsx` | Created new component using Google News RSS + Regex parsing. |

**No unauthorized files were modified.** 

## 2. Test Verification (G11)
Automated GitHub CI is temporarily locked due to a billing issue. The following tests were run **locally** to ensure the code is production-ready.

### Local CI Results:
- **Build (`npm run build`):** PASSED ✅
- **Lint (`npx eslint <modified_files>`):** PASSED ✅ (Zero errors or warnings)
- **Unit Tests (`npm test`):** PASSED ✅ (77/77 tests passing)

## 3. Visual Verification (G13)
- Simulated mobile view (375px) via Vercel Preview confirms the 📰 Trade News widget fits naturally on the dashboard with zero horizontal overflow.
- The `NetworkComingSoon` component is successfully removed from the screen.

## 4. PM Sign-off Request
Code is structurally sound, performant (server component with cached fetch), and cleanly implemented without any new dependencies.

**Action Required:**
Please review the Vercel Preview link for branch `feat/entry-dash-1-news` and manually merge into `main`.
