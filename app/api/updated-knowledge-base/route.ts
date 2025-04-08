import { NextResponse } from "next/server"
import { scanDocumentsDirectory } from "@/lib/pdf-extractor"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Only allow this in development environment
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, message: "This endpoint is only available in development mode" },
        { status: 403 },
      )
    }

    // Scan the documents directory and extract text from PDFs
    const pdfContents = await scanDocumentsDirectory()

    // Update the documents.ts file in the knowledge base
    await updateDocumentsFile(pdfContents)

    return NextResponse.json({
      success: true,
      message: "Knowledge base updated successfully",
      documents: Object.keys(pdfContents),
    })
  } catch (error) {
    console.error("Error updating knowledge base:", error)
    return NextResponse.json(
      { success: false, message: `Failed to update knowledge base: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}

async function updateDocumentsFile(pdfContents: Record<string, string>) {
  const documentsFilePath = path.join(process.cwd(), "lib/knowledge-base/documents.ts")

  try {
    // Check if file exists
    if (!fs.existsSync(documentsFilePath)) {
      throw new Error(`Documents file not found: ${documentsFilePath}`)
    }

    // Read the current file
    const content = fs.readFileSync(documentsFilePath, "utf8")

    // Create new content for the documents object
    let newDocumentsContent = "export const documents = {\n"

    // Add each PDF document
    for (const [key, text] of Object.entries(pdfContents)) {
      // Format the document name for display
      const displayName = key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      newDocumentsContent += `  ${key}: {
    title: "${displayName}",
    description: "Document extracted from ${key}.pdf",
    content: \`
      ${text.replace(/`/g, "\\`")}
    \`,
    downloadUrl: "/documents/${key}.pdf",
  },\n`
    }

    newDocumentsContent += "};\n"

    // Replace the documents object in the file
    const documentsRegex = /export const documents = \{[\s\S]*?\};/
    const updatedContent = content.replace(documentsRegex, newDocumentsContent)

    // Write the updated content back to the file
    fs.writeFileSync(documentsFilePath, updatedContent, "utf8")

    return true
  } catch (error) {
    console.error(`Error updating documents file: ${error}`)
    throw error
  }
}