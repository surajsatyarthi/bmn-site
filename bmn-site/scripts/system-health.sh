#!/bin/bash

# Antigravity Directory - System Health Utility
# Use this to clear background processes and restart your dev environment.

echo "🔍 Auditing system load..."

# 1. Kill orphaned node/npm processes
echo "🧹 Purging orphaned Node.js processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
killall node 2>/dev/null

# 2. Kill playback/browser workers
echo "🌐 Cleaning up browser workers..."
killall "Google Chrome Helper" 2>/dev/null
killall "Antigravity Helper" 2>/dev/null

# 3. Clear Next.js cache
echo "📂 Clearing Next.js build cache..."
rm -rf .next/cache

echo "✅ System cleared. Restarting dev server..."
npm run dev
