import { NextResponse } from "next/server"
import { scanDocumentsDirectory } from "@/lib/pdf-extractor"

export async function GET() {
  try {
    // Get PDF content from documents directory
    const pdfContents = await scanDocumentsDirectory()

    return NextResponse.json({
      success: true,
      message: "Knowledge base updated successfully",
      files: Object.keys(pdfContents),
      contents: pdfContents,
    })
  } catch (error) {
    console.error("Error updating knowledge base:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error updating knowledge base",
        error: String(error),
      },
      { status: 500 },
    )
  }
}