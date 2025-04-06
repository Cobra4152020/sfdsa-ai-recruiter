"use client"

import { useState, useEffect } from "react"
import { OptInForm } from "@/components/opt-in-form"
import { Trophy, Award, ArrowLeft, MessageSquare, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { dbService } from "@/lib/db-service"
import { EarnedBadges } from "@/components/earned-badges"
import { ParticipantBadge } from "@/components/participant-badge"
import { BadgeLegend } from "@/components/badge-legend"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Create a standalone page component that doesn't depend on any context or state
export default function AwardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StandaloneHeader />
      <StandaloneContent />
      <StandaloneFooter />
    </div>
  )
}

// Standalone header component
function StandaloneHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A3C1F]/95 dark:bg-black/95 backdrop-blur-md py-2 shadow-lg"
          : "bg-[#0A3C1F]/80 dark:bg-black/80 backdrop-blur-sm py-2"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <a href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </a>
        </div>

        <div className="flex items-center justify-between py-2">
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-white hover:text-[#FFD700] transition-colors flex items-center">
              <Home className="h-4 w-4 mr-1" /> Home
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Standalone content component
function StandaloneContent() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [participationLeaders, setParticipationLeaders] = useState<any[]>([])
  const [applicantLeaders, setApplicantLeaders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setIsLoading(true)
        setError(null)

        try {
          const participation = await dbService.getParticipationLeaderboard(10)
          setParticipationLeaders(participation)
        } catch (error) {
          console.error("Error fetching participation leaderboard:", error)
          setError("Failed to load participation leaderboard")
          setParticipationLeaders([])
        }

        try {
          const applicants = await dbService.getApplicantsLeaderboard(10)
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
    <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <a href="/">
            <Button variant="ghost" className="text-[#0A3C1F] dark:text-[#FFD700] mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">Top Recruit Awards</h1>
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
                          <td className="py-4 px-4 text-[#0A3C1F]/60 dark:text-white/60">{user.participationCount}</td>
                          <td className="py-4 px-4">
                            <EarnedBadges badges={user.badges || []} userName={user.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Applied On</th>
                        <th className="py-3 px-4 text-left font-semibold text-[#0A3C1F] dark:text-white">Badges</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <a href="/">
                  <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">Return to Home</Button>
                </a>
              </div>
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0A3C1F]/10 dark:bg-[#FFD700]/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-[#0A3C1F] dark:text-[#FFD700]" />
            </div>
          </div>
        </div>
      </div>

      <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} isApplying={true} />
    </main>
  )
}

// Standalone footer component
function StandaloneFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A3C1F] dark:bg-black text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {currentYear} San Francisco Deputy Sheriff's Office. All rights reserved.</p>
      </div>
    </footer>
  )
}

// Import missing components
import { Shield, Home } from "lucide-react"