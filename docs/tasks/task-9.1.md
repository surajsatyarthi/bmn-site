# Task 9.1 — Multi-Stakeholder Expansion: Schema & Onboarding

**Block:** 9.1
**Status:** TODO
**Prerequisites:** Phase 8 COMPLETE
**PRD Reference:** Section 2 (Personas), Section 4.2 (Onboarding Step 1), Section 5.1 (Schema), Section 17 Phase 9

---

## Objective

Expand BMN's platform to support **4 additional stakeholder types** beyond exporters and importers:
1. **Chamber of Commerce** — Trade certification bodies
2. **Insurance Providers** — Cargo/marine insurance
3. **Customs Brokers** — Trade compliance services
4. **Freight Forwarders** — Logistics providers

This block lays the foundation for Phase 9's multi-stakeholder ecosystem by updating the database schema and onboarding flow to accommodate service provider roles.

---

## Deliverable 1: Schema — Expand `trade_role` Enum

### Update: `src/lib/db/schema.ts`

Modify the `profiles` table's `tradeRole` field:

**Current:**
```typescript
tradeRole: text('trade_role', { 
  enum: ['exporter', 'importer', 'both'] 
}).notNull(),
```

**Updated:**
```typescript
tradeRole: text('trade_role', { 
  enum: [
    'exporter', 
    'importer', 
    'both',
    'chamber_of_commerce',
    'insurance_provider',
    'customs_broker',
    'freight_forwarder'
  ] 
}).notNull(),
```

### Create: `supabase/migrations/007_expand_trade_roles.sql`

```sql
-- Add new trade role enum values for service providers
-- Note: PostgreSQL ENUM ALTER requires adding values one at a time

ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'chamber_of_commerce';
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'insurance_provider';
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'customs_broker';
ALTER TYPE trade_role ADD VALUE IF NOT EXISTS 'freight_forwarder';

-- No data migration needed — existing users remain as exporter/importer/both
-- New signups can select any of the 7 roles
```

**Migration verification:**
```sql
-- Test query to verify enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'trade_role'::regtype 
ORDER BY enumsortorder;

-- Expected output: 7 rows (exporter, importer, both, chamber_of_commerce, insurance_provider, customs_broker, freight_forwarder)
```

---

## Deliverable 2: Onboarding — Update Step 1 UI

### Update: `src/app/(dashboard)/onboarding/page.tsx`

Modify the **Step 1: Trade Role** selection to group roles into two categories:

**UI Structure:**

```tsx
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-semibold mb-3">Core Trade Roles</h3>
    <div className="space-y-2">
      {/* Exporter */}
      {/* Importer */}
      {/* Both */}
    </div>
  </div>

  <div className="border-t pt-6">
    <h3 className="text-lg font-semibold mb-3">Service Provider Roles</h3>
    <p className="text-sm text-gray-600 mb-3">
      Select if you provide trade-related services to exporters and importers
    </p>
    <div className="space-y-2">
      {/* Chamber of Commerce */}
      {/* Insurance Provider */}
      {/* Customs Broker */}
      {/* Freight Forwarder */}
    </div>
  </div>
</div>
```

**Radio button labels:**

| Value | Label | Description |
|-------|-------|-------------|
| `exporter` | I Export goods | I sell to international buyers |
| `importer` | I Import goods | I buy from international sellers |
| `both` | Both — I export and import | Dual-role trader |
| `chamber_of_commerce` | Chamber of Commerce | Trade certification and verification |
| `insurance_provider` | Insurance Provider | Cargo/marine insurance |
| `customs_broker` | Customs Broker | Trade compliance services |
| `freight_forwarder` | Freight Forwarder | Logistics and shipping |

**Form validation:** Use Zod schema with updated enum values.

---

## Deliverable 3: Validation Schemas

### Update: `src/lib/validations/onboarding.ts`

Update the `step1Schema`:

```typescript
export const step1Schema = z.object({
  tradeRole: z.enum([
    'exporter',
    'importer',
    'both',
    'chamber_of_commerce',
    'insurance_provider',
    'customs_broker',
    'freight_forwarder'
  ], {
    required_error: "Please select your role",
  }),
});
```

---

## Deliverable 4: Type Definitions

