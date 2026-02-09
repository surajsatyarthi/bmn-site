# Task 6.1 — Ops Dashboard & Admin Tools (Full CRUD)

**Block:** 6.1
**Status:** TODO
**Prerequisites:** Block 5.4 COMPLETE (read-only admin dashboard)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Extend admin dashboard from read-only to full CRUD operations, enabling ops team to manage users, matches, and campaigns without database access.

---

## Deliverable 1: Match Upload UI

**Route:** `/admin/matches/new`

**Purpose:** Ops team can add matches for specific users (manual match generation).

**Form fields:**
- User selector (search by email/name)
- Counterparty company name
- Counterparty country, city
- Matched products (HS codes)
- Match tier (Best/Great/Good)
- Match reasons (bullet points)
- Trade data (volume, years active)
- Contact info (email, phone, address)

**API Route:**
```typescript
// POST /api/admin/matches
// Body: { profileId, counterpartyName, country, products[], tier, reasons[], tradeData, contact }
// Creates match record, sets revealed=false
```

**Validation:**
- User must have completed onboarding
- At least 1 matched product required
- Match tier maps to internal score (Best=85, Great=70, Good=55)

**Acceptance:**
- Admin can create match for any user
- Match appears on user's `/matches` page immediately
- Match status = 'new', revealed = false
- Mobile responsive form

---

## Deliverable 2: Campaign Creation & Management

**Route:** `/admin/campaigns/new`

**Purpose:** Ops team creates campaigns for users.

**Form fields:**
- User selector
- Campaign name
- Target description (e.g., "UAE Basmati Rice Importers")
- Status (draft/active/paused/completed)
- Initial metrics (emails sent, opened, replied, meetings)

**API Routes:**
```typescript
// POST /api/admin/campaigns
// PATCH /api/admin/campaigns/[id]
// DELETE /api/admin/campaigns/[id]
```

**Campaign Metrics Editor:**
- Update sent/opened/replied/meetings counters
- Set "Last updated" timestamp
- Mark campaign as completed

**Acceptance:**
- Admin can create/edit/delete campaigns
- Metrics update reflected on user dashboard within 1 minute
- Cannot delete campaigns with status = 'active'

---

## Deliverable 3: User Profile Editor

**Route:** `/admin/users/[id]/edit`

**Purpose:** Fix user profile data, update onboarding status.

**Editable fields:**
- Company info (name, type, size, address)
- Products (add/remove HS codes)
- Certifications (add/remove)
- Onboarding status (force complete/incomplete)
- Plan tier (free/pro)

**API Route:**
```typescript
// PATCH /api/admin/users/[id]
// Body: { company?, products?, certifications?, onboardingCompleted?, plan? }
```

**Constraints:**
- Cannot change user email (auth.users managed by Supabase)
- Audit log required (see Deliverable 5)

**Acceptance:**
- Admin can edit user profiles
- Changes reflect on user's `/profile` page immediately
- Validation same as user-facing forms

---

## Deliverable 4: Client Notification Trigger

**Route:** `/admin/users/[id]` (add "Mark Lead as Delivered" button)

**Purpose:** Notify user when warm lead is ready for handoff.

**Workflow:**
1. Admin clicks "Deliver Lead" button on match detail
2. Modal: Confirm lead delivery, optional message
3. API creates notification record
4. User sees banner on dashboard: "New lead ready! ABC Trading Co."
5. Email sent to user (requires Block 5.3 Email Notifications)

**API Route:**
```typescript
// POST /api/admin/leads/deliver
// Body: { matchId, message? }
// Sets match.status = 'delivered', creates notification
```

**Acceptance:**
- Admin can mark match as delivered
- User sees notification on dashboard
- Email sent (if Block 5.3 complete)

---

## Deliverable 5: Activity Log & Audit Trail

**Schema:**
```sql
CREATE TABLE admin_activity_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid REFERENCES profiles(id),
  action text NOT NULL, -- 'create_match', 'edit_user', 'update_campaign', 'deliver_lead'
  target_type text NOT NULL, -- 'user', 'match', 'campaign'
  target_id uuid NOT NULL,
  details jsonb, -- { before: {}, after: {} } for edits
  created_at timestamp DEFAULT now()
);
```

**Route:** `/admin/activity`

**Display:**
- Table with: Admin, Action, Target, Details, Timestamp
- Filters: Admin, Action type, Date range
- Pagination (50 per page)

**Logged actions:**
- Match creation/editing
- Campaign creation/editing
- User profile edits
- Lead delivery
- Admin login

**Acceptance:**
- All admin actions logged automatically
- Activity log searchable and filterable
- Logs retained for 90 days minimum

---

## Deliverable 6: Bulk Operations

**Route:** `/admin/matches/bulk-upload`

**Purpose:** Upload CSV of matches for multiple users.

**CSV format:**
```csv
user_email,counterparty_name,country,city,hs_code,product_name,tier,volume,contact_email
user@example.com,ABC Trading,UAE,Dubai,090111,Coffee,best,200MT/mo,abc@example.ae
```

**Workflow:**
1. Admin uploads CSV
2. Preview table shows parsed rows
3. Validation errors highlighted
4. "Confirm Upload" creates all matches

**API Route:**
```typescript
// POST /api/admin/matches/bulk
// Body: FormData with CSV file
// Returns: { created: number, errors: [{row, message}] }
```

**Acceptance:**
- CSV upload creates multiple matches
- Invalid rows skipped with error log
- Max 100 matches per upload

---

## Deliverable 7: Admin Role Management

**Schema update:**
```sql
ALTER TABLE profiles ADD COLUMN admin_level text DEFAULT 'user'
  CHECK (admin_level IN ('user', 'admin', 'super_admin'));
```

**Permissions:**
- **admin:** Can view/create/edit matches, campaigns, users
- **super_admin:** Can promote/demote admins, view audit log, bulk operations

**Route:** `/admin/settings/admins`

**Acceptance:**
- Super admin can promote users to admin
- Admin cannot promote others (only super_admin can)
- Middleware checks admin_level on all `/admin/*` routes

---

## Constraints

- All admin actions require authentication + admin role
- Activity log cannot be edited/deleted (append-only)
- Bulk operations limited to 100 rows per upload
- No PII logging in activity log details
- Admin UI desktop-only (no mobile requirement)

---

## Evidence Required

Save to `docs/evidence/block-6.1/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Match upload form | `admin-match-form.png`, `admin-match-created.png` |
| Campaign editor | `admin-campaign-edit.png`, `admin-campaign-metrics.png` |
| User profile editor | `admin-user-edit-before.png`, `admin-user-edit-after.png` |
| Activity log | `admin-activity-log.png`, `admin-activity-filtered.png` |
| Bulk upload | `admin-bulk-upload-preview.png`, `admin-bulk-upload-success.png` |
| Admin role management | `admin-promote-user.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Create match for user → verify appears on user's `/matches` page
2. Edit campaign metrics → verify updates on user dashboard
3. Upload bulk CSV → verify matches created for multiple users
4. Check activity log → verify all actions logged
5. Promote user to admin → verify can access `/admin/*` routes

Update `docs/governance/project_ledger.md` under Block 6.1. Mark as **SUBMITTED**.
