"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMessageVisible, setIsMessageVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Show the button after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Show the message bubble after a delay
  useEffect(() => {
    if (isVisible && !hasInteracted) {
      const timer = setTimeout(() => {
        setIsMessageVisible(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, hasInteracted])

  const handleChatClick = () => {
    setHasInteracted(true)
    setIsMessageVisible(false)

    // Navigate to chat section
    const chatSection = document.getElementById("chat-section")
    if (chatSection) {
      const headerOffset = 80 // Approximate header height
      const elementPosition = chatSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    } else {
      // If on another page, navigate to home page with chat section
      window.location.href = "/#chat-section"
    }
  }

  const dismissMessage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMessageVisible(false)
    setHasInteracted(true)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <AnimatePresence>
            {isMessageVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                className="absolute bottom-16 right-0 bg-white dark:bg-[#1E1E1E] p-3 rounded-lg shadow-lg border border-[#E0D6B8] dark:border-[#333333] w-64"
              >
                <button
                  onClick={dismissMessage}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-sm font-medium text-[#0A3C1F] dark:text-white mb-1">
                  Have questions about becoming a Deputy Sheriff?
                </p>
                <p className="text-xs text-[#0A3C1F]/70 dark:text-white/70 mb-2">
                  Chat with Sgt. Ken to learn more and earn points!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleChatClick}
            className="h-14 w-14 rounded-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white shadow-lg flex items-center justify-center"
            aria-label="Chat with Sgt. Ken"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

