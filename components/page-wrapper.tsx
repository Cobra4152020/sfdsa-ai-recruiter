"use client"

import type { ReactNode } from "react"
import { ImprovedHeader } from "./improved-header"
import { ImprovedFooter } from "./improved-footer"
import { useState } from "react"
import { OptInForm } from "./opt-in-form"

interface PageWrapperProps {
  children: ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const showOptInForm = (applying = false) => {
    setIsApplying(applying)
    setIsOptInFormOpen(true)
  }

  return (
    <>
      <ImprovedHeader showOptInForm={showOptInForm} />
      <main className="min-h-screen pt-20 pb-16">{children}</main>
      <ImprovedFooter />
      {isOptInFormOpen && (
        <OptInForm isOpen={isOptInFormOpen} onClose={() => setIsOptInFormOpen(false)} isApplying={isApplying} />
      )}
    </>
  )
}
