"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { knowledgeBase } from "./knowledge-base"
import { listAvailablePDFs, getPDFContent } from "./pdf-service"
import { logger } from "./logger"

// Function to check if question is within scope
function isWithinScope(question: string): boolean {
  // Reuse the existing scope check logic
  return true
}

// Function to determine if a question is likely about document content
function isPDFRelatedQuestion(question: string): boolean {
  const pdfKeywords = [
    "document",
    "pdf",
    "file",
    "handbook",
    "manual",
    "guide",
    "retirement",
    "benefits",
    "policy",
    "agreement",
    "cba",
    "collective bargaining",
    "sfers",
  ]

  const questionLower = question.toLowerCase()
  return pdfKeywords.some((keyword) => questionLower.includes(keyword))
}

// Function to find the most relevant PDF for a question
async function findRelevantPDF(question: string): Promise<string | null> {
  try {
    const availablePDFs = await listAvailablePDFs()
    if (!availablePDFs || availablePDFs.length === 0) {
      logger.info("No PDFs available")
      return null
    }

    // Simple keyword matching to find relevant PDF
    const questionLower = question.toLowerCase()

    // Define keywords for each document type
    const documentKeywords: Record<string, string[]> = {
      retirement: ["retirement", "pension", "sfers", "benefits", "3%", "age 50"],
      cba: ["collective", "bargaining", "agreement", "cba", "contract", "union"],
      handbook: ["handbook", "policy", "procedure", "mission", "values"],
      benefits: ["benefits", "health", "dental", "vision", "insurance", "medical"],
    }

    // Find best matching document type
    let bestMatchType = null
    let bestMatchScore = 0

    for (const [docType, keywords] of Object.entries(documentKeywords)) {
      let matchScore = 0
      for (const keyword of keywords) {
        if (questionLower.includes(keyword)) {
          matchScore++
        }
      }
      if (matchScore > bestMatchScore) {
        bestMatchScore = matchScore
        bestMatchType = docType
      }
    }

    if (bestMatchType && bestMatchScore > 0) {
      // Find a PDF that matches this type
      const matchingPDF = availablePDFs.find((pdf) => pdf.toLowerCase().includes(bestMatchType!.toLowerCase()))

      if (matchingPDF) {
        logger.info(`Found matching PDF: ${matchingPDF} for question type: ${bestMatchType}`)
        return matchingPDF
      }
    }

    // If no specific match, return the first PDF as fallback
    if (availablePDFs.length > 0) {
      logger.info(`No specific match found, using first available PDF: ${availablePDFs[0]}`)
      return availablePDFs[0]
    }

    return null
  } catch (error) {
    logger.error("Error finding relevant PDF:", error)
    return null
  }
}

// Function to query OpenAI with PDF content
async function queryOpenAIWithPDF(question: string, pdfFileid: string) {
  try {
    // Get PDF content using our improved service
    const pdfContent = await getPDFContent(pdfFilename)

    if (!pdfContent || pdfContent.trim().length === 0) {
      throw new Error(`Failed to get content from PDF: ${pdfFilename}`)
    }

    logger.info(`Successfully retrieved content from PDF: ${pdfFilename} (${pdfContent.length} characters)`)

    // Add timeout handling for OpenAI calls
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("OpenAI request timed out")), 30000) // 30 second timeout
    })

    // Generate response using OpenAI with the PDF content
    const aiResponsePromise = generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are Sergeant Ken, a recruitment officer with the San Francisco Deputy Sheriff's Office with 15 years of experience.
         Answer the following question based on the provided PDF content.
         Keep your answer conversational, helpful, and focused on recruitment information.
         
         PDF Content:
         ${pdfContent.substring(0, 15000)} // Limit content to 15,000 characters to avoid token limits
         
         If the PDF content doesn't contain relevant information to answer the question, say so and provide general information based on your knowledge.`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    })

    // Race the AI response against the timeout
    const { text } = (await Promise.race([aiResponsePromise, timeoutPromise])) as { text: string }

    logger.info("Successfully generated response from OpenAI with PDF content")

    return {
      text,
      source: `PDF: ${pdfFilename}`,
      confidence: 0.95,
    }
  } catch (error) {
    logger.error("Error querying OpenAI with PDF:", error)
    // Return a more specific error message based on the error type
    if (error.message?.includes("timed out")) {
      return {
        text: "I'm sorry, but it's taking longer than expected to process your question. Please try again in a moment or contact our recruitment team directly at (415) 554-7225.",
        source: "Error",
        confidence: 0.5,
      }
    }
    return null
  }
}

