"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { useUser } from "@/context/user-context"

interface Message {
  role: "user" | "assistant"
  content: string | React.ReactNode
  source?: string
}

interface MainContentProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  displayedResponse: string
  showOptInForm?: () => void
}

const MainContent: React.FC<MainContentProps> = ({
  messages,
  onSendMessage,
  isLoading,
  displayedResponse,
  showOptInForm,
}) => {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const { isLoggedIn, incrementParticipation } = useUser()

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    // Only auto-scroll when a new message is added or when loading state changes
    if (messages.length > 0 || isLoading) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [messages.length, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Check if user is logged in
    if (!isLoggedIn && showOptInForm) {
      showOptInForm()
      return
    }

    // Track participation
    await incrementParticipation()

    // Get user's question
    const userQuestion = input.trim()
    setInput("")

    // Add user message to the chat
    const userMessage: Message = { role: "user", content: userQuestion }
    const updatedMessages = [...messages, userMessage]

    // Show loading state
    onSendMessage(userQuestion)
  }

  const renderTextWithLinks = (text: string): React.ReactNode => {
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
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => {
          const isLatestAssistantMessage =
            message.role === "assistant" && index === messages.length - 1 && typeof message.content === "string"

          return (
            <div key={index} className={`max-w-3xl mx-auto ${message.role === "user" ? "ml-auto" : ""}`}>
              <div
                className={`rounded-lg p-4 ${
                  message.role === "user" ? "user-message ml-12 sm:ml-24 shadow-md" : "assistant-message shadow-md"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {isLatestAssistantMessage
                    ? renderTextWithLinks(displayedResponse)
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
        })}

        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <div className="assistant-message rounded-lg p-4 shadow-md">
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
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#D1C28F] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] shadow-md">
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

export default MainContent

