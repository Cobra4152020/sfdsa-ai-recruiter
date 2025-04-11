"use client"

import { useState } from "react"
import { UserProvider, useUser } from "@/context/user-context"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { ArrowLeft, Shield, Check, Info, FileText, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import MainContent from "@/components/MainContent"
// Import the entire module instead of just the function
import * as aiService from "@/lib/ai-services"

function GIBillContent() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Sergeant Ken. What would you like to know about using your G.I. Bill benefits for San Francisco Deputy Sheriff training?",
      quickReplies: ["Am I eligible?", "How much is covered?", "Application process?"],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [displayedResponse, setDisplayedResponse] = useState(messages[0].content)
  const { isLoggedIn, incrementParticipation } = useUser()

  const showOptInForm = () => {
    setIsOptInFormOpen(true)
  }

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
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "To get detailed information about G.I. Bill benefits for SF Sheriff training, please sign up or log in. This helps us provide personalized information based on your service background.",
            },
          ])
          setIsLoading(false)
          setDisplayedResponse(
            "To get detailed information about G.I. Bill benefits for SF Sheriff training, please sign up or log in. This helps us provide personalized information based on your service background.",
          )
        }, 1000)
        return
      }

      // Query OpenAI with the user's message
      const aiResponse = await aiService.queryAI(message)

      // If no specific G.I. Bill response, provide default G.I. Bill information
      let responseText = aiResponse.text
      if (!responseText.toLowerCase().includes("g.i. bill") && !responseText.toLowerCase().includes("gi bill")) {
        responseText = `Regarding the G.I. Bill for San Francisco Sheriff's Office training: ${responseText}`
      }

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responseText,
          source: aiResponse.source,
        },
      ])
      setDisplayedResponse(responseText)
    } catch (error) {
      console.error("Error querying OpenAI:", error)

      // Fallback response
      const fallbackResponse =
        "I apologize, but I'm having trouble accessing specific G.I. Bill information right now. Please contact our Veterans Services Coordinator at (415) 554-7225 for detailed assistance with your G.I. Bill benefits."

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

  return (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader showOptInForm={showOptInForm} />

      <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/" prefetch={false}>
              <Button variant="ghost" className="text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
              G.I. Bill Benefits for Deputy Sheriff Training
            </h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl">
              Learn how to use your Veterans Affairs (VA) education benefits to fund your training and career with the
              San Francisco Sheriff's Office.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 text-[#0A3C1F] dark:text-[#FFD700] mr-2" />
                    G.I. Bill Overview
                  </CardTitle>
                  <CardDescription>How your military service can support your law enforcement career</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The San Francisco Sheriff's Office is proud to support veterans transitioning to careers in law
                    enforcement. Our Deputy Sheriff Academy is approved for G.I. Bill benefits, allowing eligible
                    veterans to receive financial support during their training.
                  </p>

                  <Alert className="bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 border-[#0A3C1F] dark:border-[#FFD700]">
                    <Info className="h-4 w-4 text-[#0A3C1F] dark:text-[#FFD700]" />
                    <AlertTitle className="text-[#0A3C1F] dark:text-[#FFD700]">Important Information</AlertTitle>
                    <AlertDescription className="text-[#0A3C1F]/80 dark:text-white/80">
                      The San Francisco Sheriff's Office Deputy Sheriff Academy is approved for VA education benefits
                      under the G.I. Bill. Veterans may be eligible to receive a monthly housing allowance, tuition
                      assistance, and a stipend for books and supplies.
                    </AlertDescription>
                  </Alert>

                  <h3 className="text-xl font-semibold text-[#0A3C1F] dark:text-[#FFD700] mt-6">
                    Benefits You May Receive
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Monthly Housing Allowance (MHA) based on the San Francisco BAH rate</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Tuition and fee payment sent directly to the academy</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Books and supplies stipend (up to $1,000 per year)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Potential eligibility for salary while in training</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Eligibility & Application Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-[#0A3C1F] dark:text-white font-medium">
                        Eligibility Requirements
                      </AccordionTrigger>
                      <AccordionContent className="text-[#0A3C1F]/80 dark:text-white/80 space-y-2">
                        <p>To be eligible for G.I. Bill benefits for the SF Sheriff's Deputy Academy:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>You must have eligible active duty service time</li>
                          <li>You must have remaining G.I. Bill benefits</li>
                          <li>You must be accepted into the SF Sheriff's Deputy Academy</li>
                          <li>Your discharge status must meet VA requirements</li>
                        </ul>
                        <p className="mt-2">
                          Different G.I. Bill programs have different eligibility requirements. Post-9/11 G.I. Bill
                          (Chapter 33) typically requires at least 90 days of aggregate active duty service after Sept.
                          10, 2001.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-[#0A3C1F] dark:text-white font-medium">
                        Application Steps
                      </AccordionTrigger>
                      <AccordionContent className="text-[#0A3C1F]/80 dark:text-white/80 space-y-2">
                        <ol className="list-decimal pl-5 space-y-3">
                          <li>
                            <strong>Apply for VA Education Benefits:</strong> If you haven't already, apply for G.I.
                            Bill benefits through the VA's website (va.gov) or by submitting VA Form 22-1990.
                          </li>
                          <li>
                            <strong>Apply to the SF Sheriff's Deputy Academy:</strong> Complete the standard application
                            process for the San Francisco Sheriff's Office.
                          </li>
                          <li>
                            <strong>Notify the Academy:</strong> Once accepted, inform the academy's Veterans Services
                            Coordinator that you plan to use your G.I. Bill benefits.
                          </li>
                          <li>
                            <strong>Submit Certificate of Eligibility:</strong> Provide your Certificate of Eligibility
                            (COE) from the VA to the academy's Veterans Services Coordinator.
                          </li>
                          <li>
                            <strong>Complete VA Form 22-1995:</strong> If you've used your G.I. Bill benefits before,
                            you'll need to submit a Request for Change of Program or Place of Training.
                          </li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-[#0A3C1F] dark:text-white font-medium">
                        Required Documents
                      </AccordionTrigger>
                      <AccordionContent className="text-[#0A3C1F]/80 dark:text-white/80 space-y-2">
                        <p>You will need to provide the following documents:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>DD-214 (Certificate of Release or Discharge from Active Duty)</li>
                          <li>Certificate of Eligibility (COE) from the VA</li>
                          <li>VA Form 22-1990 or 22-1995 (as applicable)</li>
                          <li>Any additional documentation requested by the VA or academy</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-sm text-[#0A3C1F]/60 dark:text-white/60">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>
                      For detailed information, download our{" "}
                      <a href="#" className="text-[#0A3C1F] dark:text-[#FFD700] underline">
                        G.I. Bill Benefits Guide
                      </a>
                    </span>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chat with Sgt. Ken About G.I. Bill Benefits</CardTitle>
                  <CardDescription>
                    Get personalized answers about using your G.I. Bill for SF Sheriff training
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
                    <div className="h-[350px] flex flex-col">
                      <MainContent
                        messages={messages}
                        onSendMessage={handleUserMessage}
                        isLoading={isLoading}
                        displayedResponse={displayedResponse}
                        showOptInForm={showOptInForm}
                      />
                    </div>
                  </div>
                </CardContent>
                {!isLoggedIn && (
                  <CardFooter>
                    <Button onClick={showOptInForm} className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Sign In to Ask Detailed Questions
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Veterans Services Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#0A3C1F]/80 dark:text-white/80">
                    Our dedicated Veterans Services Coordinator can help you navigate the G.I. Bill process for the SF
                    Sheriff's Deputy Academy.
                  </p>
                  <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                      Veterans Services Coordinator
                    </h4>
                    <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80">Phone: (415) 554-7225</p>
                    <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80">Email: veterans@sfsheriff.com</p>
                    <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 mt-2">
                      Office Hours: Monday-Friday, 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>VA Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <a
                      href="https://www.va.gov/education/about-gi-bill-benefits/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E0D6B8] dark:border-[#333333] hover:bg-[#0A3C1F]/5 dark:hover:bg-[#FFD700]/5 transition-colors"
                    >
                      <div className="mr-3 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full">
                        <Info className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">G.I. Bill Overview</h4>
                        <p className="text-xs text-[#0A3C1F]/60 dark:text-white/60">VA.gov</p>
                      </div>
                    </a>

                    <a
                      href="https://www.va.gov/education/how-to-apply/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E0D6B8] dark:border-[#333333] hover:bg-[#0A3C1F]/5 dark:hover:bg-[#FFD700]/5 transition-colors"
                    >
                      <div className="mr-3 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">How to Apply</h4>
                        <p className="text-xs text-[#0A3C1F]/60 dark:text-white/60">VA.gov</p>
                      </div>
                    </a>

                    <a
                      href="https://www.va.gov/gi-bill-comparison-tool/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white dark:bg-[#1E1E1E] rounded-lg border border-[#E0D6B8] dark:border-[#333333] hover:bg-[#0A3C1F]/5 dark:hover:bg-[#FFD700]/5 transition-colors"
                    >
                      <div className="mr-3 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0A3C1F] dark:text-white">G.I. Bill Comparison Tool</h4>
                        <p className="text-xs text-[#0A3C1F]/60 dark:text-white/60">VA.gov</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#0A3C1F]/80 dark:text-white/80 mb-4">
                    As a veteran joining the San Francisco Sheriff's Office, you may be eligible for additional
                    benefits:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        Veterans preference points in the hiring process
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        Military service credit toward retirement
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">Access to veteran support networks</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#0A3C1F]/80 dark:text-white/80">
                        <Link href="/discounted-housing" className="text-[#0A3C1F] dark:text-[#FFD700] underline">
                          Discounted housing options
                        </Link>
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <ImprovedFooter />

      <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} />
    </div>
  )
}

// Main export wrapped with UserProvider
export default function GIBillPage() {
  return (
    <UserProvider>
      <GIBillContent />
    </UserProvider>
  )
}