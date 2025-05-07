// Re-export the existing clients from their respective files
export { supabase } from "./supabase-client"
export { getServiceSupabase, getClientSupabase } from "./supabase-clients"

// Add the missing withRetry function
export const withRetry = async <T>(\
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
)
: Promise<T> =>
{
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }

  throw lastError
}
