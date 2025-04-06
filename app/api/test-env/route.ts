import { NextResponse } from "next/server"

export async function GET() {
  // Only check for existence, never expose the actual values
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  return NextResponse.json({
    status: "Environment variables check",
    environment: process.env.NODE_ENV,
    variables: envStatus,
    mockMode:
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY),
  })
}