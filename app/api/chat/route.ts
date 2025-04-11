import { NextResponse } from "next/server"
import { queryAI } from "@/lib/ai-services"

export async function POST(request: Request) {
  try {
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
    return NextResponse.json(
      {
        success: false,
        text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
      },
      { status: 500 },
    )
  }
}