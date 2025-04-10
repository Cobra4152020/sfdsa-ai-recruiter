"use server"

import fs from "fs"
import path from "path"
import { getTextFromPDF } from "./pdf-extractor"

// Cache for PDF content to avoid repeated extraction
const pdfContentCache: Record<string, string> = {}

// Get the documents directory path
const getDocumentsDir = () => path.join(process.cwd(), "public/documents")

// Check if a PDF exists
export async function pdfExists(filename: string): Promise<boolean> {
  const filePath = path.join(getDocumentsDir(), filename)
  return fs.existsSync(filePath)
}

// Get content from a PDF
export async function getPDFContent(filename: string): Promise<string> {
  // Check if content is already in cache
  if (pdfContentCache[filename]) {
    console.log(`Using cached content for ${filename}`)
    return pdfContentCache[filename]
  }

  const filePath = path.join(getDocumentsDir(), filename)

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`)
      return `PDF file not found: ${filename}`
    }

    // Extract text from the PDF
    const content = await getTextFromPDF(filename)

    // Cache the content for future requests
    pdfContentCache[filename] = content

    console.log(`Successfully extracted and cached content from ${filename}`)
    return content
  } catch (error) {
    console.error(`Error reading PDF content: ${error}`)
    return `Error reading PDF content: ${error.message}`
  }
}

// List all PDF files
export async function listAvailablePDFs(): Promise<string[]> {
  const documentsDir = getDocumentsDir()

  try {
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.warn(`Documents directory not found: ${documentsDir}`)
      return []
    }

    // Read directory and filter for PDF files
    const files = fs.readdirSync(documentsDir).filter((file) => file.toLowerCase().endsWith(".pdf"))

    console.log(`Found ${files.length} PDF files in ${documentsDir}`)
    return files
  } catch (error) {
    console.error(`Error listing PDFs: ${error}`)
    return []
  }
}