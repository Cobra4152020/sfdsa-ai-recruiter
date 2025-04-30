"use client"

import React, { useState, useRef, useEffect, useCallback, memo } from "react"
import { Send, Info, X, ArrowDown } from "lucide-react"
import { useUser } from "@/context/user-context"
import { announceToScreenReader } from "@/lib/accessibility"
import { OptInFormNew } from "@/components/chat/opt-in-form"

interface Message {
  role: "user" | "assistant"
  content: string | React.ReactNode
  source?: string
  id?: string
}

interface MainContentProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  displayedResponse: string
}

const ChatMessage = memo(({ message, isLatest, displayedResponse, renderTextWithLinks }: any) => {
  const isUser = message.role === "user"
  const messageContent =
    isLatest && typeof message.content === "string"
      ? displayedResponse || ""
      : typeof message.content === "string"
        ? message.content
        : message.content

  return (
    <div className={`max-w-3xl mx-auto ${isUser ? "ml-auto" : ""}`} role="listitem">
      <div
        className={`rounded-lg p-3 ${
          isUser
            ? "bg-[#F8F5EE] text-[#0A3C1F] dark:bg-[#F8F5EE] dark:text-[#0A3C1F] ml-12 sm:ml-24 shadow-md"
            : "assistant-message shadow-md"
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none" aria-live={isLatest && !isUser ? "polite" : "off"}>
          {typeof messageContent === "string" ? renderTextWithLinks(messageContent) : messageContent}
        </div>
        {message.role === "assistant" && message.source && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Info className="h-3 w-3 mr-1" aria-hidden="true" />
            <span>Source: {message.source}</span>
          </div>
        )}
      </div>
    </div>
  )
})
ChatMessage.displayName = "ChatMessage"

const LoadingIndicator = memo(() => (
  <div className="max-w-3xl mx-auto" aria-live="polite">
    <div className="assistant-message rounded-lg p-3 shadow-md">
      <div className="flex space-x-2">
        <span className="sr-only">Message is being generated...</span>
        <div
          className="w-2 h-2 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] typing-dot"
          style={{ animationDelay: "0ms" }}
          aria-hidden="true"
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] typing-dot"
          style={{ animationDelay: "150ms" }}
          aria-hidden="true"
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-[#0A3C1F] dark:bg-[#FFD700] typing-dot"
          style={{ animationDelay: "300ms" }}
          aria-hidden="true"
        ></div>
      </div>
    </div>
  </div>
))
LoadingIndicator.displayName = "LoadingIndicator"

const MainContent: React.FC<MainContentProps> = ({ messages, onSendMessage, isLoading, displayedResponse }) => {
  const [input, setInput] = useState("")
  const [optInVisible, setOptInVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn, incrementParticipation } = useUser()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant" && typeof lastMessage.content === "string") {
        if (!isLoading && displayedResponse === lastMessage.content) {
          announceToScreenReader("New message received", "polite")
        }
      }
    }
  }, [messages, isLoading, displayedResponse])

  // Improved scroll to bottom function with guaranteed execution
  const scrollToBottom = useCallback(() => {
    if (!chatContainerRef.current) return

    // Set scrolling state to prevent multiple scroll attempts
    setIsScrolling(true)

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight

        // Set a timeout to reset the scrolling state
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
        }, 100)
      }
    })
  }, [])

  // Handle scroll events to determine if we're near the bottom
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current || isScrolling) return

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    // If we're within 100px of the bottom, consider it "near bottom"
    const isNearBottom = distanceFromBottom < 100
    setShouldAutoScroll(isNearBottom)

    // Show scroll button only when not near bottom
    setShowScrollButton(!isNearBottom)
  }, [isScrolling])

  // Set up scroll event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return

    chatContainer.addEventListener("scroll", handleScroll)
    return () => chatContainer.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Auto-scroll when messages change or when loading state changes
  useEffect(() => {
    // Only auto-scroll if we're already near the bottom or if it's a new user message
    if (shouldAutoScroll || (messages.length > 0 && messages[messages.length - 1].role === "user") || isLoading) {
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(scrollToBottom, 10)
      return () => clearTimeout(timeoutId)
    }
  }, [messages, isLoading, shouldAutoScroll, scrollToBottom])

  // Also scroll when displayedResponse changes (typing effect)
  useEffect(() => {
    if (shouldAutoScroll && displayedResponse) {
      const timeoutId = setTimeout(scrollToBottom, 10)
      return () => clearTimeout(timeoutId)
    }
  }, [displayedResponse, shouldAutoScroll, scrollToBottom])

  // Set up mutation observer to detect DOM changes and scroll if needed
  useEffect(() => {
    if (!chatContainerRef.current) return

    const observer = new MutationObserver(() => {
      if (shouldAutoScroll && !isScrolling) {
        scrollToBottom()
      }
    })

    observer.observe(chatContainerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [shouldAutoScroll, scrollToBottom, isScrolling])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return

      if (!isLoggedIn) {
        setOptInVisible(true)
        return
      }

      try {
        await incrementParticipation()
        const userQuestion = input.trim()
        setInput("")
        setShouldAutoScroll(true) // Force scroll to bottom on user message
        announceToScreenReader("Sending message", "polite")
        onSendMessage(userQuestion)
      } catch (error) {
        console.error("Error submitting message:", error)
        announceToScreenReader("Error sending message. Please try again.", "assertive")
      }
    },
    [input, isLoggedIn, incrementParticipation, onSendMessage],
  )

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter to send message
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (document.activeElement === inputRef.current && input.trim()) {
          handleSubmit(new Event("submit") as any)
        }
      }

      // Escape to close opt-in form
      if (e.key === "Escape" && optInVisible) {
        setOptInVisible(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit, input, optInVisible])

  const renderTextWithLinks = useCallback((text: string): React.ReactNode => {
    const paragraphs = text.split(/\n\n+/)
    return (
      <>
        {paragraphs.map((paragraph, index) => {
          const parts = paragraph.split(/(\[.*?\]\$\$.*?\$\$)/g)
          return (
            <p key={index} className="mb-4 whitespace-pre-line">
              {parts.map((part, i) => {
                const match = part.match(/^\[(.*?)\]\$\$(.*?)\$\$/)
                if (match) {
                  const [_, linkText, url] = match
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A3C1F] dark:text-[#FFD700] underline"
                    >
                      {linkText}
                    </a>
                  )
                } else {
                  return <React.Fragment key={i}>{part}</React.Fragment>
                }
              })}
            </p>
          )
        })}
      </>
    )
  }, [])

  return (
    <div className="flex flex-col h-full" role="region" aria-label="Chat with Sgt. Ken">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth"
        role="list"
        aria-label="Conversation messages"
      >
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

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 bg-[#0A3C1F] dark:bg-[#FFD700] text-white dark:text-[#0A3C1F] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-opacity fade-in z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}

      <div className="p-3 border-t border-[#D1C28F] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] shadow-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sgt. Ken about becoming a Deputy Sheriff..."
              className="flex-1 bg-white dark:bg-[#333333] text-[#0A3C1F] dark:text-white border border-[#D1C28F] dark:border-[#444444] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700]"
              disabled={isLoading}
              aria-disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="sheriff-button flex items-center justify-center w-10 h-10 p-0 rounded-full"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">Press Ctrl+Enter to send</div>
        </form>
      </div>

      {optInVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              onClick={() => setOptInVisible(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
            <OptInFormNew
              onSuccess={(userId) => {
                setOptInVisible(false)
                console.log("Opt-in success", userId)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(MainContent)
