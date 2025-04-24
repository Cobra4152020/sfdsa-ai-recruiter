"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"

// Types for our auth context
type User = {
  id: string
  email: string
  name?: string
  isAdmin: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: new Error("Not implemented") }),
  signOut: async () => {},
  isAdmin: false,
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component to wrap our app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking session:", error)
          setUser(null)
          setIsAdmin(false)
        } else if (data?.session) {
          // Get user profile from database
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .single()

          if (userError) {
            console.error("Error fetching user data:", userError)
          } else if (userData) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || "",
              name: userData.name,
              isAdmin: userData.is_admin || false,
            })
            setIsAdmin(userData.is_admin || false)
          }
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Get user profile from database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
        } else if (userData) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: userData.name,
            isAdmin: userData.is_admin || false,
          })
          setIsAdmin(userData.is_admin || false)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error }
    } catch (error) {
      console.error("Error during sign in:", error)
      return { error }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  // Provide the auth context to children
  return <AuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin }}>{children}</AuthContext.Provider>
}
