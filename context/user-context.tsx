"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type UserData, dbService } from "@/lib/db-service"

interface UserContextType {
  currentUser: UserData | null
  setUserInfo: (name: string, email: string, phone: string) => Promise<UserData>
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

  // Set user info
  const setUserInfo = async (name: string, email: string, phone: string): Promise<UserData> => {
    const userData = await dbService.upsertUser({
      name,
      email,
      phone,
      id: currentUser?.id,
      participationCount: currentUser?.participationCount || 0,
      hasApplied: currentUser?.hasApplied || false,
      createdAt: currentUser?.createdAt || new Date(),
    })

    setCurrentUser(userData)
    setIsLoggedIn(true)
    return userData
  }

  // Increment participation
  const incrementParticipation = async () => {
    if (currentUser) {
      const updated = await dbService.incrementParticipation(currentUser.id)
      if (updated) {
        setCurrentUser(updated)
      }
    }
  }

  // Mark as applied
  const markAsApplied = async () => {
    if (currentUser) {
      const updated = await dbService.markAsApplied(currentUser.id)
      if (updated) {
        setCurrentUser(updated)
      }
    }
  }

  // Increment referral count
  const incrementReferralCount = async () => {
    if (currentUser) {
      const updated = await dbService.incrementReferralCount(currentUser.id)
      if (updated) {
        setCurrentUser(updated)
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

