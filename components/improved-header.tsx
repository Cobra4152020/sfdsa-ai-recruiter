"use client"

import { useState, useEffect } from "react"
import { Menu, X, Shield, Sun, Moon, Home, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { UserProfile } from "@/components/user-profile"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ImprovedHeaderProps {
  showOptInForm: () => void
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isLoggedIn } = useUser()
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A3C1F]/95 dark:bg-black/95 backdrop-blur-md py-2 shadow-lg"
          : "bg-[#0A3C1F]/80 dark:bg-black/80 backdrop-blur-sm py-2"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top row with logo and theme toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </Link>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row with navigation and buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {!isHomePage && (
              <Link href="/" className="text-white hover:text-[#FFD700] transition-colors flex items-center">
                <Home className="h-4 w-4 mr-1" /> Home
              </Link>
            )}
            <Link href="/awards" className="text-white hover:text-[#FFD700] transition-colors">
              Top Recruit Awards
            </Link>
            <Link
              href="/practice-tests"
              className="text-white hover:text-[#FFD700] transition-colors flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-1" /> Practice Tests
            </Link>
            <Link href="/gi-bill" className="text-white hover:text-[#FFD700] transition-colors">
              G.I. Bill
            </Link>
            <Link href="/discounted-housing" className="text-white hover:text-[#FFD700] transition-colors">
              Discounted Housing
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4 mt-2 md:mt-0">
            {isLoggedIn ? (
              <UserProfile />
            ) : (
              <Button
                onClick={showOptInForm}
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-medium"
              >
                Sign Up
              </Button>
            )}

            <Button onClick={showOptInForm} className="bg-white hover:bg-white/90 text-[#0A3C1F] font-medium">
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0A3C1F] dark:bg-black border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {!isHomePage && (
                  <Link
                    href="/"
                    className="text-white hover:text-[#FFD700] py-2 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-2" /> Home
                  </Link>
                )}
                <Link
                  href="/awards"
                  className="text-white hover:text-[#FFD700] py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Top Recruit Awards
                </Link>
                <Link
                  href="/practice-tests"
                  className="text-white hover:text-[#FFD700] py-2 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4 mr-2" /> Practice Tests
                </Link>
                <Link
                  href="/gi-bill"
                  className="text-white hover:text-[#FFD700] py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  G.I. Bill
                </Link>
                <Link
                  href="/discounted-housing"
                  className="text-white hover:text-[#FFD700] py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Discounted Housing
                </Link>

                <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                  {isLoggedIn ? (
                    <div className="py-2">
                      <UserProfile />
                    </div>
                  ) : (
                    <Button
                      onClick={showOptInForm}
                      className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-medium w-full"
                    >
                      Sign Up
                    </Button>
                  )}

                  <Button
                    onClick={showOptInForm}
                    className="bg-white hover:bg-white/90 text-[#0A3C1F] font-medium w-full"
                  >
                    Apply Now
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

