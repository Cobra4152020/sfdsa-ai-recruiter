/**
 * Structured logging system for consistent logging across the application
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
}

// Environment-aware logging (don't log debug in production)
const isProduction = process.env.NODE_ENV === "production"

// Configure log levels
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Minimum log level based on environment
const MIN_LOG_LEVEL = isProduction ? LOG_LEVELS.info : LOG_LEVELS.debug

// Format log entry for console output
function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry
  let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`

  if (context) {
    formattedMessage += `\nContext: ${JSON.stringify(context, null, 2)}`
  }

  return formattedMessage
}

// Core logging function
function log(level: LogLevel, message: string, context?: Record<string, any>) {
  // Skip logs below minimum level
  if (LOG_LEVELS[level] < MIN_LOG_LEVEL) {
    return
  }

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }

  const formattedEntry = formatLogEntry(entry)

  // Log to appropriate console method
  switch (level) {
    case "debug":
      console.debug(formattedEntry)
      break
    case "info":
      console.info(formattedEntry)
      break
    case "warn":
      console.warn(formattedEntry)
      break
    case "error":
      console.error(formattedEntry)
      break
  }

  // In a real application, you might send logs to a service like Sentry, LogRocket, etc.
  // if (isProduction && level === 'error') {
  //   sendToExternalLoggingService(entry)
  // }
}

// Convenience methods
export const logger = {
  debug: (message: string, context?: Record<string, any>) => log("debug", message, context),
  info: (message: string, context?: Record<string, any>) => log("info", message, context),
  warn: (message: string, context?: Record<string, any>) => log("warn", message, context),
  error: (message: string, context?: Record<string, any>) => log("error", message, context),

  // Log with user context
  withUser: (userId: string) => ({
    debug: (message: string, context?: Record<string, any>) => log("debug", message, { ...context, userId }),
    info: (message: string, context?: Record<string, any>) => log("info", message, { ...context, userId }),
    warn: (message: string, context?: Record<string, any>) => log("warn", message, { ...context, userId }),
    error: (message: string, context?: Record<string, any>) => log("error", message, { ...context, userId }),
  }),
}
