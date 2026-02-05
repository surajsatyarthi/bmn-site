import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!);

async function verify() {
  console.log('--- Verifying Users Table Columns ---');
  const userColumns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users'
  `;
  
  const colNames = userColumns.map(c => c.column_name);
  console.log('Existing columns:', colNames.join(', '));

  const required = [
    'location',
    'tagline',
    'github_username',
    'twitter_handle',
    'linkedin_url',
    'youtube_channel',
    'discord_username',
    'profile_completion_score',
    'public_profile',
    'followers_count',
    'following_count'
  ];

  const missing = required.filter(c => !colNames.includes(c));

  if (missing.length > 0) {
    console.log('❌ Missing columns:', missing.join(', '));
  } else {
    console.log('✅ All Phase 1.1 columns present in "users" table.');
  }

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  const tableNames = tables.map(t => t.table_name);
  console.log('Existing tables:', tableNames.join(', '));

  if (tableNames.includes('follows')) {
    console.log('✅ "follows" table exists.');
  } else {
    console.log('❌ "follows" table IS MISSING.');
  }

  await sql.end();
}

verify();
