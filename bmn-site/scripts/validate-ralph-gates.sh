#!/bin/bash
# 🦅 Ralph Protocol Gate Validator
# Checks for mandatory artifacts before allowing progress.

cd "$(dirname "$0")/.."

RALPH_DIR=".ralph"
AUDIT_TRAIL="$RALPH_DIR/audit_trail.json"

echo "🦅 Ralph Protocol: Checking Gates..."

# Gate 1: Ralph directory exists
if [ ! -d "$RALPH_DIR" ]; then
    echo "❌ Gate Failed: .ralph/ directory not found."
    echo "   Fix: mkdir -p .ralph/templates"
    exit 1
fi
echo "✅ Gate 1: Ralph directory exists"

# Gate 2: Audit trail exists
if [ ! -f "$AUDIT_TRAIL" ]; then
    echo "⚠️  Gate 2: No audit trail yet (first run)."
else
    echo "✅ Gate 2: Audit trail exists"
fi

# Gate 3: Templates exist
TEMPLATE_COUNT=$(find "$RALPH_DIR/templates" -name "GATE_*.md" 2>/dev/null | wc -l | tr -d ' ')
if [ "$TEMPLATE_COUNT" -eq 0 ]; then
    echo "❌ Gate Failed: No gate templates found in .ralph/templates/"
    exit 1
fi
echo "✅ Gate 3: $TEMPLATE_COUNT gate templates found"

echo ""
echo "✅ All prerequisite gates passed."
exit 0
