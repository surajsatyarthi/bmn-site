# Task 1.14 — Profile Edit + Missing Fields + Matchmaking Data

**Block:** 1.14
**Status:** TODO
**Prerequisites:** Phase 1 COMPLETE, Block 4.0 PASSED
**Standing Orders:** DoD v2.0 applies (4 gates)
**Priority:** P0 (BLOCKS REVENUE - users can't update info or complete profile)

---

## Objective

Fix critical profile gaps identified via competitor analysis (Alibaba, IndiaMART, Made-in-China):
1. Enable profile editing (currently disabled)
2. Collect missing basic fields (address, phone, business type)
3. Add matchmaking data (MOQ, payment terms, incoterms, lead time)

**Why Critical:** Users complete onboarding but can't fix mistakes, add contact info, or specify trade terms. This blocks effective buyer-seller matching.

---

## Deliverable 1: Enable Profile Editing

### Fix: Remove disabled state from Edit Profile button

**File:** `src/app/(dashboard)/profile/page.tsx`

**Current State (Line 58-63):**
```tsx
<button 
  disabled 
  className="... cursor-not-allowed opacity-50"
>
  Edit Profile
</button>
```

**Required Change:**
```tsx
<Link 
  href="/profile/edit"
  className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg"
>
  <Edit className="h-4 w-4" />
  Edit Profile
</Link>
```

---

## Deliverable 2: Profile Edit Page

### Create: `/profile/edit` route

**File:** `src/app/(dashboard)/profile/edit/page.tsx`

**Features:**
- Multi-section form (tabs or accordion for better UX)
- Pre-populated with existing data
- Client-side validation (Zod)
- Optimistic UI updates
- Mobile responsive

**Sections:**
1. Basic Info (name, email, phone)
2. Company Details (name, type, address, logo)
3. Trade Info (role, products, markets, certifications)
4. Business Terms (MOQ, payment terms, incoterms, lead time)

**API Route:** `src/app/api/profile/update/route.ts`
- PATCH endpoint
- Auth required
- Validate user owns profile
- Update profiles + companies + products + tradeInterests + certifications tables
- Return updated profile

---

## Deliverable 3: Missing Basic Fields (P0)

### Update: Onboarding Step 4 (Business Details)

**File:** `src/components/onboarding/BusinessDetailsStep.tsx`

**Add Fields:**

```tsx
// Phone (REQUIRED - already in schema)
<div>
  <label>Phone Number *</label>
  <input 
    type="tel"
    placeholder="+91 98765 43210"
    {...register('phone')}
  />
</div>

// WhatsApp (OPTIONAL - already in schema)
<div>
  <label>WhatsApp Number (Optional)</label>
  <input 
    type="tel"
    placeholder="Same as phone if not provided"
    {...register('whatsapp')}
  />
</div>

// Business Type (REQUIRED - NEW)
<div>
  <label>Business Type *</label>
  <select {...register('businessType')}>
    <option value="">Select type</option>
    <option value="manufacturer">Manufacturer</option>
    <option value="trader">Trading Company</option>
    <option value="both">Manufacturer & Trader</option>
    <option value="agent">Agent/Broker</option>
  </select>
</div>

// Address Section
<div>
  <label>City *</label>
  <input {...register('city')} placeholder="Mumbai" />
</div>

<div>
  <label>State/Province *</label>
  <input {...register('state')} placeholder="Maharashtra" />
</div>

<div>
  <label>Country *</label>
  <select {...register('country')}>
    {/* Load from countries.json */}
  </select>
</div>

<div>
  <label>PIN/ZIP Code (Optional)</label>
  <input {...register('postalCode')} placeholder="400001" />
</div>

// Employee Count (NEW - credibility signal)
<div>
  <label>Company Size *</label>
  <select {...register('employeeCount')}>
    <option value="">Select range</option>
    <option value="1-10">1-10 employees</option>
    <option value="11-50">11-50 employees</option>
    <option value="51-200">51-200 employees</option>
    <option value="201-500">201-500 employees</option>
    <option value="500+">500+ employees</option>
  </select>
</div>

// Company Description (NEW)
<div>
  <label>Company Description (Optional)</label>
  <textarea 
    {...register('description')}
    maxLength={500}
    rows={4}
    placeholder="Tell buyers about your company, capabilities, and experience..."
  />
  <p className="text-xs text-gray-500">{watch('description')?.length || 0}/500 characters</p>
</div>
```

**Schema Updates Needed:**

`src/lib/db/schema.ts` - Add to companies table:
```typescript
businessType: text('business_type', { 
  enum: ['manufacturer', 'trader', 'both', 'agent'] 
}).notNull(),
postalCode: text('postal_code'),
employeeCount: text('employee_count'), // e.g. "11-50"
description: text('description'),
```

---

## Deliverable 4: Matchmaking Data Fields (P0)

### Why Needed:
Without trade terms, matching algorithm can't verify:
- Can supplier meet buyer's order size? (MOQ check)
- Do payment terms align? (L/C required vs. Open Account offered)
- Who pays shipping? (FOB vs. CIF)
- Can supplier deliver on time? (Lead time)

### Add New Section: Trade Terms (Step 5.5 in Onboarding)

**Insert AFTER Certifications, BEFORE Review**

**File:** `src/components/onboarding/TradeTermsStep.tsx` (NEW)

```tsx
const tradeTermsSchema = z.object({
  moq: z.string().optional(), // e.g. "100 units", "1 container"
  moqValue: z.number().optional(), // Numeric value for filtering
  moqUnit: z.string().optional(), // "units", "kg", "containers"
  
  paymentTerms: z.array(z.string()).min(1), // Multiple selection
  // Options: cash_advance, lc, open_30, open_60, open_90
  
  incoterms: z.array(z.string()).min(1), // Multiple selection
  // Options: FOB, CIF, EXW, FCA, DAP, DDP
  
  leadTime: z.string().optional(), // e.g. "15-30 days"
  leadTimeMin: z.number().optional(), // For filtering
  leadTimeMax: z.number().optional(),
  
  portOfLoading: z.string().optional(), // e.g. "Mumbai Port"
  
  sampleAvailable: z.boolean().default(false),
  sampleLeadTime: z.string().optional(), // e.g. "3-5 days"
  
  oemOdmAvailable: z.boolean().default(false),
  
  productionCapacity: z.string().optional(), // e.g. "10000 units/month"
  
  annualExportVolume: z.string().optional(), // Range: <$100K, $100K-$500K, $500K-$1M, $1M-$5M, $5M+
});
```

**UI Design:**
```tsx
<div className="space-y-6">
  <h2>Trade Terms</h2>
  <p>Help buyers understand your business requirements</p>

  {/* MOQ */}
  <div>
    <label>Minimum Order Quantity (MOQ)</label>
    <div className="grid grid-cols-2 gap-2">
      <input type="number" placeholder="Value" {...register('moqValue')} />
      <select {...register('moqUnit')}>
        <option value="units">Units</option>
        <option value="kg">Kilograms</option>
        <option value="tons">Tons</option>
        <option value="containers">Containers (20ft)</option>
      </select>
    </div>
  </div>

  {/* Payment Terms (Multi-select checkboxes) */}
  <div>
    <label>Accepted Payment Terms (Select all that apply)</label>
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input type="checkbox" value="cash_advance" {...register('paymentTerms')} />
        Cash in Advance (50% deposit + 50% before shipment)
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="lc" {...register('paymentTerms')} />
        Letter of Credit (L/C)
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="open_30" {...register('paymentTerms')} />
        Open Account 30 days
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="open_60" {...register('paymentTerms')} />
        Open Account 60 days
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="open_90" {...register('paymentTerms')} />
        Open Account 90 days
      </label>
    </div>
  </div>

  {/* Incoterms (Multi-select checkboxes) */}
  <div>
    <label>Supported Incoterms (Select all that apply)</label>
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input type="checkbox" value="FOB" {...register('incoterms')} />
        FOB (Free on Board) - Buyer pays shipping
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="CIF" {...register('incoterms')} />
        CIF (Cost, Insurance, Freight) - Seller pays shipping to port
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="EXW" {...register('incoterms')} />
        EXW (Ex Works) - Buyer arranges pickup
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" value="DDP" {...register('incoterms')} />
        DDP (Delivered Duty Paid) - Seller pays all costs
      </label>
    </div>
  </div>

  {/* Lead Time */}
  <div>
    <label>Production Lead Time (days after order)</label>
    <div className="grid grid-cols-2 gap-2">
      <input type="number" placeholder="Min" {...register('leadTimeMin')} />
      <input type="number" placeholder="Max" {...register('leadTimeMax')} />
    </div>
    <p className="text-xs text-gray-500">Example: 15-30 days</p>
  </div>

  {/* Port of Loading */}
  <div>
    <label>Main Port of Loading (Optional)</label>
    <input placeholder="e.g. Mumbai Port, Nhava Sheva" {...register('portOfLoading')} />
  </div>

  {/* Sample Availability */}
  <div>
    <label className="flex items-center gap-2">
      <input type="checkbox" {...register('sampleAvailable')} />
      Samples available for buyers
    </label>
    {watch('sampleAvailable') && (
      <input 
        className="ml-6 mt-2"
        placeholder="Sample lead time (e.g. 3-5 days)"
        {...register('sampleLeadTime')}
      />
    )}
  </div>

  {/* OEM/ODM */}
  <div>
    <label className="flex items-center gap-2">
      <input type="checkbox" {...register('oemOdmAvailable')} />
      OEM/ODM services available (custom branding/manufacturing)
    </label>
  </div>

  {/* Production Capacity */}
  <div>
    <label>Monthly Production Capacity (Optional)</label>
    <input placeholder="e.g. 10,000 units/month" {...register('productionCapacity')} />
  </div>

  {/* Annual Export Volume */}
  <div>
    <label>Annual Export Volume (Optional)</label>
    <select {...register('annualExportVolume')}>
      <option value="">Prefer not to say</option>
      <option value="<100K">Less than $100K</option>
      <option value="100K-500K">$100K - $500K</option>
      <option value="500K-1M">$500K - $1M</option>
      <option value="1M-5M">$1M - $5M</option>
      <option value="5M+">$5M+</option>
    </select>
  </div>
</div>
```

**Schema Addition:**

New table: `trade_terms`
```typescript
export const tradeTerms = pgTable('trade_terms', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull().unique(),
  
  // MOQ
  moq: text('moq'), // Display text
  moqValue: integer('moq_value'), // For filtering
  moqUnit: text('moq_unit'), // units, kg, tons, containers
  
  // Payment Terms (JSON array)
  paymentTerms: jsonb('payment_terms').$type<string[]>().notNull().default([]),
  
  // Incoterms (JSON array)
  incoterms: jsonb('incoterms').$type<string[]>().notNull().default([]),
  
  // Lead Time
  leadTime: text('lead_time'),
  leadTimeMin: integer('lead_time_min'),
  leadTimeMax: integer('lead_time_max'),
  
  // Port
  portOfLoading: text('port_of_loading'),
  
  // Samples
  sampleAvailable: boolean('sample_available').default(false),
  sampleLeadTime: text('sample_lead_time'),
  
  // Capabilities
  oemOdmAvailable: boolean('oem_odm_available').default(false),
  productionCapacity: text('production_capacity'),
  annualExportVolume: text('annual_export_volume'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Migration:** `006_add_trade_terms.sql`

---

## Deliverable 5: Company Logo Upload (P1)

### Feature: Logo upload to Supabase Storage

**Implementation:**
```tsx
// In profile edit form
<div>
  <label>Company Logo</label>
  <input 
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={handleLogoUpload}
  />
  {logoUrl && <img src={logoUrl} className="h-20 w-20 object-contain" />}
</div>
```

**Storage Setup:**
- Supabase Storage bucket: `company-logos`
- Public access (read-only)
- Max file size: 2MB
- Allowed types: JPEG, PNG, WebP
- File naming: `{profileId}.{ext}`

**Schema Addition:**
```typescript
// In companies table
logoUrl: text('logo_url'),
```

---

## Deliverable 6: Update Onboarding Flow

### Changes to Onboarding Wizard

**Current:** 6 steps
**Updated:** 7 steps (insert Trade Terms before Review)

1. Trade Role (existing)
2. Products (existing)
3. Trade Interests (existing)
4. Business Details (UPDATED - add phone, address, business type, employee count, description)
5. Certifications (existing)
6. **Trade Terms (NEW)** ← Insert here
7. Review (existing - update to show all new fields)

**Update:** `src/app/onboarding/page.tsx`
- Add TradeTermsStep import
- Update step count from 6 to 7
- Update progress bar
- Add trade terms data to form state
- Update API call to include trade terms

---

## Deliverable 7: Profile Display Updates

### Update: `/profile` page to show new fields

**Add Cards:**
- Contact Information (phone, WhatsApp)
- Address (city, state, country)
- Business Details (type, employee count, description)
- Trade Terms (MOQ, payment terms, incoterms, lead time)
- Capabilities (samples, OEM/ODM, production capacity)

**Mobile Responsive:** Stack cards vertically on mobile

---

## Constraints

- **No external APIs** - Use Supabase Storage for logos (not S3, Cloudinary)
- **Backward compatibility** - Existing users without new fields should see "Not specified"
- **Optional fields** - Don't force existing users to re-complete onboarding
- **File size limits** - 2MB max for logos
- **Validation** - Zod schemas for all new fields
- **Mobile first** - All forms work at 375px

---

## Evidence Required

Save all to `docs/evidence/block-1.14/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Profile edit page screenshot | `profile-edit.png` |
| Updated onboarding screenshot (Business Details step) | `onboarding-business-details.png` |
| Trade Terms step screenshot | `trade-terms-step.png` |
| Updated profile display screenshot | `profile-display.png` |
| Logo upload screenshot | `logo-upload.png` |
| Mobile screenshots (375px) | `mobile-*.png` |
| Migration output | `migration-output.txt` |
| Test output | `test-output.txt` |
| Self-audit | `self-audit.txt` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

All four gates must pass.

**Manual Testing:**
1. Complete onboarding with ALL new fields
2. Edit profile and update each field
3. Upload company logo
4. Verify trade terms save correctly
5. Check profile displays all data

Update `docs/governance/project_ledger.md` under Block 1.14. Mark as **`SUBMITTED`**.

---

## Research Sources

This spec incorporates competitive research from:
- [Alibaba Company Profile Guidelines](https://activity.alibaba.com/ggs/company_profile_update.html)
- [IndiaMART Seller Registration](https://www.growthjockey.com/blogs/indiamart-seller-registration)
- [MOQ Negotiation on Alibaba](https://reads.alibaba.com/what-does-moq-mean-how-to-negotiate-on-alibaba-com/)
- [Incoterms Guide](https://www.trade.gov/know-your-incoterms)
- [Import/Export Payment Terms](https://incodocs.com/blog/import-export-payment-terms-shipping/)

