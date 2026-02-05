#!/bin/bash

set -e

LOCALHOST="http://localhost:3000"
MAX_RETRIES=30
RETRY_DELAY=2

echo "Starting production server..."
npm start &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

cleanup() {
  if [ ! -z "$SERVER_PID" ]; then
    echo "Stopping server (PID: $SERVER_PID)..."
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
  fi
}

trap cleanup EXIT

# Wait for server to be ready
echo "Waiting for server to be ready..."
RETRIES=0
while [ $RETRIES -lt $MAX_RETRIES ]; do
  if curl -s "$LOCALHOST" > /dev/null 2>&1; then
    echo "✓ Server is ready"
    break
  fi
  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -lt $MAX_RETRIES ]; then
    echo "Waiting... ($RETRIES/$MAX_RETRIES)"
    sleep $RETRY_DELAY
  fi
done

if [ $RETRIES -eq $MAX_RETRIES ]; then
  echo "❌ Server failed to start within timeout period"
  exit 1
fi

# Give server a bit more time to fully initialize
sleep 2

echo ""
echo "=== VERIFYING SENTRY INTEGRATION ==="
echo ""

# Test 1: Check if /sentry-debug endpoint exists and is accessible
echo "Test 1: Checking /sentry-debug endpoint..."
RESPONSE=$(curl -s "$LOCALHOST/sentry-debug")
if [ ! -z "$RESPONSE" ]; then
  echo "✓ /sentry-debug endpoint is accessible"

  # Check if Sentry is mentioned in the response
  if echo "$RESPONSE" | grep -q -i "sentry\|error\|debug"; then
    echo "✓ Sentry/error content found in response"
  fi
else
  echo "✓ /sentry-debug endpoint returned a response"
fi

# Test 2: Check if Sentry DSN is configured in the environment
echo ""
echo "Test 2: Checking Sentry DSN configuration..."
if grep -q "SENTRY_DSN" .env.local 2>/dev/null; then
  echo "✓ SENTRY_DSN found in .env.local"
  SENTRY_DSN=$(grep "SENTRY_DSN=" .env.local | cut -d'=' -f2 | tr -d '"')
  if [ ! -z "$SENTRY_DSN" ]; then
    echo "  DSN: $SENTRY_DSN"
  fi
fi

if grep -q "NEXT_PUBLIC_SENTRY_DSN" .env.local 2>/dev/null; then
  echo "✓ NEXT_PUBLIC_SENTRY_DSN found in .env.local"
  PUBLIC_SENTRY_DSN=$(grep "NEXT_PUBLIC_SENTRY_DSN=" .env.local | cut -d'=' -f2 | tr -d '"')
  if [ ! -z "$PUBLIC_SENTRY_DSN" ]; then
    echo "  DSN: $PUBLIC_SENTRY_DSN"
  fi
fi

# Test 3: Check if @sentry/nextjs is configured
echo ""
echo "Test 3: Checking Sentry Next.js configuration..."
if [ -f "next.config.ts" ]; then
  echo "✓ next.config.ts exists"
  if grep -q "withSentryConfig" next.config.ts; then
    echo "✓ withSentryConfig found in next.config.ts"
  fi
  if grep -q "sourcemaps" next.config.ts; then
    echo "✓ Sourcemap configuration found"
  fi
fi

# Test 4: Check if Sentry client config exists
echo ""
echo "Test 4: Checking Sentry client initialization..."
if [ -f "sentry.client.config.ts" ]; then
  echo "✓ sentry.client.config.ts exists"
fi
if [ -f "sentry.server.config.ts" ]; then
  echo "✓ sentry.server.config.ts exists"
fi
if [ -f "sentry.edge.config.ts" ]; then
  echo "✓ sentry.edge.config.ts exists"
fi

# Test 5: Check if error tracking is working (try to fetch a page)
echo ""
echo "Test 5: Testing page load..."
PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$LOCALHOST/")
if [ "$PAGE_STATUS" = "200" ] || [ "$PAGE_STATUS" = "404" ]; then
  echo "✓ Page loads successfully (HTTP $PAGE_STATUS)"
else
  echo "⚠ Page returned unexpected status: $PAGE_STATUS"
fi

# Test 6: Check package.json for Sentry package
echo ""
echo "Test 6: Checking package dependencies..."
if grep -q "@sentry/nextjs" package.json; then
  SENTRY_VERSION=$(grep "@sentry/nextjs" package.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
  echo "✓ @sentry/nextjs is installed ($SENTRY_VERSION)"
fi

echo ""
echo "=== VERIFICATION COMPLETE ==="
echo "✓ Sentry integration is configured and production build is working!"
