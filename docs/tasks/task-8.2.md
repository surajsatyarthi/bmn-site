# Task 8.2 — Deal Automation Hooks

**Block:** 8.2 (Phase 8B)
**Status:** TODO
**Prerequisites:** Block 8.1 COMPLETE (Deal Pipeline UI), Phase 7 COMPLETE (Email Integration)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Automate backend AI stages (Steps 1-6, 10-13) with triggers and workflows, reducing manual ops work for deal pipeline.

---

## Deliverable 1: Auto-Populate Steps 1-4 (Lead Gen Stage)

**Trigger:** Deal created via "Start Deal" button from `/matches/[id]`

**Automation:**
```typescript
// When POST /api/deals creates deal from match:

1. Step 1: Auto-populate from match.matchedProducts
   step_data.step_1 = {
     products: match.matchedProducts,
     target_country: match.counterpartyCountry,
     completed_at: now()
   }

2. Step 2: Auto-check compliance
   step_data.step_2 = {
     required_certs: getRequiredCerts(country, products),
     user_has_certs: profile.certifications,
     compliance_status: userHasAllCerts ? 'pass' : 'pending',
     completed_at: now()
   }

3. Step 3: Reference match source
   step_data.step_3 = {
     lead_source: 'BMN Matches',
     lead_id: match.id,
     counterparty: match.counterpartyName,
     completed_at: now()
   }

4. Step 4: Create prospect list
   step_data.step_4 = {
     prospects: [{ name: match.counterpartyName, country: match.counterpartyCountry }],
     list_size: 1,
     completed_at: now()
   }

// Advance deal to Step 5 (outreach stage)
deal.current_step = 5
deal.stage = 'outreach'
```

---

## Deliverable 2: Trigger Cold Email Campaigns (Steps 5-6)

**Requires:** Phase 7 Email Integration (Manyreach/Resend)

**Step 5: Send Initial Emails**

**Trigger:** Deal reaches Step 5

**Automation:**
```typescript
// POST /api/deals/[id]/send-intro-email

// 1. Get match contact info (must be revealed)
const contact = match.counterpartyContact

// 2. Create email campaign (reuse campaign system)
const campaign = await createCampaign({
  profileId: deal.profile_id,
  name: `Intro - ${deal.title}`,
  targets: [contact.email],
  template: 'intro_email',
  variables: {
    userName: profile.fullName,
    companyName: profile.company.name,
    productCategory: deal.step_data.step_1.products[0].name,
    targetCountry: deal.step_data.step_1.target_country
  }
})

// 3. Mark step complete when email sent
deal.step_data.step_5 = {
  campaign_id: campaign.id,
  email_sent_at: now(),
  completed_at: now()
}
deal.current_step = 6
```

**Step 6: Set Up Meetings**

**Trigger:** Campaign receives reply (webhook from email provider)

**Automation:**
```typescript
// Webhook: POST /api/webhooks/email-reply

// 1. Check if reply is positive (basic keyword matching)
const isPositive = checkPositiveKeywords(reply.body) // "interested", "yes", "meeting"

// 2. If positive, advance to Step 6
if (isPositive) {
  deal.step_data.step_6 = {
    reply_received_at: now(),
    reply_body: reply.body,
    next_action: 'Schedule meeting via Step 7 form',
    completed_at: now()
  }
  deal.current_step = 7
  deal.stage = 'discussion'
  deal.user_action_required = true
  
  // Send notification to user
  await sendNotification(profile, 'deal_action_required', { dealId: deal.id })
}
```

---

## Deliverable 3: Contract Generation (Step 10)

**Trigger:** User completes Step 9 (Send Samples)

**Automation:**
```typescript
// POST /api/deals/[id]/generate-contract

// 1. Get template (PDF with merge fields)
const template = getContractTemplate('export_contract_v1')

// 2. Merge data from steps 8-9
const contractData = {
  seller: profile.company.name,
  buyer: match.counterpartyName,
  product: deal.step_data.step_1.products[0].name,
  price: deal.step_data.step_8.agreed_price,
  payment_terms: deal.step_data.step_8.payment_terms,
  delivery_terms: deal.step_data.step_8.delivery_terms,
  date: now()
}

// 3. Generate PDF
const contractPdf = await mergePdfTemplate(template, contractData)

// 4. Upload to Supabase Storage
const contractUrl = await uploadContract(deal.id, contractPdf)

// 5. Mark step complete
deal.step_data.step_10 = {
  contract_url: contractUrl,
  generated_at: now(),
  status: 'awaiting_signature',
  completed_at: now()
}
deal.current_step = 11
deal.stage = 'fulfillment'
```

