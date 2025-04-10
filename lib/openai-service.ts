// Simple mock implementation of the OpenAI service
// This will be replaced with actual OpenAI integration when API keys are available

import { getKnowledgeBase } from "./knowledgeBase"
import { getPDFContent, pdfExists } from "./pdf-service"

type OpenAIResponse = {
  text: string
  source?: string
}

export async function queryOpenAI(query: string): Promise<OpenAIResponse> {
  // Convert query to lowercase for easier matching
  const queryLower = query.toLowerCase()

  // Check if this is a greeting or small talk
  if (isGreeting(queryLower)) {
    return handleGreeting()
  }

  // Check for retirement-related queries
  if (isRetirementQuery(queryLower)) {
    return handleRetirementQuery()
  }

  // Check for salary-related queries
  if (isSalaryQuery(queryLower)) {
    return handleSalaryQuery()
  }

  // Check for requirements-related queries
  if (isRequirementsQuery(queryLower)) {
    return handleRequirementsQuery()
  }

  // Check for application process queries
  if (isApplicationQuery(queryLower)) {
    return handleApplicationQuery()
  }

  // Default to general knowledge base
  return {
    text: getGeneralResponse(query),
    source: "Knowledge Base",
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
  ]
  return retirementKeywords.some((keyword) => query.includes(keyword))
}

async function handleRetirementQuery(): Promise<OpenAIResponse> {
  try {
    // Try to get retirement information from PDF
    if (await pdfExists("sfers-guide.pdf")) {
      const pdfContent = await getPDFContent("sfers-guide.pdf")
      return {
        text: pdfContent,
        source: "SFERS Guide PDF",
      }
    }
  } catch (error) {
    console.error("Error accessing retirement PDF:", error)
  }

  // Fallback to knowledge base
  return {
    text: `The San Francisco Sheriff's Office offers an excellent retirement package through the San Francisco Employees' Retirement System (SFERS). As a deputy sheriff, you'll be enrolled in a defined benefit plan that provides:

- A retirement formula of 3% per year of service at age 55
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