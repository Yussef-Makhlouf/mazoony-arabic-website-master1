"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const token = localStorage.getItem('resetToken')
    
    if (emailParam) {
      setEmail(emailParam)
    }
    
    if (token) {
      setResetToken(token)
    } else {
      // If no token, redirect back to forgot password
      router.push('/forgot-password')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: resetToken, 
          password,
          confirmPassword 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Clear the reset token
        localStorage.removeItem('resetToken')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || 'حدث خطأ أثناء تغيير كلمة المرور')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl arabic-text">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-green-600 arabic-heading">
                    تم تغيير كلمة المرور بنجاح!
                  </h3>
                  <p className="text-gray-600">
                    تم تغيير كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    ستتم إعادة توجيهك تلقائياً لصفحة تسجيل الدخول خلال <strong>3 ثوانٍ</strong>
                  </p>
                </div>

                <Link href="/login">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    الانتقال لتسجيل الدخول الآن
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl arabic-text">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لاستعادة كلمة المرور
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl arabic-heading text-gray-800">كلمة المرور الجديدة</CardTitle>
              <CardDescription className="mt-3 text-gray-600">
                أدخل كلمة المرور الجديدة الخاصة بك
              </CardDescription>
              {email && (
                <p className="mt-2 text-sm text-blue-600">
                  {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                </p>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                    required
                    disabled={isLoading}
                    className="h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  يجب أن تكون كلمة المرور على الأقل 6 أحرف
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    required
                    disabled={isLoading}
                    className="h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium" 
                disabled={isLoading || !password || !confirmPassword}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    جاري التحديث...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    تحديث كلمة المرور
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} موقع مأذوني. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  )
}