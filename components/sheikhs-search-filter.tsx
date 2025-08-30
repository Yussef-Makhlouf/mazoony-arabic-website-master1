"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, Award, Star } from "lucide-react"
import { sheikhAPI } from "@/lib/api"
import { Sheikh } from "@/lib/types"

interface SheikhsSearchFilterProps {
  onResultsChange: (sheikhs: Sheikh[]) => void
  initialSheikhs: Sheikh[]
}

export function SheikhsSearchFilter({ onResultsChange, initialSheikhs }: SheikhsSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    available: false,
    certified: false,
    topRated: false
  })
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, activeFilters: typeof filters) => {
      if (!query && !Object.values(activeFilters).some(Boolean)) {
        onResultsChange(initialSheikhs)
        return
      }

      setIsLoading(true)
      try {
        let results = initialSheikhs

        // Apply search filter
        if (query) {
          results = results.filter(sheikh => 
            sheikh.name?.toLowerCase().includes(query.toLowerCase()) ||
            sheikh.specialization?.toLowerCase().includes(query.toLowerCase()) ||
            sheikh.specialties?.some(spec => spec.toLowerCase().includes(query.toLowerCase())) ||
            sheikh.city?.toLowerCase().includes(query.toLowerCase())
          )
        }

        // Apply availability filter
        if (activeFilters.available) {
          results = results.filter(sheikh => sheikh.isAvailable || sheikh.availability === 'متاح')
        }

        // Apply certification filter
        if (activeFilters.certified) {
          results = results.filter(sheikh => sheikh.isCertified || sheikh.verified || sheikh.certificates?.length > 0)
        }

        // Apply rating filter
        if (activeFilters.topRated) {
          results = results.filter(sheikh => (sheikh.rating || 0) >= 4.0)
        }

        onResultsChange(results)
      } catch (error) {
        console.error('Error filtering sheikhs:', error)
        onResultsChange(initialSheikhs)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [initialSheikhs, onResultsChange]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query, filters)
  }

  // Handle filter toggle
  const toggleFilter = (filterKey: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [filterKey]: !filters[filterKey]
    }
    setFilters(newFilters)
    debouncedSearch(searchQuery, newFilters)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setFilters({
      available: false,
      certified: false,
      topRated: false
    })
    onResultsChange(initialSheikhs)
  }

  return (
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
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filters.available ? "default" : "outline"} 
              size="sm" 
              className={`arabic-text ${filters.available ? 'bg-green-600 hover:bg-green-700' : 'bg-transparent'}`}
              onClick={() => toggleFilter('available')}
              disabled={isLoading}
            >
              <Filter className="w-4 h-4 ml-2" />
              <span className={filters.available ? 'text-white' : 'text-green-700'}>
                متاح الآن
              </span> 
            </Button>
            <Button 
              variant={filters.certified ? "default" : "outline"} 
              size="sm" 
              className={`arabic-text ${filters.certified ? 'bg-green-600 hover:bg-green-700' : 'bg-transparent'}`}
              onClick={() => toggleFilter('certified')}
              disabled={isLoading}
            >
              <Award className="w-4 h-4 ml-2" />
              <span className={filters.certified ? 'text-white' : 'text-green-600'}>
                معتمد فقط
              </span>
            </Button>
            <Button 
              variant={filters.topRated ? "default" : "outline"} 
              size="sm" 
              className={`arabic-text ${filters.topRated ? 'bg-green-600 hover:bg-green-700' : 'bg-transparent'}`}
              onClick={() => toggleFilter('topRated')}
              disabled={isLoading}
            >
              <Star className="w-4 h-4 ml-2" />
              <span className={filters.topRated ? 'text-white' : 'text-green-700'}>
                الأعلى تقييماً
              </span>
            </Button>
            {(searchQuery || Object.values(filters).some(Boolean)) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="arabic-text bg-transparent text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
                disabled={isLoading}
              >
                إعادة تعيين
              </Button>
            )}
          </div>
        </div>
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              جاري البحث...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
