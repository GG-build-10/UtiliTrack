"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  email: string
  id: string // We'll generate this from the email
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to generate a consistent ID from email
function generateIdFromEmail(email: string): string {
  // Simple hash function to create a UUID-like string from email
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  // Format as UUID-like string
  const hashStr = Math.abs(hash).toString(16).padStart(8, "0")
  return `${hashStr}-${hashStr.substring(0, 4)}-${hashStr.substring(4, 8)}-${hashStr.substring(0, 4)}-${hashStr.substring(4, 12)}`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for user email in cookie on initial load
    const userEmail = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user-email="))
      ?.split("=")[1]

    if (userEmail) {
      const email = decodeURIComponent(userEmail)
      setUser({
        email,
        id: generateIdFromEmail(email),
      })
    }

    setIsLoading(false)
  }, [])

  const signIn = (email: string) => {
    // Set cookie with user email
    document.cookie = `user-email=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

    // Set user in state
    setUser({
      email,
      id: generateIdFromEmail(email),
    })

    // Redirect to home page
    router.push("/")
    router.refresh()
  }

  const signOut = () => {
    // Clear cookie
    document.cookie = "user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

    // Clear user from state
    setUser(null)

    // Redirect to auth page
    router.push("/auth")
    router.refresh()
  }

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
