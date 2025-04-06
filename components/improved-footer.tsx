import { Shield, Facebook, Twitter, Instagram, Youtube, Mail, Phone, BookOpen } from "lucide-react"
import Link from "next/link"
import { ChatButton } from "@/components/chat-button"

export function ImprovedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A3C1F] dark:bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-[#FFD700] mr-2" />
              <div>
                <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
                <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
              </div>
            </div>
            <p className="text-white/70 mb-4">
              We are dedicated to recruiting qualified individuals who are committed to public service and safety.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#benefits"
                  className="text-white/70 hover:text-[#FFD700] transition-colors"
                  prefetch={false}
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-white/70 hover:text-[#FFD700] transition-colors"
                  prefetch={false}
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Top Recruit Awards
                </Link>
              </li>
              <li>
                <Link
                  href="/practice-tests"
                  className="text-white/70 hover:text-[#FFD700] transition-colors flex items-center"
                  prefetch={false}
                >
                  <BookOpen className="h-4 w-4 mr-1" /> Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/gi-bill" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  G.I. Bill
                </Link>
              </li>
              <li>
                <Link
                  href="/discounted-housing"
                  className="text-white/70 hover:text-[#FFD700] transition-colors"
                  prefetch={false}
                >
                  Discounted Housing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/practice-tests"
                  className="text-white/70 hover:text-[#FFD700] transition-colors flex items-center"
                  prefetch={false}
                >
                  <BookOpen className="h-4 w-4 mr-1" /> Practice Tests
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Application Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Fitness Standards
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Academy Information
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Career Paths
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#FFD700] transition-colors" prefetch={false}>
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Contact Us</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-[#FFD700]" />
                <a
                  href="mailto:recruitment@sfsheriff.com"
                  className="text-white/70 hover:text-[#FFD700] transition-colors"
                >
                  recruitment@sfsheriff.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-[#FFD700]" />
                <a href="tel:+14155547225" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  (415) 554-7225
                </a>
              </li>
            </ul>

            {/* Chat with Sgt. Ken button */}
            <div className="mt-4">
              <ChatButton variant="accent" message="Chat with Sgt. Ken" className="w-full" showArrow />
              <p className="text-xs text-white/50 mt-2 text-center">
                Have questions? Our AI recruitment officer is available 24/7
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          <p>&copy; {currentYear} San Francisco Deputy Sheriff's Office. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}