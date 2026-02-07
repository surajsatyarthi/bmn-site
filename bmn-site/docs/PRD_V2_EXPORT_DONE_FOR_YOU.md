# BMN Product Requirements Document v2.0
## "Export Done-For-You" — AI-Powered Trade Lead Generation

**Version:** 2.0
**Date:** 2026-02-06
**Author:** PM Protocol
**Status:** Approved — Founder Decisions Locked
**Implementer:** Antigravity (AI Coder)

---

## 1. Executive Summary

BMN is pivoting from a trade marketplace/platform model to an **"Export Done-For-You"** service powered by AI. Instead of being another directory where exporters and importers list themselves and hope for leads (the IndiaMART/Alibaba model that produces fake leads and zero facilitation), BMN becomes a **service that does the work for the user**.

**The promise:** Sign up, tell us what you trade, and we find you real counterparties and generate warm leads via AI-powered cold email campaigns — all based on actual trade data, not self-reported directory listings.

### Why This Pivot

| Problem with Platform Model | Done-For-You Advantage |
|---|---|
| Users list and wait — no guaranteed results | BMN actively finds and reaches counterparties |
| Fake leads, spam inquiries (IndiaMART: 1.6/5 Trustpilot) | AI-matched leads based on real customs/trade data |
| No differentiation from 100+ B2B directories | Unique service — no competitor does end-to-end |
| Revenue depends on traffic volume | Revenue tied to value delivered (leads generated) |
| 54% of SME exporters can't find foreign buyers | BMN solves the #1 pain point directly |

---

## 2. Target Users

### Primary Persona: The Indian SME Exporter
- Company size: 10-200 employees
- Annual revenue: ₹1Cr - ₹100Cr
- Has IEC, basic certifications, production capacity
- **Pain:** Knows how to make the product, doesn't know how to find international buyers
- **Current workaround:** Trade fairs (expensive, infrequent), IndiaMART (fake leads), word of mouth

### Secondary Persona: The International Importer
- Looking to source from India (or other emerging markets)
- Needs verified suppliers with correct certifications
- **Pain:** Can't verify supplier quality from directory listings alone
- **Current workaround:** Alibaba (China-centric), expensive sourcing agents

### Tertiary Persona: The Indian Importer
- Importing raw materials, components, or finished goods
- Needs reliable international suppliers
- **Pain:** Finding quality suppliers outside established networks

---

## 3. Core User Journey

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐    ┌─────────────┐
│   Sign Up   │───▶│Create Profile│───▶│Select Products│───▶│ Business     │───▶│  Dashboard  │
│  (Email/PW) │    │  (Onboarding)│    │  & Interests  │    │   Details    │    │ (Matches &  │
│             │    │              │    │               │    │              │    │   Leads)    │
└─────────────┘    └──────────────┘    └───────────────┘    └──────────────┘    └─────────────┘
                                                                                      │
                                                                          ┌───────────┴───────────┐
                                                                          │                       │
                                                                   ┌──────▼──────┐    ┌───────────▼──────┐
                                                                   │ Counterparty│    │  Cold Email      │
                                                                   │  Matches    │    │  Campaign Status │
                                                                   └─────────────┘    └──────────────────┘
```

---

## 4. Feature Specifications

### 4.1 Authentication (Existing — Needs Update)

**Current state:** Basic email/password signup and login via Supabase.

**Changes required:**

| Change | Details |
|---|---|
| Remove "Company Name" from signup | Moves to onboarding flow |
| Add email verification enforcement | Block dashboard access until email verified |
| Add "Forgot Password" flow | Supabase password reset |
| Add Google OAuth (Phase 2) | Optional — reduces signup friction |

**Signup fields (simplified):**
- Full Name
- Email
- Password
- Accept Terms checkbox

---

### 4.2 Onboarding Flow (New — Critical Path)

After signup + email verification, users land on a **multi-step onboarding wizard**. This is the most important new feature — the quality of data collected here determines match quality.

#### Step 1: Trade Role
```
"What do you do?"

[ ] I Export goods (I sell to international buyers)
[ ] I Import goods (I buy from international sellers)
[ ] Both — I export and import
```

**Data captured:** `trade_role: 'exporter' | 'importer' | 'both'`

#### Step 2: Product Selection
```
"What products do you deal in?"

Search: [___________________________] 🔍
         "Search by product name or HS code"

Popular categories:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 🌾 Agri &    │ │ 👕 Textiles  │ │ ⚙️ Engineering│
│    Food      │ │ & Apparel    │ │    Goods     │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ 💊 Pharma &  │ │ 💎 Gems &    │ │ 🧪 Chemicals │
│    Healthcare│ │    Jewelry   │ │              │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ 🪵 Wood &    │ │ 🏗️ Construction│ │ 📱 Electronics│
│    Furniture │ │    Materials │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

- User selects one or more **product categories** (HS Chapter level: 2-digit)
- Then drills into **specific products** (HS 4-digit heading or 6-digit subheading)
- Can also type product name and get AI-suggested HS codes
- Minimum 1 product required, no maximum

**Data captured:** `products: [{ hs_code: string, name: string, description?: string }]`

#### Step 3: Trade Interests
```
"Where do you want to trade?"

Export to (select countries/regions):
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 🇺🇸 USA       │ │ 🇬🇧 UK        │ │ 🇦🇪 UAE       │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ 🇩🇪 Germany   │ │ 🇸🇦 Saudi     │ │ 🇯🇵 Japan     │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ 🇸🇬 Singapore │ │ 🇦🇺 Australia │ │ 🌍 Other...  │
└──────────────┘ └──────────────┘ └──────────────┘

Import from (if applicable):
[Similar country selection]

Monthly trade volume:
( ) < ₹10 Lakh
( ) ₹10 Lakh - ₹50 Lakh
( ) ₹50 Lakh - ₹2 Crore
( ) ₹2 Crore - ₹10 Crore
( ) ₹10 Crore+
```

