import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Add detailed debugging to see which keys are available
if (typeof window === "undefined") {
  console.log("Server-side Supabase environment check:")
  console.log(`URL available: ${!!supabaseUrl}`)
  console.log(`Anon key available: ${!!supabaseAnonKey}`)
  console.log(`Service key available: ${!!supabaseServiceKey}`)
}

// Initialize Supabase client
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Create a function to get a service role client when needed
const getServiceSupabase = () => {
  if (!supabaseServiceKey) {
    console.warn("WARNING: Service role key is missing, using anon key instead")
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}

// Export a function to create a new client
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Log the initialization status for debugging
if (typeof window === "undefined") {
  console.log("Using Supabase client with available credentials")
}

export { supabase, getServiceSupabase }
