"use client"

import { useState } from "react"
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

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // الموقع
    siteName: "مأذوني",
    siteDescription: "الموقع الأول للمأذونين الشرعيين في المملكة العربية السعودية",
    siteUrl: "https://mazoony.com",
    contactEmail: "info@mazoony.com",
    contactPhone: "+966501234567",
    address: "الرياض، المملكة العربية السعودية",
    
    // الإشعارات
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reviewNotifications: true,
    messageNotifications: true,
    
    // الأمان
    requireVerification: true,
    autoApproveReviews: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    
    // النظام
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    
    // التقييمات
    minReviewLength: 10,
    maxReviewLength: 500,
    requirePhoneForReview: true,
    autoModerateReviews: false,
    
    // المأذونين
    autoVerifySheikhs: false,
    requireDocuments: true,
    maxSheikhsPerCity: 50,
    featuredSheikhsLimit: 10
  })

  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    action: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // هنا سيتم حفظ الإعدادات
      console.log("حفظ الإعدادات:", settings)
      await new Promise(resolve => setTimeout(resolve, 1000)) // محاكاة حفظ البيانات
      toast({
        title: "نجح",
        description: "تم حفظ الإعدادات بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteModal = (action: string) => {
    setDeleteModal({
      isOpen: true,
      action
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      action: ""
    })
  }

  const handleResetSettings = async () => {
    setIsDeleting(true)
    try {
      // محاكاة إعادة تعيين الإعدادات
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "نجح",
        description: "تم إعادة تعيين الإعدادات بنجاح",
      })
      closeDeleteModal()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إعادة تعيين الإعدادات",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportData = () => {
    toast({
      title: "نجح",
      description: "تم تصدير البيانات بنجاح",
    })
  }

  const handleDeleteAllData = async () => {
    setIsDeleting(true)
    try {
      // محاكاة حذف جميع البيانات
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "نجح",
        description: "تم حذف جميع البيانات بنجاح",
      })
      closeDeleteModal()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف البيانات",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getDeleteModalConfig = () => {
    switch (deleteModal.action) {
      case "delete-all":
        return {
          title: "حذف جميع البيانات",
          description: "هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!",
          itemName: "جميع المدن والمأذونين والتقييمات",
          onConfirm: handleDeleteAllData
        }
      case "reset-settings":
        return {
          title: "إعادة تعيين الإعدادات",
          description: "هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟",
          itemName: "جميع الإعدادات",
          onConfirm: handleResetSettings
        }
      default:
        return {
          title: "",
          description: "",
          itemName: "",
          onConfirm: () => {}
        }
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

  const modalConfig = getDeleteModalConfig()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات النظام والموقع</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site Settings */}
        <SettingSection title="إعدادات الموقع" icon={Globe}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange("siteName", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="siteUrl">رابط الموقع</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => handleSettingChange("siteUrl", e.target.value)}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                <Input
                  id="contactEmail"
                  value={settings.contactEmail}
                  onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone">رقم الهاتف</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleSettingChange("contactPhone", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => handleSettingChange("address", e.target.value)}
              />
            </div>
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection title="إعدادات الإشعارات" icon={Bell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-gray-500">إرسال إشعارات عبر البريد الإلكتروني</p>
              </div>
              <Switch dir="ltr"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات الرسائل النصية</Label>
                <p className="text-sm text-gray-500">إرسال إشعارات عبر الرسائل النصية</p>
              </div>
              <Switch dir="ltr"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات الدفع</Label>
                <p className="text-sm text-gray-500">إرسال إشعارات فورية للمتصفح</p>
              </div>
              <Switch dir="ltr"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات التقييمات</Label>
                <p className="text-sm text-gray-500">إشعار عند إضافة تقييم جديد</p>
              </div>
              <Switch dir="ltr"
                checked={settings.reviewNotifications}
                onCheckedChange={(checked) => handleSettingChange("reviewNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات الرسائل</Label>
                <p className="text-sm text-gray-500">إشعار عند استلام رسالة جديدة</p>
              </div>
              <Switch dir="ltr"
                checked={settings.messageNotifications}
                onCheckedChange={(checked) => handleSettingChange("messageNotifications", checked)}
              />
            </div>
          </div>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection title="إعدادات الأمان" icon={Shield}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>التحقق من المأذونين</Label>
                <p className="text-sm text-gray-500">تطلب التحقق من المأذونين الجدد</p>
              </div>
              <Switch dir="ltr"
                checked={settings.requireVerification}
                onCheckedChange={(checked) => handleSettingChange("requireVerification", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>الموافقة التلقائية على التقييمات</Label>
                <p className="text-sm text-gray-500">عرض التقييمات مباشرة بدون مراجعة</p>
              </div>
              <Switch dir="ltr"
                checked={settings.autoApproveReviews}
                onCheckedChange={(checked) => handleSettingChange("autoApproveReviews", checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات تسجيل الدخول</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange("maxLoginAttempts", parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="sessionTimeout">مهلة الجلسة (دقائق)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
              />
            </div>
          </div>
        </SettingSection>

        {/* System Settings */}
        <SettingSection title="إعدادات النظام" icon={Database}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>وضع الصيانة</Label>
                <p className="text-sm text-gray-500">إيقاف الموقع مؤقتاً للصيانة</p>
              </div>
              <Switch dir="ltr"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>وضع التطوير</Label>
                <p className="text-sm text-gray-500">عرض رسائل الخطأ التفصيلية</p>
              </div>
              <Switch dir="ltr"
                checked={settings.debugMode}
                onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>النسخ الاحتياطي التلقائي</Label>
                <p className="text-sm text-gray-500">إنشاء نسخ احتياطية تلقائياً</p>
              </div>
              <Switch dir="ltr"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
              />
            </div>
            
         
          </div>
        </SettingSection>

        {/* Review Settings */}
        <SettingSection title="إعدادات التقييمات" icon={Users}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="minReviewLength">الحد الأدنى لطول التقييم</Label>
              <Input
                id="minReviewLength"
                type="number"
                value={settings.minReviewLength}
                onChange={(e) => handleSettingChange("minReviewLength", parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="maxReviewLength">الحد الأقصى لطول التقييم</Label>
              <Input
                id="maxReviewLength"
                type="number"
                value={settings.maxReviewLength}
                onChange={(e) => handleSettingChange("maxReviewLength", parseInt(e.target.value))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>طلب رقم الهاتف للتقييم</Label>
                <p className="text-sm text-gray-500">إلزام المستخدمين بإدخال رقم الهاتف</p>
              </div>
              <Switch dir="ltr"
                checked={settings.requirePhoneForReview}
                onCheckedChange={(checked) => handleSettingChange("requirePhoneForReview", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>المراجعة التلقائية للتقييمات</Label>
                <p className="text-sm text-gray-500">فحص التقييمات تلقائياً للمحتوى المسيء</p>
              </div>
              <Switch dir="ltr"
                checked={settings.autoModerateReviews}
                onCheckedChange={(checked) => handleSettingChange("autoModerateReviews", checked)}
              />
            </div>
          </div>
        </SettingSection>

        {/* Sheikh Settings */}
        <SettingSection title="إعدادات المأذونين" icon={Building2}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>التحقق التلقائي من المأذونين</Label>
                <p className="text-sm text-gray-500">الموافقة التلقائية على المأذونين الجدد</p>
              </div>
              <Switch dir="ltr"
                checked={settings.autoVerifySheikhs}
                onCheckedChange={(checked) => handleSettingChange("autoVerifySheikhs", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>طلب المستندات</Label>
                <p className="text-sm text-gray-500">طلب رفع المستندات للمأذونين</p>
              </div>
              <Switch dir="ltr" 
                checked={settings.requireDocuments}
                onCheckedChange={(checked) => handleSettingChange("requireDocuments", checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="maxSheikhsPerCity">الحد الأقصى للمأذونين في المدينة</Label>
              <Input
                id="maxSheikhsPerCity"
                type="number"
                value={settings.maxSheikhsPerCity}
                onChange={(e) => handleSettingChange("maxSheikhsPerCity", parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="featuredSheikhsLimit">حد المأذونين المميزين</Label>
              <Input
                id="featuredSheikhsLimit"
                type="number"
                value={settings.featuredSheikhsLimit}
                onChange={(e) => handleSettingChange("featuredSheikhsLimit", parseInt(e.target.value))}
              />
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">منطقة الخطر</CardTitle>
          <CardDescription>إجراءات خطيرة قد تؤثر على النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-medium text-red-600">حذف جميع البيانات</h3>
                <p className="text-sm text-gray-500">حذف جميع المدن والمأذونين والتقييمات</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => openDeleteModal("delete-all")}
              >
                حذف جميع البيانات
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-medium text-red-600">إعادة تعيين الإعدادات</h3>
                <p className="text-sm text-gray-500">إعادة جميع الإعدادات إلى القيم الافتراضية</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => openDeleteModal("reset-settings")}
              >
                إعادة تعيين
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-medium text-red-600">تصدير البيانات</h3>
                <p className="text-sm text-gray-500">تصدير جميع البيانات كملف JSON</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                تصدير البيانات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        itemName={modalConfig.itemName}
        isLoading={isDeleting}
      />
    </div>
  )
}
