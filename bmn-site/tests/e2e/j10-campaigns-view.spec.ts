import { test, expect } from '@playwright/test';

test('J10 — campaigns page renders correctly', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });
  await page.goto('/campaigns');
  await page.waitForLoadState('networkidle');

  // Page renders correctly without crash
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();
  await expect(page.locator('h1', { hasText: 'Your Campaigns' })).toBeVisible();
  
  // Validate that the stats grid or empty state is visible
  // The page has been confirmed to load the h1 'Your Campaigns'
  await expect(page.getByText('Active Campaigns')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No campaigns yet' })).toBeVisible();
});
