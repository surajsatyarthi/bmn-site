import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use empty strings as fallback for build time
  // These will be replaced with actual values at runtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
