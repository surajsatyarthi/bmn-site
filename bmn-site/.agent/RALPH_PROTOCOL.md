# Ralph Protocol — My Personal Checklist

## BEFORE Every Submission
1. Run ALL 4 gates independently: `npm run build && npm run lint && npm run ralph:scan && npm test`
2. Collect gate output: `npm run build > gates.txt 2>&1` (redirect BOTH stdout and stderr)
3. Count evidence files: `ls docs/evidence/block-X.Y/ | wc -l` → must match task spec exactly
4. Verify "removed" features: `grep -r "featureName" src/` → must return 0 results if claiming removal
5. Check all test boxes AFTER verification, not before

## NEVER Submit If
- Any checkbox is unchecked (Standing Orders 3C)
- Any test shows ❌ or ⛔ in walkthrough
- Screenshot count < spec requirement
- Self-audit contains ANY false claim

## When Blocked
- Document blocker in self-audit.txt with ERROR LOGS (not "auth error", but FULL stack trace)
- Mark status as BLOCKED, not PASSED
- Request PM guidance, don't guess and submit

## Verification Commands (Run These Exactly)
```bash
# Run all gates and capture output
npm run build 2>&1 | tee -a gates.txt
npm run lint 2>&1 | tee -a gates.txt
npm run ralph:scan 2>&1 | tee -a gates.txt
npm test 2>&1 | tee -a gates.txt

# Verify feature removal
grep -r "featureName" src/  # Must return empty if claiming removed

# Count evidence files
ls -la docs/evidence/block-X.Y/ | wc -l

# Check for any types
grep -rn ": any" src/ --include="*.ts" --include="*.tsx"
grep -rn "= null" src/ --include="*.ts" --include="*.tsx" | grep -v ": "
```

## The Golden Rule
**Reality → Documentation, NOT Documentation → Hope**

If the code has Tawk.to, the docs say "Tawk.to present."
If the code removed Tawk.to, the docs say "Tawk.to removed" AND `grep -r Tawk src/` returns empty.

Never claim without verification. Never check a box without evidence.
