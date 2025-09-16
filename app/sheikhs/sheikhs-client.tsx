"use client"

import { useState, useEffect } from "react"
import { SheikhCard } from "@/components/sheikh-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheikh } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Award, Star, Search } from "lucide-react"
import Link from "next/link"
import { SheikhsSearchFilter } from "@/components/sheikhs-search-filter"

interface SheikhsClientProps {
  initialSheikhs: Sheikh[]
  cities: any[]
}

export function SheikhsClient({ initialSheikhs, cities }: SheikhsClientProps) {
  const [filteredSheikhs, setFilteredSheikhs] = useState<Sheikh[]>(initialSheikhs)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')

  useEffect(() => {
    let filtered = [...initialSheikhs]

    if (searchQuery) {
      filtered = filtered.filter(sheikh => 
        sheikh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sheikh.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sheikh.specialties.some((specialty: string) => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(sheikh => sheikh.citySlug === selectedCity)
    }

    setFilteredSheikhs(filtered)
  }, [initialSheikhs, searchQuery, selectedCity])

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
          <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-islamic">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="ابحث عن مأذون أو مدينة أو تخصص..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 arabic-text"
                    />
                  </div>
                </div>
                <div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="arabic-text">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المدن</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city._id || city.slug} value={city.slug}>
                          {city.name} ({city.count || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search Results Summary */}
        {(searchQuery || selectedCity !== 'all') && (
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
                      setSearchQuery('')
                      setSelectedCity('all')
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

          {cities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {cities.map((city) => (
                <Link key={city.slug || city._id} href={`/city/${city.slug}`}>
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
                        {city.count || city.sheikhCount || 0} مأذون
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="max-w-md mx-auto">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold arabic-heading text-foreground mb-2">
                  لا توجد مدن متاحة حالياً
                </h3>
                <p className="text-sm arabic-text text-muted-foreground">
                  نعمل على إضافة المدن قريباً
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sheikhs Grid */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              {(searchQuery || selectedCity !== 'all') ? 'نتائج البحث' : 'جميع المأذونين المتاحين'}
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              {(searchQuery || selectedCity !== 'all')
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
                  setSearchQuery('')
                  setSelectedCity('all')
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