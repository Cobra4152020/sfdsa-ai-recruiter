"use client"

import { Shield, DollarSign, Calendar, GraduationCap, Heart, Users } from "lucide-react"
import { motion } from "framer-motion"

export function BenefitsSection() {
  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Competitive Salary",
      description: "Starting at $89,856 annually with regular step increases and overtime opportunities.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Excellent Benefits",
      description: "Comprehensive medical, dental, and vision coverage for you and your dependents.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Job Security",
      description: "Stable government employment with opportunities for career advancement.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Work-Life Balance",
      description: "4/10 schedule with three consecutive days off and paid vacation time.",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Training & Development",
      description: "Continuous professional development and specialized training opportunities.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Impact",
      description: "Make a meaningful difference in your community every day.",
    },
  ]

  return (
    <div className="bg-[#F8F5EE] dark:bg-[#121212] py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
            Why Join the Sheriff's Office?
          </h2>
          <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-2xl mx-auto">
            Discover the many benefits of becoming a Deputy Sheriff with the San Francisco Sheriff's Office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#E0D6B8] dark:border-[#333333]"
            >
              <div className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">{benefit.title}</h3>
              <p className="text-[#0A3C1F]/70 dark:text-white/70">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

