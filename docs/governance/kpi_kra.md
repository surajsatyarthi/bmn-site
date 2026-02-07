# KPI / KRA Framework — BMN v2 AI Development Team

**Effective:** 2026-02-06
**Approved by:** Founder
**Applies to:** AI Coder (Antigravity), AI PM (Claude)

---

## 1. PRINCIPLES

1. **Evidence over claims.** Every assertion ("it works", "tests pass", "spec complete") must be backed by an artifact. No artifact = did not happen.
2. **Self-audit before handoff.** The Coder runs the PM's exact checklist before submission. Defects caught by the PM that the Coder should have caught are scored as rework.
3. **Quality is non-negotiable.** A clean pass on the first submission is the standard. Remediation rounds are tracked and penalized in the scorecard.
4. **Code quality > speed.** Shipping fast with defects is worse than shipping clean. Dead code, unused imports, missing sections, and `any` types are all defects.

---

## 2. AI CODER — KPIs

### 2A. Gate Compliance (Hard Gate — binary pass/fail)

| KPI | Target | Measurement |
|-----|--------|-------------|
| Build passes | 0 errors | `npm run build` output |
| Lint clean on new/modified files | 0 errors, 0 warnings | `npm run lint` filtered to block files |
| Ralph security scan | Pass (no P0) | `npm run ralph:scan` output |

**Rule:** If any gate fails, do NOT submit. Fix first.

### 2B. Spec Compliance (scored per deliverable)

| KPI | Target | Measurement |
|-----|--------|-------------|
| Deliverables complete | 100% of spec items delivered | PM checklist against `task-{id}.md` |
| Field-level accuracy | Every column, route, component matches spec | PM code review |
| No scope creep | 0 features added beyond spec | PM diff review |
| No missing sections | Every UI section in spec is rendered | Screenshots prove it |

### 2C. Code Quality (scored per block)

| KPI | Target | Measurement |
|-----|--------|-------------|
| Zero `any` types | 0 instances in new code | Lint + PM grep |
| Zero unused imports | 0 in new/modified files | Lint output |
| Zero dead comments | No `// TODO`, `// ...`, `// rest of function` in submitted code | PM code review |
| Correct `'use client'` usage | Only on components with hooks/browser APIs | PM code review |
| No hardcoded secrets | 0 secrets in source | Ralph scan |
| Proper error typing | `error: unknown` not `error: any` | PM code review |
| No duplicate utility functions | Shared helpers extracted, not copy-pasted across files | PM code review |

### 2D. Evidence Submission (Hard Gate — binary pass/fail)

| KPI | Target | Measurement |
|-----|--------|-------------|
| `docs/evidence/block-{id}/gates.txt` | Present + matches spec | File exists, content matches independent run |
| `docs/evidence/block-{id}/screenshot-*.png` | One per new/modified page | Files exist, show correct UI |
| `docs/evidence/block-{id}/api-tests.txt` | Curl output for every new/modified API | File exists, responses match spec |
| `docs/evidence/block-{id}/seed-output.txt` | If new seed script, output captured | File exists if applicable |
| `docs/evidence/block-{id}/migration.txt` | If new migration, application verified | File exists if applicable |

**Rule:** Missing evidence directory = automatic FAIL. No exceptions.

### 2E. Self-Audit Checklist (MANDATORY before submission)

The Coder MUST run this checklist before every submission. Save output to `docs/evidence/block-{id}/self-audit.txt`.

```
SELF-AUDIT CHECKLIST — Block {id}
==================================

[ ] 1. Read the full spec at docs/tasks/task-{id}.md
[ ] 2. Verified EVERY deliverable item is implemented (list each with Y/N)
[ ] 3. npm run build — 0 errors
[ ] 4. npm run lint — 0 errors, 0 warnings on new/modified files
[ ] 5. npm run ralph:scan — passed
[ ] 6. Grepped new files for `any` types — 0 found
[ ] 7. Grepped new files for unused imports — 0 found
[ ] 8. No dead/placeholder comments in submitted code
[ ] 9. All UI sections in spec are rendered (cross-checked against spec)
[ ] 10. All API routes return correct status codes (401, 403, 404, 400, 200)
[ ] 11. Security: auth checks on every protected route
[ ] 12. Evidence artifacts saved to docs/evidence/block-{id}/
[ ] 13. Ledger updated as SUBMITTED (not PASSED)

Coder sign-off: _______________
Date: _______________
```

### 2F. Rework Score

| Metric | Scoring |
|--------|---------|
| First-pass clean (PM passes on first audit) | 10/10 |
| 1 remediation round (minor fixes only) | 7/10 |
| 1 remediation round (blocking defects) | 5/10 |
| 2+ remediation rounds | 3/10 |
| Evidence missing on first submit | -3 penalty |

**Historical scores:**
| Block | Score | Notes |
|-------|-------|-------|
| 1.8 | 5/10 | 8 defects, 1 remediation |
| 2.1 | 10/10 | First-pass clean |
| 2.2 | 10/10 | First-pass clean |
| 2.3 | 10/10 | First-pass clean |
| 3.1 | 10/10 | First-pass clean |
| 3.2 | 10/10 | First-pass clean |
| 4.1 | 5/10 | 3 blocking defects, 1 remediation |
| 4.2 | 10/10 | First-pass clean |
| 5.1 | 2/10 | 2 blocking defects + evidence missing (-3) |

