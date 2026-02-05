#!/bin/bash

# Exit on error
set -e

# ==========================================
# CONFIGURATION
# ==========================================

# OLD DB (Source) - Extracted from .env.local
# URL: postgresql://postgres.epuxtctndtminhdqjabu:vxjeBFPJelv4eTXV@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
OLD_DB_HOST="aws-1-ap-southeast-1.pooler.supabase.com"
OLD_DB_PORT="6543"
OLD_DB_USER="postgres.epuxtctndtminhdqjabu"
OLD_DB_PASS="vxjeBFPJelv4eTXV"
OLD_DB_NAME="postgres"

# NEW DB (Destination) - Provided by User
# Project: lbilqqnwompraxjgnorg
NEW_DB_HOST="aws-1-ap-south-1.pooler.supabase.com"
NEW_DB_PORT="5432"
NEW_DB_USER="postgres.lbilqqnwompraxjgnorg"
NEW_DB_PASS="y&#QeK*f_JPT-w2"
NEW_DB_NAME="postgres"

# Path to libpq binaries (adjust if needed)
export PATH="/opt/homebrew/opt/libpq/bin:/usr/local/opt/libpq/bin:$PATH"

# ==========================================
# MIGRATION STEPS
# ==========================================

echo "🚀 Starting Supabase Migration..."
echo "-----------------------------------"
echo "Source: $OLD_DB_HOST"
echo "Dest:   $NEW_DB_HOST"
echo "-----------------------------------"

# 1. Check tools
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump could not be found. Please ensure libpq is installed and in PATH."
    exit 1
fi

# 2. Dump Old Database (Data Only - we will push schema via Drizzle first/parallel or dump everything)
# Actually, let's dump structure + data for public schema to be safe, 
# but specifically ensuring we handle the 'auth' schema manually if we could (auth schema is tricky).
# For now, let's stick to the 'public' schema as that contains the app data.

echo "📦 Dumping 'public' schema from OLD database..."
PGPASSWORD="$OLD_DB_PASS" pg_dump \
  --host="$OLD_DB_HOST" \
  --port="$OLD_DB_PORT" \
  --username="$OLD_DB_USER" \
  --dbname="$OLD_DB_NAME" \
  --no-owner \
  --no-acl \
  --schema=public \
  --file=migration_dump.sql

echo "✅ Dump complete (migration_dump.sql)"

# 3. Restore to New Database
echo "📥 Restoring to NEW database..."

PGPASSWORD="$NEW_DB_PASS" psql \
  --host="$NEW_DB_HOST" \
  --port="$NEW_DB_PORT" \
  --username="$NEW_DB_USER" \
  --dbname="$NEW_DB_NAME" \
  < migration_dump.sql

echo "✅ Restore complete!"

# 4. Cleanup
rm migration_dump.sql
echo "✨ Migration finished successfully!"
