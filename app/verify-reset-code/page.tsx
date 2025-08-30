"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, ArrowLeft, CheckCircle, AlertCircle, Mail, Shield, Hash } from "lucide-react"

export default function VerifyResetCodePage() {
  const [formData, setFormData] = useState({
    resetCode: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [step, setStep] = useState<'verify-code' | 'set-password'>('verify-code')
  const [verifiedEmail, setVerifiedEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score < 2) return { score, label: 'ضعيفة', color: 'bg-red-500' }
    if (score < 4) return { score, label: 'متوسطة', color: 'bg-yellow-500' }
    if (score < 6) return { score, label: 'قوية', color: 'bg-green-500' }
    return { score, label: 'قوية جداً', color: 'bg-green-600' }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifyingCode(true)
    setError("")

    if (!formData.resetCode || formData.resetCode.length < 4) {
      setError("يرجى إدخال رمز صحيح")
      setIsVerifyingCode(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: formData.resetCode.toUpperCase(),
          email: emailParam
        }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setVerifiedEmail(data.userEmail)
        setResetToken(data.token)
        setStep('set-password')
      } else {
        setError(data.error || 'رمز الاستعادة غير صحيح أو منتهي الصلاحية')
      }
    } catch (err) {
      setError("حدث خطأ في التحقق من الرمز")
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
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
          token: resetToken,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        
        // Redirect to login after 5 seconds
        setTimeout(() => {
          router.push('/admin/login')
        }, 5000)
      } else {
        setError(data.error || 'حدث خطأ أثناء تغيير كلمة المرور')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 rtl arabic-text" style={{background: '#f8f9fa'}}>
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl arabic-heading text-green-600">
                  تم تغيير كلمة المرور بنجاح!
                </CardTitle>
                <CardDescription className="mt-3 text-gray-600">
                  يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      تم تحديث كلمة المرور بنجاح
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>سيتم توجيهك لصفحة تسجيل الدخول خلال <strong>5 ثوانٍ</strong></p>
                </div>
                
                <Link href="/admin/login">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    تسجيل الدخول الآن
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 rtl arabic-text" style={{background: '#f8f9fa'}}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Login Link */}
        <div className="mb-6">
          <Link 
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لتسجيل الدخول
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                {step === 'verify-code' ? (
                  <Hash className="w-10 h-10 text-white" />
                ) : (
                  <KeyRound className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl arabic-heading text-gray-800">
                {step === 'verify-code' ? 'تأكيد رمز الاستعادة' : 'تعيين كلمة مرور جديدة'}
              </CardTitle>
              <CardDescription className="mt-3 text-gray-600">
                {step === 'verify-code' ? (
                  <>
                    يرجى إدخال الرمز المرسل إلى بريدك الإلكتروني
                    {emailParam && <><br />({emailParam})</>}
                  </>
                ) : (
                  `للمستخدم: ${verifiedEmail}`
                )}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            {step === 'verify-code' ? (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-gray-700 font-medium">رمز الاستعادة</Label>
                  <div className="relative">
                    <Input
                      id="resetCode"
                      type="text"
                      value={formData.resetCode}
                      onChange={(e) => handleInputChange("resetCode", e.target.value.toUpperCase())}
                      placeholder="أدخل رمز الاستعادة"
                      required
                      disabled={isVerifyingCode}
                      className="h-12 pr-12 text-center text-lg font-mono tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      maxLength={8}
                    />
                    <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    أدخل الرمز الذي وصلك في البريد الإلكتروني
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium" 
                  disabled={isVerifyingCode || !formData.resetCode}
                >
                  {isVerifyingCode ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحقق...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      تأكيد الرمز
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <Link 
                    href="/admin/forgot-password"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    لم يصلك رمز؟ طلب رمز جديد
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
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
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••"
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
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
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
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className={`text-xs flex items-center gap-1 ${
                      formData.password === formData.confirmPassword 
                        ? 'text-green-600' 
                        : 'text-red-500'
                    }`}>
                      {formData.password === formData.confirmPassword 
                        ? <><CheckCircle className="w-3 h-3" /> كلمة المرور متطابقة</> 
                        : <><AlertCircle className="w-3 h-3" /> كلمة المرور غير متطابقة</>
                      }
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium" 
                  disabled={isLoading || !formData.password || !formData.confirmPassword}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحديث...
                    </div>
                  ) : (
                    "تعيين كلمة المرور"
                  )}
                </Button>
              </form>
            )}
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
