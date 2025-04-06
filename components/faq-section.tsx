"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
  const faqs = [
    {
      question: "What are the basic requirements to become a Deputy Sheriff?",
      answer:
        "Basic requirements include: U.S. citizenship or permanent resident alien who is eligible for and has applied for citizenship, age 21+ by appointment time, high school diploma or GED (college preferred), valid driver's license, no felony convictions, and good moral character.",
    },
    {
      question: "What is the application process like?",
      answer:
        "The application process includes: 1) Online application, 2) Written exam, 3) Physical ability test, 4) Oral interview, 5) Background investigation, 6) Medical examination, 7) Psychological evaluation, and 8) Final review. The entire process typically takes 4-6 months.",
    },
    {
      question: "What kind of training will I receive?",
      answer:
        "You'll attend a comprehensive academy training program covering law enforcement techniques, firearms training, defensive tactics, legal studies, emergency response, and more. After graduation, you'll receive additional on-the-job training with experienced deputies.",
    },
    {
      question: "What is the work schedule like?",
      answer:
        "Deputies typically work a 4/10 schedule (four 10-hour days per week) with three consecutive days off. Various shifts are available including days, swings, and nights. New deputies should expect to work some weekends and holidays.",
    },
    {
      question: "What career advancement opportunities are available?",
      answer:
        "The Sheriff's Office offers numerous advancement opportunities including specialized units (K-9, SWAT, Investigations), supervisory roles (Sergeant, Lieutenant), and administrative positions. We also provide tuition reimbursement for continuing education.",
    },
    {
      question: "How can I prepare for the physical ability test?",
      answer:
        "The physical test includes push-ups, sit-ups, a 1.5-mile run, and an obstacle course. We recommend establishing a regular workout routine focusing on cardio, strength, and flexibility. We also offer preparation workshops—check our website for dates.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-[#F8F5EE] dark:bg-[#121212] py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-2xl mx-auto">
            Get answers to common questions about becoming a Deputy Sheriff.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-5 rounded-xl flex justify-between items-center transition-colors ${
                  openIndex === index
                    ? "bg-[#0A3C1F] text-white dark:bg-[#FFD700] dark:text-black"
                    : "bg-white dark:bg-[#1E1E1E] text-[#0A3C1F] dark:text-white hover:bg-[#0A3C1F]/10 dark:hover:bg-[#FFD700]/10"
                }`}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>

              {openIndex === index && (
                <div className="bg-white/50 dark:bg-[#1E1E1E]/50 p-5 rounded-b-xl border-t-0 border border-[#E0D6B8] dark:border-[#333333] mt-1">
                  <p className="text-[#0A3C1F]/80 dark:text-white/80">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

