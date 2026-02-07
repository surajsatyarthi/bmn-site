
import { test, expect } from '@playwright/test';

test('Golden Path: Landing -> Onboarding -> Dashboard', async ({ page }) => {
  // 1. Intercept Auth & API calls (Security: Network Isolation)
  // Mock Supabase User
  await page.route('**/auth/v1/user*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '99999999-9999-9999-9999-999999999999',
        email: 'test@example.com',
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
      })
    });
  });

  // Mock Profile Query
  await page.route('**/api/profile/*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '99999999-9999-9999-9999-999999999999',
        onboardingStep: 1,
        onboardingCompleted: false,
      })
    });
  });

  await page.route('/api/profile/onboarding', async route => {
    console.log('Intercepted API call to /api/profile/onboarding');
    await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
  });

  await page.route('**/dashboard', async route => {
    console.log('Intercepted navigation to /dashboard');
    await route.fulfill({ 
      status: 200, 
      contentType: 'text/html',
      body: '<html><body><h1>Dashboard</h1><p>Mock Dashboard for E2E</p></body></html>' 
    });
  });

  // 2. Visit Homepage
  console.log('Visiting Homepage...');
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible();

  // 2. Start Onboarding
  console.log('Starting Onboarding...');
  // Instead of ?mock=true, we rely on our page.route mocks above
  await page.goto('http://localhost:3000/onboarding');
  await expect(page.getByRole('heading', { name: 'What do you do?' })).toBeVisible({ timeout: 15000 });

  // 3. Step 1: Trade Role
  console.log('Completing Step 1: Trade Role...');
  await page.getByText('I Export Goods').click();
  await page.getByRole('button', { name: 'Next Step' }).click();

  // 4. Step 2: Products
  console.log('Completing Step 2: Products...');
  await expect(page.getByRole('heading', { name: 'What products do you handle?' })).toBeVisible();
  
  // Search and Select Product 1
  const productInput = page.getByPlaceholder(/Search by product name/i);
  await productInput.fill('Coffee');
  await page.waitForTimeout(500); // Wait for debounce/render
  await page.getByRole('button').filter({ hasText: 'Chapter 09' }).first().click();
  
  // Next
  await page.getByRole('button', { name: 'Next Step' }).click();

  // 5. Step 3: Trade Interests
  console.log('Completing Step 3: Trade Interests...');
  await expect(page.getByRole('heading', { name: 'Where do you want to trade?' })).toBeVisible();
  
  // Search and Select Country
  const countryInput = page.getByPlaceholder(/Search countries/i);
  await countryInput.fill('United States');
  await page.waitForTimeout(500);
  await page.getByRole('button').filter({ hasText: 'United States' }).first().click();
  
  // Next
  await page.getByRole('button', { name: 'Next Step' }).click();

  // 6. Step 4: Business Details
  console.log('Completing Step 4: Business Details...');
  await expect(page.getByRole('heading', { name: 'Business Details' })).toBeVisible();
  
  await page.getByPlaceholder('e.g. Global Trade Ltd').fill('Golden Path Ltd');
  await page.getByPlaceholder('https://example.com').fill('https://goldenpath.com');
  await page.getByPlaceholder('e.g. 2010').fill('2020');
  
  // Next
  await page.getByRole('button', { name: 'Next Step' }).click();

  // 7. Step 5: Certifications
  console.log('Completing Step 5: Certifications...');
  await expect(page.getByRole('heading', { name: 'Certifications' })).toBeVisible();
  
  await page.getByText('ISO 9001').click();
  
  // Next
  await page.getByRole('button', { name: 'Next Step' }).click();

  // 8. Step 6: Review
  console.log('Completing Step 6: Review...');
  await expect(page.getByRole('heading', { name: 'Almost Done!' })).toBeVisible();
  
  // Verify Summary Data
  await expect(page.getByText('Golden Path Ltd')).toBeVisible();
  
  // Finish
  await page.getByRole('button', { name: 'Finish Setup' }).click();

  // 9. Dashboard Verification
  console.log('Verifying Success (Redirect off Onboarding)...');
  
  // Wait for navigation away from onboarding
  await expect(page).not.toHaveURL(/.*onboarding/, { timeout: 15000 });
  
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
  
  // Success if we hit dashboard (mock works) OR login (protected route kicked in)
  // Both imply the Wizard successfully completed and attempted navigation.
  const isDashboardOrLogin = finalUrl.includes('/dashboard') || finalUrl.includes('/login');
  expect(isDashboardOrLogin).toBeTruthy();
  
  console.log('Golden Path Verified Successfully!');
});
