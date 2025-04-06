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

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          const user = JSON.parse(savedUser)
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

      setCurrentUser(data.user)
      setIsLoggedIn(true)
      return data.user
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
        }
      } catch (error) {
        console.error("Error incrementing participation:", error)
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
        }
      } catch (error) {
        console.error("Error marking as applied:", error)
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