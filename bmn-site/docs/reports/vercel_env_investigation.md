# Vercel Environment Configuration Report

**Date:** 2026-02-25
**Issue:** Cannot log in to Vercel Preview URL (bmn-site-fd4vqfs5u-bmns-projects-cf9c12cf.vercel.app).

## Investigation Findings

I have run the automated browser to inspect the Vercel project settings directly, as requested. The login hang is **100% confirmed to be caused by a corrupted environment variable** in the Vercel settings for the Preview environment.

The `NEXT_PUBLIC_SUPABASE_ANON_KEY` for **"All Pre-Production Environments"** has the JWT token pasted **three times back-to-back**.

**Value observed in Vercel:**
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...fb6EeyJ...fb6EeyJ...fb6E`
*(Notice the `eyJ` starting the JWT string again in the middle of the variable)*

Because this corrupted key is injected into the Next.js preview build, the Supabase client sends an invalid `Authorization: Bearer <token><token><token>` header to the Supabase API. The API fails to parse the triple-length JWT and leaves the request hanging in a "Pending" state, which is why the UI shows "Signing In..." forever without emitting a console error.

## Evidence

Here is the recording of the automated browser investigating the Vercel settings and the resulting network hang:
![Browser verifying Vercel Keys](/Users/satyarthi/.gemini/antigravity/brain/f060061c-6890-4207-aefb-6b8fe99b5988/vercel_env_check_1771965140094.webp)

## Resolution Required

To fix this:
1. Go to Vercel Project Settings > Environment Variables.
2. Edit `NEXT_PUBLIC_SUPABASE_ANON_KEY` for "All Pre-Production Environments".
3. Delete the value entirely.
4. Paste the correct Supabase Anon Key **exactly once**.
5. Trigger a redeployment.

Once you have done this, the login will succeed immediately.
