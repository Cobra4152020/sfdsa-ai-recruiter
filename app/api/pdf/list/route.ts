import { NextResponse } from "next/server"
import { listAvailablePDFs } from "@/lib/pdf-service"
import { logger } from "@/lib/logger"
import { handleApiError } from "@/lib/error-handler"

export async function GET() {
  try {
    const pdfs = await listAvailablePDFs()

    return NextResponse.json({
      success: true,
      pdfs,
    })
  } catch (error) {
    logger.error("Error listing PDFs:", error)
    const { message, statusCode } = handleApiError(error)

    return NextResponse.json({ success: false, message }, { status: statusCode })
  }
}
