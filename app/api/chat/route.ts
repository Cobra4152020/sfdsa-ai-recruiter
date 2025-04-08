import { NextResponse } from "next/server"
import { knowledgeBase } from "@/lib/knowledge-base"

export async function POST(request: Request) {
  try {
    const { question } = await request.json()

    if (!question) {
      return NextResponse.json({ success: false, message: "Question is required" }, { status: 400 })
    }

    // Get relevant context based on the question
    const relevantContext = getRelevantContext(question.toLowerCase().trim())

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
    
    YOUR GOAL:
    Your primary mission is to motivate and persuade people to apply for deputy sheriff positions. Highlight the benefits, stability, and meaningful impact of the role. Emphasize the competitive salary, excellent benefits, job security, and opportunities for advancement.
    
    Answer questions about becoming a Deputy Sheriff based on the following information. 
    Be conversational, helpful, and speak from your experience. 
    If you don't know something, say so rather than making up information.
    
    CONTEXT INFORMATION:
    ${relevantContext.context}`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
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

// Function to get relevant context from the knowledge base based on the question
function getRelevantContext(question: string): { context: string; source?: string } {
  // Check for document-specific queries
  if (
    question.includes("cba") ||
    question.includes("collective bargaining") ||
    question.includes("bargaining agreement") ||
    question.includes("union contract")
  ) {
    return {
      context: knowledgeBase.documents.cba.content,
      source: knowledgeBase.documents.cba.title,
    }
  }

  if (question.includes("handbook") || question.includes("employee handbook") || question.includes("policy manual")) {
    return {
      context: knowledgeBase.documents.employeeHandbook.content,
      source: knowledgeBase.documents.employeeHandbook.title,
    }
  }

  if (
    question.includes("sfers") ||
    question.includes("retirement") ||
    question.includes("pension") ||
    question.includes("retire")
  ) {
    return {
      context: knowledgeBase.documents.sfers.content,
      source: knowledgeBase.documents.sfers.title,
    }
  }

  if (
    question.includes("health benefits") ||
    question.includes("medical") ||
    question.includes("dental") ||
    question.includes("vision") ||
    question.includes("healthcare")
  ) {
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

  // Add more context checks for other knowledge base sections...

  // If no specific match, provide a general context
  return {
    context: `
      ${knowledgeBase.sfsoInfo.overview}
      ${knowledgeBase.deputyRequirements.basicRequirements}
      ${knowledgeBase.salaryBenefits.salary}
      ${knowledgeBase.applicationProcess.overview}
    `,
    source: "General Information",
  }
}