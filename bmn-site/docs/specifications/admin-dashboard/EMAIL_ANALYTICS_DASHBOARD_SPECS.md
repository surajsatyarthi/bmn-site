# 📊 Email Analytics Dashboard - Product Specifications

**Document Date:** 2026-02-10
**Product Owner:** AI Project Manager
**Target Implementation:** Block 7.0+ (Admin Panel)
**Priority:** P2 (Post-MVP)

---

## 🎯 Overview

The Email Analytics Dashboard provides administrators with real-time visibility into email deliverability, user engagement, and system health. It leverages the `email_logs` table created in Block 5.3 to surface actionable insights and enable manual interventions.

---

## 🧑‍💼 User Stories

### Epic 1: Email Delivery Monitoring

**US1.1: View Email Delivery Metrics**
- **As an** admin
- **I want to** see real-time email delivery statistics
- **So that I can** monitor system health and catch issues early

**Acceptance Criteria:**
- [ ] Dashboard displays key metrics:
  - Total emails sent (last 24h, 7d, 30d)
  - Delivery rate % (delivered / sent)
  - Bounce rate % (bounced / sent)
  - Failure rate % (failed / sent)
  - Complaint rate % (complained / sent)
- [ ] Metrics auto-refresh every 60 seconds
- [ ] Sparkline charts show trends over time
- [ ] Color-coded indicators:
  - 🟢 Green: Delivery >95%, Bounce <5%, Complaint <0.1%
  - 🟡 Yellow: Delivery 90-95%, Bounce 5-10%, Complaint 0.1-0.5%
  - 🔴 Red: Delivery <90%, Bounce >10%, Complaint >0.5%

---

**US1.2: Filter Metrics by Time Range**
- **As an** admin
- **I want to** filter metrics by custom date ranges
- **So that I can** analyze trends over different periods

**Acceptance Criteria:**
- [ ] Time range selector with presets:
  - Last 24 hours (default)
  - Last 7 days
  - Last 30 days
  - Custom range (date picker)
- [ ] Metrics recalculate on range change
- [ ] Chart visualizations update accordingly

---

### Epic 2: Event Log Explorer

**US2.1: View Email Event History**
- **As an** admin
- **I want to** see a paginated list of all email events
- **So that I can** audit the email system and debug issues

**Acceptance Criteria:**
- [ ] Table displays email_logs entries with columns:
  - Timestamp (sortable)
  - Event Type (badge with color)
  - Recipient email
  - Subject (truncated, hover for full)
  - Email ID (copyable)
  - Error Message (if applicable)
- [ ] Default sort: newest first
- [ ] Pagination: 50 rows per page
- [ ] Column sorting on all fields

---

**US2.2: Filter Event Log**
- **As an** admin
- **I want to** filter events by type, recipient, and date
- **So that I can** quickly find specific issues

**Acceptance Criteria:**
- [ ] Filter controls:
  - Event Type: Multi-select dropdown (delivered, bounced, failed, complained)
  - Recipient: Text search (partial match)
  - Date Range: Date picker
  - Email ID: Exact match search
- [ ] "Clear Filters" button
- [ ] Filter state preserved in URL query params
- [ ] Result count displayed: "Showing X of Y events"

---

**US2.3: Export Event Log**
- **As an** admin
- **I want to** export filtered events to CSV
- **So that I can** perform offline analysis or share with stakeholders

**Acceptance Criteria:**
- [ ] "Export CSV" button above table
- [ ] Respects current filters
- [ ] CSV includes all columns from database
- [ ] Filename: `email_logs_{date_range}.csv`
- [ ] Max export: 10,000 rows (pagination for larger exports)

---

### Epic 3: Problem User Management

**US3.1: View Users with Email Issues**
- **As an** admin
- **I want to** see a list of users with bounced emails or disabled notifications
- **So that I can** take corrective action

**Acceptance Criteria:**
- [ ] Table displays profiles with email issues:
  - Full Name
  - Email (from auth.users via JOIN)
  - Issue Type: "Bounce/Failure" or "Spam Complaint"
  - Last Error Message
  - Date of Last Issue
  - Status: "Deliverable" or "Non-Deliverable"
- [ ] Tabs to filter:
  - "Non-Deliverable" (`email_deliverable = false`)
  - "Notifications Disabled" (`email_notifications_enabled = false`)
  - "All Issues"
- [ ] Sort by date of last issue (newest first)

---

**US3.2: Manually Override Email Status**
- **As an** admin
- **I want to** manually re-enable email delivery for a user
- **So that I can** restore service after they fix their email