**Data captured:**
```
trade_interests: {
  export_countries: string[],
  import_countries: string[],
  monthly_volume: string
}
```

#### Step 4: Business Details
```
Company Information

Company Name*:        [_________________________]
Legal Entity Type*:   [Proprietorship ▾]
                      Options: Proprietorship, Partnership, LLP, Pvt Ltd, Public Ltd
Founding Year*:       [____]
Company Size*:        [1-10 ▾]
                      Options: 1-10, 11-50, 51-200, 201-500, 500+

Address*:
Street:               [_________________________]
City*:                [_________________________]
State*:               [_________________________]
Country*:             [India ▾]
PIN Code*:            [_________________________]

Contact:
Phone*:               [_________________________]
WhatsApp:             [_________________________]
Website:              [_________________________]
```

**Data captured:** `company: { name, entity_type, founding_year, size, address, contact }`

#### Step 5: Certifications & Registrations
```
"What certifications does your company hold?"

Trade Registrations:
IEC Number:           [__________] (optional but recommended)

Certifications (select all that apply):
☐ ISO 9001 (Quality Management)
☐ ISO 22000 (Food Safety)
☐ ISO 14001 (Environmental)
☐ FSSAI License
☐ BIS/ISI Certification
☐ APEDA Registration
☐ MPEDA Registration
☐ GMP Certification
☐ HALAL Certification
☐ CE Marking
☐ FDA Registration
☐ Organic Certification
☐ Other: [__________]
```

**Data captured:** `certifications: string[], iec_number?: string`

#### Step 6: Review & Submit
- Summary of all information entered
- Edit buttons for each section
- "Submit Profile" CTA
- Redirect to Dashboard

**Implementation notes:**
- Progress bar at top showing Step X of 6
- "Save & Continue Later" on every step — partial profiles saved to DB
- Back button on every step
- Form validation with Zod schemas
- All fields persist across page refreshes (save to Supabase on each step)

---

### 4.3 Dashboard (New — Post-Onboarding)

The dashboard is the user's home after onboarding. It shows their profile status, counterparty matches, and campaign activity.

#### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  Header: BMN Logo | Dashboard | Matches | Campaigns | Profile  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Welcome back, {name}                                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Profile      │  │ Matches      │  │ Campaigns    │         │
│  │ Completion   │  │ Found        │  │ Active       │         │
│  │              │  │              │  │              │         │
│  │    75%       │  │     23       │  │      2       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Recent Matches                                         │   │
│  │                                                         │   │
│  │  🏢 ABC Trading Co. — Dubai, UAE                       │   │
│  │     Products: Basmati Rice, Spices                      │   │
│  │     Match Score: 87%  |  Importing since 2019           │   │
│  │     [View Details] [Request Introduction]               │   │
│  │                                                         │   │
│  │  🏢 XYZ Imports GmbH — Hamburg, Germany                │   │
│  │     Products: Organic Turmeric                          │   │
│  │     Match Score: 74%  |  Importing since 2021           │   │
│  │     [View Details] [Request Introduction]               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Campaign Activity                                      │   │
│  │                                                         │   │
│  │  📧 "Basmati Rice — UAE Buyers" Campaign                │   │
│  │     Sent: 150  |  Opened: 52 (35%)  |  Replied: 8 (5%)│   │
│  │     [View Campaign]                                     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Dashboard Stats Cards
| Stat | Source |
|---|---|
| Profile Completion % | Calculate from filled vs. total fields |
| Matches Found | Count of counterparty matches above 50% score |
| Active Campaigns | Count of email campaigns in progress |

#### Recent Matches Section
- Shows top 5 matches sorted by match score
- Each card shows: Company name, location, products, match tier badge, years active
- No numeric scores shown — use tier badges: "Best Match", "Great Match", "Good Match"
- CTAs: "View Details" (expands match), "Request Introduction" (triggers outreach)

#### Campaign Activity Section
- Shows active and recent campaigns
- Metrics: Sent, Opened, Replied, Meetings Booked
- Link to full campaign view

---

### 4.4 Matches Page (New)

Full list of AI-generated counterparty matches.

#### Match Card (Expanded)
```
┌─────────────────────────────────────────────────────────────┐
│  ★ Best Match                                               │
│  ABC Trading Co.                                            │
│  Dubai, UAE  •  Importing since 2019                       │
│                                                             │
│  Products:                                                  │
│  • Basmati Rice (HS 1006.30) — 200 MT/month               │
│  • Indian Spices (HS 0910) — 50 MT/month                  │
│                                                             │
│  Why this match:                                            │
│  ✓ Exact product match on 2 categories                    │
│  ✓ Volume compatible with your capacity                    │
│  ✓ Active buyer — 12 shipments in last 6 months           │
│  ✓ You hold FSSAI + HALAL (required for UAE)              │
│                                                             │
│  ─────── Business Details ───────                          │
│  🔒 Contact info, address, trade history                   │
│  [Unlock Details] (2 of 3 free reveals remaining)          │
│  ─────────────────────────────────────                     │
│                                                             │
│  [Request Introduction]  [Add to Campaign]  [Dismiss]      │
└─────────────────────────────────────────────────────────────┘
```

**Match tiers (user-facing labels — no numeric scores shown):**
- **Best Match** — internal score 80-100
- **Great Match** — internal score 60-79
- **Good Match** — internal score 50-59
- Below 50 — not shown to users

