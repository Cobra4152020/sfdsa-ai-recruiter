/**
 * Utility functions for handling domain-specific operations
 */

// The primary domain for the application
export const PRIMARY_DOMAIN = "sfdeputysheriff.com"

// Check if we're in production environment
export const isProduction = process.env.NODE_ENV === "production"

// Get the base URL for the application
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In the browser, use the current hostname
    return window.location.origin
  }

  // In server-side rendering
  if (isProduction) {
    return `https://${PRIMARY_DOMAIN}`
  }

  // In development
  return "http://localhost:3000"
}

// Create an absolute URL from a path
export function createAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
