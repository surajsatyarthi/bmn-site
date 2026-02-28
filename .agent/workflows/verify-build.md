---
description: "Run build, lint, and tests. Capture exact exit codes. Format output as ledger-ready evidence."
---

# /verify-build — Build Verification Workflow

Run this workflow before opening any PR. It captures real CLI output as verifiable evidence for the PM.

## Steps

1. Navigate to the project directory.
// turbo
```bash
cd bmn-site
```

2. Run the build.
// turbo
```bash
npm run build 2>&1; echo "EXIT_CODE=$?"
```

3. Record the build result.
   - If `EXIT_CODE=0` → build passed.
   - If `EXIT_CODE≠0` → **STOP**. Post the exact error output in the ledger. Do not proceed.

4. Run the linter.
// turbo
```bash
npm run lint 2>&1; echo "EXIT_CODE=$?"
```

5. Record the lint result.
   - If `EXIT_CODE=0` → lint passed.
   - If `EXIT_CODE≠0` → **STOP**. Post the exact warning/error output in the ledger. Do not proceed.

6. Run tests (if they exist).
// turbo
```bash
npm run test 2>&1; echo "EXIT_CODE=$?" || echo "No test script found"
```

7. Format the evidence block for the ledger:

```
### Verify-Build Evidence [YYYY-MM-DD]
- **Build:** EXIT_CODE=<code> | <pass/fail>
- **Lint:** EXIT_CODE=<code> | <pass/fail>
- **Test:** EXIT_CODE=<code> | <pass/fail> | <N tests passed, M failed>
```

8. Post the evidence block in `PROJECT_LEDGER.md` under the current task entry.

## Rules

- **NEVER** type "build passed" or "all tests passed" without running the actual commands first.
- **NEVER** summarize output — paste the exact exit codes.
- If any step fails, STOP and post the error. Do not attempt to fix and re-run silently.