// Helper function to find relevant context from knowledge base
function findRelevantContext(question: string): string {
  const normalizedQuestion = question.toLowerCase()
  const relevantSections = []

  // Check for keywords and add relevant sections
  if (normalizedQuestion.includes("salary") || normalizedQuestion.includes("pay")) {
    relevantSections.push(knowledgeBase.salaryBenefits.salary)
  }
  if (normalizedQuestion.includes("benefits")) {
    relevantSections.push(knowledgeBase.salaryBenefits.healthBenefits)
  }
  if (normalizedQuestion.includes("requirements") || normalizedQuestion.includes("qualifications")) {
    relevantSections.push(knowledgeBase.deputyRequirements.basicRequirements)
  }
  // Add more keyword checks as needed

  // If no specific sections matched, provide general information
  if (relevantSections.length === 0) {
    relevantSections.push(knowledgeBase.sfsoInfo.overview)
    relevantSections.push(knowledgeBase.applicationProcess.overview)
  }

  return relevantSections.join("\n\n")
}

// Make sure to export this function as a named export
export async function queryAI(question: string) {
  try {
    // Check if the question is within scope
    if (!isWithinScope(question)) {
      return {
        text: "As a San Francisco Deputy Sheriff, I'm focused on providing information about our Sheriff's Office and recruitment process. I'd be happy to answer any questions about our qualifications, application process, benefits, or other related topics.",
        confidence: 0.9,
      }
    }

    // Check if this is likely a question about document content
    if (isPDFRelatedQuestion(question)) {
      logger.info("Question appears to be related to PDF content")

      // Find the most relevant PDF
      const relevantPDF = await findRelevantPDF(question)

      if (relevantPDF) {
        logger.info(`Found relevant PDF: ${relevantPDF}, querying OpenAI with it`)

        // Query OpenAI with the PDF
        const pdfResponse = await queryOpenAIWithPDF(question, relevantPDF)

        if (pdfResponse) {
          logger.info("Successfully got response from PDF query")
          return pdfResponse
        }

        logger.info("Failed to get response from PDF query, falling back to knowledge base")
      } else {
        logger.info("No relevant PDF found, falling back to knowledge base")
      }
    }

    // If we get here, either it's not a PDF question or PDF processing failed
    // Fall back to the original knowledge base approach
    logger.info("Using knowledge base approach")

    // Find relevant context from knowledge base
    const relevantContext = findRelevantContext(question)

    // Generate response using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are Sergeant Ken, a recruitment officer with the San Francisco Deputy Sheriff's Office with 15 years of experience. 
     Answer the following question based on this context: ${relevantContext}
     
     Question: ${question}
     
     Keep your answer conversational, helpful, and focused on recruitment information.`,
    })

    return {
      text,
      source: "AI-Generated Response",
      confidence: 0.95,
    }
  } catch (error) {
    logger.error("Error querying AI:", error)

    // Provide more specific error messages based on error type
    if (error.message?.includes("rate limit")) {
      return {
        text: "I'm currently handling many requests. Please try again in a moment or contact our recruitment team directly at (415) 554-7225.",
        confidence: 0.5,
      }
    } else if (error.message?.includes("timed out")) {
      return {
        text: "I'm sorry, but it's taking longer than expected to process your question. Please try again in a moment or contact our recruitment team directly at (415) 554-7225.",
        confidence: 0.5,
      }
    }

    return {
      text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
      confidence: 0.5,
    }
  }
}
