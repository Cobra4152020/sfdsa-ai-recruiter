"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { RecruitmentBadge } from "@/components/recruitment-badge"
import { SocialShare } from "@/components/social-share"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ChatButton } from "@/components/chat-button"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { OptInForm } from "@/components/opt-in-form"
import { MessageSquare } from "lucide-react"

export default function SuccessPage() {
  const { currentUser, isLoggedIn } = useUser()
  const searchParams = useSearchParams()
  const action = searchParams.get("action") || "signup"
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)

  // Get the base URL for sharing
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const shareUrl = `${baseUrl}/badge/${encodeURIComponent(currentUser?.name || "Future Deputy")}`

  // Set page title and description based on action
  const pageTitle = action === "apply" ? "Application Submitted Successfully" : "Sign Up Successful"

  const pageDescription =
    action === "apply"
      ? "Thank you for applying to the San Francisco Sheriff's Office. Your application has been received."
      : "Thank you for signing up for the San Francisco Sheriff's Office recruitment program."

  // If user is not logged in, show the opt-in form
  useEffect(() => {
    if (!isLoggedIn) {
      setIsOptInFormOpen(true)
    }
  }, [isLoggedIn])

  return (
    <div className="min-h-screen flex flex-col">
      <ImprovedHeader showOptInForm={() => setIsOptInFormOpen(true)} />

      <main className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212]">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">{pageTitle}</h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70">{pageDescription}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <RecruitmentBadge />

            <div className="mt-8 text-center">
              <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Share Your Interest</h2>
              <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
                Let your friends and family know about your interest in joining the San Francisco Sheriff's Office.
              </p>

              <div className="flex justify-center mb-8">
                <SocialShare
                  url={shareUrl}
                  title={`I'm exploring a career with the San Francisco Sheriff's Office!`}
                  description="Join me and discover opportunities in law enforcement with the San Francisco Sheriff's Office."
                  size="lg"
                />
              </div>

              {action === "apply" ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">What's Next?</h3>
                  <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
                    Our recruitment team will review your application and contact you soon. In the meantime, you can
                    prepare for the next steps in the process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/awards">
                      <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                        View Top Recruit Awards
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <ChatButton variant="accent" message="Chat with Sgt. Ken" showArrow />
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2 text-[#0A3C1F] dark:text-[#FFD700]">
                    Ready to Take the Next Step?
                  </h3>
                  <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
                    Apply now to start your journey with the San Francisco Sheriff's Office or chat with Sgt. Ken to
                    learn more.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setIsOptInFormOpen(true)}
                      className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <ChatButton variant="outline" message="Chat with Sgt. Ken" showArrow />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat promotion section */}
          <div className="max-w-3xl mx-auto mt-16 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg p-6 border border-[#E0D6B8] dark:border-[#333333]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                  Have Questions? Earn Points by Chatting!
                </h3>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
                  Chat with Sgt. Ken to learn more about the application process, requirements, benefits, and career
                  opportunities. Every interaction earns you points and helps you climb our leaderboard!
                </p>
                <ChatButton variant="accent" message="Start Chatting" showArrow className="mx-auto md:mx-0" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ImprovedFooter />

      <OptInForm
        isOpen={isOptInFormOpen}
        onClose={() => setIsOptInFormOpen(false)}
        isApplying={action === "apply"}
        required={!isLoggedIn}
      />
    </div>
  )
}

