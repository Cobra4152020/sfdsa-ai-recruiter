// /components/opt-in-form-new.tsx
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { saveUserOptIn } from "@/app/actions/chat-actions"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface OptInFormProps {
  onSuccess: (userId: string) => void
}

export function OptInFormNew({ onSuccess }: OptInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("phone", formData.phone)

      const result = await saveUserOptIn(data)

      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          if (result.userId) {
            onSuccess(result.userId)
          }
        }, 1500)
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" })
      }
    } catch (error: any) {
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
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto border border-gray-200 md:max-w-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center h-72">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-green-500 mb-4"
          >
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Success!</h2>
          <p className="text-gray-600 text-center mt-2">Starting chat...</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Chat with Sgt. Ken</h2>
          <p className="text-gray-600 text-center mb-6">SFSO Recruitment Assistant</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                Full Name
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(415) 555-1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-md transition disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save & Continue"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your information will be used only for recruitment purposes.
            </p>
          </form>
        </>
      )}
    </motion.div>
  )
}
