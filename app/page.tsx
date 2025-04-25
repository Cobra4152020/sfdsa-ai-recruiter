import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChatButtonSimple } from "@/components/chat/chat-button-simple"

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join the San Francisco Deputy Sheriff's Office</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Serve with honor, protect with pride, and make a difference in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link href="/chat">Chat with Sergeant Ken</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join SFSO?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Competitive Salary</h3>
              <p className="text-gray-700">
                Starting at $89,700 annually with regular step increases and opportunities for overtime.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Excellent Benefits</h3>
              <p className="text-gray-700">Comprehensive health coverage, retirement plan, paid vacation, and more.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Career Growth</h3>
              <p className="text-gray-700">
                Numerous opportunities for advancement, specialization, and professional development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Chat with our AI recruitment assistant to get answers about the application process, requirements, and more.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/chat">Chat with Sergeant Ken</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Deputies Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="italic mb-4">
                "Joining the San Francisco Sheriff's Office was the best career decision I've made. The camaraderie,
                benefits, and opportunity to serve my community have been incredibly rewarding."
              </p>
              <p className="font-bold">- Deputy Maria Rodriguez, 5 years of service</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <p className="italic mb-4">
                "I appreciate the work-life balance and the various specialized units available. There's always room to
                grow and develop new skills in this department."
              </p>
              <p className="font-bold">- Deputy James Chen, 8 years of service</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">What are the basic requirements to apply?</h3>
              <p className="text-gray-700">
                Applicants must be at least 21 years old, have a high school diploma or GED, be a U.S. citizen or
                permanent resident alien who has applied for citizenship, and have no felony convictions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">What is the application process like?</h3>
              <p className="text-gray-700">
                The process includes a written exam, physical abilities test, background investigation, medical
                examination, psychological evaluation, and an interview. Successful candidates then attend the Sheriff's
                Academy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Do I need prior law enforcement experience?</h3>
              <p className="text-gray-700">
                No, prior law enforcement experience is not required. The academy provides all necessary training,
                though military or security experience can be beneficial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Button */}
      <ChatButtonSimple />
    </main>
  )
}
