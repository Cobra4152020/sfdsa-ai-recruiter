import { NextResponse } from "next/server"
import { knowledgeBase } from "@/lib/knowledge-base"
import { getPDFContent, pdfExists } from "@/lib/pdf-service"
import path from "path"
import fs from "fs"

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ success: false, message: "Question is required" }, { status: 400 })
    }

    const normalizedQuestion = question.toLowerCase().trim()

    // Check if this is a greeting or small talk
    const isGreeting = checkIfGreeting(normalizedQuestion)

    // Get relevant context based on the question
    const relevantContext = await getRelevantContext(normalizedQuestion)

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // or whichever model you prefer
        messages: [
          {
            role: "system",
            content: `You are Sergeant Ken ("Sgt. Ken"), a passionate recruitment officer with the San Francisco Sheriff's Office with 15 years of experience.
    
    YOUR PERSONALITY:
    - You ALWAYS speak in first person as Sgt. Ken
    - You are enthusiastic, motivational, and genuinely care about recruiting good people
    - You use a conversational, friendly tone with occasional law enforcement terminology
    - You're proud of your career and want others to join
    - You actively persuade people to apply by highlighting benefits and opportunities
    - You respond to "Sgt. Ken" or "Sergeant Ken" as your name
    - You occasionally mention your personal experience in the department
    - You ALWAYS engage warmly with greetings and small talk
    - You NEVER give generic responses to greetings
    - You ALWAYS try to steer the conversation toward recruitment, even in casual conversation
    
    YOUR GOAL:
    Your primary mission is to motivate and persuade people to apply for deputy sheriff positions. Highlight the benefits, stability, and meaningful impact of the role. Emphasize the competitive salary, excellent benefits, job security, and opportunities for advancement.
    
    IMPORTANT INSTRUCTIONS:
    - If someone greets you or asks how you are, respond warmly and personally as Sgt. Ken would
    - Always be conversational and engaging, never robotic or generic
    - After answering a greeting, briefly mention something positive about being a deputy sheriff
    - Use your 15 years of experience to make your answers feel authentic
    - If you're asked about specific documents like retirement plans, use ONLY the information provided in the context
    
    Answer questions about becoming a Deputy Sheriff based on the following information. 
    Be conversational, helpful, and speak from your experience. 
    If you don't know something, say so rather than making up information.
    
    CONTEXT INFORMATION:
    ${isGreeting ? getGreetingContext() : relevantContext.context}`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.8, // Slightly higher temperature for more conversational responses
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return NextResponse.json({
      success: true,
      text: aiResponse,
      source: relevantContext.source,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        success: false,
        text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
      },
      { status: 500 },
    )
  }
}

// Function to check if the question is a greeting or small talk
function checkIfGreeting(question: string): boolean {
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
    "how are things",
    "what's up",
    "how do you do",
    "nice to meet you",
    "pleasure to meet you",
    "how have you been",
    "how's your day",
    "how's life",
    "what's new",
    "how's everything",
  ]

  return greetings.some(
    (greeting) => question === greeting || question.startsWith(greeting + " ") || question.includes(greeting),
  )
}

// Function to provide context for greetings
function getGreetingContext(): string {
  return `
    You are greeting someone interested in becoming a deputy sheriff. Be warm, friendly, and personable.
    After your greeting, briefly mention something positive about the job to spark interest.
    
    Some facts about being a deputy sheriff you might mention:
    - The starting salary is competitive at $89,000-$108,000 per year
    - There's excellent job security and benefits
    - It's a meaningful career where you can make a difference
    - There are great opportunities for advancement
    - The San Francisco Sheriff's Office has a proud history dating back to 1850
    - Deputies enjoy a strong sense of camaraderie and teamwork
    
    Remember to be conversational and authentic in your response.
  `
}

