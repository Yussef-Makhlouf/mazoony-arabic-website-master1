"use client"

import { useState, useEffect } from "react"
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

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  useEffect(() => {
    const load = async () => {
      try {
        const s = await settingsAPI.get()
        setSettings(prev => ({ 
          ...prev, 
          contactPhone: s.contactPhone || prev.contactPhone,
          whatsappNumber: s.whatsappNumber || prev.whatsappNumber
        }))
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Format the data according to SiteSettings interface
      const settingsData = {
        contactPhone: settings.contactPhone,
        whatsappNumber: settings.whatsappNumber,
      }
      
      const updated = await settingsAPI.update(settingsData)
      setSettings(prev => ({ 
        ...prev, 
        contactPhone: updated.contactPhone,
        whatsappNumber: updated.whatsappNumber
      }))
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
                value={settings.contactPhone} 
                onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                placeholder="+966501234567"
              />
            </div>
            <div>
              <Label htmlFor="whatsappNumber">رقم الواتساب (دولي بدون +)</Label>
              <Input 
                id="whatsappNumber" 
                value={settings.whatsappNumber} 
                onChange={(e) => handleSettingChange('whatsappNumber', e.target.value)}
                placeholder="966501234567"
              />
            </div>
          </div>
        </SettingSection>

      </div>
    </div>
  )
}
