"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { OptInForm } from "./opt-in-form"
import { saveChatMessage } from "@/app/actions/chat-actions"
import { queryAI } from "@/lib/ai-services"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when userId is set
  useEffect(() => {
    if (userId) {
      inputRef.current?.focus()
    }
  }, [userId])

  const handleOptInSuccess = (newUserId: string) => {
    setUserId(newUserId)
    // Add welcome message
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

    // Add user message to chat
    const userMessageObj: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessageObj])

    // Show loading state
    setIsLoading(true)

    try {
      // Save message to database
      await saveChatMessage(userId, userMessage)

      // Get AI response
      const aiResponse = await queryAI(userMessage)

      // Add AI response to chat
      const assistantMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse?.text || "I'm sorry, I couldn't process your request at this time.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessageObj])
    } catch (error) {
      console.error("Error in chat:", error)
      // Add error message
      const errorMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting to our systems right now. Please try again later or contact our recruitment team directly.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessageObj])
    } finally {
      setIsLoading(false)
    }
  }

  if (!userId) {
    return <OptInForm onSuccess={handleOptInSuccess} />
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-lg overflow-hidden bg-white shadow-md">
      <div className="bg-blue-800 text-white p-3 flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/images/sergeant-ken.png" alt="Sergeant Ken" />
          <AvatarFallback>SK</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold">Sergeant Ken</h2>
          <p className="text-xs">SFSO Recruitment Assistant</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-900 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
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
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
