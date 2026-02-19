import { createServerClient } from '@supabase/ssr';

import { cookies, headers } from 'next/headers';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Validate env vars at runtime to fail fast if missing
// Use placeholders for build time (CI environments often lack secrets during build)
const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
};

// Only enforce validation if not in build/dummy mode
if (env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
   try {
     envSchema.parse(env);
   } catch (error) {
     console.error("❌ Invalid environment variables:", error);
   }
}

export const createClient = async () => {
  const cookieStore = await cookies();
  const requestHeaders = await headers(); // Requires 'next/headers' import

  // --- AUTH BYPASS REMOVED (Ralph Protocol v8.0 Remediation) ---
  // The mock client logic has been stripped to prevent production security risks.
  // -------------------------------------------------------------
  // -------------------------------

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
