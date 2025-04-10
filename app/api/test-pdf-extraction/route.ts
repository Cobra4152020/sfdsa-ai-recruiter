import { NextResponse } from "next/server"
import { scanDocumentsDirectory } from "@/lib/pdf-extractor"

export async function GET() {
  try {
    // Get PDF content from documents directory
    const pdfContents = await scanDocumentsDirectory()

    return NextResponse.json({
      success: true,
      message: "PDF extraction test successful",
      files: Object.keys(pdfContents),
      contents: pdfContents,
    })
  } catch (error) {
    console.error("Error testing PDF extraction:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error testing PDF extraction",
        error: String(error),
      },
      { status: 500 },
    )
  }
}