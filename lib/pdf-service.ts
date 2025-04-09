import fs from "fs"
import path from "path"

// Cache for PDF content to avoid repeated file reads
const pdfContentCache: Record<string, string> = {}

/**
 * Check if a PDF file exists in the documents directory
 */
export function pdfExists(filename: string): boolean {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents")
    const filePath = path.join(documentsDir, filename)
    return fs.existsSync(filePath)
  } catch (error) {
    console.error(`Error checking if PDF exists: ${error}`)
    return false
  }
}

/**
 * Get the content of a PDF file
 * Note: This is a simplified implementation that doesn't actually extract text from PDFs
 * In a production environment, you would use a library like pdf-parse or pdfjs-dist
 */
export async function getPDFContent(filename: string): Promise<string> {
  // Check if content is already cached
  if (pdfContentCache[filename]) {
    return pdfContentCache[filename]
  }

  try {
    const documentsDir = path.join(process.cwd(), "public/documents")
    const filePath = path.join(documentsDir, filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`)
      return `[PDF content for ${filename} not available]`
    }

    // In a real implementation, you would extract text from the PDF here
    // For now, we'll return a placeholder based on the filename
    let content = ""

    if (filename === "sfers-guide.pdf" || filename === "sfers-guide.pdf.pdf") {
      content = `
San Francisco Employees' Retirement System (SFERS) Guide

RETIREMENT BENEFITS FOR DEPUTY SHERIFFS

As a Deputy Sheriff with the San Francisco Sheriff's Office, you are eligible for one of the most generous retirement packages in law enforcement. Here's what you need to know:

RETIREMENT PLAN OVERVIEW:
- Deputies participate in a defined benefit pension plan
- Your retirement benefit is guaranteed for life
- Benefits are based on your years of service and final compensation

ELIGIBILITY:
- You can retire with full benefits after 30 years of service
- You can retire at age 50 with at least 20 years of service
- Early retirement options are available with reduced benefits

RETIREMENT FORMULA:
- Your annual pension is calculated as: 3% × Years of Service × Final Compensation
- Final Compensation is typically your highest average salary over a 12-month period
- Example: With 25 years of service and final compensation of $120,000, your annual pension would be $90,000 (3% × 25 × $120,000)

CONTRIBUTIONS:
- You contribute approximately 7.5% of your salary to the retirement system
- The City and County of San Francisco also contributes on your behalf
- Your contributions are tax-deferred until withdrawal

ADDITIONAL BENEFITS:
- Cost of Living Adjustments (COLAs) to protect against inflation
- Disability retirement benefits if you become disabled on the job
- Survivor benefits for your spouse and eligible dependents
- Option to purchase service credit for military or other public service

RETIREMENT PLANNING:
- SFERS offers retirement planning workshops
- One-on-one counseling is available to help you plan your retirement
- Online calculators are available to estimate your benefits

For more information, contact the SFERS office at (415) 487-7000 or visit sfers.org.
      `
    } else if (filename === "cba-2023.pdf" || filename === "cba-2023.pdf.pdf") {
      content = `
Collective Bargaining Agreement
Between the City and County of San Francisco
and the Deputy Sheriffs' Association
July 1, 2022 - June 30, 2025

[Content of the collective bargaining agreement would appear here]
      `
    } else if (filename === "employee-handbook.pdf" || filename === "employee-handbook.pdf.pdf") {
      content = `
San Francisco Sheriff's Office
Employee Handbook

[Content of the employee handbook would appear here]
      `
    } else if (filename === "health-benefits-guide.pdf") {
      content = `
Health Benefits Guide for San Francisco Sheriff's Office Employees

[Content of the health benefits guide would appear here]
      `
    } else if (filename === "gi-bill-benefits.pdf") {
      content = `
G.I. Bill Benefits for San Francisco Sheriff's Office Academy

[Content of the G.I. Bill benefits guide would appear here]
      `
    } else {
      content = `[PDF content for ${filename}]`
    }

    // Cache the content for future requests
    pdfContentCache[filename] = content

    return content
  } catch (error) {
    console.error(`Error reading PDF: ${error}`)
    return `[Error reading PDF: ${filename}]`
  }
}

/**
 * List all PDF files in the documents directory
 */
export function listPDFFiles(): string[] {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents")

    if (!fs.existsSync(documentsDir)) {
      console.log("Documents directory does not exist")
      return []
    }

    const files = fs.readdirSync(documentsDir)
    return files.filter((file) => file.toLowerCase().endsWith(".pdf"))
  } catch (error) {
    console.error(`Error listing PDF files: ${error}`)
    return []
  }
}