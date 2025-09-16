"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Filter, 
  X, 
  Star, 
  Shield, 
  Award,
  Clock,
  Users
} from "lucide-react"
import { debounce } from "@/lib/utils"

interface SheikhsSearchFilterProps {
  onSearch: (filters: {
    search: string
    city: string
    specialization: string
    rating: number
    verified: boolean
    available: boolean
    featured: boolean
  }) => void
  cities: Array<{ name: string; slug: string; count: number }>
  specializations: string[]
  isLoading?: boolean
}

export function SheikhsSearchFilter({ 
  onSearch, 
  cities, 
  specializations, 
  isLoading = false 
}: SheikhsSearchFilterProps) {
  const [search, setSearch] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [verified, setVerified] = useState(false)
  const [available, setAvailable] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  const debouncedSearch = debounce((filters: any) => {
    onSearch(filters)
  }, 300)

  useEffect(() => {
    debouncedSearch({
      search,
      city: selectedCity,
      specialization: selectedSpecialization,
      rating: minRating,
      verified,
      available,
      featured
    })
  }, [search, selectedCity, selectedSpecialization, minRating, verified, available, featured])

  const clearFilters = () => {
    setSearch("")
    setSelectedCity("")
    setSelectedSpecialization("")
    setMinRating(0)
    setVerified(false)
    setAvailable(false)
    setFeatured(false)
  }

  const hasActiveFilters = search || selectedCity || selectedSpecialization || minRating > 0 || verified || available || featured

  return (
    <Card className="mb-8 shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن مأذون، تخصص، أو مدينة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-12 h-12 text-lg arabic-text bg-white border-2 border-primary/20 rounded-xl focus:border-primary shadow-sm"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-6 arabic-text border-2 border-primary/20 hover:border-primary rounded-xl"
          >
            <Filter className="w-5 h-5 ml-2" />
            {showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-6">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium arabic-text text-foreground mb-3">
                <MapPin className="w-4 h-4 inline ml-1" />
                المدينة
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant={selectedCity === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity("")}
                  className="arabic-text justify-start"
                >
                  جميع المدن
                </Button>
                {cities.map((city) => (
                  <Button
                    key={city.slug}
                    variant={selectedCity === city.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCity(city.slug)}
                    className="arabic-text justify-start"
                  >
                    {city.name}
                    <Badge variant="secondary" className="mr-2 text-xs">
                      {city.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium arabic-text text-foreground mb-3">
                <Award className="w-4 h-4 inline ml-1" />
                التخصص
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant={selectedSpecialization === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialization("")}
                  className="arabic-text justify-start"
                >
                  جميع التخصصات
                </Button>
                {specializations.map((spec) => (
                  <Button
                    key={spec}
                    variant={selectedSpecialization === spec ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialization(spec)}
                    className="arabic-text justify-start"
                  >
                    {spec}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium arabic-text text-foreground mb-3">
                <Star className="w-4 h-4 inline ml-1" />
                الحد الأدنى للتقييم
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={minRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinRating(rating)}
                    className="arabic-text"
                  >
                    {rating === 0 ? 'جميع التقييمات' : `${rating}+`}
                    {rating > 0 && <Star className="w-3 h-3 mr-1" />}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium arabic-text text-foreground mb-3">
                <Filter className="w-4 h-4 inline ml-1" />
                فلاتر سريعة
              </label>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={verified ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVerified(!verified)}
                  className="arabic-text"
                >
                  <Shield className="w-4 h-4 ml-1" />
                  معتمد فقط
                </Button>
                
                <Button
                  variant={available ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAvailable(!available)}
                  className="arabic-text"
                >
                  <Clock className="w-4 h-4 ml-1" />
                  متاح الآن
                </Button>
                
                <Button
                  variant={featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFeatured(!featured)}
                  className="arabic-text"
                >
                  <Award className="w-4 h-4 ml-1" />
                  مميز فقط
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-center pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="arabic-text text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 ml-2" />
                  مسح جميع الفلاتر
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium arabic-text text-muted-foreground">الفلاتر النشطة:</span>
              
              {search && (
                <Badge variant="secondary" className="arabic-text">
                  البحث: {search}
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setSearch("")}
                  />
                </Badge>
              )}
              
              {selectedCity && (
                <Badge variant="secondary" className="arabic-text">
                  المدينة: {cities.find(c => c.slug === selectedCity)?.name}
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setSelectedCity("")}
                  />
                </Badge>
              )}
              
              {selectedSpecialization && (
                <Badge variant="secondary" className="arabic-text">
                  التخصص: {selectedSpecialization}
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setSelectedSpecialization("")}
                  />
                </Badge>
              )}
              
              {minRating > 0 && (
                <Badge variant="secondary" className="arabic-text">
                  التقييم: {minRating}+
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setMinRating(0)}
                  />
                </Badge>
              )}
              
              {verified && (
                <Badge variant="secondary" className="arabic-text">
                  معتمد
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setVerified(false)}
                  />
                </Badge>
              )}
              
              {available && (
                <Badge variant="secondary" className="arabic-text">
                  متاح
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setAvailable(false)}
                  />
                </Badge>
              )}
              
              {featured && (
                <Badge variant="secondary" className="arabic-text">
                  مميز
                  <X 
                    className="w-3 h-3 mr-1 cursor-pointer" 
                    onClick={() => setFeatured(false)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="arabic-text text-muted-foreground mr-3">جاري البحث...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}