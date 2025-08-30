"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess(false)
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("كلمة المرور الحالية مطلوبة")
      return false
    }
    if (!formData.newPassword) {
      setError("كلمة المرور الجديدة مطلوبة")
      return false
    }
    if (formData.newPassword.length < 6) {
      setError("كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف")
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين")
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(data.error || 'حدث خطأ أثناء تغيير كلمة المرور')
      }
    } catch (err) {
      setError("حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى")
    } finally {
      setIsLoading(false)
    }
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

    if (score < 2) return { score, label: 'ضعيفة', color: 'text-red-500' }
    if (score < 4) return { score, label: 'متوسطة', color: 'text-yellow-500' }
    if (score < 6) return { score, label: 'قوية', color: 'text-green-500' }
    return { score, label: 'قوية جداً', color: 'text-green-600' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="p-6 space-y-6 rtl arabic-text">
      <div>
        <h1 className="text-3xl font-bold arabic-heading">تغيير كلمة المرور</h1>
        <p className="text-admin-text-muted mt-2">قم بتغيير كلمة المرور الخاصة بحسابك</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              تحديث كلمة المرور
            </CardTitle>
            <CardDescription>
              تأكد من استخدام كلمة مرور قوية لحماية حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>تم تغيير كلمة المرور بنجاح</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted hover:text-admin-text"
                    disabled={isLoading}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted hover:text-admin-text"
                    disabled={isLoading}
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded">
                        <div 
                          className={`h-full rounded transition-all ${
                            passwordStrength.score < 2 ? 'bg-red-500' :
                            passwordStrength.score < 4 ? 'bg-yellow-500' :
                            passwordStrength.score < 6 ? 'bg-green-500' : 'bg-green-600'
                          }`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted hover:text-admin-text"
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`text-xs ${
                    formData.newPassword === formData.confirmPassword 
                      ? 'text-green-600' 
                      : 'text-red-500'
                  }`}>
                    {formData.newPassword === formData.confirmPassword 
                      ? '✓ كلمة المرور متطابقة' 
                      : '✗ كلمة المرور غير متطابقة'
                    }
                  </div>
                )}
              </div>

              {/* Security Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">نصائح لكلمة مرور قوية:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>
                    • على الأقل 8 أحرف
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                    • حرف كبير واحد على الأقل (A-Z)
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                    • حرف صغير واحد على الأقل (a-z)
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>
                    • رقم واحد على الأقل (0-9)
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>
                    • رمز خاص واحد على الأقل (!@#$%^&*)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  className="flex-1"
                >
                  {isLoading ? "جاري التحديث..." : "تغيير كلمة المرور"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                    setError("")
                    setSuccess(false)
                  }}
                  disabled={isLoading}
                >
                  مسح الحقول
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
