"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"

interface ConfettiButtonProps {
  children: React.ReactNode
  className?: string
  showOptInForm: () => void
}

export function ConfettiButton({ children, className, showOptInForm }: ConfettiButtonProps) {
  const { isLoggedIn, markAsApplied } = useUser()
  const router = useRouter()

  const handleClick = async () => {
    // Always trigger confetti for visual feedback
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Always show the opt-in form when "Apply Now" is clicked
    if (showOptInForm) {
      // If user is already logged in, mark them as applied and redirect to success page
      if (isLoggedIn) {
        await markAsApplied()
        router.push("/success?action=apply")
      } else {
        // Show the opt-in form with the "applying" flag
        showOptInForm()
      }
    }
  }

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  )
}

