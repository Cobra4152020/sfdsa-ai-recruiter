import { knowledgeBase } from "./knowledge-base"

// This is a mock implementation of Klarna AI integration
// In a real implementation, you would use Klarna's API

interface KlarnaAIResponse {
  text: string
  source?: string
  confidence: number
}

export async function queryKlarnaAI(question: string): Promise<KlarnaAIResponse> {
  // Normalize the question for better matching
  const normalizedQuestion = question.toLowerCase().trim()

  // Check if the question is within scope
  if (!isWithinScope(normalizedQuestion)) {
    return {
      text: "As a San Francisco Deputy Sheriff, I'm focused on providing information about our Sheriff's Office and recruitment process. I'd be happy to answer any questions about our qualifications, application process, benefits, or other related topics.",
      confidence: 0.9,
    }
  }

  // Simple keyword matching to determine the most relevant knowledge base section
  // In a real implementation, this would use Klarna's AI to analyze the question
  let response: KlarnaAIResponse = {
    text: "I don't have specific information about that. Would you like to know about our qualifications, application process, or benefits for deputy sheriff positions here in San Francisco?",
    confidence: 0.5,
  }

  // Check for keywords related to SFSO information
  if (
    normalizedQuestion.includes("sheriff office") ||
    normalizedQuestion.includes("sfso") ||
    normalizedQuestion.includes("history") ||
    normalizedQuestion.includes("mission") ||
    normalizedQuestion.includes("facilities") ||
    normalizedQuestion.includes("units")
  ) {
    if (normalizedQuestion.includes("history") || normalizedQuestion.includes("when")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.sfsoInfo.overview + " " + knowledgeBase.sfsoInfo.leadership),
        source: "SFSO Information",
        confidence: 0.9,
      }
    } else if (normalizedQuestion.includes("mission") || normalizedQuestion.includes("values")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.sfsoInfo.mission),
        source: "SFSO Mission Statement",
        confidence: 0.95,
      }
    } else if (
      normalizedQuestion.includes("facilities") ||
      normalizedQuestion.includes("jail") ||
      normalizedQuestion.includes("court")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.sfsoInfo.facilities),
        source: "SFSO Facilities",
        confidence: 0.9,
      }
    } else if (
      normalizedQuestion.includes("units") ||
      normalizedQuestion.includes("specialized") ||
      normalizedQuestion.includes("k-9") ||
      normalizedQuestion.includes("k9")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.sfsoInfo.specializedUnits),
        source: "SFSO Specialized Units",
        confidence: 0.9,
      }
    } else {
      response = {
        text: addSgtKenPersonality(knowledgeBase.sfsoInfo.overview),
        source: "SFSO Overview",
        confidence: 0.8,
      }
    }
  }

  // Check for keywords related to requirements
  else if (
    normalizedQuestion.includes("requirements") ||
    normalizedQuestion.includes("qualify") ||
    normalizedQuestion.includes("qualifications") ||
    normalizedQuestion.includes("eligible") ||
    normalizedQuestion.includes("physical") ||
    normalizedQuestion.includes("background") ||
    normalizedQuestion.includes("academy") ||
    normalizedQuestion.includes("training")
  ) {
    if (
      normalizedQuestion.includes("physical") ||
      normalizedQuestion.includes("fitness") ||
      normalizedQuestion.includes("test")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.deputyRequirements.physicalRequirements),
        source: "Physical Requirements",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("background") || normalizedQuestion.includes("check")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.deputyRequirements.backgroundCheck),
        source: "Background Check Process",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("academy") || normalizedQuestion.includes("training")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.deputyRequirements.trainingAcademy),
        source: "Training Academy",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("prepare") || normalizedQuestion.includes("tips")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.deputyRequirements.preparationTips),
        source: "Preparation Tips",
        confidence: 0.9,
      }
    } else {
      response = {
        text: addSgtKenPersonality(knowledgeBase.deputyRequirements.basicRequirements),
        source: "Basic Requirements",
        confidence: 0.9,
      }
    }
  }

  // Check for keywords related to salary and benefits
  else if (
    normalizedQuestion.includes("salary") ||
    normalizedQuestion.includes("pay") ||
    normalizedQuestion.includes("wage") ||
    normalizedQuestion.includes("benefits") ||
    normalizedQuestion.includes("health") ||
    normalizedQuestion.includes("retirement") ||
    normalizedQuestion.includes("vacation") ||
    normalizedQuestion.includes("time off")
  ) {
    if (
      normalizedQuestion.includes("health") ||
      normalizedQuestion.includes("medical") ||
      normalizedQuestion.includes("dental") ||
      normalizedQuestion.includes("vision")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.salaryBenefits.healthBenefits),
        source: "Health Benefits",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("retirement") || normalizedQuestion.includes("pension")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.salaryBenefits.retirement),
        source: "Retirement Benefits",
        confidence: 0.95,
      }
    } else if (
      normalizedQuestion.includes("vacation") ||
      normalizedQuestion.includes("time off") ||
      normalizedQuestion.includes("schedule") ||
      normalizedQuestion.includes("hours")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.salaryBenefits.timeOff),
        source: "Time Off & Schedule",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("additional") || normalizedQuestion.includes("other")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.salaryBenefits.additionalBenefits),
        source: "Additional Benefits",
        confidence: 0.9,
      }
    } else if (
      normalizedQuestion.includes("salary") ||
      normalizedQuestion.includes("pay") ||
      normalizedQuestion.includes("wage") ||
      normalizedQuestion.includes("money")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.salaryBenefits.salary),
        source: "Salary Information",
        confidence: 0.95,
      }
    } else {
      response = {
        text: addSgtKenPersonality(
          `${knowledgeBase.salaryBenefits.salary} ${knowledgeBase.salaryBenefits.healthBenefits}`,
        ),
        source: "Salary & Benefits Overview",
        confidence: 0.9,
      }
    }
  }

  // Check for keywords related to application process
  else if (
    normalizedQuestion.includes("apply") ||
    normalizedQuestion.includes("application") ||
    normalizedQuestion.includes("process") ||
    normalizedQuestion.includes("exam") ||
    normalizedQuestion.includes("interview") ||
    normalizedQuestion.includes("test") ||
    normalizedQuestion.includes("steps") ||
    normalizedQuestion.includes("how to")
  ) {
    if (normalizedQuestion.includes("steps") || normalizedQuestion.includes("process")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.applicationProcess.steps),
        source: "Application Steps",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("exam") || normalizedQuestion.includes("written")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.applicationProcess.writtenExam),
        source: "Written Exam",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("interview") || normalizedQuestion.includes("oral")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.applicationProcess.oralInterview),
        source: "Oral Interview",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("tips") || normalizedQuestion.includes("advice")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.applicationProcess.applicationTips),
        source: "Application Tips",
        confidence: 0.9,
      }
    } else if (
      normalizedQuestion.includes("contact") ||
      normalizedQuestion.includes("recruiter") ||
      normalizedQuestion.includes("questions")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.applicationProcess.contactInfo),
        source: "Contact Information",
        confidence: 0.95,
      }
    } else {
      response = {
        text: addSgtKenPersonality(knowledgeBase.applicationProcess.overview),
        source: "Application Process Overview",
        confidence: 0.9,
      }
    }
  }

  // Check for keywords related to DSA
  else if (
    normalizedQuestion.includes("dsa") ||
    normalizedQuestion.includes("deputy sheriffs association") ||
    normalizedQuestion.includes("union") ||
    normalizedQuestion.includes("association")
  ) {
    if (normalizedQuestion.includes("benefits") || normalizedQuestion.includes("member")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.dsaInfo.benefits),
        source: "DSA Membership Benefits",
        confidence: 0.95,
      }
    } else if (
      normalizedQuestion.includes("community") ||
      normalizedQuestion.includes("involvement") ||
      normalizedQuestion.includes("outreach")
    ) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.dsaInfo.communityInvolvement),
        source: "DSA Community Involvement",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("leadership") || normalizedQuestion.includes("president")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.dsaInfo.leadership),
        source: "DSA Leadership",
        confidence: 0.95,
      }
    } else if (normalizedQuestion.includes("contact") || normalizedQuestion.includes("website")) {
      response = {
        text: addSgtKenPersonality(knowledgeBase.dsaInfo.contactInfo),
        source: "DSA Contact Information",
        confidence: 0.95,
      }
    } else {
      response = {
        text: addSgtKenPersonality(knowledgeBase.dsaInfo.overview),
        source: "DSA Overview",
        confidence: 0.9,
      }
    }
  }

  // Personal questions about Sgt. Ken
  else if (
    normalizedQuestion.includes("who are you") ||
    normalizedQuestion.includes("your name") ||
    normalizedQuestion.includes("about you") ||
    normalizedQuestion.includes("sgt ken") ||
    normalizedQuestion.includes("sergeant ken")
  ) {
    response = {
      text: "I'm Sergeant Ken, a recruitment officer with the San Francisco Deputy Sheriff's Office. I've been with the department for 15 years and have served in various roles including jail operations, court security, and now recruitment. I'm here to help answer any questions you have about joining our team and becoming a deputy sheriff in San Francisco.",
      confidence: 0.95,
    }
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return response
}

