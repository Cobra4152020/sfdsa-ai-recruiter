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

    // Simulate AI response based on the active tab and user message
    setTimeout(() => {
      let response = ""

      if (!isLoggedIn) {
        response =
          "Please sign in to access the practice test materials. This helps us track your progress and award badges for your achievements."
      } else {
        // Generate different responses based on the active tab
        switch (activeTab) {
          case "written":
            if (
              message.toLowerCase().includes("start") ||
              message.toLowerCase().includes("practice test") ||
              message.toLowerCase().includes("12")
            ) {
              response =
                "Great! Here's a 12-question practice test for the Deputy Sheriff written exam:\n\n1. Which of the following is NOT a responsibility of a Deputy Sheriff?\nA) Maintaining security in county jails\nB) Providing court security\nC) Issuing driver's licenses\nD) Serving civil processes\n\n2. A suspect has the right to:\nA) Make unlimited phone calls\nB) Remain silent\nC) Have charges dismissed if not read their rights\nD) Speak to any attorney of their choosing at government expense\n\nPlease answer these first two questions, and I'll provide the next set along with feedback on your answers."
            } else if (message.toLowerCase().includes("reading") || message.toLowerCase().includes("comprehension")) {
              response =
                "Here's a reading comprehension practice question:\n\nRead the following paragraph and answer the question below:\n\n'Deputy Ramirez was assigned to transport three inmates from the county jail to the courthouse. Upon arrival, she secured the inmates in the holding cell and completed the transfer paperwork. While conducting a security check, she noticed that one inmate appeared to be in medical distress. Following protocol, she immediately called for medical assistance while maintaining security of all inmates.'\n\nQuestion: What did Deputy Ramirez do after noticing an inmate in medical distress?\nA) Released the inmate from the holding cell\nB) Completed transfer paperwork\nC) Called for medical assistance\nD) Returned the inmate to the county jail"
            } else {
              response =
                "I can help with written test preparation. Would you like to:\n\n1. Start a 12-question practice test\n2. Practice reading comprehension questions\n3. Practice writing skills questions\n4. Practice problem-solving questions\n\nJust let me know which option you prefer, or ask about a specific topic you'd like to focus on."
            }
            break

          case "oral":
            if (message.toLowerCase().includes("random") || message.toLowerCase().includes("question")) {
              response =
                "Here's an oral board practice question:\n\n\"Describe a time when you had to deal with a difficult person. How did you handle the situation, and what was the outcome?\"\n\nPlease provide your response as you would in an actual interview. After your answer, I'll provide feedback on your response structure, content, and delivery tips."
            } else if (message.toLowerCase().includes("situational") || message.toLowerCase().includes("judgment")) {
              response =
                "Here's a situational judgment question:\n\n\"You're working in the jail and observe a fellow deputy using excessive force on an inmate who was verbally abusive but not physically resistant. What would you do in this situation?\"\n\nPlease provide your response as you would in an actual interview. After your answer, I'll provide feedback on your approach."
            } else {
              response =
                "I can help you practice for the oral board interview. Would you like to:\n\n1. Practice with a random question\n2. Focus on situational judgment questions\n3. Practice questions about your background and experience\n4. Practice questions about your motivation to become a deputy\n\nJust let me know which option you prefer, or ask about a specific topic you'd like to focus on."
            }
            break

          case "physical":
            if (message.toLowerCase().includes("push") || message.toLowerCase().includes("push-up")) {
              response =
                "For the push-up component of the physical agility test, you'll need to perform as many proper form push-ups as possible in one minute. Here are some tips to improve your push-up performance:\n\n1. Practice proper form: Keep your body in a straight line from head to heels, hands shoulder-width apart\n2. Build endurance: Start with 3 sets of push-ups to failure, 3 times per week\n3. Incorporate variations: Wide push-ups, diamond push-ups, and incline/decline push-ups\n4. Progressive overload: Gradually increase repetitions each week\n5. Rest properly: Allow 48 hours between intense push-up workouts\n\nA good goal is to be able to perform at least 25-30 proper form push-ups in one minute. Would you like a specific training plan to improve your push-up count?"
            } else if (message.toLowerCase().includes("run") || message.toLowerCase().includes("mile")) {
              response =
                "For the 1.5-mile run component, you'll need to complete the distance in under 14 minutes (though faster is better). Here are some training tips:\n\n1. Follow a progressive training plan: Start with a combination of running and walking if needed\n2. Interval training: Alternate between sprinting and jogging (e.g., 30 seconds sprint, 90 seconds jog)\n3. Hill training: Incorporate uphill runs to build strength and endurance\n4. Consistency: Run at least 3 times per week, gradually increasing distance\n5. Proper recovery: Include rest days and proper nutrition\n\nA sample 8-week plan might look like:\n- Weeks 1-2: Run/walk 3 times per week (2 minutes run, 1 minute walk) for 20 minutes\n- Weeks 3-4: Run 2 miles, 3 times per week\n- Weeks 5-6: Run 2.5 miles, 3 times per week + 1 interval session\n- Weeks 7-8: Run 3 miles, 3 times per week + 1 interval session\n\nWould you like more specific guidance on any aspect of run training?"
            } else {
              response =
                "I can provide advice on preparing for the physical agility test. The test typically includes:\n\n1. Push-ups (maximum in 1 minute)\n2. Sit-ups (maximum in 1 minute)\n3. 1.5-mile run (timed)\n4. Obstacle course\n\nWhich specific component would you like training advice for? I can provide workout plans, technique tips, and progression strategies to help you pass with flying colors."
            }
            break

          case "polygraph":
            response =
              "The polygraph (lie detector) examination is a standard part of the background investigation process. Here's what you should know:\n\n• Purpose: To verify the information you've provided and assess your honesty\n• Process: You'll be connected to sensors that monitor physiological responses while answering questions\n• Question Types: Relevant questions about your background, control questions, and irrelevant questions\n• Duration: Typically 2-3 hours including pre-test interview\n\nKey tips:\n1. Be completely honest on your application and during the exam\n2. Don't try to use countermeasures (they're detectable and raise red flags)\n3. Get proper rest before the exam\n4. Answer questions directly without volunteering extra information\n5. Disclose any issues upfront rather than hiding them\n\nIs there a specific aspect of the polygraph process you're concerned about?"
            break

          case "psychological":
            response =
              "The psychological evaluation for Deputy Sheriff candidates typically includes:\n\n1. Written Tests: Standardized psychological assessments like the MMPI-2 (Minnesota Multiphasic Personality Inventory)\n2. Clinical Interview: One-on-one interview with a psychologist\n\nThe evaluation assesses:\n• Emotional stability and stress tolerance\n• Judgment and decision-making abilities\n• Interpersonal skills and teamwork capacity\n• Integrity and ethics\n• Ability to handle authority and use force appropriately\n\nTips for the psychological evaluation:\n• Be honest and consistent in your responses\n• Get adequate rest before testing\n• Answer based on your typical behavior, not what you think they want to hear\n• Be prepared to discuss stressful situations and how you've handled them\n• Understand that the goal is to ensure you're psychologically suited for the demands of the job\n\nDo you have specific questions about any part of the psychological evaluation process?"
            break

          default:
            response =
              "I can help you prepare for various aspects of the Deputy Sheriff selection process. What specific area would you like to focus on?"
        }
      }

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)

      // Reset displayed response for typing effect
      setDisplayedResponse("")

      // Simulate typing effect
      let index = 0
      const typingInterval = setInterval(() => {
        if (index < response.length) {
          setDisplayedResponse((prev) => prev + response[index])
          index++
        } else {
          clearInterval(typingInterval)
        }
      }, 10)
    }, 1000)
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
            <Link href="/">
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

