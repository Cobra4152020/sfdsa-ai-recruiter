import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getTextFromPDF } from "@/lib/pdf-extractor"

export async function GET() {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents")

    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      return NextResponse.json(
        {
          success: false,
          message: "Documents directory not found",
          path: documentsDir,
        },
        { status: 404 },
      )
    }

    // Get list of PDF files
    const files = fs.readdirSync(documentsDir).filter((file) => file.toLowerCase().endsWith(".pdf"))

    // Extract text from each PDF (first 500 characters only for preview)
    const fileContents: Record<string, string> = {}

    for (const file of files) {
      try {
        const content = await getTextFromPDF(file)
        fileContents[file] = content.substring(0, 500) + "..."
      } catch (error) {
        fileContents[file] = `Error extracting text: ${error.message}`
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${files.length} PDF files`,
      path: documentsDir,
      files,
      fileContents,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Error reading PDFs: ${error.message}`,
        error: String(error),
      },
      { status: 500 },
    )
  }
}