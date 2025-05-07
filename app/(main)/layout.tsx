"use client"

import type React from "react"

import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { useState } from "react"
import { OptInForm } from "@/components/opt-in-form"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [showOptIn, setShowOptIn] = useState(false)

  const showOptInForm = () => {
    setShowOptIn(true)
  }

  const hideOptInForm = () => {
    setShowOptIn(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ImprovedHeader showOptInForm={showOptInForm} />
      <main className="flex-grow pt-24 pb-16">{children}</main>
      <ImprovedFooter />

      {showOptIn && <OptInForm onClose={hideOptInForm} />}
    </div>
  )
}
