## 3D. Ralph Protocol Enforcement (Automated ~ 10 Gates)

**"The CEO Magazine Standard"** - adapted for BMN.

**GATES (All Must Pass):**
1. **G1: Physical Audit** (`docs/evidence/block-{id}/` exists)
2. **G2: Task Spec Review** (Task spec file exists)
3. **G3: Implementation Plan** (Execution report with USER APPROVED)
4. **G4: Build** (`npm run build`)
5. **G5: Lint** (`npm run lint` - 0 errors)
6. **G6: Security Scan** (`ralph-security-scanner.ts`)
7. **G7: Tests** (`npm run test`)
8. **G8: Pre-submission Gate** (`pre-submission-gate.txt` exists)
9. **G9: Self-Audit** (`self-audit.txt` exists)
10. **G10: Visual Verification** (Screenshots in evidence dir)

**EXECUTION:**
```bash
# 1. Collect Evidence & Run Gates
export RALPH_BLOCK_ID=4.3  # Example
npm run ralph:gates $RALPH_BLOCK_ID
```

**EVIDENCE STORAGE:**
Save all gate outputs and required files to `docs/evidence/block-$RALPH_BLOCK_ID/`.
- `gates.txt` (Output of validation script)
- `pre-submission-gate.txt` (Signed off)
- `self-audit.txt` (Completed)
- `test-output.txt` (Vitest output)

> **ZERO TOLERANCE:** Any skipped gate or exception report = IMMEDIATE REJECTION.

