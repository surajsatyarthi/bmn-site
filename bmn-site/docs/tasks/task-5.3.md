# Task 5.3 — Email Notifications

**Block:** 5.3
**Status:** TODO
**Prerequisites:** Block 5.2 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Implement email notifications for key user events using Resend API to improve engagement and retention.

---

## Deliverable 1: Resend Integration

### Setup

**Files to create:**
- `src/lib/email/resend.ts` (Resend client wrapper)
- `src/lib/email/templates/` (email templates directory)
- `src/app/api/email/send/route.ts` (internal API for sending emails)

**Environment variables:**
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@businessmarket.network
```

**Resend client setup:**
```typescript
// src/lib/email/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) {
  return await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html
  })
}
```

---

## Deliverable 2: Email Templates

### Templates to create (React Email format):

**1. Welcome Email** (`templates/WelcomeEmail.tsx`)
- Sent after signup + email verification
- Content: "Welcome to BMN! Complete your onboarding to get matched."
- CTA: Link to /onboarding

**2. New Match Notification** (`templates/NewMatchEmail.tsx`)
- Sent when new matches are found
- Content: "You have {count} new qualified buyers!"
- Shows match tier, country, product category (no contact info)
- CTA: Link to /matches

**3. Campaign Update** (`templates/CampaignUpdateEmail.tsx`)
- Sent when campaign status changes (active → responses_received)
- Content: "Your campaign has received {count} responses"
- CTA: Link to /campaigns/[id]

**4. Weekly Digest** (`templates/WeeklyDigestEmail.tsx`)
- Sent every Monday 9 AM IST
- Summary: New matches this week, campaign progress, profile completion %
- CTA: Link to /dashboard

---

## Deliverable 3: Email Triggers

**Integration points:**

1. **After signup verification:**
   - File: `src/app/api/auth/callback/route.ts`
   - Send welcome email

2. **After match upload (admin):**
   - File: `src/app/api/admin/matches/route.ts`
   - Send new match notification to affected users

3. **Campaign status change:**
   - File: `src/app/api/campaigns/[id]/route.ts` (PATCH)
   - Send campaign update email

4. **Weekly digest (cron job):**
   - File: `src/app/api/cron/weekly-digest/route.ts`
   - Vercel Cron: runs every Monday 3:30 AM UTC (9 AM IST)
   - Query all users with matches from past 7 days

---

## Deliverable 4: Email Preferences

**Database schema:**
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN email_preferences jsonb DEFAULT '{"newMatches": true, "campaignUpdates": true, "weeklyDigest": true}'::jsonb;
```

**UI: Profile page**
- Add "Email Preferences" section
- Checkboxes for each notification type
- Save preferences to `email_preferences` column

**Enforcement:**
- Check preferences before sending (except transactional emails like welcome)
- If `newMatches: false`, skip new match emails

---

## Constraints

- Only send to verified emails
- Rate limit: Max 1 email per user per hour (except transactional)
- Unsubscribe link required in all non-transactional emails
- Test emails in development (use Resend test mode)
- GDPR: Include unsubscribe link, respect preferences

---

## Evidence Required

Save to `docs/evidence/block-5.3/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Email screenshots | `email-welcome.png`, `email-new-match.png`, `email-campaign.png`, `email-digest.png` |
| Resend dashboard screenshot | `resend-sent-emails.png` |
| Email preferences UI | `preferences-page.png` |
| Mobile email rendering | `mobile-email-welcome.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Sign up new user → verify welcome email received
2. Upload match as admin → verify new match email sent
3. Change campaign status → verify campaign update email sent
4. Toggle email preferences → verify emails respect settings

Update `docs/governance/project_ledger.md` under Block 5.3. Mark as **SUBMITTED**.
