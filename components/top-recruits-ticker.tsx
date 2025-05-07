"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Award } from "lucide-react"
import { dbService } from "@/lib/db-service"
import { useUser } from "@/context/user-context"

interface TopRecruit {
  id: string
  id: string
  participationCount: number
  hasApplied: boolean
  participantBadgeType?: string
}

interface TopRecruitsTickerProps {
  showOptInForm: () => void
}

export function TopRecruitsTicker({ showOptInForm }: TopRecruitsTickerProps) {
  const { currentUser, isLoggedIn } = useUser()
  const [topRecruits, setTopRecruits] = useState<TopRecruit[]>([
    { id: "1", name: "Michael R.", participationCount: 42, hasApplied: true },
    { id: "2", name: "Sarah L.", participationCount: 38, hasApplied: true },
    { id: "3", name: "James T.", participationCount: 35, hasApplied: false },
    { id: "4", name: "Emily K.", participationCount: 33, hasApplied: true },
    { id: "5", name: "David W.", participationCount: 31, hasApplied: false },
  ])

  // Animation for continuous scrolling
  const [key, setKey] = useState(0)

  // Fetch top recruits from database service
  useEffect(() => {
    const fetchTopRecruits = async () => {
      try {
        const leaders = await dbService.getParticipationLeaderboard(10)
        if (leaders && leaders.length > 0) {
          // Format names to match ticker style (first name + last initial)
          const formattedLeaders = leaders.map((leader) => {
            const nameParts = leader.name.split(" ")
            const firstName = nameParts[0]
            const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) + "." : ""

            return {
              id: leader.id,
              name: `${firstName} ${lastInitial}`,
              participationCount: leader.participationCount,
              hasApplied: leader.hasApplied,
              participantBadgeType: leader.participantBadgeType,
            }
          })
          setTopRecruits(formattedLeaders)
        } else if (isLoggedIn && currentUser) {
          // If no leaders but we have a current user, add them to the ticker
          const nameParts = currentUser.name.split(" ")
          const firstName = nameParts[0]
          const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) + "." : ""

          // Create a default entry with the current user
          setTopRecruits([
            {
              id: currentUser.id,
              name: `${firstName} ${lastInitial}`,
              participationCount: currentUser.participationCount || 1,
              hasApplied: currentUser.hasApplied || false,
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching top recruits for ticker:", error)
      }
    }

    fetchTopRecruits()
  }, [currentUser, isLoggedIn])

  // Reset animation periodically to create continuous effect
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1)
    }, 25000) // Reset every 25 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-[#0A3C1F]/30 backdrop-blur-sm rounded-lg p-1 mb-1 overflow-hidden">
      <div className="flex items-center justify-center">
        <Trophy className="h-4 w-4 text-[#FFD700] mr-1" />
        <h3 className="text-[#FFD700] text-sm font-bold">TOP RECRUITS</h3>
        <Trophy className="h-4 w-4 text-[#FFD700] ml-1" />
      </div>

      <div className="relative overflow-hidden w-full">
        <motion.div
          key={key}
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: 0,
          }}
          className="flex whitespace-nowrap"
        >
          {topRecruits.map((recruit, index) => (
            <button key={recruit.id} onClick={showOptInForm} className="inline-flex items-center mx-3 group">
              <span className="text-white/80 group-hover:text-[#FFD700] transition-colors">{recruit.name}</span>
              {recruit.hasApplied ? <Award className="h-3 w-3 text-[#FFD700] ml-1" /> : null}
              <span className="text-white/60 ml-1 text-xs">({recruit.participationCount})</span>
              {index < topRecruits.length - 1 && <span className="mx-3 text-white/30">•</span>}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}