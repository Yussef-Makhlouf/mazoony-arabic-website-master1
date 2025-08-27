"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

interface AuthState {
  isAuthenticated: boolean
  user?: {
    email: string
    name: string
    role: string
  }
  timestamp?: number
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("adminAuth")
        if (!authData) {
          router.push("/admin/login")
          return
        }

        const auth: AuthState = JSON.parse(authData)

        // Check if authentication is expired (24 hours)
        const isExpired = auth.timestamp && Date.now() - auth.timestamp > 24 * 60 * 60 * 1000

        if (!auth.isAuthenticated || isExpired) {
          localStorage.removeItem("adminAuth")
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("adminAuth")
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-admin-background flex items-center justify-center">
        <Card className="admin-card p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-admin-text arabic-text">جاري التحقق من الهوية...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
