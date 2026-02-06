#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
import { db } from '../src/lib/db';
import { profiles } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function removeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address: npx tsx scripts/remove-admin.ts <email>');
    process.exit(1);
  }

  try {
    console.log(`\n🔍 Looking up user: ${email}...`);

    // 1. Find user in Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.error('❌ User not found in Supabase Auth.');
      process.exit(1);
    }

    console.log(`✅ Found Auth User: ${user.id}`);

    // 2. Update Profile
    console.log('🔄 Revoking admin privileges...');
    
    const result = await db
      .update(profiles)
      .set({ 
        isAdmin: false,
        updatedAt: new Date()
      })
      .where(eq(profiles.id, user.id))
      .returning();

    if (result.length > 0) {
      console.log('✅ SUCCESS! Admin privileges revoked.');
      console.log(`   Email: ${email}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Is Admin: ${result[0].isAdmin}\n`);
    } else {
      console.error('❌ Profile not found in database.');
    }
    
    process.exit(0);
  } catch (error: unknown) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

removeAdmin();
