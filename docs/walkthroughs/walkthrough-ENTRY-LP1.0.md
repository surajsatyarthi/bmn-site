# Walkthrough: ENTRY-LP1.0 Homepage Copy Overhaul

## What changed
Updated all hardcoded marketing copy in `src/app/page.tsx` from the original consultancy business model to the scalable data product format. This includes the Hero subtext, `IMPACT_NUMBERS`, `PERFECT_FOR`, `PROFILE_BENEFITS`, `FREE_FEATURES`, `PRO_FEATURES`, `PARTNER_FEATURES`, How It Works cards, Why BMN cards, CTA banner, footer tagline, and `FAQ_ITEMS`.

## Why it was changed
The product pivoted from a done-for-you consultancy to a self-serve global trade intelligence platform. The old copy referenced guarantees, manual email tools, and incorrect credit values that no longer match the Hunter and Partner pricing models.

## How to verify it's working
1. Visit the homepage on preview or production.
2. Check that the hero CTA reads "Includes 5 Free Reveals/month".
3. Check that the impact numbers reflect "4.4M+" companies and "60+" countries.
4. Verify the features reflect the Hunter and Partner tiers accurately, without "done-for-you" email promises for free/Hunter users.

## How to roll back if it breaks
Revert the PR or revert commit in `src/app/page.tsx`. There are no database migrations or new dependencies involved in this change.
