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
}
