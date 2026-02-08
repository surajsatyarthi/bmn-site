# Deal Pipeline Architecture (Phase 8)

**Last Updated:** 2026-02-07  
**Source:** table.csv analysis (13-step export deal process)  
**Status:** PLANNED (awaiting Phases 6-7 completion)

---

## Executive Summary

The Deal Pipeline tracks the complete export deal lifecycle from initial product selection through final payment. It provides clear visibility into which steps are automated by BMN and which require user action, using a Kanban board interface at `/deals`.

---

## 13-Step Export Deal Process

| Step | Description | Owner | Stage | Action Type |
|:-----|:------------|:------|:------|:------------|
| 1 | Finalize Product and Target Country | Backend AI | Lead Gen | Automated |
| 2 | Conduct Compliance Check | Backend AI | Lead Gen | Automated |
| 3 | Find Leads from Databases | Backend AI | Lead Gen | Automated |
| 4 | Build a Prospect List | Backend AI | Lead Gen | Automated |
| 5 | Send Initial Emails or Inquiries | Backend AI | Outreach | Automated |
| 6 | Set Up Meetings | Backend AI | Outreach | Automated |
| **7** | **Conduct Discussions** | **USER** | **Discussion** | **🔴 Action Required** |
| **8** | **Agree on Price and Terms** | **USER** | **Negotiation** | **🔴 Action Required** |
| **9** | **Send Samples** | **USER** | **Negotiation** | **🔴 Action Required** |
| 10 | Finalize Contract | Backend AI | Contract | Automated |
| 11 | Arrange Production and Quality Control | Backend AI | Fulfillment | Automated |
| 12 | Handle Logistics and Shipping | Backend AI | Fulfillment | Automated |
| 13 | Manage Payment and Follow-Up | Backend AI | Fulfillment | Automated |

---

## Kanban Board Design

### Route: `/deals`

**6 Columns (Stage-based):**

1. **Lead Gen** (Steps 1-4)
   - Status: "BMN is researching..."
   - Cards show: Company name, product, target country
   - Color: Gray (system working)

2. **Outreach** (Steps 5-6)
   - Status: "BMN is reaching out..."
   - Cards show: Emails sent, meetings scheduled
   - Color: Blue (system working)

3. **Discussion** (Step 7)
   - Status: "🔴 Schedule or conduct meeting"
   - Cards show: Meeting scheduler button, notes field
   - Color: Orange (action required)

4. **Negotiation** (Steps 8-9)
   - Status: "🔴 Agree on terms & send samples"
   - Cards show: Terms form, sample shipment tracker
   - Color: Orange (action required)

5. **Contract** (Step 10)
   - Status: "BMN is finalizing contract..."
   - Cards show: Contract PDF download
   - Color: Green (system working)

6. **Fulfillment** (Steps 11-13)
   - Status: "BMN is handling production/shipping..."
   - Cards show: Production status, tracking number, payment status
   - Color: Green (system working)

**Drag & Drop:** User can manually move cards between stages if automation fails or manual override needed.

---

## Data Model

### Table: `deals`

```typescript
{
  id: uuid,
  match_id: uuid, // FK to matches table
  profile_id: uuid, // FK to profiles table
  
  // Progress tracking
  stage: enum('lead_gen', 'outreach', 'discussion', 'negotiation', 'contract', 'fulfillment'),
  current_step: int, // 1-13
  status: enum('active', 'stuck', 'completed', 'cancelled'),
  
  // User action tracking
  user_action_required: boolean,
  user_action_description: text, // "Schedule a meeting with Acme Corp"
  user_action_completed_at: timestamp,
  
  // Automation tracking
  automated_by_backend: boolean,
  automation_status: jsonb, // { step: 5, status: 'sending_emails', progress: 12/50 }
  
  // Deal details
  product_name: text,
  target_country: text,
  estimated_value: decimal,
  
  // Metadata
  notes: text,
  created_at: timestamp,
  updated_at: timestamp,
  completed_at: timestamp
}
```

### Relations

- `deals.match_id` → `matches.id` (one-to-one: a match becomes a deal when user clicks "Start Deal")
- `deals.profile_id` → `profiles.id` (one-to-many: user can have multiple active deals)

---

## User Journey

### 1. Match → Deal Conversion

**Trigger:** User clicks "Start Deal" on `/matches/[id]` after revealing contact

**Flow:**
1. System creates `deals` record linked to match
2. Sets `stage = 'lead_gen'`, `current_step = 1`
3. Backend automation kicks off Steps 1-4
4. User sees new card appear in "Lead Gen" column on `/deals`

---

