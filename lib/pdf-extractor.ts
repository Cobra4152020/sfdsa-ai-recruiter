import fs from "fs"
import path from "path"

// Cache for PDF content to avoid repeated extraction
const pdfContentCache: Record<string, string> = {}

export async function getPDFContent(filename: string): Promise<string> {
  // Check if content is already in cache
  if (pdfContentCache[filename]) {
    return pdfContentCache[filename]
  }

  // For demonstration purposes, we'll simulate PDF content
  // In a production environment, you would use a proper PDF extraction library
  const documentsDir = path.join(process.cwd(), "public/documents")
  const filePath = path.join(documentsDir, filename)

  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found: ${filename}`)
  }

  // Simulate PDF content based on filename
  let content = ""

  if (filename === "sfers-guide.pdf") {
    content = `
      # San Francisco Employees' Retirement System (SFERS) Guide
      
      ## Overview
      The San Francisco Employees' Retirement System (SFERS) provides retirement, disability, and death benefits to qualified employees of the City and County of San Francisco, including Deputy Sheriffs.
      
      ## Retirement Benefits for Deputy Sheriffs
      
      ### Retirement Formula
      As a Deputy Sheriff, you are eligible for the "Safety Plan" retirement benefits. The retirement formula is 3% of your highest average compensation for each year of service.
      
      ### Eligibility
      You can retire with full benefits after:
      - 30 years of service at any age, or
      - 20 years of service at age 50 or older
      
      ### Example Calculation
      If you work for 25 years and your highest average salary is $120,000, your annual pension would be approximately $90,000 (3% × 25 years × $120,000).
      
      ### Contributions
      - You contribute approximately 7.5% of your salary to the retirement system
      - The City and County of San Francisco also makes contributions on your behalf
      
      ### Additional Benefits
      - Cost of Living Adjustments (COLAs) to protect against inflation
      - Disability retirement benefits if you become disabled while employed
      - Death benefits for your survivors
      - Option to purchase service credit for prior public service
      
      ## Supplemental Plans
      In addition to your defined benefit pension, you may also participate in:
      - Deferred Compensation Plan (457(b))
      - Health savings accounts
      
      ## Retirement Planning
      SFERS offers retirement planning seminars and one-on-one counseling to help you prepare for retirement.
      
      ## Contact Information
      For more information, contact SFERS at (415) 487-7000 or visit sfers.org
    `
  } else if (filename === "cba-2023.pdf") {
    content = "Collective Bargaining Agreement content would appear here."
  } else if (filename === "employee-handbook.pdf") {
    content = "Employee Handbook content would appear here."
  } else if (filename === "health-benefits-guide.pdf") {
    content = "Health Benefits Guide content would appear here."
  } else {
    content = `Content for ${filename} would appear here.`
  }

  // Cache the content
  pdfContentCache[filename] = content

  return content
}

// Function to check if a PDF file exists
export function pdfExists(filename: string): boolean {
  const documentsDir = path.join(process.cwd(), "public/documents")
  const filePath = path.join(documentsDir, filename)
  return fs.existsSync(filePath)
}

// Function to list all available PDFs
export function listAvailablePDFs(): string[] {
  const documentsDir = path.join(process.cwd(), "public/documents")

  if (!fs.existsSync(documentsDir)) {
    return []
  }

  return fs.readdirSync(documentsDir).filter((file) => file.toLowerCase().endsWith(".pdf"))
}