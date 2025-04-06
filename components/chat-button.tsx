"use client"

import { MessageSquare, ArrowRight } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useState } from "react"

interface ChatButtonProps extends ButtonProps {
  message?: string
  onChatStart?: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "accent"
  size?: "default" | "sm" | "lg" | "icon" | "xl"
  showArrow?: boolean
}

export function ChatButton({
  message = "Chat with Sgt. Ken",
  onChatStart,
  variant = "default",
  size = "default",
  showArrow = false,
  className = "",
  ...props
}: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onChatStart) {
      onChatStart()
    } else {
      // Default behavior: scroll to chat section
      const chatSection = document.getElementById("chat-section")
      if (chatSection) {
        const headerOffset = 80 // Approximate header height
        const elementPosition = chatSection.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      } else {
        // If on another page, navigate to home page with chat section
        window.location.href = "/#chat-section"
      }
    }
  }

  // Determine the variant-specific classes
  const variantClass =
    variant === "accent" ? "bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold" : ""

  return (
    <Button
      variant={variant === "accent" ? "default" : variant}
      size={size}
      className={`${className} ${variantClass} flex items-center gap-2`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <MessageSquare className={`h-4 w-4 ${size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"}`} />
      <span>{message}</span>
      {showArrow && (
        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
      )}
    </Button>
  )
}

