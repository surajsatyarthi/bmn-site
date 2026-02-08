# Phase 9 Documentation Update — Multi-Stakeholder Expansion

**Date:** 2026-02-08  
**Updated By:** AI PM (Claude)  
**Approved By:** User (Suraj)  
**Status:** COMPLETE

---

## Summary

Updated all BMN v2 documentation to support **Phase 9: Multi-Stakeholder Ecosystem**, adding 4 new user types beyond exporters/importers:

1. **Chamber of Commerce** — Trade certification bodies
2. **Insurance Provider** — Cargo/marine insurance
3. **Customs Broker** — Trade compliance services
4. **Freight Forwarder** — Logistics providers

---

## Files Updated

### 1. PRD (`bmn-site/docs/PRD_V2_EXPORT_DONE_FOR_YOU.md`)

**Section 2: Target Users** (Lines 50-77)
- ✅ Added 4 new persona definitions (Quaternary, Quinary, Senary, Septenary)
- Each persona includes: role description, pain points, current workarounds, BMN value proposition

**Section 4.2: Onboarding Step 1** (Lines 129-144)
- ✅ Updated UI mockup to show grouped role selection:
  - "Core Trade Roles" (exporter, importer, both)
  - "Service Provider Roles" (4 new types)
- ✅ Updated data capture specification to reflect 7 enum values

**Section 5.1: Database Schema - profiles table** (Line 529)
- ✅ Expanded `trade_role` enum from 3 to 7 values:
  ```
  'exporter' | 'importer' | 'both' | 'chamber_of_commerce' | 'insurance_provider' | 'customs_broker' | 'freight_forwarder'
  ```

**Section 17: Future Phases** (After line 1164)
- ✅ Added **Phase 9: Multi-Stakeholder Ecosystem** specification
  - Goal, rationale, business impact
  - 9 task breakdown (9.1 through 9.9)
  - Prerequisites: Phase 6, 7, 8 complete
  - Evidence requirements

**Section 18: Updated Phase Summary** (Line 1219)
- ✅ Added Phase 9 to phase summary table with status "Future"

---

### 2. Task Specification (`docs/tasks/task-9.1.md`)

**Created:** New task file for Block 9.1  
**Scope:** Schema expansion + onboarding Step 1 update  
**Deliverables:**
1. Schema update (`src/lib/db/schema.ts`)
2. Migration SQL (`007_expand_trade_roles.sql`)
3. Onboarding UI update (Step 1 with 7 roles)
4. Validation schema updates
5. Type definitions
6. Helper utilities (role labels/descriptions)

**Evidence Required:** 10 files
- gates.txt, pre-submission-gate.txt, self-audit.txt
- migration-007-output.txt, enum-verification.txt
- 5 screenshots (onboarding + 4 service provider profiles)

**Constraints:**
- No breaking changes for existing users
- DoD v2.0 compliance (4 gates)
- Grouped UI layout (visual separation)
- Reversible migration

---

### 3. Project Ledger (`docs/governance/project_ledger.md`)

**Added Phase 9 Section** (Appended after Phase 8)
- ✅ Objective, prerequisites, PRD references
- ✅ Business impact summary
- ✅ Block 9.1 specification
- ✅ Placeholder for Blocks 9.2-9.9

**Updated PHASE ROADMAP Table** (Line 670)
- ✅ Added Phase 9 row: "Multi-Stakeholder Ecosystem (Service Providers) | PLANNED | Phase 6, 7, 8"

---

## Database Schema Changes

### Current Enum (3 values)
```sql
CREATE TYPE trade_role AS ENUM ('exporter', 'importer', 'both');
```

### Updated Enum (7 values)
```sql
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'chamber_of_commerce';
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'insurance_provider';
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'customs_broker';
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'freight_forwarder';
```

**Migration File:** `supabase/migrations/007_expand_trade_roles.sql`

---

## Onboarding Flow Changes

### Before (Step 1)
```
"What do you do?"
[ ] I Export goods
[ ] I Import goods
[ ] Both
```

