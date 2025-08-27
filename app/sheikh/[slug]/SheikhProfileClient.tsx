"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { getAllSheikhs } from "@/lib/data"
import { ClientPageProps } from "@/lib/types"

// Get all sheikhs from central data
const allSheikhs = getAllSheikhs()

export default function SheikhProfileClient({ params }: ClientPageProps) {
  const { slug } = params
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    message: "",
  })

  // Find the sheikh
  const sheikh = allSheikhs.find((s) => s.slug === slug)
  if (!sheikh) {
    notFound()
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
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-y-12 translate-x-12"></div>

              <CardHeader className="text-center relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                      <Image
                        src="/professional-arabic-sheikh-portrait.png"
                        alt={sheikh.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>

                <CardTitle className="text-2xl arabic-heading text-foreground mb-3">{sheikh.name}</CardTitle>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="arabic-text text-muted-foreground font-medium">{sheikh.city}</span>
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-6 w-6 fill-secondary text-secondary" />
                    <span className="font-bold text-2xl text-foreground">{sheikh.rating}</span>
                  </div>
                  <span className="text-muted-foreground arabic-text">({sheikh.reviewCount} تقييم)</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {sheikh.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 bg-primary/10 text-primary border-primary/20 arabic-text"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm mb-6">
               
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span
                      className={`arabic-text font-medium ${sheikh.availability === "متاح" ? "text-green-600" : "text-orange-600"}`}
                    >
                      {sheikh.availability}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button
                  size="lg"
                  className="w-full flex items-center gap-2 text-lg py-6 arabic-text shadow-islamic hover-lift"
                  onClick={() => window.open(`tel:${sheikh.phone}`, "_self")}
                >
                  <Phone className="h-5 w-5" />
                  اتصال مباشر
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center gap-2 text-lg py-6 arabic-text bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={() => window.open(`https://wa.me/${sheikh.whatsapp.replace("+", "")}`, "_blank")}
                >
                  <MessageCircle className="h-5 w-5" />
                  واتساب
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-2xl">نبذة عن الشيخ</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="arabic-text text-muted-foreground leading-relaxed text-lg">{sheikh.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold arabic-heading text-foreground">المؤهل العلمي</h4>
                    </div>
                    <p className="arabic-text text-muted-foreground pr-8">{sheikh.education}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Languages className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold arabic-heading text-foreground">اللغات</h4>
                    </div>
                    <p className="arabic-text text-muted-foreground pr-8">{sheikh.languages.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <Star className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-2xl">التقييمات التفصيلية</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium arabic-text text-foreground">الالتزام بالمواعيد</span>
                    </div>
                    <div className="flex items-center gap-4 pr-11">
                      <Progress value={sheikh.ratings.commitment * 20} className="flex-1 h-3" />
                      <span className="font-bold text-xl text-foreground min-w-[3rem]">
                        {sheikh.ratings.commitment}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium arabic-text text-foreground">التسهيل في الأداء</span>
                    </div>
                    <div className="flex items-center gap-4 pr-11">
                      <Progress value={sheikh.ratings.ease * 20} className="flex-1 h-3" />
                      <span className="font-bold text-xl text-foreground min-w-[3rem]">{sheikh.ratings.ease}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium arabic-text text-foreground">المعرفة والشرح</span>
                    </div>
                    <div className="flex items-center gap-4 pr-11">
                      <Progress value={sheikh.ratings.knowledge * 20} className="flex-1 h-3" />
                      <span className="font-bold text-xl text-foreground min-w-[3rem]">{sheikh.ratings.knowledge}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium arabic-text text-foreground">السعر</span>
                    </div>
            
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-full">
                    <Send className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="arabic-heading text-foreground text-2xl">طلب معاودة الاتصال</CardTitle>
                    <CardDescription className="arabic-text text-muted-foreground text-lg mt-2">
                      املأ النموذج وسيتواصل معك الشيخ في أقرب وقت ممكن
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="arabic-text font-medium text-foreground">
                        الاسم الكامل
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="arabic-text bg-background border-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="arabic-text font-medium text-foreground">
                        رقم الهاتف
                      </Label>
                      <Input
                        id="phone"
                        placeholder="05xxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="arabic-text bg-background border-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="city" className="arabic-text font-medium text-foreground">
                      المدينة
                    </Label>
                    <Input
                      id="city"
                      placeholder="أدخل مدينتك"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="arabic-text bg-background border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="message" className="arabic-text font-medium text-foreground">
                      الرسالة
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا..."
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="arabic-text bg-background border-primary/20 focus:border-primary resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full text-lg py-6 arabic-text shadow-islamic hover-lift">
                    <Send className="h-5 w-5 ml-2" />
                    إرسال طلب المعاودة
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <MessageCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="arabic-heading text-foreground text-2xl">آراء العملاء</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {sheikh.reviews.map((review) => (
                  <div key={review.id} className="border border-border/50 rounded-xl p-6 bg-background/50 hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold arabic-heading text-foreground text-lg">{review.name}</h4>
                          <p className="text-sm text-muted-foreground">{review.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? "fill-secondary text-secondary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="arabic-text text-muted-foreground leading-relaxed text-lg mb-3">{review.comment}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
