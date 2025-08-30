"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, AlertCircle, CheckCircle, Mail } from "lucide-react"

export default function VerifyResetCodePage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        // Store the reset token and redirect to password reset page
        localStorage.setItem('resetToken', data.token)
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      } else {
        setError(data.error || 'رمز التحقق غير صحيح')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    if (!email) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setError("")
        // Show success message briefly
        setError("تم إرسال رمز جديد بنجاح!")
        setTimeout(() => setError(""), 3000)
      }
    } catch (err) {
      setError("فشل في إعادة إرسال الرمز")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rtl arabic-text">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <div className="mb-6">
          <Link 
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لصفحة استعادة كلمة المرور
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
                <p className="mt-2 text-sm text-blue-600">
                  {email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                </p>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                <Alert variant={error.includes('تم إرسال') ? "default" : "destructive"} 
                       className={error.includes('تم إرسال') ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertCircle className="h-4 w-4" />
                  <AlertDescription className={error.includes('تم إرسال') ? "text-green-700" : "text-red-700"}>
                    {error}
                  </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-700 font-medium">رمز التحقق</Label>
                  <div className="relative">
                    <Input
                    id="code"
                      type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                      required
                    disabled={isLoading}
                    className="h-12 text-center text-2xl font-mono tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    maxLength={6}
                  />
                  </div>
                  <p className="text-xs text-gray-500">
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      جاري التحقق...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                      تأكيد الرمز
                    </div>
                  )}
                </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">لم تتلق الرمز؟</p>
                <Button
                      type="button"
                  variant="outline"
                  onClick={resendCode}
                  disabled={isLoading || !email}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  إعادة إرسال الرمز
                </Button>
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