/**
 * Accessibility utility functions
 */

// Function to announce messages to screen readers
export function announceToScreenReader(message: string, politeness: "polite" | "assertive" = "polite") {
    // Create an aria-live region if it doesn't exist
    let announcer = document.getElementById("screen-reader-announcer")
  
    if (!announcer) {
      announcer = document.createElement("div")
      announcer.id = "screen-reader-announcer"
      announcer.setAttribute("aria-live", politeness)
      announcer.setAttribute("aria-atomic", "true")
      announcer.classList.add("sr-only") // Visually hidden
      document.body.appendChild(announcer)
    }
  
    // Set the message
    announcer.textContent = message
  
    // Clear the announcer after a delay to prevent multiple announcements
    setTimeout(() => {
      announcer.textContent = ""
    }, 3000)
  }
  
  // Function to trap focus within an element (for modals, dialogs, etc.)
  export function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    )
  
    if (focusableElements.length === 0) return
  
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
  
    // Focus the first element
    firstElement.focus()
  
    // Handle tab key to trap focus
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return
  
      if (e.shiftKey) {
        // Shift + Tab: If focus is on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: If focus is on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  
    element.addEventListener("keydown", handleKeyDown)
  
    // Return cleanup function
    return () => {
      element.removeEventListener("keydown", handleKeyDown)
    }
  }
  
  // Function to check color contrast
  export function checkContrast(foreground: string, background: string): number {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 }
    }
  
    // Calculate relative luminance
    const luminance = (rgb: { r: number; g: number; b: number }) => {
      const a = [rgb.r, rgb.g, rgb.b].map((v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      })
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
    }
  
    const rgb1 = hexToRgb(foreground)
    const rgb2 = hexToRgb(background)
    const l1 = luminance(rgb1)
    const l2 = luminance(rgb2)
  
    // Calculate contrast ratio
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  
    return Number.parseFloat(ratio.toFixed(2))
  }
  
  // CSS class for visually hiding elements but keeping them accessible to screen readers
  export const srOnlyStyles = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0",
  }
  