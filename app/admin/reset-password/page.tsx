"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError("رمز الاستعادة مفقود")
      setIsVerifying(false)
      return
    }

    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setIsValidToken(true)
        setUserEmail(data.userEmail)
      } else {
        setError(data.error || 'رمز الاستعادة غير صحيح أو منتهي الصلاحية')
      }
    } catch (err) {
      setError("حدث خطأ في التحقق من رمز الاستعادة")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
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
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/admin/login')
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

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-admin-background flex items-center justify-center p-4 rtl arabic-text">
        <div className="w-full max-w-md">
          <Card className="admin-card shadow-lg">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-admin-text-muted">جاري التحقق من رمز الاستعادة...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-admin-background flex items-center justify-center p-4 rtl arabic-text">
        <div className="w-full max-w-md">
          <Card className="admin-card shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive-foreground" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl arabic-heading text-destructive">
                  رمز غير صالح
                </CardTitle>
                <CardDescription className="mt-2">
                  {error || "رمز الاستعادة غير صحيح أو منتهي الصلاحية"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <Link 
                  href="/admin/forgot-password"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  طلب رمز جديد
                </Link>
                <div>
                  <Link 
                    href="/admin/login"
                    className="text-sm text-admin-text-muted hover:text-admin-text inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              <CardTitle className="text-2xl arabic-heading">تعيين كلمة مرور جديدة</CardTitle>
              <CardDescription className="mt-2">
                للمستخدم: {userEmail}
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
                    تم تغيير كلمة المرور بنجاح
                  </h3>
                  <p className="text-sm text-admin-text-muted">
                    يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
                    سيتم توجيهك لصفحة تسجيل الدخول خلال ثوانٍ قليلة.
                  </p>
                </div>
                <Link 
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <ArrowRight className="w-4 h-4" />
                  تسجيل الدخول الآن
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
                  <Label htmlFor="password">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted hover:text-admin-text"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      className="pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted hover:text-admin-text"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-admin-text-muted space-y-1">
                  <p>متطلبات كلمة المرور:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li className={formData.password.length >= 6 ? "text-green-600" : ""}>
                      على الأقل 6 أحرف
                    </li>
                    <li className={formData.password === formData.confirmPassword && formData.confirmPassword ? "text-green-600" : ""}>
                      تطابق كلمة المرور مع التأكيد
                    </li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !formData.password || !formData.confirmPassword}
                >
                  {isLoading ? "جاري التحديث..." : "تعيين كلمة المرور"}
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
