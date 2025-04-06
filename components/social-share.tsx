"use client"

import { Facebook, Twitter, Linkedin, LinkIcon, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SocialShareProps {
  url: string
  title: string
  description?: string
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function SocialShare({
  url,
  title,
  description = "",
  className = "",
  showLabel = false,
  size = "md",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Determine icon size based on the size prop
  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24

  // Prepare sharing URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => window.open(facebookUrl, "_blank")}
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30"
            >
              <Facebook size={iconSize} />
              <span className="sr-only">Share on Facebook</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => window.open(twitterUrl, "_blank")}
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/30"
            >
              <Twitter size={iconSize} />
              <span className="sr-only">Share on Twitter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => window.open(linkedinUrl, "_blank")}
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30"
            >
              <Linkedin size={iconSize} />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-gray-100 text-gray-700 border-gray-300"
            >
              {copied ? <Check size={iconSize} className="text-green-500" /> : <LinkIcon size={iconSize} />}
              <span className="sr-only">Copy link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy link"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showLabel && <span className="text-sm text-gray-500 dark:text-gray-400">Share</span>}
    </div>
  )
}

