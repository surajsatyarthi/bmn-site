# PM Protocol v1.0 — Evidence-Based Performance Standards

**Effective:** 2026-02-07
**Owner:** AI PM (Claude)
**Enforcement:** User verifies evidence before accepting audit verdicts

---

## Purpose

PM work must be **evidence-based, not honor-based**. Just as Ralph Protocol prevents bad code via hard checks, PM Protocol prevents bad PM work via mandatory evidence.

**Problem:** PM can claim "I'm tracking PRD" or "I'm monitoring risks" without actually doing it.
**Solution:** PM must produce evidence artifacts that prove the work was done.

---

## PM-001: PRD Compliance Check

**Requirement:** Before EVERY audit, PM must verify submitted deliverables match PRD requirements.

**Evidence Required:** Create `prd-compliance-{block-id}.md` with:
```markdown
# PRD Compliance Check — Block {ID}

## PRD Section Referenced
[Section X.Y: {Phase Name}]

## PRD Tasks for This Phase
- [ ] Task X.1: {description} — Status: DELIVERED / MISSING / PARTIAL
- [ ] Task X.2: {description} — Status: DELIVERED / MISSING / PARTIAL
...

## Gaps Identified
1. {Gap description} — Impact: {blocking/non-blocking}
2. ...

## Verdict
✅ All PRD tasks delivered
❌ Missing {N} required tasks
⚠️ Partial delivery ({N} tasks incomplete)

**Audit Decision:** {PASS/FAIL/CONDITIONAL based on gaps}
```

**Checkpoint:** PM cannot mark block as PASSED without this file existing.

---

## PM-002: Deployment Readiness Tracking

**Requirement:** PM must maintain a deployment readiness checklist and update it after every phase completion.

**Evidence Required:** `deployment-readiness.md` (living document) with:
```markdown
# Deployment Readiness Checklist

Last Updated: {date}

## Core Features (PRD Phases 1-4)
- [x] Phase 1: Auth & Onboarding — Status: COMPLETE
- [x] Phase 2: Dashboard & Matches — Status: COMPLETE
- [x] Phase 3: Campaigns — Status: COMPLETE
- [ ] Phase 4: Production Readiness — Status: {TODO/IN PROGRESS/COMPLETE}

## Infrastructure
- [x] Build passing
- [x] Lint clean
- [ ] Ralph 6/6 PASSED (current: 5/6, P1 warning)
- [x] Tests passing
- [x] CI/CD configured
- [ ] Vercel deployment
- [ ] Production smoke test

## Quality
- [ ] E2E testing complete
- [ ] Error handling verified
- [ ] Loading states verified
- [ ] Mobile responsive @375px
- [ ] SEO metadata added
- [ ] 404/error pages branded

## Security
- [ ] No P0 issues
- [ ] No P1 warnings
- [ ] Rate limiting on all POST routes
- [ ] Secrets not in code

## Operations
- [ ] Admin tools (Phase 5/6)
- [ ] Email integration (Phase 7)
- [ ] Deal pipeline (Phase 8)

## DEPLOYMENT BLOCKER SUMMARY
{List of issues preventing production deployment}

**Ready for deployment:** YES / NO
**ETA to ready:** {estimate if not ready}
```

**Checkpoint:** User can ask "is site ready for deployment?" and PM answers from this checklist (not from memory).

---

## PM-003: Risk & Blocker Register

**Requirement:** PM must track P0/P1 issues and blockers across phases.

**Evidence Required:** `risk-register.md` (living document) with:
```markdown
# Risk & Blocker Register

Last Updated: {date}

## Active Blockers (P0)
{None currently}

## Active Risks (P1)
| ID | Issue | Phase Introduced | Age | Mitigation Plan | ETA |
|----|-------|------------------|-----|-----------------|-----|
| P1-001 | Rate limiting missing on reveal endpoint | Phase 3 | 3 phases | Fix in Block 4.0 Deliverable 1 | 1 hour |

## Resolved
| ID | Issue | Resolution | Resolved Date |
|----|-------|------------|---------------|
| ... | ... | ... | ... |

## ESCALATION REQUIRED
{Issues that need user decision}
```

