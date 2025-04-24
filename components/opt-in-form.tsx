"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/user-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { trapFocus } from "@/lib/accessibility"

interface OptInFormProps {
  isOpen: boolean
  onClose: () => void
  required?: boolean
  pendingQuestion?: string | null
  onQuestionProcess?: (question: string) => void
  isApplying?: boolean
}

export function OptInForm({
  isOpen,
  onClose,
  required = false,
  pendingQuestion = null,
  onQuestionProcess,
  isApplying = false,
}: OptInFormProps) {
  const { setUserInfo, isLoggedIn, markAsApplied } = useUser()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  // Add a flag to track if we've already redirected
  const [hasRedirected, setHasRedirected] = useState(false)
  // Add a flag to prevent multiple redirects
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Check if the current page is the awards page
  const isAwardsPage = typeof window !== "undefined" && window.location.pathname.includes("/awards")

  // Only auto-redirect on non-awards pages when user is logged in and applying
  useEffect(() => {
    // Skip auto-redirect if we're on the awards page
    if (isAwardsPage) {
      return
    }

    if (isLoggedIn && isApplying && !hasRedirected) {
      markAsApplied().then(() => {
        // Set the redirect flag to prevent multiple redirects
        setHasRedirected(true)
        // Redirect to success page
        if (!isRedirecting) {
          setIsRedirecting(true)
          window.location.href = `/success?action=apply`
        }
        onClose()
      })
    }
  }, [isLoggedIn, isApplying, hasRedirected, markAsApplied, onClose, isRedirecting, isAwardsPage])

  // Trap focus within the dialog when open
  useEffect(() => {
    if (isOpen) {
      const dialogElement = document.querySelector('[role="dialog"]') as HTMLElement
      if (dialogElement) {
        const cleanup = trapFocus(dialogElement)
        return cleanup
      }
    }
  }, [isOpen])

  // Don't show the form if the user is already logged in and it's not required or applying
  if (isLoggedIn && !required && !isApplying) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!name || !email) {
      setError("Name and email are required")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError(null)

    console.log("Starting user registration with:", { name, email, phone, isApplying })

    try {
      // Pass isApplying flag to the setUserInfo function
      const result = await setUserInfo(name, email, phone, isApplying)
      console.log("User registration result:", result)

      if (isApplying) {
        setSuccessMessage("Thank you for applying! You're being redirected to our application portal...")
        setShowSuccess(true)

        // Redirect to success page after a short delay
        setTimeout(() => {
          if (!isRedirecting) {
            setIsRedirecting(true)
            window.location.href = `/success?action=apply`
          }
          onClose()
        }, 2000)
      } else {
        setSuccessMessage("Thank you for signing up! We'll keep you updated on recruitment opportunities.")
        setShowSuccess(true)

        // Redirect to success page after a short delay
        setTimeout(() => {
          if (!isRedirecting) {
            setIsRedirecting(true)
            window.location.href = `/success?action=signup`
          }
          onClose()

          // Process any pending question after successful sign-up
          if (pendingQuestion && onQuestionProcess) {
            onQuestionProcess(pendingQuestion)
          }
        }, 2000)
      }
    } catch (err) {
      console.error("Detailed error in form submission:", err)
      setError(`Failed to save your information: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={required ? undefined : onClose}>
      <DialogContent
        className="sm:max-w-[425px] rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm shadow-lg"
        aria-labelledby="form-title"
        aria-describedby="form-description"
      >
        <DialogHeader>
          <DialogTitle id="form-title" className="text-xl">
            {isApplying ? "Start Your Application" : "Join Our Recruitment Program"}
          </DialogTitle>
          <DialogDescription id="form-description">
            {isApplying
              ? "Please enter your information to begin the application process for Deputy Sheriff."
              : required
                ? "Please enter your information to access the recruitment assistant."
                : "Enter your information to get personalized updates about deputy sheriff positions."}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-6 text-center" aria-live="polite">
            <div className="text-[#0A3C1F] dark:text-[#FFD700] text-xl font-bold mb-2">
              {isApplying ? "Thank you for applying!" : "Thank you for signing up!"}
            </div>
            <p className="text-[#0A3C1F]/70 dark:text-white/70">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span aria-hidden="true">*</span>
                  <span className="sr-only">required</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  aria-required="true"
                  className="rounded-xl h-11"
                  aria-invalid={error && !name ? "true" : "false"}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span aria-hidden="true">*</span>
                  <span className="sr-only">required</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                  aria-required="true"
                  className="rounded-xl h-11"
                  aria-invalid={error && !email ? "true" : "false"}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="rounded-xl h-11"
                />
              </div>

              {error && (
                <div className="text-destructive text-sm" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              {!required && !isApplying && (
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold rounded-xl"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Saving..." : isApplying ? "Continue to Application" : "Save & Continue"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
