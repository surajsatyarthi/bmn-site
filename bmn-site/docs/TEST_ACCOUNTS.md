# BMN — Service Accounts & Test Credentials

> **IMPORTANT**: This is the single source of truth for all service logins,
> test accounts, and database state. Check here FIRST. Do NOT ask the PM.

---

## Service Accounts

| Service   | Notes                              |
| --------- | ---------------------------------- |
| Supabase  | Dashboard: https://supabase.com — check `.env.local` or Vercel env vars |
| GitHub    | Repo: surajsatyarthi/bmn-site      |
| Vercel    | Org: BMN's projects — linked to GitHub |
| Resend    | Domain: businessmarket.network     |

## Supabase Project

| Key             | Value                                      |
| --------------- | ------------------------------------------ |
| Project Ref     | `bxyjkcdqxaeorcwhntqq`                    |
| URL             | `https://bxyjkcdqxaeorcwhntqq.supabase.co`|
| Region          | ap-south-1 (AWS Mumbai)                    |
| Org ID          | `qorgnalfiubluwwnumht`                    |

> **Free tier auto-pauses after ~7 days of inactivity.**
> Resume at: supabase.com → project → Resume project

---

## Auth Users (5 total — verified 2026-02-26)

Check Supabase Dashboard → Authentication → Users for the full list.

### Profiles Table State (4 rows)

| # | full_name     | onboarding_completed | plan         | trade_role |
|---|---------------|---------------------|--------------|------------|
| 1 | Suraj Test    | true                | premium_plus | exporter   |
| 2 | Tester BMN    | true                | free         | exporter   |
| 3 | Block4 Tester | true                | free         | importer   |
| 4 | tester.bmn    | false (step 1)      | free         | exporter   |

### Critical: Auth ↔ Profile Mismatch

- Some auth users have **no matching profile row** → dashboard crashes
- `/onboarding` auto-creates profiles (fix in PR #22)

---

## Middleware Auth Bypass (dev / CI only)

Enabled when `NODE_ENV !== 'production'` OR `NEXT_PUBLIC_TEST_MODE=true`.

| Header                      | Effect                                         |
| --------------------------- | ---------------------------------------------- |
| `x-test-auth-bypass: true`  | Authenticates as mock user (email confirmed)   |
| `x-test-unconfirmed: true`  | Authenticates as mock user (email NOT confirmed)|

Mock user ID: `d2d4586e-9646-4b16-b363-c301ada79540`

> **Note**: The bypass only skips middleware auth. Dashboard pages still query the
> DB for a profile row. For dashboard screenshots, use a real verified account.