**Free tier gating:**
- Match list is fully visible (company name, country, product categories, match tier)
- Business details (contact info, address, trade volume, shipment history) require a "reveal"
- Free users get **3 reveals per month**, counter resets on 1st of each month
- Revealed matches stay unlocked permanently
- CTA on locked cards: "Unlock Details (X free reveals remaining)" or "Upgrade for unlimited access"

#### Filtering & Sorting
- Filter by: Country, Product/HS Code, Match Tier, Trade Volume
- Sort by: Relevance (default, by internal score), Recency, Volume
- Pagination: 20 per page

#### Internal Score (Not User-Facing)
Score breakdown is stored in DB for internal use and debugging only. Not exposed in UI.
```
score_breakdown: {
  product_compatibility: 85,   // weight: 30%
  volume_alignment: 95,        // weight: 15%
  certification_match: 80,     // weight: 15%
  trust_score: 70,             // weight: 15%
  geographic_fit: 100,         // weight: 10%
  commercial_fit: 60,          // weight: 10%
  intent_signals: 80           // weight: 5%
}
```

---

### 4.5 Campaigns Page (New — Phase 2)

Shows cold email campaigns BMN runs on behalf of the user.

**Note:** In Phase 1, campaigns are managed by BMN's internal team using the user's profile data. The Campaigns page is a **read-only dashboard** showing campaign status and results. Self-serve campaign creation is Phase 2.

#### Campaign Card
```
┌─────────────────────────────────────────────────────────────┐
│  📧 Basmati Rice — UAE Buyers                    Active ●   │
│  Started: Jan 15, 2026  |  Target: UAE importers           │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ Sent    │  │ Opened  │  │ Replied │  │ Meetings│      │
│  │  150    │  │  52     │  │   8     │  │   3     │      │
│  │         │  │  35%    │  │   5%    │  │   2%    │      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │
│                                                             │
│  Last updated: Feb 5, 2026                                 │
│  [View Responses]  [View Target List]                      │
└─────────────────────────────────────────────────────────────┘
```

**Metrics update cadence:** Daily batch. Stats are updated once per day (not real-time).
Show "Last updated: [date]" on each campaign card. Data synced via cron or manual update from BMN ops team.

---

### 4.6 Profile Page (New)

View and edit profile information. Same fields as onboarding but in an editable form layout.

#### Sections
1. **Personal Info** — Name, email, phone
2. **Company Info** — Name, type, size, year, address
3. **Products & HS Codes** — Add/remove products
4. **Trade Interests** — Countries, volume
5. **Certifications** — Add/remove certs, upload docs
6. **Account Settings** — Change password, notification preferences

---

### 4.7 Landing Page (Update Existing)

The current homepage needs to reflect the new positioning.

#### Hero Section
```
Headline:     "We Find Your Buyers. You Ship."
Subheadline:  "AI-powered trade lead generation for exporters and importers.
               Tell us what you trade — we find verified counterparties
               and reach out on your behalf."
CTA:          [Get Started — Free]  [See How It Works]
```

#### How It Works Section
```
Step 1: Create Your Profile
Tell us about your products, certifications, and target markets.

Step 2: We Find Matches
Our AI analyzes global trade data to find importers
actively buying your products.

Step 3: We Reach Out
Personalized outreach campaigns to verified buyers
on your behalf.

Step 4: You Close Deals
We deliver warm leads and introductions.
You focus on what you do best — fulfilling orders.
```

#### Trusted By Section
Logo bar of companies from the existing site. Keep all current logos:
```
Maersk  |  Walmart  |  Toyota  |  Samsung  |  Adani
```
Label: "Trusted by leading global enterprises"

