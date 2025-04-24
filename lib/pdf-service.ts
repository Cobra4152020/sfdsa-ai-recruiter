"use server"

import fs from "fs"
import path from "path"

// Cache for PDF content to avoid repeated extraction
const pdfContentCache: Record<string, string> = {}

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
    console.error(`Error checking if PDF exists: ${error}`)
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
      console.warn(`Documents directory not found: ${documentsDir}`)
      return []
    }

    // Read directory and filter for PDF files
    const files = fs.readdirSync(documentsDir).filter((file) => file.toLowerCase().endsWith(".pdf"))

    console.log(`Found ${files.length} PDF files in ${documentsDir}`)
    return files
  } catch (error) {
    console.error(`Error listing PDFs: ${error}`)
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

// Get content from a PDF - this is kept for backward compatibility
// but we're not using it for OpenAI integration anymore
export async function getPDFContent(filename: string): Promise<string> {
  // Check if content is already in cache
  if (pdfContentCache[filename]) {
    console.log(`Using cached content for ${filename}`)
    return pdfContentCache[filename]
  }

  try {
    const filePath = path.join(getDocumentsDir(), filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`)

      // Return simulated content as fallback
      return getSimulatedContent(filename)
    }

    // For now, just return simulated content instead of actually parsing the PDF
    // This avoids dependency issues during build
    const content = getSimulatedContent(filename)

    // Cache the content for future requests
    pdfContentCache[filename] = content

    console.log(`Successfully generated and cached content for ${filename}`)
    return content
  } catch (error) {
    console.error(`Error reading PDF content: ${error}`)

    // Return simulated content as fallback
    return getSimulatedContent(filename)
  }
}

// Provide simulated content as fallback
function getSimulatedContent(filename: string): string {
  const lowerFilename = filename.toLowerCase()

  if (lowerFilename.includes("sfers") || lowerFilename.includes("retirement")) {
    return `SAN FRANCISCO EMPLOYEES' RETIREMENT SYSTEM (SFERS) GUIDE
FOR DEPUTY SHERIFFS

RETIREMENT PLAN OVERVIEW
The San Francisco Sheriff's Office offers an exceptional retirement package through SFERS. As a deputy sheriff, you are enrolled in the Safety Plan, which provides a defined benefit pension based on your years of service and final compensation.

RETIREMENT FORMULA
• 3% at age 50 formula (Safety Plan)
• This means you earn 3% of your final compensation for each year of service when retiring at age 50 or older
• Maximum benefit: 90% of final compensation (after 30 years of service)

RETIREMENT PERCENTAGE BY YEARS OF SERVICE
• 5 years: 15% of final compensation
• 10 years: 30% of final compensation
• 15 years: 45% of final compensation
• 20 years: 60% of final compensation
• 25 years: 75% of final compensation
• 30 years: 90% of final compensation (maximum)

ELIGIBILITY REQUIREMENTS
• Service Retirement: Age 50 with at least 5 years of service
• Service Retirement: Any age with 30 years of service
• Vesting: 5 years of credited service`
  }

  if (lowerFilename.includes("cba") || lowerFilename.includes("bargaining")) {
    return `COLLECTIVE BARGAINING AGREEMENT 2023
SAN FRANCISCO DEPUTY SHERIFFS' ASSOCIATION

ARTICLE I - REPRESENTATION
The Deputy Sheriffs' Association (DSA) is recognized as the exclusive representative for all employees in the following classifications:
• 8302 - Deputy Sheriff
• 8304 - Senior Deputy Sheriff
• 8306 - Sheriff's Sergeant
• 8308 - Sheriff's Lieutenant
• 8310 - Sheriff's Captain
• 8312 - Sheriff's Chief Deputy`
  }

  if (lowerFilename.includes("handbook") || lowerFilename.includes("employee")) {
    return `SAN FRANCISCO SHERIFF'S OFFICE
EMPLOYEE HANDBOOK

INTRODUCTION
Welcome to the San Francisco Sheriff's Office. This handbook provides essential information about your employment, benefits, and responsibilities as a member of our team.`
  }

  return `[Simulated content for ${filename}]`
}
