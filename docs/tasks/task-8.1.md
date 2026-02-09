# Task 8.1 — Deal Flow Pipeline UI (13-Step Process)

**Block:** 8.1 (Phase 8A)
**Status:** TODO
**Prerequisites:** Phase 7 COMPLETE (Email Integration), Block 5.4 COMPLETE (Admin Dashboard)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Implement deal pipeline tracking UI for 13-step export deal process with USER ACTION visibility and Kanban board interface.

---

## 13-Step Export Deal Process

| Step | Description | Owner | Kanban Stage |
|:-----|:------------|:------|:-------------|
| 1 | Finalize Product and Target Country | Backend AI | Lead Gen |
| 2 | Conduct Compliance Check | Backend AI | Lead Gen |
| 3 | Find Leads from Databases | Backend AI | Lead Gen |
| 4 | Build a Prospect List | Backend AI | Lead Gen |
| 5 | Send Initial Emails or Inquiries | Backend AI | Outreach |
| 6 | Set Up Meetings | Backend AI | Outreach |
| **7** | **Conduct Discussions** | **USER ACTION** | **Discussion** |
| **8** | **Agree on Price and Terms** | **USER ACTION** | **Negotiation** |
| **9** | **Send Samples** | **USER ACTION** | **Negotiation** |
| 10 | Finalize Contract | Backend AI | Contract |
| 11 | Arrange Production and Quality Control | Backend AI | Fulfillment |
| 12 | Handle Logistics and Shipping | Backend AI | Fulfillment |
| 13 | Manage Payment and Follow-Up | Backend AI | Fulfillment |

**USER ACTION steps (7-9):** Platform shows "🔴 Action Required" banner with clear instructions.

---

## Deliverable 1: Database Schema

```sql
CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  match_id uuid REFERENCES matches(id),
  title text NOT NULL,
  stage text NOT NULL CHECK (stage IN ('lead_gen', 'outreach', 'discussion', 'negotiation', 'contract', 'fulfillment')),
  current_step int NOT NULL CHECK (current_step BETWEEN 1 AND 13),
  user_action_required boolean DEFAULT false,
  
  -- Step data (JSONB for flexibility)
  step_data jsonb DEFAULT '{}'::jsonb,
  -- Example: {"step_7": {"meeting_date": "2026-03-15", "notes": "..."}, "step_8": {"price": 50000, "terms": "..."}}
  
  -- Metadata
  status text DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'won', 'lost')),
  value numeric, -- Deal value in USD
  probability int CHECK (probability BETWEEN 0 AND 100), -- Close probability %
  expected_close_date date,
  
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_deals_profile_id ON deals(profile_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_status ON deals(status);
```

---

## Deliverable 2: Deals Kanban Board

**Route:** `/deals`

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│ Deals Pipeline                    [+ New Deal] [Filter ▼]    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │Lead  │ │Out-  │ │Disc- │ │Negot-│ │Cont- │ │Fulfil│      │
│ │Gen   │ │reach │ │ussion│ │iation│ │ract  │ │lment │      │
│ │(2)   │ │(3)   │ │(1)🔴 │ │(0)   │ │(1)   │ │(2)   │      │
│ ├──────┤ ├──────┤ ├──────┤ ├──────┤ ├──────┤ ├──────┤      │
│ │Card 1│ │Card 1│ │🔴Card│ │      │ │Card 1│ │Card 1│      │
│ │Card 2│ │Card 2│ │      │ │      │ │      │ │Card 2│      │
│ │      │ │Card 3│ │      │ │      │ │      │ │      │      │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop between stages (updates `stage` + `current_step`)
- 🔴 Red indicator for USER ACTION required
- Card shows: Deal title, company, value, probability
- Click card → navigate to `/deals/[id]`

**Tech:** React DnD or dnd-kit library

---

## Deliverable 3: Deal Detail Page

**Route:** `/deals/[id]`

**Sections:**

**1. Header:**
- Deal title, value, probability, expected close date
- Stage indicator (progress bar showing 6 stages)
- Actions: Edit, Mark as Won/Lost, Delete

