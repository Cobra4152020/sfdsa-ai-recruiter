interface WelcomeTemplateProps {
    recipientName: string
    dashboardUrl: string
  }
  
  export function welcome({ recipientName, dashboardUrl }: WelcomeTemplateProps): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #0A3C1F; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to SF Deputy Sheriff Recruitment!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">Hello ${recipientName},</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Thank you for joining the San Francisco Deputy Sheriff recruitment platform. We're excited to have you on board!</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Our platform is designed to help you navigate the recruitment process with ease. Here's what you can do:</p>
          
          <ul style="font-size: 16px; line-height: 1.5;">
            <li>Track your application progress</li>
            <li>Earn badges for completing various steps</li>
            <li>Access resources to help you prepare</li>
            <li>Connect with recruitment officers</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background-color: #0A3C1F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Your Dashboard</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions, please don't hesitate to reach out to our recruitment team.</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Best regards,<br>SF Deputy Sheriff Recruitment Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} San Francisco Deputy Sheriff's Association. All rights reserved.</p>
        </div>
      </div>
    `
  }
  