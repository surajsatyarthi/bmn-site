#!/bin/bash

# RALPH PROTOCOL v6.0 - 10-GATE VALIDATOR
# Usage: bash scripts/validate-ralph-gates.sh [BLOCK_ID]
# Example: bash scripts/validate-ralph-gates.sh 4.3

BLOCK_ID=$1

if [ -z "$BLOCK_ID" ]; then
  # Try to detect from branch or env, otherwise default to current working block if known, or fail
  if [ -f ".current-block" ]; then
    BLOCK_ID=$(cat .current-block)
  else
    echo "Usage: $0 <BLOCK_ID>"
    exit 1
  fi
fi

echo "🦅 Ralph Protocol v6.0: Gate Validation [Block $BLOCK_ID]"
echo "========================================================"

EVIDENCE_DIR="docs/evidence/block-$BLOCK_ID"
FAILURES=0

check_gate() {
    GATE_ID=$1
    GATE_NAME=$2
    COMMAND=$3
    
    echo -n "$GATE_ID: $GATE_NAME... "
    
    if eval "$COMMAND"; then
        echo "✅ PASS"
        return 0
    else
        echo "❌ FAIL"
        return 1
    fi
}

# PHASE: ASSESSMENT
# -----------------
# G1: Physical Audit
if [ ! -d "$EVIDENCE_DIR" ]; then
    echo "G1: Physical Audit... ❌ FAIL (Evidence directory $EVIDENCE_DIR not found)"
    FAILURES=$((FAILURES+1))
else
    echo "G1: Physical Audit... ✅ PASS"
fi

# G2: Task Spec Review
# Fix 4: Exact match check
TASK_FILE="docs/tasks/task-$BLOCK_ID.md"
SYSTEM_TASK_FILE="docs/tasks/system/task-$BLOCK_ID.md"

if [ -f "$TASK_FILE" ] || [ -f "$SYSTEM_TASK_FILE" ]; then
    echo "G2: Task Spec Review... ✅ PASS"
else
    echo "G2: Task Spec Review... ❌ FAIL (Task spec not found at docs/tasks/task-$BLOCK_ID.md)"
    FAILURES=$((FAILURES+1))
fi


# PHASE: PLANNING
# ---------------
# G3: Implementation Plan
# Fix 3: Strict failure if missing
if [ -f "$EVIDENCE_DIR/plan.md" ]; then
     echo "G3: Implementation Plan... ✅ PASS"
else
    echo "G3: Implementation Plan... ❌ FAIL (Create $EVIDENCE_DIR/plan.md)"
    FAILURES=$((FAILURES+1))
fi

# PHASE: EXECUTION
# ----------------
check_gate "G4" "Build" "npm run build" || FAILURES=$((FAILURES+1))
check_gate "G5" "Lint" "npm run lint" || FAILURES=$((FAILURES+1))
check_gate "G6" "Security Scan" "npx tsx scripts/ralph-security-scanner.ts" || FAILURES=$((FAILURES+1))
check_gate "G7" "Tests" "npm run test" || FAILURES=$((FAILURES+1))

# PHASE: EVIDENCE
# ---------------
# G8: Pre-submission gate
if [ -f "$EVIDENCE_DIR/pre-submission-gate.txt" ]; then
    echo "G8: Pre-submission Gate... ✅ PASS"
else
    echo "G8: Pre-submission Gate... ❌ FAIL (Missing pre-submission-gate.txt)"
    FAILURES=$((FAILURES+1))
fi

# G9: Self-audit
if [ -f "$EVIDENCE_DIR/self-audit.txt" ]; then
    echo "G9: Self-Audit... ✅ PASS"
else
    echo "G9: Self-Audit... ❌ FAIL (Missing self-audit.txt)"
    FAILURES=$((FAILURES+1))
fi

# G10: Visual Verification
# Fix 5: Whitelist script-only blocks
SCRIPT_ONLY_BLOCKS=("S0.1" "S0.2" "S0.3")
IS_SCRIPT_ONLY=false

for block in "${SCRIPT_ONLY_BLOCKS[@]}"; do
    if [[ "$block" == "$BLOCK_ID" ]]; then
        IS_SCRIPT_ONLY=true
        break
    fi
done

if [ "$IS_SCRIPT_ONLY" = true ]; then
     echo "G10: Visual Verification... ✅ PASS (Skipped for Script-Only Block $BLOCK_ID)"
else
    count=$(find "$EVIDENCE_DIR" -maxdepth 1 -name "*.png" | wc -l)
    if [ "$count" -gt 0 ]; then
        echo "G10: Visual Verification... ✅ PASS"
    else
        echo "G10: Visual Verification... ❌ FAIL (No screenshots found in $EVIDENCE_DIR)"
        FAILURES=$((FAILURES+1))
    fi
fi

echo "========================================================"
if [ "$FAILURES" -eq 0 ]; then
    echo "🎉 ALL GATES PASSED for Block $BLOCK_ID"
    exit 0
else
    echo "⛔️ $FAILURES GATES FAILED. SUBMISSION BLOCKED."
    exit 1
fi
