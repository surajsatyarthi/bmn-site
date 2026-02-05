#!/bin/bash
# PM PROTOCOL VALIDATOR
# Enforces strategic alignment before code is committed.

TASK_ID=$1
REPORT_PATH="docs/reports/pm_assessment_${TASK_ID}.md"

echo "🦅 PM PROTOCOL ENFORCEMENT"
echo "Checking Task: $TASK_ID"

# 1. Existence Check (Proof)
if [ ! -f "$REPORT_PATH" ]; then
  echo "❌ FAILED: PM Assessment Check"
  echo "   Reason: No PM Assessment found at $REPORT_PATH"
  echo "   Action: Run 'cp .ralph/templates/PM_GATE_ASSESSMENT.md $REPORT_PATH' and fill it out."
  exit 1
fi

# 2. Approval Check (Validation)
if grep -q "✅ APPROVED" "$REPORT_PATH"; then
  echo "✅ PASSED: Strategic Alignment Verified"
  echo "   Proof: $REPORT_PATH"
  exit 0
elif grep -q "⚠️ CONDITIONAL" "$REPORT_PATH"; then
  echo "⚠️ WARNING: Conditional Approval"
  echo "   Proceed with caution. Ensure success metrics are tracked."
  exit 0
else
  echo "❌ FAILED: PM Assessment Not Approved"
  echo "   Reason: Document does not contain '✅ APPROVED' status."
  echo "   Action: Obtain PM approval before proceeding."
  exit 1
fi
