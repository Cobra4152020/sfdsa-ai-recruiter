import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents")

    if (!fs.existsSync(documentsDir)) {
      return NextResponse.json({
        success: false,
        message: "Documents directory does not exist",
      })
    }

    const files = fs.readdirSync(documentsDir)
    const renamedFiles = []

    for (const file of files) {
      if (file.endsWith(".pdf.pdf")) {
        const newName = file.replace(".pdf.pdf", ".pdf")
        const oldPath = path.join(documentsDir, file)
        const newPath = path.join(documentsDir, newName)

        fs.renameSync(oldPath, newPath)
        renamedFiles.push({ old: file, new: newName })
      }
    }

    return NextResponse.json({
      success: true,
      message: "PDF filenames fixed",
      renamedFiles,
    })
  } catch (error) {
    console.error("Error fixing PDF names:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error fixing PDF names",
        error: String(error),
      },
      { status: 500 },
    )
  }
}