"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Phone,
  MessageCircle,
  Star,
  MapPin,
  ArrowRight,
  User,
  Clock,
  CheckCircle,
  BookOpen,
  DollarSign,
  Award,
  Calendar,
  Shield,
  Languages,
  GraduationCap,
  Send,
  ThumbsUp,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReviewForm } from "@/components/review-form"
import { ReviewsDisplay } from "@/components/reviews-display"
import { sheikhAPI } from "@/lib/api"
import { ClientPageProps } from "@/lib/types"

export default function SheikhProfileClient({ params }: ClientPageProps) {
  const { slug } = params
  const [sheikh, setSheikh] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    message: "",
  })

  useEffect(() => {
    const fetchSheikh = async () => {
      try {
        setLoading(true)
        const sheikhData = await sheikhAPI.getBySlug(slug)
        if (!sheikhData) {
          notFound()
        }
        setSheikh(sheikhData)
      } catch (err) {
        console.error('Error fetching sheikh data:', err)
        setError('حدث خطأ في تحميل بيانات المأذون')
      } finally {
        setLoading(false)
      }
    }

    fetchSheikh()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل بيانات المأذون...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !sheikh) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">{error || 'المأذون غير موجود'}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleReviewSuccess = () => {
    // Refresh reviews or show success message
    console.log("Review submitted successfully")
  }

  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      <header className="relative overflow-hidden bg-card border-b border-border">
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={`/city/${sheikh.citySlug}`}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors arabic-text"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة إلى {sheikh.city}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href={`/city/${sheikh.citySlug}`} className="hover:text-primary transition-colors">
              {sheikh.city}
            </Link>
            <span>/</span>
            <span className="text-foreground">{sheikh.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sheikh Profile */}
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      {sheikh.image ? (
                        <Image
                          src={sheikh.image}
                          alt={sheikh.name}
                          width={96}
                          height={96}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    {sheikh.verified && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold arabic-heading text-foreground">{sheikh.name}</h1>
                      {sheikh.verified && (
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          معتمد
                        </Badge>
                      )}
                    </div>
                    <p className="arabic-text text-muted-foreground text-lg mb-4">{sheikh.city}</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < sheikh.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="arabic-text text-muted-foreground">
                          {sheikh.rating}/5 ({sheikh.reviewCount} تقييم)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="arabic-text text-muted-foreground">{sheikh.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {sheikh.bio && (
                  <div>
                    <h3 className="arabic-heading font-semibold text-foreground text-lg mb-3">نبذة عن المأذون</h3>
                    <p className="arabic-text text-muted-foreground leading-relaxed">{sheikh.bio}</p>
                  </div>
                )}

                {sheikh.specialties && sheikh.specialties.length > 0 && (
                  <div>
                    <h3 className="arabic-heading font-semibold text-foreground text-lg mb-3">التخصصات</h3>
                    <div className="flex flex-wrap gap-2">
                      {sheikh.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary" className="arabic-text">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {sheikh.experience && (
                  <div>
                    <h3 className="arabic-heading font-semibold text-foreground text-lg mb-3">الخبرة</h3>
                    <p className="arabic-text text-muted-foreground">{sheikh.experience}</p>
                  </div>
                )}

                {sheikh.education && (
                  <div>
                    <h3 className="arabic-heading font-semibold text-foreground text-lg mb-3">المؤهلات العلمية</h3>
                    <p className="arabic-text text-muted-foreground">{sheikh.education}</p>
                  </div>
                )}

                {sheikh.languages && sheikh.languages.length > 0 && (
                  <div>
                    <h3 className="arabic-heading font-semibold text-foreground text-lg mb-3">اللغات</h3>
                    <div className="flex flex-wrap gap-2">
                      {sheikh.languages.map((language: string, index: number) => (
                        <Badge key={index} variant="outline" className="arabic-text">
                          <Languages className="w-3 h-3 ml-1" />
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {sheikh.ratings && (
                  <div>
                    <h3 className="arabic-heading font-semibold text-foreground text-lg mb-3">تقييمات مفصلة</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="arabic-text text-muted-foreground">الالتزام</span>
                        <div className="flex items-center gap-2">
                          <Progress value={sheikh.ratings.commitment * 20} className="w-20" />
                          <span className="arabic-text text-sm">{sheikh.ratings.commitment}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="arabic-text text-muted-foreground">سهولة التعامل</span>
                        <div className="flex items-center gap-2">
                          <Progress value={sheikh.ratings.ease * 20} className="w-20" />
                          <span className="arabic-text text-sm">{sheikh.ratings.ease}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="arabic-text text-muted-foreground">المعرفة الشرعية</span>
                        <div className="flex items-center gap-2">
                          <Progress value={sheikh.ratings.knowledge * 20} className="w-20" />
                          <span className="arabic-text text-sm">{sheikh.ratings.knowledge}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="arabic-text text-muted-foreground">الأسعار</span>
                        <div className="flex items-center gap-2">
                          <Progress value={sheikh.ratings.price * 20} className="w-20" />
                          <span className="arabic-text text-sm">{sheikh.ratings.price}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <ThumbsUp className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-2xl">آراء العملاء</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="approved" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="approved" className="arabic-text">التقييمات المعتمدة</TabsTrigger>
                    <TabsTrigger value="add-review" className="arabic-text">أضف تقييمك</TabsTrigger>
                  </TabsList>
                  <TabsContent value="approved" className="mt-6">
                    <ReviewsDisplay sheikhId={sheikh.id} />
                  </TabsContent>
                  <TabsContent value="add-review" className="mt-6">
                    <ReviewForm 
                      sheikhId={sheikh.id} 
                      sheikhName={sheikh.name}
                      sheikhImage={sheikh.image}
                      onSuccess={handleReviewSuccess}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-xl">معلومات التواصل</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="arabic-text font-medium text-foreground" dir="ltr">{sheikh.phone}</p>
                    <p className="arabic-text text-sm text-muted-foreground">الهاتف</p>
                  </div>
                </div>
                {sheikh.whatsapp && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="arabic-text font-medium text-foreground" dir="ltr">{sheikh.whatsapp}</p>
                      <p className="arabic-text text-sm text-muted-foreground">واتساب</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="arabic-text font-medium text-foreground">{sheikh.city}</p>
                    <p className="arabic-text text-sm text-muted-foreground">المدينة</p>
                  </div>
                </div>
                {sheikh.price && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="arabic-text font-medium text-foreground">{sheikh.price} ريال</p>
                      <p className="arabic-text text-sm text-muted-foreground">سعر الخدمة</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

       
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
