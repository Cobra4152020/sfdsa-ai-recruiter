// User notification email template

interface UserNotificationData {
    userName: string
    userEmail: string
    userPhone?: string
    hasApplied: boolean
    signupDate: string | Date
  }
  
  export function userNotificationTemplate(data: UserNotificationData): string {
    const { userName, userEmail, userPhone, hasApplied, signupDate } = data
    const formattedDate = new Date(signupDate).toLocaleString()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sfdsa-ai-recruiter.vercel.app"
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/images/logo.png" alt="SF Sheriff Logo" style="max-width: 150px; margin-bottom: 15px;">
          <h1 style="color: #0A3C1F;">${hasApplied ? "New Application Submission" : "New Signup"}</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #0A3C1F; margin-top: 0;">User Information</h2>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Phone:</strong> ${userPhone || "Not provided"}</p>
          <p><strong>Status:</strong> ${hasApplied ? "Applied" : "Signed up"}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>This user has ${hasApplied ? "submitted an application" : "signed up for more information"} about joining the San Francisco Sheriff's Office.</p>
          <p>Please follow up with them at your earliest convenience.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${baseUrl}/admin" style="background-color: #0A3C1F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Admin Dashboard</a>
        </div>
        
        <div style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          <p>This is an automated message from the SF Sheriff Recruitment System.</p>
          <p>San Francisco Sheriff's Office | (415) 554-7225 | recruitment@sfsheriff.com</p>
        </div>
      </div>
    `
  }
  