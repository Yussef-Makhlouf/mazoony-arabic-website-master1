import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Star, Shield, Users, Award, CheckCircle, ArrowRight, MessageCircle, FileText, Calendar, User, Clock } from "lucide-react"
import Link from "next/link"
import { SheikhCard } from "@/components/sheikh-card"
import { NavBar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { articlesAPI, citiesAPI, sheikhsAPI, settingsAPI } from "@/lib/api"

// Get data from APIs
async function getHomePageData() {
  try {
    const [cities, allSheikhs, featuredArticles] = await Promise.all([
      citiesAPI.getAll(), // Get all cities instead of just featured
      sheikhsAPI.getAll(),
      articlesAPI.getAll({ status: 'published', featured: true, limit: 3 })
    ])
    
    // Ensure data is always an array to prevent filter errors
    const safeCities = Array.isArray(cities) ? cities : []
    const safeAllSheikhs = Array.isArray(allSheikhs) ? allSheikhs : []
    const safeFeaturedArticles = Array.isArray(featuredArticles) ? featuredArticles : []
    
    // Get featured sheikhs (verified or top-rated)
    const featuredSheikhs = safeAllSheikhs
      .filter(sheikh => sheikh.verified || sheikh.rating >= 4.5)
      .slice(0, 6) // Show up to 6 featured sheikhs
    
    // Get featured cities (those marked as featured or with most sheikhs)
    const featuredCities = safeCities
      .filter(city => city.featured || city.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Show up to 8 cities
    
    return { 
      cities: featuredCities, 
      featuredSheikhs, 
      featuredArticles: safeFeaturedArticles 
    }
  } catch (error) {
    console.error('Error fetching home page data:', error)
    // Return empty arrays - no static data
    return { cities: [], featuredSheikhs: [], featuredArticles: [] }
  }
}

const services = [
  {
    icon: Shield,
    title: "مأذونين معتمدين",
    description: "جميع المأذونين معتمدين ومرخصين رسمياً من الجهات المختصة في المملكة",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Star,
    title: "تقييمات موثوقة",
    description: "اقرأ تقييمات العملاء السابقين واختر المأذون الأنسب لك بثقة تامة",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Phone,
    title: "تواصل مباشر",
    description: "تواصل مباشر مع المأذون عبر الهاتف أو الواتساب لحجز موعدك بسهولة",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export default async function HomePage() {
  const { cities, featuredSheikhs, featuredArticles } = await getHomePageData()

  // تنسيق التاريخ
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'gregory'
    }).format(dateObj)
  }

  // جلب الإعدادات
  let wa = '966501234567'
  try {
    const settings = await settingsAPI.get()
    wa = settings?.whatsappNumber || '966501234567'
  } catch (error) {
    console.error('Error fetching settings:', error)
  }
  
  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      <HeroSection />

      <main className="container mx-auto px-4">
        {/* Featured Sheikhs Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold arabic-heading text-foreground mb-4">المأذونون المميزون</h2>
            <p className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
              تعرف على نخبة من أفضل المأذونين الشرعيين المعتمدين في المملكة
            </p>
          </div>

          {featuredSheikhs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredSheikhs.map((sheikh: any) => (
                  <SheikhCard
                    key={sheikh._id || sheikh.slug}
                    sheikh={sheikh}
                    variant="featured"
                  />
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg" className="arabic-text px-8 bg-transparent" asChild>
                  <Link href="/sheikhs">
                    عرض جميع المأذونين
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold arabic-heading text-foreground mb-4">لا توجد مأذونين متاحين حالياً</h3>
                <p className="text-lg arabic-text text-muted-foreground mb-8">
                  نعمل على إضافة المأذونين قريباً
                </p>
                <Button variant="outline" size="lg" className="arabic-text px-8 bg-transparent" asChild>
                  <Link href="/sheikhs">
                    عرض جميع المأذونين
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Cities Section */}
        <section className="text-center py-16 bg-muted/30 rounded-2xl mb-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold arabic-heading text-foreground mb-6">
              اختر مدينتك للعثور على أفضل المأذونين الشرعيين
            </h2>
            <p className="text-xl arabic-text text-muted-foreground mb-8 leading-relaxed">
              نوفر لك قائمة شاملة بأفضل المأذونين الشرعيين المعتمدين في جميع مدن المملكة العربية السعودية
            </p>
          </div>
        </section>

        <section className="pb-16">
          {cities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.map((city: any) => (
                <Link key={city._id || city.slug} href={`/city/${city.slug}`}>
                  <Card className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                          <MapPin className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl arabic-heading text-foreground mb-2">{city.name}</CardTitle>
                      <CardDescription className="arabic-text text-muted-foreground mb-4">
                        {city.count || 0} مأذون متاح
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 arabic-text border-primary/20 bg-transparent"
                      >
                        عرض المأذونين
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold arabic-heading text-foreground mb-4">لا توجد مدن متاحة حالياً</h3>
                <p className="text-lg arabic-text text-muted-foreground mb-8">
                  نعمل على إضافة المدن قريباً
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Blog Section */}
        {featuredArticles.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold arabic-heading text-foreground mb-4">أحدث المقالات</h2>
              <p className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                اكتشف أحدث المقالات والنصائح المفيدة حول المأذونين والزواج
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredArticles.map((article: any) => (
                <Link key={article._id} href={`/blog/${article.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-0 bg-card/50 backdrop-blur-sm">
                    {article.image && (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-primary-foreground">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="arabic-text">
                          {article.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors arabic-heading line-clamp-2">
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3 arabic-text flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span className="arabic-text">{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="arabic-text">{article.readingTime} دقائق</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-primary font-medium mt-4 arabic-text">
                        <span>اقرأ المزيد</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="arabic-text px-8 bg-transparent" asChild>
                <Link href="/blog">
                  <FileText className="w-5 h-5 ml-2" />
                  عرض جميع المقالات
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold arabic-heading text-foreground mb-6">لماذا تختار مأذوني؟</h2>
            <p className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
              نقدم لك أفضل الخدمات لضمان تجربة مميزة في توثيق عقد الزواج
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="text-center hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-center mb-6">
                      <div className={`p-4 ${service.bgColor} rounded-full`}>
                        <Icon className={`h-10 w-10 ${service.color}`} />
                      </div>
                    </div>
                    <CardTitle className="arabic-heading text-foreground text-2xl mb-4">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="arabic-text text-muted-foreground text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>



      </main>

      <Footer />
    </div>
  )
}
