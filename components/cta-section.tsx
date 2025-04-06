import { ArrowRight } from "lucide-react"
import { ConfettiButton } from "@/components/confetti-button"
import { SocialShare } from "@/components/social-share"

interface CTASectionProps {
  showOptInForm: () => void
}

export function CTASection({ showOptInForm }: CTASectionProps) {
  // Get the base URL for sharing
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div className="bg-[#0A3C1F] dark:bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to <span className="text-[#FFD700]">Make a Difference?</span>
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join our team of dedicated professionals and start a rewarding career with the San Francisco Sheriff's
            Office today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConfettiButton
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold px-8 py-3 rounded-xl text-lg shadow-lg transform transition-transform hover:scale-105 min-w-[200px] flex items-center justify-center"
              showOptInForm={showOptInForm}
            >
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </ConfettiButton>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <p className="text-white/80 mb-4">Share this opportunity with others:</p>
            <SocialShare
              url={baseUrl}
              title="Join the San Francisco Sheriff's Office - Now Hiring!"
              description="Discover a rewarding career with competitive pay, excellent benefits, and opportunities for advancement."
              showLabel={true}
            />
          </div>

          <p className="mt-8 text-white/60 text-sm">
            Questions? Contact our recruitment team at{" "}
            <a href="mailto:recruitment@sfsheriff.com" className="text-[#FFD700] hover:underline">
              recruitment@sfsheriff.com
            </a>{" "}
            or call{" "}
            <a href="tel:+14155547225" className="text-[#FFD700] hover:underline">
              (415) 554-7225
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

