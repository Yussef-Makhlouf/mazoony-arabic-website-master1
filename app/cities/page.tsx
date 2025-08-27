import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Star, ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cityAPI } from "@/lib/api"

// Get data from APIs
async function getCitiesPageData() {
  try {
    const allCities = await cityAPI.getAll()
    const featuredCities = allCities.filter(city => city.featured)
    const otherCities = allCities.filter(city => !city.featured)
    
    // Group cities by region
    const regions = allCities.reduce((acc, city) => {
      if (!acc[city.region]) {
        acc[city.region] = []
      }
      acc[city.region].push(city)
      return acc
    }, {} as Record<string, any[]>)

    const regionsArray = Object.entries(regions).map(([name, cities]) => ({
      name,
      cities
    }))
    
    return { allCities, featuredCities, otherCities, regions: regionsArray }
  } catch (error) {
    console.error('Error fetching cities page data:', error)
    return { allCities: [], featuredCities: [], otherCities: [], regions: [] }
  }
}

export default async function CitiesPage() {
  const { allCities, featuredCities, otherCities, regions } = await getCitiesPageData()

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
        style={{ backgroundImage: "url('/decor2.jpg')" }}
      ></div>
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold arabic-heading text-primary mb-4">
              المدن المتاحة
            </h1>
            <p className="text-xl arabic-text text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              اكتشف المأذونين الشرعيين المعتمدين في جميع مدن المملكة العربية السعودية
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="arabic-text">{allCities.length} مدينة متاحة</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="arabic-text">{allCities.reduce((sum, city) => sum + city.count, 0)} مأذون</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="arabic-text">تغطية شاملة</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Featured Cities */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              المدن الرئيسية
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              أكبر المدن وأكثرها نشاطاً في خدمات المأذونين الشرعيين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCities.map((city) => (
              <Link key={city.id} href={`/city/${city.slug}`}>
                <Card className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm cursor-pointer group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      مميزة
                    </div>
                  </div>
                  
                  <CardHeader className="text-center relative">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl arabic-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                      {city.name}
                    </CardTitle>
                    <CardDescription className="arabic-text text-muted-foreground mb-2">
                      {city.region}
                    </CardDescription>
                    <p className="text-sm arabic-text text-muted-foreground leading-relaxed">
                      {city.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="text-center relative">
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="arabic-text">{city.count} مأذون</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-secondary" />
                        <span className="arabic-text">{city.population}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 arabic-text border-primary/20 bg-transparent"
                    >
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      عرض المأذونين
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Cities by Region */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              جميع المدن حسب المناطق
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              تصفح المدن حسب المناطق الإدارية في المملكة
            </p>
          </div>

          <div className="space-y-12">
            {regions.map((region) => (
              <div key={region.name}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold arabic-heading text-foreground mb-2">
                    {region.name}
                  </h3>
                  <p className="text-muted-foreground arabic-text">
                    {region.cities.length} مدينة • {region.cities.reduce((sum, city) => sum + city.count, 0)} مأذون
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {region.cities.map((city) => (
                    <Link key={city.id} href={`/city/${city.slug}`}>
                      <Card className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm cursor-pointer group">
                        <CardHeader className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                              <MapPin className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <CardTitle className="text-lg arabic-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                            {city.name}
                          </CardTitle>
                          <CardDescription className="arabic-text text-muted-foreground">
                            {city.count} مأذون متاح
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 arabic-text border-primary/20 bg-transparent"
                          >
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            عرض المأذونين
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
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
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl arabic-heading text-foreground mb-4">
                لم تجد مدينتك؟
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                تواصل معنا لإضافة مدينتك إلى قائمة المدن المتاحة أو للاستفسار عن المأذونين في منطقتك
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 arabic-text shadow-islamic group" asChild>
                  <Link href="/contact">
                    <MapPin className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    تواصل معنا
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 arabic-text bg-transparent group" asChild>
                  <Link href="/sheikhs">
                    <Users className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    عرض جميع المأذونين
                  </Link>
                </Button>
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
