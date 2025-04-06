// Knowledge base index file that exports all content
import { sfsoInfo } from "./sfso-info"
import { deputyRequirements } from "./deputy-requirements"
import { salaryBenefits } from "./salary-benefits"
import { applicationProcess } from "./application-process"
import { dsaInfo } from "./dsa-info"

export const knowledgeBase = {
  sfsoInfo,
  deputyRequirements,
  salaryBenefits,
  applicationProcess,
  dsaInfo,
}

// Define the scope restrictions for the AI
export const aiScopeRestrictions = {
  geographic: ["San Francisco", "City and County of San Francisco"],
  organizations: ["San Francisco Sheriff's Office", "Deputy Sheriffs' Association"],
  topics: ["law enforcement", "deputy sheriff", "recruitment", "employment", "public safety"],
}

