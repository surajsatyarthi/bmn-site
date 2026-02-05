#!/bin/bash
# 🦅 Ralph Protocol Gate Validator
# Checks for mandatory artifacts before allowing progress.

TASK_FILE="/Users/surajsatyarthi/.gemini/antigravity/brain/6be12e26-fb0b-4cae-b5bd-8deff9fc39ed/task.md"
PLAN_FILE="/Users/surajsatyarthi/.gemini/antigravity/brain/6be12e26-fb0b-4cae-b5bd-8deff9fc39ed/implementation_plan.md"

echo "🦅 Ralph Protocol: Checking Gates..."

# Gate 1: Active Task Check
if [ ! -f "$TASK_FILE" ]; then
    echo "❌ Gate Failed: task.md not found."
    exit 1
fi

# Gate 3: Blueprint Check (Implementation Plan)
if [ ! -f "$PLAN_FILE" ]; then
    echo "❌ Gate Failed: implementation_plan.md not found."
    echo "Rule: You must create a Blueprint before writing code."
    exit 1
fi

echo "✅ All Gates Passed."
exit 0
