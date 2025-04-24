// SendPlus email service utility
import { userNotificationTemplate } from "./email-templates/user-notification"
import { badgeNotificationTemplate } from "./email-templates/badge-notification"

interface SendPlusRecipient {
  email: string
  name?: string
}

interface SendPlusEmailOptions {
  to: SendPlusRecipient | SendPlusRecipient[]
  subject: string
  htmlContent: string
  textContent?: string
  from?: {
    email: string
    name?: string
  }
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Validates an email address
 * @param email Email address to validate
 * @returns True if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/**
 * Sends an email using SendPlus API with retry logic
 * @param options Email options
 * @returns Promise resolving to true if email was sent successfully, false otherwise
 */
export async function sendEmail(options: SendPlusEmailOptions): Promise<boolean> {
  // Validate email addresses
  const recipients = Array.isArray(options.to) ? options.to : [options.to]
  for (const recipient of recipients) {
    if (!validateEmail(recipient.email)) {
      console.error(`Invalid email address: ${recipient.email}`)
      return false
    }
  }

  // Retry configuration
  const maxRetries = 3
  const baseDelay = 1000 // 1 second

  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmailAttempt(options)
      if (result) {
        return true
      }

      // If we get here, the send failed but didn't throw an exception
      console.warn(`Email send attempt ${attempt} failed, retrying...`)

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    } catch (error) {
      console.error(`Email send attempt ${attempt} failed with error:`, error)

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  console.error(`Failed to send email after ${maxRetries} attempts`)
  return false
}

/**
 * Single attempt to send an email using SendPlus API
 * @param options Email options
 * @returns Promise resolving to true if email was sent successfully, false otherwise
 */
async function sendEmailAttempt(options: SendPlusEmailOptions): Promise<boolean> {
  try {
    const sendPlusApiId = process.env.SENDPLUS_API_ID
    const sendPlusApiSecret = process.env.SENDPLUS_API_SECRET
    const sendPlusEndpoint = "https://api.sendplus.com/api/v1/email/send" // Replace with actual SendPlus API endpoint

    // Check for SendPlus credentials
    if (!sendPlusApiId || !sendPlusApiSecret) {
      console.warn("SendPlus credentials not available, using mock email service")
      return mockSendEmail(options)
    }

    // Format recipients
    const recipients = Array.isArray(options.to) ? options.to : [options.to]

    // Default sender
    const sender = options.from || {
      email: "noreply@sfsheriffrecruitment.org",
      name: "SF Sheriff Recruitment",
    }

    // Prepare the request payload for SendPlus
    const payload = {
      from: sender,
      to: recipients,
      subject: options.subject,
      html_content: options.htmlContent,
      text_content: options.textContent,
    }

    // Send the email using SendPlus API with ID and Secret authentication
    const response = await fetch(sendPlusEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-ID": sendPlusApiId,
        "X-API-SECRET": sendPlusApiSecret,
      },
      body: JSON.stringify(payload),
      timeout: 10000, // 10 second timeout
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`SendPlus API error: ${JSON.stringify(errorData)}`)
    }

    console.log(`Email sent successfully to ${recipients.map((r) => r.email).join(", ")}`)
    return true
  } catch (error) {
    console.error("Error sending email via SendPlus:", error)
    throw error // Re-throw to allow retry logic to work
  }
}

/**
 * Mock email sending for development/testing
 * @param options Email options
 * @returns Always returns true
 */
function mockSendEmail(options: SendPlusEmailOptions): boolean {
  const recipients = Array.isArray(options.to) ? options.to : [options.to]
  console.log("MOCK EMAIL SERVICE")
  console.log("------------------")
  console.log(`To: ${recipients.map((r) => r.email).join(", ")}`)
  console.log(`Subject: ${options.subject}`)
  console.log("HTML Content Preview:", options.htmlContent.substring(0, 100) + "...")
  console.log("------------------")
  return true
}

// Export template functions for backward compatibility
export { userNotificationTemplate as createNotificationEmailContent }
export { badgeNotificationTemplate as createBadgeNotificationEmailContent }
