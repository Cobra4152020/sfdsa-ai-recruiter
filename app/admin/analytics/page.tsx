"use client"

import { useState } from "react"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { UserProvider } from "@/context/user-context"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminAnalyticsPage() {
  const [isOptInFormOpen, setIsOptInFormOpen] = useState(false)

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <ImprovedHeader showOptInForm={() => setIsOptInFormOpen(true)} />

        <main className="flex-1 bg-[#F8F5EE] dark:bg-[#121212] pt-40 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Link href="/admin" prefetch={false}>
                <Button variant="ghost" className="text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A3C1F] dark:text-[#FFD700] mb-4">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70 max-w-3xl">
                Track user engagement, monitor conversion rates, and gain insights into recruitment performance.
              </p>
            </div>

            <AnalyticsDashboard adminView={true} />
          </div>
        </main>

        <ImprovedFooter />
      </div>
    </UserProvider>
  )
}
