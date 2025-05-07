import { Suspense } from "react"
import { BadgeShowcase } from "@/components/badge-showcase"
import { Leaderboard } from "@/components/leaderboard"
import { PointSystemExplanation } from "@/components/point-system-explanation"

export const metadata = {
  title: "Awards & Recognition | SF Deputy Sheriff Recruitment",
  description: "Explore the awards and recognition system for SF Deputy Sheriff recruitment candidates.",
}

export default function AwardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Awards & Recognition</h1>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badge Showcase</h2>
          <Suspense fallback={<div>Loading badges...</div>}>
            <BadgeShowcase />
          </Suspense>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <Suspense fallback={<div>Loading leaderboard...</div>}>
            <Leaderboard />
          </Suspense>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Point System</h2>
          <PointSystemExplanation />
        </section>
      </div>
    </div>
  )
}
