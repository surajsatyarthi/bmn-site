import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use dummy values for build time to pass library validation
  // These will be replaced with actual values at runtime in the browser
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
