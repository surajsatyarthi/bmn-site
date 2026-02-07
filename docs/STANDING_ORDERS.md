# STANDING ORDERS FOR AI CODER (Antigravity)

These orders apply to **every task** unless the PM explicitly overrides them.

---

## 1. TASK EXECUTION PROTOCOL

- **Read the spec first.** Every task has a spec file at `docs/tasks/task-{id}.md`. Read it fully before writing any code.
- **Do exactly what the spec says.** No extra features, no refactoring adjacent code, no "improvements" beyond scope.
- **Constraints are hard limits.** If the spec says "do not modify file X", do not modify file X.

## 2. LEDGER PROTOCOL

- **Update the ledger** at `docs/governance/project_ledger.md` when you complete a task.
- **Mark your status as `SUBMITTED`** — never `PASSED`. Only the PM audit changes status to `PASSED` or `FAILED`.
- **Include your verification output** (build + lint results) in the submission message.

## 3. VERIFICATION GATE (v2.0 — effective Sprint 0)

Every task must pass **all four gates** before submission:

```bash
npm run build        # Must compile with 0 errors
npm run lint         # New/modified files must produce 0 errors, 0 warnings
npm run ralph:scan   # Must pass — no secrets, no P0 security issues
npm run test         # All unit tests must pass (NEW — 4th gate)
```

If any gate fails, fix the issue before submitting. Do not submit broken or insecure code.

**Ralph Protocol is mandatory.** It scans for hardcoded secrets, exposed credentials, SQL injection vectors, and other P0 security issues. Every deliverable must clear this gate. No exceptions.

## 3A. QUALITY STANDARDS (v2.0 — effective Sprint 0)

Every block that touches a page or API must also ship:

| Requirement | When |
|-------------|------|
| `error.tsx` | Any new route group |
| `loading.tsx` | Any new page |
| `aria-label` on interactive elements | Any new/modified UI |
| `export const metadata: Metadata` | Any new `page.tsx` |
| Unit tests for new logic | Any new utility function or API route |
| `ApiError` class for error responses | Any new/modified API route |
| Mobile verification at 375px | Any new/modified UI (screenshot required) |
| No `any` types, unused imports, dead comments | Always |

### Retrofit Rule

When a block modifies an existing page, it must bring that page up to DoD v2.0:
- Add missing `metadata` export
- Add `aria-label` to interactive elements on that page
- Verify mobile rendering at 375px
- Add/update tests for modified logic

Existing pages get incrementally polished as they're touched. No separate polish phase.

## 3B. EVIDENCE SUBMISSION (MANDATORY)

Code that compiles is not proof that it works. Every submission must include **evidence artifacts** proving functional correctness. Save all evidence to `docs/evidence/block-{id}/`.

### NO EXCUSES CLAUSE (FAANG Standard — effective 2026-02-07)

The following are **NOT acceptable reasons** to skip evidence collection:

| Excuse | Why It's Rejected | What To Do Instead |
|--------|-------------------|-------------------|
| "Server is offline" | Restart it. `rm -rf .next && npm run dev` takes 30 seconds. | Restart server, collect screenshots |
| "Verified via static code analysis" | Code review ≠ functional testing. Blank screens don't show up in code. | Run the actual page in browser |
| "Build passed so it works" | Build only proves it compiles. Doesn't catch runtime errors, hydration issues, blank screens. | Functional test every modified page |
| "I don't have access to X" | You have full access to local dev server, local DB, local file system. | Use what you have |
| "It worked on my machine" | We only have one machine. If it doesn't work here, it doesn't work. | Screenshot the actual working state |
| "Tests will be added later" | DoD v2.0 requires tests to ship WITH the block, not after. | Write tests before submission |

**Rule:** If you cannot functionally verify your work, do not submit it. Fix your environment first, then test, then submit.

**PM Rule:** Any submission with an "excuse" for missing evidence is an **automatic FAIL**. No exceptions. No debate.

