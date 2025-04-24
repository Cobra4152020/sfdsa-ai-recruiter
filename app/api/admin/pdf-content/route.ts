import { NextResponse } from "next/server"
import { getPDFContent } from "@/lib/pdf-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ success: false, message: "Filename is required" }, { status: 400 })
    }

    const content = await getPDFContent(filename)

    return NextResponse.json({
      success: true,
      filename,
      content,
    })
  } catch (error) {
    console.error("Error getting PDF content:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error getting PDF content: ${(error as Error).message}`,
      },
      { status: 500 },
    )
  }
}
