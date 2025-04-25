"use server"

import fs from "fs"
import path from "path"
import { getServiceSupabase } from "./supabase-client"
import { logger } from "./logger"
import { measureAsyncPerformance } from "./monitoring"

// PDF parsing library - only import in runtime, not during build
let pdfParse: any = null

// Dynamically import pdf-parse only when needed
async function getPdfParser() {
  if (!pdfParse) {
    try {
      // Dynamic import to avoid loading during build time
      const module = await import("pdf-parse")
      pdfParse = module.default
    } catch (error) {
      logger.error(`Error importing pdf-parse: ${error}`)
      throw new Error("PDF parsing library not available")
    }
  }
  return pdfParse
}

// Get the path to the documents directory
function getDocumentsDir(): string {
  return path.join(process.cwd(), "public", "documents")
}

// Check if a PDF exists
export async function pdfExists(filename: string): Promise<boolean> {
  try {
    const filePath = path.join(getDocumentsDir(), filename)
    return fs.existsSync(filePath)
  } catch (error) {
    logger.error(`Error checking if PDF exists: ${error}`)
    return false
  }
}

// List all PDF files
export async function listAvailablePDFs(): Promise<string[]> {
  try {
    const documentsDir = getDocumentsDir()

    // In production on Vercel, we'll use a predefined list of PDFs
    // since we can't read the directory dynamically in serverless
    if (process.env.NODE_ENV === "production") {
      // These should match the actual PDF files in the public/documents directory
      return [
        "cba-2023.pdf",
        "employee-handbook.pdf",
        "health-benefits-guide.pdf",
        "sfers-guide.pdf",
        "test-document.pdf",
      ]
    }

    // For development, we can read the directory
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      logger.warn(`Documents directory not found: ${documentsDir}`)
      return []
    }

    // Read directory and filter for PDF files
    const files = fs.readdirSync(documentsDir).filter((file) => file.toLowerCase().endsWith(".pdf"))

    logger.info(`Found ${files.length} PDF files in ${documentsDir}`)
    return files
  } catch (error) {
    logger.error(`Error listing PDFs: ${error}`)
    // Fallback to hardcoded list in case of error
    return [
      "cba-2023.pdf",
      "employee-handbook.pdf",
      "health-benefits-guide.pdf",
      "sfers-guide.pdf",
      "test-document.pdf",
    ]
  }
}

// Get content from a PDF with persistent caching
export async function getPDFContent(filename: string): Promise<string> {
  try {
    // First, check if content is cached in Supabase
    const cachedContent = await getPDFContentFromCache(filename)
    if (cachedContent) {
      logger.info(`Using cached content for ${filename} from database`)
      return cachedContent
    }

    // If not cached, extract content from PDF
    const filePath = path.join(getDocumentsDir(), filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      logger.error(`PDF file not found: ${filePath}`)
      throw new Error(`PDF file not found: ${filename}`)
    }

    // Read the file
    const dataBuffer = fs.readFileSync(filePath)

    // Parse PDF content with performance monitoring
    const pdfContent = await measureAsyncPerformance(
      "pdf_parsing",
      async () => {
        try {
          const parser = await getPdfParser()
          const data = await parser(dataBuffer)
          return data.text
        } catch (parseError) {
          logger.error(`Error parsing PDF: ${parseError}`)
          throw new Error(`Failed to parse PDF: ${parseError.message}`)
        }
      },
      { filename },
    )

    // Cache the content for future requests
    await cachePDFContent(filename, pdfContent)

    logger.info(`Successfully extracted and cached content for ${filename}`)
    return pdfContent
  } catch (error) {
    logger.error(`Error reading PDF content: ${error}`)
    throw error
  }
}

// Cache PDF content in Supabase
async function cachePDFContent(filename: string, content: string): Promise<void> {
  try {
    const supabase = getServiceSupabase()

    // Check if the pdf_cache table exists, create it if not
    const { error: tableCheckError } = await supabase.from("pdf_cache").select("count").limit(1).single()

    if (tableCheckError && tableCheckError.code === "PGRST116") {
      // Table doesn't exist, create it
      await supabase.rpc("create_pdf_cache_table")
    }

    // Insert or update the cache entry
    const { error } = await supabase.from("pdf_cache").upsert(
      {
        filename,
        content,
        cached_at: new Date().toISOString(),
      },
      {
        onConflict: "filename",
      },
    )

    if (error) {
      logger.error(`Error caching PDF content: ${error}`)
    }
  } catch (error) {
    logger.error(`Error in cachePDFContent: ${error}`)
  }
}

// Get cached PDF content from Supabase
async function getPDFContentFromCache(filename: string): Promise<string | null> {
  try {
    const supabase = getServiceSupabase()

    // Check if the pdf_cache table exists
    const { error: tableCheckError } = await supabase.from("pdf_cache").select("count").limit(1).single()

    if (tableCheckError && tableCheckError.code === "PGRST116") {
      // Table doesn't exist yet
      return null
    }

    // Get the cached content
    const { data, error } = await supabase
      .from("pdf_cache")
      .select("content, cached_at")
      .eq("filename", filename)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned, cache miss
        return null
      }
      logger.error(`Error fetching cached PDF content: ${error}`)
      return null
    }

    // Check if cache is stale (older than 24 hours)
    const cachedAt = new Date(data.cached_at)
    const now = new Date()
    const cacheAgeHours = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60)

    if (cacheAgeHours > 24) {
      logger.info(`Cache for ${filename} is stale (${cacheAgeHours.toFixed(2)} hours old)`)
      return null
    }

    return data.content
  } catch (error) {
    logger.error(`Error in getPDFContentFromCache: ${error}`)
    return null
  }
}

// Get PDF metadata
export async function getPDFMetadata(filename: string): Promise<{
  pageCount: number
  info?: Record<string, any>
  metadata?: Record<string, any>
} | null> {
  try {
    const filePath = path.join(getDocumentsDir(), filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      logger.error(`PDF file not found: ${filePath}`)
      return null
    }

    // Read the file
    const dataBuffer = fs.readFileSync(filePath)

    // Parse PDF to get metadata
    const parser = await getPdfParser()
    const data = await parser(dataBuffer)

    return {
      pageCount: data.numpages,
      info: data.info,
      metadata: data.metadata,
    }
  } catch (error) {
    logger.error(`Error getting PDF metadata: ${error}`)
    return null
  }
}
