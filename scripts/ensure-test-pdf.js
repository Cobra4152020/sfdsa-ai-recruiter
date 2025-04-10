const fs = require("fs")
const path = require("path")

// Simple function to create a text file that mimics a PDF
// This avoids the need for pdf-lib dependency
function createTestPdf() {
  try {
    // Create the documents directory if it doesn't exist
    const documentsDir = path.join(process.cwd(), "public", "documents")
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true })
      console.log(`Created directory: ${documentsDir}`)
    }

    // Create a simple text file with .pdf extension
    const pdfPath = path.join(documentsDir, "test-document.pdf")

    // Create simple text content that mimics a PDF
    const content = `%PDF-1.5
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 6 0 R >> >>
endobj
5 0 obj
<< /Length 44 >>
stream
BT /F1 24 Tf 100 700 Td (Test PDF Document) Tj ET
stream
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000210 00000 n
0000000251 00000 n
0000000344 00000 n
trailer
<< /Size 7 /Root 1 0 R >>
startxref
412
%%EOF`

    fs.writeFileSync(pdfPath, content)
    console.log(`Created test PDF: ${pdfPath}`)
    return true
  } catch (error) {
    console.error(`Error creating test PDF: ${error.message}`)
    // Don't fail the build if we can't create the test PDF
    return false
  }
}

// Run the function
createTestPdf()