**2. Vertical Timeline (13 Steps):**
```
✅ Step 1: Finalize Product & Country (Completed 2026-02-01)
✅ Step 2: Compliance Check (Completed 2026-02-02)
✅ Step 3: Find Leads (Completed 2026-02-05)
✅ Step 4: Build Prospect List (Completed 2026-02-06)
✅ Step 5: Send Initial Emails (Completed 2026-02-08)
✅ Step 6: Set Up Meetings (Completed 2026-02-10)
🔴 Step 7: Conduct Discussions (ACTION REQUIRED)
    └─ Form: Meeting date, notes, outcome
⏸️ Step 8: Agree on Price & Terms (Pending)
⏸️ Step 9: Send Samples (Pending)
⏸️ Step 10: Finalize Contract (Pending)
⏸️ Step 11: Production & QC (Pending)
⏸️ Step 12: Logistics & Shipping (Pending)
⏸️ Step 13: Payment & Follow-Up (Pending)
```

**Status icons:**
- ✅ Completed (green)
- 🔴 Action Required (red pulse animation)
- ⏸️ Pending (gray)

**3. USER ACTION Forms (Steps 7-9):**

**Step 7 Form:**
- Meeting date picker
- Discussion notes (textarea)
- Outcome: Continue / On Hold / Lost
- "Mark Complete" button

**Step 8 Form:**
- Agreed price (number input)
- Payment terms (dropdown: 30 days, 60 days, LC, etc.)
- Delivery terms (Incoterms: FOB, CIF, etc.)
- Notes
- "Mark Complete" button

**Step 9 Form:**
- Sample shipment tracking number
- Courier (dropdown: DHL, FedEx, etc.)
- Shipment date
- Expected delivery
- "Mark Complete" button

---

## Deliverable 4: Dashboard Integration

**Route:** `/dashboard`

**Add "Active Deals" stat card:**
```
┌──────────────┐
│ Active Deals │
│      5       │
└──────────────┘
```

**Add "Action Required" alert banner:**
```
🔴 3 deals need your attention! [View Deals →]
```

**Recent Deals section:**
- Show 3 most recent deals
- Link to `/deals`

---

## Deliverable 5: Match → Deal Conversion

**Route:** `/matches/[id]`

**Add "Start Deal" button:**
- Only available for revealed matches
- Creates deal record:
  - `match_id` = current match
  - `title` = "Deal with {counterparty_name}"
  - `stage` = 'lead_gen'
  - `current_step` = 1
  - Auto-populate steps 1-6 (AI/backend work)

**API Route:**
```typescript
// POST /api/deals
// Body: { matchId, title?, value?, expectedCloseDate? }
// Returns: { dealId, stage: 'lead_gen' }
```

---

## Deliverable 6: Admin View

**Route:** `/admin/deals`

**Table columns:**
- User (profile name)
- Deal title
- Stage
- Current step
- Value
- Probability
- Status (Active/On Hold/Won/Lost)
- Created date

**Filters:** Stage, Status, User
**Actions:** View detail, Edit, Delete

---

## Constraints

- Deal can only move forward (cannot go backwards without admin override)
- USER ACTION steps (7-9) must be completed manually (cannot auto-advance)
- Stage progression tied to step number:
  - Steps 1-4: lead_gen
  - Steps 5-6: outreach
  - Step 7: discussion
  - Steps 8-9: negotiation
  - Step 10: contract
  - Steps 11-13: fulfillment
- Mobile responsive (375px)
- Kanban drag-drop disabled on mobile (use buttons)

---

## Evidence Required

Save to `docs/evidence/block-8.1/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Kanban board | `deals-kanban.png` |
| Deal detail (step 7 form) | `deal-detail-step7.png` |
| Deal detail (timeline) | `deal-detail-timeline.png` |
| Dashboard deals section | `dashboard-deals.png` |
| Action required banner | `dashboard-action-required.png` |
| Match → Deal conversion | `match-start-deal.png` |
| Admin deals table | `admin-deals.png` |
| Mobile kanban | `mobile-deals-kanban.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Create deal from match → verify appears in Kanban
2. Drag deal to next stage → verify updates
3. Complete Step 7 form → verify step marked complete, advances to Step 8
4. Dashboard → verify "Action Required" banner shows
5. Admin → verify can view all deals

Update `docs/governance/project_ledger.md` under Block 8.1. Mark as **SUBMITTED**.
