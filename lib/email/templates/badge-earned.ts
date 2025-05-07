interface BadgeEarnedTemplateProps {
    recipientName: string
    badgeName: string
    badgeDescription: string
    badgeShareMessage?: string
    badgeUrl: string
  }
  
  export function badgeEarned({
    recipientName,
    badgeName,
    badgeDescription,
    badgeShareMessage = "Check out my new badge!",
    badgeUrl,
  }: BadgeEarnedTemplateProps): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #0A3C1F; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0;">Congratulations, ${recipientName}!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">You've earned the <strong>${badgeName}</strong> badge!</p>
          
          <p style="font-size: 16px; line-height: 1.5;">${badgeDescription}</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0 0 10px 0;"><strong>Share your achievement:</strong></p>
            <p style="font-size: 16px; margin: 0; font-style: italic;">"${badgeShareMessage}"</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${badgeUrl}" style="background-color: #0A3C1F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Badge</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Keep up the great work!</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Regards,<br>SF Deputy Sheriff Recruitment Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} San Francisco Deputy Sheriff's Association. All rights reserved.</p>
        </div>
      </div>
    `
  }
  