import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!);

async function apply() {
  console.log('--- Applying Phase 1.1 Schema Changes via SQL ---');
  
  try {
    await sql.begin(async (sql) => {
      // 1. Update Users table
      console.log('Updating "users" table...');
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS tagline TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter_handle TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS youtube_channel TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_username TEXT`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completion_score INTEGER DEFAULT 0`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS public_profile BOOLEAN DEFAULT true`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0`;
      
      // 2. Create Follows table
      console.log('Creating "follows" table...');
      await sql`
        CREATE TABLE IF NOT EXISTS follows (
          follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW(),
          PRIMARY KEY (follower_id, following_id)
        )
      `;
      
      await sql`CREATE INDEX IF NOT EXISTS follows_follower_idx ON follows(follower_id)`;
      await sql`CREATE INDEX IF NOT EXISTS follows_following_idx ON follows(following_id)`;
    });
    
    console.log('✅ Phase 1.1 schema applied successfully!');
  } catch (error) {
    console.error('❌ Failed to apply schema changes:', error);
  } finally {
    await sql.end();
  }
}

apply();
