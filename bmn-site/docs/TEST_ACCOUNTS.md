# BMN — Test Accounts & Testing Protocol

> **SINGLE SOURCE OF TRUTH** — Check here before creating any account or script.
> Last updated: 2026-02-28

---

## 🚨 The Two Rules (Non-Negotiable)

**Rule 1 — NEVER create test accounts via the signup form.**
The signup form sends a verification email. If the email isn't real and accessible, the account is stuck forever unverified. Use the Supabase Admin API instead — it creates accounts pre-verified.

**Rule 2 — NEVER hardcode `bmn.site` or any domain that isn't the real app.**
The real app lives on Vercel. Playwright tests run against `localhost:3000` in CI (the `webServer` config starts a dev server). `PLAYWRIGHT_BASE_URL` secret must be `http://localhost:3000` or EMPTY.

---

## 📋 Account Registry

### Permanent Test Accounts (never delete)

| # | Email | Auth Method | Password | Plan | Onboarding | Purpose |
|---|-------|------------|----------|------|------------|---------|
| 1 | `tester@businessmarket.network` | Email+Password | See GitHub Secret `TEST_USER_PASSWORD` | free | ✅ complete (HS 33) | CI Playwright tests + CEO manual testing |
| 2 | `suraj@...` (CEO) | Google OAuth | N/A | premium_plus | ✅ complete | Real owner account — NEVER use in tests |

### Known Zombie Accounts (unverified — cannot log in)

These accounts exist in Supabase Auth but were created via signup form and never verified. They are dead weight. **Delete them.**

| Email | Issue | Action |
|-------|-------|--------|
| `tester.bmn@gmail.com` | Google OAuth account — no password. Cannot log in with email+password. | **Delete or reset password via Admin API** |
| Any `@temp*` or `@fake*` addresses | Created by Antigravity during testing, never verified | **Delete all** |

---

## 🔧 How to Create a Test Account (Correct Method)

Use the Supabase Admin API with the `service_role` key. This creates a fully verified account with no email required.

**Script location**: `scripts/create-test-account.js` (canonical — do NOT create new ad-hoc scripts)

```javascript
// scripts/create-test-account.js
// Usage: node scripts/create-test-account.js
// Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createTestAccount() {
  // Step 1: Create auth user (pre-verified, no email confirmation needed)
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: 'tester@businessmarket.network',
    password: process.env.TEST_USER_PASSWORD,
    email_confirm: true,       // Skip email verification entirely
  });

  if (authError) {
    console.error('Auth creation failed:', authError.message);
    process.exit(1);
  }

  console.log('Auth user created:', authUser.user.id);

  // Step 2: Create profile row with onboarding complete + HS 33 (cosmetics)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authUser.user.id,
      full_name: 'E2E Tester',
      trade_role: 'exporter',
      plan: 'free',
      onboarding_completed: true,
      onboarding_step: 7,
    });

  if (profileError) {
    console.error('Profile creation failed:', profileError.message);
    process.exit(1);
  }

  console.log('✅ Test account ready: tester@businessmarket.network');
  console.log('   Password: from TEST_USER_PASSWORD env var');
  console.log('   Onboarding: complete (HS 33)');
}

createTestAccount();
```

**Run it once:**
```bash
cd bmn-site
TEST_USER_PASSWORD=<strong-password> node scripts/create-test-account.js
```

---

## 🔐 GitHub Secrets (CI Configuration)

| Secret | Correct Value | Current (Wrong) Value |
|--------|--------------|----------------------|
| `TEST_USER_EMAIL` | `tester@businessmarket.network` | `tester.bmn@gmail.com` (Google OAuth — no password) |
| `TEST_USER_PASSWORD` | A strong password set when creating the account | Unknown |
| `PLAYWRIGHT_BASE_URL` | `http://localhost:3000` OR **delete this secret entirely** | `https://bmn.site` (doesn't exist) |
| `NEXT_PUBLIC_SUPABASE_URL` | From `.env.local` | ✅ Correct |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `.env.local` | ✅ Correct |

**Why localhost for Playwright?** The `playwright.yml` CI workflow runs `npm run dev` via `webServer`. The tests run against that local server. Setting `PLAYWRIGHT_BASE_URL` to an external domain bypasses the local server and breaks tests when that domain is wrong.

---

## 🏃 CEO Manual Testing (Right Now)

**The app URL**: Check Vercel dashboard for the current production URL.
Production deployment (2026-02-26 snapshot): `https://bmn-site-hnmku52h6-bmns-projects-cf9c12cf.vercel.app`

**To log in**: Use `tester@businessmarket.network` + password from GitHub Secrets `TEST_USER_PASSWORD`.

**Note**: PRs #26 and #32 are approved but not yet merged. The production URL reflects main branch — which does NOT include the match engine or Playwright updates yet. To test those features, use the Vercel preview URLs for those PRs.

---

## 🚫 What Antigravity Must NEVER Do

| Banned Action | Why | Correct Alternative |
|---|---|---|
| Create account via signup form | Verification email goes nowhere | Use Admin API (`createUser` with `email_confirm: true`) |
| Use `bmn.site` as base URL | Domain doesn't exist | Use `localhost:3000` or actual Vercel URL |
| Use `@gmail.com` accounts for email+password tests | Gmail accounts via Google OAuth have no password | Use `@businessmarket.network` accounts created via Admin API |
| Create one-off scripts (`create-test-user.js`, `insert-auth-user.js`, etc.) | Undocumented, duplicated, left as repo clutter | Use `scripts/create-test-account.js` only |
| Hardcode passwords or emails in test files | Security risk | Use `process.env.TEST_USER_EMAIL` / `process.env.TEST_USER_PASSWORD` |

---

## 🧹 Cleanup Checklist

- [ ] Delete zombie accounts from Supabase Auth (unverified emails, temp addresses)
- [ ] Delete `tester.bmn@gmail.com` OR reset its password via Admin API
- [ ] Update GitHub Secret `TEST_USER_EMAIL` → `tester@businessmarket.network`
- [ ] Update GitHub Secret `TEST_USER_PASSWORD` → new strong password
- [ ] Update (or delete) GitHub Secret `PLAYWRIGHT_BASE_URL` → `http://localhost:3000`
- [ ] Delete loose scripts from `bmn-site/` root (non-canonical scripts)
- [ ] Create canonical `scripts/create-test-account.js` (one script, committed)
