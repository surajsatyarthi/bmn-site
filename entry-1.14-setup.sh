#!/bin/bash
set -e

echo "========================================"
echo " ENTRY-1.14 — Node.js Setup Script"
echo "========================================"

# 1. Install Homebrew
if ! command -v brew &>/dev/null; then
  echo "▶ Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Activate brew for Apple Silicon
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -f /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  echo "✅ Homebrew already installed"
fi

# 2. Install Node.js
echo "▶ Installing Node.js..."
brew install node
node --version
npm --version

# 3. Install pnpm
echo "▶ Installing pnpm..."
npm install -g pnpm

# 4. Install project dependencies
echo "▶ Installing bmn-site dependencies..."
cd /Users/satyarthi/Desktop/BMN/bmn-site
pnpm install

# 5. Run Ralph hook setup
echo "▶ Setting up Ralph enforcement hooks..."
SETUP_SCRIPT="/Users/satyarthi/Desktop/BMN/.agent/scripts/setup-enforcement.sh"
if [ -f "$SETUP_SCRIPT" ]; then
  bash "$SETUP_SCRIPT"
else
  echo "⚠️  setup-enforcement.sh not found — skipping. Husky hooks may already be configured."
fi

echo ""
echo "========================================"
echo " ✅ Setup complete! Node: $(node --version)"
echo " Now soft-resetting violating commits..."
echo "========================================"

# 6. Soft-reset the two --no-verify commits
cd /Users/satyarthi/Desktop/BMN/bmn-site
git reset --soft HEAD~2

echo "▶ Reset done. Re-committing with hooks..."

# 7. Re-commit commit 1 (architecture fix)
git commit -m "feat(profile/edit): fix metadata architecture and Ralph gate artifacts [ENTRY-1.14]"

# 8. Re-commit commit 2 (tests + gate artifacts)
git commit -m "test(profile/update): add unit tests + G8/G12 artifacts [ENTRY-1.14]"

echo ""
echo "========================================"
echo " ✅ DONE. New commits:"
git log --oneline -3
echo "========================================"
