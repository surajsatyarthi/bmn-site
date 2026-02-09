# Task 5.6 — Profile Editing & Management

**Block:** 5.6
**Status:** TODO
**Prerequisites:** Phase 2 COMPLETE (Profile page exists as read-only)
**Standing Orders:** DoD v2.0 applies (4 gates)

---

## Objective

Enable users to view and edit their profile data after onboarding. Currently profile page is read-only (Edit button disabled at line 58-63).

---

## Deliverable 1: Edit Profile UI

**Current state:** `/profile` shows data, "Edit Profile" button disabled

**Required changes:**

1. **Enable Edit Button**
   - Remove `disabled` prop
   - Add click handler → toggle edit mode

2. **Edit Mode Toggle**
   ```typescript
   const [isEditing, setIsEditing] = useState(false)
   // View mode: show data (current)
   // Edit mode: show forms with pre-filled values
   ```

3. **Editable Sections**
   - Personal Info (name, email, phone)
   - Company Info (name, website, founding year)
   - Products (add/remove HS codes)
   - Target Markets (add/remove countries)
   - Certifications (add/remove)
   - Account Settings (password change)

---

## Deliverable 2: Edit Forms

**Personal Info:**
- Full name (text input)
- Email (read-only, managed by Supabase Auth)
- Phone, WhatsApp (text inputs)

**Company Info:**
- Company name, website, founding year
- Same validation as onboarding

**Products:**
- "+ Add Product" button → HS code search component (reuse from onboarding)
- "Remove" button per product
- Min 1 product required

**Target Markets:**
- "+ Add Market" → country selector
- Remove button per country

**Certifications:**
- Checkbox list (reuse from onboarding)
- Document upload (Block 5.1 feature)

**Account Settings:**
- "Change Password" button → modal with old/new password fields
- Uses Supabase `updateUser()` API

---

## Deliverable 3: Save/Cancel Actions

**Save button:**
- Validate all fields (Zod schemas from onboarding)
- Call API routes:
  - `PATCH /api/profile` (personal + company)
  - `POST/DELETE /api/products`
  - `POST/DELETE /api/trade-interests`
  - `POST/DELETE /api/certifications`
- Show success toast
- Exit edit mode

**Cancel button:**
- Discard changes
- Revert to view mode
- No API calls

**Optimistic updates:**
- Update UI immediately
- Rollback on API error

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/profile` | PATCH | Update name, phone, company info |
| `/api/products` | POST | Add product |
| `/api/products/[id]` | DELETE | Remove product |
| `/api/trade-interests` | POST | Add country |
| `/api/trade-interests/[id]` | DELETE | Remove country |
| `/api/certifications` | POST | Add certification |
| `/api/certifications/[id]` | DELETE | Remove certification |

---

## Constraints

- Cannot change email (Supabase Auth managed)
- Cannot change trade role (exporter/importer) after onboarding
- Min 1 product required (cannot delete all)
- All validation same as onboarding
- Mobile responsive (375px)
- Loading states + error handling

---

## Evidence Required

Save to `docs/evidence/block-5.6/`:

| Evidence | File |
|----------|------|
| Gate output | `gates.txt` |
| Pre-submission gate | `pre-submission-gate.txt` |
| Self-audit | `self-audit.txt` |
| Test output | `test-output.txt` |
| View mode | `profile-view-mode.png` |
| Edit mode | `profile-edit-mode.png` |
| Edit company | `profile-edit-company.png` |
| Edit products | `profile-edit-products.png` |
| Edit markets | `profile-edit-markets.png` |
| Save success | `profile-save-success.png` |
| Mobile | `mobile-profile-edit.png` |

---

## Verification Gate

```bash
npm run build
npm run lint
npm run ralph:scan
npm run test
```

**Manual tests:**
1. Click "Edit Profile" → forms appear with pre-filled data
2. Edit company name → Save → verify updated
3. Add product → Save → verify appears on profile
4. Remove market → Save → verify removed
5. Cancel → verify changes discarded
6. Mobile 375px → responsive

Update `docs/governance/project_ledger.md` under Block 5.6. Mark as **SUBMITTED**.
