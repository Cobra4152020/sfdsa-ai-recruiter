"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { BadgeType } from "@/components/earned-badges"
import { Check, Copy, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { FaTiktok, FaThreads } from "react-icons/fa6"

interface BadgeSharingDialogProps {
  isOpen: boolean
  onClose: () => void
  badge: BadgeType
  userName: string
}

export function BadgeSharingDialog({ isOpen, onClose, badge, userName }: BadgeSharingDialogProps) {
  const [copied, setCopied] = useState(false)

  // Generate sharing URL
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const shareUrl = `${baseUrl}/badge/${encodeURIComponent(userName)}`

  // Generate sharing text
  const shareTitle = `I earned the ${badge.name} badge with the San Francisco Sheriff's Office!`
  const shareText =
    badge.shareMessage ||
    `I'm exploring a career with the San Francisco Sheriff's Office and earned the ${badge.name} badge! Join me and discover opportunities in law enforcement.`

  // Handle social media sharing
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
      "_blank",
    )
  }

  const shareOnInstagram = () => {
    // Instagram doesn't have a direct web sharing API
    // Usually this would copy the link and prompt to open Instagram
    alert("To share on Instagram, please copy the link and share it manually through the Instagram app.")
  }

  const shareOnThreads = () => {
    // Threads doesn't have a direct web sharing API yet
    alert("To share on Threads, please copy the link and share it manually through the Threads app.")
  }

  const shareOnTikTok = () => {
    // TikTok doesn't have a direct web sharing API
    alert("To share on TikTok, please copy the link and share it manually through the TikTok app.")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Map badge types to fun badge emojis and styles
  const getBadgeStyles = () => {
    const styles: Record<string, { bgColor: string; borderColor: string; shadowColor: string; emoji: string }> = {
      shield: {
        bgColor: "from-emerald-500 to-green-600",
        borderColor: "border-emerald-300",
        shadowColor: "rgba(16, 185, 129, 0.5)",
        emoji: "🛡️",
      },
      award: {
        bgColor: "from-amber-500 to-orange-600",
        borderColor: "border-amber-300",
        shadowColor: "rgba(245, 158, 11, 0.5)",
        emoji: "🏆",
      },
      trophy: {
        bgColor: "from-yellow-400 to-yellow-600",
        borderColor: "border-yellow-300",
        shadowColor: "rgba(234, 179, 8, 0.5)",
        emoji: "🏅",
      },
      star: {
        bgColor: "from-blue-500 to-indigo-600",
        borderColor: "border-blue-300",
        shadowColor: "rgba(59, 130, 246, 0.5)",
        emoji: "⭐",
      },
      target: {
        bgColor: "from-purple-500 to-violet-600",
        borderColor: "border-purple-300",
        shadowColor: "rgba(139, 92, 246, 0.5)",
        emoji: "🎯",
      },
      medal: {
        bgColor: "from-red-500 to-rose-600",
        borderColor: "border-red-300",
        shadowColor: "rgba(239, 68, 68, 0.5)",
        emoji: "🥇",
      },
    }

    // Default style if the icon type is not found
    const defaultStyle = {
      bgColor: "from-gray-500 to-gray-600",
      borderColor: "border-gray-300",
      shadowColor: "rgba(107, 114, 128, 0.5)",
      emoji: "🔔",
    }

    return styles[badge.icon] || defaultStyle
  }

  const style = getBadgeStyles()
  const emoji = badge.emoji || style.emoji

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Share Your Achievement</DialogTitle>
          <DialogDescription className="text-center">
            Congratulations on earning the {badge.name} badge! Share your achievement with others.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          {/* Fun badge display */}
          <div className="relative inline-flex items-center justify-center rounded-full h-20 w-20 mb-4 transition-all duration-300">
            {/* Badge glow effect */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.bgColor} opacity-50 blur-[2px]`}
            ></div>

            {/* Badge content */}
            <div
              className={`relative flex items-center justify-center h-full w-full rounded-full border-2 ${style.borderColor} bg-gradient-to-br ${style.bgColor} overflow-hidden`}
            >
              <span className="text-white text-3xl">{emoji}</span>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-[-100%] w-[300%] h-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45 animate-shine"></div>
            </div>
          </div>

          <h3 className="font-bold text-xl mb-1">{badge.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{badge.description}</p>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 w-full">
            <p className="text-sm italic text-center">"{shareText}"</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            onClick={shareOnFacebook}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/30"
          >
            <Facebook className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Facebook</span>
          </Button>
          <Button
            onClick={shareOnTwitter}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border-[#1DA1F2]/30"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Twitter</span>
          </Button>
          <Button
            onClick={shareOnLinkedIn}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border-[#0A66C2]/30"
          >
            <Linkedin className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">LinkedIn</span>
          </Button>
          <Button
            onClick={shareOnInstagram}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-[#E4405F]/10 hover:bg-[#E4405F]/20 text-[#E4405F] border-[#E4405F]/30"
          >
            <Instagram className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Instagram</span>
          </Button>
          <Button
            onClick={shareOnThreads}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-black/10 hover:bg-black/20 text-black dark:text-white border-black/30 dark:border-white/30"
          >
            <FaThreads className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Threads</span>
          </Button>
          <Button
            onClick={shareOnTikTok}
            variant="outline"
            className="flex items-center justify-center gap-2 bg-black/10 hover:bg-black/20 text-black dark:text-white border-black/30 dark:border-white/30"
          >
            <FaTiktok className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">TikTok</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="flex">
              <input
                className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={shareUrl}
                readOnly
              />
              <Button onClick={copyToClipboard} className="rounded-l-none" variant={copied ? "outline" : "default"}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

