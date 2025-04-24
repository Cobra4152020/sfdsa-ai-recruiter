import { NextResponse } from "next/server"
import { sendEmail, validateEmail } from "@/lib/sendplus"
import { badgeNotificationTemplate } from "@/lib/email-templates/badge-notification"

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { recipientEmail, userName, badgeName, badgeDescription, badgeShareMessage, badgeImageUrl } = body

    // Validate required fields
    if (!recipientEmail || !userName || !badgeName || !badgeDescription) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate email address
    if (!validateEmail(recipientEmail)) {
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 })
    }

    // Create email content using template
    const htmlContent = badgeNotificationTemplate({
      userName,
      badgeName,
      badgeDescription,
      badgeShareMessage: badgeShareMessage || "Keep up the great work!",
      badgeImageUrl,
    })

    // Send email
    const success = await sendEmail({
      to: { email: recipientEmail },
      subject: `Congratulations! You've earned the ${badgeName} badge - SF Sheriff Recruitment`,
      htmlContent,
    })

    if (!success) {
      throw new Error("Failed to send badge notification email")
    }

    return NextResponse.json({
      success: true,
      message: "Badge notification email sent successfully",
    })
  } catch (error) {
    console.error("Error sending badge notification email:", error)
    return NextResponse.json({ success: false, message: "Failed to send badge notification email" }, { status: 500 })
  }
}