### Update: `src/types/profile.ts` (or equivalent)

Update the `TradeRole` type:

```typescript
export type TradeRole = 
  | 'exporter' 
  | 'importer' 
  | 'both'
  | 'chamber_of_commerce'
  | 'insurance_provider'
  | 'customs_broker'
  | 'freight_forwarder';
```

---

## Deliverable 5: Display Labels Helper

### Create: `src/lib/utils/trade-roles.ts`

Helper function to map role values to user-friendly labels:

```typescript
export const tradeRoleLabels: Record<TradeRole, string> = {
  exporter: 'Exporter',
  importer: 'Importer',
  both: 'Exporter & Importer',
  chamber_of_commerce: 'Chamber of Commerce',
  insurance_provider: 'Insurance Provider',
  customs_broker: 'Customs Broker',
  freight_forwarder: 'Freight Forwarder',
};

export const tradeRoleDescriptions: Record<TradeRole, string> = {
  exporter: 'I sell to international buyers',
  importer: 'I buy from international sellers',
  both: 'Dual-role trader',
  chamber_of_commerce: 'Trade certification and verification',
  insurance_provider: 'Cargo/marine insurance',
  customs_broker: 'Trade compliance services',
  freight_forwarder: 'Logistics and shipping',
};

export function getTradeRoleLabel(role: TradeRole): string {
  return tradeRoleLabels[role] || role;
}

export function getTradeRoleDescription(role: TradeRole): string {
  return tradeRoleDescriptions[role] || '';
}
```

---

## Evidence Required (submit with delivery)

Save all to `docs/evidence/block-9.1/`:

| Evidence | File |
|----------|------|
| Gate output (build + lint + ralph + test) | `gates.txt` |
| Pre-submission checklist | `pre-submission-gate.txt` |
| Self-audit checklist | `self-audit.txt` |
| Migration output | `migration-007-output.txt` |
| SQL verification query result | `enum-verification.txt` |
| Onboarding Step 1 screenshot (7 roles visible) | `screenshot-onboarding-step1.png` |
| Profile with new role (Chamber of Commerce) | `screenshot-profile-chamber.png` |
| Profile with new role (Insurance Provider) | `screenshot-profile-insurance.png` |
| Profile with new role (Customs Broker) | `screenshot-profile-customs.png` |
| Profile with new role (Freight Forwarder) | `screenshot-profile-freight.png` |

**No evidence, no PASS.**

---

## Constraints

- **No breaking changes** — existing users with `exporter`/`importer`/`both` roles must continue to work
- **No new npm dependencies**
- **Preserve existing onboarding flow logic** — only update Step 1 UI
- **Follow DoD v2.0** — error.tsx, loading.tsx, aria-labels, mobile responsive
- **Grouped radio buttons** — Core vs Service Provider sections with visual separation
- **Database migration must be reversible** — use `IF NOT EXISTS` to allow re-runs

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # New/modified files: 0 errors, 0 warnings
npm run ralph:scan     # Must pass
npm run test           # All existing tests must pass
```

All four gates must pass. Zero errors, zero warnings on all new/modified files.

---

## Notes for Antigravity

**Context:** This is Phase 9's foundation work. Subsequent blocks (9.2-9.9) will add:
- Service provider-specific dashboard modules (e.g., "Active Shipments" for freight forwarders)
- Stakeholder-to-stakeholder matching (e.g., match exporter to customs broker in same region)
- Service provider profile fields (custom fields per role type)
- API endpoints for service discovery

**For this block:** Focus ONLY on schema + onboarding Step 1. Do NOT implement role-specific dashboards or matching logic yet.

**UI/UX note:** The grouped layout (Core vs Service Provider) helps users self-identify their category before selecting a specific role. Add a subtle border or background color to visually separate the two groups.

**Testing note:** Create test users for all 4 new roles and verify onboarding completion works for each. Screenshots must show distinct role selection for each service provider type.

---

**Status:** TODO — Awaiting Phase 8 completion  
**Assigned to:** Antigravity  
**Estimated effort:** 1 block (schema + onboarding update)

Update `docs/governance/project_ledger.md` under Block 9.1. Mark as **`SUBMITTED`** when ready for audit.
