"use client"

import { useEffect } from "react"
import { Shield } from "lucide-react"

export default function SuccessPage() {
  // Disable any automatic scrolling or redirects
  useEffect(() => {
    // Clear any potential redirect timers or intervals
    const allTimeouts = []
    let id = setTimeout(() => {}, 0)
    while (id--) {
      clearTimeout(id)
    }

    // Prevent any scrolling
    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    // Only run this cleanup when component unmounts
    return () => {
      // Clean up any event listeners
      window.removeEventListener("scroll", preventScroll)
    }
  }, [])

  // Handle direct navigation to home
  const goToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] dark:bg-[#121212] flex flex-col">
      {/* Simple header */}
      <header className="bg-[#0A3C1F] text-white p-4">
        <div className="container mx-auto flex items-center">
          <Shield className="h-8 w-8 text-[#FFD700] mr-2" />
          <div>
            <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
            <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <button
          onClick={goToHome}
          className="mb-8 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
        >
          ← Back to Home
        </button>

        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
            Application Submitted Successfully
          </h1>
          <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70">
            Thank you for applying to the San Francisco Sheriff's Office. Your application has been received.
          </p>
        </div>

        {/* Simple badge */}
        <div className="flex justify-center mb-8">
          <div
            className="relative w-64 h-64 rounded-full flex flex-col items-center justify-center text-white p-4 shadow-lg overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0A3C1F 0%, #0F5A2F 100%)",
              border: "4px solid #FFD700",
            }}
          >
            <Shield className="text-[#FFD700] mb-2" size={48} />
            <div className="text-center">
              <div className="font-bold text-[#FFD700] mb-1">SAN FRANCISCO SHERIFF</div>
              <div className="font-bold">RECRUITMENT PROGRAM</div>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">What's Next?</h2>
          <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-6">
            Our recruitment team will review your application and contact you soon. In the meantime, you can return to
            the home page to explore more resources.
          </p>
          <button onClick={goToHome} className="px-6 py-3 bg-[#0A3C1F] text-white rounded-lg hover:bg-[#0A3C1F]/90">
            Return to Home Page
          </button>
        </div>
      </main>

      {/* Simple footer */}
      <footer className="bg-[#0A3C1F] text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} San Francisco Deputy Sheriff's Office. All rights reserved.</p>
      </footer>
    </div>
  )
}