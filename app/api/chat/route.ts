import { NextResponse } from "next/server"
import { queryAI } from "@/lib/ai-services"
import { headers } from "next/headers"

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

    // Check rate limit
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          text: "You've sent too many requests. Please wait a minute before trying again.",
        },
        { status: 429 },
      )
    }

    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ success: false, message: "Question is required" }, { status: 400 })
    }

    // Use our queryAI function from ai-services.ts
    const aiResponse = await queryAI(question)

    return NextResponse.json({
      success: true,
      text: aiResponse.text,
      source: aiResponse.source,
    })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Provide more specific error responses based on error type
    if (error.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          success: false,
          text: "Our service is experiencing high demand. Please try again in a few minutes.",
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
      },
      { status: 500 },
    )
  }
}
