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
        <div className="container mx-auto px-3 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">جاري تحميل بيانات المأذون...</p>
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
        <div className="container mx-auto px-3 py-6">
          <div className="text-center">
            <p className="text-red-600 text-sm sm:text-base">{error || 'المأذون غير موجود'}</p>
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
      
      {/* Header Section - Mobile Optimized */}
      <header className="relative overflow-hidden bg-card border-b border-border">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/decor2.jpg')" }}
      ></div>
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>

        <div className="relative container mx-auto px-3 py-3 sm:px-4 sm:py-4 md:py-6">
          {/* Back Navigation - Mobile Friendly */}
          <div className="flex items-center gap-2 mb-3">
            <Link
              href={`/city/${sheikh.citySlug}`}
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors arabic-text text-sm px-3 py-2 rounded-md hover:bg-primary/5 border border-primary/20"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="hidden sm:inline">العودة إلى {sheikh.city}</span>
              <span className="sm:hidden">العودة</span>
            </Link>
          </div>

          {/* Breadcrumb - Mobile Optimized */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors px-1 py-0.5 rounded hover:bg-primary/5">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href={`/city/${sheikh.citySlug}`} className="hover:text-primary transition-colors px-1 py-0.5 rounded hover:bg-primary/5">
              {sheikh.city}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[80px] sm:max-w-[120px] md:max-w-none px-1">
              {sheikh.name}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 md:py-6 lg:py-8">
  
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Main Content - Mobile First Layout */}
          <div className="xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Sheikh Profile Card - Mobile Optimized */}
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4">
                {/* Profile Header - Mobile Stacked Layout */}
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-right gap-3 sm:gap-4 md:gap-6">
                  {/* Profile Image Container */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      {sheikh.image ? (
                        <Image
                          src={sheikh.image}
                          alt={sheikh.name}
                          width={112}
                          height={112}
                          className="rounded-full object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-primary" />
                      )}
                    </div>
                    {sheikh.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Profile Info - Mobile Centered */}
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="flex flex-col items-center sm:items-start gap-2 mb-2 sm:mb-3">
                      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-xl font-bold arabic-heading text-foreground leading-tight text-center sm:text-right">
                        {sheikh.name}
                      </h1>
                      {sheikh.verified && (
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm px-3 py-1.5">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          معتمد
                        </Badge>
                      )}
                    </div>
                    
                    <p className="arabic-text text-muted-foreground text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-center sm:text-right">
                      {sheikh.city}
                    </p>
                    
                    {/* Rating and Availability - Mobile Stacked */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                i < sheikh.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="arabic-text text-muted-foreground text-xs sm:text-sm md:text-base">
                          {sheikh.rating}/5 ({sheikh.reviewCount} تقييم)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="arabic-text text-muted-foreground text-xs sm:text-sm md:text-base">
                          {sheikh.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Profile Content - Mobile Optimized Spacing */}
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0 space-y-4 sm:space-y-5 md:space-y-6">
                
                {/* About Section */}
                {sheikh.bio && (
                  <div className="border-t border-border/50 pt-4 sm:pt-5 md:pt-6">
                    <h3 className="arabic-heading font-semibold text-foreground text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-center sm:text-right">
                      نبذة عن المأذون
                    </h3>
                    <p className="arabic-text text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base text-center sm:text-right">
                      {sheikh.bio}
                    </p>
                  </div>
                )}

                {/* Specializations */}
                {sheikh.specialties && sheikh.specialties.length > 0 && (
                  <div className="border-t border-border/50 pt-4 sm:pt-5 md:pt-6">
                    <h3 className="arabic-heading font-semibold text-foreground text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-center sm:text-right">
                      التخصصات
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {sheikh.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary" className="arabic-text text-xs sm:text-sm px-3 py-1.5">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {sheikh.experience && (
                  <div className="border-t border-border/50 pt-4 sm:pt-5 md:pt-6">
                    <h3 className="arabic-heading font-semibold text-foreground text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-center sm:text-right">
                      الخبرة
                    </h3>
                    <p className="arabic-text text-muted-foreground text-xs sm:text-sm md:text-base text-center sm:text-right">
                      {sheikh.experience}
                    </p>
                  </div>
                )}

                {/* Education */}
                {sheikh.education && (
                  <div className="border-t border-border/50 pt-4 sm:pt-5 md:pt-6">
                    <h3 className="arabic-heading font-semibold text-foreground text-sm sm:text-base md:text-lg mb-2 sm:mb-3 text-center sm:text-right">
                      المؤهلات العلمية
                    </h3>
                    <p className="arabic-text text-muted-foreground text-xs sm:text-sm md:text-base text-center sm:text-right">
                      {sheikh.education}
                    </p>
                  </div>
                )}

                {/* Languages */}
                {sheikh.languages && sheikh.languages.length > 0 && (
                  <div className="border-t border-border/50 pt-4 sm:pt-5 md:pt-6">
                    <h3 className="arabic-heading font-semibold text-foreground text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-center sm:text-right">
                      اللغات
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {sheikh.languages.map((language: string, index: number) => (
                        <Badge key={index} variant="outline" className="arabic-text text-xs sm:text-sm px-3 py-1.5">
                          <Languages className="w-3 h-3 ml-1" />
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Ratings */}
                {sheikh.ratings && (
                  <div className="border-t border-border/50 pt-4 sm:pt-5 md:pt-6">
                    <h3 className="arabic-heading font-semibold text-foreground text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-center sm:text-right">
                      تقييمات مفصلة
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { label: 'الالتزام', value: sheikh.ratings.commitment },
                        { label: 'سهولة التعامل', value: sheikh.ratings.ease },
                        { label: 'المعرفة الشرعية', value: sheikh.ratings.knowledge },
                        { label: 'الأسعار', value: sheikh.ratings.price }
                      ].map((rating, index) => (
                        <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="arabic-text text-muted-foreground text-xs sm:text-sm md:text-base text-center sm:text-right">
                            {rating.label}
                          </span>
                          <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <Progress value={rating.value * 20} className="w-20 sm:w-24 md:w-28" />
                            <span className="arabic-text text-xs sm:text-sm min-w-[2rem] text-center">
                              {rating.value}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section - Mobile Optimized */}
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4">
                <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-secondary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-lg sm:text-xl md:text-2xl text-center sm:text-right">
                    آراء العملاء
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                <Tabs defaultValue="approved" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-11 sm:h-12">
                    <TabsTrigger value="approved" className="arabic-text text-xs sm:text-sm px-2 sm:px-4">
                      التقييمات المعتمدة
                    </TabsTrigger>
                    <TabsTrigger value="add-review" className="arabic-text text-xs sm:text-sm px-2 sm:px-4">
                      أضف تقييمك
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="approved" className="mt-3 sm:mt-4 md:mt-6">
                    <ReviewsDisplay sheikhId={sheikh._id} />
                  </TabsContent>
                  <TabsContent value="add-review" className="mt-3 sm:mt-4 md:mt-6">
                    <ReviewForm 
                      sheikhId={sheikh._id} 
                      sheikhName={sheikh.name}
                      sheikhImage={sheikh.image}
                      onSuccess={handleReviewSuccess}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile Stacked Below */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            
            {/* Contact Information Card - Mobile Optimized */}
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4">
                <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-base sm:text-lg md:text-xl text-center sm:text-right">
                    معلومات التواصل
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0 space-y-3 sm:space-y-4">
                
                {/* Phone */}
                <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-background/50">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="arabic-text font-medium text-foreground text-xs sm:text-sm md:text-base break-all text-center sm:text-right" dir="ltr">
                      {sheikh.phone}
                    </p>
                    <p className="arabic-text text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                      الهاتف
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                {sheikh.whatsapp && (
                  <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-background/50">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="arabic-text font-medium text-foreground text-xs sm:text-sm md:text-base break-all text-center sm:text-right" dir="ltr">
                        {sheikh.whatsapp}
                      </p>
                      <p className="arabic-text text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                        واتساب
                      </p>
                    </div>
                  </div>
                )}

                {/* City */}
                <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-background/50">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="arabic-text font-medium text-foreground text-xs sm:text-sm md:text-base text-center sm:text-right">
                      {sheikh.city}
                    </p>
                    <p className="arabic-text text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                      المدينة
                    </p>
                  </div>
                </div>

                {/* Price */}
                {sheikh.price && (
                  <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-background/50">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="arabic-text font-medium text-foreground text-xs sm:text-sm md:text-base text-center sm:text-right">
                        {sheikh.price} ريال
                      </p>
                      <p className="arabic-text text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                        سعر الخدمة
                      </p>
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
