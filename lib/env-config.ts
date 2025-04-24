/**
 * Centralized environment configuration
 * This file provides a single source of truth for all environment variables
 * with proper typing, validation, and fallbacks.
 */

// Base URL configuration
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

// API configuration
export const API_TIMEOUT = Number.parseInt(process.env.API_TIMEOUT || "30000", 10)
export const MAX_RETRIES = Number.parseInt(process.env.MAX_RETRIES || "3", 10)

// Supabase configuration
export const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
export const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

// Email configuration
export const SENDPLUS_API_ID = process.env.SENDPLUS_API_ID
export const SENDPLUS_API_SECRET = process.env.SENDPLUS_API_SECRET
export const EMAIL_FROM = process.env.EMAIL_FROM || "recruitment@sfsheriff.com"
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sfsheriff.com"

// Analytics configuration
export const ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS === "true"
export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Feature flags
export const ENABLE_MOCK_MODE = process.env.ENABLE_MOCK_MODE === "true"
export const DEBUG_MODE = process.env.DEBUG_MODE === "true" || process.env.NODE_ENV === "development"

// Check if required environment variables are available
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)
export const isEmailConfigured = !!(SENDPLUS_API_ID && SENDPLUS_API_SECRET)
export const isAnalyticsConfigured = !!GOOGLE_ANALYTICS_ID

// Log environment status on startup (server-side only)
if (typeof window === "undefined") {
  console.log("Environment Configuration:")
  console.log(`- Base URL: ${BASE_URL}`)
  console.log(`- Supabase configured: ${isSupabaseConfigured}`)
  console.log(`- Email configured: ${isEmailConfigured}`)
  console.log(`- Analytics configured: ${isAnalyticsConfigured}`)
  console.log(`- Debug mode: ${DEBUG_MODE}`)
}

// Helper function to get environment name
export function getEnvironmentName(): "development" | "production" | "test" | "preview" {
  if (process.env.NODE_ENV === "test") return "test"
  if (process.env.NODE_ENV === "development") return "development"
  if (process.env.VERCEL_ENV === "preview") return "preview"
  return "production"
}

// Helper function to check if we're in a server environment
export function isServer(): boolean {
  return typeof window === "undefined"
}

// Helper function to check if we're in a production environment
export function isProduction(): boolean {
  return getEnvironmentName() === "production"
}
