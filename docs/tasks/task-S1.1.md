# Task S1.1 — Rate Limiting & API Security

**Block:** S1.1 (Security Sprint 1)
**Status:** TODO
**Prerequisites:** Phase 5 COMPLETE (all user-facing features operational)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Implement rate limiting and API security measures to prevent abuse, DDoS attacks, and ensure fair usage across all endpoints.

---

## Deliverable 1: API Rate Limiting Middleware

### Implementation: Upstash Redis + @upstash/ratelimit

**Install dependencies:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Environment variables:**
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

**Middleware:** `src/middleware/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
})

export async function rateLimit(identifier: string, limit: number, window: string) {
  const { success, pending, limit: maxLimit, remaining, reset } = await ratelimit.limit(identifier)
  return { success, remaining, reset }
}
```

---

## Deliverable 2: Per-Endpoint Rate Limits

### Tier 1: Authentication (Strict)
- `/api/auth/login` → 5 requests / 15 min per IP
- `/api/auth/signup` → 3 requests / hour per IP
- `/api/auth/forgot-password` → 3 requests / hour per IP
- **Reason:** Prevent brute force attacks

### Tier 2: Writes (Moderate)
- `/api/profile` PATCH → 10 requests / min per user
- `/api/products` POST/DELETE → 20 requests / min per user
- `/api/matches/reveal` POST → 5 requests / hour per user (free tier)
- **Reason:** Prevent spam, abuse of free tier

### Tier 3: Reads (Lenient)
- `/api/matches` GET → 100 requests / min per user
- `/api/campaigns` GET → 100 requests / min per user
- `/api/news` GET → 200 requests / min per user
- **Reason:** Allow normal browsing, prevent scraping

### Tier 4: File Uploads (Strict)
- `/api/upload/certification` → 3 files / hour per user
- Max file size: 5MB (already enforced)
- **Reason:** Prevent storage abuse

### Tier 5: Email/Notifications (Very Strict)
- Campaign email sends → 10 emails / hour per user (existing constraint)
- Admin notices → 5 notices / hour per admin
- **Reason:** Prevent spam, respect email provider limits

---

## Deliverable 3: Rate Limit Response Handling

### HTTP 429 Response

```typescript
// When rate limit exceeded
return new Response(
  JSON.stringify({
    error: 'Rate limit exceeded',
    retryAfter: reset, // seconds until reset
    limit: maxLimit,
    remaining: 0
  }),
  {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(reset),
      'X-RateLimit-Limit': String(maxLimit),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(reset),
    }
  }
)
```

### Client-side handling

```typescript
// Automatic retry with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options)
    if (response.status !== 429) return response
    
    const retryAfter = parseInt(response.headers.get('Retry-After') || '60')
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
  }
  throw new Error('Max retries exceeded')
}
```

---

## Deliverable 4: IP-based vs User-based Limiting

**IP-based (unauthenticated):**
- Auth endpoints (/login, /signup)
- Public landing page API calls
- Prevents account enumeration

**User-based (authenticated):**
- All dashboard API routes
- Uses `user.id` as identifier
- Prevents abuse by logged-in users

**Hybrid (both):**
- File uploads: IP + user
- Password reset: IP + email hash

---

## Deliverable 5: Admin Bypass & Monitoring

### Admin bypass
- Admin users exempt from rate limits
- Check `profile.role === 'admin'` before applying limits

### Rate limit dashboard
- Route: `/admin/security/rate-limits`
- Shows: Top rate-limited IPs, user abuse patterns
- Actions: Block IP (add to blocklist), adjust limits per user

### Logging
- Log all 429 responses to DB
- Schema:
```sql
CREATE TABLE rate_limit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint text NOT NULL,
  identifier text NOT NULL, -- IP or user_id
  limit_type text NOT NULL, -- 'ip', 'user', 'hybrid'
  timestamp timestamp DEFAULT now()
);
```

---

## Deliverable 6: CSRF Protection

**Install:**
```bash
npm install csrf
```

**Implementation:**
- Generate CSRF token on page load
- Include in all POST/PATCH/DELETE requests
- Validate on server before processing

**Next.js middleware:**
```typescript
// src/middleware/csrf.ts
import { NextRequest, NextResponse } from 'next/server'

export function validateCsrfToken(req: NextRequest) {
  const token = req.headers.get('x-csrf-token')
  const cookieToken = req.cookies.get('csrf-token')?.value
  
  if (token !== cookieToken) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
}
```

---

## Deliverable 7: Security Headers

**Add to next.config.js:**

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ]
}
```

---

## Constraints

- Upstash Redis required (free tier: 10k requests/day)
- Rate limits configurable via env vars (not hardcoded)
- Admin can adjust limits per user via dashboard
- No rate limiting on critical health checks (`/api/health`)
- Rate limit headers included in all responses
- Graceful degradation if Redis unavailable (log warning, allow request)

---

## Evidence Required

Save to `docs/evidence/block-S1.1/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| Rate limit test | `rate-limit-test.txt` (trigger 429, verify retry-after) |
| Login rate limit | `login-rate-limit-429.png` |
| API 429 response | `api-rate-limit-response.txt` |
| Admin dashboard | `admin-rate-limit-dashboard.png` |
| Security headers | `security-headers-test.txt` (securityheaders.com scan) |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Trigger rate limit on /login (6 requests in 15 min) → verify 429
2. Check Retry-After header → wait → verify request succeeds
3. Admin user → verify not rate limited
4. Check security headers → verify all present
5. CSRF test → submit form without token → verify 403

**Security scans:**
- OWASP ZAP scan → 0 high/medium vulnerabilities
- securityheaders.com → A+ rating

Update `docs/governance/project_ledger.md` under Block S1.1. Mark as **SUBMITTED**.
