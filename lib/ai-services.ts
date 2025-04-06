import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { knowledgeBase } from './knowledge-base';

// Function to check if question is within scope
function isWithinScope(question: string): boolean {
  // Reuse the existing scope check logic from klarna-ai.ts
  // ...
  return true;
}

export async function queryAI(question: string) {
  try {
    // Check if the question is within scope
    if (!isWithinScope(question)) {
      return {
        text: "As a San Francisco Deputy Sheriff, I'm focused on providing information about our Sheriff's Office and recruitment process. I'd be happy to answer any questions about our qualifications, application process, benefits, or other related topics.",
        confidence: 0.9,
      };
    }

    // Find relevant context from knowledge base
    const relevantContext = findRelevantContext(question);

    // Generate response using OpenAI
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: `You are Sergeant Ken, a recruitment officer with the San Francisco Deputy Sheriff's Office with 15 years of experience. 
      Answer the following question based on this context: ${relevantContext}
      
      Question: ${question}
      
      Keep your answer conversational, helpful, and focused on recruitment information.`,
    });

    return {
      text,
      source: "AI-Generated Response",
      confidence: 0.95,
    };
  } catch (error) {
    console.error("Error querying AI:", error);
    return {
      text: "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
      confidence: 0.5,
    };
  }
}

// Helper function to find relevant context from knowledge base
function findRelevantContext(question: string): string {
  const normalizedQuestion = question.toLowerCase();
  let relevantSections = [];

  // Check for keywords and add relevant sections
  if (normalizedQuestion.includes("salary") || normalizedQuestion.includes("pay")) {
    relevantSections.push(knowledgeBase.salaryBenefits.salary);
  }
  if (normalizedQuestion.includes("benefits")) {
    relevantSections.push(knowledgeBase.salaryBenefits.healthBenefits);
  }
  if (normalizedQuestion.includes("requirements") || normalizedQuestion.includes("qualifications")) {
    relevantSections.push(knowledgeBase.deputyRequirements.basicRequirements);
  }
  // Add more keyword checks as needed

  // If no specific sections matched, provide general information
  if (relevantSections.length === 0) {
    relevantSections.push(knowledgeBase.sfsoInfo.overview);
    relevantSections.push(knowledgeBase.applicationProcess.overview);
  }

  return relevantSections.join("\n\n");
}