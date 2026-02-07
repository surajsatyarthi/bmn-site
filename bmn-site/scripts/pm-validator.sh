#!/bin/bash
# PM PROTOCOL VALIDATOR
# Enforces strategic alignment before code is committed.

cd "$(dirname "$0")/.."

TASK_ID=$1
REPORTS_DIR="docs/reports"
REPORT_PATH="$REPORTS_DIR/pm_assessment_${TASK_ID}.md"

echo "🦅 PM PROTOCOL ENFORCEMENT"

if [ -z "$TASK_ID" ]; then
  echo "⚠️  No TASK_ID provided. Skipping PM check."
  echo "   Usage: ./scripts/pm-validator.sh <TASK_ID>"
  exit 0
fi

echo "Checking Task: $TASK_ID"

# Ensure reports directory exists
mkdir -p "$REPORTS_DIR"

# 1. Existence Check
if [ ! -f "$REPORT_PATH" ]; then
  echo "❌ FAILED: PM Assessment not found at $REPORT_PATH"
  echo "   Fix: cp .ralph/templates/PM_GATE_ASSESSMENT.md $REPORT_PATH"
  exit 1
fi

# 2. Approval Check
if grep -q "✅ APPROVED" "$REPORT_PATH"; then
  echo "✅ PASSED: Strategic Alignment Verified"
  echo "   Proof: $REPORT_PATH"
  exit 0
elif grep -q "⚠️ CONDITIONAL" "$REPORT_PATH"; then
  echo "⚠️ WARNING: Conditional Approval"
  echo "   Proceed with caution. Track success metrics."
  exit 0
else
  echo "❌ FAILED: PM Assessment not approved."
  echo "   Document must contain '✅ APPROVED' status."
  exit 1
fi