**Acceptance Criteria:**
- [ ] Action dropdown on each row:
  - "Mark as Deliverable" (sets `email_deliverable = true`, clears `last_email_error`)
  - "Enable Notifications" (sets `email_notifications_enabled = true`)
  - "Disable Notifications" (sets `email_notifications_enabled = false`)
- [ ] Confirmation modal before action
- [ ] Success toast notification
- [ ] Row updates in real-time
- [ ] Action logged in admin audit trail (future: admin_logs table)

---

**US3.3: Send Test Email to User**
- **As an** admin
- **I want to** send a test email to a specific user
- **So that I can** verify their email is working after fixing an issue

**Acceptance Criteria:**
- [ ] "Send Test Email" button on problem user row
- [ ] Modal with:
  - Recipient (pre-filled, read-only)
  - Subject (default: "BMN Test Email")
  - Body (template with user's name)
  - "Send" and "Cancel" buttons
- [ ] Uses Resend API to send
- [ ] Success/failure notification
- [ ] Event logged in email_logs table

---

### Epic 4: Email Template Analytics

**US4.1: View Performance by Template**
- **As an** admin
- **I want to** see delivery metrics broken down by email subject/template
- **So that I can** identify which emails are problematic

**Acceptance Criteria:**
- [ ] Table displays grouped metrics by subject:
  - Subject (e.g., "Welcome to BMN", "Verification Email")
  - Sent Count
  - Delivery Rate %
  - Bounce Rate %
  - Complaint Rate %
- [ ] Sort by any column
- [ ] Click subject to filter Event Log to that subject
- [ ] "Template Health" indicator:
  - 🟢 Green: Delivery >95%
  - 🟡 Yellow: Delivery 90-95%
  - 🔴 Red: Delivery <90%

---

### Epic 5: Alerts & Notifications

**US5.1: Configure Alert Thresholds**
- **As an** admin
- **I want to** set thresholds for email metrics
- **So that I can** be notified of critical issues

**Acceptance Criteria:**
- [ ] Settings page with threshold inputs:
  - Bounce rate alarm (default: 5%)
  - Complaint rate alarm (default: 0.5%)
  - Delivery rate alarm (default: 90%)
- [ ] "Save" button updates admin preferences
- [ ] Validation: 0-100% range

---

**US5.2: Receive Email Alerts**
- **As an** admin
- **I want to** receive email alerts when thresholds are breached
- **So that I can** respond quickly to deliverability issues

**Acceptance Criteria:**
- [ ] Daily cron job checks 24h metrics against thresholds
- [ ] If breached, sends email to admin (from `ADMIN_EMAIL` env var)
- [ ] Email includes:
  - Metric name and current value
  - Threshold that was breached
  - Link to Email Analytics Dashboard
  - Timestamp of alert
- [ ] Max 1 alert per metric per day (prevent spam)

---

## 🎨 UI/UX Specifications

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Email Analytics Dashboard                                │
│                                                              │
│ Time Range: [Last 24h ▼] [Last 7d] [Last 30d] [Custom]     │
│                                                              │
│ ┌──────────────┬──────────────┬──────────────┬────────────┐│
│ │ Emails Sent  │ Delivery Rate│ Bounce Rate  │ Complaints ││
│ │    1,234     │    97.5% 🟢  │    2.1% 🟢   │   0.1% 🟢  ││
│ │  [sparkline] │  [sparkline] │  [sparkline] │ [sparkline]││
│ └──────────────┴──────────────┴──────────────┴────────────┘│
│                                                              │
│ ┌───────────────────────────────────────────────────────────┐│
│ │ 📋 Event Log                                              ││
│ │ [Filter by Type ▼] [Search recipient...] [Export CSV]    ││
│ │                                                            ││
│ │ Timestamp       Event     Recipient         Subject       ││
│ │ ───────────────────────────────────────────────────────── │
│ │ 2026-02-10 9:15 🟢 Delivered user@ex.com  Welcome to BMN ││
│ │ 2026-02-10 9:14 🔴 Bounced   bad@ex.com   Verification   ││
│ │ ...                                                        ││
│ │                                                            ││
│ │ [< Prev] Page 1 of 10 [Next >]                            ││
│ └───────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌───────────────────────────────────────────────────────────┐│
│ │ ⚠️ Problem Users                                           ││
│ │ [Non-Deliverable] [Notifications Disabled] [All Issues]   ││
│ │                                                            ││
│ │ Name          Email            Issue       Last Error     ││
│ │ ───────────────────────────────────────────────────────── │
│ │ John Doe      john@ex.com      Bounce     Mailbox full   ││
│ │               [Mark as Deliverable ▼]                     ││
│ │ ...                                                        ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Color Scheme

**Event Type Badges:**
- 🟢 `email.delivered` → Green (#10b981)
- 🔴 `email.bounced` → Red (#ef4444)
- 🟠 `email.failed` → Orange (#f59e0b)
- 🚫 `email.complained` → Dark Red (#dc2626)
- ⏳ `email.delivery_delayed` → Yellow (#eab308)

**Metric Indicators:**
- 🟢 Healthy → Green background, white text
- 🟡 Warning → Yellow background, dark text
- 🔴 Critical → Red background, white text

---

## 🔧 Technical Specifications

### API Endpoints

#### **GET /api/admin/email-analytics/metrics**
**Purpose:** Fetch aggregated email metrics

**Query Params:**
- `start_date` (ISO 8601, required)
- `end_date` (ISO 8601, required)

**Response:**
```json
{
  "sent": 1234,
  "delivered": 1203,
  "bounced": 26,
  "failed": 5,
  "complained": 1,
  "delivery_rate": 97.5,
  "bounce_rate": 2.1,
  "failure_rate": 0.4,
  "complaint_rate": 0.1,
  "trend": [
    { "date": "2026-02-09", "sent": 150, "delivered": 147 },
    { "date": "2026-02-10", "sent": 200, "delivered": 195 }
  ]
}
```

---

#### **GET /api/admin/email-analytics/events**
**Purpose:** Fetch paginated event log with filters

**Query Params:**
- `page` (default: 1)
- `limit` (default: 50, max: 100)
- `event_type` (optional, comma-separated)
- `recipient` (optional, partial match)
- `start_date` (optional)
- `end_date` (optional)
- `email_id` (optional, exact match)
- `sort` (default: created_at:desc)

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "email_id": "resend-id",
      "event_type": "email.delivered",
      "recipient": "user@example.com",
      "subject": "Welcome to BMN",
      "from_address": "noreply@businessmarket.network",
      "bounce_type": null,
      "error_message": null,
      "created_at": "2026-02-10T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "total_pages": 25
  }
}
```

---

#### **GET /api/admin/email-analytics/problem-users**
**Purpose:** Fetch users with email delivery issues

**Query Params:**
- `issue_type` (optional: "bounce", "complaint", "all")
- `page` (default: 1)
- `limit` (default: 50)

**Response:**
```json
{
  "users": [
    {
      "user_id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "email_deliverable": false,
      "last_email_error": "Mailbox full",
      "email_notifications_enabled": true,
      "last_issue_date": "2026-02-09T12:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### **POST /api/admin/email-analytics/override-status**
**Purpose:** Manually update user email status

**Body:**
```json
{
  "user_id": "uuid",
  "action": "mark_deliverable" | "enable_notifications" | "disable_notifications"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User email status updated",
  "user": { ... }
}
```

---

#### **POST /api/admin/email-analytics/send-test-email**
**Purpose:** Send test email to user

**Body:**
```json
{
  "recipient": "user@example.com",
  "subject": "BMN Test Email",
  "body": "This is a test email..."
}
```

**Response:**
```json
{
  "success": true,
  "email_id": "resend-id"
}
```

---

#### **GET /api/admin/email-analytics/template-performance**
**Purpose:** Metrics grouped by email subject/template

**Query Params:**
- `start_date` (required)
- `end_date` (required)

**Response:**
```json
{
  "templates": [
    {
      "subject": "Welcome to BMN",
      "sent": 500,
      "delivered": 490,
      "bounced": 8,
      "failed": 2,
      "complained": 0,
      "delivery_rate": 98.0,
      "bounce_rate": 1.6
    }
  ]
}
```

---

### Database Queries

**Metrics Query:**
```sql
SELECT
  COUNT(*) FILTER (WHERE event_type = 'email.sent') AS sent,
  COUNT(*) FILTER (WHERE event_type = 'email.delivered') AS delivered,
  COUNT(*) FILTER (WHERE event_type = 'email.bounced') AS bounced,
  COUNT(*) FILTER (WHERE event_type = 'email.failed') AS failed,
  COUNT(*) FILTER (WHERE event_type = 'email.complained') AS complained
FROM email_logs
WHERE created_at BETWEEN $1 AND $2;
```

**Problem Users Query:**
```sql
SELECT
  p.id AS user_id,
  p.full_name,
  u.email,
  p.email_deliverable,
  p.last_email_error,
  p.email_notifications_enabled,
  MAX(el.created_at) AS last_issue_date
FROM profiles p
JOIN auth.users u ON p.id = u.id
LEFT JOIN email_logs el ON u.email = el.recipient
  AND el.event_type IN ('email.bounced', 'email.failed', 'email.complained')
WHERE p.email_deliverable = false OR p.email_notifications_enabled = false
GROUP BY p.id, u.email
ORDER BY last_issue_date DESC;
```

---

## 🔒 Security & Permissions

### Access Control
- **Requirement:** Only users with `is_admin = true` in profiles table can access dashboard
- **Middleware:** Check `auth.uid()` and `profiles.is_admin` on all admin API routes
- **Redirect:** Non-admins redirected to `/dashboard` with toast: "Unauthorized"

### Rate Limiting
- **Export CSV:** Max 10 requests per hour per admin
- **Send Test Email:** Max 50 per day per admin
- **Override Status:** No limit (admin discretion)

### Audit Trail
- All admin actions logged to `admin_logs` table (future implementation):
  - `action_type`: "email_status_override", "test_email_sent"
  - `admin_id`: UUID of admin user
  - `target_user_id`: UUID of affected user (if applicable)
  - `details`: JSONB with action context
  - `created_at`: Timestamp

---

## 📦 Implementation Phases

### Phase 1: Core Dashboard (Block 7.0)
- [ ] Metrics cards with sparklines
- [ ] Event log table with pagination
- [ ] Basic filters (event type, date range)
- [ ] API endpoints for metrics and events

**Estimated Effort:** 2-3 days

---

### Phase 2: Problem User Management (Block 7.1)
- [ ] Problem users table
- [ ] Manual status overrides
- [ ] Send test email functionality
- [ ] API endpoints for user actions

**Estimated Effort:** 1-2 days

---

### Phase 3: Advanced Features (Block 7.2+)
- [ ] CSV export
- [ ] Template performance analysis
- [ ] Alert threshold configuration
- [ ] Email alert system (cron job)

**Estimated Effort:** 2-3 days

---

## ✅ Acceptance Criteria (Phase 1)

### Definition of Done
- [ ] All Phase 1 user stories implemented
- [ ] UI matches wireframe design
- [ ] All API endpoints return correct data
- [ ] Admin permission checks enforced
- [ ] Dashboard loads in <2 seconds
- [ ] Real-time data (60s refresh)
- [ ] Mobile responsive design
- [ ] Unit tests for API endpoints (80% coverage)
- [ ] End-to-end test for critical paths
- [ ] Documentation updated (README, API docs)

---

## 📚 Dependencies

### Technical Dependencies
- ✅ `email_logs` table (created in Block 5.3)
- ✅ `profiles` columns (email_deliverable, last_email_error, email_notifications_enabled)
- ⚠️ Admin permission system (requires `is_admin` column in profiles)
- ⚠️ Chart library: Recommend Recharts or Chart.js for React

### Business Dependencies
- Admin user accounts with elevated permissions
- Resend webhook actively sending events (production data)

---

## 🎯 Success Metrics

### Usage Metrics
- Admin dashboard accessed >3x per week
- Problem users identified and resolved within 48h
- CSV exports used for monthly reporting

### System Health Metrics
- Bounce rate maintained <5%
- Complaint rate maintained <0.1%
- Delivery rate maintained >95%
- Alert response time <4 hours

---

## 📝 Future Enhancements (Post-MVP)

### V2 Features
- [ ] Real-time push notifications for critical events
- [ ] Email template A/B testing analytics
- [ ] Integration with SendGrid/Mailgun for multi-provider support
- [ ] Predictive bounce detection (ML model)
- [ ] Automated re-send for soft bounces

### V3 Features
- [ ] User-level email engagement tracking (opens, clicks)
- [ ] Cohort analysis for email campaigns
- [ ] Custom report builder with drag-and-drop
- [ ] Webhook retry dashboard

---

## 📞 Stakeholders

**Product Owner:** AI Project Manager
**Engineering Lead:** Development Team
**Primary Users:** BMN Admins (initially 1-2 users)
**Approval Required:** Product Owner for UI mockups, Engineering Lead for API design

---

**Document Version:** 1.0
**Last Updated:** 2026-02-10
**Status:** 📋 **READY FOR IMPLEMENTATION** (Post-Block 6.0)

---

## Appendix: Related Documentation

- [Webhook Tracking Audit Report](./AUDIT_REPORT_WEBHOOK_TRACKING.md)
- [Block 5.3 Email Notifications Audit](./AUDIT_REPORT_BLOCK_5.3_EMAIL_NOTIFICATIONS.md)
- [Admin Panel Specifications](../admin-panel/ADMIN_PANEL_SPECS.md) *(future)*