**Running average: 8.0/10** (target: 9.0+)

---

## 3. AI PM — KPIs

### 3A. Audit Thoroughness

| KPI | Target | Measurement |
|-----|--------|-------------|
| Independent gate verification | Run build/lint/ralph on every audit | Gate output in audit notes |
| Deliverable-by-deliverable checklist | Every spec item scored PASS/FAIL | Audit notes in ledger |
| Security audit on every block | Auth, data leakage, input validation checked | Security section in audit notes |
| Line-level code review | Read every new/modified file | File references in audit notes |

### 3B. Defect Detection

| KPI | Target | Measurement |
|-----|--------|-------------|
| Blocking defects caught | 100% — zero blocking defects escape to production | Post-launch defect count |
| False positives | < 10% — defects flagged must be real | Coder can dispute with evidence |
| Defect specificity | Every defect has file, line number, and fix instruction | Defect table in audit notes |

### 3C. Spec Quality

| KPI | Target | Measurement |
|-----|--------|-------------|
| Spec completeness | Coder can build without asking questions | Zero ambiguity-related defects |
| Spec accuracy | Schema, routes, components match codebase reality | Zero "spec is wrong" disputes |
| Evidence requirements listed | Every spec names required evidence artifacts | Evidence table in spec |

### 3D. Operational Efficiency

| KPI | Target | Measurement |
|-----|--------|-------------|
| Audit turnaround | Same session as submission | Timestamp delta |
| Remediation prompt | Single 1-line prompt with all fixes | Prompt word count |
| Token efficiency | Audit uses < 15% of session budget | Usage tracking |
| Ledger accuracy | Every event logged with correct status and date | Ledger review |

### 3E. PM Audit Checklist (MANDATORY for every audit)

```
PM AUDIT CHECKLIST — Block {id}
================================

EVIDENCE CHECK (do first — if missing, stop and FAIL):
[ ] 1. docs/evidence/block-{id}/ directory exists
[ ] 2. gates.txt present and content is plausible
[ ] 3. Screenshots present for every new/modified page
[ ] 4. API curl tests present for every new/modified API
[ ] 5. self-audit.txt present and all items checked

INDEPENDENT GATES (run yourself):
[ ] 6. npm run build — record output
[ ] 7. npm run lint — check new/modified files only
[ ] 8. npm run ralph:scan — record output

SPEC COMPLIANCE (check every deliverable):
[ ] 9. For each deliverable in spec, verify: present, complete, correct
[ ] 10. For each UI section in spec, verify: rendered, matches description

CODE QUALITY:
[ ] 11. No `any` types in new code
[ ] 12. No unused imports in new/modified files
[ ] 13. No dead comments or placeholder code
[ ] 14. Correct use of 'use client' vs Server Components
[ ] 15. No new dependencies unless spec authorizes

SECURITY:
[ ] 16. Auth check on every protected route/API
[ ] 17. Sensitive data (matchScore, scoreBreakdown) not leaking to client
[ ] 18. No hardcoded secrets or credentials
[ ] 19. Input validation on public-facing endpoints

VERDICT:
[ ] 20. PASS — all above checked, zero blocking defects
[ ] or FAIL — list all defects with file:line and fix instructions
```

---

## 4. ESCALATION PROTOCOL

| Situation | Action |
|-----------|--------|
| Coder submits without evidence | Auto-FAIL. PM does NOT proceed with code review. Returns with evidence requirement only. |
| Coder submits with evidence but blocking defects | FAIL. PM lists all defects in one pass. Coder fixes all + re-submits evidence. |
| Coder submits with minor-only defects | FAIL. PM lists all minors. Coder fixes in one pass. |
| 2+ consecutive FAILs on same block | Founder review. PM rewrites spec section if ambiguous. |
| Coder disputes a defect | Must provide evidence (code reference + spec reference). PM rules. |

---

## 5. QUALITY GATES SUMMARY

```
CODER WORKFLOW:
  Read spec → Build → Self-audit checklist → Collect evidence → Submit as SUBMITTED

PM WORKFLOW:
  Check evidence (FAIL if missing) → Run gates → Review code → Security audit → Verdict
```

Both roles use the same quality bar. The Coder's self-audit IS the PM's audit checklist. If the Coder runs it honestly, first-pass clean delivery is the expected outcome.

---

## 6. DEFINITIONS

| Term | Definition |
|------|-----------|
| **Blocking defect** | Spec violation that affects functionality, data integrity, or security. Must be fixed. |
| **Minor defect** | Lint warning, dead comment, cosmetic deviation. Must be fixed but does not affect function. |
| **First-pass clean** | PM passes on first audit with zero defects. Gold standard. |
| **Rework** | Any remediation round after initial FAIL. Tracked and scored. |
| **Evidence** | Artifacts proving functional correctness: gate output, screenshots, API responses, script output. |
| **Self-audit** | Coder running PM's checklist before submission. Mandatory. |
