import { Shield, Facebook, Twitter, Instagram, Youtube, Mail, Phone, BookOpen, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

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
              <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#benefits" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="/#testimonials" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/awards" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Top Recruit Awards
                </a>
              </li>
              <li>
                <a
                  href="/practice-tests"
                  className="text-white/70 hover:text-[#FFD700] transition-colors flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-1" /> Practice Tests
                </a>
              </li>
              <li>
                <a href="/gi-bill" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  G.I. Bill
                </a>
              </li>
              <li>
                <a href="/discounted-housing" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Discounted Housing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/practice-tests"
                  className="text-white/70 hover:text-[#FFD700] transition-colors flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-1" /> Practice Tests
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Application Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Fitness Standards
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Academy Information
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Career Paths
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#FFD700] transition-colors">
                  Testimonials
                </a>
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
              <a href="/#chat-section">
                <Button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-bold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat with Sgt. Ken
                </Button>
              </a>
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