#### Numbers Section
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  200+        │  │  30+         │  │  1M+         │
│  Companies   │  │  Countries   │  │  Database    │
│  Trust Us    │  │  Covered     │  │  Entries     │
└──────────────┘  └──────────────┘  └──────────────┘
```
*(Carry forward the numbers from businessmarket.network — update as they grow)*

#### "Who Is This For" Section
```
- Exporters struggling to find international buyers
- Importers looking for verified suppliers across borders
- SMEs that can't afford expensive trade consultants
- Companies expanding to new international markets
```

#### Pricing Section
```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  Free                       │  │  Pro (Coming Soon)          │
│  $0/month                   │  │                             │
│                             │  │  Unlimited match reveals    │
│  • Unlimited match browsing │  │  Priority outreach campaigns│
│  • 3 business detail        │  │  Dedicated account manager  │
│    reveals per month        │  │  Advanced analytics         │
│  • Basic campaign tracking  │  │                             │
│                             │  │  [Contact Us]               │
│  [Get Started]              │  │                             │
└─────────────────────────────┘  └─────────────────────────────┘
```

---

## 5. Database Schema

### Tables

#### `profiles`
Extends Supabase auth.users.

| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | References auth.users.id |
| full_name | text | Yes | From signup |
| phone | text | No | |
| whatsapp | text | No | |
| trade_role | enum | Yes | 'exporter', 'importer', 'both' |
| monthly_volume | text | No | Volume bracket |
| onboarding_step | int | Yes | 1-6, tracks progress |
| onboarding_completed | boolean | Yes | Default false |
| plan | text | Yes | Default 'free'. Values: 'free', 'pro' |
| created_at | timestamptz | Yes | |
| updated_at | timestamptz | Yes | |

#### `companies`
| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | References profiles.id |
| name | text | Yes | |
| entity_type | text | Yes | Proprietorship, Partnership, LLP, etc. |
| founding_year | int | No | |
| size | text | No | Employee bracket |
| street | text | No | |
| city | text | Yes | |
| state | text | Yes | |
| country | text | Yes | Default 'India' |
| pin_code | text | No | |
| website | text | No | |
| iec_number | text | No | 10-digit IEC |
| created_at | timestamptz | Yes | |
| updated_at | timestamptz | Yes | |

#### `products`
| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | References profiles.id |
| hs_code | text | Yes | 2-6 digit HS code (WCO international standard) |
| name | text | Yes | Product name |
| description | text | No | |
| trade_type | enum | Yes | 'export', 'import', 'both' |
| created_at | timestamptz | Yes | |

#### `trade_interests`
| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | References profiles.id |
| country_code | text | Yes | ISO 3166-1 alpha-2 |
| country_name | text | Yes | Display name |
| interest_type | enum | Yes | 'export_to', 'import_from' |
| created_at | timestamptz | Yes | |

#### `certifications`
| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | References profiles.id |
| type | text | Yes | 'ISO_9001', 'FSSAI', 'HALAL', etc. |
| certificate_number | text | No | |
| valid_until | date | No | |
| document_url | text | No | Uploaded cert file |
| created_at | timestamptz | Yes | |

#### `matches`
| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | The user receiving the match |
| counterparty_name | text | Yes | Matched company name |
| counterparty_country | text | Yes | |
| counterparty_city | text | No | |
| matched_products | jsonb | Yes | Array of {hs_code, name} |
| match_score | int | Yes | 0-100 (internal only, never shown to user) |
| match_tier | text | Yes | 'best', 'great', 'good' (derived from score, shown to user) |
| score_breakdown | jsonb | Yes | Component scores (internal only) |
| match_reasons | jsonb | Yes | Array of explanation strings |
| match_warnings | jsonb | No | Array of warning strings |
| status | enum | Yes | 'new', 'viewed', 'interested', 'dismissed' |
| revealed | boolean | Yes | Default false — true when user unlocks business details |
| trade_data | jsonb | No | Volume, frequency, years active |
| counterparty_contact | jsonb | No | Contact info (only sent to client when revealed=true) |
| created_at | timestamptz | Yes | |
| updated_at | timestamptz | Yes | |

#### `match_reveals`
Tracks free tier usage — 3 reveals per month per user.

| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | References profiles.id |
| match_id | uuid (FK) | Yes | References matches.id |
| revealed_at | timestamptz | Yes | When the user unlocked this match |
| month_key | text | Yes | Format: '2026-02' — for counting reveals per month |

**Business logic:** Before revealing, count `match_reveals WHERE profile_id = ? AND month_key = ?`. If count >= 3 and user is on free tier, block and show upgrade CTA. Revealed matches stay unlocked permanently (don't re-lock next month).

#### `campaigns`
| Column | Type | Required | Notes |
|---|---|---|---|
| id | uuid (PK) | Yes | |
| profile_id | uuid (FK) | Yes | |
| name | text | Yes | Campaign display name |
| target_description | text | Yes | e.g., "UAE Basmati Rice Importers" |
| status | enum | Yes | 'draft', 'active', 'paused', 'completed' |
| emails_sent | int | Yes | Default 0 |
| emails_opened | int | Yes | Default 0 |
| emails_replied | int | Yes | Default 0 |
| meetings_booked | int | Yes | Default 0 |
| metrics_updated_at | timestamptz | No | When stats were last batch-updated |
| started_at | timestamptz | No | |
| completed_at | timestamptz | No | |
| created_at | timestamptz | Yes | |
| updated_at | timestamptz | Yes | |

---

## 6. Page Routes

| Route | Page | Auth Required | New/Update |
|---|---|---|---|
| `/` | Landing page | No | Update |
| `/login` | Login | No | Update (minor) |
| `/signup` | Signup | No | Update (simplify) |
| `/forgot-password` | Password reset | No | New |
| `/onboarding` | Onboarding wizard | Yes | New |
| `/onboarding/[step]` | Individual onboarding step | Yes | New |
| `/dashboard` | User dashboard | Yes | New |
| `/matches` | Counterparty matches | Yes | New |
| `/matches/[id]` | Match detail | Yes | New |
| `/campaigns` | Campaign overview | Yes | New |
| `/campaigns/[id]` | Campaign detail | Yes | New |
| `/profile` | Edit profile | Yes | New |
| `/verify-email` | Email verification landing | No | New |

---

## 7. API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/profile` | GET, PUT | Get/update user profile |
| `/api/profile/onboarding` | PUT | Save onboarding step data |
| `/api/products` | GET, POST, DELETE | Manage user's product list |
| `/api/products/search` | GET | Search HS codes by name |
| `/api/trade-interests` | GET, POST, DELETE | Manage target countries |
| `/api/certifications` | GET, POST, DELETE | Manage certifications |
| `/api/matches` | GET | List matches with filters |
| `/api/matches/[id]` | GET, PATCH | Get match detail, update status |
| `/api/campaigns` | GET | List campaigns |
| `/api/campaigns/[id]` | GET | Campaign detail with metrics |
| `/api/auth/forgot-password` | POST | Trigger password reset |

---

## 8. Tech Stack Decisions

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 16 (existing) | Already set up, App Router, RSC |
| Auth | Supabase Auth (existing) | Already working, email verification built-in |
| Database | Supabase Postgres + Drizzle ORM | Drizzle already in deps, type-safe queries |
| Styling | Tailwind CSS v4 (existing) | Already configured with BMN design tokens |
| Forms | React Hook Form + Zod | Best DX for multi-step forms with validation |
| Icons | Lucide React (existing) | Already in deps |
| Email (transactional) | Resend (existing) | Already in deps |
| Email (campaigns) | TBD — likely Resend or external | Phase 2 decision |
| HS Code Data | Static JSON + Supabase lookup | Pre-loaded HS code database |
| Country Data | Static JSON | ISO 3166 country list |
| Hosting | Vercel (existing) | Already deployed |

