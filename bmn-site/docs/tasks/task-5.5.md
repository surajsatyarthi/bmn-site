# Task 5.5 — Self-Serve Campaign Creation

**Block:** 5.5
**Status:** TODO
**Prerequisites:** Block 5.4 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Allow users to create their own cold email campaigns by selecting matches they're interested in. Campaigns are queued for admin approval before launch.

---

## Deliverable 1: Match Selection UI

### Update Matches Page

**Route:** `/matches`

**New UI elements:**
- Checkbox on each match card
- "Create Campaign" button (appears when ≥1 match selected)
- Selected count indicator (e.g., "3 matches selected")

**State management:**
```typescript
const [selectedMatches, setSelectedMatches] = useState<string[]>([])

function handleCreateCampaign() {
  // Navigate to /campaigns/new with selectedMatches in query params
  router.push(`/campaigns/new?matches=${selectedMatches.join(',')}`)
}
```

---

## Deliverable 2: Campaign Creation Form

**Route:** `/campaigns/new`

**Form fields:**

1. **Campaign Name** (text input, required)
   - Example: "Coffee Exporters - Q1 2024"
   - Max 100 characters

2. **Email Subject** (text input, required)
   - Example: "Partnership opportunity for Indian coffee exports"
   - Max 200 characters

3. **Email Body** (textarea, required)
   - Rich text editor (Tiptap or similar)
   - Variable support: `{{userName}}`, `{{companyName}}`, `{{productCategory}}`
   - Preview panel showing rendered email
   - Min 100 characters, max 2000 characters

4. **Selected Matches** (read-only list)
   - Show match company names, countries
   - Allow removal (uncheck)

5. **Launch Settings**
   - Send timing: Immediate vs Scheduled (date picker)
   - Daily send limit: Default 10 emails/day (prevents spam flags)

**Validation:**
- At least 1 match selected
- All required fields filled
- Email body must include at least one variable ({{userName}}, etc.)

---

## Deliverable 3: Campaign Preview

**UI Component:** Preview panel in creation form

**Shows:**
- Email subject with variables replaced (using first match data)
- Email body with variables replaced
- "From" address: BMN on behalf of {user}
- Reply-to: User's email

**Purpose:** Let user see exactly what recipients will receive.

---

## Deliverable 4: Campaign Submission & Approval Flow

### Database schema:
```sql
-- Add to campaigns table
ALTER TABLE campaigns ADD COLUMN approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE campaigns ADD COLUMN reviewed_by uuid REFERENCES profiles(id);
ALTER TABLE campaigns ADD COLUMN reviewed_at timestamp;
```

### Submission flow:

1. User clicks "Create Campaign"
2. API creates campaign with `status = 'draft'`, `approval_status = 'pending'`
3. API creates `campaign_targets` records (junction table linking campaign to matches)
4. User sees success message: "Campaign created! Awaiting admin approval."
5. Redirect to `/campaigns`

**API Route:**
```typescript
// POST /api/campaigns
// Body: { name, subject, body, matchIds, sendTiming }
// Response: { campaignId, status: 'pending_approval' }
```

---

## Deliverable 5: Campaign List (User View)

**Route:** `/campaigns`

**Campaign statuses:**
- `pending_approval` (yellow badge) - Awaiting admin review
- `approved` (green badge) - Admin approved, ready to send
- `active` (blue badge) - Currently sending
- `paused` (gray badge) - User or admin paused
- `completed` (green badge) - All emails sent

**Campaign card shows:**
- Campaign name
- Status badge
- Target count (e.g., "10 buyers targeted")
- Emails sent / Total
- Responses count
- Created date
- Actions: View detail, Pause (if active), Delete (if pending)

---

## Deliverable 6: Admin Approval Interface

**Route:** `/admin/campaigns` (existing page, add approval actions)

**New UI for pending campaigns:**
- "Pending Approval" tab/filter
- Approve/Reject buttons
- View campaign details (subject, body, target matches)
- Rejection reason field (required if rejecting)

**API Routes:**
```typescript
// PATCH /api/admin/campaigns/[id]/approve
// PATCH /api/admin/campaigns/[id]/reject
// Body: { reason?: string }
```

**Email notifications:**
- Send email to user when campaign approved/rejected
- Include rejection reason if applicable

---

## Deliverable 7: Campaign Execution (Basic Queue)

### Background job (Vercel Cron):

**Route:** `/api/cron/send-campaign-emails`

**Cron schedule:** Every hour (`0 * * * *`)

**Logic:**
1. Find campaigns with `status = 'active'` and `approval_status = 'approved'`
2. For each campaign, get next batch of unsent targets (respect daily limit)
3. Send emails via Resend
4. Update `campaign_targets.sent_at` timestamp
5. If all targets sent, update campaign `status = 'completed'`

**Rate limiting:**
- Max 10 emails per campaign per run (avoid spam flags)
- Track `emails_sent_today` counter, reset daily

---

## Constraints

- User can only create campaigns for their own matches
- Campaign must be approved before sending
- Daily send limit: 10 emails per campaign (anti-spam)
- Email variables must be replaced before sending
- No HTML/CSS email customization in Phase 5 (plain text + basic formatting)
- Campaign deletion only allowed if status = 'draft' or 'pending_approval'

---

## Evidence Required

Save to `docs/evidence/block-5.5/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Campaign creation flow | `create-campaign-1-select.png`, `create-campaign-2-form.png`, `create-campaign-3-preview.png`, `create-campaign-4-submitted.png` |
| Campaign list | `campaigns-list-pending.png`, `campaigns-list-active.png` |
| Admin approval | `admin-approve-campaign.png`, `admin-reject-campaign.png` |
| Email sent screenshot | `campaign-email-sent.png` |
| Mobile screenshots | `mobile-campaign-list.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Select matches → create campaign → see "pending approval"
2. Login as admin → approve campaign → verify status changes to "approved"
3. Wait for cron job (or trigger manually) → verify email sent
4. Check campaign list → verify email count increments
5. Reject campaign → verify user gets notification email

Update `docs/governance/project_ledger.md` under Block 5.5. Mark as **SUBMITTED**.
