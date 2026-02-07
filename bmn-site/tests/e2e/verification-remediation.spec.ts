import { test, expect } from '@playwright/test';
import path from 'path';

test.use({
  video: 'off',
  trace: 'off',
});

// Define evidence paths - HARDCODED ABSOLUTE PATH
const evidenceDir = '/Users/surajsatyarthi/Projects/active/BMN/docs/evidence/phase-1-stabilization';

test.skip('Remediation Verification: Onboarding Flow (Via Mock)', async ({ page }) => {
  test.setTimeout(60000); 
  
  // 1. Direct Access via Mock
  console.log('Navigating to Onboarding (Mock Mode)...');
  await page.goto('http://localhost:3000/onboarding?mock=true');
  await page.waitForLoadState('networkidle');
  
  // 2. Verify Onboarding Page
  console.log('Verifying Onboarding Wizard...');
  
  // Wait for URL (should stay on onboarding)
  await expect(page).toHaveURL(/.*\/onboarding/);
  
  // Wait for specific content
  console.log('Waiting for Trade Role step content...');
  await expect(page.getByRole('heading', { name: 'What do you do?' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Select your primary role')).toBeVisible();

  // 3. Evidence Collection - Desktop
  console.log('Capturing Desktop Evidence...');
  await page.screenshot({ path: path.join(evidenceDir, 'screenshot-onboarding.png'), fullPage: true });
  
  // 4. Evidence Collection - Mobile (375px)
  console.log('Capturing Mobile Evidence...');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload(); 
  await page.waitForTimeout(2000); // Wait for hydration after reload
  await expect(page.getByRole('heading', { name: 'What do you do?' })).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: path.join(evidenceDir, 'mobile-onboarding-375px.png'), fullPage: true });
  
  console.log('Verification Complete.');
});
  

test('Remediation Verification: Site Layouts', async ({ page }) => {
    // Basic Public Pages
    await page.goto('http://localhost:3000/');
    await page.screenshot({ path: path.join(evidenceDir, 'screenshot-header.png') });
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.screenshot({ path: path.join(evidenceDir, 'mobile-homepage-375px.png') });
});
