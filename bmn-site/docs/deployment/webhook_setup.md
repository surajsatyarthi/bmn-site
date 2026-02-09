# Webhook Implementation - Deployment Checklist

## Files Created

1. **`/api/webhooks/resend/route.ts`** - Webhook endpoint
2. **`supabase/migrations/[timestamp]_add_email_logs_table.sql`** - Database schema
3. **`scripts/migrate_email_logs.ts`** - Migration runner

## Deployment Steps

### 1. Run Migration (Production)

The migration will create:
- `email_logs` table for tracking all email events
- Columns on `profiles` table:
  - `email_deliverable` (boolean)
  - `last_email_error` (text)
  - `email_notifications_enabled` (boolean)

**Run on production Supabase:**
```bash
# Option 1: Via Supabase Dashboard SQL Editor
# Copy contents of supabase/migrations/*_add_email_logs_table.sql

# Option 2: Via Supabase CLI (if linked)
npx supabase db push
```

### 2. Configure Webhook in Resend

**Webhook URL**: `https://businessmarket.network/api/webhooks/resend`

**Events to Subscribe**:
- ✅ `email.delivered` - Track successful deliveries
- ✅ `email.bounced` - Remove bad email addresses
- ✅ `email.failed` - Alert on permanent failures
- ✅ `email.complained` - Stop sending to spam reporters
- ⚠️ `email.suppressed` - Track blocked emails

**Security**:
- Resend sends `svix-signature` header
- TODO: Implement signature verification (see Resend docs)

### 3. Test Webhook

After deployment:
```bash
# Send a test email
curl -X POST https://businessmarket.network/api/test-email

# Check email_logs table
# Verify events are being logged
```

## What the Webhook Does

1. **Logs all events** to `email_logs` table
2. **Handles bounces/failures**:
   - Marks `email_deliverable = false` on user profile
   - Stores error message
3. **Handles spam complaints**:
   - Disables `email_notifications_enabled`
   - Prevents future emails to that address

## Monitoring

Check Resend Dashboard → Logs for webhook delivery status.

---

**Status**: Ready for production deployment. Migration and webhook configuration pending.
