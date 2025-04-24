"use client"

import type React from "react"

import { useState } from "react"

export function SkipToContent() {
  const [isFocused, setIsFocused] = useState(false)

  // Handle skip link click
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Find the main content element
    const mainContent = document.getElementById("main-content")

    if (mainContent) {
      // Set tabindex to make it focusable
      mainContent.setAttribute("tabindex", "-1")
      mainContent.focus()

      // Remove tabindex after blur
      mainContent.addEventListener(
        "blur",
        () => {
          mainContent.removeAttribute("tabindex")
        },
        { once: true },
      )
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        ${!isFocused ? "sr-only" : ""}
        bg-[#0A3C1F] text-white dark:bg-[#FFD700] dark:text-black
        px-4 py-3 absolute top-2 left-2 z-50
        focus:outline-none focus:ring-2 focus:ring-[#FFD700] dark:focus:ring-[#0A3C1F]
        transition-transform
        ${isFocused ? "transform-none" : "transform -translate-y-full"}
      `}
    >
      Skip to main content
    </a>
  )
}