**Required evidence per block:**

| Evidence | How | File |
|----------|-----|------|
| **Gate output** | Copy terminal output of build + lint + ralph + test | `gates.txt` |
| **Test output** | Copy `npm run test` output showing all tests pass | `test-output.txt` |
| **Seed script output** | Run any new/modified seed scripts, copy output | `seed-output.txt` |
| **API curl tests** | `curl` every new/modified API endpoint, save response | `api-tests.txt` |
| **Page screenshots** | Run dev server, screenshot every new/modified page | `screenshot-*.png` |
| **Mobile screenshots** | Screenshot at 375px for any new/modified UI pages | `mobile-*.png` |
| **Migration verification** | If new migration, show it applies cleanly (or note if DB is blank) | `migration.txt` |

**How to produce screenshots:** Run `npm run dev`, open each page in the browser, take a full-page screenshot. Name files descriptively (e.g., `screenshot-campaigns-page.png`, `screenshot-footer.png`).

**How to produce API curl tests:**
```bash
# Example — save to docs/evidence/block-{id}/api-tests.txt
curl -s http://localhost:3000/api/campaigns | head -c 500
curl -s http://localhost:3000/api/campaigns/[test-id] | head -c 500
```

**PM will verify:** Gate output matches independent run. Screenshots show expected UI. API responses match spec. Seed output shows correct data. Missing evidence = automatic FAIL.

**No evidence, no PASS. No exceptions.**

## 3C. PRE-SUBMISSION GATE (MANDATORY — run BEFORE submitting)

Before you send ANY submission message to the PM, you MUST complete this checklist. If ANY item is unchecked, DO NOT SUBMIT.

```
PRE-SUBMISSION GATE — Block {id}
==================================
ENVIRONMENT:
[ ] Dev server is running (npm run dev)
[ ] .next cache cleared if route structure changed (rm -rf .next)
[ ] All modified pages tested in browser (not just code review)

GATES (all 4 must pass):
[ ] npm run build — 0 errors
[ ] npm run lint — 0 errors/warnings on modified files
[ ] npm run ralph:scan — passed
[ ] npm run test — all tests pass

EVIDENCE COLLECTED:
[ ] gates.txt saved to docs/evidence/block-{id}/
[ ] test-output.txt saved
[ ] Screenshots of EVERY modified page saved
[ ] Mobile screenshots at 375px saved (if UI changes)
[ ] self-audit.txt filled out (see Section 3D below)

RED FLAGS (if YES to any, DO NOT SUBMIT):
[ ] Did I use any excuse from the "NO EXCUSES" table?
[ ] Did I skip functional testing?
[ ] Am I marking myself as PASSED instead of SUBMITTED?
[ ] Is any evidence missing?

If all green boxes are checked and all red boxes are unchecked, you may submit.
```

**Save this checklist** to `docs/evidence/block-{id}/pre-submission-gate.txt` with all boxes checked before submitting.

## 3D. SELF-AUDIT (MANDATORY before submission)

After passing the Pre-Submission Gate (Section 3C), run the PM's detailed audit checklist. This catches defects before the PM sees them, saving tokens and rework cycles. Fill out and save to `docs/evidence/block-{id}/self-audit.txt`:

