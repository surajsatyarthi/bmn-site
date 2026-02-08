## 3D. Ralph Protocol Enforcement (Automated)

**BEFORE EVERY SUBMISSION:**

1. **Collect Evidence:**
   ```bash
   cd bmn-site
   npm run evidence:collect block-X.Y
   ```

2. **Fill Out Templates:**
   - `docs/evidence/block-X.Y/pre-submission-gate.txt` - Mark ALL checkboxes
   - `docs/evidence/block-X.Y/self-audit.txt` - Complete ALL sections

3. **Validate Evidence:**
   ```bash
   npm run evidence:validate block-X.Y
   ```

4. **If Validation FAILS:**
   - Fix errors listed
   - Re-run validation
   - DO NOT SUBMIT until validation passes

5. **If Validation PASSES:**
   - Update project_ledger.md status to SUBMITTED
   - Notify PM for audit

> **NO EXCEPTIONS.** Validation MUST pass before PM audit.
