"use client"

import { useState } from "react"
import { SheikhCard } from "@/components/sheikh-card"
import { SheikhsSearchFilter } from "@/components/sheikhs-search-filter"
import { Sheikh } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Award, Star, Search } from "lucide-react"
import Link from "next/link"

interface SheikhsClientProps {
  initialSheikhs: Sheikh[]
  cities: any[]
}

export function SheikhsClient({ initialSheikhs, cities }: SheikhsClientProps) {
  const [filteredSheikhs, setFilteredSheikhs] = useState<Sheikh[]>(initialSheikhs)
  const [searchActive, setSearchActive] = useState(false)

  const handleResultsChange = (sheikhs: Sheikh[]) => {
    setFilteredSheikhs(sheikhs)
    setSearchActive(sheikhs.length !== initialSheikhs.length)
  }

  return (
    <>
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
                <span className="arabic-text">{filteredSheikhs.length} مأذون متاح</span>
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
          <SheikhsSearchFilter 
            onResultsChange={handleResultsChange}
            initialSheikhs={initialSheikhs}
          />
        </section>

        {/* Search Results Summary */}
        {searchActive && (
          <section className="mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="arabic-text text-sm text-muted-foreground">
                      تم العثور على
                    </span>
                    <span className="font-semibold text-primary">
                      {filteredSheikhs.length}
                    </span>
                    <span className="arabic-text text-sm text-muted-foreground">
                      مأذون
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFilteredSheikhs(initialSheikhs)
                      setSearchActive(false)
                    }}
                    className="arabic-text"
                  >
                    عرض الكل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

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
                      {city.count || city.sheikhCount} مأذون
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
              {searchActive ? 'نتائج البحث' : 'جميع المأذونين المتاحين'}
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              {searchActive 
                ? `تم العثور على ${filteredSheikhs.length} مأذون يطابقون معايير البحث`
                : 'اختر المأذون المناسب لك واتصل به مباشرة'
              }
            </p>
          </div>

          {filteredSheikhs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold arabic-heading text-foreground mb-2">
                لم يتم العثور على نتائج
              </h3>
              <p className="text-muted-foreground arabic-text mb-4">
                جرب تغيير معايير البحث أو إزالة بعض الفلاتر
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilteredSheikhs(initialSheikhs)
                  setSearchActive(false)
                }}
                className="arabic-text"
              >
                عرض جميع المأذونين
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSheikhs.map((sheikh) => (
                <SheikhCard 
                  key={sheikh._id || sheikh.slug} 
                  sheikh={{
                    ...sheikh,
                    id: sheikh._id || sheikh.slug
                  }} 
                  variant="default" 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
