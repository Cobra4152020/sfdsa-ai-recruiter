import { NextResponse } from "next/server"
import { queryAI } from "@/lib/ai-services"
import { headers } from "next/headers"
import { ApiError, handleApiError } from "@/lib/error-handler"
import { logger } from "@/lib/logger"
import { measureAsyncPerformance } from "@/lib/monitoring"

// Simple in-memory rate limiting
// Note: This won't persist across serverless function invocations
// For production, use a Redis-based solution
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10
const ipRequestCounts: Record<string, { count: number; resetAt: number }> = {}

function isRateLimited(ip: string): boolean {
  const now = Date.now()

  // Initialize or reset if window has expired
  if (!ipRequestCounts[ip] || now > ipRequestCounts[ip].resetAt) {
    ipRequestCounts[ip] = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW,
    }
  }

  // Increment count
  ipRequestCounts[ip].count++

  // Check if over limit
  return ipRequestCounts[ip].count > MAX_REQUESTS_PER_WINDOW
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const clientIp = forwardedFor ? forwardedFor.split(",")[0] : "unknown"

    logger.info("Chat API request", { clientIp })

    // Check rate limit
    if (isRateLimited(clientIp)) {
      logger.warn("Rate limit exceeded", { clientIp })
      throw new ApiError("You've sent too many requests. Please wait a minute before trying again.", 429)
    }

    const { question } = await request.json()

    if (!question) {
      logger.warn("Missing question in request", { clientIp })
      throw new ApiError("Question is required", 400)
    }

    // Use our queryAI function from ai-services.ts with performance monitoring
    const aiResponse = await measureAsyncPerformance("ai_query", () => queryAI(question), {
      question_length: question.length,
    })

    logger.info("Chat API response success", {
      clientIp,
      question_length: question.length,
      response_length: aiResponse.text.length,
    })

    return NextResponse.json({
      success: true,
      text: aiResponse.text,
      source: aiResponse.source,
    })
  } catch (error) {
    const { message, statusCode } = handleApiError(error)

    return NextResponse.json(
      {
        success: false,
        text: message,
      },
      { status: statusCode },
    )
  }
}
