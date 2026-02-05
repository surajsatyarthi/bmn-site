#!/bin/bash

# Ralph Validator - Pre-commit Hook
# Runs FAST security checks only (code + deps). Build/deploy checks run in CI.

cd "$(dirname "$0")/.."

echo "🔍 Running Ralph Validator..."
echo "🛡️  Running Rapid Security Scan (pre-commit)..."

npx tsx scripts/ralph-security-scanner.ts --pre-commit
SCAN_EXIT_CODE=$?

if [ $SCAN_EXIT_CODE -ne 0 ]; then
    echo "❌ Security Scan FAILED. Commit blocked."
    exit 1
fi

exit 0
