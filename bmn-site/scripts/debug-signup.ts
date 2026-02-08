
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const email = `debug_${Date.now()}@bmn.com`;
  const password = 'Password123!';
  
  console.log(`Attempting signup for ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Debug User',
      }
    }
  });

  if (error) {
    console.error('Signup Failed:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error);
  } else {
    console.log('Signup Successful!');
    console.log('User ID:', data.user?.id);
    console.log('Session:', data.session ? 'Created' : 'None (Email Confirmation likely required)');
  }
}

testSignup();
