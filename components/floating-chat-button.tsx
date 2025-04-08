"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatButton } from "./chat-button"

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the chat container to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Check if we should show the chat button based on the current path
  useEffect(() => {
    const checkVisibility = () => {
      // Don't show on success page
      const isSuccessPage = window.location.pathname.includes("/success")
      setIsVisible(!isSuccessPage)
    }

    // Check immediately
    checkVisibility()

    // Set up a MutationObserver to detect URL changes
    const observer = new MutationObserver(() => {
      checkVisibility()
    })

    observer.observe(document, { subtree: true, childList: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatContainerRef}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden w-[350px] md:w-[400px] h-[400px] mb-4"
          >
            <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
              <h3 className="font-semibold text-lg">Recruitment Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-0 h-[calc(100%-48px)]">
              <ChatButton fullHeight />
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}