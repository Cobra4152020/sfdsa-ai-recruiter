import { NextResponse } from "next/server"
import { listAvailablePDFs, getPDFContent } from "@/lib/pdf-service"

export async function GET(request: Request) {
  try {
    // Get list of available PDFs
    const pdfs = await listAvailablePDFs()

    // If no PDFs found, return early
    if (pdfs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No PDF files found in the documents directory",
        pdfs: [],
      })
    }

    // Get content of the first PDF for testing
    const firstPdf = pdfs[0]
    const content = await getPDFContent(firstPdf)

    // Return the results
    return NextResponse.json({
      success: true,
      message: `Successfully extracted text from ${pdfs.length} PDF files`,
      pdfs,
      sampleContent: {
        filename: firstPdf,
        contentPreview: content.substring(0, 500) + "...", // First 500 chars
      },
    })
  } catch (error) {
    console.error("Error in PDF extraction test:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Error testing PDF extraction: ${error.message}`,
        error: error,
      },
      { status: 500 },
    )
  }
}