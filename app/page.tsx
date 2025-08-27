import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Star, Shield, Users, Award, CheckCircle, ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import { SheikhCard } from "@/components/sheikh-card"
import { NavBar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { settingsAPI } from "@/lib/api"
import { cityAPI, sheikhAPI } from "@/lib/api"

// Get data from APIs
async function getHomePageData() {
  try {
    const [cities, allSheikhs] = await Promise.all([
      cityAPI.getFeatured(),
      sheikhAPI.getAll()
    ])
    
    const featuredSheikhs = allSheikhs.slice(0, 3) // Get first 3 sheikhs as featured
    
    return { cities, featuredSheikhs }
  } catch (error) {
    console.error('Error fetching home page data:', error)
    // Return empty arrays as fallback
    return { cities: [], featuredSheikhs: [] }
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
  const { cities, featuredSheikhs } = await getHomePageData()
  const settings = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/settings`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({} as any))
  const wa = settings?.whatsappNumber || '966501234567'
  
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredSheikhs.map((sheikh) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city) => (
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
                      {city.count} مأذون متاح
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
        </section>

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


        {/* CTA Section */}
        <section className="py-16">
          <Card className="relative overflow-hidden shadow-islamic border-0">
            <div className="absolute inset-0 gradient-islamic opacity-5"></div>
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <CardHeader className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl arabic-heading text-foreground mb-4">
                احصل على استشارة مجانية
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                تواصل معنا الآن واحصل على استشارة مجانية حول خدمات توثيق عقود الزواج
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 arabic-text shadow-islamic group" asChild>
                  <Link href="/contact">
                    <Phone className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    تواصل معنا الآن
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 arabic-text bg-transparent group" asChild>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    واتساب مباشر
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
