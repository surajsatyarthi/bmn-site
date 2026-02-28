---
description: "End-of-task checklist: ensure G12 doc, PR link, CI link, and final ledger status are posted."
---

# /wrap-up ENTRY-XXX — Task Wrap-Up Workflow

Run this workflow when you believe a task is complete. It ensures nothing is missed before declaring "done."

## Steps

1. Verify the G12 walkthrough document exists.
   - Check for `docs/walkthroughs/walkthrough-ENTRY-XXX.md` or equivalent.
   - If missing → create it now. It must contain:
     - What was changed (files modified, components added/removed)
     - What was tested (commands run, exit codes)
     - Validation results (screenshots if UI, CI link if available)

2. Verify the PR is open.
   - Check: is there an open PR from `feat/entry-xxx` → `main`?
   - If no PR exists → **STOP**. Open the PR first.

3. Verify CI status.
   - Check: does the PR have a CI run?
   - If CI is failing → **STOP**. Fix the failures before wrapping up.
   - If CI is passing → record the CI link.

4. Post the final status in `PROJECT_LEDGER.md`:

```
### ENTRY-XXX — Final Status [YYYY-MM-DD]
- **PR:** <link to PR>
- **CI:** <link to CI run> | <pass/fail>
- **G12 Doc:** <path to walkthrough>
- **Status:** Awaiting PM G14 review
```

5. Verify the Iron Rule:
   - Is the PR link in the ledger? ✅
   - Is the CI link in the ledger? ✅
   - Is the walkthrough document created? ✅
   - Has the PR been merged? ❌ (PM merges, not Coder)

6. Confirm to PM: "ENTRY-XXX is ready for G14 review."

## Rules

- Do NOT say "done" until steps 1-5 are all checked.
- The Coder does NOT merge. The PM merges after G14 review.
