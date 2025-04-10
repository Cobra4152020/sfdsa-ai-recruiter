// Simulated PDF service for serverless environments

// Check if a PDF exists (simulated)
export function pdfExists(filename: string): Promise<boolean> {
    // List of PDFs we're simulating
    const availablePdfs = ["sfers-guide.pdf", "cba-2023.pdf", "employee-handbook.pdf"]
  
    return Promise.resolve(availablePdfs.includes(filename))
  }
  
  // Get content from a PDF (simulated)
  export function getPDFContent(filename: string): Promise<string> {
    // Simulated content for different PDFs
    const pdfContents: Record<string, string> = {
      "sfers-guide.pdf": `San Francisco Employees' Retirement System (SFERS) Guide
  
  The San Francisco Sheriff's Office offers an exceptional retirement package through SFERS. As a deputy sheriff, you'll be enrolled in a defined benefit plan with the following features:
  
  RETIREMENT FORMULA:
  - 3% per year of service at age 55
  - Maximum benefit: 90% of final compensation
  
  EXAMPLE CALCULATION:
  - Deputy with 25 years of service retiring at age 55
  - Final compensation: $120,000
  - Annual pension: $120,000 × 25 years × 3% = $90,000 per year
  - That's 75% of final compensation guaranteed for life
  
  ELIGIBILITY:
  - Service Retirement: Age 50 with 5 years of service
  - Service Retirement: Any age with 30 years of service
  - Vesting: 5 years of credited service
  
  ADDITIONAL BENEFITS:
  - Cost of Living Adjustments to protect against inflation
  - Disability retirement benefits if you're unable to perform your duties
  - Death benefits for your survivors and beneficiaries
  - Option to purchase additional service credit
  
  HEALTH BENEFITS IN RETIREMENT:
  - Eligibility for retiree health benefits through the City
  - Subsidized premiums based on years of service
  - Coverage for you and eligible dependents
  
  This comprehensive retirement package is one of the most valuable benefits of a career in law enforcement with the San Francisco Sheriff's Office. It provides exceptional financial security for your future, especially important in today's uncertain economic climate.`,
  
      "cba-2023.pdf": `Collective Bargaining Agreement 2023
  San Francisco Deputy Sheriffs' Association
  
  This agreement outlines the terms and conditions of employment for Deputy Sheriffs in San Francisco, including:
  
  COMPENSATION:
  - Salary schedules and step increases
  - Overtime and premium pay provisions
  - Shift differential pay
  - Bilingual pay premium
  - Longevity pay
  
  BENEFITS:
  - Health and dental coverage
  - Retirement contributions
  - Uniform allowance
  - Tuition reimbursement
  - Paid time off
  
  WORKING CONDITIONS:
  - Hours of work
  - Assignment and transfer procedures
  - Seniority provisions
  - Grievance procedures
  - Disciplinary procedures
  
  This agreement represents the mutual commitment between the City and County of San Francisco and the Deputy Sheriffs' Association to provide fair compensation and excellent working conditions for law enforcement professionals.`,
  
      "employee-handbook.pdf": `San Francisco Sheriff's Office
  Employee Handbook
  
  INTRODUCTION:
  Welcome to the San Francisco Sheriff's Office. This handbook provides essential information about your employment, benefits, and responsibilities as a member of our team.
  
  MISSION STATEMENT:
  The San Francisco Sheriff's Office is dedicated to ensuring public safety, serving the courts, and securing the jails with the highest level of professionalism and integrity.
  
  CORE VALUES:
  - Integrity
  - Respect
  - Professionalism
  - Excellence
  - Accountability
  
  CAREER DEVELOPMENT:
  - Training opportunities
  - Promotional pathways
  - Specialized assignments
  - Leadership development programs
  
  WORK-LIFE BALANCE:
  - Flexible scheduling options
  - Employee assistance program
  - Wellness initiatives
  - Family support services
  
  This handbook serves as a guide to help you succeed in your career with the San Francisco Sheriff's Office. We are committed to providing you with the resources and support you need to thrive in this rewarding profession.`,
    }
  
    // Return the content if it exists, otherwise return a generic message
    return Promise.resolve(pdfContents[filename] || "PDF content not available")
  }
  
  // List all PDF files (simulated)
  export function listAvailablePDFs(): string[] {
    return Promise.resolve(["sfers-guide.pdf", "cba-2023.pdf", "employee-handbook.pdf"])
  }  