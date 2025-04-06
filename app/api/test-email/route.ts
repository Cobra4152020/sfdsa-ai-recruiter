import { NextResponse } from "next/server"
import { sendEmail, createNotificationEmailContent } from "@/lib/sendplus"

export async function GET(request: Request) {
  try {
    // Only allow this in development environment
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, message: "This endpoint is only available in development mode" },
        { status: 403 },
      )
    }

    const recipientEmail = "kennethlomba@gmail.com"

    // Create test email content
    const htmlContent = createNotificationEmailContent(
      "Test User",
      "test@example.com",
      "(123) 456-7890",
      false, // Not applied
      new Date(),
    )

    // Send test email using SendPlus
    const success = await sendEmail({
      to: { email: recipientEmail },
      subject: "Test Email - SF Sheriff Recruitment",
      htmlContent,
    })

    if (!success) {
      throw new Error("Failed to send test email via SendPlus")
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully to " + recipientEmail,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send test email: " + (error as Error).message },
      { status: 500 },
    )
  }
}

