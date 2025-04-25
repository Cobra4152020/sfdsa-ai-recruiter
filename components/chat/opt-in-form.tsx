"use client"

import { useState } from "react"
import { saveUserOptIn } from "@/app/actions/chat-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface OptInFormProps {
  onSuccess: (userId: string) => void
}

export function OptInForm({ onSuccess }: OptInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chat with Sgt. Ken</h2>
        <p className="text-gray-700">SFSO Recruitment Assistant</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <p className="text-gray-800">
          Ask questions about the application process, requirements, benefits, or anything else you'd like to know about
          becoming a San Francisco Deputy Sheriff.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-900 font-medium">
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
          <Label htmlFor="email" className="text-gray-900 font-medium">
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
          <Label htmlFor="phone" className="text-gray-900 font-medium">
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

        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>

        <p className="text-xs text-gray-600 mt-2 text-center">
          Your information will be used only for recruitment purposes.
        </p>
      </form>
    </div>
  )
}
