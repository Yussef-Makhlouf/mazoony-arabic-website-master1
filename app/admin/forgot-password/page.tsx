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
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

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
        toast({
          title: "تم الإرسال بنجاح",
          description: "تم إرسال رمز الاستعادة إلى بريدك الإلكتروني، سيتم توجيهك لإدخال الرمز",
          variant: "default",
        })
        
        // Immediate redirect to verification page
        router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`)
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
    <div className="min-h-screen flex items-center justify-center p-4 rtl arabic-text" style={{ backgroundColor: '#f0fdf4' }}>
      <div className="w-full max-w-md relative z-10">
        {/* Back to Login Link */}
        <div className="mb-6">
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: '#15803d' }}
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لتسجيل الدخول
          </Link>
        </div>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#15803d' }}>
                <KeyRound className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl arabic-heading" style={{ color: '#15803d' }}>استعادة كلمة المرور</CardTitle>
              <CardDescription className="mt-3 text-gray-600">
                أدخل بريدك الإلكتروني لاستلام رمز استعادة كلمة المرور
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
                <Label htmlFor="email" className="text-gray-700 font-medium">البريد الإلكتروني</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    disabled={isLoading}
                    className="h-12 pr-12 border-gray-200 focus:ring-2"
                    style={{ 
                      borderColor: '#15803d',
                      focusBorderColor: '#15803d',
                      focusRingColor: '#15803d'
                    }}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500">
                  سنرسل لك رمز استعادة كلمة المرور على هذا البريد
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-white font-medium" 
                disabled={isLoading || !email}
                style={{ backgroundColor: '#15803d' }}
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
                  className="text-sm transition-colors"
                  style={{ color: '#15803d' }}
                >
                  تذكرت كلمة المرور؟ تسجيل الدخول
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: '#15803d' }}>
            © {new Date().getFullYear()} موقع مأذوني. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  )
}
