"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/context/user-context"

interface OptInFormNewProps {
  onSuccess: (userId: string) => void
}

export function OptInFormNew({ onSuccess }: OptInFormNewProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUserInfo } = useUser()

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
      const userData = await setUserInfo(fullName, email, phone, false)

      // Call onSuccess with the user ID
      if (userData && userData.id) {
        onSuccess(userData.id)
      } else {
        // If for some reason we don't have a user ID, still call onSuccess
        // with a placeholder to ensure the form closes
        onSuccess("user-registered")
      }

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-[#0A3C1F] dark:text-[#FFD700]">Chat with Sgt. Ken</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
        Please provide your information to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="chat-fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="chat-fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700] focus:border-[#0A3C1F] dark:focus:border-[#FFD700] bg-white dark:bg-[#333333] text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="chat-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            id="chat-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3C1F] dark:focus:ring-[#FFD700] focus:border-[#0A3C1F] dark:focus:border-[#FFD700] bg-white dark:bg-[#333333] text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="chat-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="chat-phone"
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
  )
}
