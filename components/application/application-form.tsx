"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitApplication } from "@/app/actions/application-actions"
import { useToast } from "@/components/ui/use-toast"

export function ApplicationForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      const result = await submitApplication(formData)

      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted.",
        })
        router.push("/application/success")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit application. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Start Your Application</h2>

      {step === 1 && (
        <>
          <p className="mb-6 text-gray-700">
            Please enter your information to begin the application process for Deputy Sheriff.
          </p>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                className="w-full bg-white text-gray-900 border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@example.com"
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

            <Button type="button" className="w-full" onClick={() => setStep(2)}>
              Continue to Application
            </Button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-6 text-gray-700">Please complete the following information to submit your application.</p>

          <form action={handleSubmit} className="space-y-6">
            {/* Additional form fields would go here */}

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>

              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
