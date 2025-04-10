import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

/**
 * Extract text from a PDF file
 */
export async function getTextFromPDF(filename: string): Promise<string> {
  try {
    const pdfPath = path.join(process.cwd(), "public", "documents", filename);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error reading PDF ${filename}:`, error);
    return "";
  }
}

/**
 * Scan the documents directory for PDF files and extract content
 */
export async function scanDocumentsDirectory(): Promise<Record<string, string>> {
  const dirPath = path.join(process.cwd(), "public", "documents");
  const results: Record<string, string> = {};

  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith(".pdf")) {
        const key = path.basename(file, ".pdf").replace(/[\s_]+/g, "_").toLowerCase();
        const content = await getTextFromPDF(file);
        results[key] = content;
      }
    }
  } catch (err) {
    console.error("Failed to scan documents directory:", err);
  }

  return results;
}