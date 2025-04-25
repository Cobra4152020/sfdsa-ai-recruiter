import { createClient } from "@supabase/supabase-js"
import { logger } from "./logger"

// For server components and API routes
let serviceSupabaseClient: ReturnType<typeof createClient> | null = null

export function getServiceSupabase() {
  if (serviceSupabaseClient) {
    return serviceSupabaseClient
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    logger.error("Missing Supabase environment variables")
    throw new Error("Missing required environment variables for Supabase")
  }

  try {
    serviceSupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    return serviceSupabaseClient
  } catch (error) {
    logger.error(`Error initializing Supabase client: ${error}`)
    throw new Error(`Failed to initialize Supabase client: ${error.message}`)
  }
}

// For client components
let browserSupabaseClient: ReturnType<typeof createClient> | null = null

export function getBrowserSupabase() {
  if (typeof window === "undefined") {
    throw new Error("getBrowserSupabase should only be called in client components")
  }

  if (browserSupabaseClient) {
    return browserSupabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    throw new Error("Missing required environment variables for Supabase")
  }

  try {
    browserSupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    return browserSupabaseClient
  } catch (error) {
    console.error(`Error initializing browser Supabase client: ${error}`)
    throw new Error(`Failed to initialize browser Supabase client: ${error.message}`)
  }
}