### After (Step 1)
```
"What best describes you?"

Core Trade Roles:
[ ] I Export goods (I sell to international buyers)
[ ] I Import goods (I buy from international sellers)
[ ] Both — I export and import

Service Provider Roles:
[ ] Chamber of Commerce (Trade certification and verification)
[ ] Insurance Provider (Cargo/marine insurance)
[ ] Customs Broker (Trade compliance services)
[ ] Freight Forwarder (Logistics and shipping)
```

---

## Implementation Sequencing

### Phase 9 Task Breakdown

| Block | Focus | Status |
|-------|-------|--------|
| **9.1** | Schema + Onboarding Step 1 | TODO (Spec complete) |
| 9.2 | Service provider-specific dashboard modules | Pending spec |
| 9.3 | Stakeholder-to-stakeholder matching engine | Pending spec |
| 9.4 | Service provider profile fields (custom per role) | Pending spec |
| 9.5 | API: `/api/stakeholders` endpoints | Pending spec |
| 9.6 | Email: Service provider intro campaigns | Pending spec |
| 9.7 | Admin: Stakeholder verification workflow | Pending spec |
| 9.8 | Pricing: Service provider tiers | Pending spec |
| 9.9 | Analytics & reporting for service providers | Pending spec |

**Dependencies:** Blocks 9.2-9.9 require Phase 6 (Admin), Phase 7 (Email), Phase 8 (Deal Flow) to be complete before spec writing begins.

---

## Business Rationale

### Why Multi-Stakeholder Expansion?

1. **Revenue Diversification**
   - Service provider subscriptions (monthly/annual)
   - Referral fees (when exporters use platform-recommended services)
   - Higher ARPU through value-added services

2. **Network Effects**
   - More stakeholders → more platform activity → higher retention
   - Service providers bring their own networks (e.g., chambers bring member exporters)
   - Cross-selling opportunities (freight forwarder + insurance bundling)

3. **Deal Completion Rate**
   - Integrated services reduce friction in closing deals
   - One-stop-shop for all trade transaction needs
   - Faster time-to-shipment when services are pre-vetted and connected

4. **Data Flywheel**
   - Service provider activity generates richer trade intelligence
   - Insurance claims data → risk scoring for buyers/sellers
   - Freight forwarder shipment data → better trade volume forecasting
   - Chamber certifications → trust signals for matching algorithm

---

## Next Steps for Antigravity

1. **Read Task Spec:** `docs/tasks/task-9.1.md` in full before starting
2. **Prerequisites Check:** Confirm Phase 8 is COMPLETE before beginning Block 9.1
3. **Migration First:** Run `007_expand_trade_roles.sql` on dev database, verify enum expansion
4. **Schema Update:** Update Drizzle schema in `src/lib/db/schema.ts`
5. **Onboarding UI:** Implement grouped layout in `/onboarding` Step 1
6. **Validation:** Update Zod schemas and TypeScript types
7. **Testing:** Create test users for all 4 new roles, verify onboarding completion
8. **Evidence Collection:** Follow DoD v2.0 checklist, submit 10 evidence files
9. **Submit:** Mark Block 9.1 as SUBMITTED in ledger, notify PM for audit

---

## Quality Gates (DoD v2.0)

Block 9.1 must pass all 4 gates:
1. ✅ **Build:** `npm run build` (0 errors)
2. ✅ **Lint:** `npm run lint` (0 errors, 0 warnings on new/modified files)
3. ✅ **Ralph:** `npm run ralph:scan` (PASS, no new violations)
4. ✅ **Test:** `npm run test` (all existing tests pass)

---

## Documentation Integrity

All changes reviewed and approved:
- [x] PRD Section 2 (4 new personas) — COMPLETE
- [x] PRD Section 4.2 (onboarding Step 1 UI) — COMPLETE
- [x] PRD Section 5.1 (schema enum expansion) — COMPLETE
- [x] PRD Section 17 (Phase 9 specification) — COMPLETE
- [x] PRD Section 18 (phase summary table) — COMPLETE
- [x] Task spec created (`task-9.1.md`) — COMPLETE
- [x] Ledger updated (Phase 9 + roadmap) — COMPLETE

**Status:** All documentation updates COMPLETE. Ready for handoff to Antigravity when Phase 8 clears.

---

**Signed:**  
AI PM (Claude) — 2026-02-08  
User (Suraj) — Approved via explicit instruction ("you are the pm so doc updation is on you")
