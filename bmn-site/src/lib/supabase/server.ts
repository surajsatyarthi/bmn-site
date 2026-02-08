import { createServerClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Validate env vars at runtime to fail fast if missing
const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export const createClient = async () => {
  const cookieStore = await cookies();
  const requestHeaders = await headers(); // Requires 'next/headers' import

  // --- AUTH BYPASS FOR TESTING ---
  // In non-production environments OR if explicitly enabled, check for the bypass header
  const enableBypass = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  const bypassHeader = requestHeaders.get('x-test-auth-bypass');
  const unconfirmedHeader = requestHeaders.get('x-test-unconfirmed');

  if (enableBypass && (bypassHeader === 'true' || unconfirmedHeader === 'true')) {
     console.log('🚧 BYPASSING SUPABASE AUTH (Mock Client) 🚧');
     const { MOCK_SESSION, MOCK_USER, MOCK_SESSION_UNCONFIRMED, MOCK_USER_UNCONFIRMED } = await import('@/lib/testing/mock-user');
     
     const session = unconfirmedHeader === 'true' ? MOCK_SESSION_UNCONFIRMED : MOCK_SESSION;
     const user = unconfirmedHeader === 'true' ? MOCK_USER_UNCONFIRMED : MOCK_USER;

     // Return a mock Supabase client
     return {
       auth: {
         getUser: async () => ({ data: { user }, error: null }),
         getSession: async () => ({ data: { session }, error: null }),
         // Mock other methods as needed to prevent crashes
         signInWithPassword: async () => ({ data: { user, session }, error: null }),
         signOut: async () => ({ error: null }),
       },
       from: () => ({
         select: () => ({
           eq: () => ({
             single: async () => ({ data: null, error: null }), // Mock DB queries if needed
             maybeSingle: async () => ({ data: null, error: null }),
           }),
         }),
       }),
     } as unknown as SupabaseClient;
  }
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
