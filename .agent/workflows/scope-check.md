---
description: "Compare modified files against the PM's approved scope manifest before every commit."
---

# /scope-check — Scope Verification Workflow

Run this workflow before every `git add` or `git commit` to verify you are not modifying files outside the PM's approved scope.

## Steps

1. Identify the current task ID (e.g., `ENTRY-XXX`).

2. Read the G3 blueprint for this task in `PROJECT_LEDGER.md`.
   - Find the section: `### ENTRY-XXX` → look for the list of authorized files.
   - If no G3 blueprint exists, **STOP** — you cannot commit without a scope manifest.

3. List all files you have modified.
// turbo
```bash
git diff --name-only HEAD
```

4. Compare the modified file list against the authorized scope.
   - For each modified file, check: is it listed in the G3 blueprint?
   - If YES for all files → proceed to commit.
   - If ANY file is NOT in the G3 blueprint → **STOP immediately**.

5. If out-of-scope files detected:
   - List the unauthorized files.
   - Post an error in the ledger: `[SCOPE VIOLATION] Files modified outside G3 blueprint: <list>`
   - Do NOT commit. Wait for PM guidance.

6. If all files are in scope:
   - Confirm: "All modified files are within the approved G3 scope."
   - Proceed to commit.

## Important

- This workflow applies to EVERY commit, not just the final one.
- If you realize you need to modify an out-of-scope file, post a request in the ledger and wait for PM approval. Do not "just fix it."
