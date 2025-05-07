import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { Toaster } from "@/components/ui/toaster"
import { PRIMARY_DOMAIN } from "@/lib/domain-utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SF Deputy Sheriff AI Recruitment",
  description: "Chat with Sgt. Ken about becoming a San Francisco Deputy Sheriff",
  metadataBase: new URL(`https://${PRIMARY_DOMAIN}`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${PRIMARY_DOMAIN}`,
    title: "SF Deputy Sheriff AI Recruitment",
    description:
      "Join the San Francisco Sheriff's Office and become part of a team dedicated to public safety and community service.",
    siteName: "SF Deputy Sheriff Recruitment",
  },
  twitter: {
    card: "summary_large_image",
    title: "SF Deputy Sheriff AI Recruitment",
    description:
      "Join the San Francisco Sheriff's Office and become part of a team dedicated to public safety and community service.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
