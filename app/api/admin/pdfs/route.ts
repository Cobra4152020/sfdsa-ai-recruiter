import { NextResponse } from "next/server"
import { listAvailablePDFs } from "@/lib/pdf-service"

export async function GET() {
  try {
    const pdfs = await listAvailablePDFs()

    return NextResponse.json({
      success: true,
      pdfs,
    })
  } catch (error) {
    console.error("Error listing PDFs:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error listing PDFs: ${(error as Error).message}`,
      },
      { status: 500 },
    )
  }
}
