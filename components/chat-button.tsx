"use client"

import { useEffect, useRef, useState } from "react"
import { useUser } from "@/context/user-context"
import { OptInForm } from "./opt-in-form"

interface ChatButtonProps {
  fullHeight?: boolean
}

export function ChatButton({ fullHeight = false }: ChatButtonProps) {
  const { isLoggedIn, incrementParticipation, isInitialized } = useUser()
  const [showOptInForm, setShowOptInForm] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our own iframe
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return
      }

      try {
        // Check if the message is a string that can be parsed as JSON
        if (typeof event.data === "string") {
          const data = JSON.parse(event.data)

          // Handle user interaction events
          if (data.action === "userInteraction") {
            if (isLoggedIn) {
              incrementParticipation()
            } else {
              // If user is not logged in, show the opt-in form
              // and save the pending question if there is one
              if (data.question) {
                setPendingQuestion(data.question)
              }
              setShowOptInForm(true)
            }
          }
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [isLoggedIn, incrementParticipation])

  // Process pending question after user signs up
  const handleQuestionProcess = (question: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          action: "processPendingQuestion",
          question,
        }),
        "*",
      )
    }
    setPendingQuestion(null)
  }

  // Only render the iframe if the user context is initialized
  if (!isInitialized) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <>
      <iframe
        ref={iframeRef}
        src="/chat-iframe.html"
        className={`w-full ${fullHeight ? "h-full" : "h-[500px]"} border-0`}
        title="Chat with Recruitment Assistant"
      />

      <OptInForm
        isOpen={showOptInForm}
        onClose={() => setShowOptInForm(false)}
        required={true}
        pendingQuestion={pendingQuestion}
        onQuestionProcess={handleQuestionProcess}
      />
    </>
  )
}