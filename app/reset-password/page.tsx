"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, AlertCircle, CheckCircle, Eye, EyeOff, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Get token from URL or localStorage
    const tokenParam = searchParams.get('token')
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('resetToken') : null
    
    const token = tokenParam || storedToken
    
    if (token) {
      setResetToken(token)
      // Verify token is still valid
      verifyToken(token)
    } else {
      // If no token, redirect back to login
      router.push('/login')
    }
  }, [searchParams, router])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'رمز الاستعادة غير صالح أو منتهي الصلاحية')
        setTimeout(() => {
          router.push('/forgot-password')
        }, 3000)
      }
    } catch (err) {
      setError('حدث خطأ في التحقق من رمز الاستعادة')
    }
  }

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = []
    
    if (pwd.length < 6) {
      errors.push('كلمة المرور يجب أن تكون على الأقل 6 أحرف')
    }
    
    if (!/(?=.*[a-zA-Z])/.test(pwd)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف واحد على الأقل')
    }
    
    if (!/(?=.*\d)/.test(pwd)) {
      errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين")
      setIsLoading(false)
      return
    }

    // Validate password strength
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0])
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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('resetToken')
        }
        
        toast({
          title: "تم تغيير كلمة المرور بنجاح",
          description: "سيتم توجيهك لصفحة تسجيل الدخول خلال لحظات",
          variant: "default",
        })
        
        // Redirect to login after a short delay
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
                    تم تحديث كلمة المرور الخاصة بك. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      سيتم توجيهك تلقائياً لصفحة تسجيل الدخول خلال لحظات...
                    </p>
                  </div>
                </div>

                <Link href="/login">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    الذهاب إلى تسجيل الدخول
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
            href="/verify-reset-code"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لإدخال رمز التحقق
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
              <CardTitle className="text-3xl arabic-heading text-gray-800">تعيين كلمة مرور جديدة</CardTitle>
              <CardDescription className="mt-3 text-gray-600">
                أدخل كلمة المرور الجديدة الخاصة بك
              </CardDescription>
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
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError("")
                    }}
                    placeholder="أدخل كلمة المرور الجديدة"
                    required
                    disabled={isLoading}
                    className="h-12 pl-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (error) setError("")
                    }}
                    placeholder="أعد إدخال كلمة المرور"
                    required
                    disabled={isLoading}
                    className="h-12 pl-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">متطلبات كلمة المرور:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    على الأقل 6 أحرف
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*[a-zA-Z])/.test(password) ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${/(?=.*[a-zA-Z])/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    حرف واحد على الأقل
                  </li>
                  <li className={`flex items-center gap-2 ${/(?=.*\d)/.test(password) ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    رقم واحد على الأقل
                  </li>
                  <li className={`flex items-center gap-2 ${password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    تطابق كلمات المرور
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium" 
                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري تحديث كلمة المرور...
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl arabic-text">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-blue-600 arabic-heading">جاري التحميل...</h3>
                  <p className="text-gray-600">يرجى الانتظار</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}