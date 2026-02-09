import { test, expect, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const EVIDENCE_DIR = path.join(process.cwd(), 'docs/evidence/block-4.0/mobile-screenshots');

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

test.use({ ...devices['iPhone SE'] }); // Use iPhone SE device descriptor (375x667)

test('Block 4.0 Mobile Audit - Unified Flow (375px)', async ({ page }) => {
  // Unique user for this run
  const timestamp = Date.now();
  const email = `mobile_${timestamp}@test.local`;
  const password = 'Password123!';

  console.log(`Starting Mobile E2E test with user: ${email}`);

  // Hide Tawk.to widget to prevent click interception
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      iframe[title*="chat"], 
      div[class*="widget"],
      #tawk-chat-widget-container { 
        display: none !important; 
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  });



  // 1. Landing Page
  await page.goto('/');
  await expect(page.getByText('Get Organic Leads')).toBeVisible(); 
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_landing_page.png'), fullPage: true });
  console.log('Captured: mobile_landing_page.png');

  // 2. Signup Page
  // Target specific Hero CTA to avoid ambiguity
  const heroCta = page.getByRole('link', { name: 'Get Started Free' });
  if (await heroCta.isVisible()) {
      await heroCta.click({ force: true });
  } else {
      // Fallback or if generic "Get Started" is needed, use direct nav
      await page.goto('/signup'); 
  }
  
  await expect(page).toHaveURL(/\/signup/);
  await expect(page.locator('input#email')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_signup_page.png'), fullPage: true });
  console.log('Captured: mobile_signup_page.png');

  // Fill Signup
  console.log('Filling signup form...');
  await page.fill('input#fullName', 'Mobile Test User');
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.fill('input#confirmPassword', password);
  await page.check('input#terms');
  await page.click('button[type="submit"]', { force: true });


  // Expect Redirect to Onboarding
  await expect(page).toHaveURL(/\/onboarding/, { timeout: 20000 });
  console.log('Redirected to /onboarding');

  // 3. Onboarding Class 1: Trade Role
  await expect(page.getByText('What do you do?')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_onboarding_step1_role.png'), fullPage: true });
  
  await page.click('text=I Export Goods', { force: true }); 
  await page.click('button:has-text("Next Step")', { force: true });

  // 4. Onboarding Class 2: Products
  await expect(page.getByText('What products do you handle?')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_onboarding_step2_products.png'), fullPage: true });

  // Search and Select Product
  await page.fill('input[placeholder*="Search by product name"]', 'Coffee');
  await expect(page.locator('div.max-h-64 button').first()).toBeVisible();
  await page.locator('div.max-h-64 button').first().click();
  
  await page.click('button:has-text("Next Step")', { force: true });

  // 5. Onboarding Class 3: Trade Interests
  await expect(page.getByText('Where do you want to trade?')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_onboarding_step3_interests.png'), fullPage: true });
  
  await page.fill('input[placeholder="Search countries..."]', 'United');
  await expect(page.getByText('United States')).toBeVisible();
  await page.click('text=United States', { force: true });
  
  await page.click('button:has-text("Next Step")', { force: true });

  // 6. Onboarding Class 4: Business Details
  await expect(page.getByText('Business Details')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_onboarding_step4_business.png'), fullPage: true });
  
  await page.fill('input[name="companyName"]', 'Mobile Corp');
  await page.selectOption('select[name="yearEstablished"]', { label: '2021' });
  await page.selectOption('select[name="employeeStrength"]', '1-10');
  
  await page.fill('input[name="street"]', 'Mobile Way');
  await page.fill('input[name="city"]', 'App Town');
  await page.fill('input[name="state"]', 'iOS');
  await page.selectOption('select[name="country"]', { label: 'United Kingdom' }); 

  await page.fill('input[name="pinCode"]', 'SW1A 1AA');
  await page.fill('input[name="lastYearExportUsd"]', '0.5');

  // Export Countries
  const countryCheckbox = page.locator('label').filter({ hasText: 'France' });
  await countryCheckbox.scrollIntoViewIfNeeded();
  await countryCheckbox.click({ force: true });

  await page.click('button:has-text("Next Step")', { force: true });

  // 7. Onboarding Step 5: Certifications
  await expect(page.getByRole('heading', { name: 'Certifications' })).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_onboarding_step5_certifications.png'), fullPage: true });

  await page.click('button:has-text("ISO 14001")', { force: true });
  await page.click('button:has-text("Next Step")', { force: true });

  // 8. Onboarding Step 6: Review
  await expect(page.getByText('Almost Done!')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_onboarding_step6_review.png'), fullPage: true });
  
  // Finish
  await page.click('button:has-text("Finish Setup")', { force: true });

  // 9. Dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
  await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 15000 });
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'mobile_dashboard.png'), fullPage: true });
  console.log('Captured: mobile_dashboard.png');
});
