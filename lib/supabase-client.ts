import { createClient } from "@supabase/supabase-js"

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

// Determine if we're in mock mode (missing required environment variables)
const isMockMode = !supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)

// Create a mock client for development/preview if no environment variables
function createMockSupabaseClient() {
  console.log("Creating mock Supabase client due to missing environment variables")

  // In-memory storage for mock data
  const mockUsers: any[] = []

  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: mockUsers.find((user) => user[column] === value), error: null }),
          limit: (limit: number) => Promise.resolve({ data: mockUsers.slice(0, limit), error: null }),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          limit: (limit: number) =>
            Promise.resolve({
              data: [...mockUsers]
                .sort((a, b) => (ascending ? a[column] - b[column] : b[column] - a[column]))
                .slice(0, limit),
              error: null,
            }),
        }),
        limit: (limit: number) => Promise.resolve({ data: mockUsers.slice(0, limit), error: null }),
      }),
      insert: (data: any) => ({
        select: (columns = "*") => ({
          single: () => {
            const newUser = { ...data, id: data.id || `mock-${Date.now()}` }
            mockUsers.push(newUser)
            return Promise.resolve({ data: newUser, error: null })
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (columns = "*") => ({
            single: () => {
              const index = mockUsers.findIndex((user) => user[column] === value)
              if (index !== -1) {
                mockUsers[index] = { ...mockUsers[index], ...data }
                return Promise.resolve({ data: mockUsers[index], error: null })
              }
              return Promise.resolve({ data: null, error: { message: "Not found" } })
            },
          }),
        }),
      }),
      rpc: (func: string, params: any) => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      signInWithOtp: () => Promise.resolve({ data: null, error: null }),
    },
  }
}

// Initialize Supabase client or mock client
let supabase: any
let getServiceSupabase: () => any

if (isMockMode) {
  // Use mock client if required environment variables are missing
  const mockClient = createMockSupabaseClient()
  supabase = mockClient
  getServiceSupabase = () => mockClient

  console.log("Using mock Supabase client due to missing environment variables")
} else {
  // Create real Supabase client with available credentials
  supabase = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey)

  // Create a function to get a service role client when needed
  getServiceSupabase = () => {
    if (!supabaseServiceKey) {
      console.warn("WARNING: Service role key is missing, using anon key instead")
      return createClient(supabaseUrl, supabaseAnonKey)
    }
    return createClient(supabaseUrl, supabaseServiceKey)
  }

  console.log("Using real Supabase client with available credentials")
}

// Log the initialization status for debugging
if (typeof window !== "undefined") {
  console.log(`Supabase client initialized in ${isMockMode ? "mock" : "real"} mode`)
}

export { supabase, getServiceSupabase, isMockMode }