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
      "sfers-guide.pdf": `SAN FRANCISCO EMPLOYEES' RETIREMENT SYSTEM (SFERS) GUIDE
  FOR DEPUTY SHERIFFS
  
  RETIREMENT PLAN OVERVIEW
  The San Francisco Sheriff's Office offers an exceptional retirement package through SFERS. As a deputy sheriff, you are enrolled in the Safety Plan, which provides a defined benefit pension based on your years of service and final compensation.
  
  RETIREMENT FORMULA
  • 3% at age 50 formula (Safety Plan)
  • This means you earn 3% of your final compensation for each year of service when retiring at age 50 or older
  • Maximum benefit: 90% of final compensation (after 30 years of service)
  
  ELIGIBILITY REQUIREMENTS
  • Service Retirement: Age 50 with at least 5 years of service
  • Service Retirement: Any age with 30 years of service
  • Vesting: 5 years of credited service
  
  EXAMPLE CALCULATION
  • Deputy with 25 years of service retiring at age 50
  • Final compensation: $120,000
  • Annual pension: $120,000 × 25 years × 3% = $90,000 per year
  • That's 75% of final compensation guaranteed for life
  
  CONTRIBUTIONS
  • Employee contribution: Approximately 7.5% of salary (pre-tax)
  • Employer contribution: Made by the City and County of San Francisco
  
  ADDITIONAL BENEFITS
  • Cost of Living Adjustments (COLAs) to protect against inflation
  • Disability retirement benefits if you're unable to perform your duties
  • Death benefits for your survivors and beneficiaries
  • Option to purchase additional service credit for military or other public service
  
  HEALTH BENEFITS IN RETIREMENT
  • Eligibility for retiree health benefits through the City
  • Subsidized premiums based on years of service
  • Coverage for you and eligible dependents
  
  SUPPLEMENTAL PLANS
  • Deferred Compensation Plan (457(b))
  • Health savings accounts
  • Voluntary supplemental life insurance
  
  RETIREMENT PLANNING RESOURCES
  • SFERS offers retirement planning seminars
  • One-on-one counseling is available
  • Online calculators to estimate your benefits
  
  This comprehensive retirement package is one of the most valuable benefits of a career in law enforcement with the San Francisco Sheriff's Office. It provides exceptional financial security for your future, especially important in today's uncertain economic climate.
  
  For more information, contact SFERS at (415) 487-7000 or visit sfers.org`,
  
      "cba-2023.pdf": `COLLECTIVE BARGAINING AGREEMENT 2023
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
  WORK SCHEDULES
  • Standard work week: 40 hours
  • Standard work day: 8 hours
  • Alternative work schedules available based on operational needs
  • Shift bidding based on seniority
  
  SENIORITY
  • Seniority determined by date of hire
  • Used for shift bidding, vacation selection, and transfers
  • Promotional seniority based on date of promotion
  
  ARTICLE III - PAY, HOURS AND BENEFITS
  COMPENSATION
  • Salary schedules and step increases
  • Annual cost of living adjustments
  • Overtime pay at 1.5x regular rate
  • Premium pay for specialized assignments:
    - Bilingual pay: $50 biweekly
    - Field Training Officer: 5% premium
    - Canine Unit: 5% premium
    - Emergency Services Unit: 5% premium
    - Range Master: 5% premium
  
  OVERTIME COMPENSATION
  • Overtime defined as hours worked in excess of 40 hours per week
  • Compensated at 1.5x regular rate
  • Minimum 4-hour call-back pay
  • Court appearance minimum: 3 hours
  
  SHIFT DIFFERENTIAL
  • Night shift (6:00 PM to 6:00 AM): 6.25% premium
  • Weekend premium: 6% for regularly scheduled weekend shifts
  
  HEALTH AND WELFARE BENEFITS
  • Medical, dental, and vision coverage
  • City contribution to health coverage
  • Life insurance: $50,000 policy
  • Long-term disability insurance
  
  RETIREMENT BENEFITS
  • San Francisco Employees' Retirement System (SFERS)
  • Safety Plan: 3% at age 50
  • City picks up employee contribution during first 3 years of employment
  
  UNIFORM ALLOWANCE
  • Annual uniform allowance: $1,000
  • Initial uniform issuance for new hires
  • Replacement of damaged uniforms in line of duty
  
  EDUCATIONAL INCENTIVES
  • Tuition reimbursement: Up to $2,000 per fiscal year
  • Educational incentive pay:
    - AA/AS Degree: 2% of base pay
    - BA/BS Degree: 4% of base pay
    - MA/MS Degree: 6% of base pay
  
  ARTICLE IV - WORKING CONDITIONS
  HEALTH AND SAFETY
  • Department-provided safety equipment
  • Regular safety training
  • Exposure protocols for biohazards
  
  TRAINING
  • Minimum 24 hours of annual training
  • POST certification maintenance
  • Specialized training for assignments
  
  ARTICLE V - SCOPE
  This Agreement shall be in effect from July 1, 2022 through June 30, 2025.`,
  
      "employee-handbook.pdf": `SAN FRANCISCO SHERIFF'S OFFICE
  EMPLOYEE HANDBOOK
  
  INTRODUCTION
  Welcome to the San Francisco Sheriff's Office. This handbook provides essential information about your employment, benefits, and responsibilities as a member of our team.
  
  MISSION STATEMENT
  The San Francisco Sheriff's Office is dedicated to ensuring public safety, serving the courts, and securing the jails with the highest level of professionalism and integrity.
  
  HISTORY OF THE DEPARTMENT
  The San Francisco Sheriff's Office was established in 1850, making it one of the oldest law enforcement agencies in California. Throughout our history, we have been at the forefront of innovative approaches to corrections and rehabilitation.
  
  ORGANIZATIONAL STRUCTURE
  The Sheriff's Office is organized into several divisions:
  • Administration Division
  • Custody Division
  • Field Operations Division
  • Programs Division
  • Training Division
  • Professional Standards Division
  
  FACILITIES
  The Sheriff's Office operates several facilities:
  • County Jail #1 (Intake and Release Center)
  • County Jail #2 (425 7th Street)
  • County Jail #3 (Hall of Justice)
  • County Jail #4 (Hall of Justice)
  • County Jail #5 (San Bruno Complex)
  • City Hall Security
  • Superior Court Security
  
  SPECIALIZED UNITS
  • Emergency Services Unit (ESU)
  • Canine Unit (K-9)
  • Marine Unit
  • Transportation Unit
  • Classification Unit
  • Warrant Service Unit
  • Electronic Monitoring Unit
  
  CAREER DEVELOPMENT
  PROMOTIONAL OPPORTUNITIES
  • Senior Deputy Sheriff
  • Sheriff's Sergeant
  • Sheriff's Lieutenant
  • Sheriff's Captain
  • Chief Deputy Sheriff
  • Assistant Sheriff
  • Undersheriff
  
  SPECIALIZED ASSIGNMENTS
  • Field Training Officer
  • Range Master
  • Defensive Tactics Instructor
  • Hostage Negotiator
  • Peer Support Team
  • Critical Incident Response Team
  • Recruitment Team
  
  TRAINING OPPORTUNITIES
  • Advanced Officer Training
  • Supervisory and Leadership Training
  • Crisis Intervention Training
  • Tactical Communications
  • De-escalation Techniques
  • Mental Health First Aid
  
  WORK-LIFE BALANCE
  • Employee Assistance Program
  • Wellness Program
  • Peer Support Team
  • Critical Incident Stress Management
  • Financial Wellness Resources
  • Retirement Planning
  
  POLICIES AND PROCEDURES
  • Code of Conduct
  • Use of Force Policy
  • Anti-Discrimination and Harassment Policy
  • Grievance Procedures
  • Disciplinary Procedures
  • Uniform and Appearance Standards
  
  This handbook serves as a guide to help you succeed in your career with the San Francisco Sheriff's Office. We are committed to providing you with the resources and support you need to thrive in this rewarding profession.`,
    }
  
    // Return the content if it exists, otherwise return a generic message
    return Promise.resolve(pdfContents[filename] || "PDF content not available")
  }
  
  // List all PDF files (simulated)
  export function listAvailablePDFs(): Promise<string[]> {
    return Promise.resolve(["sfers-guide.pdf", "cba-2023.pdf", "employee-handbook.pdf"])
  }  