# Implementation Plan - Ralph Protocol v6.0 (Block S0.3)

Goal: Upgrade the quality gates system to the "CEO Magazine" 10-gate model to enforce stricter standards.

## User Review Required
> [!IMPORTANT]
> This update introduces strict blocking gates. `validate-ralph-gates.sh` will `exit 1` if any check fails.

## Proposed Changes

### Scripts
#### [NEW] [validate-ralph-gates.sh](file:///Users/surajsatyarthi/Projects/active/BMN/bmn-site/scripts/validate-ralph-gates.sh)
- Implements the 10-gate check system:
  - G1: Evidence dir exists
  - G2: Task spec exists
  - G3: Implementation Plan exists (User Approved)
  - G4: Build
  - G5: Lint
  - G6: Security Scan
  - G7: Tests
  - G8: Pre-submission gate
  - G9: Self-audit
  - G10: Visual Verification

#### [MODIFY] [ralph-security-scanner.ts](file:///Users/surajsatyarthi/Projects/active/BMN/bmn-site/scripts/ralph-security-scanner.ts)
- Add new QA checks:
  - QA-001: `error.tsx` existence
  - QA-002: `loading.tsx` existence
  - QA-003: `aria-label` on interactive elements
  - QA-004: Metadata exports

#### [MODIFY] [package.json](file:///Users/surajsatyarthi/Projects/active/BMN/bmn-site/package.json)
- Add `"ralph:gates": "bash scripts/validate-ralph-gates.sh"`

### Hooks
#### [MODIFY] [.husky/pre-commit](file:///Users/surajsatyarthi/Projects/active/BMN/.husky/pre-commit)
#### [MODIFY] [.husky/pre-push](file:///Users/surajsatyarthi/Projects/active/BMN/.husky/pre-push)

### Documentation
#### [MODIFY] [STANDING_ORDERS.md](file:///Users/surajsatyarthi/Projects/active/BMN/bmn-site/docs/STANDING_ORDERS.md)
- Update Section 3D with new gate definitions.

## Verification Plan
1. Run `bash scripts/validate-ralph-gates.sh S0.3`.
2. Generate necessary evidence in `docs/evidence/block-S0.3/` to pass the gates.
3. Confirm all gates pass.
