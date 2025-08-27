"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Phone, MessageCircle, MapPin, Calendar, Award, Users, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"

interface Sheikh {
  id: string
  name: string
  city: string
  rating: number
  reviews: number
  experience: string
  specialties: string[]
  phone: string
  image: string
  bio?: string
  education?: string[]
  languages?: string[]
  completedCases?: number
  isAvailable?: boolean
  isVerified?: boolean
  price?: string
  detailedRatings?: {
    commitment: number
    ease: number
    knowledge: number
    price: number
  }
  customerReviews?: Array<{
    name: string
    phone: string
    rating: number
    comment: string
    date: string
  }>
}

interface SheikhDetailsModalProps {
  sheikh: Sheikh | null
  isOpen: boolean
  onClose: () => void
}

export default function SheikhDetailsModal({ sheikh, isOpen, onClose }: SheikhDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "contact">("overview")

  if (!sheikh) return null

  const handleCall = () => {
    window.open(`tel:${sheikh.phone}`, "_self")
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`السلام عليكم، أريد الاستفسار عن خدمات التوثيق الشرعي`)
    window.open(`https://wa.me/${sheikh.phone.replace(/[^0-9]/g, "")}?text=${message}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-background to-muted/20">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-t-lg">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Image
                    src={sheikh.image || "/placeholder.svg"}
                    alt={sheikh.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white/20 shadow-lg"
                  />
                  {sheikh.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-white mb-2">{sheikh.name}</DialogTitle>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{sheikh.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{sheikh.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{sheikh.rating}</span>
                      <span className="text-sm">({sheikh.reviews} تقييم)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {sheikh.isAvailable && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-400/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        متاح الآن
                      </Badge>
                    )}
                    {sheikh.isVerified && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                        <Award className="h-3 w-3 mr-1" />
                        معتمد
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 p-6 bg-muted/30">
            <Button onClick={handleCall} className="flex-1 bg-green-600 hover:bg-green-700">
              <Phone className="h-4 w-4 mr-2" />
              اتصال مباشر
            </Button>
            <Button onClick={handleWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              واتساب
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex">
              {[
                { id: "overview", label: "نظرة عامة", icon: Users },
                { id: "reviews", label: "التقييمات", icon: Star },
                { id: "contact", label: "التواصل", icon: MessageCircle },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === id
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Bio */}
                {sheikh.bio && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      نبذة شخصية
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{sheikh.bio}</p>
                  </div>
                )}

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    التخصصات
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sheikh.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {sheikh.education && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      المؤهلات العلمية
                    </h3>
                    <ul className="space-y-2">
                      {sheikh.education.map((edu, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Languages */}
                {sheikh.languages && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">اللغات</h3>
                    <div className="flex flex-wrap gap-2">
                      {sheikh.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{sheikh.completedCases || 0}</div>
                    <div className="text-sm text-muted-foreground">حالة مكتملة</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{sheikh.reviews}</div>
                    <div className="text-sm text-muted-foreground">تقييم</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{sheikh.rating}</div>
                    <div className="text-sm text-muted-foreground">متوسط التقييم</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Detailed Ratings */}
                {sheikh.detailedRatings && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">التقييمات التفصيلية</h3>
                    <div className="space-y-4">
                      {[
                        { key: "commitment", label: "الالتزام بالمواعيد", value: sheikh.detailedRatings.commitment },
                        { key: "ease", label: "التسهيل في الأداء", value: sheikh.detailedRatings.ease },
                        { key: "knowledge", label: "المعرفة والشرح المفصل", value: sheikh.detailedRatings.knowledge },
                        { key: "price", label: "السعر", value: sheikh.detailedRatings.price },
                      ].map(({ key, label, value }) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{label}</span>
                            <span className="text-sm text-muted-foreground">{value}/5</span>
                          </div>
                          <Progress value={(value / 5) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Reviews */}
                {sheikh.customerReviews && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">آراء العملاء</h3>
                    <div className="space-y-4">
                      {sheikh.customerReviews.map((review, index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium">{review.name}</div>
                              <div className="text-sm text-muted-foreground">{review.phone}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-2">{review.comment}</p>
                          <div className="text-xs text-muted-foreground">{review.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">معلومات التواصل</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium arabic-text">رقم الهاتف</div>
                        <div className="text-muted-foreground" dir="ltr">{sheikh.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">المدينة</div>
                        <div className="text-muted-foreground">{sheikh.city}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">الحالة</div>
                        <div className={`text-sm ${sheikh.isAvailable ? "text-green-600" : "text-red-600"}`}>
                          {sheikh.isAvailable ? "متاح للتواصل" : "غير متاح حالياً"}
                        </div>
                      </div>
                    </div>
                    {sheikh.price && (
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">الرسوم</div>
                          <div className="text-muted-foreground">{sheikh.price}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleCall} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-5 w-5 mr-2" />
                    اتصال مباشر
                  </Button>
                  <Button onClick={handleWhatsApp} size="lg" className="bg-green-500 hover:bg-green-600">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    تواصل عبر واتساب
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
