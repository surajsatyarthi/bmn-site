import { sql } from 'drizzle-orm';
import { db } from '../src/lib/db';

async function runMigration() {
  console.log('Creating email_logs table...');
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS email_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT,
      from_address TEXT,
      bounce_type TEXT,
      error_message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_email_logs_email_id ON email_logs(email_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_email_logs_event_type ON email_logs(event_type);`);

  console.log('Adding email tracking columns to profiles...');
  
  await db.execute(sql`
    ALTER TABLE profiles 
    ADD COLUMN IF NOT EXISTS email_deliverable BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS last_email_error TEXT,
    ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE;
  `);

  console.log('✅ Migration complete!');
}

runMigration().catch(console.error);
