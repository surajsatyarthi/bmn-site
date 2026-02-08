# Risk & Blocker Register

Last Updated: 2026-02-07

## Active Blockers (P0)
**None currently**

## Active Risks (P1)

| ID | Issue | Phase Introduced | Age | Mitigation Plan | ETA | Owner |
|----|-------|------------------|-----|-----------------|-----|-------|
| P1-001 | Rate limiting missing on `/api/matches/[id]/reveal` endpoint | Phase 3 | 3 phases | Fix in Block 4.0 Deliverable 1 using existing rateLimit utility | 1 hour | Antigravity |

## Open Issues (P2)

| ID | Issue | Phase | Mitigation Plan | Priority |
|----|-------|-------|-----------------|----------|
| P2-001 | Lint warning on `src/app/page.tsx` (unused STATS_BAR variable) | Phase 1 | Clean up in next touch of landing page | Low |

## Resolved

| ID | Issue | Resolution | Resolved Date |
|----|-------|------------|---------------|
| P0-001 | Ralph Protocol bypassable (honor-system) | S0.2 added git hooks enforcing Ralph via pre-push | 2026-02-07 |
| P0-002 | PM violating PRIMARY RULE (coding instead of delegating) | Settings.json blocks Write/Edit/Task tools | 2026-02-07 |

## ESCALATION REQUIRED

**None currently**

---

## Risk Tracking Rules

1. **P1 issues cannot carry forward more than 1 phase** without escalation
   - P1-001 violated this rule (carried 3 phases) → PM failure, now being fixed
2. **P0 issues block all work** until resolved
3. **New P1 issues** must have mitigation plan within 24 hours
4. **User-reported gaps** that PM should have caught = PM protocol violation

---

## Next Review: After Block 4.0 audit
