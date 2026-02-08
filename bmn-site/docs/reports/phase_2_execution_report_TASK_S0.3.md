# RFC: Ralph Enforcement System (Block S0.3)

## 1. Problem Statement
The current BMN v2 project relies on manual PM audits to enforce the "Ralph Protocol" (DoD v2.0 standards).
This manual process is:
- **Error-prone**: Humans miss details (e.g., "pending" comments, specific file counts).
- **Slow**: PM tokens are wasted on incomplete submissions.
- **Inconsistent**: Standards vary by reviewer fatigue.

Current state: 0% automated enforcement.

## 2. Proposed Solution
Implement a **local Automated Enforcement System** consisting of two scripts:

### A. Evidence Validator (`validate-evidence.ts`)
- **Function**: Statically analyzes the `docs/evidence` directory.
- **Checks**:
  - Existence of required files (gates.txt, pre-submission-gate.txt, self-audit.txt).
  - Content validation (e.g., gates.txt must have "PASSED", checklists must be checked).
  - "No Excuses" policy (forbids "TODO", "pending", "fixme").
- **Blocker**: Fails with exit code 1 if *any* check fails.

### B. Evidence Collector (`collect-evidence.ts`)
- **Function**: Automates the "toil" of evidence collection.
- **Action**: Runs all 4 gates (`build`, `lint`, `scan`, `test`), captures output, and generates template files.

### C. Integration
- **NPM Scripts**: `evidence:collect`, `evidence:validate`, `submit`.
- **Git Hooks**: (Future) Pre-push hook to block non-compliant code.

## 3. Security Implications
- **Runtime**: NONE. These are DevEx scripts that run only on the developer's machine.
- **Data**: No data transmission. Validates local files only.
- **Auth**: No authentication required/bypassed.

## 4. Alternatives Considered
| Alternative | Pros | Cons |
| :--- | :--- | :--- |
| **Manual Audit (Current)** | Zero dev time | High PM load, inconsistent, slow |
| **CI/CD Only** | Enforced on server | Slow feedback loop (wait for push), costs build minutes |
| **Local + CI (Selected)** | Fast feedback (local), redundant safety (CI) | Requires script maintenance |

## 5. Trade-off Analysis
We selected **Local Automation** because it shifts the "fail" signal left (to the developer's terminal), saving PM time and CI costs. The maintenance cost of ~200 lines of TypeScript is negligible compared to the value of "perfect" submissions.

## 6. User Approval
> [!IMPORTANT]
> **Emergency Directive**: This system was explicitly requested as "Priority P0 CRITICAL" by the PM/User.
> **Status**: APPROVED for immediate implementation.
