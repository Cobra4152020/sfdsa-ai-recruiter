import Link from "next/link"
import { Shield, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react"

export function ImprovedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A3C1F] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center mb-4" aria-label="SF Deputy Sheriff AI Recruitment - Home">
              <Shield className="h-8 w-8 text-[#FFD700] mr-2" aria-hidden="true" />
              <div>
                <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
                <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm">
              Join the San Francisco Deputy Sheriff's Department and make a difference in your community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-gray-300 hover:text-white transition-colors">
                  Top Recruit Awards
                </Link>
              </li>
              <li>
                <Link href="/practice-tests" className="text-gray-300 hover:text-white transition-colors">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/gi-bill" className="text-gray-300 hover:text-white transition-colors">
                  G.I. Bill
                </Link>
              </li>
              <li>
                <Link href="/discounted-housing" className="text-gray-300 hover:text-white transition-colors">
                  Discounted Housing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="text-gray-300 hover:text-white transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-gray-300 hover:text-white transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-gray-300 hover:text-white transition-colors">
                  Training Academy
                </Link>
              </li>
              <li>
                <Link href="/career-path" className="text-gray-300 hover:text-white transition-colors">
                  Career Path
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-[#FFD700]" />
                <a href="tel:+14155541234" className="text-gray-300 hover:text-white transition-colors">
                  (415) 554-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-[#FFD700]" />
                <a
                  href="mailto:recruitment@sfdeputysheriff.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  recruitment@sfdeputysheriff.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-[#FFD700]">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-300">
            © {currentYear} San Francisco Deputy Sheriff's Association. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
