"use client"

import { useState, useEffect } from "react"

interface User {
  email: string
  name: string
  role: string
}

interface AuthState {
  isAuthenticated: boolean
  user?: User
  timestamp?: number
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: undefined,
  })

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("adminAuth")
        if (authData) {
          const parsedAuth: AuthState = JSON.parse(authData)

          // Check if authentication is expired (24 hours)
          const isExpired = parsedAuth.timestamp && Date.now() - parsedAuth.timestamp > 24 * 60 * 60 * 1000

          if (parsedAuth.isAuthenticated && !isExpired) {
            setAuth(parsedAuth)
          } else {
            localStorage.removeItem("adminAuth")
            setAuth({ isAuthenticated: false })
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("adminAuth")
        setAuth({ isAuthenticated: false })
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem("adminAuth")
    setAuth({ isAuthenticated: false })
    window.location.href = "/admin/login"
  }

  const login = (user: User) => {
    const authData: AuthState = {
      isAuthenticated: true,
      user,
      timestamp: Date.now(),
    }
    localStorage.setItem("adminAuth", JSON.stringify(authData))
    setAuth(authData)
  }

  return {
    ...auth,
    login,
    logout,
  }
}
