// /components/chat-interface.tsx
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { OptInFormNew } from "./opt-in-form-new"
import { saveChatMessage } from "@/app/actions/chat-actions"
import { queryAI } from "@/lib/ai-services"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Tooltip } from "@/components/ui/tooltip"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  animateMessages?: boolean
}

export function ChatInterface({ animateMessages }: ChatInterfaceProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)

  useEffect(() => {
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, showTyping, isNearBottom])

  useEffect(() => {
    if (userId) {
      inputRef.current?.focus()
    }
  }, [userId])

  const handleScroll = () => {
    if (!scrollAreaRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100
    setIsNearBottom(nearBottom)
  }

  const calculateTypingDelay = (text: string) => {
    const words = text.split(" ").length
    return Math.min(3000, words * 100)
  }

  const handleOptInSuccess = (newUserId: string) => {
    setUserId(newUserId)
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I'm Sergeant Ken, a virtual recruitment assistant for the San Francisco Deputy Sheriff's Office. How can I help you today?",
        timestamp: new Date(),
      },
    ])
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !userId || isLoading) return

    const userMessage = input.trim()
    setInput("")

    const userMessageObj: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessageObj])

    setIsLoading(true)

    try {
      await saveChatMessage(userId, userMessage)

      setShowTyping(true)

      const aiResponse = await queryAI(userMessage)

      const assistantMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse?.text || "I'm sorry, I couldn't process your request at this time.",
        timestamp: new Date(),
      }

      const delay = calculateTypingDelay(assistantMessageObj.content)

      setTimeout(() => {
        setShowTyping(false)
        setMessages((prev) => [...prev, assistantMessageObj])
      }, delay)
    } catch (error) {
      console.error("Error in chat:", error)
      const errorMessageObj: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting to our systems right now. Please try again later or contact our recruitment team directly.",
        timestamp: new Date(),
      }
      setTimeout(() => {
        setShowTyping(false)
        setMessages((prev) => [...prev, errorMessageObj])
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <OptInFormNew onSuccess={handleOptInSuccess} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="bg-green-800 text-white p-3 flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/images/sergeant-ken.png" alt="Sergeant Ken" />
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold">Sergeant Ken</h2>
          <p className="text-xs">SFSO Recruitment Assistant</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gray-50" onScroll={handleScroll} ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={animateMessages ? { opacity: 0, y: 10 } : false}
              animate={animateMessages ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Tooltip content={message.timestamp.toLocaleString()}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-green-800 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-900 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className={`text-xs mt-1 ${message.role === "user" ? "text-green-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </Tooltip>
            </motion.div>
          ))}

          {showTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 text-gray-900 rounded-tl-none">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p>Sergeant Ken is typing...</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2 bg-white">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 bg-white text-gray-900"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="bg-green-800 hover:bg-green-900"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