### New Dependencies Needed

| Package | Purpose |
|---|---|
| `react-hook-form` | Form state management for onboarding |
| `@hookform/resolvers` | Zod resolver for react-hook-form |
| `@radix-ui/react-select` | Accessible dropdown selects |
| `@radix-ui/react-checkbox` | Accessible checkboxes |
| `@radix-ui/react-progress` | Progress bar for onboarding |
| `@radix-ui/react-tabs` | Tab navigation on dashboard |
| `@radix-ui/react-avatar` | User avatars in header/profile |

---

## 9. Implementation Phases (5 Phases)

Each phase ends with a **mandatory report** from the AI coder to the PM. The PM (Claude) will verify every deliverable before approving the phase. No phase can begin until the previous phase is approved.

### Phase 1: Database, Auth & Onboarding
**Goal:** Users can sign up, verify email, complete 6-step onboarding, and view their profile.

| # | Task | Priority |
|---|---|---|
| 1.1 | Install new dependencies (react-hook-form, @hookform/resolvers, Radix UI primitives) | P0 |
| 1.2 | Database schema with Drizzle ORM (all tables: profiles, companies, products, trade_interests, certifications) | P0 |
| 1.3 | Supabase migration SQL for all tables | P0 |
| 1.4 | Auth middleware — protect /dashboard, /onboarding, /matches, /campaigns, /profile | P0 |
| 1.5 | Email verification enforcement (block dashboard until verified) | P0 |
| 1.6 | Forgot password flow (/forgot-password page + Supabase reset) | P0 |
| 1.7 | Simplify signup page (remove company name, add terms checkbox) | P0 |
| 1.8 | 6-step onboarding wizard with progress bar | P0 |
| 1.9 | HS code search/selection component (with static JSON dataset) | P0 |
| 1.10 | Country selection component (ISO 3166 dataset) | P0 |
| 1.11 | Certification selection component | P0 |
| 1.12 | Profile page (view + edit all onboarding data) | P0 |
| 1.13 | Update landing page copy and sections for new positioning | P0 |
| 1.14 | Route group restructure: (auth) group + (dashboard) group with layouts | P0 |

**Phase 1 Report must include:** Schema SQL, screenshot of each onboarding step, screenshot of profile page, proof that auth middleware blocks unauthenticated access, proof that email verification works, ESLint + build passing.

### Phase 2: Dashboard & Matches
**Goal:** Authenticated users see a dashboard with stats. Match data can be seeded and displayed with tier badges and free-tier gating.

| # | Task | Priority |
|---|---|---|
| 2.1 | Dashboard layout with sidebar navigation | P0 |
| 2.2 | Dashboard page with stat cards (profile completion, matches, campaigns) | P0 |
| 2.3 | Authenticated Header/Navigation update (user menu, logout) | P0 |
| 2.4 | Matches + match_reveals tables (migration if not in Phase 1) | P0 |
| 2.5 | Matches listing page with tier badges (Best/Great/Good Match) | P0 |
| 2.6 | Match detail view with "Why this match" reasons | P0 |
| 2.7 | RevealGate component — free tier gating (3 reveals/month) | P0 |
| 2.8 | Match filtering (country, product, tier) and sorting | P1 |
| 2.9 | Match status updates (interested/dismissed) | P1 |
| 2.10 | Seed script to populate test match data | P0 |
| 2.11 | Recent matches section on dashboard | P0 |

**Phase 2 Report must include:** Screenshot of dashboard with real stat cards, screenshot of matches page with tier badges, proof that reveal gating works (show locked → unlocked flow), proof that 4th reveal is blocked on free tier, seed script output.

### Phase 3: Campaigns & Landing Page Polish
**Goal:** Campaign dashboard showing outreach metrics (read-only). Landing page fully polished with all sections.

| # | Task | Priority |
|---|---|---|
| 3.1 | Campaigns table migration | P0 |
| 3.2 | Campaigns listing page with status badges | P0 |
| 3.3 | Campaign detail page with metrics (sent/opened/replied/meetings) | P0 |
| 3.4 | "Last updated" timestamp on campaign cards (daily batch display) | P0 |
| 3.5 | Campaign activity section on dashboard | P0 |
| 3.6 | Seed script for test campaign data | P0 |
| 3.7 | Landing page — Trusted By logo bar (Maersk, Walmart, Toyota, Samsung, Adani) | P0 |
| 3.8 | Landing page — Pricing section (Free vs Pro Coming Soon) | P0 |
| 3.9 | Landing page — final responsive polish | P1 |
| 3.10 | Full API route implementation for all CRUD operations | P0 |

**Phase 3 Report must include:** Screenshot of campaigns page, screenshot of campaign detail, screenshot of full landing page (all sections), API route list with curl test results, build passing.

### Phase 4: Polish, Testing & Production Readiness
**Goal:** Everything works end-to-end. No broken states. Production-ready.

| # | Task | Priority |
|---|---|---|
| 4.1 | End-to-end flow testing (signup → verify → onboard → dashboard → matches) | P0 |
| 4.2 | Error handling on all forms and API routes | P0 |
| 4.3 | Loading states and skeleton screens | P0 |
| 4.4 | Empty states (no matches yet, no campaigns yet) | P0 |
| 4.5 | Mobile responsive audit (all pages) | P0 |
| 4.6 | SEO metadata on all pages | P1 |
| 4.7 | 404 and error pages | P1 |
| 4.8 | Ralph Protocol security scan (npm run ralph:full) — must pass | P0 |
| 4.9 | ESLint clean + build clean | P0 |
| 4.10 | Vercel deployment + production smoke test | P0 |

