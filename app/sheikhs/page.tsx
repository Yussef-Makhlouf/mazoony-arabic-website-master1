import { SheikhCard } from "@/components/sheikh-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Users, 
  Star, 
  Filter, 
  Award,
  Phone,
  MessageCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { sheikhAPI, cityAPI } from "@/lib/api"

// Get data from APIs
async function getSheikhsPageData() {
  try {
    const [allSheikhs, cities] = await Promise.all([
      sheikhAPI.getAll(),
      cityAPI.getAll()
    ])
    
    return { allSheikhs, cities }
  } catch (error) {
    console.error('Error fetching sheikhs page data:', error)
    return { allSheikhs: [], cities: [] }
  }
}

export default async function SheikhsPage() {
  const { allSheikhs, cities } = await getSheikhsPageData()
  return (
    <div 
      className="min-h-screen bg-background rtl relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/decor2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
      <div className="relative z-10">
      <NavBar />
      
      {/* Header Section */}
      <header className="relative overflow-hidden bg-card border-b border-border">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('./decor2.jpg')" }}
      ></div>
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold arabic-heading text-primary mb-4">
              جميع المأذونين الشرعيين
            </h1>
            <p className="text-xl arabic-text text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              تعرف على نخبة من أفضل المأذونين الشرعيين المعتمدين في جميع مدن المملكة العربية السعودية
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="arabic-text">{allSheikhs.length} مأذون متاح</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                <span className="arabic-text">معتمدين ومرخصين</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="arabic-text">تقييمات عالية</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <section className="mb-12">
          <Card className="shadow-islamic border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="arabic-heading text-foreground text-2xl mb-2">
                ابحث عن المأذون المناسب لك
              </CardTitle>
              <CardDescription className="arabic-text text-muted-foreground">
                استخدم الفلاتر للعثور على المأذون الأنسب لاحتياجاتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم أو التخصص..."
                    className="pr-10 arabic-text bg-background"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="arabic-text bg-transparent">
                    <Filter className="w-4 h-4 ml-2" />
                    متاح الآن
                  </Button>
                  <Button variant="outline" size="sm" className="arabic-text bg-transparent">
                    <Award className="w-4 h-4 ml-2" />
                    معتمد فقط
                  </Button>
                  <Button variant="outline" size="sm" className="arabic-text bg-transparent">
                    <Star className="w-4 h-4 ml-2" />
                    الأعلى تقييماً
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cities Quick Access */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              اختر مدينتك للعثور على المأذونين
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              نوفر لك قائمة شاملة بأفضل المأذونين في جميع مدن المملكة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {cities.map((city) => (
              <Link key={city.slug} href={`/city/${city.slug}`}>
                <Card className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm cursor-pointer group text-center">
                  <CardContent className="p-4">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold arabic-heading text-foreground mb-1 group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm arabic-text text-muted-foreground">
                      {city.count} مأذون
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Sheikhs Grid */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              جميع المأذونين المتاحين
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              اختر المأذون المناسب لك واتصل به مباشرة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allSheikhs.map((sheikh) => (
              <SheikhCard key={sheikh._id || sheikh.slug} sheikh={sheikh} variant="default" />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20">
          <Card className="relative overflow-hidden shadow-islamic border-0">
            <div className="absolute inset-0 gradient-islamic opacity-5"></div>
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <CardHeader className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl arabic-heading text-foreground mb-4">
                هل أنت مأذون شرعي؟
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                انضم إلى منصتنا وتواصل مع آلاف العملاء الباحثين عن خدماتك المتميزة
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="https://wa.me/966555555555">
                  <Button size="lg" className="text-lg px-8 py-6 arabic-text shadow-islamic group">
                    <Users className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    سجل معنا الآن
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="tel:+966555555555">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 arabic-text bg-transparent group">
                    <Phone className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    تعرف على المزايا
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
      </div>
    </div>
  )
}
