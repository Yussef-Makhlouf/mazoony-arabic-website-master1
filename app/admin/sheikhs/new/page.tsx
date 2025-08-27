"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { 
  Users, 
  Save,
  X,
  Plus,
  X as XIcon
} from "lucide-react"
import { City } from "@/lib/database"
import { Badge } from "@/components/ui/badge"

export default function NewSheikh() {
  const router = useRouter()
  const { toast } = useToast()
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    city: "",
    citySlug: "",
    phone: "",
    whatsapp: "",
    rating: 5,
    reviewCount: 0,
    specialties: [] as string[],
    experience: "",
    availability: "متاح" as "متاح" | "مشغول" | "غير متاح",
    bio: "",
    education: "",
    languages: [] as string[],
    price: "",
    verified: false
  })
  const [newSpecialty, setNewSpecialty] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // تحميل المدن من API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoadingCities(true)
        const response = await fetch("/api/cities")
        if (response.ok) {
          const citiesData = await response.json()
          setCities(citiesData)
        } else {
          toast({
            title: "خطأ",
            description: "فشل في تحميل المدن",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("خطأ في تحميل المدن:", error)
        toast({
          title: "خطأ",
          description: "حدث خطأ في تحميل المدن",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCities(false)
      }
    }

    fetchCities()
  }, [toast])

  const handleInputChange = (field: string, value: string | number | boolean) => {
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

    // تحديث citySlug عند تغيير المدينة
    if (field === "city" && typeof value === "string") {
      const selectedCity = cities.find(city => city.name === value)
      if (selectedCity) {
        setFormData(prev => ({
          ...prev,
          citySlug: selectedCity.slug
        }))
      }
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }))
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // الحصول على cityId من المدينة المختارة
      const selectedCity = cities.find(city => city.name === formData.city)
      if (!selectedCity) {
        toast({
          title: "خطأ",
          description: "الرجاء اختيار مدينة صحيحة",
          variant: "destructive",
        })
        return
      }

      // تحضير البيانات للإضافة
      const sheikhData = {
        name: formData.name,
        slug: formData.slug,
        cityId: selectedCity._id, // استخدام cityId بدلاً من city
        city: formData.city,
        citySlug: formData.citySlug,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        specialties: formData.specialties,
        experience: formData.experience,
        availability: formData.availability,
        bio: formData.bio,
        education: formData.education,
        languages: formData.languages,
        price: formData.price,
        verified: formData.verified,
        ratings: {
          commitment: 5,
          ease: 5,
          knowledge: 5,
          price: 5
        }
      }

      const response = await fetch("/api/sheikhs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sheikhData),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم إضافة المأذون بنجاح",
        })
        router.push("/admin/sheikhs")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "فشل في إضافة المأذون")
      }
    } catch (error: any) {
      console.error("خطأ في إضافة المأذون:", error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ في إضافة المأذون",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إضافة مأذون جديد</h1>
          <p className="text-gray-600">إضافة مأذون جديد إلى النظام</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/sheikhs">
            <X className="w-4 h-4 ml-2" />
            إلغاء
          </Link>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            بيانات المأذون
          </CardTitle>
          <CardDescription>
            أدخل بيانات المأذون الجديد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المأذون *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="مثال: الشيخ عبدالرحمن المالكي"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">الرابط المختصر *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="مثال: abdulrahman-al-malki"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة *</Label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  required
                  disabled={isLoadingCities}
                >
                  <option value="">
                    {isLoadingCities ? "جاري تحميل المدن..." : "اختر المدينة"}
                  </option>
                  {cities.map((city) => (
                    <option key={city._id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="مثال: +966501234567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">رقم الواتساب</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  placeholder="مثال: +966501234567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">السعر</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="مثال: 500 ريال"
                />
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label>التخصصات</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="أضف تخصص جديد"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="gap-1">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-red-600"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label>اللغات</Label>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="أضف لغة جديدة"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                />
                <Button type="button" onClick={addLanguage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((language) => (
                  <Badge key={language} variant="outline" className="gap-1">
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-1 hover:text-red-600"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">الخبرة</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="مثال: 15 سنة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">المؤهل العلمي</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  placeholder="مثال: بكالوريوس الشريعة"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">نبذة مختصرة</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="نبذة مختصرة عن المأذون..."
                rows={4}
              />
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="availability">الحالة</Label>
                  <p className="text-sm text-gray-500">حالة توفر المأذون</p>
                </div>
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value as any)}
                  className="p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="متاح">متاح</option>
                  <option value="مشغول">مشغول</option>
                  <option value="غير متاح">غير متاح</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="verified">معتمد</Label>
                  <p className="text-sm text-gray-500">المأذون معتمد رسمياً</p>
                </div>
                <Switch dir="ltr"
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => handleInputChange("verified", checked)}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button variant="outline" asChild>
                <Link href="/admin/sheikhs">
                  إلغاء
                </Link>
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingCities}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ المأذون
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
            <CardTitle>معاينة المأذون</CardTitle>
            <CardDescription>كيف سيظهر المأذون في الموقع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{formData.name}</h3>
                  <p className="text-sm text-gray-600">{formData.city}</p>
                </div>
                {formData.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    معتمد
                  </span>
                )}
              </div>
              {formData.bio && (
                <p className="text-gray-700 text-sm mb-3">{formData.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⭐ {formData.rating}/5</span>
                <span>{formData.experience}</span>
                {formData.price && <span>{formData.price}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
