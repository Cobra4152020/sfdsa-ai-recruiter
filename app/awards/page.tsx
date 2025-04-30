"use client"

import { useState } from "react"
import { UserProvider, useUser } from "@/context/user-context"
import { OptInForm } from "@/components/opt-in-form"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Leaderboard } from "@/components/leaderboard"
import { BadgeShowcase } from "@/components/badge-showcase"
import { DebugUser } from "@/components/debug-user"
import { SkipToContent } from "@/components/skip-to-content"

function AwardsPage() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const { isLoggedIn } = useUser()

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <ImprovedHeader showOptInForm={() => showOptInForm(true)} />
      <main id="main-content" className="flex-1 pt-32 pb-16 bg-[#F8F5EE] dark:bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Top Recruit Awards</h1>
            <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-2xl mx-auto">
              Recognizing our most engaged candidates and top applicants. Engage with our AI assistant, learn about the
              application process, and join the ranks of those making a difference in San Francisco.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Leaderboard />
            <BadgeShowcase />
          </div>
        </div>
      </main>
      <ImprovedFooter />

      {/* Opt-in form dialog */}
      <OptInForm
        isOpen={isOptInFormOpen}
        onClose={() => {
          setIsOptInFormOpen(false)
          setIsApplying(false)
        }}
        isApplying={isApplying}
      />

      {/* Debug component */}
      <DebugUser />
    </div>
  )
}

// Main export - IMPORTANT: Wrap with UserProvider
export default function AwardsPageWrapper() {
  return (
    <UserProvider>
      <AwardsPage />
    </UserProvider>
  )
}
