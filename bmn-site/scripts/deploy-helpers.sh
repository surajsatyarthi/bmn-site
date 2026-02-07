#!/bin/bash
# Deployment Helper Scripts

# Standard Production Deployment
deploy:production() {
  echo "🚀 Starting Production Deployment..."
  
  # Pre-flight checks
  echo "✓ Running pre-flight checks..."
  npm run test || { echo "❌ Tests failed"; exit 1; }
  npm run build || { echo "❌ Build failed"; exit 1; }
  npm run ralph -- verify || { echo "❌ Ralph gates incomplete"; exit 1; }
  
  # Deploy
  echo "✓ Deploying to production..."
  vercel --prod
  
  echo "✅ Deployment complete!"
  echo "📊 Monitor at: https://vercel.com/dashboard"
}

# Hotfix Deployment (skip canary)
deploy:hotfix() {
  echo "🔥 HOTFIX Deployment (skipping canary)..."
  
  # Minimal checks
  npm run build || { echo "❌ Build failed"; exit 1; }
  
  # Deploy immediately
  vercel --prod --yes
  
  echo "✅ Hotfix deployed!"
  echo "⚠️  Monitor closely: https://vercel.com/dashboard/analytics"
}

# Rollback to previous deployment
deploy:rollback() {
  echo "⏪ Rolling back deployment..."
  
  # Get last deployment
  LAST_DEPLOY=$(vercel ls --meta production=true | head -2 | tail -1 | awk '{print $1}')
  
  echo "Rolling back to: $LAST_DEPLOY"
  vercel promote "$LAST_DEPLOY"
  
  echo "✅ Rollback complete!"
}

# Export functions
export -f deploy:production
export -f deploy:hotfix
export -f deploy:rollback
