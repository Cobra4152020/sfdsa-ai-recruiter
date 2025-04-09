import { knowledgeBase } from "./knowledge-base"
import { getPDFContent, pdfExists } from "./pdf-service"

interface OpenAIResponse {
  text: string
  source?: string
}

export async function queryOpenAI(question: string): Promise<OpenAIResponse> {
  try {
    // Normalize the question for better matching
    const normalizedQuestion = question.toLowerCase().trim()

    // Check if the question is within scope
    if (!isWithinScope(normalizedQuestion)) {
      return {
        text: "As a San Francisco Deputy Sheriff, I'm focused on providing information about our Sheriff's Office and recruitment process. I'd be happy to answer any questions about our qualifications, application process, benefits, or other related topics.",
      }
    }

    // Check if this is a greeting
    const isGreeting = checkIfGreeting(normalizedQuestion)

    // Prepare the system message with context from our knowledge base
    const relevantContext = isGreeting
      ? { context: getGreetingContext(), source: "Greeting" }
      : await getRelevantContext(normalizedQuestion)

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
    ${relevantContext.context}`,
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

    return {
      text: aiResponse,
      source: relevantContext.source,
    }
  } catch (error) {
    console.error("Error querying OpenAI:", error)
    return {
      text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
    }
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

// Function to check if the question is within the allowed scope
function isWithinScope(question: string): boolean {
  // If the question is too short, consider it in scope
  if (question.length < 10) return true

  // Check if the question contains any out-of-scope indicators
  const outOfScopeIndicators = [
    "other cities",
    "other counties",
    "other states",
    "other countries",
    "police department",
    "highway patrol",
    "federal",
    "fbi",
    "cia",
    "military",
    "army",
    "navy",
    "marines",
    "air force",
    "coast guard",
    "private security",
    "bounty hunter",
    "private investigator",
  ]

  for (const indicator of outOfScopeIndicators) {
    if (question.includes(indicator)) return false
  }

  // Check if the question is about a geographic area outside of San Francisco
  const nonSFLocations = [
    "oakland",
    "berkeley",
    "san jose",
    "marin",
    "sacramento",
    "los angeles",
    "new york",
    "chicago",
    "miami",
    "seattle",
    "portland",
    "boston",
    "philadelphia",
    "washington dc",
    "houston",
    "dallas",
    "austin",
    "denver",
    "phoenix",
    "las vegas",
    "san diego",
  ]

  // Only flag as out of scope if the question is specifically about law enforcement in these locations
  for (const location of nonSFLocations) {
    if (
      question.includes(location) &&
      (question.includes("sheriff") ||
        question.includes("police") ||
        question.includes("law enforcement") ||
        question.includes("department"))
    ) {
      return false
    }
  }

  return true
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
    if (await pdfExists("sfers-guide.pdf")) {
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
          context: knowledgeBase.salaryBenefits.retirement,
          source: "Retirement Benefits Information",
        }
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

  // Check for keywords related to requirements
  else if (
    question.includes("requirements") ||
    question.includes("qualify") ||
    question.includes("qualifications") ||
    question.includes("eligible") ||
    question.includes("physical") ||
    question.includes("background") ||
    question.includes("academy") ||
    question.includes("training")
  ) {
    if (question.includes("physical") || question.includes("fitness") || question.includes("test")) {
      return {
        context: knowledgeBase.deputyRequirements.physicalRequirements,
        source: "Physical Requirements",
      }
    } else if (question.includes("background") || question.includes("check")) {
      return {
        context: knowledgeBase.deputyRequirements.backgroundCheck,
        source: "Background Check Process",
      }
    } else if (question.includes("academy") || question.includes("training")) {
      return {
        context: knowledgeBase.deputyRequirements.trainingAcademy,
        source: "Training Academy",
      }
    } else if (question.includes("prepare") || question.includes("tips")) {
      return {
        context: knowledgeBase.deputyRequirements.preparationTips,
        source: "Preparation Tips",
      }
    } else {
      return {
        context: knowledgeBase.deputyRequirements.basicRequirements,
        source: "Basic Requirements",
      }
    }
  }

  // Check for keywords related to salary and benefits
  else if (
    question.includes("salary") ||
    question.includes("pay") ||
    question.includes("wage") ||
    question.includes("benefits") ||
    question.includes("health") ||
    question.includes("retirement") ||
    question.includes("vacation") ||
    question.includes("time off")
  ) {
    if (
      question.includes("health") ||
      question.includes("medical") ||
      question.includes("dental") ||
      question.includes("vision")
    ) {
      return {
        context: knowledgeBase.salaryBenefits.healthBenefits,
        source: "Health Benefits",
      }
    } else if (question.includes("retirement") || question.includes("pension")) {
      // Check for keywords related to retirement or pension
      if (
        question.includes("retirement") ||
        question.includes("pension") ||
        question.includes("retire") ||
        question.includes("sfers") ||
        question.includes("401") ||
        question.includes("benefits after") ||
        question.includes("retirement plan") ||
        question.includes("retirement benefits")
      ) {
        return {
          context: `
      ${knowledgeBase.salaryBenefits.retirement}
      
      Additional retirement information:
      Deputies participate in the San Francisco Employees' Retirement System (SFERS), a defined benefit plan that provides a secure retirement based on years of service and final compensation. 
      
      As a deputy sheriff, you'll contribute a percentage of your salary to the retirement system, and the City and County of San Francisco also contributes on your behalf.
      
      Deputies can retire with full benefits after 30 years of service or at age 50 with 20 years of service. The retirement formula is typically 3% of your highest average compensation for each year of service.
      
      For example, if you work for 25 years and your highest average salary is $120,000, your annual pension would be approximately $90,000 (3% × 25 years × $120,000).
      
      The plan also includes provisions for disability retirement and survivor benefits for your family.
      
      Many deputies find that this generous retirement package is one of the most valuable benefits of the job, providing financial security for life after your service.
    `,
          source: "Retirement Benefits Information",
        }
      }
    } else if (
      question.includes("vacation") ||
      question.includes("time off") ||
      question.includes("schedule") ||
      question.includes("hours")
    ) {
      return {
        context: knowledgeBase.salaryBenefits.timeOff,
        source: "Time Off & Schedule",
      }
    } else if (question.includes("additional") || question.includes("other")) {
      return {
        context: knowledgeBase.salaryBenefits.additionalBenefits,
        source: "Additional Benefits",
      }
    } else if (
      question.includes("salary") ||
      question.includes("pay") ||
      question.includes("wage") ||
      question.includes("money")
    ) {
      return {
        context: knowledgeBase.salaryBenefits.salary,
        source: "Salary Information",
      }
    } else {
      return {
        context: `${knowledgeBase.salaryBenefits.salary} ${knowledgeBase.salaryBenefits.healthBenefits}`,
        source: "Salary & Benefits Overview",
      }
    }
  }

  // Check for keywords related to application process
  else if (
    question.includes("apply") ||
    question.includes("application") ||
    question.includes("process") ||
    question.includes("exam") ||
    question.includes("interview") ||
    question.includes("test") ||
    question.includes("steps") ||
    question.includes("how to")
  ) {
    if (question.includes("steps") || question.includes("process")) {
      return {
        context: knowledgeBase.applicationProcess.steps,
        source: "Application Steps",
      }
    } else if (question.includes("exam") || question.includes("written")) {
      return {
        context: knowledgeBase.applicationProcess.writtenExam,
        source: "Written Exam",
      }
    } else if (question.includes("interview") || question.includes("oral")) {
      return {
        context: knowledgeBase.applicationProcess.oralInterview,
        source: "Oral Interview",
      }
    } else if (question.includes("tips") || question.includes("advice")) {
      return {
        context: knowledgeBase.applicationProcess.applicationTips,
        source: "Application Tips",
      }
    } else if (question.includes("contact") || question.includes("recruiter") || question.includes("questions")) {
      return {
        context: knowledgeBase.applicationProcess.contactInfo,
        source: "Contact Information",
      }
    } else {
      return {
        context: knowledgeBase.applicationProcess.overview,
        source: "Application Process Overview",
      }
    }
  }

  // Check for keywords related to DSA
  else if (
    question.includes("dsa") ||
    question.includes("deputy sheriffs association") ||
    question.includes("union") ||
    question.includes("association")
  ) {
    if (question.includes("benefits") || question.includes("member")) {
      return {
        context: knowledgeBase.dsaInfo.benefits,
        source: "DSA Membership Benefits",
      }
    } else if (question.includes("community") || question.includes("involvement") || question.includes("outreach")) {
      return {
        context: knowledgeBase.dsaInfo.communityInvolvement,
        source: "DSA Community Involvement",
      }
    } else if (question.includes("leadership") || question.includes("president")) {
      return {
        context: knowledgeBase.dsaInfo.leadership,
        source: "DSA Leadership",
      }
    } else if (question.includes("contact") || question.includes("website")) {
      return {
        context: knowledgeBase.dsaInfo.contactInfo,
        source: "DSA Contact Information",
      }
    } else {
      return {
        context: knowledgeBase.dsaInfo.overview,
        source: "DSA Overview",
      }
    }
  }

  // Check for keywords related to G.I. Bill
  else if (
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

  // Personal questions about Sgt. Ken
  else if (
    question.includes("who are you") ||
    question.includes("your name") ||
    question.includes("about you") ||
    question.includes("sgt ken") ||
    question.includes("sergeant ken")
  ) {
    return {
      context:
        "I'm Sergeant Ken, a recruitment officer with the San Francisco Deputy Sheriff's Office. I've been with the department for 15 years and have served in various roles including jail operations, court security, and now recruitment. I'm here to help answer any questions you have about joining our team and becoming a deputy sheriff in San Francisco.",
      source: "About Sgt. Ken",
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