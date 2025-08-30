"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface CityFormModalProps {
  isOpen: boolean
  onClose: () => void
  city?: any
  onSave: (cityData: any) => void
}

export default function CityFormModal({ isOpen, onClose, city, onSave }: CityFormModalProps) {
  const [formData, setFormData] = useState({
    name: city?.name || "",
    slug: city?.slug || "",
    region: city?.region || "",
    population: city?.population || "",
    isActive: city?.isActive ?? true,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[أإآ]/g, "a")
        .replace(/[ة]/g, "h")
        .replace(/[ي]/g, "y")
        .replace(/[و]/g, "w")
        .replace(/[ء]/g, "")
        .replace(/[^\w-]/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  // تم حذف البيانات الثابتة - المناطق يتم جلبها من قاعدة البيانات أو إدخالها يدوياً
  const saudiRegions: string[] = []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="arabic-heading">{city ? "تعديل بيانات المدينة" : "إضافة مدينة جديدة"}</CardTitle>
              <CardDescription>
                {city ? "تحديث معلومات المدينة الموجودة" : "إدخال بيانات المدينة الجديدة"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 rtl arabic-text">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المدينة *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="الرياض"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">الرابط (Slug) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="riyadh"
                    required
                  />
                  <p className="text-xs text-muted-foreground">سيتم استخدامه في رابط المدينة: /city/{formData.slug}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="region">المنطقة *</Label>
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-background"
                    required
                  >
                    <option value="">اختر المنطقة</option>
                    {saudiRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="population">عدد السكان</Label>
                  <Input
                    id="population"
                    value={formData.population}
                    onChange={(e) => handleInputChange("population", e.target.value)}
                    placeholder="7,000,000"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>حالة المدينة</Label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === true}
                      onChange={() => handleInputChange("isActive", true)}
                    />
                    <span>نشطة</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      checked={formData.isActive === false}
                      onChange={() => handleInputChange("isActive", false)}
                    />
                    <span>غير نشطة</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  إلغاء
                </Button>
                <Button type="submit">{city ? "تحديث البيانات" : "إضافة المدينة"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
