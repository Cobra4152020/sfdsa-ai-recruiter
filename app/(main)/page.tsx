import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Award, BookOpen, Home, DollarSign, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0A3C1F]">
              Join the San Francisco Deputy Sheriff's Department
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Make a difference in your community. We're looking for dedicated individuals to join our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" asChild>
                <Link href="/apply">Apply Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F] hover:bg-[#0A3C1F]/10"
                asChild
              >
                <Link href="/requirements">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/diverse-group-brainstorming.png"
              alt="San Francisco Deputy Sheriffs working together"
              fill
              style={{ objectFit: "cover" }}
              priority
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-lg my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#0A3C1F]">Why Join Us?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The San Francisco Deputy Sheriff's Department offers a rewarding career with excellent benefits and
            opportunities for growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-[#0A3C1F] mb-2" />
              <CardTitle>Competitive Salary</CardTitle>
              <CardDescription>
                Starting salary of $80,000+ with regular increases and overtime opportunities.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/benefits" className="text-[#0A3C1F] hover:underline inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-[#0A3C1F] mb-2" />
              <CardTitle>Training & Development</CardTitle>
              <CardDescription>
                Comprehensive training academy and ongoing professional development opportunities.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/training" className="text-[#0A3C1F] hover:underline inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Home className="h-10 w-10 text-[#0A3C1F] mb-2" />
              <CardTitle>Housing Benefits</CardTitle>
              <CardDescription>
                Access to discounted housing programs for law enforcement officers in San Francisco.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/discounted-housing" className="text-[#0A3C1F] hover:underline inline-flex items-center">
                Learn more <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/abstract-geometric-shapes.png"
              alt="Top Recruit Awards"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center mb-4">
              <Award className="h-8 w-8 text-[#FFD700] mr-2" />
              <h2 className="text-3xl font-bold text-[#0A3C1F]">Top Recruit Awards</h2>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              Our recruitment platform recognizes top performers with badges and awards. Track your progress, earn
              recognition, and stand out in the application process.
            </p>
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" asChild>
              <Link href="/awards">View Awards</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 my-12 bg-[#0A3C1F] text-white rounded-lg">
        <div className="text-center max-w-3xl mx-auto px-4">
          <Shield className="h-16 w-16 text-[#FFD700] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Serve Your Community?</h2>
          <p className="text-lg mb-8">
            Join the San Francisco Deputy Sheriff's Department and be part of a team dedicated to public safety and
            community service.
          </p>
          <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold" asChild>
            <Link href="/apply">Apply Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