**Phase 4 Report must include:** Full E2E test walkthrough with screenshots, mobile screenshots (3 breakpoints), Ralph scan output (must pass), build output, Vercel deployment URL.

### Phase 5: Growth Features
**Goal:** Enhancements that drive retention and conversion.

| # | Task | Priority |
|---|---|---|
| 5.1 | Google OAuth signup | P2 |
| 5.2 | AI-powered HS code suggestion from product description | P2 |
| 5.3 | Document upload for certifications (Supabase Storage) | P2 |
| 5.4 | Email notifications (new matches, campaign updates via Resend) | P2 |
| 5.5 | Analytics integration (GA4 + custom events) | P2 |
| 5.6 | Admin dashboard (internal — view all users, matches, campaigns) | P2 |
| 5.7 | Self-serve campaign creation (user triggers outreach) | P2 |

**Phase 5 Report must include:** Feature demos with screenshots, integration test results, updated build/deploy.

---

## 10. Design Guidelines

### Existing Design Tokens (Keep)
- Primary Blue: `#2046f5`
- Gold Accent: `#FF8C00`
- Light BG: `#fafbfc`
- Border: `#e5e7eb`
- Text Primary: `#0f172a`
- Text Secondary: `#64748b`
- Fonts: Inter (body), Oswald (display/headlines)
- Button: Blue diagonal gradient (`#2046f5` → `#4b6ff7`)

### Design Principles for New Pages
1. **Clean and functional** — No decorative gradients or animations. Content first.
2. **Card-based layouts** — Matches, campaigns, and stats in cards with subtle borders.
3. **Progress indicators** — Onboarding must show clear progress (step X of 6).
4. **White space** — Generous padding. Don't crowd the UI.
5. **Consistent form styling** — All inputs: `rounded-lg`, `border-bmn-border`, `focus:ring-bmn-blue`.
6. **Mobile responsive** — Onboarding and dashboard must work on mobile.
7. **Match tier badges** — "Best Match" (blue), "Great Match" (teal), "Good Match" (gray). No numeric scores shown.
8. **Status badges** — Use subtle colored pills: green (active), yellow (pending), gray (completed).
9. **Gated content** — Locked business details should use a subtle blur/overlay with a clear unlock CTA. Not aggressive — show enough to create interest.

---

## 11. Data Seeding: HS Codes

The platform needs a searchable HS code database. This should be a static dataset loaded into Supabase or served from a JSON file.

**Standard:** WCO Harmonized System, 6-digit international codes only (no country-specific extensions).

**Required data structure:**
```typescript
interface HSCode {
  code: string;        // "09", "0901", or "090111"
  level: 'chapter' | 'heading' | 'subheading';
  description: string; // "Coffee, whether or not roasted"
  parent_code?: string; // "09" for heading "0901"
  section: number;     // 1-21
  chapter: number;     // 1-99
}
```

**Dataset scope:**
- 21 sections (top-level categories)
- 99 chapters (2-digit) — always loaded
- ~1,244 headings (4-digit) — always loaded
- ~5,224 subheadings (6-digit) — loaded on-demand per chapter for search results

**Source:** WCO Harmonized System open data. No India-specific ITC-HS extensions.

---

## 12. Success Metrics

| Metric | Target (90 days) | How to Measure |
|---|---|---|
| Signups | 500 | Supabase auth.users count |
| Onboarding completion rate | >60% | profiles.onboarding_completed / total signups |
| Average profile completeness | >75% | Weighted field completion score |
| Matches generated per user | >15 | matches count per profile |
| Campaign response rate | >3% | emails_replied / emails_sent |
| User retention (30-day) | >40% | Login activity after 30 days |

---

## 13. Out of Scope (Explicitly)

These are **not** part of this PRD and should not be built:

- Payment processing / subscriptions (Phase 4+)
- In-app messaging between buyer and seller
- Document generation (invoices, shipping bills)
- Logistics / shipping integration
- Trade finance / escrow
- Mobile app (responsive web is sufficient)
- Admin panel (Phase 4)
- Self-serve campaign builder (Phase 3-4)
- Real-time notifications (email notifications sufficient for Phase 1-2)

---

## 14. Founder Decisions (Locked)

| # | Question | Decision | Implementation Notes |
|---|---|---|---|
| 1 | IEC number required or optional? | **Optional** | Show in onboarding Step 5 but don't block progress. Show a "recommended" badge next to the field. Profile completion % should factor it in but not gate access. |
| 2 | Show match scores or ranked list? | **Ranked list only** | Do NOT show percentage scores to users. Sort matches by internal score but display as "Best Match", "Great Match", "Good Match" tiers. Remove the ScoreBreakdown component from user-facing UI (keep internally for debugging). |
| 3 | Free tier scope? | **3 business details/month free** | Free users see the full ranked match list (company name, country, product category) but business details (contact info, address, trade data) are gated. 3 full reveals per month for free. Blurred/locked state on the rest with "Upgrade to view" CTA. |
| 4 | Campaign metrics update frequency? | **Daily batch** | Campaign stats (sent, opened, replied, meetings) update once daily. Show "Last updated: [date]" timestamp on campaign cards. No webhooks needed — simpler backend, cron job or manual update. |
| 5 | HS code depth? | **6-digit international (WCO standard)** | Use the WCO Harmonized System 6-digit codes only. No India-specific 8-digit ITC-HS extensions. This keeps the platform international and the HS code dataset manageable (~5,224 subheadings). |

---

## 15. Handoff Notes for Antigravity

### What exists today (don't break these):
- Supabase auth working (login + signup)
- BMN design system in `globals.css`
- PostCSS config for Tailwind v4
- Header component
- Ralph Protocol QA system
- Deployed to Vercel at `bmn-site-eight.vercel.app`

