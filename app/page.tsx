"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { UserProvider, useUser } from "@/context/user-context"
import { OptInForm } from "@/components/opt-in-form"
import { ImprovedHeader } from "@/components/improved-header"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { ImprovedFooter } from "@/components/improved-footer"
import MainContent from "@/components/MainContent"
import { queryOpenAI } from "@/lib/openai-service"

type MessageType = {
  role: "assistant" | "user"
  content: string | React.ReactNode
  quickReplies?: string[]
  source?: string
}

function RecruitmentApp() {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant",
      content:
        "Hey there! I'm Sergeant Ken, but you can call me Sgt. Ken. I've been with the San Francisco Sheriff's Office for 15 years now, and I've got to tell you - it's been an incredible journey! With unemployment on the rise, there's never been a better time to consider a stable, rewarding career in law enforcement. What would you like to know about becoming a Deputy Sheriff? I'm here to help you take that first step toward an exciting new career!",
      quickReplies: ["Tell me about the salary", "What are the requirements?", "How do I apply?"],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [displayedResponse, setDisplayedResponse] = useState("")
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const { incrementParticipation, isLoggedIn } = useUser()

  // Typing effect for the latest message
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1]
      if (latestMessage.role === "assistant" && typeof latestMessage.content === "string") {
        let index = -1
        setDisplayedResponse("")
        const typingInterval = setInterval(() => {
          if (index < latestMessage.content.length - 1) {
            index++
            setDisplayedResponse(latestMessage.content.substring(0, index + 1))
          } else {
            clearInterval(typingInterval)
          }
        }, 30)
        return () => clearInterval(typingInterval)
      }
    }
  }, [messages])

  const handleUserMessage = async (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])
    setInput("")
    setIsLoading(true)

    // Track participation if message is sent
    await incrementParticipation()

    try {
      // Query OpenAI with the user's message
      const aiResponse = await queryOpenAI(message)

      // Generate quick replies based on the topic
      const quickReplies = getQuickReplies(message.toLowerCase())

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse.text,
          quickReplies: quickReplies,
          source: aiResponse.source,
        },
      ])
    } catch (error) {
      console.error("Error querying OpenAI:", error)

      // Fallback response in case of error
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble accessing that information right now. As a San Francisco Deputy Sheriff, I'd be happy to answer your questions when our system is back up. In the meantime, you can contact our recruitment team directly at (415) 554-7225.",
          quickReplies: ["Tell me about requirements", "What's the application process?", "How's the work schedule?"],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getQuickReplies = (topic: string): string[] => {
    if (topic.includes("salary") || topic.includes("pay") || topic.includes("wage") || topic.includes("benefit")) {
      return ["What about overtime?", "Are there bonuses?", "What benefits are included?"]
    } else if (topic.includes("qualifications") || topic.includes("requirements")) {
      return ["Do I need a degree?", "What about physical requirements?", "Any age restrictions?"]
    } else if (topic.includes("process") || topic.includes("apply") || topic.includes("application")) {
      return ["How long does it take?", "What's the academy like?", "Is there a background check?"]
    } else if (topic.includes("career") || topic.includes("growth") || topic.includes("advancement")) {
      return ["How fast can I get promoted?", "What specialized units exist?", "Tell me about training opportunities"]
    } else {
      return ["Tell me about qualifications", "What's the application process?", "How's the work schedule?"]
    }
  }

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  const startChat = () => {
    setShowChat(true)
    // Use a more controlled scroll with a slight delay to ensure the chat is rendered
    setTimeout(() => {
      const chatSection = document.getElementById("chat-section")
      if (chatSection) {
        const headerOffset = 80 // Approximate header height
        const elementPosition = chatSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }, 300)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader showOptInForm={() => showOptInForm(true)} />

      <main className="flex-1">
        <HeroSection onGetStarted={startChat} showOptInForm={() => showOptInForm(true)} />

        <section id="benefits">
          <BenefitsSection />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="faq">
          <FAQSection />
        </section>

        {showChat && (
          <section id="chat-section" className="bg-[#F8F5EE] dark:bg-[#121212] py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                  Chat with Sgt. Ken
                </h2>
                <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-2xl mx-auto">
                  Ask questions about the application process, requirements, benefits, or anything else you'd like to
                  know about becoming a San Francisco Deputy Sheriff.
                </p>
              </div>

              <div className="max-w-4xl mx-auto bg-white dark:bg-[#1E1E1E] rounded-xl shadow-xl overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                <div className="h-[400px] flex flex-col">
                  <MainContent
                    messages={messages}
                    onSendMessage={handleUserMessage}
                    isLoading={isLoading}
                    displayedResponse={displayedResponse}
                    showOptInForm={() => showOptInForm(false)}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        <CTASection showOptInForm={() => showOptInForm(true)} />
      </main>

      <ImprovedFooter />

      {/* Opt-in form dialog */}
      <OptInForm
        isOpen={isOptInFormOpen}
        onClose={() => {
          setIsOptInFormOpen(false)
          setIsApplying(false)
        }}
        isApplying={isApplying}
      />
    </div>
  )
}

// Main export - IMPORTANT: Wrap with UserProvider
export default function Home() {
  return (
    <UserProvider>
      <RecruitmentApp />
    </UserProvider>
  )
}