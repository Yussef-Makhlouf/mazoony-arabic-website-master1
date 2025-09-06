"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, ArrowRight, Search, Users, Award, Star, Filter, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SheikhCard } from "@/components/sheikh-card"
import { useState, useEffect } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cityAPI, sheikhAPI } from "@/lib/api"
import { ClientPageProps } from "@/lib/types"

export default function CityClientPage({ params }: ClientPageProps) {
  const { slug } = params
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [city, setCity] = useState<any>(null)
  const [sheikhs, setSheikhs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch city data
        const cityData = await cityAPI.getBySlug(slug)
        if (!cityData) {
          notFound()
        }
        setCity(cityData)

        // Fetch sheikhs for this city
        const sheikhsData = await sheikhAPI.getByCity(slug)
        setSheikhs(sheikhsData)
        
      } catch (err) {
        console.error('Error fetching city data:', err)
        setError('حدث خطأ في تحميل البيانات')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل بيانات المدينة...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">{error || 'المدينة غير موجودة'}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Ensure sheikhs is always an array before filtering
  const safeSheikhs = Array.isArray(sheikhs) ? sheikhs : []
  const filteredSheikhs = safeSheikhs.filter((sheikh) => {
    const matchesSearch =
      sheikh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheikh.specialties?.some((s: string) => s.includes(searchTerm))

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "available" && sheikh.availability === "متاح") ||
      (selectedFilter === "verified" && sheikh.verified) ||
      (selectedFilter === "top-rated" && sheikh.rating >= 4.8)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      <header className="relative overflow-hidden bg-card border-b border-border">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/decor2.jpg')" }}
      ></div>
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors arabic-text"
            >
              <ArrowRight className="h-5 w-5" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold arabic-heading text-foreground mb-4">{city.name}</h1>
            <p className="text-xl arabic-text text-muted-foreground mb-6">
              المأذونين الشرعيين المعتمدين في {city.name}
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="arabic-text">{sheikhs.length} مأذون متاح</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                <span className="arabic-text">معتمدين ومرخصين</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/decor3.jpg')" }}
      ></div>
        {sheikhs.length > 0 ? (
          <>
            <section className="mb-12">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-islamic border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="arabic-heading text-foreground text-2xl mb-2">
                      ابحث عن المأذون المناسب لك
                    </CardTitle>
                    <CardDescription className="arabic-text text-muted-foreground">
                      استخدم الفلاتر للعثور على المأذون الأنسب لاحتياجاتك في {city.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="ابحث عن مأذون أو تخصص..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pr-10 arabic-text bg-background"
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
  {/* All */}
  <Button
    size="sm"
    onClick={() => setSelectedFilter("all")}
    className={`arabic-text transition-all duration-200 ${
      selectedFilter === "all"
        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
        : "bg-white text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:shadow-md"
    }`}
  >
    الكل
  </Button>

  {/* Available */}
  <Button
    size="sm"
    onClick={() => setSelectedFilter("available")}
    className={`arabic-text transition-all duration-200 flex items-center ${
      selectedFilter === "available"
        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
        : "bg-white text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:shadow-md"
    }`}
  >
    <Filter className="w-4 h-4 ml-2 text-current" />
    <span>متاح الآن</span>
  </Button>

  {/* Verified */}
  <Button
    size="sm"
    onClick={() => setSelectedFilter("verified")}
    className={`arabic-text transition-all duration-200 flex items-center ${
      selectedFilter === "verified"
        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
        : "bg-white text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:shadow-md"
    }`}
  >
    <Award className="w-4 h-4 ml-2 text-current" />
    <span>معتمد</span>
  </Button>

  {/* Top rated */}
  <Button
    size="sm"
    onClick={() => setSelectedFilter("top-rated")}
    className={`arabic-text transition-all duration-200 flex items-center ${
      selectedFilter === "top-rated"
        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
        : "bg-white text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:shadow-md"
    }`}
  >
    <Star className="w-4 h-4 ml-2 text-current" />
    <span>الأعلى تقييماً</span>
  </Button>
</div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
                  {filteredSheikhs.length > 0 ? `${filteredSheikhs.length} مأذون متاح` : "لا توجد نتائج"}
                </h2>
                {filteredSheikhs.length > 0 && (
                  <p className="text-lg arabic-text text-muted-foreground">اختر المأذون المناسب لك واتصل به مباشرة</p>
                )}
              </div>

              {filteredSheikhs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSheikhs.map((sheikh) => (
                    <SheikhCard key={sheikh.id || sheikh.slug} sheikh={sheikh} variant="default" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-2xl font-bold arabic-heading text-foreground mb-4">لا توجد نتائج مطابقة</h3>
                    <p className="text-lg arabic-text text-muted-foreground mb-8">جرب تغيير كلمات البحث أو الفلاتر</p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedFilter("all")
                      }}
                      variant="outline"
                      className="arabic-text bg-transparent text-green-700"
                    >
                      إعادة تعيين البحث
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold arabic-heading text-foreground mb-4">لا توجد بيانات متاحة حالياً</h2>
              <p className="text-lg arabic-text text-muted-foreground mb-8">
                نعمل على إضافة المأذونين في {city.name} قريباً
              </p>
              <Link href="/">
                <Button className="arabic-text text-green-700">العودة للرئيسية</Button>
              </Link>
            </div>
          </div>
        )}

        {/* {sheikhs.length > 0 && (
          <section className="mt-20">
            <Card className="relative overflow-hidden shadow-islamic border-0">
              <div className="absolute inset-0 gradient-islamic opacity-5"></div>
              <div className="absolute inset-0 islamic-pattern opacity-10"></div>
              <CardHeader className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl arabic-heading text-foreground mb-4">
                  هل أنت مأذون شرعي في {city.name}؟
                </CardTitle>
                <CardDescription className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                  انضم إلى منصتنا وتواصل مع آلاف العملاء الباحثين عن خدماتك المتميزة
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center relative">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6 arabic-text shadow-islamic group text-green-700">
                    <Users className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    سجل معنا الآن
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 arabic-text bg-transparent group text-green-700">
                    <Phone className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    تعرف على المزايا
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )} */}
      </main>

      <Footer />
    </div>
  )
}
