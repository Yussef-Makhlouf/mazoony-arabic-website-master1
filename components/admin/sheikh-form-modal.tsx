"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2 } from "lucide-react"

interface SheikhFormModalProps {
  isOpen: boolean
  onClose: () => void
  sheikh?: any
  onSave: (sheikhData: any) => void
  cities: string[]
}

export default function SheikhFormModal({ isOpen, onClose, sheikh, onSave, cities }: SheikhFormModalProps) {
  const [formData, setFormData] = useState({
    name: sheikh?.name || "",
    email: sheikh?.email || "",
    phone: sheikh?.phone || "",
    city: sheikh?.city || "",
    experience: sheikh?.experience || "",
    status: sheikh?.status || "متاح",
    verified: sheikh?.verified || false,
    bio: sheikh?.bio || "",
    education: sheikh?.education || "",
    languages: sheikh?.languages || ["العربية"],
    specialties: sheikh?.specialties || ["توثيق العقود"],
    price: sheikh?.price || "",
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }))
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    if (formData.languages.length > 1) {
      setFormData((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l !== language),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="arabic-heading">{sheikh ? "تعديل بيانات المأذون" : "إضافة مأذون جديد"}</CardTitle>
              <CardDescription>
                {sheikh ? "تحديث معلومات المأذون الموجود" : "إدخال بيانات المأذون الجديد"}
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
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="الشيخ أحمد المالكي"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ahmed@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+966501234567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة *</Label>
                  <select
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-background"
                    required
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">سنوات الخبرة *</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="15 سنة"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ريال سعودي)</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Status and Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="متاح">متاح</option>
                    <option value="مشغول">مشغول</option>
                    <option value="غير متاح">غير متاح</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verified">الاعتماد</Label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verified"
                        checked={formData.verified === true}
                        onChange={() => handleInputChange("verified", true)}
                      />
                      <span>معتمد</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="verified"
                        checked={formData.verified === false}
                        onChange={() => handleInputChange("verified", false)}
                      />
                      <span>غير معتمد</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bio and Education */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">السيرة الذاتية</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="نبذة مختصرة عن المأذون وخبراته..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">التعليم والمؤهلات</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="المؤهلات العلمية والشهادات..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-4">
                <Label>التخصصات</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="إضافة تخصص جديد"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                  />
                  <Button type="button" onClick={addSpecialty} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <Label>اللغات</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-2">
                      {language}
                      {formData.languages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="إضافة لغة جديدة"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                  />
                  <Button type="button" onClick={addLanguage} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  إلغاء
                </Button>
                <Button type="submit">{sheikh ? "تحديث البيانات" : "إضافة المأذون"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
