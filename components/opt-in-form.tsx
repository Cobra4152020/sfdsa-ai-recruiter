"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useUser } from "@/context/user-context"

interface OptInFormProps {
  isOpen: boolean
  onClose: () => void
  isApplying?: boolean
}

export function OptInForm({ isOpen, onClose, isApplying = false }: OptInFormProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUserInfo } = useUser()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("All fields are required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Use the existing setUserInfo function from your context
      await setUserInfo(fullName, email, phone, isApplying)

      // Close the form on success
      onClose()

      // Force a small delay before continuing
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("Failed to register. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        // Close when clicking outside the form
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-white dark:bg-[#1E1E1E] p-6 rounded-lg shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close form"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-[#0A3C1F] dark:text-[#FFD700]">Chat with Sgt. Ken</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">SFSO Recruitment Assistant</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700] focus:border-[#0A3C1F] dark:focus:border-[#FFD700] bg-white dark:bg-[#333333] text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700] focus:border-[#0A3C1F] dark:focus:border-[#FFD700] bg-white dark:bg-[#333333] text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700] focus:border-[#0A3C1F] dark:focus:border-[#FFD700] bg-white dark:bg-[#333333] text-gray-900 dark:text-white"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 dark:bg-[#FFD700] dark:text-[#0A3C1F] dark:hover:bg-[#FFD700]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700]"
          >
            {isSubmitting ? "Processing..." : "Save & Continue"}
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Your information will be used only for recruitment purposes.
        </p>
      </div>
    </div>
  )
}
