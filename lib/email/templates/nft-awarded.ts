interface NFTAwardedTemplateProps {
    recipientName: string
    nftName: string
    nftDescription: string
    nftImageUrl: string
    nftViewUrl: string
  }
  
  export function nftAwarded({
    recipientName,
    nftName,
    nftDescription,
    nftImageUrl,
    nftViewUrl,
  }: NFTAwardedTemplateProps): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #0A3C1F; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0;">NFT Award Notification</h1>
        </div>
        
        <div style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5;">Congratulations, ${recipientName}!</p>
          
          <p style="font-size: 16px; line-height: 1.5;">You've been awarded the <strong>${nftName}</strong> NFT!</p>
          
          <p style="font-size: 16px; line-height: 1.5;">${nftDescription}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="${nftImageUrl}" alt="${nftName}" style="max-width: 100%; height: auto; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);" />
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${nftViewUrl}" style="background-color: #0A3C1F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your NFT</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">This NFT is a unique digital asset that recognizes your achievements in the recruitment process.</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Regards,<br>SF Deputy Sheriff Recruitment Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} San Francisco Deputy Sheriff's Association. All rights reserved.</p>
        </div>
      </div>
    `
  }
  