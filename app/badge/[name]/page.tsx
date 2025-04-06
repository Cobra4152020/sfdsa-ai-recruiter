import { RecruitmentBadge } from "@/components/recruitment-badge"
import { ImprovedHeader } from "@/components/improved-header"
import { ImprovedFooter } from "@/components/improved-footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserProvider } from "@/context/user-context"

export default function BadgePage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name)

  // Meta tags for social sharing
  const title = `${decodedName}'s SF Sheriff Recruitment Badge`
  const description = "Join the San Francisco Sheriff's Office and start a rewarding career in law enforcement."

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </head>

        <ImprovedHeader showOptInForm={() => {}} />

        <main className="flex-1 pt-40 pb-12 bg-[#F8F5EE] dark:bg-[#121212]">
          <div className="container mx-auto px-4">
            <Link href="/">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                {decodedName}'s Recruitment Badge
              </h1>
              <p className="text-lg text-[#0A3C1F]/70 dark:text-white/70">
                {decodedName} is exploring a career with the San Francisco Sheriff's Office. Join them and discover
                opportunities in law enforcement!
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <RecruitmentBadge userName={decodedName} size="lg" />

              <div className="mt-12 max-w-xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4 text-[#0A3C1F] dark:text-[#FFD700]">
                  Join the San Francisco Sheriff's Office
                </h2>
                <p className="text-[#0A3C1F]/70 dark:text-white/70 mb-6">
                  Discover a rewarding career with competitive pay, excellent benefits, and opportunities for
                  advancement. Make a difference in your community every day.
                </p>

                <Link href="/">
                  <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold px-8 py-3 rounded-xl text-lg shadow-lg">
                    Learn More & Apply
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <ImprovedFooter />
      </div>
    </UserProvider>
  )
}