**Checkpoint:** PM cannot let P1 issues carry forward more than 1 phase without escalation plan.

---

## PM-004: Weekly Gap Analysis

**Requirement:** At end of each week (or every 3 blocks), PM must produce gap analysis report.

**Evidence Required:** `gap-analysis-{YYYY-MM-DD}.md` with:
```markdown
# Gap Analysis — {Date}

## PRD vs Delivered
| PRD Phase | Tasks | Delivered | Missing | % Complete |
|-----------|-------|-----------|---------|------------|
| Phase 1 | 14 | 14 | 0 | 100% |
| Phase 2 | 11 | 11 | 0 | 100% |
| Phase 3 | 10 | 10 | 0 | 100% |
| Phase 4 | 10 | 0 | 10 | 0% ⚠️ |
| Phase 5 | 7 | 0 | 7 | 0% (PAUSED) |

## Critical Findings
1. **Phase 4 (Production Readiness) was skipped** — Blocks deployment
2. **P1 warning carried forward 3 phases** — Security risk
3. ...

## Recommended Actions
1. Execute Phase 4 immediately (Block 4.0 created)
2. Fix P1 rate limiting issue
3. ...

## Next Review Date
{Date}
```

**Checkpoint:** User can request gap analysis at any time and receive current state (not "let me check").

---

## PM-005: Audit Justification

**Requirement:** Every PASS/FAIL verdict must include written justification with evidence references.

**Evidence Required:** Audit verdict in ledger must include:
```markdown
| Date | Action | PM | Status | Details |
|------|--------|----|----|---------|
| 2026-02-07 | AUDIT | AI PM | 🟢 PASSED | All 4 gates pass (gates.txt lines 50-122). PRD Phase 2 tasks 2.1-2.11 verified complete (prd-compliance-2.0.md). No P0 issues. P1 warning noted in risk-register.md. |
```

**Checkpoint:** Audit verdict without evidence references = invalid.

---

## PM-006: Pre-Audit Checklist

**Requirement:** Before starting ANY audit, PM must complete pre-audit checklist.

**Evidence Required:** First message in audit must include:
```markdown
**Pre-Audit Checklist for Block {ID}:**
- [x] Read PRD section for this phase
- [x] Compared PRD tasks to submission
- [x] Checked risk-register.md for orphaned P1 issues
- [x] Verified phase sequencing (no skipped phases)
- [x] Updated deployment-readiness.md
```

**Checkpoint:** Audit without checklist = PM violated protocol.

---

## Enforcement

**User Responsibilities:**
1. Before accepting any audit verdict, verify PM-005 (justification includes evidence)
2. Randomly spot-check PM-001 through PM-004 files exist and are up-to-date
3. If PM fails protocol → reject audit, demand compliance

**PM Responsibilities:**
1. Maintain all evidence files (not optional)
2. Update living documents after every phase
3. Include evidence references in all audit verdicts
4. Run PM-006 checklist before every audit

**Escalation:**
If PM repeatedly violates protocol → same consequence as coder violating Ralph Protocol (FAIL + investigation).

---

## Success Metrics

PM Protocol is working if:
1. User never has to ask "what's missing?" (deployment-readiness.md answers it)
2. User never has to ask "when will X be fixed?" (risk-register.md tracks it)
3. PRD phases are never skipped (prd-compliance checks enforce it)
4. P1 issues are fixed within 1 phase (risk-register escalation enforces it)

PM Protocol is failing if:
1. User discovers gaps that PM should have flagged
2. Phases are skipped without PM noticing
3. PM says "let me check" instead of referencing evidence file
4. Evidence files are missing or outdated

---

## Version History

**v1.0 (2026-02-07):** Initial protocol created after PM failed to track PRD Phase 4, let P1 warning carry forward 3 phases, and operated in reactive-only mode.
