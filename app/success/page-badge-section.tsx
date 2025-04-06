import RecruitmentBadge from "@/components/recruitment-badge"
import SocialShare from "@/components/social-share"

const shareUrl = typeof window !== "undefined" ? window.location.href : ""

export default function PageBadgeSection() {
  return (
    <div className="flex flex-col items-center justify-center">
      <RecruitmentBadge />

      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Share Your Interest</h2>
        <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-4">
          Let your friends and family know about your interest in joining the San Francisco Sheriff's Office.
        </p>

        <div className="flex justify-center mb-8">
          <SocialShare
            url={shareUrl}
            title={`I'm exploring a career with the San Francisco Sheriff's Office!`}
            description="Join me and discover opportunities in law enforcement with the San Francisco Sheriff's Office."
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}

