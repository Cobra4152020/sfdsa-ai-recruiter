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

// Singleton instances for client and server
let clientInstance: ReturnType<typeof createSupabaseClient> | null = null
let serviceInstance: ReturnType<typeof createSupabaseClient> | null = null

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // ms

/**
 * Retry a function with exponential backoff
 */
async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES, delay = RETRY_DELAY): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error

    console.warn(`Database operation failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`)
    await new Promise((resolve) => setTimeout(resolve, delay))

    return withRetry(fn, retries - 1, delay * 2)
  }
}

/**
 * Create a Supabase client with the anonymous key
 */
export function createClient() {
  // Check for required environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing required Supabase environment variables")
  }

  // For client-side, reuse the instance to avoid multiple connections
  if (typeof window !== "undefined" && clientInstance) {
    return clientInstance
  }

  // Create a new client with auto-refresh
  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      fetch: (...args) => {
        return fetch(...args)
      },
    },
  })

  // Store the instance for client-side reuse
  if (typeof window !== "undefined") {
    clientInstance = client
  }

  return client
}

/**
 * Get a Supabase client with the service role key for admin operations
 */
export function getServiceSupabase() {
  // Check for required environment variables
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing service role key, falling back to anon key")
    return createClient()
  }

  // For server-side, reuse the instance to avoid multiple connections
  if (typeof window === "undefined" && serviceInstance) {
    return serviceInstance
  }

  // Create a new client with the service role key
  const client = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (...args) => {
        return fetch(...args)
      },
    },
  })

  // Store the instance for server-side reuse
  if (typeof window === "undefined") {
    serviceInstance = client
  }

  return client
}

// Initialize the default client
const supabase = createClient()

// Log the initialization status for debugging
if (typeof window === "undefined") {
  console.log("Supabase client initialized with available credentials")
}

export { supabase, withRetry }
