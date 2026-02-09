# Task 5.2 — Intelligence & Analytics

**Block:** 5.2
**Status:** TODO
**Prerequisites:** Block 5.1 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Add AI-powered HS code suggestions and GA4 analytics to improve UX and track user behavior.

---

## Deliverable 1: AI-Powered HS Code Suggestion

### Integration: OpenAI API (GPT-4)

**Files to create:**
- `src/app/api/ai/suggest-hs-code/route.ts`
- `src/lib/ai/hs-code-matcher.ts`
- `src/components/onboarding/ProductSelectionStep.tsx` (modify)

**Environment variables:**
- `OPENAI_API_KEY=`

**API Route:**
```typescript
// POST /api/ai/suggest-hs-code
// Body: { productDescription: string }
// Response: { suggestions: Array<{code: string, description: string, confidence: number}> }

import { OpenAI } from 'openai'

export async function POST(request: Request) {
  const { productDescription } = await request.json()

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const prompt = `Given this product description: "${productDescription}"

Suggest the 3 most likely HS codes (6-digit) with descriptions.
Return as JSON array: [{code, description, confidence}]`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  })

  const suggestions = JSON.parse(completion.choices[0].message.content)
  return NextResponse.json({ suggestions })
}
```

**UI Changes (Onboarding Step 2):**
- Add text input: "Describe your product in a few words"
- "Get AI Suggestions" button
- Show loading state while API call runs
- Display suggested HS codes as clickable cards
- Clicking a suggestion auto-fills the HS code search

**Acceptance:**
- User types "Coffee beans" → API returns HS codes 0901.xx
- Suggestions appear in <3 seconds
- Can click suggestion to auto-fill
- Still allows manual HS code search
- Rate limit: 10 requests per minute per user

---

## Deliverable 2: GA4 Analytics Integration

### Integration: Google Analytics 4

**Files to create:**
- `src/lib/analytics/ga4.ts`
- `src/app/layout.tsx` (modify - add GA script)

**Environment variables:**
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`

**Implementation:**

```typescript
// src/lib/analytics/ga4.ts
export const GA4_EVENTS = {
  SIGNUP_COMPLETED: 'signup_completed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  MATCH_REVEALED: 'match_revealed',
  CAMPAIGN_VIEWED: 'campaign_viewed'
} as const

export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}
```

**Events to track:**
- Signup completed
- Onboarding step completed (with step number)
- Match revealed
- Campaign viewed
- Page views (automatic)

**Acceptance:**
- GA4 script loads on all pages
- Events appear in GA4 dashboard within 24 hours
- No PII logged (emails, names redacted)
- Respects user consent (GDPR placeholder - full compliance in Phase 6)

### Constraints
- OpenAI API calls must be rate-limited
- AI suggestions are optional (manual search still works)
- GA4 must not block page rendering (async script)
- No analytics in development mode

### Evidence Required
Save to `docs/evidence/block-5.2/`:

| Evidence | File |
|---|---|
| Gate output | `gates.txt` |
| AI suggestion screenshots | `ai-input.png`, `ai-suggestions.png`, `ai-selected.png` |
| GA4 dashboard screenshot | `ga4-events.png`, `ga4-realtime.png` |
| API response samples | `ai-api-response.json` |
| Rate limit test | `rate-limit-test.txt` |
| Mobile screenshots | `mobile-ai-suggest.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

Update `docs/governance/project_ledger.md` under Block 5.2. Mark as **`SUBMITTED`**.
