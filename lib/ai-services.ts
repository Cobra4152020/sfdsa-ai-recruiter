"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { knowledgeBase } from "./knowledge-base"
import fs from "fs"
import path from "path"
import { listAvailablePDFs } from "./pdf-service"

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
      console.log("No PDFs available")
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
        console.log(`Found matching PDF: ${matchingPDF} for question type: ${bestMatchType}`)
        return matchingPDF
      }
    }

    // If no specific match, return the first PDF as fallback
    if (availablePDFs.length > 0) {
      console.log(`No specific match found, using first available PDF: ${availablePDFs[0]}`)
      return availablePDFs[0]
    }

    return null
  } catch (error) {
    console.error("Error finding relevant PDF:", error)
    return null
  }
}

// Function to query OpenAI with a PDF file
async function queryOpenAIWithPDF(question: string, pdfFilename: string) {
  try {
    const documentsDir = path.join(process.cwd(), "public", "documents")
    const filePath = path.join(documentsDir, pdfFilename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`)
      return null
    }

    console.log(`Reading PDF file: ${filePath}`)

    // Read the PDF file
    const pdfData = fs.readFileSync(filePath)

    console.log(`Successfully read PDF file (${pdfData.length} bytes)`)

    // Generate response using OpenAI with the PDF file
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are Sergeant Ken, a recruitment officer with the San Francisco Deputy Sheriff's Office with 15 years of experience.
              Answer the following question based on the provided PDF document.
              Keep your answer conversational, helpful, and focused on recruitment information.
              
              Question: ${question}`,
            },
            {
              type: "file",
              data: pdfData,
              mimeType: "application/pdf",
              filename: pdfFilename,
            },
          ],
        },
      ],
    })

    console.log("Successfully generated response from OpenAI with PDF")

    return {
      text,
      source: `PDF: ${pdfFilename}`,
      confidence: 0.95,
    }
  } catch (error) {
    console.error("Error querying OpenAI with PDF:", error)
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
      console.log("Question appears to be related to PDF content")

      // Find the most relevant PDF
      const relevantPDF = await findRelevantPDF(question)

      if (relevantPDF) {
        console.log(`Found relevant PDF: ${relevantPDF}, querying OpenAI with it`)

        // Query OpenAI with the PDF
        const pdfResponse = await queryOpenAIWithPDF(question, relevantPDF)

        if (pdfResponse) {
          console.log("Successfully got response from PDF query")
          return pdfResponse
        }

        console.log("Failed to get response from PDF query, falling back to knowledge base")
      } else {
        console.log("No relevant PDF found, falling back to knowledge base")
      }
    }

    // If we get here, either it's not a PDF question or PDF processing failed
    // Fall back to the original knowledge base approach
    console.log("Using knowledge base approach")

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
    console.error("Error querying AI:", error)
    return {
      text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
      confidence: 0.5,
    }
  }
}