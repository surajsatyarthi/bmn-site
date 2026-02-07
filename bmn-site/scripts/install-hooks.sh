#!/bin/bash
# Installs the Ralph Protocol Git Hooks

HOOK_SOURCE=".git/hooks/pre-commit"
TARGET=".git/hooks/pre-commit"

if [ -f "$HOOK_SOURCE" ]; then
    chmod +x "$HOOK_SOURCE"
    echo "✅ Ralph Protocol: Pre-commit hook installed and executable."
else
    echo "❌ Error: Wrapper script not found at $HOOK_SOURCE"
    exit 1
fi
