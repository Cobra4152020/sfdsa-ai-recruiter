// Create a mock or real Supabase client based on environment variables
let supabase: any
let getServiceSupabase: () => any

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (supabaseUrl && supabaseAnonKey) {
  // If environment variables are available, create the real Supabase client
  const { createClient } = require("@supabase/supabase-js")
  supabase = createClient(supabaseUrl, supabaseAnonKey)

  getServiceSupabase = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    if (!serviceRoleKey) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Some admin functions may not work.")
    }
    return createClient(supabaseUrl, serviceRoleKey)
  }
} else {
  // If environment variables are not available, create a mock client
  console.warn("Supabase environment variables are not set. Using mock database.")

  // Mock implementation for development/preview
  supabase = createMockSupabaseClient()
  getServiceSupabase = () => createMockSupabaseClient()
}

// Mock Supabase client for development/preview
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
  }
}

export { supabase, getServiceSupabase }

