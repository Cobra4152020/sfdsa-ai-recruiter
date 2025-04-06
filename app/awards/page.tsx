"use client"

import { useState, useEffect } from "react"
import { UserProvider } from "@/context/user-context"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { OptInForm } from "@/components/opt-in-form"
import { Trophy, Award, ArrowLeft, MessageSquare, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { dbService } from "@/lib/db-service"
import { EarnedBadges, type BadgeType } from "@/components/earned-badges"
import { BadgeEarnedPopup } from "@/components/badge-earned-popup"
import { ChatButton } from "@/components/chat-button"
import { ParticipantBadge } from "@/components/participant-badge"
import { BadgeLegend } from "@/components/badge-legend"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function AwardsContent() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [participationLeaders, setParticipationLeaders] = useState<any[]>([])
  const [applicantLeaders, setApplicantLeaders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newBadge, setNewBadge] = useState<BadgeType | null>(null)
  const [currentUserName, setCurrentUserName] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching leaderboards...")

        try {
          const participation = await dbService.getParticipationLeaderboard(10)
          console.log("Participation leaders:", participation)
          setParticipationLeaders(participation)
        } catch (error) {
          console.error("Error fetching participation leaderboard:", error)
          setError("Failed to load participation leaderboard")
          setParticipationLeaders([])
        }

        try {
          const applicants = await dbService.getApplicantsLeaderboard(10)
          console.log("Applicant leaders:", applicants)
          setApplicantLeaders(applicants)
        } catch (error) {
          console.error("Error fetching applicants leaderboard:", error)
          setError("Failed to load applicants leaderboard")
          setApplicantLeaders([])
        }
      } catch (error) {
        console.error("Error in fetchLeaderboards:", error)
        setError("Failed to load leaderboards")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboards()

    // Check for new badge in URL params
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const badgeId = urlParams.get("newBadge")
      const userName = urlParams.get("userName") || "Future Deputy"

      if (badgeId) {
        // Simulate fetching badge details
        // In a real app, you would fetch this from your database
        setTimeout(() => {
          const mockBadge: BadgeType = {
            id: badgeId,
            name: "Achievement Unlocked",
            description: "You've reached a new milestone in your recruitment journey!",
            icon: "trophy",
            color: "yellow-500",
            earnedAt: new Date(),
            shareMessage:
              "I'm making progress in my journey with the San Francisco Sheriff's Office! Join me in exploring this rewarding career.",
          }
          setNewBadge(mockBadge)
          setCurrentUserName(userName)
        }, 1000)

        // Remove the query params from URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  const showOptInForm = () => {
    setIsOptInFormOpen(true)
  }

  // Format name to show only first name and last initial
  const formatName = (fullName: string) => {
    const nameParts = fullName.split(" ")
    if (nameParts.length === 1) return nameParts[0]

    const firstName = nameParts[0]
    const lastInitial = nameParts[nameParts.length - 1].charAt(0) + "."

    return `${firstName} ${lastInitial}`
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
              Top Recruit Awards
            </h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl">
              Recognizing our most engaged candidates and top applicants. Engage with our AI assistant, learn about the
              application process, and join the ranks of those making a difference in San Francisco.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
              <p className="text-sm mt-1">Please try refreshing the page.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Participation Awards */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
              <div className="bg-[#0A3C1F] dark:bg-black p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-6 w-6 text-[#FFD700] mr-3" />
                  <h2 className="text-xl font-bold text-white">Engagement Champions</h2>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-white/80 text-sm">
                        <Info className="h-4 w-4 mr-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Chat with Sgt. Ken to earn points and climb the leaderboard!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ) : participationLeaders.length > 0 ? (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#E0D6B8] dark:border-[#333333]">
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white w-10">#</th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Name</th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">
                            Interactions
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Badges</th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participationLeaders.map((user, index) => (
                          <tr key={user.id} className="border-b border-[#E0D6B8] dark:border-[#333333]">
                            <td className="py-4 px-4 font-bold text-[#0A3C1F] dark:text-[#FFD700]">{index + 1}</td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-[#0A3C1F] dark:text-white flex items-center gap-2">
                                {formatName(user.name)}
                                {user.participantBadgeType && (
                                  <ParticipantBadge type={user.participantBadgeType} size="md" showTooltip={true} />
                                )}
                              </div>
                              {user.hasApplied && (
                                <div className="flex items-center text-xs text-[#0A3C1F]/60 dark:text-white/60">
                                  <Award className="h-3 w-3 text-[#FFD700] mr-1" /> Applied
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-[#0A3C1F]/60 dark:text-white/60">
                              {user.participationCount}
                            </td>
                            <td className="py-4 px-4">
                              <EarnedBadges badges={user.badges || []} userName={user.name} />
                            </td>
                            <td className="py-4 px-4">
                              <ChatButton
                                variant="outline"
                                size="sm"
                                message="Ask Sgt. Ken"
                                className="w-full text-xs"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Engagement promotion banner */}
                  <div className="mt-4 p-3 bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 rounded-lg border border-[#0A3C1F]/10 dark:border-[#FFD700]/10">
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700] mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 font-medium">
                          Ask Sgt. Ken more questions to gain points and earn badges!
                        </p>
                        <p className="text-xs text-[#0A3C1F]/60 dark:text-white/60 mt-1">
                          Each interaction increases your score and helps you climb the leaderboard.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ChatButton variant="accent" size="sm" message="Start Chatting" className="w-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-[#0A3C1F]/60 dark:text-white/60">
                  No participants yet. Be the first to join!
                </div>
              )}
            </div>

            {/* Applicants Awards */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333]">
              <div className="bg-[#0A3C1F] dark:bg-black p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-[#FFD700] mr-3" />
                  <h2 className="text-xl font-bold text-white">Top Applicants</h2>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-white/80 text-sm">
                        <Info className="h-4 w-4 mr-1" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Apply now to join our top applicants and start your career with the SF Sheriff's Office!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ) : applicantLeaders.length > 0 ? (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#E0D6B8] dark:border-[#333333]">
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white w-10">#</th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Name</th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">
                            Applied On
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Badges</th>
                          <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicantLeaders.map((user, index) => (
                          <tr key={user.id} className="border-b border-[#E0D6B8] dark:border-[#333333]">
                            <td className="py-4 px-4 font-bold text-[#0A3C1F] dark:text-[#FFD700]">{index + 1}</td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-[#0A3C1F] dark:text-white flex items-center gap-2">
                                {formatName(user.name)}
                                {user.participantBadgeType && (
                                  <ParticipantBadge type={user.participantBadgeType} size="md" showTooltip={true} />
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-[#0A3C1F]/60 dark:text-white/60">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <EarnedBadges badges={user.badges || []} userName={user.name} />
                            </td>
                            <td className="py-4 px-4">
                              <ChatButton
                                variant="outline"
                                size="sm"
                                message="Ask Sgt. Ken"
                                className="w-full text-xs"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Application promotion banner */}
                  <div className="mt-4 p-3 bg-[#FFD700]/10 dark:bg-[#FFD700]/5 rounded-lg border border-[#FFD700]/20 dark:border-[#FFD700]/10">
                    <div className="flex items-start">
                      <Award className="h-5 w-5 text-[#0A3C1F] dark:text-[#FFD700] mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[#0A3C1F]/80 dark:text-white/80 font-medium">
                          Ready to join our top applicants? Apply now!
                        </p>
                        <p className="text-xs text-[#0A3C1F]/60 dark:text-white/60 mt-1">
                          Submit your application to earn the Applicant badge and start your career with the SF
                          Sheriff's Office.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button variant="accent" size="sm" className="w-full" onClick={showOptInForm}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-[#0A3C1F]/60 dark:text-white/60">
                  No applicants yet. Be the first to apply!
                </div>
              )}
            </div>
          </div>

          {/* Badge Legend moved under leaderboards */}
          <div className="mt-8">
            <BadgeLegend />
          </div>

          <div className="mt-12 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg overflow-hidden border border-[#E0D6B8] dark:border-[#333333] p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                  Have Questions About Becoming a Deputy Sheriff?
                </h3>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
                  Chat with Sgt. Ken, our AI recruitment officer, to learn more about the application process,
                  requirements, benefits, and career opportunities. Every question earns you points!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <ChatButton variant="accent" message="Chat with Sgt. Ken" showArrow />
                  <Button onClick={showOptInForm} variant="outline" className="border-[#0A3C1F] dark:border-white/20">
                    Apply Now
                  </Button>
                </div>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-[#0A3C1F] dark:text-[#FFD700]" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ImprovedFooter />

      <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} isApplying={true} />

      {/* Badge earned popup */}
      <BadgeEarnedPopup badge={newBadge} userName={currentUserName} onClose={() => setNewBadge(null)} />
    </div>
  )
}

// This is the default export that Next.js requires for pages
export default function AwardsPage() {
  return (
    <UserProvider>
      <AwardsContent />
    </UserProvider>
  )
}