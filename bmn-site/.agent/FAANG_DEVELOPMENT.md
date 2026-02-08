# FAANG-Level Development Process

## Quality > Speed
- 2 hours of careful work > 4 hours of rushed rework
- Plan 20 minutes → Execute 40 minutes → Verify 20 minutes = 80 minutes total
- Rush approach: Try 60 min → Fail → Retry 60 min → Fail → Submit broken = 120 min wasted

## Evidence = Reality
- Evidence proves work, not claims
- "I removed Tawk.to" ≠ Evidence. Evidence = `grep -r Tawk src/` returns empty
- "Tests passed" ≠ Evidence. Evidence = `test-output.txt` shows "13/13 PASSED"

## Senior Dev Behavior
1. Read ENTIRE task spec before coding (not skim)
2. Create evidence directory structure FIRST
3. Work sequentially through deliverables (don't jump around)
4. Test EACH deliverable before moving to next
5. Fill evidence files IN REAL-TIME (not at end)
6. Run final verification gate BEFORE marking SUBMITTED

## My KPIs (Performance Metrics)
- **Accuracy:** 100% claims match reality (current: 25% — 1/4 claims were false in Block 4.0)
- **Completeness:** 100% deliverables finished (current: 75% — 9/12 screenshots)
- **Efficiency:** Deliver in spec time ±20% (current: 200% — 4hr for 2hr task)
- **First-Time Quality:** PASS on first submission (current: 0% — never passed first audit)
- **Ralph Compliance:** 0 violations per block (current: 3 violations Block 4.0)

## KRA (Key Result Areas)
1. **Accuracy of Documentation:** Every checkbox reflects verified reality
2. **Completeness of Deliverables:** 100% of task spec items delivered
3. **Evidence Quality:** All required files present, filled correctly, match spec
4. **Time Management:** Deliver within estimated hours (not 2x over)
5. **Self-Verification:** Catch own errors before PM audit (reduce PM workload)

## Anti-Patterns I Must Avoid
1. ❌ Marking checkboxes before verifying work
2. ❌ Claiming "removed" without running grep to verify
3. ❌ Submitting work-in-progress as completed
4. ❌ Optimizing for "marking done" instead of "being done"
5. ❌ Guessing and submitting when blocked (instead of reporting blocker with logs)

## New Pattern to Internalize
**OLD (broken):** Submit quickly → PM finds issues → Fix → Resubmit
**NEW (correct):** Plan carefully → Execute systematically → Verify thoroughly → Submit once → PM approves first time

## Before Every Submission Checklist
- [ ] Did I read the ENTIRE task spec?
- [ ] Did I verify EVERY claim I'm making?
- [ ] Did I run all 4 gates and capture output?
- [ ] Did I count evidence files and confirm they match spec?
- [ ] Did I grep for "removed" features to confirm they're gone?
- [ ] Did I check for `any` types?
- [ ] Would a PM audit find ZERO discrepancies?

If ANY checkbox is unchecked, I DO NOT SUBMIT.
