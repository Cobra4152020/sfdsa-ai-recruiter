import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Top Recruit Awards - SF Deputy Sheriff Recruitment",
  description: "View the top recruits and applicants for the San Francisco Sheriff's Office.",
}

export default function AwardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="awards-page-container">{children}</div>
}