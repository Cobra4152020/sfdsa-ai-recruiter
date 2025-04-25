import { NextResponse } from "next/server"
import { getPDFContent, pdfExists } from "@/lib/pdf-service"
import { logger } from "@/lib/logger"
import { handleApiError } from "@/lib/error-handler"

export async function GET(request: Request) {
  try {
    // Get filename from query parameters
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ success: false, message: "Filename is required" }, { status: 400 })
    }

    // Check if PDF exists
    const exists = await pdfExists(filename)
    if (!exists) {
      return NextResponse.json({ success: false, message: "PDF not found" }, { status: 404 })
    }

    // Get PDF content
    const content = await getPDFContent(filename)

    return NextResponse.json({
      success: true,
      filename,
      content,
    })
  } catch (error) {
    logger.error(`Error in PDF content API: ${error}`)
    const { message, statusCode } = handleApiError(error)

    return NextResponse.json({ success: false, message }, { status: statusCode })
  }
}
