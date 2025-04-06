"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserData } from "@/lib/db-service"

interface UserContextType {
  currentUser: UserData | null
  setUserInfo: (name: string, email: string, phone: string, isApplying?: boolean) => Promise<UserData>
  incrementParticipation: () => Promise<void>
  markAsApplied: () => Promise<void>
  incrementReferralCount: () => Promise<void>
  isLoggedIn: boolean
  isInitialized: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  // Add a flag to track if we've already redirected
  const [hasRedirected, setHasRedirected] = useState(false)
  // Add a flag to prevent multiple redirects
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          // Ensure user has at least 1 participation count
          if (!user.participationCount || user.participationCount < 1) {
            user.participationCount = 1
          }
          setCurrentUser(user)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
      setIsInitialized(true)
    }

    // Load immediately on mount
    loadUserData()

    // Also set up an event listener for storage changes (in case of multiple tabs)
    window.addEventListener("storage", loadUserData)

    return () => {
      window.removeEventListener("storage", loadUserData)
    }
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
      } catch (error) {
        console.error("Error saving user data:", error)
      }
    }
  }, [currentUser])

  // Set user info - now using the API route instead of direct DB access
  const setUserInfo = async (name: string, email: string, phone: string, isApplying = false): Promise<UserData> => {
    try {
      console.log("Starting user registration with API route:", { name, email, phone, isApplying })

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          isApplying,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to register user")
      }

      const data = await response.json()

      if (!data.success || !data.user) {
        throw new Error("Failed to register user")
      }

      // Ensure user has at least 1 participation count
      const userData = {
        ...data.user,
        participationCount: Math.max(data.user.participationCount || 0, 1),
      }

      setCurrentUser(userData)
      setIsLoggedIn(true)

      // Set the redirect flag to prevent multiple redirects
      setHasRedirected(true)

      return userData
    } catch (error) {
      console.error("Error in setUserInfo:", error)
      throw error
    }
  }

  // Increment participation - this should also be moved to an API route
  const incrementParticipation = async () => {
    if (currentUser) {
      try {
        const response = await fetch("/api/participation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setCurrentUser(data.user)
          }
        } else {
          // If API call fails, still increment locally to ensure UI updates
          setCurrentUser((prev) => {
            if (!prev) return prev
            const newCount = (prev.participationCount || 0) + 1
            return {
              ...prev,
              participationCount: newCount,
            }
          })
        }
      } catch (error) {
        console.error("Error incrementing participation:", error)
        // Still increment locally on error
        setCurrentUser((prev) => {
          if (!prev) return prev
          const newCount = (prev.participationCount || 0) + 1
          return {
            ...prev,
            participationCount: newCount,
          }
        })
      }
    }
  }

  // Mark as applied - this should also be moved to an API route
  const markAsApplied = async () => {
    if (currentUser) {
      try {
        const response = await fetch("/api/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setCurrentUser(data.user)
          }
        } else {
          // If API call fails, still update locally
          setCurrentUser((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              hasApplied: true,
            }
          })
        }
      } catch (error) {
        console.error("Error marking as applied:", error)
        // Still update locally on error
        setCurrentUser((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            hasApplied: true,
          }
        })
      }
    }
  }

  // Increment referral count - this should also be moved to an API route
  const incrementReferralCount = async () => {
    if (currentUser) {
      try {
        const response = await fetch("/api/referral", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setCurrentUser(data.user)
          }
        }
      } catch (error) {
        console.error("Error incrementing referral count:", error)
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setUserInfo,
        incrementParticipation,
        markAsApplied,
        incrementReferralCount,
        isLoggedIn,
        isInitialized,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}