```
SELF-AUDIT CHECKLIST — Block {id} (v2.0)
==========================================
GATES:
[ ] 1. npm run build — 0 errors
[ ] 2. npm run lint — 0 errors, 0 warnings on new/modified files ONLY
[ ] 3. npm run ralph:scan — passed
[ ] 4. npm run test — all tests pass

SPEC COMPLIANCE:
[ ] 5. Read the full spec at docs/tasks/task-{id}.md
[ ] 6. Verified EVERY deliverable is implemented (list each D1-Dn with Y/N)
[ ] 7. All UI sections in spec are rendered (cross-checked every section)
[ ] 8. All API routes return correct status codes (401, 403, 404, 400, 200, 429)

CODE QUALITY:
[ ] 9. Grepped new files for `any` types — 0 found
[ ] 10. Grepped new files for unused imports — 0 found
[ ] 11. No dead/placeholder comments (// TODO, // ..., // rest of function)
[ ] 12. Security: auth checks on every protected route

DOD v2.0 QUALITY:
[ ] 13. error.tsx exists for any new route group
[ ] 14. loading.tsx exists for any new page
[ ] 15. aria-label on new interactive elements
[ ] 16. metadata export on new page.tsx files
[ ] 17. Unit tests written for new utility functions / API routes
[ ] 18. ApiError class used in new/modified API routes
[ ] 19. Mobile verified at 375px (screenshot saved)
[ ] 20. Retrofit: any modified existing page brought up to DoD v2.0

EVIDENCE:
[ ] 21. Evidence artifacts saved to docs/evidence/block-{id}/
[ ] 22. test-output.txt saved
[ ] 23. mobile-*.png saved (if UI changes)
[ ] 24. Ledger updated as SUBMITTED (not PASSED)
```

**If any item fails, fix it before submitting.** The PM runs this exact checklist. Every defect caught by the PM that the self-audit should have caught is tracked as avoidable rework. See `docs/governance/kpi_kra.md` for scoring.

## 4. CODE STANDARDS

- **No `any` types.** Use strict TypeScript interfaces.
- **No unused imports.** Clean up after yourself.
- **`'use client'`** only on components that use hooks or browser APIs. Keep Server Components as Server Components.
- **No new dependencies** unless the spec explicitly authorizes them.
- **Use existing design system:** card styles (`bg-white rounded-xl border border-bmn-border p-6 shadow-sm`), typography (`text-text-primary`, `text-text-secondary`, `font-display`), icons (`lucide-react`).

## 5. SECURITY INCIDENT PROTOCOL (effective 2026-02-07)

**SECURITY INCIDENTS ARE NOT "PROCESS VIOLATIONS"** — They are immediate-fail scenarios requiring investigation.

### What Constitutes a Security Incident:
- Proposing or implementing auth bypasses (`?mock=true`, `?skip-auth`, etc.) in production code
- Hardcoding credentials, API keys, or tokens (SEC-004 violation)
- SQL injection vulnerabilities, XSS, CSRF (SEC-001 violations)
- Exposing sensitive data (matchScore, scoreBreakdown, private contact info) to frontend
- Disabling or bypassing security middleware
- Adding unauthenticated backdoors "for testing"

### When Security Incident is Detected:
1. **IMMEDIATE FAIL** — No "fail forward", no partial credit
2. **Full code audit** — PM reviews ALL code from that development session for other shortcuts
3. **Violation report required** — Coder must document what was attempted, why, and what was learned
4. **Ledger notation** — Security incidents are permanently recorded
5. **User notification** — PM alerts user to the incident and remediation plan

### Ralph Protocol Enforcement:
- **Current reality (until S0.2 completes):** Ralph is honor-system. PM must independently verify Ralph ran by checking gates.txt AND running `npm run ralph:scan` independently.
- **Future state (after S0.2):** Git pre-commit hooks will FORCE Ralph to run before any commit. Unskippable.
- **PM responsibility:** NEVER claim Ralph is "unskippable" until S0.2 Husky hooks are installed. Be honest about enforcement gaps.

## 6. FILE REFERENCES

| Doc | Path | Purpose |
|-----|------|---------|
| Task Specs | `docs/tasks/task-{id}.md` | What to build |
| Project Ledger | `docs/governance/project_ledger.md` | Audit trail |
| Standing Orders | `docs/STANDING_ORDERS.md` | This file — how to work |
| KPI / KRA Framework | `docs/governance/kpi_kra.md` | Performance scoring for Coder + PM |
| DB Schema | `src/lib/db/schema.ts` | Source of truth for data model |
| Migration Dir | `supabase/migrations/` | SQL migrations |
