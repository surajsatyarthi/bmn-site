# Manual Screenshot Guide - Block 4.0 E2E Flow

This guide will help you quickly capture the remaining E2E flow screenshots needed for Block 4.0 evidence.

**Estimated time:** 10-15 minutes

---

## Prerequisites

1. ✅ Dev server running (`npm run dev`)
2. ✅ Browser ready
3. ✅ Test email ready (use your personal email OR a temp email service)

---

## Part 1: Complete Signup Flow (5 mins)

### Step 1: Fresh Signup
1. Open **incognito/private window**
2. Navigate to `http://localhost:3000/signup`
3. Fill form with:
   - Full Name: `Block 4 Evidence Test`
   - Email: `[your-email]@gmail.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - ✅ Check "I agree to Terms"
4. **BEFORE clicking submit:**
   - 📸 Screenshot → Save as `step2a-signup-filled.png`
5. Click "Create Account"
6. Should redirect to verify-email page
   - 📸 Screenshot → Save as `step2b-verify-email.png` (if different from existing)

### Step 2: Check Email & Verify
1. Open your email inbox
2. Find verification email from Supabase
3. Click verification link
4. Should redirect to onboarding

---

## Part 2: Onboarding Flow (6 steps × ~1 min each)

### Step 3: Trade Role
- 📸 Screenshot → `step3a-onboarding-trade-role.png`
- Select your role (e.g., "Exporter")
- Click "Continue"

### Step 4: Products/Services
- 📸 Screenshot → `step3b-onboarding-products.png`
- Enter product (e.g., "Electronics")
- Click "Continue"

### Step 5: Target Countries
- 📸 Screenshot → `step3c-onboarding-countries.png`
- Select countries (e.g., "United States")
- Click "Continue"

### Step 6: Business Info
- 📸 Screenshot → `step3d-onboarding-business.png`
- Enter business name
- Click "Continue"

### Step 7: Additional Info (if exists)
- 📸 Screenshot → `step3e-onboarding-additional.png`
- Complete any additional steps
- Click "Continue"

### Step 8: Completion
- 📸 Screenshot → `step3f-onboarding-complete.png`
- Click "Go to Dashboard" or "Finish"

---

## Part 3: Main App Pages (2 mins)

### Step 9: Dashboard
- Should auto-redirect after onboarding
- 📸 Screenshot → `step4-dashboard.png`

### Step 10: Matches Page
- Click "Matches" in navigation
- 📸 Screenshot → `step5-matches.png`

### Step 11: Profile Page
- Click "Profile" in navigation
- 📸 Screenshot → `step6-profile.png`

---

##Part 4: Logout & Login (2 mins)

### Step 12: Logout
- Click logout button
- 📸 Screenshot of login page → `step7-after-logout.png`

### Step 13: Login Again
- Enter same credentials
- 📸 Screenshot before clicking  → `step8-login-filled.png`
- Click "Sign In"
- Should return to dashboard
- 📸 Screenshot → `step9-dashboard-return.png`

---

## Saving Screenshots

Save all screenshots to:
```
docs/evidence/block-4.0/e2e-flow-screenshots/
```

**File naming convention:** Use exact names from this guide for consistency.

---

## After Completion

Ping me when done, and I'll:
1. Verify all screenshots are present
2. Create error handling screenshots
3. Capture loading/empty states
4. Generate final walkthrough document
5. Run Ralph gates one final time

---

## Quick Checklist

- [ ] Step 2a: Signup filled form
- [ ] Step 2b: Verify email screen
- [ ] Step 3a: Trade role
- [ ] Step 3b: Products
- [ ] Step 3c: Countries
- [ ] Step 3d: Business info
- [ ] Step 3e: Additional (if exists)
- [ ] Step 3f: Complete
- [ ] Step 4: Dashboard
- [ ] Step 5: Matches
- [ ] Step 6: Profile
- [ ] Step 7: After logout
- [ ] Step 8: Login filled
- [ ] Step 9: Dashboard return
