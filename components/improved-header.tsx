"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Shield, Sun, Moon, Home, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { UserProfile } from "@/components/user-profile"
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
  const headerRef = useRef<HTMLElement>(null)

  // Effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effect to fix the header spacing issue
  useEffect(() => {
    // Function to apply spacing after the header
    const fixHeaderSpacing = () => {
      if (!headerRef.current) return

      // Get the header height
      const headerHeight = headerRef.current.offsetHeight

      // Set a CSS variable for the header height
      document.documentElement.style.setProperty("--header-height", `${headerHeight}px`)

      // Find the main content element that comes after the header
      const mainContent = document.querySelector("main")
      if (mainContent) {
        // Apply top margin to the main content equal to the header height
        mainContent.style.marginTop = `${headerHeight}px`
      }
    }

    // Run on mount and when menu state changes
    fixHeaderSpacing()

    // Also run on window resize
    window.addEventListener("resize", fixHeaderSpacing)

    // Cleanup
    return () => {
      window.removeEventListener("resize", fixHeaderSpacing)
    }
  }, [isMenuOpen]) // Re-run when menu opens/closes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Direct navigation function - force a full page load
  const goToPage = (path: string) => {
    window.location.href = path
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A3C1F]/95 dark:bg-black/95 backdrop-blur-md py-2 shadow-lg"
          : "bg-[#0A3C1F]/80 dark:bg-black/80 backdrop-blur-sm py-2"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        {/* Top row with logo and theme toggle */}
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              goToPage("/")
            }}
            className="flex items-center"
            aria-label="SF Deputy Sheriff AI Recruitment - Home"
          >
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" aria-hidden="true" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </a>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row with navigation and buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
            {!isHomePage && (
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  goToPage("/")
                }}
                className="text-white hover:text-[#FFD700] transition-colors flex items-center"
              >
                <Home className="h-4 w-4 mr-1" aria-hidden="true" /> Home
              </a>
            )}
            <a
              href="/awards"
              onClick={(e) => {
                e.preventDefault()
                goToPage("/awards")
              }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              Top Recruit Awards
            </a>
            <a
              href="/practice-tests"
              onClick={(e) => {
                e.preventDefault()
                goToPage("/practice-tests")
              }}
              className="text-white hover:text-[#FFD700] transition-colors flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-1" aria-hidden="true" /> Practice Tests
            </a>
            <a
              href="/gi-bill"
              onClick={(e) => {
                e.preventDefault()
                goToPage("/gi-bill")
              }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              G.I. Bill
            </a>
            <a
              href="/discounted-housing"
              onClick={(e) => {
                e.preventDefault()
                goToPage("/discounted-housing")
              }}
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              Discounted Housing
            </a>
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

            <Button
              onClick={showOptInForm}
              className="bg-white hover:bg-white/90 text-[#0A3C1F] font-medium"
              aria-label="Apply now for Deputy Sheriff position"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0A3C1F] dark:bg-black border-t border-white/10"
            aria-label="Mobile Navigation"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {!isHomePage && (
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMenuOpen(false)
                      goToPage("/")
                    }}
                    className="text-white hover:text-[#FFD700] py-2 transition-colors flex items-center"
                  >
                    <Home className="h-4 w-4 mr-2" aria-hidden="true" /> Home
                  </a>
                )}
                <a
                  href="/awards"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    goToPage("/awards")
                  }}
                  className="text-white hover:text-[#FFD700] py-2 transition-colors"
                >
                  Top Recruit Awards
                </a>
                <a
                  href="/practice-tests"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    goToPage("/practice-tests")
                  }}
                  className="text-white hover:text-[#FFD700] py-2 transition-colors flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" /> Practice Tests
                </a>
                <a
                  href="/gi-bill"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    goToPage("/gi-bill")
                  }}
                  className="text-white hover:text-[#FFD700] py-2 transition-colors"
                >
                  G.I. Bill
                </a>
                <a
                  href="/discounted-housing"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    goToPage("/discounted-housing")
                  }}
                  className="text-white hover:text-[#FFD700] py-2 transition-colors"
                >
                  Discounted Housing
                </a>

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
                    aria-label="Apply now for Deputy Sheriff position"
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
