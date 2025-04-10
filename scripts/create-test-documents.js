const fs = require("fs")
const path = require("path")

// Create the documents directory if it doesn't exist
const documentsDir = path.join(process.cwd(), "public", "documents")
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true })
  console.log(`Created directory: ${documentsDir}`)
}

// Create sample documents if they don't exist
const createSampleDocument = (filename, content) => {
  const filePath = path.join(documentsDir, filename)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content)
    console.log(`Created sample document: ${filename}`)
  } else {
    console.log(`Sample document already exists: ${filename}`)
  }
}

// Create sample retirement document
createSampleDocument(
  "sfers-guide.pdf",
  `SAN FRANCISCO EMPLOYEES' RETIREMENT SYSTEM (SFERS) GUIDE
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
• Vesting: 5 years of credited service`,
)

// Create sample CBA document
createSampleDocument(
  "cba-2023.pdf",
  `COLLECTIVE BARGAINING AGREEMENT 2023
SAN FRANCISCO DEPUTY SHERIFFS' ASSOCIATION

ARTICLE I - REPRESENTATION
The Deputy Sheriffs' Association (DSA) is recognized as the exclusive representative for all employees in the following classifications:
• 8302 - Deputy Sheriff
• 8304 - Senior Deputy Sheriff
• 8306 - Sheriff's Sergeant
• 8308 - Sheriff's Lieutenant
• 8310 - Sheriff's Captain
• 8312 - Sheriff's Chief Deputy

ARTICLE II - EMPLOYMENT CONDITIONS
Section 1. Non-Discrimination
The City and the Association agree that no employee shall be discriminated against on the basis of race, color, creed, religion, sex, sexual orientation, national origin, physical or mental disability, age, political affiliation or opinion, gender identity, gender expression, or other protected category.

ARTICLE III - PAY, HOURS AND BENEFITS
Section 1. Wages
Effective July 1, 2023, represented employees shall receive a base wage increase of three percent (3%).
Effective July 1, 2024, represented employees shall receive a base wage increase of three percent (3%).`,
)

// Create sample handbook document
createSampleDocument(
  "employee-handbook.pdf",
  `SAN FRANCISCO SHERIFF'S OFFICE
EMPLOYEE HANDBOOK

INTRODUCTION
Welcome to the San Francisco Sheriff's Office. This handbook provides essential information about your employment, benefits, and responsibilities as a member of our team.

MISSION STATEMENT
The mission of the San Francisco Sheriff's Office is to be an effective, professional organization that provides safety and security for the courts, the jails, and the people of San Francisco.

WORK SCHEDULES
Deputies typically work a 4/10 schedule (four 10-hour days per week) with three consecutive days off. Various shifts are available including days, swings, and nights.

BENEFITS OVERVIEW
The San Francisco Sheriff's Office offers a comprehensive benefits package including:
• Health, dental, and vision insurance for employees and dependents
• Paid vacation, sick leave, and holidays
• Retirement benefits through SFERS
• Life insurance
• Disability coverage
• Employee assistance program
• Tuition reimbursement`,
)

// Create sample benefits document
createSampleDocument(
  "health-benefits-guide.pdf",
  `HEALTH BENEFITS GUIDE
SAN FRANCISCO SHERIFF'S OFFICE

MEDICAL PLANS
The City offers the following medical plans:
• Blue Shield of California
• Kaiser Permanente
• United Healthcare

COVERAGE LEVELS
• Employee Only
• Employee + 1 Dependent
• Employee + 2 or More Dependents

DENTAL PLANS
• Delta Dental PPO
• DeltaCare USA DHMO
• UnitedHealthcare Dental DHMO

VISION PLAN
• VSP Vision Care

FLEXIBLE SPENDING ACCOUNTS
• Healthcare FSA
• Dependent Care FSA

EMPLOYEE CONTRIBUTION
The City pays a significant portion of the premium costs for employees and their dependents. Employee contributions vary based on the selected plan and coverage level.`,
)

console.log("Sample documents created successfully!")