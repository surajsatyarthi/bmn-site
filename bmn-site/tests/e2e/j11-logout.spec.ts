import { test, expect } from '@playwright/test';

test('J11 — logout flow correctly destroys session', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('#email', process.env.TEST_USER_EMAIL!);
  await page.fill('#password', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait for redirect to app
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 });
  
  // Wait for the user menu button to appear as proof of successful login
  const userMenuBtn = page.locator('button:has(.bg-gradient-to-br)').first();
  await expect(userMenuBtn).toBeVisible({ timeout: 15000 });

  // Find and execute the logout action within the user menu
  await userMenuBtn.click();
  
  const logoutAction = page.locator('button', { hasText: 'Log out' });
  await expect(logoutAction).toBeVisible();
  await logoutAction.click();

  // Wait for redirect back to generic external page (login or index)
  await page.waitForURL(/.*(login|\/)$/);
  
  // Navigating to dashboard should now redirect to login
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*login/);
});
