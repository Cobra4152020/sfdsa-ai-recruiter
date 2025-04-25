"use client"

import type React from "react"

import { useState } from "react"
import { saveUserOptIn } from "@/app/actions/chat-actions"
import { useToast } from "@/components/ui/use-toast"

interface OptInFormProps {
  onSuccess: (userId: string) => void
}

export function OptInFormNew({ onSuccess }: OptInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      // Create FormData object
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("phone", formData.phone)

      const result = await saveUserOptIn(data)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        if (result.userId) {
          onSuccess(result.userId)
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Something went wrong: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Inline styles to ensure visibility
  const containerStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    border: "1px solid #e2e8f0",
  }

  const headingStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: "16px",
    textAlign: "center",
  }

  const subheadingStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#4a5568",
    marginBottom: "24px",
    textAlign: "center",
  }

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "16px",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#2d3748",
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #cbd5e0",
    borderRadius: "4px",
    backgroundColor: "white",
    color: "#1a202c",
  }

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ecc94b", // Yellow
    color: "#1a202c",
    border: "none",
    borderRadius: "4px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "8px",
  }

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: "#d69e2e",
  }

  const footerStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#718096",
    marginTop: "16px",
    textAlign: "center",
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Chat with Sgt. Ken</h2>
      <p style={subheadingStyle}>SFSO Recruitment Assistant</p>

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="name" style={labelStyle}>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="phone" style={labelStyle}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(415) 555-1234"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={isSubmitting ? { ...buttonStyle, opacity: 0.7 } : buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>

        <p style={footerStyle}>Your information will be used only for recruitment purposes.</p>
      </form>
    </div>
  )
}"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { saveUserOptIn } from "@/app/actions/chat-actions"

interface OptInFormProps {
  isOpen: boolean
  onClose: () => void
  isApplying?: boolean
}

export function OptInForm({ isOpen, onClose, isApplying = false }: OptInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { login } = useUser()

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      const result = await saveUserOptIn(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        if (result.userId) {
          login(result.userId)
        }
        onClose()

        // If applying, redirect to application page
        if (isApplying) {
          window.location.href = "/apply"
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Something went wrong: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md min-h-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {isApplying ? "Start Your Application" : "Chat with Sgt. Ken"}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
          <p className="text-gray-800 text-sm">
            {isApplying
              ? "Please provide your information to begin the application process."
              : "Ask questions about the application process, requirements, benefits, or anything else you'd like to know about becoming a San Francisco Deputy Sheriff."}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              className="w-full bg-white text-gray-900 border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="w-full bg-white text-gray-900 border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-900">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(415) 555-1234"
              className="w-full bg-white text-gray-900 border-gray-300"
            />
          </div>

          <Button type="submit" className="w-full bg-green-800 hover:bg-green-900 text-white" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isApplying ? "Continue to Application" : "Save & Continue"}
          </Button>

          <p className="text-xs text-gray-600 mt-2 text-center">
            Your information will be used only for recruitment purposes.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

