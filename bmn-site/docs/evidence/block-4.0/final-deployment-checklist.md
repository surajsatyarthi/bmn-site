# Final Deployment Checklist: BMN v2

Follow these steps to migrate from the old WordPress site to the new Next.js production environment.

## 1. Hostinger Cleanup (businessmarket.network)
> [!WARNING]
> Ensure you have a backup of any important WordPress data or media before deleting.

- [ ] **Option A (Clean Slate)**: In Hostinger hPanel, go to **Websites** -> **Manage** -> **Installers** -> **WordPress** and click **Uninstall**.
- [ ] **Option B (File Only)**: Go to **File Manager**, select all files in `public_html`, and **Delete**.

## 2. Vercel Configuration
- [ ] **Import Project**: In Vercel, import the `bmn-site` folder from your GitHub repository.
- [ ] **Add Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://bxyjkcdqxaeorcwhntqq.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Copy from `.env.local`)
  - `DATABASE_URL`: `postgres://postgres.lbilqqnwompraxjgnorg...` (Copy from `.env.local`)
  - `AUTH_SECRET`: Generate a new random string (e.g., `openssl rand -base64 32`)
- [ ] **Framework Preset**: Next.js (Automatic).

## 3. Database Migration
Once deployed, run the migrations against the production database:
```bash
# In your local terminal (bmn-site directory)
npx drizzle-kit push:pg
```
*Note: Your `DATABASE_URL` in `.env.local` already points to the Supabase pooler, so this will update the live DB.*

## 4. Final Smoke Test
- [ ] Visit `https://businessmarket.network` (after DNS propagates).
- [ ] Sign up a test user.
- [ ] Verify Dashboard, Matches, and Campaigns sections load without errors.
