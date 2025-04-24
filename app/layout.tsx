import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { SkipToContent } from "@/components/skip-to-content"
import { AnalyticsProvider } from "@/components/analytics/analytics-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SF Deputy Sheriff Recruitment",
  description: "Join the San Francisco Deputy Sheriff's Department",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider>
                <SkipToContent />
                <main id="main-content">{children}</main>
              </AnalyticsProvider>
            </Suspense>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
