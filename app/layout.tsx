import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { dbService } from "@/lib/db-service"
import { FloatingChatButton } from "@/components/floating-chat-button"
import { ThemeProvider } from "@/components/theme-provider"

// Initialize the database tables
if (typeof window === "undefined") {
  // Only run on server
  try {
    dbService.initialize().catch((error) => {
      console.error("Error initializing database:", error)
    })
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

export const metadata: Metadata = {
  title: "San Francisco Deputy Sheriff AI Recruitment",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <FloatingChatButton />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'