# BMN Site - Quick Setup Guide

## ✅ What's Been Created

Your new BMN site is ready with:
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS configured with BMN design system
- ✅ Inter + Oswald fonts loaded
- ✅ Supabase authentication setup
- ✅ Login page (`/login`)
- ✅ Signup page (`/signup`)

## 🚀 Next Steps

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - **Name**: BMN
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your users
4. Wait for project to finish setting up (2-3 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (long string starting with `eyJ`)

### 3. Configure Environment Variables

1. In your project, copy the example file:
   ```bash
   cd /Users/surajsatyarthi/Projects/active/BMN/bmn-site
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-actual-key
   ```

### 4. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Test Your Auth Pages

- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup

## 📐 Design System

Your site uses the BMN design system from your invoice:

**Colors:**
- Primary Blue: `#2046f5`
- Orange Accent: `#FF8C00`
- Light Background: `#F8F9FA`

**Fonts:**
- Body: Inter (400, 600, 700, 800)
- Headlines: Oswald Bold

## 📁 Project Structure

```
bmn-site/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Homepage (to be built)
│   ├── login/
│   │   └── page.tsx    # ✅ Login page
│   └── signup/
│       └── page.tsx    # ✅ Signup page
├── lib/
│   └── supabase/
│       └── client.ts   # Supabase client utility
└── components/         # Reusable components (to be added)
```

## 🎨 How to Use BMN Design

### Buttons
```tsx
<button className="bg-bmn-blue text-white py-3 px-6 rounded-md font-bold text-sm uppercase hover:opacity-90">
  Click Me
</button>
```

### Cards
```tsx
<div className="bg-bmn-light-bg border border-bmn-border rounded-lg p-4">
  Card content
</div>
```

### Headers
```tsx
<h1 className="font-display text-2xl font-bold uppercase text-bmn-blue">
  Headline
</h1>
```

## 🔜 Next Pages to Build

1. **Homepage** - Landing page with BMN branding
2. **EaaS** - Export as a Service page
3. **Trade Missions** - Trade missions page
4. **Dashboard** - User dashboard (after login)

---

**Ready to test?** Follow steps 1-5 above and your auth system will be live!
