"use client"

import React, { useState, useRef, useEffect, useCallback, memo } from "react"
import { Send, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { useUser } from "@/context/user-context"

interface Message {
  role: "user" | "assistant"
  content: string | React.ReactNode
  source?: string
  id?: string // Add unique ID for better list rendering
}

interface MainContentProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  displayedResponse: string
  showOptInForm?: () => void
}

// Memoized message component for better performance
const ChatMessage = memo(
  ({
    message,
    isLatest,
    displayedResponse,
    renderTextWithLinks,
  }: {
    message: Message
    isLatest: boolean
    displayedResponse?: string
    renderTextWithLinks: (text: string) => React.ReactNode
  }) => {
    const isUser = message.role === "user"

    return (
      <div className={`max-w-3xl mx-auto ${isUser ? "ml-auto" : ""}`}>
        <div
          className={`rounded-lg p-3 ${
            isUser ? "user-message ml-12 sm:ml-24 shadow-md" : "assistant-message shadow-md"
          }`}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {isLatest && typeof message.content === "string"
              ? renderTextWithLinks(displayedResponse || "")
              : typeof message.content === "string"
                ? renderTextWithLinks(message.content)
                : message.content}
          </div>

          {/* Source citation for AI responses */}
          {message.role === "assistant" && message.source && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Info className="h-3 w-3 mr-1" />
              <span>Source: {message.source}</span>
            </div>
          )}
        </div>
      </div>
    )
  },
)

ChatMessage.displayName = "ChatMessage"

// Loading indicator component
const LoadingIndicator = memo(() => (
  <div className="max-w-3xl mx-auto">
    <div className="assistant-message rounded-lg p-3 shadow-md">
      <div className="flex space-x-2">
        <div
          className="w-2 h-2 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] animate-bounce opacity-75"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] animate-bounce opacity-75"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] animate-bounce opacity-75"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  </div>
))

LoadingIndicator.displayName = "LoadingIndicator"

const MainContent: React.FC<MainContentProps> = ({
  messages,
  onSendMessage,
  isLoading,
  displayedResponse,
  showOptInForm,
}) => {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { isLoggedIn, incrementParticipation } = useUser()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // Memoize the scroll function to prevent unnecessary re-renders
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && shouldAutoScroll) {
      const chatContainer = messagesEndRef.current.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  }, [shouldAutoScroll])

  // Detect when user manually scrolls up to disable auto-scroll
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer
      // If user scrolls up more than 100px from bottom, disable auto-scroll
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShouldAutoScroll(isNearBottom)
    }

    chatContainer.addEventListener("scroll", handleScroll)
    return () => chatContainer.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }
  }, [messages.length, isLoading, scrollToBottom])

  // Memoize the submit handler to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return

      // Check if user is logged in
      if (!isLoggedIn && showOptInForm) {
        showOptInForm()
        return
      }

      try {
        // Track participation
        await incrementParticipation()

        // Get user's question
        const userQuestion = input.trim()
        setInput("")

        // Enable auto-scroll when user sends a message
        setShouldAutoScroll(true)

        // Send the message
        onSendMessage(userQuestion)
      } catch (error) {
        console.error("Error submitting message:", error)
        // Handle error (could show a toast notification here)
      }
    },
    [input, isLoggedIn, showOptInForm, incrementParticipation, onSendMessage],
  )

  // Memoize the text rendering function
  const renderTextWithLinks = useCallback((text: string): React.ReactNode => {
    // Split by newlines first to preserve paragraphs
    const paragraphs = text.split(/\n\n+/)

    return (
      <>
        {paragraphs.map((paragraph, paragraphIndex) => {
          // Process links within each paragraph
          const parts = paragraph.split(/(\[.*?\]\$\$.*?\$\$)/g)

          return (
            <p key={paragraphIndex} className="mb-4 whitespace-pre-line">
              {parts.map((part, partIndex) => {
                const match = part.match(/^\[(.*?)\]\$\$(.*?)\$\$/)
                if (match) {
                  const [_, linkText, url] = match
                  return (
                    <a
                      key={partIndex}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A3C1F] dark:text-[#FFD700] underline"
                    >
                      {linkText}
                    </a>
                  )
                } else {
                  return <React.Fragment key={partIndex}>{part}</React.Fragment>
                }
              })}
            </p>
          )
        })}
      </>
    )
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Chat Area - make it more compact and auto-adjust */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Use proper keys for list rendering */}
        {messages.map((message, index) => {
          const isLatestAssistantMessage =
            message.role === "assistant" && index === messages.length - 1 && typeof message.content === "string"

          return (
            <ChatMessage
              key={message.id || `message-${index}`}
              message={message}
              isLatest={isLatestAssistantMessage}
              displayedResponse={displayedResponse}
              renderTextWithLinks={renderTextWithLinks}
            />
          )
        })}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#D1C28F] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] shadow-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sgt. Ken about becoming a Deputy Sheriff..."
              className="flex-1 bg-white dark:bg-[#333333] text-[#0A3C1F] dark:text-white border border-[#D1C28F] dark:border-[#444444] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700]"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="sheriff-button flex items-center justify-center w-10 h-10 p-0 rounded-full"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(MainContent)
