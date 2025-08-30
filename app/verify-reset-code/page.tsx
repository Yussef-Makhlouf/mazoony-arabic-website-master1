"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, AlertCircle, CheckCircle, Mail, Clock, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function VerifyResetCodeContent() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (code.length < 4) {
      setError("يرجى إدخال رمز التحقق المكون من 6 أرقام")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: code.toUpperCase().trim(),
          email: email || undefined 
        }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        // Store the token for the next step
        localStorage.setItem('resetToken', data.token)
        
        toast({
          title: "تم التحقق بنجاح",
          description: "رمز الاستعادة صحيح، سيتم توجيهك لتغيير كلمة المرور",
          variant: "default",
        })
        
        // Redirect to reset password page
        setTimeout(() => {
          router.push(`/reset-password?token=${encodeURIComponent(data.token)}`)
        }, 1500)
      } else {
        setError(data.error || 'رمز الاستعادة غير صحيح أو منتهي الصلاحية')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    if (!email) {
      setError("البريد الإلكتروني مطلوب لإعادة الإرسال")
      return
    }

    if (cooldown > 0) {
      return
    }

    setIsResending(true)
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
        toast({
          title: "تم إعادة الإرسال",
          description: "تم إرسال رمز جديد إلى بريدك الإلكتروني",
          variant: "default",
        })
        setCooldown(60) // 60 seconds cooldown
        setCode("") // Clear current code
      } else {
        setError(data.error || 'حدث خطأ أثناء إعادة إرسال الرمز')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl arabic-text">
      <div className="w-full max-w-md">
        {/* Back to forgot password Link */}
        <div className="mb-6">
          <Link 
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لطلب رمز جديد
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl arabic-heading text-gray-800">تأكيد رمز الاستعادة</CardTitle>
              <CardDescription className="mt-3 text-gray-600">
                أدخل رمز الاستعادة المرسل إلى بريدك الإلكتروني
              </CardDescription>
              {email && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    تم الإرسال إلى: {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                  </p>
                </div>
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
                <Label htmlFor="code" className="text-gray-700 font-medium">رمز التحقق</Label>
                <div className="relative">
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setCode(value)
                      if (error) setError("")
                    }}
                    placeholder="000000"
                    required
                    disabled={isLoading}
                    className="h-14 text-center text-2xl font-mono tracking-[0.5em] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium" 
                disabled={isLoading || code.length < 4}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التحقق...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    تأكيد الرمز
                  </div>
                )}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500">لم تتلق الرمز؟</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resendCode}
                  disabled={isResending || !email || cooldown > 0}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      جاري الإرسال...
                    </div>
                  ) : cooldown > 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      انتظار {cooldown} ثانية
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      إعادة إرسال الرمز
                    </div>
                  )}
                </Button>
              </div>

              {/* Help text */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-600 space-y-2">
                  <p><strong>ملاحظات مهمة:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>الرمز صالح لمدة 15 دقيقة فقط</li>
                    <li>تحقق من مجلد الرسائل غير المرغوب فيها</li>
                    <li>الرمز يتكون من 6 أرقام</li>
                  </ul>
                </div>
              </div>
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

export default function VerifyResetCodePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl arabic-text">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-white" />
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
      <VerifyResetCodeContent />
    </Suspense>
  )
}