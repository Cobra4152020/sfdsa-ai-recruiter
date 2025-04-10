"use server"

import fs from "fs"
import path from "path"
import pdfParse from "pdf-parse"

// Cache for PDF content to avoid repeated extraction
const pdfContentCache: Record<string, string> = {}

/**
 * Extract text from a PDF file using pdf-parse library
 */
export async function getTextFromPDF(filename: string): Promise<string> {
  try {
    const documentsDir = path.join(process.cwd(), "public", "documents")
    const filePath = path.join(documentsDir, filename)

    // Check if content is already in cache
    if (pdfContentCache[filename]) {
      console.log(`Using cached content for ${filename}`)
      return pdfContentCache[filename]
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`)
      return `[PDF file not found: ${filename}]`
    }

    // Read the file as buffer
    const dataBuffer = fs.readFileSync(filePath)

    try {
      // Parse PDF using pdf-parse
      const data = await pdfParse(dataBuffer)

      // If we couldn't extract text, return a message
      if (!data.text || data.text.trim() === "") {
        console.warn(`Could not extract text from ${filename}`)
        return `[Could not extract text from ${filename}. This PDF may require a specialized parser.]`
      }

      // Cache the content for future requests
      pdfContentCache[filename] = data.text

      console.log(`Successfully extracted text from ${filename}: ${data.text.substring(0, 100)}...`)
      return data.text
    } catch (pdfError) {
      console.error(`Error parsing PDF: ${pdfError}`)
      return `[Error parsing PDF ${filename}: ${pdfError.message}]`
    }
  } catch (error) {
    console.error(`Error extracting text from PDF: ${error}`)
    return `[Error extracting text from ${filename}: ${error.message}]`
  }
}

/**
 * Scan the documents directory for PDF files
 */
export async function scanDocumentsDirectory(): Promise<Record<string, string>> {
  const results: Record<string, string> = {}
  const documentsDir = path.join(process.cwd(), "public", "documents")

  try {
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.error(`Documents directory not found: ${documentsDir}`)
      return results
    }

    // Read directory asynchronously
    const files = await fs.promises.readdir(documentsDir)

    // Process PDF files
    for (const file of files) {
      if (file.toLowerCase().endsWith(".pdf")) {
        try {
          // Get text content
          const content = await getTextFromPDF(file)

          // Store with filename as key (without extension)
          const key = file.replace(/\.pdf$/i, "").replace(/-/g, "_")
          results[key] = content
        } catch (error) {
          console.error(`Error processing ${file}: ${error.message}`)
          // Continue with other files even if one fails
          results[file.replace(/\.pdf$/i, "").replace(/-/g, "_")] = `[Error: ${error.message}]`
        }
      }
    }

    return results
  } catch (error) {
    console.error(`Error scanning documents directory: ${error}`)
    return results
  }
}

/**
 * List all available PDF files in the documents directory
 */
export async function listAvailablePDFs(): Promise<string[]> {
  try {
    const documentsDir = path.join(process.cwd(), "public", "documents")

    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.error(`Documents directory not found: ${documentsDir}`)
      return []
    }

    // Get all PDF files asynchronously
    const files = await fs.promises.readdir(documentsDir)
    return files.filter((file) => file.toLowerCase().endsWith(".pdf"))
  } catch (error) {
    console.error(`Error listing PDFs: ${error}`)
    return []
  }
}