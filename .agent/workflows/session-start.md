---
description: "Session startup checks: verify no direct-to-main commits, check for orphan branches, read current task context."
---

# /session-start — Session Start Workflow

Run this workflow at the beginning of every new conversation or coding session.

## Steps

1. Check for direct-to-main commits (C4 violation check).
// turbo
```bash
git log origin/main --oneline -5
```
   - Review the last 5 commits on main.
   - If ANY commit was made directly (not via a PR merge), flag it:
     - `[WARNING] Direct-to-main commit detected: <hash> <message>`
     - Post in the ledger under the current date.

2. Check for orphan branches.
// turbo
```bash
git branch -r --no-merged origin/main
```
   - List remote branches that have not been merged to main.
   - If orphan branches exist, report them:
     - `[INFO] Orphan branches found: <list>`
     - These may represent incomplete tasks.

3. Verify current branch.
// turbo
```bash
git branch --show-current
```
   - If on `main` → switch to the correct feature branch before doing any work.
   - If on a feature branch → confirm it is the correct one for the current task.

4. Read the current task assignment.
   - Open `PROJECT_LEDGER.md` and find the latest PM assignment.
   - Identify: task ID, G3 blueprint scope, authorized files, priority.

5. Read `CLAUDE.md` to refresh hard rules and key commands.

6. Confirm session readiness:
   - "Session started. Working on ENTRY-XXX on branch feat/entry-xxx."
   - "Scope: <list of authorized files from G3>."
   - "No direct-to-main violations detected." (or flag if found)

## Rules

- This workflow runs BEFORE any code changes.
- If you discover a direct-to-main commit, report it but do not attempt to revert it. Wait for PM guidance.
- If you are on the wrong branch, switch before doing anything else.
