"use client"

import { useState, useRef } from "react"
import { Shield, Download, Share2, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from "@/context/user-context"

interface RecruitmentBadgeProps {
  userName?: string
  showShareOptions?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RecruitmentBadge({
  userName,
  showShareOptions = true,
  size = "md",
  className = "",
}: RecruitmentBadgeProps) {
  const { currentUser } = useUser()
  const [showDialog, setShowDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const badgeRef = useRef<HTMLDivElement>(null)

  // Determine badge size
  const badgeSizes = {
    sm: "w-48 h-48",
    md: "w-64 h-64",
    lg: "w-80 h-80",
  }

  const badgeSize = badgeSizes[size]
  const displayName = userName || currentUser?.name || "Future Deputy"

  // Generate badge URL for sharing
  const badgeUrl =
    typeof window !== "undefined" ? `${window.location.origin}/badge/${encodeURIComponent(displayName)}` : ""

  // Handle social media sharing
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(badgeUrl)}`, "_blank")
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm exploring a career with the San Francisco Sheriff's Office! #LawEnforcement #Careers`)}&url=${encodeURIComponent(badgeUrl)}`,
      "_blank",
    )
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(badgeUrl)}`, "_blank")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(badgeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download badge as image
  const downloadBadge = () => {
    if (!badgeRef.current) return

    // In a real implementation, you would use html2canvas or a similar library
    // For this demo, we'll just show an alert
    alert("In a production app, this would download the badge as an image.")
  }

  return (
    <div className={className}>
      <motion.div
        ref={badgeRef}
        className={`relative ${badgeSize} mx-auto rounded-full flex flex-col items-center justify-center text-white p-4 shadow-lg overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        style={{
          background: "linear-gradient(135deg, #0A3C1F 0%, #0F5A2F 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 rounded-full border-4 border-[#FFD700] opacity-50" />
        <div className="absolute inset-2 rounded-full border-2 border-[#FFD700] opacity-30" />

        {/* Shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-0 left-[-50%] w-[200%] h-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45 translate-y-[-80%]" />
        </div>

        {/* Badge texture */}
        <div className="absolute inset-0 rounded-full opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]" />

        {/* Badge content */}
        <div className="absolute top-0 left-0 right-0 pt-4 flex justify-center">
          <div className="bg-[#FFD700] text-[#0A3C1F] text-xs font-bold px-3 py-1 rounded-full shadow-md">OFFICIAL</div>
        </div>

        <Shield className="text-[#FFD700] mb-2 drop-shadow-lg" size={size === "sm" ? 32 : size === "md" ? 48 : 64} />

        <div className="text-center z-10">
          <div className="font-bold text-[#FFD700] mb-1 drop-shadow-md">
            {size === "sm" ? "SF SHERIFF" : "SAN FRANCISCO SHERIFF"}
          </div>
          <div
            className={`font-bold ${size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"} drop-shadow-md`}
          >
            RECRUITMENT PROGRAM
          </div>
          <div
            className={`mt-2 ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} bg-[#FFD700]/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block`}
          >
            {displayName}
          </div>
        </div>

        {/* Badge serial number */}
        <div className="absolute bottom-4 text-[10px] text-white/60">
          ID: SF-{Math.floor(Math.random() * 900000) + 100000}
        </div>
      </motion.div>

      {showShareOptions && (
        <div className="mt-4 flex justify-center">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-[#0A3C1F] dark:text-white border-[#0A3C1F] dark:border-white/20"
              >
                <Share2 className="h-4 w-4" />
                Share Badge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share your recruitment badge</DialogTitle>
                <DialogDescription>Show your interest in joining the San Francisco Sheriff's Office</DialogDescription>
              </DialogHeader>

              <div className="flex justify-center py-4">
                <RecruitmentBadge userName={displayName} showShareOptions={false} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={shareOnFacebook} className="bg-[#1877F2] hover:bg-[#1877F2]/90">
                  Facebook
                </Button>
                <Button onClick={shareOnTwitter} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90">
                  Twitter
                </Button>
                <Button onClick={shareOnLinkedIn} className="bg-[#0A66C2] hover:bg-[#0A66C2]/90">
                  LinkedIn
                </Button>
                <Button onClick={downloadBadge} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <div className="grid flex-1 gap-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Badge Link
                  </label>
                  <div className="flex">
                    <input
                      className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={badgeUrl}
                      readOnly
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="rounded-l-none"
                      variant={copied ? "outline" : "default"}
                    >
                      {copied ? <Check className="h-4 w-4" /> : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

