import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ success: true, message: "Analytics recorded" })
}

export async function POST() {
  return NextResponse.json({ success: true, message: "Analytics recorded" })
}

// Handle all other HTTP methods
export const dynamic = "force-dynamic"
