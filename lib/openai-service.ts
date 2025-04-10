import { scanDocumentsDirectory } from "./pdf-extractor"

type OpenAIResponse = {
  text: string
  source?: string
}

// Keep track of the last query to provide context for follow-up questions
let lastQuery = ""
let lastResponse = ""
// Cache for PDF content
let pdfContentCache: Record<string, string> | null = null

// Dummy implementations or imports for the missing functions/variables
const isCorrectionQuery = (query: string) => false
const handleCorrectionQuery = (query: string, previousQuery: string) => ({
  text: "Handling correction query...",
  source: "N/A",
})

export async function queryOpenAI(query: string): Promise<OpenAIResponse> {
  // Store the current query for context
  const previousQuery = lastQuery
  lastQuery = query

  // Convert query to lowercase for easier matching
  const queryLower = query.toLowerCase()

  // Check if this is a correction to previous information
  if (isCorrectionQuery(queryLower)) {
    return handleCorrectionQuery(queryLower, previousQuery)
  }

  // Load PDF content if not already cached
  if (!pdfContentCache) {
    try {
      console.log("Loading PDF content into cache...")
      pdfContentCache = await scanDocumentsDirectory()
      console.log(`Loaded ${Object.keys(pdfContentCache).length} PDF documents into cache`)
    } catch (error) {
      console.error("Error loading PDF content:", error)
      pdfContentCache = {}
    }
  }

  // First, try to find relevant PDF content for ANY query
  // This ensures PDF content is prioritized over hardcoded responses
  try {
    const pdfResponse = await findRelevantPDFContent(query)
    if (pdfResponse) {
      lastResponse = pdfResponse.text
      return pdfResponse
    }
  } catch (error) {
    console.error("Error searching PDF content:", error)
  }

  // If no relevant PDF content is found, proceed with specialized handlers

  // Check if this is a greeting or small talk
  if (isGreeting(queryLower)) {
    const response = handleGreeting()
    lastResponse = response.text
    return response
  }

  // Check for retirement-related queries
  if (isRetirementQuery(queryLower)) {
    const response = await handleRetirementQuery(query)
    lastResponse = response.text
    return response
  }

  // Check for salary-related queries
  if (isSalaryQuery(queryLower)) {
    const response = handleSalaryQuery()
    lastResponse = response.text
    return response
  }

  // Check for requirements-related queries
  if (isRequirementsQuery(queryLower)) {
    const response = handleRequirementsQuery()
    lastResponse = response.text
    return response
  }

  // Check for application process queries
  if (isApplicationQuery(queryLower)) {
    const response = handleApplicationQuery()
    lastResponse = response.text
    return response
  }

  // Default to general knowledge base
  const response = {
    text: getGeneralResponse(query),
    source: "Knowledge Base",
  }
  lastResponse = response.text
  return response
}

