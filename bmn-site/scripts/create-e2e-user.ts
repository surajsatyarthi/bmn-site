
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.DATABASE_URL!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

// Admin client for user creation
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Direct database for profile setup
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function createE2ETestUser() {
  const timestamp = Date.now();
  const email = `e2e_test_${timestamp}@example.com`;
  const password = 'TestPassword123!';

  console.log(`Creating E2E test user: ${email}`);

  try {
    // 1. Create user via Supabase Admin API (proper password hashing)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Pre-verify email
      user_metadata: { full_name: 'E2E Test User' }
    });

    if (authError) {
      throw new Error(`Auth creation failed: ${authError.message}`);
    }

    const userId = authData.user.id;
    console.log('✅ User created via Supabase Admin API');
    console.log(`   User ID: ${userId}`);

    // 2. Wait for profile trigger to run
    await new Promise(r => setTimeout(r, 1000));

    // 3. Ensure profile exists and is set for onboarding
    const profileCheck = await sql`SELECT id FROM public.profiles WHERE id = ${userId}`;
    
    if (profileCheck.length === 0) {
      // Create profile manually if trigger didn't run
      await sql`
        INSERT INTO public.profiles (id, full_name, trade_role, onboarding_step, onboarding_completed, plan) 
        VALUES (${userId}, 'E2E Test User', 'both', 1, false, 'free')
      `;
      console.log('✅ Profile created manually');
    } else {
      // Reset onboarding state
      await sql`
        UPDATE public.profiles 
        SET onboarding_completed = false, onboarding_step = 1 
        WHERE id = ${userId}
      `;
      console.log('✅ Profile exists, reset onboarding state');
    }

    // Output credentials for E2E test
    console.log('\\n=== E2E TEST CREDENTIALS ===');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User ID: ${userId}`);
    console.log('===========================');

    // Machine-readable output
    console.log(`\\n__CREDENTIALS__:${email}:${password}:${userId}`);

  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createE2ETestUser();
