# Task 5.1 — Authentication Enhancements

**Block:** 5.1
**Status:** TODO
**Prerequisites:** Phase 4 COMPLETE, Sprint 0 COMPLETE
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Add Google OAuth signup and document upload for certifications to improve user experience and data collection.

---

## Deliverable 1: Google OAuth Signup

### Integration: Supabase Auth + Google Provider

**Files to modify:**
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/login/page.tsx`
- Environment variables

**Implementation:**

1. Configure Google OAuth in Supabase dashboard
2. Add environment variables:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=`

3. Update signup page:
   ```typescript
   // Add "Sign in with Google" button above form
   async function handleGoogleSignIn() {
     const { data, error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
         redirectTo: `${location.origin}/onboarding`
       }
     })
   }
   ```
   - Handle OAuth callback + profile creation

**Acceptance:**
- "Sign in with Google" button visible on `/signup` and `/login`
- Clicking button redirects to Google consent screen
- After Google auth, user redirected to `/onboarding` (if new) or `/dashboard` (if returning)
- Profile record created in `profiles` table with OAuth data
- Test with real Google account

---

## Deliverable 2: Document Upload (Certifications)

### Integration: Supabase Storage

**IMPORTANT:** Document upload is OPTIONAL. Users can skip during onboarding and upload later via Profile page. Admin can prompt users via dashboard notices.

**Files to create/modify:**
- `src/lib/supabase/storage.ts` (new utility)
- `src/app/profile/page.tsx` (add document upload section)
- `src/components/dashboard/AdminNotice.tsx` (new - for admin prompts)
- Database schema

**Schema changes:**

```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN certification_docs jsonb DEFAULT '[]'::jsonb;
-- JSONB structure: [{name: "ISO 9001", url: "https://...", uploadedAt: "2024-..."}]

-- New table: admin_notices (for admin → user prompts)
CREATE TABLE admin_notices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('document_upload_request', 'general', 'urgent')),
  title text NOT NULL,
  message text NOT NULL,
  dismissed boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

**Supabase Storage setup:**
1. Create bucket: `certification-documents`
2. Set policies: authenticated users can upload/read own files

**Implementation:**

```typescript
// src/lib/supabase/storage.ts
export async function uploadCertification(
  userId: string,
  file: File
): Promise<string> {
  const fileName = `${userId}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('certification-documents')
    .upload(fileName, file)

  if (error) throw error
  return supabase.storage
    .from('certification-documents')
    .getPublicUrl(fileName).data.publicUrl
}
```

**UI Changes:**

**1. Profile Page** (`/profile`) - Primary upload location
- Add "Certifications & Documents" section
- "Upload Certificate" button for each certification type
- Show uploaded files with download/delete options
- Store URLs in `certification_docs` JSONB column

**2. Onboarding Step 5** - Optional upload (skip allowed)
- "Upload Now (Optional)" button next to certifications
- "Skip for Now" button prominently displayed
- User can complete onboarding WITHOUT uploading documents

**3. Dashboard Notice Component** - Admin prompts
```typescript
// src/components/dashboard/AdminNotice.tsx
// Displays admin notices at top of dashboard
// Types: document_upload_request, general, urgent
// User can dismiss non-urgent notices
```

**Acceptance:**
- User can complete onboarding WITHOUT documents
- User can upload documents later via Profile page
- Admin can create notices prompting users to upload docs
- Notices appear on user dashboard
- User can dismiss notices (except urgent)
- PDF/JPG files (max 5MB each)
- Mobile responsive file picker

---

## Deliverable 3: Admin Notice System

### Purpose: Allow admin to send prompts/notices to users

**Use cases:**
1. Request document uploads from specific users
2. Send important updates (policy changes, new features)
3. Urgent notices (account issues, verification needed)

**Admin Interface** (`/admin/users/[id]`)
- "Send Notice" button on user detail page
- Form fields: Type (dropdown), Title, Message (textarea)
- Preview before sending

**API Route:**
```typescript
// POST /api/admin/notices
// Body: { userId, type, title, message }
// Creates notice record, user sees on next dashboard visit
```

**User Dashboard Display:**
- Banner at top of dashboard for active notices
- Different colors for types (blue=general, yellow=document_request, red=urgent)
- Dismiss button (sets dismissed=true, except for urgent)
- Urgent notices cannot be dismissed (require admin to revoke)

---

### Constraints
- Max file size: 5MB per document
- Allowed formats: PDF, JPG, PNG
- OAuth must work on both `/signup` and `/login`
- No breaking changes to existing email/password flow
- **Document upload is OPTIONAL** - users can skip and upload later
- Admin notices must be dismissible (except urgent type)

### Evidence Required
Save to `docs/evidence/block-5.1/`:

| Evidence | File |
|---|---|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| OAuth flow screenshots | `oauth-signup.png`, `oauth-login.png`, `oauth-google-consent.png`, `oauth-redirect.png` |
| Document upload screenshots | `profile-upload-before.png`, `profile-upload-after.png`, `cert-storage-bucket.png` |
| Onboarding skip flow | `onboarding-skip-docs.png` |
| Admin notice screenshots | `admin-send-notice.png`, `dashboard-notice-banner.png`, `notice-dismissed.png` |
| Mobile screenshots (375px) | `mobile-oauth.png`, `mobile-upload.png`, `mobile-notice.png` |

---

## Verification Gate

```bash
npm run build          # Must compile with 0 errors
npm run lint           # 0 errors
npm run ralph:scan     # Must pass (no P0 violations)
npm run test           # All tests pass
```

Update `docs/governance/project_ledger.md` under Block 5.1. Mark as **`SUBMITTED`**.