// New function to search all PDFs for relevant content
async function findRelevantPDFContent(query: string): Promise<OpenAIResponse | null> {
  if (!pdfContentCache || Object.keys(pdfContentCache).length === 0) {
    console.log("PDF content cache is empty, loading documents...")
    pdfContentCache = await scanDocumentsDirectory()
  }

  if (Object.keys(pdfContentCache || {}).length === 0) {
    console.log("No PDF documents found in cache after loading")
    return null
  }

  const queryLower = query.toLowerCase()

  // Define keywords for each document type to improve matching
  const documentKeywords: Record<string, string[]> = {
    retirement: [
      "retirement",
      "pension",
      "retire",
      "sfers",
      "benefits",
      "3%",
      "age 50",
      "service",
      "years",
      "compensation",
      "vesting",
      "cola",
      "disability",
      "percentage",
    ],
    cba: [
      "collective",
      "bargaining",
      "agreement",
      "cba",
      "contract",
      "union",
      "compensation",
      "overtime",
      "premium",
      "differential",
      "longevity",
    ],
    handbook: [
      "handbook",
      "policy",
      "procedure",
      "mission",
      "values",
      "career",
      "development",
      "training",
      "work-life",
      "balance",
    ],
    benefits: [
      "benefits",
      "health",
      "dental",
      "vision",
      "insurance",
      "medical",
      "coverage",
      "dependents",
      "family",
      "healthcare",
    ],
  }

  // First, try to find the most relevant document type based on keywords
  let bestMatchDocType = null
  let bestMatchScore = 0

  for (const [docType, keywords] of Object.entries(documentKeywords)) {
    let matchScore = 0
    for (const keyword of keywords) {
      if (queryLower.includes(keyword)) {
        matchScore++
      }
    }
    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore
      bestMatchDocType = docType
    }
  }

  // If we found a matching document type with at least one keyword match
  if (bestMatchDocType && bestMatchScore > 0) {
    console.log(`Found best matching document type: ${bestMatchDocType} with score ${bestMatchScore}`)

    // Find documents that match this type
    const matchingDocs = Object.entries(pdfContentCache || {}).filter(([key]) =>
      key.toLowerCase().includes(bestMatchDocType!.toLowerCase()),
    )

    if (matchingDocs.length > 0) {
      console.log(`Found ${matchingDocs.length} matching documents for type ${bestMatchDocType}`)

      // Find the most relevant document by counting query keywords in each document
      let bestDocKey = matchingDocs[0][0]
      let bestDocScore = 0

      for (const [key, content] of matchingDocs) {
        const contentLower = content.toLowerCase()
        const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 3)

        let docScore = 0
        for (const word of queryWords) {
          if (contentLower.includes(word)) {
            docScore++
          }
        }

        if (docScore > bestDocScore) {
          bestDocScore = docScore
          bestDocKey = key
        }
      }

      const content = pdfContentCache![bestDocKey]

      // Format the response in a conversational way
      return {
        text: formatPDFContentAsResponse(content, query),
        source: `${bestDocKey.replace(/_/g, "-")}.pdf (PDF Document)`,
      }
    }
  }

  // If no specific document type matched well, search all documents
  console.log("No specific document type matched well, searching all documents")

  // Search all documents for the most relevant content
  let bestDocKey = null
  let bestDocScore = 0

  for (const [key, content] of Object.entries(pdfContentCache || {})) {
    const contentLower = content.toLowerCase()
    const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 3)

    let docScore = 0
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        docScore++
      }
    }

    if (docScore > bestDocScore) {
      bestDocScore = docScore
      bestDocKey = key
    }
  }

  if (bestDocKey && bestDocScore > 0) {
    console.log(`Found best matching document: ${bestDocKey} with score ${bestDocScore}`)
    const content = pdfContentCache![bestDocKey]

    return {
      text: formatPDFContentAsResponse(content, query),
      source: `${bestDocKey.replace(/_/g, "-")}.pdf (PDF Document)`,
    }
  }

  return null
}

// Format PDF content as a conversational response
function formatPDFContentAsResponse(content: string, query: string): string {
  // Extract the most relevant section based on the query
  const sections = content.split("\n\n")
  const queryLower = query.toLowerCase()

  let relevantSection = ""
  let highestRelevanceScore = 0

  for (const section of sections) {
    if (section.trim().length < 10) continue // Skip very short sections

    const sectionLower = section.toLowerCase()
    let relevanceScore = 0

    // Count how many words from the query appear in this section
    const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 3)
    for (const word of queryWords) {
      if (sectionLower.includes(word)) {
        relevanceScore++
      }
    }

    if (relevanceScore > highestRelevanceScore) {
      highestRelevanceScore = relevanceScore
      relevantSection = section
    }
  }

  // If we couldn't find a relevant section, use the whole content
  // but limit it to a reasonable size
  if (!relevantSection || relevantSection.length < 50) {
    relevantSection = content.substring(0, 1500) + (content.length > 1500 ? "..." : "")
  }

  // Create a conversational introduction
  const intro = `Based on our official documentation, I can tell you that:`

  // Create a conversational conclusion
  const conclusion = `\n\nIs there anything specific about this information you'd like me to clarify? I'm here to help you understand all the benefits of joining the San Francisco Sheriff's Office.`

  return `${intro}\n\n${relevantSection}${conclusion}`
}

// Replace the placeholder implementations at the bottom of the file with these proper implementations:

// Check if query is about salary
const isSalaryQuery = (query: string): boolean => {
  const salaryKeywords = [
    "salary",
    "pay",
    "money",
    "compensation",
    "wage",
    "earn",
    "income",
    "dollar",
    "payment",
    "overtime",
  ]
  return salaryKeywords.some((keyword) => query.toLowerCase().includes(keyword))
}

// Handle salary queries
const handleSalaryQuery = (): OpenAIResponse => {
  return {
    text: `Deputy Sheriff Recruits start at $89,856 annually. After academy graduation, Deputy Sheriffs earn $98,956 to $120,276 based on experience and qualifications. 

Additional compensation includes premium pay for specialized assignments, bilingual skills, and night shifts. Overtime opportunities are also available, allowing many deputies to significantly increase their annual earnings.

With unemployment rising in many sectors, the Sheriff's Office offers stable employment with guaranteed step increases and cost-of-living adjustments. Our comprehensive benefits package includes excellent health, dental, and vision coverage for you and your dependents.

Would you like to know more about our benefits package or have specific questions about compensation?`,
    source: "Salary Information",
  }
}

