import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Create clients
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

// Create a function to get a service role client when needed
const getServiceSupabase = () => {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Create a mock client for development/preview if no environment variables
function createMockSupabaseClient() {
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

// Use mock client if no environment variables are set
const finalSupabase = supabaseUrl && (supabaseAnonKey || supabaseServiceKey) ? supabase : createMockSupabaseClient()

export { finalSupabase as supabase, getServiceSupabase }