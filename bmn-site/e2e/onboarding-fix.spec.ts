
import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

test.describe('Onboarding Profile Creation Fix', () => {
  const testEmail = `e2e_test_${Date.now()}@bmn.test`;
  const testPassword = 'Password123!';
  let userId: string;

  test.beforeAll(async () => {
    // 1. Create a test user
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: 'E2E Test User' }
    });
    
    if (error) throw error;
    userId = data.user.id;
    console.log(`Created test user: ${testEmail} (${userId})`);

    // 2. Ensure NO profile exists (simulating fresh OAuth)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    // Note: If profiles table missing or delete fails, test might be flaky, but we aim to test creation.
    if (deleteError) console.warn('Warning deleting profile:', deleteError);
  });

  test.afterAll(async () => {
    // Cleanup
    if (userId) {
      await supabase.auth.admin.deleteUser(userId);
      await supabase.from('profiles').delete().eq('id', userId);
      console.log('Cleaned up test user');
    }
  });

  test('should create profile and load onboarding wizard for new user', async ({ page }) => {
    // 3. Login via UI (easiest way to set session)
    await page.goto('/login');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // 4. Wait for redirect
    // Use waitForURL to be robust
    await page.waitForURL(/\/onboarding|\/dashboard/, { timeout: 10000 });
    
    // 5. Navigate to onboarding explicitly if unrelated redirect happens
    if (!page.url().includes('/onboarding')) {
        await page.goto('/onboarding');
    }

    // 6. Assert "Account Setup" / Wizard presence
    // If bug exists, we see "Something went wrong!"
    await expect(page.getByText('Something went wrong!')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /Account Setup|What do you do/i })).toBeVisible();
    
    // 7. Verify correct step
    await expect(page.getByText('Step 1')).toBeVisible();
  });
});
