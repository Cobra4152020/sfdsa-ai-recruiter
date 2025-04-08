"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Award, Trophy, Star, Target, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BadgeType } from "@/components/earned-badges"
import { BadgeSharingDialog } from "@/components/badge-sharing-dialog"
import confetti from "canvas-confetti"

interface BadgeEarnedPopupProps {
  badge: BadgeType | null
  userName: string
  onClose: () => void
}

export function BadgeEarnedPopup({ badge, userName, onClose }: BadgeEarnedPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSharingOpen, setIsSharingOpen] = useState(false)

  useEffect(() => {
    if (badge) {
      setIsVisible(true)

      // Trigger confetti when badge is shown
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#0A3C1F", "#ffffff", "#FFA500"],
      })
    } else {
      setIsVisible(false)
    }
  }, [badge])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for exit animation
  }

  // Map badge types to icons and styles
  const getBadgeStyles = () => {
    if (!badge) return null

    const styles: Record<string, { bgColor: string; borderColor: string; shadowColor: string; icon: React.ReactNode }> =
      {
        shield: {
          bgColor: "from-emerald-500 to-green-600",
          borderColor: "border-emerald-300",
          shadowColor: "rgba(16, 185, 129, 0.5)",
          icon: <Shield className="h-12 w-12 text-white" />,
        },
        award: {
          bgColor: "from-amber-500 to-orange-600",
          borderColor: "border-amber-300",
          shadowColor: "rgba(245, 158, 11, 0.5)",
          icon: <Award className="h-12 w-12 text-white" />,
        },
        trophy: {
          bgColor: "from-yellow-400 to-yellow-600",
          borderColor: "border-yellow-300",
          shadowColor: "rgba(234, 179, 8, 0.5)",
          icon: <Trophy className="h-12 w-12 text-white" />,
        },
        star: {
          bgColor: "from-blue-500 to-indigo-600",
          borderColor: "border-blue-300",
          shadowColor: "rgba(59, 130, 246, 0.5)",
          icon: <Star className="h-12 w-12 text-white" />,
        },
        target: {
          bgColor: "from-purple-500 to-violet-600",
          borderColor: "border-purple-300",
          shadowColor: "rgba(139, 92, 246, 0.5)",
          icon: <Target className="h-12 w-12 text-white" />,
        },
        medal: {
          bgColor: "from-red-500 to-rose-600",
          borderColor: "border-red-300",
          shadowColor: "rgba(239, 68, 68, 0.5)",
          icon: <Medal className="h-12 w-12 text-white" />,
        },
      }

    // Default style if the icon type is not found
    const defaultStyle = {
      bgColor: "from-gray-500 to-gray-600",
      borderColor: "border-gray-300",
      shadowColor: "rgba(107, 114, 128, 0.5)",
      icon: <Award className="h-12 w-12 text-white" />,
    }

    return styles[badge.icon] || defaultStyle
  }

  const style = getBadgeStyles()
  if (!badge || !style) return null

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-6 mt-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  {/* Fun badge display */}
                  <div className="relative inline-flex items-center justify-center rounded-full h-24 w-24 transition-all duration-300">
                    {/* Badge glow effect */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.bgColor} opacity-50 blur-[3px]`}
                    ></div>

                    {/* Badge content */}
                    <div
                      className={`relative flex items-center justify-center h-full w-full rounded-full border-2 ${style.borderColor} bg-gradient-to-br ${style.bgColor} overflow-hidden`}
                    >
                      {style.icon}
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-[-100%] w-[300%] h-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45 animate-shine"></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">Achievement Unlocked!</h2>
                  <h3 className="text-xl font-semibold">{badge.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{badge.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full"
                >
                  <p className="text-sm italic">"{badge.shareMessage}"</p>
                </motion.div>

                <motion.div
                  className="flex gap-4 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>

                  <Button
                    className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    onClick={() => {
                      setIsSharingOpen(true)
                      setIsVisible(false)
                    }}
                  >
                    Share Badge
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {badge && (
        <BadgeSharingDialog
          isOpen={isSharingOpen}
          onClose={() => {
            setIsSharingOpen(false)
            onClose()
          }}
          badge={badge}
          userName={userName}
        />
      )}
    </>
  )
}