"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Joining the Sheriff's Office was the best career decision I've made. The training was excellent, and I've found a real sense of purpose in serving my community.",
      name: "Michael R.",
      role: "Deputy Sheriff, 5 years of service",
      image: "/placeholder-user.jpg",
    },
    {
      quote:
        "I was looking for stability and growth opportunities. The Sheriff's Office provided both, plus a supportive team environment that feels like family.",
      name: "Sarah L.",
      role: "Deputy Sheriff, 3 years of service",
      image: "/placeholder-user.jpg",
    },
    {
      quote:
        "The benefits are outstanding, but what keeps me here is the impact we make every day. There's nothing more rewarding than knowing your work matters.",
      name: "James T.",
      role: "Deputy Sheriff, 7 years of service",
      image: "/placeholder-user.jpg",
    },
  ]

  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="bg-[#0A3C1F] dark:bg-black py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Hear From Our <span className="text-[#FFD700]">Deputies</span>
            </h2>
            <p className="text-lg text-white/70">Real stories from the people who serve and protect San Francisco.</p>
          </div>

          <div className="relative bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-white/10">
            <div className="absolute top-8 left-8 text-[#FFD700] opacity-30">
              <Quote className="h-16 w-16" />
            </div>

            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-white mb-8 italic">"{testimonials[current].quote}"</p>

              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={testimonials[current].image || "/placeholder.svg"}
                    alt={testimonials[current].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD700]"
                  />
                </div>
                <div>
                  <h4 className="text-[#FFD700] font-bold text-lg">{testimonials[current].name}</h4>
                  <p className="text-white/70">{testimonials[current].role}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 flex space-x-2">
              <button
                onClick={prev}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

