"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, ArrowLeft, AlertCircle, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
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
        // Show success state first, then redirect after 3 seconds
        setSuccess(true)
        setTimeout(() => {
          router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`)
        }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 rtl arabic-text">
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
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لتسجيل الدخول
          </Link>
        </div>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <KeyRound className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl arabic-heading text-gray-800">استعادة كلمة المرور</CardTitle>
              <CardDescription className="mt-3 text-gray-600">
                أدخل بريدك الإلكتروني لاستلام رمز استعادة كلمة المرور
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            {success ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-green-600 arabic-heading">
                    تم إرسال رمز الاستعادة بنجاح!
                  </h3>
                  <p className="text-gray-600">
                    تم إرسال رمز استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد والبريد العشوائي.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      في حالة عدم وصول الرمز، ستتم إعادة توجيهك تلقائياً لصفحة إدخال الرمز خلال <strong>3 ثوانٍ</strong>
                    </p>
                  </div>
                </div>

                <Link href={`/verify-reset-code?email=${encodeURIComponent(email)}`}>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    الانتقال لإدخال الرمز الآن
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@mazoony.com"
                      required
                      disabled={isLoading}
                      className="h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    سنرسل لك رمز استعادة كلمة المرور على هذا البريد
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      إرسال رمز الاستعادة
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <Link 
                    href="/login"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    تذكرت كلمة المرور؟ تسجيل الدخول
                  </Link>
                </div>
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
