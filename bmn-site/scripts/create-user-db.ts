import postgres from 'postgres';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
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

async function createAuthUser() {
  const email = `manual_${Date.now()}@example.com`;
  const password = 'Password123!';
  const id = uuidv4();
  
  // Hash password with bcrypt (Supabase uses bcrypt)
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  console.log(`Creating user ${email} (${id})...`);

  try {
    // 1. Insert into auth.users using pre-hashed password
    const result = await sql`
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
        ${id},
        'authenticated',
        'authenticated',
        ${email},
        ${hashedPassword}, 
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Manual User"}',
        now(),
        now(),
        '',
        '',
        '',
        '',
        false
      )
      RETURNING id, email;
    `;

    console.log(`✅ Auth user created: ${result[0].email}`);

    // Check if profile exists (give trigger a ms)
    await new Promise(r => setTimeout(r, 500));
    
    const profileCheck = await sql`SELECT id FROM public.profiles WHERE id = ${id}`;
    
    if (profileCheck.length === 0) {
        console.log('Inserting profile manually...');
        await sql`
            INSERT INTO public.profiles (
                id,
                full_name,
                trade_role,
                onboarding_step,
                onboarding_completed,
                plan
            ) VALUES (
                ${id},
                'Manual User',
                'both',
                1,
                false,
                'free'
            )
        `;
        console.log('✅ Profile created.');
    } else {
        console.log('✅ Profile already created by trigger.');
        // Reset onboarding just in case
        await sql`UPDATE public.profiles SET onboarding_completed = false, onboarding_step = 1 WHERE id = ${id}`;
    }

    // Insert into auth.identities (Supabase sometimes requires this for login to work properly)
    // Actually, usually auth.users is enough, but auth.identities is better.
    // Let's skip identities for now, minimal viable.

    // Output credentials for Test to capture
    console.log(`__CREDENTIALS__:${email}:${password}`);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to create user:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createAuthUser();
