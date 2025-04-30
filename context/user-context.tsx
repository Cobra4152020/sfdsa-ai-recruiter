"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  isApplying?: boolean
  createdAt?: string
}

interface UserContextType {
  currentUser: User | null
  isLoggedIn: boolean
  isInitialized: boolean
  login: (userData: User) => void
  logout: () => void
  incrementParticipation: () => Promise<void>
  setUserInfo: (name: string, email: string, phone: string, isApplying: boolean) => Promise<User | null>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("currentUser")
      }
    }
    setIsInitialized(true)
  }, [])

  const login = (userData: User) => {
    setCurrentUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  // Function to set user info and login
  const setUserInfo = async (name: string, email: string, phone: string, isApplying: boolean): Promise<User | null> => {
    try {
      // Generate a simple user ID
      const userId = `user_${Date.now()}`

      // Create user object
      const userData: User = {
        id: userId,
        name,
        email,
        phone,
        isApplying,
        createdAt: new Date().toISOString(),
      }

      // Login the user (which sets the user in state and localStorage)
      login(userData)

      return userData
    } catch (error) {
      console.error("Error setting user info:", error)
      return null
    }
  }

  // Mock function for participation tracking
  const incrementParticipation = async () => {
    // In a real app, this would call an API
    console.log("Participation incremented")
    return Promise.resolve()
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isInitialized,
        login,
        logout,
        incrementParticipation,
        setUserInfo,
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
