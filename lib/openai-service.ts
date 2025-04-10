// Enhanced OpenAI service implementation that prioritizes PDF document content

import { getKnowledgeBase } from "./knowledgeBase"
import { getPDFContent, pdfExists, listAvailablePDFs } from "./pdf-service"

type OpenAIResponse = {
  text: string
  source?: string
}

// Keep track of the last query to provide context for follow-up questions
let lastQuery = ""
let lastResponse = ""

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
    const response = await handleRetirementQuery()
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
  const queryLower = query.toLowerCase()
  const pdfs = await listAvailablePDFs()

  // Define keywords for each PDF to improve matching
  const pdfKeywords: Record<string, string[]> = {
    "sfers-guide.pdf": [
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
    ],
    "cba-2023.pdf": [
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
    "employee-handbook.pdf": [
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
  }

  // First, try to find a PDF that matches keywords in the query
  let bestMatchPdf = null
  let bestMatchScore = 0

  for (const pdf of pdfs) {
    const keywords = pdfKeywords[pdf] || []
    let matchScore = 0

    for (const keyword of keywords) {
      if (queryLower.includes(keyword)) {
        matchScore++
      }
    }

    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore
      bestMatchPdf = pdf
    }
  }

  // If we found a matching PDF with at least one keyword match
  if (bestMatchPdf && bestMatchScore > 0) {
    try {
      const content = await getPDFContent(bestMatchPdf)

      // Format the response in a conversational way
      return {
        text: formatPDFContentAsResponse(content, query),
        source: `${bestMatchPdf} (PDF Document)`,
      }
    } catch (error) {
      console.error(`Error getting content from ${bestMatchPdf}:`, error)
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
    const sectionLower = section.toLowerCase()
    let relevanceScore = 0

    // Count how many words from the query appear in this section
    const queryWords = queryLower.split(/\s+/)
    for (const word of queryWords) {
      if (word.length > 3 && sectionLower.includes(word)) {
        relevanceScore++
      }
    }

    if (relevanceScore > highestRelevanceScore) {
      highestRelevanceScore = relevanceScore
      relevantSection = section
    }
  }

  // If we couldn't find a relevant section, use the whole content
  if (!relevantSection) {
    relevantSection = content
  }

  // Create a conversational introduction
  const intro = `Based on our official documentation, I can tell you that:`

  // Create a conversational conclusion
  const conclusion = `\n\nIs there anything specific about this information you'd like me to clarify? I'm here to help you understand all the benefits of joining the San Francisco Sheriff's Office.`

  return `${intro}\n\n${relevantSection}${conclusion}`
}

function isCorrectionQuery(query: string): boolean {
  const correctionPhrases = [
    "that's wrong",
    "that is wrong",
    "that's incorrect",
    "that is incorrect",
    "not correct",
    "not right",
    "that's not true",
    "that is not true",
    "you're wrong",
    "you are wrong",
    "incorrect information",
    "false information",
    "mistaken",
    "error",
    "mistake",
    "errors",
    "inaccurate",
    "not accurate",
  ]
  return correctionPhrases.some((phrase) => query.includes(phrase))
}

function handleCorrectionQuery(query: string, previousQuery: string): OpenAIResponse {
  // Check if the correction is about retirement
  if (query.includes("retirement") || query.includes("pension") || query.includes("3%") || query.includes("age")) {
    return {
      text: `You're absolutely right, and I apologize for the inaccurate information. Thank you for the correction!

I should be providing you with information directly from our official documents. Let me try again with the correct information from our SFERS guide:

The retirement formula for San Francisco Deputy Sheriffs is 3% at age 50 under the Safety Plan.

This means:
- You can retire as early as age 50 with at least 5 years of service
- You earn 3% of your final compensation for each year of service
- After 30 years of service, you can retire at any age with 90% of your final compensation

I'll make sure to check our official documentation more carefully in the future. Is there anything specific about our retirement benefits you'd like me to clarify?`,
      source: "Correction",
    }
  }

  // Generic correction response
  return {
    text: `You're absolutely right, and I apologize for providing incorrect information. Thank you for pointing this out!

I should be referring directly to our official documentation rather than relying on my memory. Let me check our documents and provide you with the accurate information.

Could you let me know which specific part was incorrect so I can address it properly? I want to make sure you have the correct information about our Sheriff's Office.`,
    source: "Correction",
  }
}

function isGreeting(query: string): boolean {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "howdy",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "how are you",
    "how's it going",
    "what's up",
    "sup",
  ]
  return greetings.some((greeting) => query.includes(greeting))
}

function handleGreeting(): OpenAIResponse {
  const greetings = [
    "Hey there! I'm doing great today, thanks for asking! I've been busy meeting with potential recruits like yourself. You know, one of the things I love most about being a deputy sheriff is the camaraderie we share. There's nothing like knowing your colleagues have your back. Are you considering a career in law enforcement? I'd be happy to tell you about our competitive starting salary of $89,000-$108,000!",
    "Hi! It's great to meet you! I'm having a fantastic day helping people learn about the exciting opportunities at the San Francisco Sheriff's Office. With unemployment rates rising, more people are discovering the stability and benefits of a career in law enforcement. What aspects of becoming a deputy sheriff are you most curious about?",
    "Hello! I'm doing excellent, thanks for asking! I just got back from a recruitment event where I met some amazing candidates. It's always energizing to see people excited about joining our team. The Sheriff's Office has been my home for 15 years, and I still wake up every day proud to put on the uniform. What can I help you learn about today?",
    "Hey! I'm doing well! Just finished my shift at the Sheriff's Office and now I'm here to help answer any questions you might have. We're looking for dedicated individuals to join our team, especially with the current economic climate pushing more people to consider stable government positions. What would you like to know about the job?",
  ]

  // Return a random greeting
  return {
    text: greetings[Math.floor(Math.random() * greetings.length)],
    source: "Conversation",
  }
}

