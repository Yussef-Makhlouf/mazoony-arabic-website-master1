"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Settings, Save, Phone } from "lucide-react"
import { settingsAPI } from "@/lib/api"

// Types for better type safety
interface SettingsData {
  contactPhone: string
  whatsappNumber: string
}

interface FormErrors {
  contactPhone?: string
  whatsappNumber?: string
}

export default function AdminSettings() {
  // Single source of truth for form data
  const [formData, setFormData] = useState<SettingsData>({
    contactPhone: "+966501234567",
    whatsappNumber: "966501234567",
  })
  
  // Track original data to detect changes
  const [originalData, setOriginalData] = useState<SettingsData>({
    contactPhone: "+966501234567",
    whatsappNumber: "966501234567",
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const { toast } = useToast()
  
  // Use ref to prevent stale closures
  const mounted = useRef(true)

  // Load settings on mount
  useEffect(() => {
    let isCancelled = false

    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const settings = await settingsAPI.get()
        
        if (isCancelled) return

        const settingsData: SettingsData = {
          contactPhone: settings.contactPhone || "+966501234567",
          whatsappNumber: settings.whatsappNumber || "966501234567"
        }
        
        setFormData(settingsData)
        setOriginalData(settingsData)
      } catch (error) {
        if (isCancelled) return
        
        console.error('Error loading settings:', error)
        toast({
          title: "خطأ",
          description: "فشل في تحميل الإعدادات",
          variant: "destructive",
        })
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      isCancelled = true
      mounted.current = false
    }
  }, [toast])

  // Check if form has changes
  const hasChanges = formData.contactPhone !== originalData.contactPhone || 
                    formData.whatsappNumber !== originalData.whatsappNumber

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "رقم الهاتف مطلوب"
    } else if (!/^\+\d{10,15}$/.test(formData.contactPhone.trim())) {
      newErrors.contactPhone = "يجب أن يبدأ رقم الهاتف بـ + ويحتوي على 10-15 رقم"
    }
    
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "رقم الواتساب مطلوب"
    } else if (!/^\d{10,15}$/.test(formData.whatsappNumber.trim())) {
      newErrors.whatsappNumber = "رقم الواتساب يجب أن يحتوي على 10-15 رقم فقط"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (field: keyof SettingsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setIsSaving(true)
      
      const dataToSave = {
        contactPhone: formData.contactPhone.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
      }
      
      const updatedSettings = await settingsAPI.update(dataToSave)
      
      if (!mounted.current) return

      const newData: SettingsData = {
        contactPhone: updatedSettings.contactPhone,
        whatsappNumber: updatedSettings.whatsappNumber
      }
      
      setFormData(newData)
      setOriginalData(newData)
      
      toast({
        title: "نجح",
        description: "تم حفظ الإعدادات بنجاح",
      })
    } catch (error) {
      if (!mounted.current) return
      
      console.error('Error saving settings:', error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "حدث خطأ في حفظ الإعدادات"
      
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      if (mounted.current) {
        setIsSaving(false)
      }
    }
  }

  // Reset form to original values
  const handleReset = () => {
    setFormData(originalData)
    setErrors({})
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات التواصل</p>
        </div>
        <div className="flex items-center gap-4">
          {hasChanges && (
            <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
              هناك تغييرات لم يتم حفظها
            </div>
          )}
          {hasChanges && (
            <Button 
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              إلغاء التغييرات
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !hasChanges}
            className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                {hasChanges ? "حفظ التغييرات" : "لا توجد تغييرات"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Contact Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            إعدادات التواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">رقم الهاتف *</Label>
            <Input 
              id="contactPhone" 
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="+966501234567"
              dir="ltr"
              className={`${errors.contactPhone ? 'border-red-500' : ''} ${
                formData.contactPhone !== originalData.contactPhone ? 'border-orange-500' : ''
              }`}
            />
            {errors.contactPhone && (
              <p className="text-sm text-red-600">{errors.contactPhone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              أدخل رقم الهاتف مع رمز الدولة (+966)
            </p>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">رقم الواتساب (دولي بدون +) *</Label>
            <Input 
              id="whatsappNumber" 
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              placeholder="966501234567"
              dir="ltr"
              className={`${errors.whatsappNumber ? 'border-red-500' : ''} ${
                formData.whatsappNumber !== originalData.whatsappNumber ? 'border-orange-500' : ''
              }`}
            />
            {errors.whatsappNumber && (
              <p className="text-sm text-red-600">{errors.whatsappNumber}</p>
            )}
            <p className="text-xs text-muted-foreground">
              أدخل رقم الواتساب بدون رمز الدولة (+)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}