type KnowledgeEntry = {
  keywords: string[]
  response: string
}

export function getKnowledgeBase(): KnowledgeEntry[] {
  return [
    {
      keywords: ["salary", "pay", "money", "compensation", "wage", "earn"],
      response: `As a San Francisco Deputy Sheriff, you'll start with a competitive salary ranging from $89,000 to $108,000 annually, depending on your education and experience. With regular step increases, overtime opportunities, and premium pay for specialized assignments, many deputies earn well over $100,000 per year. In today's uncertain job market, this stable income with guaranteed increases provides financial security that's hard to find elsewhere.`,
    },
    {
      keywords: ["benefits", "healthcare", "insurance", "medical", "dental", "vision"],
      response: `The San Francisco Sheriff's Office offers a comprehensive benefits package including excellent health, dental, and vision coverage for you and your family. You'll also receive paid vacation, sick leave, and holidays, along with tuition reimbursement for continuing education. Our benefits package is designed to support your wellbeing both on and off duty, providing security that's especially valuable in today's economic climate.`,
    },
    {
      keywords: ["requirements", "qualifications", "eligible", "qualify"],
      response: `To become a San Francisco Deputy Sheriff, you need to be at least 21 years old, have U.S. citizenship or permanent residency with application for citizenship, possess a high school diploma or GED, and have a valid California driver's license. You must have no felony convictions and be able to pass a background check, medical and psychological evaluations, and physical abilities test. We don't require prior law enforcement experience or a college degree, making this an accessible career path for many people facing job uncertainty in other industries.`,
    },
    {
      keywords: ["apply", "application", "process", "how to become", "join", "hiring"],
      response: `The application process to become a San Francisco Deputy Sheriff involves submitting an online application, passing a written exam and physical abilities test, completing an oral interview, undergoing a background investigation, and passing medical and psychological evaluations. Once selected, you'll attend our 16-week Sheriff's Academy. The entire process typically takes 4-6 months from application to academy. With unemployment rising, now is an excellent time to apply as we're actively recruiting to fill positions.`,
    },
    {
      keywords: ["academy", "training", "learn"],
      response: `The San Francisco Sheriff's Academy is a 16-week intensive training program that prepares you for a successful career in law enforcement. You'll learn law enforcement techniques, defensive tactics, firearms training, emergency response, legal procedures, and community relations. The academy is challenging but rewarding, and you'll be paid your full salary while attending. Our training staff is dedicated to helping every recruit succeed, providing the support and guidance needed to meet the high standards of the Sheriff's Office.`,
    },
    {
      keywords: ["career", "advancement", "promotion", "growth", "future"],
      response: `The San Francisco Sheriff's Office offers excellent career advancement opportunities. After gaining experience as a deputy, you can pursue specialized assignments in areas like court security, custody, law enforcement, or administration. Promotional opportunities include Senior Deputy, Sergeant, Lieutenant, Captain, and beyond. We also offer specialized training and tuition reimbursement to support your professional development. Many of our leadership team members started as deputies and advanced through the ranks, demonstrating our commitment to promoting from within.`,
    },
    {
      keywords: ["schedule", "hours", "shifts", "work-life", "balance"],
      response: `Deputy Sheriffs typically work a 4/10 schedule (four 10-hour days per week), providing a good balance between work and personal life. Shift assignments are based on seniority, with newer deputies often working evening or night shifts initially. As you gain seniority, you'll have more control over your schedule. The predictable scheduling and generous paid time off allow deputies to plan their personal lives effectively while maintaining their professional responsibilities.`,
    },
    {
      keywords: ["retirement", "pension", "retire"],
      response: `The San Francisco Sheriff's Office offers an excellent retirement package through the San Francisco Employees' Retirement System (SFERS). As a deputy sheriff, you'll earn a pension calculated at 3% per year of service at age 55. For example, after 25 years of service, you could retire with 75% of your final compensation guaranteed for life. This defined benefit plan provides exceptional financial security for your future, especially important in today's uncertain economic climate.`,
    },
  ]
}