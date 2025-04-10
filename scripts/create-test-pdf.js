const fs = require("fs")
const path = require("path")
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib")

async function createTestPDF() {
  try {
    const documentsDir = path.join(process.cwd(), "public", "documents")

    // Create directory if it doesn't exist
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true })
      console.log(`Created directory: ${documentsDir}`)
    }

    const pdfPath = path.join(documentsDir, "test-document.pdf")

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Add some text to the PDF
    page.drawText("Test PDF Document", {
      x: 50,
      y: height - 50,
      size: 30,
      font,
      color: rgb(0, 0, 0),
    })

    page.drawText("This is a test PDF document created for testing PDF extraction.", {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    })

    page.drawText("If you can read this text, PDF extraction is working correctly!", {
      x: 50,
      y: height - 120,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    })

    // Save the PDF
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(pdfPath, pdfBytes)

    console.log(`Created test PDF: ${pdfPath}`)
    return true
  } catch (error) {
    console.error(`Error creating test PDF: ${error.message}`)
    return false
  }
}

// Run the function
createTestPDF().catch(console.error)