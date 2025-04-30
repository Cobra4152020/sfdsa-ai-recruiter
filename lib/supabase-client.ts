import { createClient } from "@supabase/supabase-js"

// Check if required environment variables are available
const hasRequiredEnvVars = () => {
  return !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Create a Supabase client with the service role key
export function getServiceSupabase() {
  if (!hasRequiredEnvVars()) {
    console.warn("Missing required environment variables for Supabase, returning mock client")
    // Return a mock client or null - API routes will handle this by returning mock data
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: new Error("Mock client - no env vars") }),
            in: () => ({ data: [], error: null }),
            order: () => ({ limit: () => ({ data: [], error: null }) }),
            gt: () => ({ count: () => ({ count: 0, error: null }) }),
          }),
          order: () => ({
            limit: () => ({ data: [], error: null }),
          }),
          in: () => ({ data: [], error: null }),
        }),
        insert: () => ({ select: () => ({ data: null, error: null }) }),
      }),
    } as any
  }

  return createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Create a Supabase client with the anonymous key for client-side use
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Missing Supabase client environment variables")
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  }

  return supabaseClient
}
