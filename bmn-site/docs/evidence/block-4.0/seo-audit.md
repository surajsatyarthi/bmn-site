# SEO Audit: Block 4.0

This audit verifies that all public and dashboard pages have unique, optimized metadata.

## 🏁 Audit Results

| Route | Title | Description | Status |
| :--- | :--- | :--- | :--- |
| `/` | BMN - We Find Your Buyers. You Ship. | BMN connects Indian exporters with verified international buyers... | ✅ |
| `/dashboard` | Dashboard | BMN | Manage your trade profile, view your matches... | ✅ |
| `/matches` | Your Matches | BMN | View verified international buyers matched to your products... | ✅ |
| `/campaigns` | Your Campaigns | BMN | Track the status of outreach campaigns BMN runs on your behalf... | ✅ |
| `/profile` | Your Trade Profile | BMN | Manage and update your export business details, products... | ✅ |
| `/contact` | Contact Us | BMN | Get in touch with BMN for any questions regarding... | ✅ |
| `/privacy` | Privacy Policy | BMN | Understand how BMN collects, uses, and protects your information. | ✅ |
| `/terms` | Terms and Conditions | BMN | Read the terms and conditions for using the BMN platform. | ✅ |
| `/refund` | Refund Policy | BMN | Information regarding refunds for BMN service tiers. | ✅ |

## 🛠️ Verification Method
- Verified by checking `export const metadata` in each `page.tsx` file.
- Verified that `Metadata` is imported from `next`.
