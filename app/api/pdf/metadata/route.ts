import { NextResponse } from "next/server"
import { getPDFMetadata, pdfExists } from "@/lib/pdf-service"
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

    // Get PDF metadata
    const metadata = await getPDFMetadata(filename)
    if (!metadata) {
      return NextResponse.json({ success: false, message: "Failed to get PDF metadata" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      filename,
      metadata,
    })
  } catch (error) {
    logger.error(`Error in PDF metadata API: ${error}`)
    const { message, statusCode } = handleApiError(error)

    return NextResponse.json({ success: false, message }, { status: statusCode })
  }
}
