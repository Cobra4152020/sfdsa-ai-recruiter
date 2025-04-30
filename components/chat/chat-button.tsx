// /components/chat-button.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { motion, AnimatePresence } from "framer-motion"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
    const audio = new Audio("/sounds/open.mp3")
    audio.play().catch(() => {})
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          className="rounded-full h-14 w-14 shadow-lg bg-green-800 hover:bg-green-900"
          size="icon"
          aria-label="Chat with Sergeant Ken"
          onClick={handleOpen}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl w-full max-w-md min-h-[450px] flex flex-col relative overflow-hidden h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute top-2 right-2 bg-transparent border-none cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
                whileTap={{ scale: 0.9 }}
                aria-label="Close dialog"
              >
                <X size={24} />
              </motion.button>
              <motion.div
                className="flex-1 overflow-auto flex"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <ChatInterface animateMessages />
              </motion.div>
            </motion.div>

            <p className="text-xs text-gray-200 mt-2">
              Tap outside to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
