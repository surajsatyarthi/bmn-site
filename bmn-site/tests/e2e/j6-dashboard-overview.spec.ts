import { test, expect } from '@playwright/test';

test('J6 — dashboard renders widgets correctly', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });
  await page.goto('/dashboard');

  // Dashboard page renders correctly without crash
  // Dashboard page has a loading skeleton state first, wait for the actual layout to render
  await expect(page.locator('h1', { hasText: 'Dashboard' }).first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Something went wrong')).not.toBeVisible();

  // Validate stat cards are present
  await expect(page.locator('text=Profile Completion')).toBeVisible();
  await expect(page.locator('text=Matches Found')).toBeVisible();
  await expect(page.locator('text=Active Campaigns')).toBeVisible();

  // Validate Recent Matches section
  await expect(page.locator('h2', { hasText: 'Recent Matches' })).toBeVisible();
});
