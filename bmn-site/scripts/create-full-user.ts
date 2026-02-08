
import postgres from 'postgres';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  config({ path: '.env.local' });
}

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function createFullUser() {
  const email = `full_${Date.now()}@example.com`;
  const password = 'Password123!';
  const userId = randomUUID();
  const identityId = randomUUID();
  
  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  console.log(`Creating FULL user ${email}...`);

  try {
    // 1. Insert into auth.users
    await sql`
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        is_super_admin
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        ${userId},
        'authenticated',
        'authenticated',
        ${email},
        ${hashedPassword}, 
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Full User"}',
        now(),
        now(),
        '',
        '',
        '',
        '',
        false
      )
    `;
    console.log('✅ auth.users entry created.');

    // 2. Insert into auth.identities
    await sql`
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        ${identityId},
        ${userId},
        ${JSON.stringify({ sub: userId, email: email })},
        'email',
        ${userId},
        now(),
        now(),
        now()
      )
    `;
    console.log('✅ auth.identities entry created.');

    // 3. Profile (via trigger or manual)
    await new Promise(r => setTimeout(r, 500));
    const profileCheck = await sql`SELECT id FROM public.profiles WHERE id = ${userId}`;
    if (profileCheck.length === 0) {
        await sql`
            INSERT INTO public.profiles (id, full_name, trade_role, onboarding_step, onboarding_completed, plan) 
            VALUES (${userId}, 'Full User', 'both', 1, false, 'free')
        `;
        console.log('✅ Profile created manually.');
    } else {
        console.log('✅ Profile created by trigger.');
        // Reset onboarding
        await sql`UPDATE public.profiles SET onboarding_completed = false, onboarding_step = 1 WHERE id = ${userId}`;
    }

    console.log(`__CREDENTIALS__:${email}:${password}`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createFullUser();
