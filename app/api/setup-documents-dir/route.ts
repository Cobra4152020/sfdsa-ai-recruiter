import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents")

    // Create the documents directory if it doesn't exist
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true })
      return NextResponse.json({
        success: true,
        message: "Documents directory created successfully at " + documentsDir,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Documents directory already exists at " + documentsDir,
    })
  } catch (error) {
    console.error("Error setting up documents directory:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error setting up documents directory: " + error,
      },
      { status: 500 },
    )
  }
}