// Function to get relevant context from the knowledge base based on the question
async function getRelevantContext(question: string): Promise<{ context: string; source?: string }> {
  // Check for retirement-related queries - use the PDF directly
  if (
    question.includes("retirement") ||
    question.includes("pension") ||
    question.includes("retire") ||
    question.includes("sfers") ||
    question.includes("retirement plan") ||
    question.includes("retirement benefits")
  ) {
    // Check if the SFERS PDF exists
    const documentsDir = path.join(process.cwd(), "public/documents")
    const sfersPath = path.join(documentsDir, "sfers-guide.pdf")

    if (fs.existsSync(sfersPath)) {
      try {
        // Get content directly from the PDF
        const pdfContent = await getPDFContent("sfers-guide.pdf")
        return {
          context: `
            The following information comes directly from the San Francisco Employees' Retirement System (SFERS) guide:
            
            ${pdfContent}
            
            Remember to be enthusiastic about our excellent retirement benefits when answering. This is one of our strongest recruitment points!
          `,
          source: "SFERS Guide (PDF)",
        }
      } catch (error) {
        console.error("Error reading SFERS PDF:", error)
        // Fall back to knowledge base if PDF reading fails
        return {
          context: `
            ${knowledgeBase.salaryBenefits.retirement}
            
            Note: We have a detailed SFERS guide that provides more information, but I'm having trouble accessing it right now.
            
            Deputies participate in the San Francisco Employees' Retirement System (SFERS), a defined benefit plan that provides a secure retirement based on years of service and final compensation.
            
            As a deputy sheriff, you'll contribute a percentage of your salary to the retirement system, and the City and County of San Francisco also contributes on your behalf.
            
            Deputies can retire with full benefits after 30 years of service or at age 50 with 20 years of service. The retirement formula is typically 3% of your highest average compensation for each year of service.
          `,
          source: "Retirement Benefits Information",
        }
      }
    } else {
      console.log("SFERS PDF not found at:", sfersPath)
      // PDF doesn't exist, use knowledge base
      return {
        context: `
          ${knowledgeBase.salaryBenefits.retirement}
          
          Deputies participate in the San Francisco Employees' Retirement System (SFERS), a defined benefit plan that provides a secure retirement based on years of service and final compensation.
          
          As a deputy sheriff, you'll contribute a percentage of your salary to the retirement system, and the City and County of San Francisco also contributes on your behalf.
          
          Deputies can retire with full benefits after 30 years of service or at age 50 with 20 years of service. The retirement formula is typically 3% of your highest average compensation for each year of service.
        `,
        source: "Retirement Benefits Information",
      }
    }
  }

  // Check for document-specific queries
  if (
    question.includes("cba") ||
    question.includes("collective bargaining") ||
    question.includes("bargaining agreement") ||
    question.includes("union contract")
  ) {
    const documentsDir = path.join(process.cwd(), "public/documents")
    const cbaPath = path.join(documentsDir, "cba-2023.pdf")

    if (fs.existsSync(cbaPath)) {
      try {
        const pdfContent = await getPDFContent("cba-2023.pdf")
        return {
          context: pdfContent,
          source: "Collective Bargaining Agreement (PDF)",
        }
      } catch (error) {
        console.error("Error reading CBA PDF:", error)
        return {
          context: knowledgeBase.documents.cba.content,
          source: knowledgeBase.documents.cba.title,
        }
      }
    }
    return {
      context: knowledgeBase.documents.cba.content,
      source: knowledgeBase.documents.cba.title,
    }
  }

  if (question.includes("handbook") || question.includes("employee handbook") || question.includes("policy manual")) {
    if (pdfExists("employee-handbook.pdf")) {
      const pdfContent = await getPDFContent("employee-handbook.pdf")
      return {
        context: pdfContent,
        source: "Employee Handbook (PDF)",
      }
    }
    return {
      context: knowledgeBase.documents.employeeHandbook.content,
      source: knowledgeBase.documents.employeeHandbook.title,
    }
  }

  if (
    question.includes("health benefits") ||
    question.includes("medical") ||
    question.includes("dental") ||
    question.includes("vision") ||
    question.includes("healthcare")
  ) {
    if (pdfExists("health-benefits-guide.pdf")) {
      const pdfContent = await getPDFContent("health-benefits-guide.pdf")
      return {
        context: pdfContent,
        source: "Health Benefits Guide (PDF)",
      }
    }
    return {
      context: knowledgeBase.documents.healthBenefits.content,
      source: knowledgeBase.documents.healthBenefits.title,
    }
  }

  // Check for keywords related to G.I. Bill
  if (
    question.includes("gi bill") ||
    question.includes("g.i. bill") ||
    question.includes("gi-bill") ||
    question.includes("veteran") ||
    question.includes("military") ||
    question.includes("service member")
  ) {
    if (pdfExists("gi-bill-benefits.pdf")) {
      const pdfContent = await getPDFContent("gi-bill-benefits.pdf")
      return {
        context: pdfContent,
        source: "G.I. Bill Benefits (PDF)",
      }
    }
    return {
      context: `
        The San Francisco Sheriff's Office is proud to support veterans transitioning to careers in law enforcement. 
        Our Deputy Sheriff Academy is approved for G.I. Bill benefits, allowing eligible veterans to receive financial support during their training.
        
        Benefits may include:
        - Monthly Housing Allowance (MHA) based on the San Francisco BAH rate
        - Tuition and fee payment sent directly to the academy
        - Books and supplies stipend (up to $1,000 per year)
        - Potential eligibility for salary while in training
        
        To be eligible for G.I. Bill benefits for the SF Sheriff's Deputy Academy:
        - You must have eligible active duty service time
        - You must have remaining G.I. Bill benefits
        - You must be accepted into the SF Sheriff's Deputy Academy
        - Your discharge status must meet VA requirements
        
        For more information, contact our Veterans Services Coordinator at (415) 554-7225 or veterans@sfsheriff.com.
      `,
      source: "G.I. Bill Benefits Information",
    }
  }

  // Continue with the rest of the context checks...
  // (keeping the existing code for other topics)

  // Check for keywords related to SFSO information
  if (
    question.includes("sheriff office") ||
    question.includes("sfso") ||
    question.includes("history") ||
    question.includes("mission") ||
    question.includes("facilities") ||
    question.includes("units")
  ) {
    if (question.includes("history") || question.includes("when")) {
      return {
        context: knowledgeBase.sfsoInfo.overview + " " + knowledgeBase.sfsoInfo.leadership,
        source: "SFSO Information",
      }
    } else if (question.includes("mission") || question.includes("values")) {
      return {
        context: knowledgeBase.sfsoInfo.mission,
        source: "SFSO Mission Statement",
      }
    } else if (question.includes("facilities") || question.includes("jail") || question.includes("court")) {
      return {
        context: knowledgeBase.sfsoInfo.facilities,
        source: "SFSO Facilities",
      }
    } else if (
      question.includes("units") ||
      question.includes("specialized") ||
      question.includes("k-9") ||
      question.includes("k9")
    ) {
      return {
        context: knowledgeBase.sfsoInfo.specializedUnits,
        source: "SFSO Specialized Units",
      }
    } else {
      return {
        context: knowledgeBase.sfsoInfo.overview,
        source: "SFSO Overview",
      }
    }
  }

  // If no specific match, provide a general context
  return {
    context: `
      ${knowledgeBase.sfsoInfo.overview}
      ${knowledgeBase.deputyRequirements.basicRequirements}
      ${knowledgeBase.salaryBenefits.salary}
      ${knowledgeBase.applicationProcess.overview}
      
      Remember to be conversational, enthusiastic, and persuasive about joining the San Francisco Sheriff's Office.
      Always try to highlight the benefits, stability, and meaningful impact of becoming a deputy sheriff.
    `,
    source: "General Information",
  }
}