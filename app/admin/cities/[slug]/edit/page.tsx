"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { 
  Building2, 
  Save,
  X,
  Loader2
} from "lucide-react"

export default function EditCity() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    region: "",
    population: "",
    description: "",
    featured: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState("")

  // تحميل بيانات المدينة الحالية
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch(`/api/cities/${slug}`)
        if (response.ok) {
          const cityData = await response.json()
          setFormData({
            name: cityData.name || "",
            slug: cityData.slug || "",
            region: cityData.region || "",
            population: cityData.population || "",
            description: cityData.description || "",
            featured: cityData.featured || false
          })
        } else {
          setError("فشل في تحميل بيانات المدينة")
          toast({
            title: "خطأ",
            description: "فشل في تحميل بيانات المدينة",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("خطأ في تحميل بيانات المدينة:", error)
        setError("حدث خطأ في تحميل بيانات المدينة")
        toast({
          title: "خطأ",
          description: "حدث خطأ في تحميل بيانات المدينة",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    if (slug) {
      fetchCityData()
    }
  }, [slug, toast])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // إنشاء slug تلقائياً من الاسم
    if (field === "name" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // تحضير البيانات للتحديث
      const updateData = {
        name: formData.name,
        slug: formData.slug,
        region: formData.region,
        population: formData.population,
        description: formData.description,
        featured: formData.featured
      }

      const response = await fetch(`/api/cities/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تحديث المدينة بنجاح",
        })
        router.push("/admin/cities")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في تحديث المدينة")
      }
    } catch (error: any) {
      console.error("خطأ في تحديث المدينة:", error)
      setError(error.message || "حدث خطأ في تحديث المدينة")
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ في تحديث المدينة",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>جاري تحميل بيانات المدينة...</span>
        </div>
      </div>
    )
  }

  if (error && !isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تعديل المدينة</h1>
            <p className="text-gray-600">تعديل بيانات المدينة</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/cities">
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تعديل المدينة</h1>
          <p className="text-gray-600">تعديل بيانات المدينة: {formData.name}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/cities">
            <X className="w-4 h-4 ml-2" />
            إلغاء
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            بيانات المدينة
          </CardTitle>
          <CardDescription>
            تعديل بيانات المدينة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* اسم المدينة */}
              <div className="space-y-2">
                <Label htmlFor="name">اسم المدينة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="مثال: الرياض"
                  required
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">الرابط المختصر *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="مثال: al-riyadh"
                  required
                />
                <p className="text-xs text-gray-500">
                  سيتم إنشاؤه تلقائياً من اسم المدينة
                </p>
              </div>

              {/* المنطقة */}
              <div className="space-y-2">
                <Label htmlFor="region">المنطقة الإدارية *</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="مثال: منطقة الرياض"
                  required
                />
              </div>

              {/* عدد السكان */}
              <div className="space-y-2">
                <Label htmlFor="population">عدد السكان</Label>
                <Input
                  id="population"
                  value={formData.population}
                  onChange={(e) => handleInputChange("population", e.target.value)}
                  placeholder="مثال: 7,000,000"
                />
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <Label htmlFor="description">وصف المدينة</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="وصف مختصر عن المدينة..."
                rows={4}
              />
            </div>

            {/* التصنيف */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="featured">مدينة مميزة</Label>
                <p className="text-sm text-gray-500">
                  المدينة المميزة ستظهر في الصفحة الرئيسية
                </p>
              </div>
              <Switch
              dir="ltr"
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button variant="outline" asChild>
                <Link href="/admin/cities">
                  إلغاء
                </Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      {formData.name && (
        <Card>
          <CardHeader>
            <CardTitle>معاينة المدينة</CardTitle>
            <CardDescription>كيف ستظهر المدينة في الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{formData.name || "اسم المدينة"}</h3>
                  <p className="text-sm text-gray-600">{formData.region || "المنطقة"}</p>
                </div>
                {formData.featured && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    مميزة
                  </span>
                )}
              </div>
              {formData.description && (
                <p className="text-gray-700 text-sm">{formData.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span>0 مأذون</span>
                {formData.population && (
                  <span>{formData.population} نسمة</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
