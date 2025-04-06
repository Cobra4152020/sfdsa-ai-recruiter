import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Application Submitted - SF Deputy Sheriff Recruitment",
  description: "Your application to the San Francisco Sheriff's Office has been successfully submitted.",
}

export default function SuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="success-page-container">{children}</div>
}