function isRetirementQuery(query: string): boolean {
  const retirementKeywords = [
    "retirement",
    "pension",
    "retire",
    "401k",
    "401(k)",
    "benefits after retirement",
    "retirement plan",
    "retirement benefits",
    "sfers",
  ]
  return retirementKeywords.some((keyword) => query.includes(keyword))
}

async function handleRetirementQuery(): Promise<OpenAIResponse> {
  try {
    // Try to get retirement information from PDF
    if (await pdfExists("sfers-guide.pdf")) {
      const pdfContent = await getPDFContent("sfers-guide.pdf")
      return {
        text: formatPDFContentAsResponse(pdfContent, "retirement"),
        source: "SFERS Guide PDF",
      }
    }
  } catch (error) {
    console.error("Error accessing retirement PDF:", error)
  }

  // Fallback to knowledge base
  return {
    text: `The San Francisco Sheriff's Office offers an excellent retirement package through the San Francisco Employees' Retirement System (SFERS). As a deputy sheriff, you'll be enrolled in a defined benefit plan that provides:

- A retirement formula of 3% per year of service at age 50
- For example, after 25 years of service, you could retire with 75% of your final compensation
- Full retirement eligibility after 30 years of service regardless of age
- Disability and survivor benefits
- Retiree health benefits

This is one of the most generous retirement packages in law enforcement and provides exceptional financial security for your future. Would you like to know more about other benefits or aspects of the job?`,
    source: "Knowledge Base",
  }
}

function isSalaryQuery(query: string): boolean {
  const salaryKeywords = [
    "salary",
    "pay",
    "compensation",
    "wage",
    "money",
    "earn",
    "income",
    "benefits",
    "overtime",
    "ot",
  ]
  return salaryKeywords.some((keyword) => query.includes(keyword))
}

function handleSalaryQuery(): OpenAIResponse {
  return {
    text: `As a San Francisco Deputy Sheriff, you'll enjoy a competitive salary and excellent benefits:

- Starting salary range: $89,000 - $108,000 annually (depending on education and experience)
- Regular step increases based on years of service
- Overtime opportunities that can significantly increase your earnings
- Premium pay for specialized assignments and skills
- Comprehensive health, dental, and vision insurance for you and your family
- Paid vacation, sick leave, and holidays
- Tuition reimbursement for continuing education

With the current economic uncertainty, a career in law enforcement offers stability and security that's hard to find in the private sector. Many of our deputies earn well over $100,000 annually with overtime and special assignments. Would you like to know more about the benefits or career advancement opportunities?`,
    source: "Knowledge Base",
  }
}

function isRequirementsQuery(query: string): boolean {
  const requirementsKeywords = [
    "requirements",
    "qualifications",
    "qualify",
    "eligible",
    "criteria",
    "need to have",
    "background check",
    "education",
    "degree",
    "physical",
  ]
  return requirementsKeywords.some((keyword) => query.includes(keyword))
}

function handleRequirementsQuery(): OpenAIResponse {
  return {
    text: `To become a San Francisco Deputy Sheriff, you'll need to meet these basic requirements:

- Be at least 21 years old at time of appointment
- U.S. citizenship or permanent resident alien who is eligible for and has applied for citizenship
- High school diploma or GED (college credits or degree preferred but not required)
- Valid California driver's license
- No felony convictions
- Pass a comprehensive background check
- Pass a medical and psychological evaluation
- Pass the physical abilities test
- Successfully complete the Sheriff's Academy

The good news is that we don't require prior law enforcement experience or a college degree. Many people who are facing job uncertainty in other industries find that they already qualify for a career with us. Would you like more details about any specific requirement or about the application process?`,
    source: "Knowledge Base",
  }
}

function isApplicationQuery(query: string): boolean {
  const applicationKeywords = [
    "apply",
    "application",
    "process",
    "how to become",
    "join",
    "hiring",
    "test",
    "exam",
    "interview",
    "academy",
  ]
  return applicationKeywords.some((keyword) => query.includes(keyword))
}

function handleApplicationQuery(): OpenAIResponse {
  return {
    text: `The application process to become a San Francisco Deputy Sheriff involves several steps:

1. **Online Application**: Submit your application through the SF Jobs portal
2. **Written Exam**: Pass the entry-level law enforcement test
3. **Physical Abilities Test**: Demonstrate physical fitness for the job
4. **Oral Interview**: Meet with a panel to assess your suitability
5. **Background Investigation**: Comprehensive check of your history
6. **Medical & Psychological Evaluation**: Ensure you're physically and mentally fit for duty
7. **Sheriff's Academy**: 16-week training program

The entire process typically takes 4-6 months from application to academy. With unemployment rising, now is an excellent time to apply as we're actively recruiting to fill positions. Would you like me to provide a link to the application portal or more details about any specific step?`,
    source: "Knowledge Base",
  }
}

function getGeneralResponse(query: string): string {
  // Get response from knowledge base
  const knowledgeBase = getKnowledgeBase()

  // Simple keyword matching
  for (const entry of knowledgeBase) {
    for (const keyword of entry.keywords) {
      if (query.toLowerCase().includes(keyword.toLowerCase())) {
        return entry.response
      }
    }
  }

  // Default response if no keywords match
  return `That's a great question about becoming a San Francisco Deputy Sheriff. While I don't have specific information about that, I'd be happy to tell you about our competitive salary ($89,000-$108,000 starting), excellent benefits, or the application process. What aspect of the job are you most interested in learning about?`
}