// Function to add Sgt. Ken's personality to responses
function addSgtKenPersonality(text: string): string {
  // List of Sgt. Ken phrases to potentially add to the beginning of responses
  const introductions = [
    "As a San Francisco Deputy Sheriff, I can tell you that ",
    "Based on my 15 years with the department, ",
    "From my experience in the Sheriff's Office, ",
    "I've been with the department for many years, and I can share that ",
    "Let me tell you from firsthand experience, ",
    "Having worked in various roles in our department, I can say that ",
    "", // Empty string for cases where we don't want to add an introduction
  ]

  // List of Sgt. Ken phrases to potentially add to the end of responses
  const conclusions = [
    " I'd be happy to answer any other questions you have about our department.",
    " Feel free to ask me more about this or any other aspect of becoming a deputy.",
    " Is there anything specific about this you'd like to know more about?",
    " I hope that helps give you a better picture of what we offer.",
    " That's one of the many reasons I'm proud to serve with the San Francisco Sheriff's Office.",
    "", // Empty string for cases where we don't want to add a conclusion
  ]

  // Randomly select an introduction and conclusion
  // Using a weighted approach to sometimes not add anything
  const randomIntro = introductions[Math.floor(Math.random() * introductions.length)]
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)]

  // Combine the parts, being careful not to add too much fluff to short responses
  if (text.length < 100) {
    // For short responses, just add a conclusion sometimes
    return text + (Math.random() > 0.5 ? randomConclusion : "")
  } else {
    // For longer responses, potentially add both intro and conclusion
    return (Math.random() > 0.3 ? randomIntro : "") + text + (Math.random() > 0.3 ? randomConclusion : "")
  }
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

