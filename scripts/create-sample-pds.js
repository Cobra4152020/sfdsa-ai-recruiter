const fs = require("fs")
const path = require("path")
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib")

async function createSamplePDFs() {
  try {
    const documentsDir = path.join(process.cwd(), "public", "documents")

    // Create directory if it doesn't exist
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true })
      console.log(`Created directory: ${documentsDir}`)
    }

    // Create sample retirement PDF
    await createRetirementPDF(documentsDir)

    // Create sample CBA PDF
    await createCBAPDF(documentsDir)

    // Create sample handbook PDF
    await createHandbookPDF(documentsDir)

    console.log("Sample PDFs created successfully!")
  } catch (error) {
    console.error(`Error creating sample PDFs: ${error.message}`)
  }
}

async function createRetirementPDF(dir) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Title
  page.drawText("SAN FRANCISCO EMPLOYEES' RETIREMENT SYSTEM (SFERS)", {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
  })

  page.drawText("GUIDE FOR DEPUTY SHERIFFS", {
    x: 50,
    y: height - 80,
    size: 14,
    font: boldFont,
  })

  // Content
  const content = [
    { text: "RETIREMENT PLAN OVERVIEW", y: height - 120, bold: true },
    {
      text: "The San Francisco Sheriff's Office offers an exceptional retirement package through SFERS. As a deputy sheriff, you are enrolled in the Safety Plan, which provides a defined benefit pension based on your years of service and final compensation.",
      y: height - 150,
      bold: false,
    },

    { text: "RETIREMENT FORMULA", y: height - 190, bold: true },
    { text: "• 3% at age 50 formula (Safety Plan)", y: height - 210, bold: false },
    {
      text: "• This means you earn 3% of your final compensation for each year of service when retiring at age 50 or older",
      y: height - 230,
      bold: false,
    },
    { text: "• Maximum benefit: 90% of final compensation (after 30 years of service)", y: height - 250, bold: false },

    { text: "RETIREMENT PERCENTAGE BY YEARS OF SERVICE", y: height - 290, bold: true },
    { text: "• 5 years: 15% of final compensation", y: height - 310, bold: false },
    { text: "• 10 years: 30% of final compensation", y: height - 330, bold: false },
    { text: "• 15 years: 45% of final compensation", y: height - 350, bold: false },
    { text: "• 20 years: 60% of final compensation", y: height - 370, bold: false },
    { text: "• 25 years: 75% of final compensation", y: height - 390, bold: false },
    { text: "• 30 years: 90% of final compensation (maximum)", y: height - 410, bold: false },

    { text: "ELIGIBILITY REQUIREMENTS", y: height - 450, bold: true },
    { text: "• Service Retirement: Age 50 with at least 5 years of service", y: height - 470, bold: false },
    { text: "• Service Retirement: Any age with 30 years of service", y: height - 490, bold: false },
    { text: "• Vesting: 5 years of credited service", y: height - 510, bold: false },
  ]

  content.forEach((item) => {
    page.drawText(item.text, {
      x: 50,
      y: item.y,
      size: 12,
      font: item.bold ? boldFont : font,
    })
  })

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(path.join(dir, "sfers-guide.pdf"), pdfBytes)
  console.log("Created sfers-guide.pdf")
}

async function createCBAPDF(dir) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Title
  page.drawText("COLLECTIVE BARGAINING AGREEMENT 2023", {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
  })

  page.drawText("SAN FRANCISCO DEPUTY SHERIFFS' ASSOCIATION", {
    x: 50,
    y: height - 80,
    size: 14,
    font: boldFont,
  })

  // Content
  const content = [
    { text: "ARTICLE I - REPRESENTATION", y: height - 120, bold: true },
    {
      text: "The Deputy Sheriffs' Association (DSA) is recognized as the exclusive representative for all employees in the following classifications:",
      y: height - 150,
      bold: false,
    },
    { text: "• 8302 - Deputy Sheriff", y: height - 180, bold: false },
    { text: "• 8304 - Senior Deputy Sheriff", y: height - 200, bold: false },
    { text: "• 8306 - Sheriff's Sergeant", y: height - 220, bold: false },
    { text: "• 8308 - Sheriff's Lieutenant", y: height - 240, bold: false },
    { text: "• 8310 - Sheriff's Captain", y: height - 260, bold: false },
    { text: "• 8312 - Sheriff's Chief Deputy", y: height - 280, bold: false },

    { text: "ARTICLE II - EMPLOYMENT CONDITIONS", y: height - 320, bold: true },
    { text: "Section 1. Non-Discrimination", y: height - 340, bold: false },
    {
      text: "The City and the Association agree that no employee shall be discriminated against on the basis of race, color, creed, religion, sex, sexual orientation, national origin, physical or mental disability, age, political affiliation or opinion, gender identity, gender expression, or other protected category.",
      y: height - 370,
      bold: false,
    },
  ]

  content.forEach((item) => {
    page.drawText(item.text, {
      x: 50,
      y: item.y,
      size: 12,
      font: item.bold ? boldFont : font,
    })
  })

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(path.join(dir, "cba-2023.pdf"), pdfBytes)
  console.log("Created cba-2023.pdf")
}

async function createHandbookPDF(dir) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Title
  page.drawText("SAN FRANCISCO SHERIFF'S OFFICE", {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
  })

  page.drawText("EMPLOYEE HANDBOOK", {
    x: 50,
    y: height - 80,
    size: 14,
    font: boldFont,
  })

  // Content
  const content = [
    { text: "INTRODUCTION", y: height - 120, bold: true },
    {
      text: "Welcome to the San Francisco Sheriff's Office. This handbook provides essential information about your employment, benefits, and responsibilities as a member of our team.",
      y: height - 150,
      bold: false,
    },

    { text: "MISSION STATEMENT", y: height - 190, bold: true },
    {
      text: "The mission of the San Francisco Sheriff's Office is to be an effective, professional organization that provides safety and security for the courts, the jails, and the people of San Francisco.",
      y: height - 220,
      bold: false,
    },

    { text: "WORK SCHEDULES", y: height - 260, bold: true },
    {
      text: "Deputies typically work a 4/10 schedule (four 10-hour days per week) with three consecutive days off. Various shifts are available including days, swings, and nights.",
      y: height - 290,
      bold: false,
    },
  ]

  content.forEach((item) => {
    page.drawText(item.text, {
      x: 50,
      y: item.y,
      size: 12,
      font: item.bold ? boldFont : font,
    })
  })

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(path.join(dir, "employee-handbook.pdf"), pdfBytes)
  console.log("Created employee-handbook.pdf")
}

createSamplePDFs().catch(console.error)