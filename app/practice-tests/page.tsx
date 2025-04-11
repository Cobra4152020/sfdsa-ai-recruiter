"use client"

import { useState, useEffect } from "react"
import { UserProvider, useUser } from "@/context/user-context"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { FileText, MessageSquare, Brain, Activity, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import MainContent from "@/components/MainContent"
// Import the AI service
import * as aiService from "@/lib/ai-services"

function PracticeTestsContent() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("written")
  const [messages, setMessages] = useState<any[]>([])
  const [displayedResponse, setDisplayedResponse] = useState("")
  const { isLoggedIn, incrementParticipation } = useUser()

  // Initial message based on active tab
  useEffect(() => {
    if (isLoggedIn) {
      const initialMessages = {
        written: [
          {
            role: "assistant",
            content:
              "Welcome to the Written Test practice area! I can generate practice questions similar to those on the Deputy Sheriff written exam. Would you like to start a 12-question practice test, or focus on a specific area like reading comprehension, writing skills, or problem-solving?",
          },
        ],
        oral: [
          {
            role: "assistant",
            content:
              "Welcome to the Oral Board practice area! I can simulate oral board interview questions and provide feedback on your responses. Would you like to practice with a random question, or focus on a specific area like situational judgment, background, or motivation for becoming a deputy?",
          },
        ],
        physical: [
          {
            role: "assistant",
            content:
              "Welcome to the Physical Agility Test preparation area! I can provide advice on preparing for the physical test components including push-ups, sit-ups, 1.5-mile run, and the obstacle course. What specific area would you like guidance on?",
          },
        ],
        polygraph: [
          {
            role: "assistant",
            content:
              "Welcome to the Polygraph Test preparation area! I can explain what to expect during the polygraph examination and provide advice on how to approach it. What would you like to know about the polygraph process?",
          },
        ],
        psychological: [
          {
            role: "assistant",
            content:
              "Welcome to the Psychological Evaluation preparation area! I can explain the psychological testing process and provide tips on approaching this important step. What specific aspect of the psychological evaluation would you like to learn about?",
          },
        ],
      }

      setMessages(initialMessages[activeTab as keyof typeof initialMessages])
      setDisplayedResponse(initialMessages[activeTab as keyof typeof initialMessages][0].content)
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "Please sign in to access the practice test materials. This helps us track your progress and award badges for your achievements.",
        },
      ])
      setDisplayedResponse(
        "Please sign in to access the practice test materials. This helps us track your progress and award badges for your achievements.",
      )
    }
    setIsLoading(false)
  }, [activeTab, isLoggedIn])

  const handleUserMessage = async (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }])
    setIsLoading(true)

    // Track participation if message is sent
    if (isLoggedIn) {
      await incrementParticipation()
    }

    try {
      // If not logged in, prompt to sign up
      if (!isLoggedIn) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Please sign in to access the practice test materials. This helps us track your progress and award badges for your achievements.",
          },
        ])
        setIsLoading(false)
        setDisplayedResponse(
          "Please sign in to access the practice test materials. This helps us track your progress and award badges for your achievements.",
        )
        return
      }

      // Enhance the user's message with context about the current test type
      let enhancedMessage = message
      switch (activeTab) {
        case "written":
          enhancedMessage = `I'm preparing for the Deputy Sheriff written exam. ${message}`
          break
        case "oral":
          enhancedMessage = `I'm preparing for the Deputy Sheriff oral board interview. ${message}`
          break
        case "physical":
          enhancedMessage = `I'm preparing for the Deputy Sheriff physical agility test. ${message}`
          break
        case "polygraph":
          enhancedMessage = `I'm preparing for the Deputy Sheriff polygraph examination. ${message}`
          break
        case "psychological":
          enhancedMessage = `I'm preparing for the Deputy Sheriff psychological evaluation. ${message}`
          break
      }

      // Query AI with the enhanced message
      const aiResponse = await aiService.queryAI(enhancedMessage)

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse.text,
          source: aiResponse.source,
        },
      ])

      // Reset displayed response for typing effect
      setDisplayedResponse("")

      // Simulate typing effect
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < aiResponse.text.length) {
          setDisplayedResponse((prev) => prev + aiResponse.text[index])
          index++
        } else {
          clearInterval(typingInterval)
        }
      }, 10)
    } catch (error) {
      console.error("Error querying AI:", error)

      // Fallback response in case of error
      const fallbackResponse =
        "I apologize, but I'm having trouble accessing that information right now. Please try again in a few moments."

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackResponse,
        },
      ])
      setDisplayedResponse(fallbackResponse)
    } finally {
      setIsLoading(false)
    }
  }

  const showOptInForm = () => {
    setIsOptInFormOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader showOptInForm={showOptInForm} />

      <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/" prefetch={false}>
              <Button variant="ghost" className="text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
              Practice Tests & Preparation
            </h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl">
              Prepare for each stage of the Deputy Sheriff selection process with our interactive practice materials.
              Sign in to track your progress and earn badges for completing practice tests.
            </p>
          </div>

          <Tabs defaultValue="written" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-8 justify-center">
              <TabsTrigger value="written" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Written Test</span>
              </TabsTrigger>
              <TabsTrigger value="oral" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Oral Board</span>
              </TabsTrigger>
              <TabsTrigger value="physical" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Physical Test</span>
              </TabsTrigger>
              <TabsTrigger value="polygraph" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Polygraph</span>
              </TabsTrigger>
              <TabsTrigger value="psychological" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Psychological</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                  <div className="h-[600px] flex flex-col">
                    <MainContent
                      messages={messages}
                      onSendMessage={handleUserMessage}
                      isLoading={isLoading}
                      displayedResponse={displayedResponse}
                      showOptInForm={showOptInForm}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Information</CardTitle>
                    <CardDescription>What to expect for this test</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeTab === "written" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed">The written test evaluates your basic skills in:</p>
                        <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed">
                          <li>Reading comprehension</li>
                          <li>Writing and grammar</li>
                          <li>Problem-solving</li>
                          <li>Basic math</li>
                          <li>Situational judgment</li>
                        </ul>
                        <p className="text-sm leading-relaxed">
                          The actual test consists of multiple-choice questions and must be completed within a specified
                          time limit.
                        </p>
                      </div>
                    )}

                    {activeTab === "oral" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed">The oral board interview typically includes:</p>
                        <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed">
                          <li>Background questions</li>
                          <li>Situational judgment scenarios</li>
                          <li>Questions about your motivation</li>
                          <li>Behavioral questions about past experiences</li>
                          <li>Questions about your understanding of the role</li>
                        </ul>
                        <p className="text-sm leading-relaxed">
                          You'll be evaluated on communication skills, judgment, and suitability for the position.
                        </p>
                      </div>
                    )}

                    {activeTab === "physical" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed">The physical agility test includes:</p>
                        <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed">
                          <li>Push-ups (maximum in 1 minute)</li>
                          <li>Sit-ups (maximum in 1 minute)</li>
                          <li>1.5-mile run (timed)</li>
                          <li>Obstacle course</li>
                        </ul>
                        <p className="text-sm leading-relaxed">
                          Each component has minimum requirements that must be met to pass the test.
                        </p>
                      </div>
                    )}

                    {activeTab === "polygraph" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed">The polygraph examination:</p>
                        <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed">
                          <li>Verifies information from your application</li>
                          <li>Measures physiological responses to questions</li>
                          <li>Typically takes 2-3 hours</li>
                          <li>Includes a pre-test interview</li>
                        </ul>
                        <p className="text-sm leading-relaxed">
                          Honesty throughout the application process is essential for passing the polygraph.
                        </p>
                      </div>
                    )}

                    {activeTab === "psychological" && (
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed">The psychological evaluation includes:</p>
                        <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed">
                          <li>Written psychological assessments</li>
                          <li>Clinical interview with a psychologist</li>
                          <li>Evaluation of emotional stability</li>
                          <li>Assessment of decision-making abilities</li>
                          <li>Evaluation of interpersonal skills</li>
                        </ul>
                        <p className="text-sm leading-relaxed">
                          The goal is to ensure candidates are psychologically suited for the demands of law
                          enforcement.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Earn Badges</CardTitle>
                    <CardDescription>Complete practice tests to earn badges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                        >
                          Written Test Prep
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        >
                          Oral Board Prep
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                        >
                          Physical Test Prep
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                        >
                          Full Process Prep
                        </Badge>
                      </div>
                      <p className="text-sm text-[#0A3C1F]/70 dark:text-white/70">
                        Complete practice tests in each area to earn badges that you can share on social media. Track
                        your progress and improve your chances of success!
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {!isLoggedIn && (
                      <Button onClick={showOptInForm} className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                        Sign In to Track Progress
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </main>

      <ImprovedFooter />

      <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} />
    </div>
  )
}

// This is the default export that Next.js requires for pages
export default function PracticeTestsPage() {
  return (
    <UserProvider>
      <PracticeTestsContent />
    </UserProvider>
  )
}