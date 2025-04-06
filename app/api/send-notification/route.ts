import { NextResponse } from "next/server"
import { sendEmail, createNotificationEmailContent } from "@/lib/sendplus"

export async function POST(request: Request) {
  try {
    const { recipientEmail, userName, userEmail, userPhone, hasApplied, signupDate } = await request.json()

    // Create email content
    const htmlContent = createNotificationEmailContent(userName, userEmail, userPhone, hasApplied, signupDate)

    // Check if SendPlus credentials are available
    if (!process.env.SENDPLUS_API_ID || !process.env.SENDPLUS_API_SECRET) {
      console.warn("SendPlus credentials not available. Email would be sent to:", recipientEmail)
      return NextResponse.json({
        success: true,
        message: "Mock notification: Email would be sent in production environment",
        mock: true,
      })
    }

    // Send email using SendPlus
    const success = await sendEmail({
      to: { email: recipientEmail },
      subject: hasApplied
        ? "New Application Submission - SF Sheriff Recruitment"
        : "New Signup - SF Sheriff Recruitment",
      htmlContent,
    })

    if (!success) {
      throw new Error("Failed to send email via SendPlus")
    }

    return NextResponse.json({ success: true, message: "Notification email sent successfully" })
  } catch (error) {
    console.error("Error sending notification email:", error)
    return NextResponse.json({ success: false, message: "Failed to send notification email" }, { status: 500 })
  }
}