**PDF Template Library:** Use `pdf-lib` or `pdfmake`

---

## Deliverable 4: Production & Logistics Workflow (Steps 11-12)

**Step 11: Production & QC**

**Manual for Phase 8:** Admin marks complete via dashboard

**Future automation (Phase 9):**
- Integration with inventory/production system
- QC checklist workflow

**Step 12: Logistics & Shipping**

**Manual for Phase 8:** Admin updates tracking info

**Future automation (Phase 9):**
- Integration with freight forwarder APIs (DHL, FedEx)
- Auto-update tracking from courier

**For Phase 8, provide:**
- Admin form to manually update steps 11-12
- Route: `/admin/deals/[id]/update-step`
- Fields: Status, notes, attachments

---

## Deliverable 5: Payment & Follow-Up (Step 13)

**Trigger:** Admin marks Step 12 complete (shipment delivered)

**Automation:**
```typescript
// POST /api/deals/[id]/finalize

// 1. Check payment status (manual field)
if (deal.step_data.step_13.payment_received) {
  deal.status = 'won'
  deal.probability = 100
} else {
  // Send payment reminder email
  await sendPaymentReminder(profile, deal)
}

// 2. Schedule follow-up (30 days after delivery)
await scheduleFollowUp({
  dealId: deal.id,
  dueDate: addDays(deal.step_data.step_12.delivery_date, 30),
  type: 'post_delivery_check'
})

// 3. Mark deal complete
deal.step_data.step_13 = {
  payment_received: true,
  payment_date: now(),
  follow_up_scheduled: true,
  completed_at: now()
}
deal.current_step = 13
```

---

## Deliverable 6: Email Notifications on Stage Change

**Events to notify user:**
1. Deal created → "New deal started"
2. Step 7 ready → "Action required: Schedule meeting"
3. Step 8 ready → "Action required: Agree on terms"
4. Step 9 ready → "Action required: Send samples"
5. Contract generated → "Contract ready for review"
6. Payment reminder → "Payment pending"

**Integration:** Reuse email system from Block 5.3 (Email Notifications)

**Template:** `deal_notification.tsx`

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/deals/[id]/send-intro-email` | POST | Trigger Step 5 automation |
| `/api/deals/[id]/generate-contract` | POST | Trigger Step 10 automation |
| `/api/deals/[id]/finalize` | POST | Trigger Step 13 automation |
| `/api/webhooks/email-reply` | POST | Email provider webhook (Step 6) |
| `/api/admin/deals/[id]/update-step` | PATCH | Admin manual step update |

---

## Constraints

- Automation only for Backend AI steps (1-6, 10-13)
- USER ACTION steps (7-9) NEVER automated
- All automated actions logged to `admin_activity_log`
- Email provider webhook requires signature validation
- Contract generation requires all Step 8 fields complete
- Steps cannot be skipped (must complete in sequence)

---

## Evidence Required

Save to `docs/evidence/block-8.2/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Auto-populated deal | `deal-auto-populated-steps.png` |
| Intro email sent | `email-intro-sent.png` |
| Webhook payload | `webhook-email-reply.txt` |
| Generated contract | `contract-generated-sample.pdf` |
| Email notification | `email-deal-notification.png` |
| Admin step update | `admin-update-step.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Create deal from match → verify Steps 1-4 auto-populated
2. Trigger intro email → verify Step 5 marked complete
3. Simulate email reply webhook → verify advances to Step 7
4. Complete Steps 7-9 → trigger contract generation → verify PDF created
5. Admin update Steps 11-12 → verify updates
6. Finalize deal → verify Step 13 marked, status = 'won'

Update `docs/governance/project_ledger.md` under Block 8.2. Mark as **SUBMITTED**.
