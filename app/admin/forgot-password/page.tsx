"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // In development, show the reset token
        if (data.resetToken && process.env.NODE_ENV === 'development') {
          console.log('Reset token:', data.resetToken)
          // Redirect to reset page with token for development
          setTimeout(() => {
            router.push(`/admin/reset-password?token=${data.resetToken}`)
          }, 2000)
        }
      } else {
        setError(data.error || 'حدث خطأ أثناء إرسال رمز الاستعادة')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-admin-background flex items-center justify-center p-4 rtl arabic-text">
      <div className="w-full max-w-md">
        <Card className="admin-card shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl arabic-heading">استعادة كلمة المرور</CardTitle>
              <CardDescription className="mt-2">
                أدخل بريدك الإلكتروني لاستلام رمز الاستعادة
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    تم إرسال رمز الاستعادة
                  </h3>
                  <p className="text-sm text-admin-text-muted">
                    تم إرسال رمز استعادة كلمة المرور إلى بريدك الإلكتروني.
                    يرجى التحقق من صندوق الوارد والبريد المزعج.
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-blue-600 mt-2">
                      (في وضع التطوير: سيتم توجيهك تلقائياً لصفحة إعادة التعيين)
                    </p>
                  )}
                  <div className="mt-4">
                    <Link
                      href={`/admin/verify-reset-code?email=${encodeURIComponent(email)}`}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ArrowRight className="w-4 h-4" />
                      إدخال رمز التأكيد يدوياً
                    </Link>
                  </div>
                </div>
                <Link 
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mazoony.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !email}>
                  {isLoading ? "جاري الإرسال..." : "إرسال رمز الاستعادة"}
                </Button>

                <div className="text-center">
                  <Link 
                    href="/admin/login"
                    className="text-sm text-admin-text-muted hover:text-admin-text inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
