interface ApplicationStatusTemplateProps {
    recipientName: string
    statusUpdate: string
    nextSteps: string[]
    dashboardUrl: string
  }
  
  export function applicationStatus({
    recipientName,
    statusUpdate,
    nextSteps,
    dashboardUrl,
  }: ApplicationStatusTemplateProps): string {
    const nextStepsHtml = nextSteps.length
      ? `
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="font-size: 16px; margin: 0 0 10px 0;"><strong>Next Steps:</strong></p>
          <ul style="margin: 0; padding-left: 20px;">
            ${nextSteps.map((step) => `<li style="font-size: 16px; margin-bottom: 5px;">${step}</li>`).join("")}
          </ul>
        </div>
      `
      : ""
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #0A3C1F; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0;">Application Status Update</h1>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">Hello ${recipientName},</p>
          
          <p style="font-size: 16px; line-height: 1.5;">We have an update regarding your application to the San Francisco Deputy Sheriff's Department:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;"><strong>Status Update:</strong> ${statusUpdate}</p>
          </div>
          
          ${nextStepsHtml}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background-color: #0A3C1F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Application Status</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions, please contact our recruitment team.</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Best regards,<br>SF Deputy Sheriff Recruitment Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} San Francisco Deputy Sheriff's Association. All rights reserved.</p>
        </div>
      </div>
    `
  }
  