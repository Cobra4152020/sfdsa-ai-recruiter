/**
 * Type definitions for environment variables
 * This ensures type safety when accessing environment variables
 */

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        // Next.js environment variables
        NODE_ENV: "development" | "production" | "test"
        VERCEL_ENV?: "production" | "preview" | "development"
        VERCEL_URL?: string
  
        // Base URL
        NEXT_PUBLIC_BASE_URL?: string
  
        // API configuration
        API_TIMEOUT?: string
        MAX_RETRIES?: string
  
        // Supabase configuration
        SUPABASE_URL?: string
        NEXT_PUBLIC_SUPABASE_URL?: string
        SUPABASE_ANON_KEY?: string
        NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
        SUPABASE_SERVICE_ROLE_KEY?: string
        SUPABASE_JWT_SECRET?: string
  
        // Database configuration
        POSTGRES_URL?: string
        POSTGRES_PRISMA_URL?: string
        POSTGRES_URL_NON_POOLING?: string
        POSTGRES_USER?: string
        POSTGRES_PASSWORD?: string
        POSTGRES_DATABASE?: string
        POSTGRES_HOST?: string
  
        // Email configuration
        SENDPLUS_API_ID?: string
        SENDPLUS_API_SECRET?: string
        EMAIL_FROM?: string
        ADMIN_EMAIL?: string
  
        // Analytics configuration
        NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
        ENABLE_ANALYTICS?: string
  
        // Feature flags
        ENABLE_MOCK_MODE?: string
        DEBUG_MODE?: string
      }
    }
  }
  
  // This needs to be an actual export to be treated as a module
  export {}
  