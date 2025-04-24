/**
 * Error handling utility for consistent error management across the application
 */

// Define custom error types
export class ApiError extends Error {
    statusCode: number
  
    constructor(message: string, statusCode = 500) {
      super(message)
      this.name = "ApiError"
      this.statusCode = statusCode
    }
  }
  
  export class AuthenticationError extends Error {
    constructor(message = "Authentication required") {
      super(message)
      this.name = "AuthenticationError"
    }
  }
  
  export class ValidationError extends Error {
    fields: Record<string, string>
  
    constructor(message: string, fields: Record<string, string> = {}) {
      super(message)
      this.name = "ValidationError"
      this.fields = fields
    }
  }
  
  export class DatabaseError extends Error {
    operation: string
  
    constructor(message: string, operation: string) {
      super(message)
      this.name = "DatabaseError"
      this.operation = operation
    }
  }
  
  // Error handling functions
  export function handleApiError(error: unknown): { message: string; statusCode: number } {
    console.error("API Error:", error)
  
    if (error instanceof ApiError) {
      return {
        message: error.message,
        statusCode: error.statusCode,
      }
    }
  
    if (error instanceof AuthenticationError) {
      return {
        message: error.message,
        statusCode: 401,
      }
    }
  
    if (error instanceof ValidationError) {
      return {
        message: error.message,
        statusCode: 400,
      }
    }
  
    if (error instanceof DatabaseError) {
      return {
        message: "A database error occurred. Please try again later.",
        statusCode: 500,
      }
    }
  
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    return {
      message: errorMessage,
      statusCode: 500,
    }
  }
  
  // Function to create user-friendly error messages
  export function getUserFriendlyErrorMessage(error: unknown): string {
    if (error instanceof ValidationError) {
      return `Please check your input: ${error.message}`
    }
  
    if (error instanceof AuthenticationError) {
      return "Please log in to continue."
    }
  
    if (error instanceof DatabaseError) {
      return "We encountered a problem with our database. Please try again later."
    }
  
    if (error instanceof ApiError) {
      if (error.statusCode === 429) {
        return "You've made too many requests. Please wait a moment and try again."
      }
      return error.message
    }
  
    return "Something went wrong. Please try again later."
  }
  
  // Function to format error for logging
  export function formatErrorForLogging(error: unknown): Record<string, any> {
    const baseError = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "UnknownError",
      timestamp: new Date().toISOString(),
    }
  
    if (error instanceof ApiError) {
      return {
        ...baseError,
        statusCode: error.statusCode,
      }
    }
  
    if (error instanceof ValidationError) {
      return {
        ...baseError,
        fields: error.fields,
      }
    }
  
    if (error instanceof DatabaseError) {
      return {
        ...baseError,
        operation: error.operation,
      }
    }
  
    if (error instanceof Error && error.stack) {
      return {
        ...baseError,
        stack: error.stack,
      }
    }
  
    return baseError
  }
  