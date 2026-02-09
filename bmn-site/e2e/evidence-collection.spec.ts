import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const EVIDENCE_DIR = path.join(process.cwd(), 'docs/evidence/block-4.0');

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

test('Block 4.0 Evidence Collection - Unified Flow', async ({ page }) => {
  // Unique user for this run
  const timestamp = Date.now();
  const email = `evidence_${timestamp}@test.local`;
  const password = 'Password123!';

  console.log(`Starting E2E test with user: ${email}`);

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
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'landing_page.png'), fullPage: true });
  console.log('Captured: landing_page.png');

  // 2. Signup Page
  await page.click('text=Get Started'); 
  await expect(page).toHaveURL(/\/signup/);
  
  // Wait for form to load
  await expect(page.locator('input#email')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'signup_page.png'), fullPage: true });
  console.log('Captured: signup_page.png');

  // Fill Signup
  console.log('Filling signup form...');
  await page.fill('input#fullName', 'E2E Test User');
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.fill('input#confirmPassword', password);
  await page.check('input#terms');
  await page.click('button[type="submit"]');

  // Expect Redirect to Onboarding
  await expect(page).toHaveURL(/\/onboarding/, { timeout: 20000 });
  console.log('Redirected to /onboarding');

  // 3. Onboarding Class 1: Trade Role
  // Correct Title: "What do you do?"
  await expect(page.getByText('What do you do?')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step1_role.png'), fullPage: true });
  console.log('Captured: onboarding_step1_role.png');

  await page.click('text=I Export Goods'); 
  await page.click('button:has-text("Next Step")', { force: true });

  // 4. Onboarding Class 2: Products / HS Code
  // 4. Onboarding Class 2: Products / HS Code
  await expect(page.getByText('What products do you handle?')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step2_products.png'), fullPage: true });
  console.log('Captured: onboarding_step2_products.png');

  // Search and Select Product
  await page.fill('input[placeholder*="Search by product name"]', 'Coffee');
  // Wait for results to appear
  await expect(page.locator('div.max-h-64 button').first()).toBeVisible();
  // Click the first result
  await page.locator('div.max-h-64 button').first().click();
  
  await page.click('button:has-text("Next Step")', { force: true });

  // 5. Onboarding Class 3: Trade Interests
  await expect(page.getByText('Where do you want to trade?')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step3_interests.png'), fullPage: true });
  console.log('Captured: onboarding_step3_interests.png');
  
  // Search and Select Country
  await page.fill('input[placeholder="Search countries..."]', 'United');
  // Wait for search results
  await expect(page.getByText('United States')).toBeVisible();
  await page.click('text=United States');
  await page.click('button:has-text("Next Step")', { force: true });

  // 6. Onboarding Class 4: Business Details
  await expect(page.getByText('Business Details')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step4_business.png'), fullPage: true });
  console.log('Captured: onboarding_step4_business.png');
  
  // Fill Form
  await page.fill('input[name="companyName"]', 'Automated Test Corp');
  
  // Select Year (Native Select)
  await page.selectOption('select[name="yearEstablished"]', { label: '2020' });

  // Select Size (Native Select)
  // Value is '11-50', label '11-50 employees (Small Business)'
  await page.selectOption('select[name="employeeStrength"]', '11-50');
  
  // Address (Flat names, not nested)
  await page.fill('input[name="street"]', '123 Automation Blvd');
  await page.fill('input[name="city"]', 'Tech City');
  await page.fill('input[name="state"]', 'State of Code');
  
  // Country (Native Select)
  await page.selectOption('select[name="country"]', { label: 'United States' }); 

  await page.fill('input[name="pinCode"]', '90210');
  
  // Export Data
  await page.fill('input[name="lastYearExportUsd"]', '1.5');

  // Export Countries (Checkboxes in a list)
  // Use label selector to avoid matching hidden select options
  const countryCheckbox = page.locator('label').filter({ hasText: 'Australia' });
  await countryCheckbox.scrollIntoViewIfNeeded();
  await countryCheckbox.click();

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step4_filled.png'), fullPage: true });
  console.log('Captured: onboarding_step4_filled.png');

  // Debug: Listen for console errors and network failures
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`PAGE LOG ERROR: ${msg.text()}`);
  });
  page.on('pageerror', err => console.log(`PAGE ERROR: ${err.message}`));
  page.on('requestfailed', request => console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText}`));

  await page.click('button:has-text("Next Step")', { force: true });
  
  // Wait a bit to capture any validation errors
  await page.waitForTimeout(1000);
  
  // 7. Onboarding Step 5 (Certifications)
  await expect(page.getByRole('heading', { name: 'Certifications' })).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step5_certifications.png'), fullPage: true });
  console.log('Captured: onboarding_step5_certifications.png');

  // Select a certification (ISO 9001) - Click the button containing the text
  await page.click('button:has-text("ISO 9001")', { force: true });
  
  await page.click('button:has-text("Next Step")', { force: true });

  // 8. Onboarding Step 6 (Review)
  // Title: "Almost Done!"
  await expect(page.getByText('Almost Done!')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'onboarding_step6_review.png'), fullPage: true });
  console.log('Captured: onboarding_step6_review.png');
  
  // Finish
  await page.click('button:has-text("Finish Setup")', { force: true });

  // 8. Dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
  await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 15000 });
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'dashboard.png'), fullPage: true });
  console.log('Captured: dashboard.png');

  // 9. Matches
  await page.goto('/matches');
  await expect(page.getByText('Trade Matches')).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'matches_page.png'), fullPage: true });
  console.log('Captured: matches_page.png');

  // 10. Profile
  await page.goto('/profile');
  await expect(page.getByText('Company Profile')).toBeVisible(); 
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'profile_page.png'), fullPage: true });
  console.log('Captured: profile_page.png');
});
