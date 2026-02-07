# Phase 2 Execution Report (Blueprint & RFC) - Task 1.9

**Task ID:** 1.9  
**Git Head:** `63e7b4d834157b53fcb1d38649c556b85b8822e7`  

## 1. Problem Statement
The current Onboarding Step 2 implementation is non-functional for production requirements:
1.  **Data Depth:** Only 2-digit Chapters are supported; 6-digit level is required for trade matching.
2.  **Verification Gap:** E2E tests are blocked by authentication redirects. Previous attempts to use `?mock=true` backdoors violated **SEC-002**.

## 2. Proposed Solution

### A. 6-Digit HS Code Component
- **Component:** Enhance `HSCodeSearch.tsx` to handle a multi-level search.
- **Filtering Logic:** Update the `useMemo` filter to prioritize 6-digit matches and support drilling down from Chapter -> Heading -> Subheading.
- **UI:** Add badges to visually distinguish Chapter vs. Subheading in search results.

### B. Secure Verification Strategy (Ralph Compliant)
Instead of adding backdoors to the application code, we will:
1.  **Playwright Cookie Injection:** Update `tests/e2e/golden-path.spec.ts` to use a global setup that injects a valid Supabase session cookie directly into the `browserContext`.
2.  **Environment Isolation:** Verification will be done against `npm run dev` in the terminal, utilizing Playwright's own browser binaries.

## 3. Alternatives Considered
| Alternative | Pro | Con |
| :--- | :--- | :--- |
| `?mock=true` Bypass | Extremely fast to implement | **VIOLATES SEC-002** (P0 Breach). |
| Real Auth in Tests | Most realistic verification | Slows down CI; requires real secrets. |
| **Cookie/Session Injection** | Secure, fast, no code impact | Requires complex test setup. |

## 4. Trade-offs Analysis
Choosing "Cookie Injection" maintains the security integrity of the production codebase (RALPH compliance) at the cost of slightly higher complexity in the test setup.

## 5. User Review Required
> [!IMPORTANT]
> The search will now yield significantly more results (6-digit level). I will implement a "Category Grouping" view to prevent UI clutter.

---
**Status: ✅ APPROVED (2026-02-07)**  
*Proposed by Antigravity AI*
