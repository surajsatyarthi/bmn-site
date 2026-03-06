# Walkthrough — HOTFIX-3B & /logout Fix

**Date:** 2026-03-06
**Tier:** S
**Branch:** fix/onboarding-profile-insert
**PR:** #46

---

## What Was Fixed

1. **Onboarding Profile Creation Error (G11 Finding)**
   - **Bug:** During G11 manual testing, it was discovered that new user signup reached `/onboarding` but failed with a "Service temporarily unavailable" error.
   - **Root Cause:** The `onboarding/page.tsx` was using a raw Drizzle insert (`db.insert(profiles)`) to create the user's initial profile row. Because the production `DATABASE_URL` connects via the Supabase Transaction Pooler, it strips the authenticated session context. The resulting `auth.uid()` evaluation in Postgres was `NULL`, which tripped the Row Level Security (RLS) policy `WITH CHECK (auth.uid() = id)` and blocked the insert.
   - **Fix:** Refactored the profile creation step to use the authenticated Supabase Server Client (`supabase.from('profiles').insert(...)`). This client attaches the user's JWT to the request, satisfying the RLS policy while bypassing the pooler session limitation.

2. **`/logout` Route 404**
   - **Bug:** Navigating to `businessmarket.network/logout` directly returned a 404.
   - **Fix:** Created a new Next.js Route Handler at `src/app/logout/route.ts` that safely calls `supabase.auth.signOut()` on the server and issues a `NextResponse.redirect` back to `/login`.

---

## Evidence & Automated Testing

### Playwright / CI
- PR #46 will run the standard Ralph Protocol CI gates automatically.

### G11 Test Screenshots
These screenshots confirm the email verification flow works and that the amber beta banner is successfully rendering on the onboarding flow:

- **Inbox:** ![Guerrilla Inbox](/Users/user/.gemini/antigravity/brain/9e19411e-eb8e-444e-80bc-749f23d20850/guerrilla_mail_inbox_clean_1772759905230.png)
- **Signup Confirmed:** ![Signup Confirmed](/Users/user/.gemini/antigravity/brain/9e19411e-eb8e-444e-80bc-749f23d20850/signup_confirmation_1772760023483.png)
- **Email Received:** ![Email Received](/Users/user/.gemini/antigravity/brain/9e19411e-eb8e-444e-80bc-749f23d20850/verification_email_inbox_1772760064141.png)
- **Onboarding Banner (Pre-Fix Error State):** ![Onboarding Banner](/Users/user/.gemini/antigravity/brain/9e19411e-eb8e-444e-80bc-749f23d20850/onboarding_error_banner_visible_1772760256795.png)

> **Note:** The G11 test was paused at the profile creation step to implement the RLS bypass fix documented above. A final end-to-end verification will be performed once PR #46 is deployed to Vercel/Production.

---

## Standing Orders Updated

During this session, `docs/STANDING_ORDERS.md` and `docs/TEST_ACCOUNTS.md` were permanently updated to enforce **Guerrilla Mail** as the ONLY approved disposable email service for testing, as alternatives like `temp-mail.org` are blocked by Cloudflare and break automation routines.
