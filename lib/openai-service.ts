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
const isGreeting = (query: string) => false
const handleGreeting = () => ({ text: "Hello!", source: "N/A" })
const isRetirementQuery = (query: string) => false

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

// The rest of the functions remain the same...
// [Rest of the file with helper functions like isGreeting(), handleGreeting(), etc.]

const isSalaryQuery = (query: string) => false
const handleSalaryQuery = () => ({ text: "Handling salary query...", source: "N/A" })
const isRequirementsQuery = (query: string) => false
const handleRequirementsQuery = () => ({ text: "Handling requirements query...", source: "N/A" })
const isApplicationQuery = (query: string) => false
const handleApplicationQuery = () => ({ text: "Handling application query...", source: "N/A" })

function getGeneralResponse(query: string): string {
  return "This is a general response."
}

async function handleRetirementQuery(query: string): Promise<OpenAIResponse> {
  return { text: "Handling retirement query...", source: "N/A" }
}