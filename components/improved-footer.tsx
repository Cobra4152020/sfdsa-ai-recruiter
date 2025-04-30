"use client"

import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"

export function ImprovedFooter() {
  return (
    <footer className="bg-[#0A3C1F] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold mb-4">SF Deputy Sheriff</h3>
            <p className="text-gray-300 mb-4">
              Join the San Francisco Sheriff's Office and become part of a team dedicated to public safety and community
              service.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/SanFranciscoDeputySheriffsAssociation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#FFD700] transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://x.com/sanfranciscodsa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-[#FFD700] transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCgyW7q86c-Mua4bS1a9wBWA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-[#FFD700] transition-colors"
              >
                <Youtube size={24} />
              </a>
              <a
                href="https://www.instagram.com/sfdeputysheriffsassociation/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#FFD700] transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs%E2%80%99-association"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-[#FFD700] transition-colors"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>San Francisco Sheriff's Office</p>
              <p>City Hall, Room 456</p>
              <p>1 Dr. Carlton B. Goodlett Place</p>
              <p>San Francisco, CA 94102</p>
              <p className="mt-2">
                <strong>Phone:</strong> (415) 554-7225
              </p>
              <p>
                <strong>Email:</strong> recruitment@sfsheriff.com
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} San Francisco Deputy Sheriff. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:text-[#FFD700] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#FFD700] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-[#FFD700] transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
