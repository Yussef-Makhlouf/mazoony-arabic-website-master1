import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Star, ArrowRight, Building2, Globe, Award } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cityAPI } from "@/lib/api"

// Get data from APIs
async function getCitiesPageData() {
  try {
    const allCities = await cityAPI.getAll() as any[]
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
      <div className="absolute inset-0 bg-background/95"></div>
      <div className="relative z-10">
      <NavBar />
      
      {/* Header Section - Simple Islamic Design */}
      <header className="relative overflow-hidden bg-card border-b-2 border-primary/20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: "url('/decor2.jpg')" }}
        ></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            {/* Simple Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 border-2 border-primary/20">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            
            {/* Simple Title */}
            <h1 className="text-4xl md:text-6xl font-bold arabic-heading text-primary mb-6">
              المدن المتاحة
            </h1>
            
            {/* Simple Description */}
            <p className="text-xl arabic-text text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              اكتشف المأذونين الشرعيين المعتمدين في جميع مدن المملكة العربية السعودية
            </p>
            
            {/* Simple Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-base">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="arabic-text text-foreground">{allCities.length} مدينة متاحة</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <Users className="h-5 w-5 text-secondary" />
                <span className="arabic-text text-foreground">{allCities.reduce((sum, city) => sum + city.count, 0)} مأذون</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <Star className="h-5 w-5 text-accent" />
                <span className="arabic-text text-foreground">تغطية شاملة</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Featured Cities - Simple Design */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 mb-4">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">المدن المميزة</span>
            </div>
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              المدن الرئيسية
            </h2>
            <p className="text-lg arabic-text text-muted-foreground max-w-2xl mx-auto">
              أكبر المدن وأكثرها نشاطاً في خدمات المأذونين الشرعيين
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCities.map((city: any) => (
              <Link key={city.id} href={`/city/${city.slug}`}>
                <Card className="bg-card border-2 border-primary/20 cursor-pointer shadow-lg hover:shadow-xl">
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-lg font-medium border border-secondary/30">
                      مميزة
                    </div>
                  </div>
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl arabic-heading text-foreground mb-2 font-bold">
                      {city.name}
                    </CardTitle>
                    <CardDescription className="arabic-text text-muted-foreground mb-2">
                      {city.region}
                    </CardDescription>
                    <p className="text-sm arabic-text text-muted-foreground leading-relaxed px-2">
                      {city.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="text-center pt-0">
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 bg-primary/10 px-3 py-2 rounded-lg border border-primary/20">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="arabic-text text-foreground">{city.count} مأذون</span>
                      </div>
                      <div className="flex items-center gap-1 bg-secondary/10 px-3 py-2 rounded-lg border border-secondary/20">
                        <Star className="w-4 h-4 text-secondary" />
                        <span className="arabic-text text-foreground">{city.population}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full arabic-text border-primary/30 bg-transparent font-medium py-2"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      عرض المأذونين
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Cities by Region - Simple Design */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg border border-accent/20 mb-4">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">التصنيف حسب المناطق</span>
            </div>
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              جميع المدن حسب المناطق
            </h2>
            <p className="text-lg arabic-text text-muted-foreground max-w-2xl mx-auto">
              تصفح المدن حسب المناطق الإدارية في المملكة
            </p>
          </div>

          <div className="space-y-12">
            {regions.map((region: any) => (
              <div key={region.name} className="relative">
                {/* Region Header - Simple Design */}
                <div className="text-center mb-8">
                  <div className="border-b-2 border-primary/20 pb-4 mb-6">
                    <h3 className="text-2xl font-bold arabic-heading text-foreground mb-2">
                      {region.name}
                    </h3>
                    <div className="flex items-center justify-center gap-4 text-muted-foreground arabic-text">
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        {region.cities.length} مدينة
                      </span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary" />
                        {region.cities.reduce((sum: any, city: any) => sum + city.count, 0)} مأذون
                      </span>
                    </div>
                  </div>
                </div>

                {/* City Grid - Simple Design */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {region.cities.map((city: any) => (
                    <Link key={city.id} href={`/city/${city.slug}`}>
                      <Card className="bg-card border border-border cursor-pointer shadow-md hover:shadow-lg">
                        <CardHeader className="text-center pb-3">
                          <div className="flex justify-center mb-3">
                            <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <CardTitle className="text-lg arabic-heading text-foreground mb-2 font-semibold">
                            {city.name}
                          </CardTitle>
                          <CardDescription className="arabic-text text-muted-foreground">
                            {city.count} مأذون متاح
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="text-center pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full arabic-text border-primary/30 bg-transparent font-medium"
                          >
                            <ArrowRight className="w-4 h-4 ml-2" />
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

        {/* CTA Section - Simple Design */}
        <section className="mt-16">
          <Card className="bg-card border-2 border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 border border-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl arabic-heading text-foreground mb-4 font-bold">
                لم تجد مدينتك؟
              </CardTitle>
              <CardDescription className="text-lg arabic-text text-muted-foreground max-w-2xl mx-auto">
                تواصل معنا لإضافة مدينتك إلى قائمة المدن المتاحة أو للاستفسار عن المأذونين في منطقتك
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4 arabic-text bg-primary text-primary-foreground" asChild>
                  <Link href="/contact">
                    <MapPin className="w-5 h-5 ml-2" />
                    تواصل معنا
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 arabic-text border-2 border-primary/30 bg-transparent" asChild>
                  <Link href="/sheikhs">
                    <Users className="w-5 h-5 ml-2" />
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
