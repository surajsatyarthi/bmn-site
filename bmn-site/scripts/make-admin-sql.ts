#!/usr/bin/env tsx

import postgres from 'postgres';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('❌ Missing DATABASE_URL');
  process.exit(1);
}

const client = postgres(connectionString, {
  ssl: 'require',
});

async function makeAdminSql() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address: npx tsx scripts/make-admin-sql.ts <email>');
    process.exit(1);
  }

  try {
    console.log(`\n🔍 Looking up user in auth.users: ${email}...`);

    const users = await client`
      SELECT id, email 
      FROM auth.users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      console.error('❌ User not found in auth.users table.');
      console.log('   Please ensure the user has signed up on the site first.');
      process.exit(1);
    }

    const userId = users[0].id;
    console.log(`✅ Found Auth User: ${userId}`);

    console.log('🔄 Updating profiles table...');
    
    const result = await client`
      UPDATE public.profiles
      SET is_admin = true, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, full_name, is_admin
    `;

    if (result.length > 0) {
      console.log('✅ SUCCESS! User is now an admin.');
      console.log(`   Email: ${email}`);
      console.log(`   User ID: ${result[0].id}`);
      console.log(`   Full Name: ${result[0].full_name}`);
      console.log(`   Is Admin: ${result[0].is_admin}\n`);
    } else {
      console.error('❌ Profile not found in public.profiles table.');
      console.error('   The user might need to complete onboarding first (or the trigger failed).');
    }

    process.exit(0);
  } catch (err: unknown) {
    console.error('❌ Error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

makeAdminSql();
