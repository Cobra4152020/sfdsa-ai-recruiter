import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { dbService } from "@/lib/db-service"
import { FloatingChatButton } from "@/components/floating-chat-button"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { inter, montserrat, playfair } from "./fonts"
import fs from "fs"
import path from "path"

// Initialize the database tables and ensure documents directory exists
if (typeof window === "undefined") {
  // Only run on server
  try {
    // Initialize database
    dbService.initialize().catch((error) => {
      console.error("Error initializing database:", error)
    })

    // Ensure documents directory exists
    const documentsDir = path.join(process.cwd(), "public", "documents")
    if (!fs.existsSync(documentsDir)) {
      console.log(`Creating documents directory: ${documentsDir}`)
      fs.mkdirSync(documentsDir, { recursive: true })
    }
  } catch (error) {
    console.error("Error in server initialization:", error)
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProvider>
            {children}
            <FloatingChatButton />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}