import fs from "fs"
import path from "path"
import { PDFDocument } from "pdf-lib"

// This is a simple PDF text extraction utility
// In a production environment, you might want to use a more robust solution
// like pdf.js or a dedicated PDF parsing service

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // Read the PDF file
    const pdfBytes = fs.readFileSync(filePath)

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes)

    // Get the number of pages
    const numPages = pdfDoc.getPageCount()

    // This is a simplified approach - in reality, extracting text from PDFs
    // is complex and may require more sophisticated libraries
    // For now, we'll just return some metadata about the PDF
    return `PDF Document: ${path.basename(filePath)}
Number of pages: ${numPages}
Note: Full text extraction requires additional libraries.`
  } catch (error) {
    console.error(`Error extracting text from PDF: ${error}`)
    return `Error extracting text from ${path.basename(filePath)}`
  }
}

// Function to scan the documents directory and extract text from all PDFs
export async function scanDocumentsDirectory(): Promise<Record<string, string>> {
  const documentsDir = path.join(process.cwd(), "public/documents")
  const results: Record<string, string> = {}

  try {
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.error(`Documents directory not found: ${documentsDir}`)
      return results
    }

    // Get all PDF files
    const files = fs.readdirSync(documentsDir).filter((file) => file.toLowerCase().endsWith(".pdf"))

    // Extract text from each PDF
    for (const file of files) {
      const filePath = path.join(documentsDir, file)
      const text = await extractTextFromPDF(filePath)
      const key = path
        .basename(file, ".pdf")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase()
      results[key] = text
    }

    return results
  } catch (error) {
    console.error(`Error scanning documents directory: ${error}`)
    return results
  }
}