// Check if query is about requirements
const isRequirementsQuery = (query: string): boolean => {
  const requirementsKeywords = [
    "requirement",
    "qualify",
    "qualification",
    "eligible",
    "criteria",
    "need to",
    "must have",
    "background",
    "education",
  ]
  return requirementsKeywords.some((keyword) => query.toLowerCase().includes(keyword))
}

// Handle requirements queries
const handleRequirementsQuery = (): OpenAIResponse => {
  return {
    text: `To become a San Francisco Deputy Sheriff, you need to meet these basic requirements:

• U.S. citizenship or permanent resident alien who is eligible for and has applied for citizenship
• Age 21+ by appointment time
• High school diploma or GED (college preferred)
• Valid driver's license
• No felony convictions
• Good moral character
• Pass background checks, physical and psychological evaluations

The physical ability test includes push-ups, sit-ups, a 1.5-mile run, and an obstacle course. Candidates should establish a regular workout routine focusing on cardio, strength, and flexibility.

With the current rise in unemployment, many qualified candidates from various backgrounds are finding success in our hiring process. Would you like more specific information about any of these requirements?`,
    source: "Qualification Requirements",
  }
}

// Check if query is about application process
const isApplicationQuery = (query: string): boolean => {
  const applicationKeywords = [
    "apply",
    "application",
    "process",
    "how to",
    "join",
    "hiring",
    "recruit",
    "test",
    "exam",
    "interview",
  ]
  return applicationKeywords.some((keyword) => query.toLowerCase().includes(keyword))
}

// Handle application process queries
const handleApplicationQuery = (): OpenAIResponse => {
  return {
    text: `The application process for becoming a Deputy Sheriff with the San Francisco Sheriff's Office involves several steps:

1. Online application
2. Written exam
3. Physical ability test
4. Oral interview
5. Background investigation
6. Medical examination
7. Psychological evaluation
8. Final review

Successful candidates receive a conditional offer of employment, followed by academy training. The entire process typically takes 4-6 months.

With unemployment rising, now is an excellent time to apply as we're actively recruiting to fill positions. Our recruiters can provide guidance throughout the process to help you succeed.

Would you like more details about any specific step in the application process?`,
    source: "Application Process",
  }
}

// Check if query is about retirement
const isRetirementQuery = (query: string): boolean => {
  const retirementKeywords = ["retire", "retirement", "pension", "sfers", "401", "benefits after", "after service"]
  return retirementKeywords.some((keyword) => query.toLowerCase().includes(keyword))
}

// Handle retirement queries
async function handleRetirementQuery(query: string): Promise<OpenAIResponse> {
  return {
    text: `Deputies participate in the San Francisco Employees' Retirement System (SFERS). This defined benefit plan provides a secure retirement based on years of service and final compensation.

The retirement formula is 3% of your highest average compensation for each year of service at age 55. For example, if you work for 25 years and your highest average salary is $120,000, your annual pension would be approximately $90,000 (3% × 25 years × $120,000).

Deputies can retire with full benefits after 30 years of service or at age 50 with 20 years of service. The plan also includes provisions for disability retirement and survivor benefits for your family.

Many deputies find that this generous retirement package is one of the most valuable benefits of the job, providing financial security for life after your service.

Would you like more specific information about the retirement benefits?`,
    source: "Retirement Benefits",
  }
}

// Check if query is a greeting
const isGreeting = (query: string): boolean => {
  const greetings = [
    "hello",
    "hi",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
    "what's up",
    "sup",
  ]
  return greetings.some((greeting) => query.toLowerCase().includes(greeting))
}

// Handle greeting
const handleGreeting = (): OpenAIResponse => {
  return {
    text: `Hey there! I'm Sergeant Ken, but you can call me Sgt. Ken. I've been with the San Francisco Sheriff's Office for 15 years now, and I've got to tell you - it's been an incredible journey! 

With unemployment on the rise, there's never been a better time to consider a stable, rewarding career in law enforcement. What would you like to know about becoming a Deputy Sheriff? I'm here to help you take that first step toward an exciting new career!`,
    source: "Greeting",
  }
}

// Provide a general response based on the query
function getGeneralResponse(query: string): string {
  return `Thanks for reaching out! As someone who's been with the San Francisco Sheriff's Office for 15 years, I'm here to help with any questions about becoming a deputy.

With unemployment rising, now is a perfect time to consider a stable, rewarding career in law enforcement. We offer competitive pay starting at $89,856, excellent benefits, job security, and meaningful work that makes a real difference in the community.

I'd be happy to tell you more about qualifications, the application process, or what daily life is like as a deputy. What specific aspect of the job interests you most?`
}