"use client"

import { RecruitmentBadge } from "@/components/recruitment-badge"

export default function BadgeExamples() {
  return (
    <div className="p-8 bg-[#F8F5EE] dark:bg-[#121212] space-y-12">
      {/* Small Badge */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Small Badge</h2>
        <RecruitmentBadge userName="John Smith" size="sm" showShareOptions={false} />
      </div>

      {/* Medium Badge (Default) */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Medium Badge (Default)</h2>
        <RecruitmentBadge userName="Maria Rodriguez" />
      </div>

      {/* Large Badge */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Large Badge</h2>
        <RecruitmentBadge userName="David Johnson" size="lg" />
      </div>

      {/* Badge for Applicant */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">Badge for Applicant</h2>
        <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-xl shadow-lg">
          <h3 className="text-center text-lg font-semibold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
            Congratulations on Applying!
          </h3>
          <RecruitmentBadge userName="Alex Williams" size="md" />
          <p className="text-center mt-4 text-[#0A3C1F]/70 dark:text-white/70">
            Share your badge to inspire others to join the San Francisco Sheriff's Office.
          </p>
        </div>
      </div>
    </div>
  )
}

