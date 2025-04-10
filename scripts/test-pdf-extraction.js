const fs = require("fs")
const path = require("path")
const pdfParse = require("pdf-parse")

async function testPdfExtraction() {
  try {
    const documentsDir = path.join(process.cwd(), "public", "documents")

    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.error(`Documents directory not found: ${documentsDir}`)
      console.log(`Creating directory: ${documentsDir}`)
      fs.mkdirSync(documentsDir, { recursive: true })
      console.log(`Directory created: ${documentsDir}`)
      return
    }

    // Read directory
    const files = fs.readdirSync(documentsDir)
    const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"))

    console.log(`Found ${pdfFiles.length} PDF files in ${documentsDir}`)

    // Process each PDF file
    for (const file of pdfFiles) {
      console.log(`\nProcessing: ${file}`)
      const filePath = path.join(documentsDir, file)

      try {
        // Read the file
        const dataBuffer = fs.readFileSync(filePath)

        // Parse PDF
        const data = await pdfParse(dataBuffer)

        // Print summary
        console.log(`Pages: ${data.numpages}`)
        console.log(`Text length: ${data.text.length} characters`)
        console.log(`First 200 characters: ${data.text.substring(0, 200).replace(/\n/g, " ")}`)
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`)
      }
    }
  } catch (error) {
    console.error(`Error in test script: ${error.message}`)
  }
}

testPdfExtraction().catch(console.error)