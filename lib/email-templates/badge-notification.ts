// Badge notification email template

interface BadgeNotificationData {
    userName: string
    badgeName: string
    badgeDescription: string
    badgeShareMessage: string
    badgeImageUrl?: string
  }
  
  export function badgeNotificationTemplate(data: BadgeNotificationData): string {
    const { userName, badgeName, badgeDescription, badgeShareMessage, badgeImageUrl } = data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sfdsa-ai-recruiter.vercel.app"
  
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${baseUrl}/images/logo.png" alt="SF Sheriff Logo" style="max-width: 150px; margin-bottom: 15px;">
          <h1 style="color: #0A3C1F;">Congratulations, ${userName}!</h1>
          <p style="font-size: 18px;">You've earned a new badge</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
          ${
            badgeImageUrl
              ? `<img src="${badgeImageUrl}" alt="${badgeName}" style="width: 100px; height: 100px; margin-bottom: 15px;">`
              : `<div style="width: 80px; height: 80px; background-color: #0A3C1F; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #FFD700; font-size: 36px;">🏆</span>
                </div>`
          }
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
        
        <div style="text-align: center; margin-top: 20px;">
          <p>Share your achievement:</p>
          <div style="margin-top: 10px;">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/awards`)}" target="_blank" style="display: inline-block; margin: 0 5px;">
              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" style="width: 32px; height: 32px;">
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`I earned the ${badgeName} badge with the San Francisco Sheriff's Office! ${badgeShareMessage}`)}&url=${encodeURIComponent(`${baseUrl}/awards`)}" target="_blank" style="display: inline-block; margin: 0 5px;">
              <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter" style="width: 32px; height: 32px;">
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseUrl}/awards`)}" target="_blank" style="display: inline-block; margin: 0 5px;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 32px; height: 32px;">
            </a>
          </div>
        </div>
        
        <div style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          <p>This is an automated message from the SF Sheriff Recruitment System.</p>
          <p>San Francisco Sheriff's Office | (415) 554-7225 | recruitment@sfsheriff.com</p>
        </div>
      </div>
    `
  }
  