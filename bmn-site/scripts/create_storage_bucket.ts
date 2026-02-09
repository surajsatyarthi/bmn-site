
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const BUCKET_NAME = 'avatars';

  console.log(`Checking bucket: ${BUCKET_NAME}...`);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const existing = buckets.find(b => b.name === BUCKET_NAME);

  if (existing) {
    console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
  } else {
    console.log(`Creating bucket '${BUCKET_NAME}'...`);
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

    if (error) {
      console.error('❌ Error creating bucket:', error);
      return;
    }
    console.log(`✅ Bucket '${BUCKET_NAME}' created.`);
  }

  // Update policies? 
  // Note: Storage policies are often handled in SQL (RLS).
  // But strictly speaking, 'public: true' makes it readable.
  // Writing requires RLS.
  console.log('⚠️ Reminder: Ensure RLS policies allow authenticated uploads to this bucket.');
}

main();
