"use server"

import fs from "fs"
import { logger } from "./logger"

// Dynamically import pdf-parse only when needed
async function getPdfParser() {
  try {
    // Dynamic import to avoid loading during build time
    const module = await import("pdf-parse")
    return module.default
  } catch (error) {
    logger.error(`Error importing pdf-parse: ${error}`)
    throw new Error("PDF parsing library not available")
  }
}

/**
 * Extract text content from a PDF file
 * @param filePath Path to the PDF file
 * @returns Extracted text content
 */
export async function extractPDFText(filePath: string): Promise<string> {
  try {
    // Read the file
    const dataBuffer = fs.readFileSync(filePath)

    // Parse PDF
    const pdfParse = await getPdfParser()
    const data = await pdfParse(dataBuffer)

    // Return the text content
    return data.text
  } catch (error) {
    logger.error(`Error extracting PDF text: ${error}`)
    throw new Error(`Failed to extract PDF text: ${error.message}`)
  }
}

/**
 * Extract metadata from a PDF file
 * @param filePath Path to the PDF file
 * @returns PDF metadata
 */
export async function extractPDFMetadata(filePath: string): Promise<{
  pageCount: number
  info?: Record<string, any>
  metadata?: Record<string, any>
}> {
  try {
    // Read the file
    const dataBuffer = fs.readFileSync(filePath)

    // Parse PDF
    const pdfParse = await getPdfParser()
    const data = await pdfParse(dataBuffer)

    // Return metadata
    return {
      pageCount: data.numpages,
      info: data.info,
      metadata: data.metadata,
    }
  } catch (error) {
    logger.error(`Error extracting PDF metadata: ${error}`)
    throw new Error(`Failed to extract PDF metadata: ${error.message}`)
  }
}

/**
 * Extract text from a specific page of a PDF
 * @param filePath Path to the PDF file
 * @param pageNum Page number (1-based)
 * @returns Text content of the specified page
 */
export async function extractPDFPage(filePath: string, pageNum: number): Promise<string> {
  try {
    // Read the file
    const dataBuffer = fs.readFileSync(filePath)

    // Parse PDF with page rendering option
    const pdfParse = await getPdfParser()
    const data = await pdfParse(dataBuffer, {
      max: pageNum, // Only render up to this page
      pagerender: (pageData: any) => {
        // Check if this is the page we want
        if (pageData.pageIndex === pageNum - 1) {
          return pageData.getTextContent().then((textContent: any) => {
            let text = ""
            // Extract text from each item
            textContent.items.forEach((item: any) => {
              text += item.str + " "
            })
            return text
          })
        }
        // Skip other pages
        return Promise.resolve("")
      },
    })

    // Return the text content
    return data.text
  } catch (error) {
    logger.error(`Error extracting PDF page: ${error}`)
    throw new Error(`Failed to extract PDF page: ${error.message}`)
  }
}