### 2. Automated Stages (Steps 1-6, 10-13)

**User sees:**
- Card in gray/blue column
- Status text: "BMN is working on this..."
- Progress indicator (if multi-step stage)
- **No action button** (just monitoring)

**User can:**
- View timeline on `/deals/[id]` showing completed steps
- Add notes
- Manually advance if automation fails

---

### 3. User Action Required (Steps 7-9)

**Dashboard Banner:**
```
🔴 3 deals need your attention
[View Deals]
```

**Deal Card in Kanban:**
- Orange border
- "🔴 Action Required" badge
- Clear button: "Schedule Meeting" / "Enter Terms" / "Mark Samples Sent"

**Deal Detail Page (`/deals/[id]`):**
- Vertical timeline with Step 7/8/9 highlighted
- Action form embedded inline
- "Mark Complete" button → moves to next stage

---

### 4. Deal Completion

**When Step 13 completes:**
- Card moves to "Completed" column (7th column)
- `status = 'completed'`, `completed_at = now()`
- Email notification sent to user
- Deal archived from Kanban (accessible via "View All Deals" filter)

---

## Dashboard Integration

### Stat Cards (on `/dashboard`)

**New Card:**
```
Active Deals
[12]
2 need action
```

**Behavior:**
- Shows count of `deals` where `status = 'active'`
- Red badge shows count where `user_action_required = true`
- Click → navigates to `/deals`

---

### Navigation

**Sidebar (updated):**
```
Dashboard
Matches
Campaigns
> Deals (NEW)
```

---

## Backend Automation Hooks

### Phase 8B Implementation

**Stage 1-4 (Lead Gen):**
- Hook: `POST /api/deals` → triggers lead research job
- Data source: Matches engine (Phase 3)
- Duration: ~5-10 minutes
- Completion: Auto-advance to Stage 5

**Stage 5-6 (Outreach):**
- Hook: Deal enters "outreach" stage → triggers Manyreach campaign
- Prerequisite: Phase 7 (Cold Email Engine)
- Monitors: Email open/reply rates
- Completion: Meeting scheduled → auto-advance to Stage 7

**Stage 10 (Contract):**
- Hook: User completes Step 9 → generates contract PDF
- Template: Merge fields (company name, product, terms)
- Storage: S3 or Supabase Storage
- Completion: Contract ready → auto-advance to Stage 11

**Stage 11-13 (Fulfillment):**
- Hook: Contract signed → triggers production workflow (external system)
- Updates: Webhook from logistics provider updates tracking status
- Completion: Payment received → marks deal as complete

---

## Prerequisites

**MUST complete before Phase 8:**

1. ✅ **Phase 5:** Admin Tools (complete)
2. ⚪️ **Phase 6:** Transactional Emails (stage change notifications)
3. ⚪️ **Phase 7:** Cold Email Engine (powers Steps 5-6)

**Phase 8A cannot start until Phases 6-7 are complete.** Deal pipeline requires email infrastructure to be useful.

---

## Implementation Phases

### Phase 8A: Pipeline UI (6-8 weeks)

**Deliverables:**
- `/deals` Kanban board route
- Deal detail page `/deals/[id]` with timeline
- Match → Deal conversion flow
- USER ACTION forms (meeting, terms, samples)
- Dashboard integration (stat card + alerts)

**Tasks:** See PRD Phase 8A (tasks 8A.1 - 8A.6)

---

### Phase 8B: Automation Hooks (4-6 weeks)

**Deliverables:**
- Stage 1-4: Auto-populate from Matches
- Stage 5-6: Trigger cold email campaigns
- Stage 10: Contract PDF generator
- Stage 11-13: Production/logistics webhooks
- Email notifications on stage change

**Tasks:** See PRD Phase 8B (tasks 8B.1 - 8B.5)

---

## Open Questions

1. **Contract templates:** Do we need multiple contract templates (FOB, CIF, etc.) or one generic?
2. **Payment tracking:** Integrate with payment processor or manual status updates?
3. **Multi-party deals:** How to handle deals with multiple buyers/suppliers?
4. **Deal cancellation:** Can users cancel deals? What happens to related matches?

**Resolution:** Defer to Phase 8A task spec creation.

---

## References

- **Source Data:** `/Users/surajsatyarthi/Desktop/table.csv`
- **PRD:** `bmn-site/docs/PRD_V2_EXPORT_DONE_FOR_YOU.md` (Section 17, Phase 8)
- **Ledger:** `docs/governance/project_ledger.md` (Phase 8 section)
- **Architecture Analysis:** This document created 2026-02-07 by AI PM (Claude)

