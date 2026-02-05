#!/bin/bash

# Ralph Validator
# Bridges Git Hooks -> Ralph CLI

# Ensure we're at project root
cd "$(dirname "$0")/.."

# Check if we are in an active task context
# For v5.0, we just run a quick verification check
# If no task is active, we might warn or pass depending on strictness.
# For now, we enforce that IF a task is active, its current gate must be verified.

echo "🔍 Running Ralph Validator..."

# Check for P0 Security Issues (Fast Scan)
echo "🛡️  Running Rapid Security Scan..."
npx tsx scripts/ralph-security-scanner.ts
SCAN_EXIT_CODE=$?

if [ $SCAN_EXIT_CODE -ne 0 ]; then
    echo "❌ Security Scan FAILED. Blocking commit."
    exit 1
fi

# TODO: Add full gate verification if needed
# npx tsx scripts/ralph-cli.ts verify

exit 0
