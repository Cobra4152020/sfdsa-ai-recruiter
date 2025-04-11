"use client"

import { useEffect, useRef } from "react"

interface ChatEmbedProps {
  className?: string
  height?: string
}

export function ChatEmbed({ className = "", height = "600px" }: ChatEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        // Handle user interactions or other events from the chat interface
        if (data.action === "userInteraction") {
          console.log("User interaction:", data.question)
          // You can add analytics or other tracking here
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src="/chat-interface.html"
      className={`w-full border-0 ${className}`}
      style={{ height }}
      title="Chat with Sergeant Ken"
    />
  )
}