### Suggested implementation order:
1. **Database first** — Set up Drizzle schema, run migrations on Supabase
2. **Auth middleware** — Protect `/dashboard`, `/onboarding`, `/matches`, `/campaigns`, `/profile`
3. **Onboarding flow** — This is the most complex UI piece. Build step-by-step.
4. **Landing page update** — Change copy to reflect "Done For You" positioning
5. **Dashboard** — Start with mock data, wire up real data as matches come in
6. **Matches page** — Depends on having match data (initially seeded/mocked)
7. **Campaigns page** — Read-only dashboard, data comes from backend

### File structure recommendation:
```
src/
├── app/
│   ├── (auth)/           # Auth pages (no header/sidebar)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── (dashboard)/      # Authenticated pages (with sidebar/header)
│   │   ├── layout.tsx    # Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   ├── matches/
│   │   ├── campaigns/
│   │   ├── profile/
│   │   └── onboarding/
│   ├── page.tsx          # Public landing page
│   ├── layout.tsx        # Root layout
│   └── api/
│       ├── profile/
│       ├── products/
│       ├── matches/
│       └── campaigns/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── DashboardHeader.tsx
│   ├── onboarding/
│   │   ├── StepProgress.tsx
│   │   ├── TradeRoleStep.tsx
│   │   ├── ProductStep.tsx
│   │   ├── TradeInterestsStep.tsx
│   │   ├── BusinessDetailsStep.tsx
│   │   ├── CertificationsStep.tsx
│   │   └── ReviewStep.tsx
│   ├── matches/
│   │   ├── MatchCard.tsx
│   │   ├── MatchDetail.tsx
│   │   ├── MatchTierBadge.tsx
│   │   └── RevealGate.tsx
│   ├── campaigns/
│   │   ├── CampaignCard.tsx
│   │   └── CampaignMetrics.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   └── RecentActivity.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       ├── Badge.tsx
│       └── ProgressBar.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts     # Drizzle schema
│   │   └── index.ts      # DB client
│   ├── supabase/
│   │   ├── client.ts     # Browser client (existing)
│   │   ├── server.ts     # Server client
│   │   └── middleware.ts  # Auth middleware
│   ├── validations/
│   │   ├── profile.ts    # Zod schemas for profile
│   │   ├── onboarding.ts # Zod schemas per step
│   │   └── products.ts   # Product/HS code validation
│   └── data/
│       ├── hs-codes.json # HS code database
│       └── countries.json # Country list
└── middleware.ts          # Next.js middleware for auth
---

## 16. Operations Model: Cold Email Agency Workflow

BMN operates as a **done-for-you cold email lead generation agency** with a SaaS frontend. The website provides a polished client-facing experience while ops runs manually behind the scenes. Clients perceive an AI-powered platform; actual work is human-driven.

### 16.1 End-to-End Operations Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BMN OPERATIONS FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CLIENT SIDE (Website)             OPS TEAM (Manual)                    │
│  ─────────────────────             ─────────────────                    │
│                                                                         │
│  1. Client signs up                                                     │
│  2. Completes onboarding           3. Team sees new profile             │
│     → Products (HS codes)             (admin dashboard / DB query)      │
│     → Target countries                                                  │
│     → Certifications                                                    │
│     → Company details                                                   │
│                                                                         │
│                                    4. Buyer research                    │
│                                       → Export/import portals           │
│                                       → Apollo for email discovery      │
│                                                                         │
│                                    5. Upload matches to database        │
│                                       (seed script or admin UI)         │
│                                                                         │
│  6. Client sees matches            ← Matches populated by team          │
│     on dashboard                                                        │
│                                                                         │
│  7. Client marks "Interested"      8. Team prioritizes for outreach     │
│                                                                         │
│                                    9. Cold email campaign               │
│                                       → Intro emails                    │
│                                       → Follow-up sequences             │
│                                       → Response handling               │
│                                                                         │
│  10. Client sees campaign stats    ← Team updates daily                 │
│      (sent, opened, replied)                                            │
│                                                                         │
│                                    11. Positive response?               │
│                                        → Notify client                  │
│                                        → Hand off warm lead             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 16.2 Offline Deal Flow (Post-Lead)

After BMN delivers a warm lead, the following stages happen **offline** between client and buyer. These will be integrated into the platform in future phases.

| Stage | Description | Current | Future |
|-------|-------------|---------|--------|
| **Introduction** | Initial call/meeting between client and buyer | WhatsApp/Email | In-app intro requests |
| **Send Details** | Product catalogs, specs, pricing shared | Email/PDF | Document hub in dashboard |
| **Meeting Setup** | Schedule video call or visit | Manual coordination | Calendly integration |
| **Sample Sharing** | Physical samples shipped to buyer | Logistics offline | Shipment tracker |
| **Negotiation** | Rate, quantity, terms discussion | Email/Call | Deal room / chat |
| **Order Confirmation** | Final PO and payment terms | Offline | Order tracker |

### 16.3 Data Sources

| Data | Source | Usage |
|------|--------|-------|
| **Buyer profiles** | Export/import portals (subscribed) | Match generation |
| **Contact emails** | Apollo (or similar) | Cold outreach |
| **Trade volumes** | Portal data + public customs records | Match scoring |
| **Company verification** | Manual research | Trust signals |

### 16.4 Client Perception vs. Reality

| What Client Sees | Reality |
|------------------|---------|
| *"AI analyzes global trade data"* | Ops team queries portal databases |
| *"AI-matched buyers"* | Human-curated matches uploaded |
| *"Personalized outreach campaigns"* | Email team sends manually |
| *"Real-time campaign analytics"* | Stats updated daily by ops |
| *"AI Match Score: 87%"* | Human-assigned tier (best/great/good) |

This is intentional — clients get a premium experience while ops scales gradually.

---

## 17. Future Phases: Integration Roadmap (Phases 6-8)

These phases move manual ops work into the platform.

### Phase 6: Ops Dashboard & Tools
**Goal:** Give ops team an internal admin UI to manage clients, matches, and campaigns without raw database access.

| # | Task | Priority |
|---|------|----------|
| 6.1 | Admin authentication (separate from client login) | P0 |
| 6.2 | User management dashboard (view all clients, profiles) | P0 |
| 6.3 | Match upload UI (add matches for specific users) | P0 |
| 6.4 | Campaign creation form (create campaign, set target description) | P0 |
| 6.5 | Campaign metrics editor (update sent/opened/replied/meetings) | P0 |
| 6.6 | Client notification trigger (mark lead as "delivered") | P1 |
| 6.7 | Activity log / audit trail | P1 |

**Phase 6 Report:** Admin demo, permission model, ops workflow walkthrough.

---

### Phase 7: Email Integration
**Goal:** Send cold emails directly from BMN platform instead of external tools.

| # | Task | Priority |
|---|------|----------|
| 7.1 | Email sending integration (Resend or SMTP) | P0 |
| 7.2 | Email template builder (personalization tokens) | P0 |
| 7.3 | Sequence builder (multi-step follow-ups) | P0 |
| 7.4 | Open/click tracking (webhook ingestion) | P0 |
| 7.5 | Reply detection and threading | P1 |
| 7.6 | Bounce/unsubscribe handling | P1 |
| 7.7 | Client email domain verification | P2 |
| 7.8 | A/B testing for subject lines | P2 |

**Phase 7 Report:** Email flow demo, deliverability test, tracking proof.

---

### Phase 8: Deal Flow Integration (13-Step Pipeline)
**Goal:** Track complete export deal lifecycle from product selection to payment with clear USER ACTION vs. BMN AUTOMATION visibility.

**Architecture:** Kanban board at `/deals` with 6 stages mapped to 13 process steps.

#### 13-Step Export Deal Process (Source: table.csv)

| Step | Description | Owner | Kanban Stage |
|:-----|:------------|:------|:-------------|
| 1 | Finalize Product and Target Country | Backend AI | Lead Gen |
| 2 | Conduct Compliance Check | Backend AI | Lead Gen |
| 3 | Find Leads from Databases | Backend AI | Lead Gen |
| 4 | Build a Prospect List | Backend AI | Lead Gen |
| 5 | Send Initial Emails or Inquiries | Backend AI (Phase 7) | Outreach |
| 6 | Set Up Meetings | Backend AI (Phase 7) | Outreach |
| **7** | **Conduct Discussions** | **USER ACTION** | **Discussion** |
| **8** | **Agree on Price and Terms** | **USER ACTION** | **Negotiation** |
| **9** | **Send Samples** | **USER ACTION** | **Negotiation** |
| 10 | Finalize Contract | Backend AI | Contract |
| 11 | Arrange Production and Quality Control | Backend AI | Fulfillment |
| 12 | Handle Logistics and Shipping | Backend AI | Fulfillment |
| 13 | Manage Payment and Follow-Up | Backend AI | Fulfillment |

**USER ACTION steps (7-9):** Platform shows "🔴 Action Required" banner with clear instructions.

#### Phase 8A: Deal Pipeline UI (P0)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 8A.1 | Schema: `deals` table with stage, current_step, user_action_required | P0 | Links to matches table |
| 8A.2 | `/deals` route with Kanban board (6 columns) | P0 | Drag-and-drop between stages |
| 8A.3 | Deal detail page `/deals/[id]` with vertical timeline | P0 | Shows all 13 steps with status badges |
| 8A.4 | Dashboard integration: "Active Deals" stat card + "Action Required" alerts | P0 | |
| 8A.5 | USER ACTION forms: Meeting scheduler (Step 7), Terms input (Step 8), Sample tracker (Step 9) | P0 | |
| 8A.6 | Match → Deal conversion flow ("Start Deal" button on match detail) | P0 | Only for revealed matches |

#### Phase 8B: Deal Automation Hooks (P1)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 8B.1 | Stage 1-4: Auto-populate from Matches engine | P1 | Run on deal creation |
| 8B.2 | Stage 5-6: Trigger cold email campaigns via Manyreach | P1 | Requires Phase 7 |
| 8B.3 | Stage 10: Contract PDF generation | P2 | Template + merge fields |
| 8B.4 | Stage 11-13: Production/logistics workflow triggers | P2 | External integrations |
| 8B.5 | Email notifications on stage change | P1 | Requires Phase 6 |

**Prerequisites:** Phase 6 (Emails) + Phase 7 (Cold Email) must complete first.

**Phase 8 Report:** Full deal flow demo showing USER ACTION steps vs. automated stages, client walkthrough.

---

## 18. Updated Phase Summary

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 1** | Database, Auth, Onboarding | ✅ Complete |
| **Phase 2** | Dashboard, Profile & Matches | ✅ Complete |
| **Phase 3** | Campaigns & Landing Page Polish | 🟡 Next |
| **Phase 4** | Polish, Testing, Production | ⬜ Not Started |
| **Phase 5** | Growth Features (OAuth, AI, notifications) | ⬜ Not Started |
| **Phase 6** | Ops Dashboard & Admin Tools | ⬜ Future |
| **Phase 7** | Email Integration (mini-PRD required) | ⬜ Future |
| **Phase 8** | Deal Flow Integration | ⬜ Future |

---

*This document should be treated as the source of truth for the BMN v2 build. All implementation decisions should reference this PRD. Any deviation requires founder approval.*

