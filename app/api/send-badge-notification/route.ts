import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/sendplus"

export async function POST(request: Request) {
  try {
    const { recipientEmail, userName, badgeName, badgeDescription, badgeShareMessage } = await request.json()

    // Create email content
    const htmlContent = createBadgeNotificationEmailContent(userName, badgeName, badgeDescription, badgeShareMessage)

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
      subject: `Congratulations! You've earned the ${badgeName} badge - SF Sheriff Recruitment`,
      htmlContent,
    })

    if (!success) {
      throw new Error("Failed to send email via SendPlus")
    }

    return NextResponse.json({ success: true, message: "Badge notification email sent successfully" })
  } catch (error) {
    console.error("Error sending badge notification email:", error)
    return NextResponse.json({ success: false, message: "Failed to send badge notification email" }, { status: 500 })
  }
}

function createBadgeNotificationEmailContent(
  userName: string,
  badgeName: string,
  badgeDescription: string,
  badgeShareMessage: string,
): string {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0A3C1F;">Congratulations, ${userName}!</h1>
        <p style="font-size: 18px;">You've earned a new badge</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: #0A3C1F; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: #FFD700; font-size: 36px;">🏆</span>
        </div>
        <h2 style="color: #0A3C1F; margin-top: 0;">${badgeName}</h2>
        <p>${badgeDescription}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>${badgeShareMessage}</p>
        <p>Share your achievement with others and encourage them to explore opportunities with the San Francisco Sheriff's Office.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${baseUrl}/awards" style="background-color: #0A3C1F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Badges</a>
      </div>
      
      <div style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
        <p>This is an automated message from the SF Sheriff Recruitment System.</p>
        <p>San Francisco Sheriff's Office | (415) 554-7225 | recruitment@sfsheriff.com</p>
      </div>
    </div>
  `
}

