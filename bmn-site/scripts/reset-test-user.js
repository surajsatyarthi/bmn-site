const postgres = require('postgres');

const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const sql = postgres(connectionString);

async function resetTestUser() {
  try {
    const email = 'working@test.local';
    console.log(`Resetting onboarding for ${email}...`);

    // Get user ID
    const [user] = await sql`
      SELECT id FROM auth.users WHERE email = ${email}
    `;

    if (!user) {
      console.error('Test user not found!');
      process.exit(1);
    }

    // Reset profile
    await sql`
      UPDATE public.profiles
      SET onboarding_step = 1, -- Set to Step 1 (Trade Role)
          onboarding_completed = false
          -- trade_role is not null, so we keep the existing value
      WHERE id = ${user.id}
    `;
    
    // Also clear company data if any (optional, depending on schema cascade)
    // But for now, just resetting the step is key.
    
    console.log('Test user onboarding reset successfully.');

  } catch (error) {
    console.error('Error resetting user:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

resetTestUser();
