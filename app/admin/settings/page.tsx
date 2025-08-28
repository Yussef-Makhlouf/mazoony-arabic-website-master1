"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { DeleteModal } from "@/components/ui/delete-modal"
import { 
  Settings, 
  Save,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Phone,
  MapPin,
  Users,
  Building2
} from "lucide-react"
import { settingsAPI } from "@/lib/api"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    contactPhone: "+966501234567",
    whatsappNumber: "966501234567",
  })

  // Local state for input values to prevent re-render issues
  const [localValues, setLocalValues] = useState({
    contactPhone: "+966501234567",
    whatsappNumber: "966501234567",
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  // Use refs to store timeout IDs for proper debouncing
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({})

  const handleInputChange = (key: string, value: string) => {
    // Update local state immediately for smooth UI
    setLocalValues(prev => ({
      ...prev,
      [key]: value
    }))
    
    // Clear existing timeout for this field
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key])
    }
    
    // Set new timeout for debounced update
    timeoutRefs.current[key] = setTimeout(() => {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }))
      delete timeoutRefs.current[key]
    }, 300)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const s = await settingsAPI.get()
        const newSettings = { 
          contactPhone: s.contactPhone || settings.contactPhone,
          whatsappNumber: s.whatsappNumber || settings.whatsappNumber
        }
        setSettings(newSettings)
        setLocalValues(newSettings) // Sync local values
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Use local values for saving to ensure latest input
      const settingsData = {
        contactPhone: localValues.contactPhone,
        whatsappNumber: localValues.whatsappNumber,
      }
      
      const updated = await settingsAPI.update(settingsData)
      const newSettings = {
        contactPhone: updated.contactPhone,
        whatsappNumber: updated.whatsappNumber
      }
      setSettings(newSettings)
      setLocalValues(newSettings) // Sync local values
      toast({
        title: "نجح",
        description: "تم حفظ الإعدادات بنجاح",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => {
        clearTimeout(timeout)
      })
    }
  }, [])

  const SettingSection = ({ title, icon: Icon, children }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات التواصل</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 ml-2" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">

        {/* Contact Settings */}
        <SettingSection title="إعدادات التواصل" icon={Phone}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactPhone">رقم الهاتف</Label>
              <Input 
                id="contactPhone" 
                value={localValues.contactPhone}
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+966501234567"
              />
            </div>
            <div>
              <Label htmlFor="whatsappNumber">رقم الواتساب (دولي بدون +)</Label>
              <Input 
                id="whatsappNumber" 
                value={localValues.whatsappNumber}
                inputMode="numeric"
                autoComplete="tel-national"
                dir="ltr"
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="966501234567"
              />
            </div>
          </div>
        </SettingSection>

      </div>
    </div>
  )
}
