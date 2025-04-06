"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { ConfettiButton } from "@/components/confetti-button"
import { ImageCarousel } from "@/components/image-carousel"
import { TopRecruitsTicker } from "@/components/top-recruits-ticker"

interface HeroSectionProps {
  onGetStarted: () => void
  showOptInForm: () => void
}

export function HeroSection({ onGetStarted, showOptInForm }: HeroSectionProps) {
  const { isLoggedIn } = useUser()
  const [isHovered, setIsHovered] = useState(false)

  // Using the provided images
  const carouselImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slide1.jpg-PIhTh7TCQqPTjxRGOkG4uJJFfQBjqS.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slide2.jpg-Kgl2HQpbRqstkmKbDhUCYbrknjcRPF.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slide3.jpg-Ez7qorVh8BPILlE9CgDLAv5Ag5i9kc.jpeg",
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3C1F]/90 to-[#0A3C1F]/70 dark:from-black/90 dark:to-black/70 z-10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center">
        {/* Slideshow with buttons directly underneath */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-3xl"
        >
          <div className="flex flex-col items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-xl mb-4">
            {/* Top Recruits Ticker */}
            <TopRecruitsTicker showOptInForm={showOptInForm} />

            <div className="w-full sm:w-[90%] md:w-[95%] mx-auto">
              <ImageCarousel images={carouselImages} height={200} className="shadow-lg" />
            </div>
          </div>

          {/* Buttons moved up - directly under slideshow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4"
          >
            <ConfettiButton
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold px-8 py-3 rounded-xl text-lg shadow-lg transform transition-transform hover:scale-105 min-w-[200px]"
              showOptInForm={showOptInForm}
            >
              Apply Now
            </ConfettiButton>

            <Button
              onClick={onGetStarted}
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 px-8 py-3 rounded-xl text-lg min-w-[200px]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span>Chat with Sgt. Ken</span>
              <ArrowRight
                className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Heading and paragraph text now come after the buttons */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl"
        >
          Serve With Honor. <span className="text-[#FFD700]">Protect With Pride.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mb-10"
        >
          Join our team of dedicated professionals making a difference in the San Francisco community. Discover a
          rewarding career with competitive pay, excellent benefits, and opportunities for advancement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-white/80"
        >
          <Star className="h-5 w-5 text-[#FFD700]" />
          <span>Unemployment is rising - secure your future with a stable government career</span>
        </motion.div>
      </div>
    </div>
  )
}

