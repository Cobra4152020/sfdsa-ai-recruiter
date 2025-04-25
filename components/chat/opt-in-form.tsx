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
    <div className="w-full max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Chat with Sergeant Ken</h2>
      <p className="mb-4 text-gray-700">
        Please provide your information to start chatting with our recruitment assistant.
      </p>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-900">
            Name
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
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="w-full bg-white text-gray-900 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-900">
            Phone (optional)
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your phone number"
            className="w-full bg-white text-gray-900 border-gray-300"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Start Chatting"}
        </Button>

        <p className="text-xs text-gray-600 mt-2">
          Your information will be used only for recruitment purposes and will not be shared with third parties.
        </p>
      </form>
    </div>
  )
}
