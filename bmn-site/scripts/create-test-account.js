// scripts/create-test-account.js
// Usage: node scripts/create-test-account.js
// Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createTestAccount() {
  // Step 1: Create auth user (pre-verified, no email confirmation needed)
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: 'tester@businessmarket.network',
    password: process.env.TEST_USER_PASSWORD,
    email_confirm: true,       // Skip email verification entirely
  });

  if (authError) {
    console.error('Auth creation failed:', authError.message);
    process.exit(1);
  }

  console.log('Auth user created:', authUser.user.id);

  // Step 2: Create profile row with onboarding complete + HS 33 (cosmetics)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authUser.user.id,
      full_name: 'E2E Tester',
      trade_role: 'exporter',
      plan: 'free',
      onboarding_completed: true,
      onboarding_step: 7,
    });

  if (profileError) {
    console.error('Profile creation failed:', profileError.message);
    process.exit(1);
  }

  console.log('✅ Test account ready: tester@businessmarket.network');
  console.log('   Password: from TEST_USER_PASSWORD env var');
  console.log('   Onboarding: complete (HS 33)');
}

createTestAccount();
