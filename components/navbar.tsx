"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { settingsAPI, citiesAPI } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { 
  Menu, 
  X, 
  MapPin, 
  Users, 
  Phone, 
  MessageCircle,
  ChevronDown,
  Home,
  Building2,
  User,
  Info,
  FileText
} from "lucide-react"

interface City {
  _id: string
  name: string
  slug: string
  count: number
  region: string
  featured: boolean
}

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = useState(false)
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [sitePhone, setSitePhone] = useState<string>("")
  const [waNumber, setWaNumber] = useState<string>("")

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true)
      try {
        const citiesData = await citiesAPI.getFeatured()
        setCities(citiesData || [])
      } catch (error) {
        console.error('Error fetching cities:', error)
        setCities([])
      } finally {
        setIsLoadingCities(false)
      }
    }

    fetchCities()
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const s = await settingsAPI.get()
        setSitePhone(s.contactPhone || "")
        setWaNumber(s.whatsappNumber || "")
      } catch (e) {
        console.error('Error loading settings', e)
      }
    }
    loadSettings()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.cities-dropdown')) {
        setIsCitiesDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-islamic">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-islamic">
                <span className="text-xl text-primary-foreground font-bold">م</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold arabic-heading text-primary">مأذوني</h1>
              <p className="text-xs text-muted-foreground arabic-text">الموقع الأول للمأذونين الشرعيين</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors arabic-text">
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>
            
            <div className="relative cities-dropdown">
              <button 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors arabic-text p-2 rounded-lg hover:bg-primary/10"
                onClick={() => setIsCitiesDropdownOpen(!isCitiesDropdownOpen)}
              >
                <Building2 className="w-4 h-4" />
                المدن
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCitiesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCitiesDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-islamic p-4 animate-in slide-in-from-top-2 duration-200"
                >
                  {isLoadingCities ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="mr-2 arabic-text text-sm">جاري التحميل...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {cities.map((city) => (
                          <Link
                            key={city._id}
                            href={`/city/${city.slug}`}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors arabic-text text-sm"
                            onClick={() => setIsCitiesDropdownOpen(false)}
                          >
                            <MapPin className="w-3 h-3" />
                            {city.name}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <Link
                          href="/sheikhs"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors arabic-text text-sm"
                          onClick={() => setIsCitiesDropdownOpen(false)}
                        >
                          <Users className="w-3 h-3" />
                          جميع المأذونين
                        </Link>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <Link
                          href="/cities"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors arabic-text text-sm"
                          onClick={() => setIsCitiesDropdownOpen(false)}
                        >
                          <Users className="w-3 h-3" />
                          جميع المدن
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/sheikhs" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors arabic-text">
              <Users className="w-4 h-4" />
              المأذونين
            </Link>

            <Link href="/blog" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors arabic-text">
              <FileText className="w-4 h-4" />
              المدونة
            </Link>

            <Link href="/about" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors arabic-text">
              <Info className="w-4 h-4" />
              من نحن
            </Link>

            <Link href="/contact" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors arabic-text">
              <Phone className="w-4 h-4" />
              تواصل معنا
            </Link>
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" className="arabic-text bg-transparent" asChild>
              <a href={`https://wa.me/${waNumber || '966501234567'}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 ml-2" />
                واتساب
              </a>
            </Button>
            <Button size="sm" className="arabic-text shadow-islamic" asChild>
              <a href={sitePhone ? `tel:${sitePhone.replace(/\s/g,'')}` : '#'}>
                <Phone className="w-4 h-4 ml-2" />
                اتصال
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Card className="lg:hidden mt-4 p-4 shadow-islamic border-0 bg-card/95 backdrop-blur">
            <div className="space-y-4">
              <Link 
                href="/" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                الرئيسية
              </Link>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 arabic-text">
                  <Building2 className="w-5 h-5 text-primary" />
                  المدن
                </div>
              
                <div className="grid grid-cols-2 gap-2 pr-8">
                  {isLoadingCities ? (
                    <div className="col-span-2 flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="mr-2 arabic-text text-xs">جاري التحميل...</span>
                    </div>
                  ) : (
                    cities.slice(0, 6).map((city) => (
                      <Link
                        key={city._id}
                        href={`/city/${city.slug}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors arabic-text text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <MapPin className="w-3 h-3" />
                        {city.name}
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <Link 
                href="/sheikhs" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                جميع المأذونين
              </Link>
          
              <Link 
                href="/cities" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="w-5 h-5" />
                  جميع المدن
              </Link>
               
              <Link 
                href="/blog" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-5 h-5" />
                المدونة
              </Link>

              <Link 
                href="/about" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-5 h-5" />
                من نحن
              </Link>

              <Link 
                href="/contact" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                تواصل معنا
              </Link>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="flex-1 arabic-text bg-transparent" asChild>
                  <a href={`https://wa.me/${waNumber || '966501234567'}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 ml-2" />
                    واتساب
                  </a>
                </Button>
                <Button size="sm" className="flex-1 arabic-text shadow-islamic" asChild>
                  <a href={sitePhone ? `tel:${sitePhone.replace(/\s/g,'')}` : '#'}>
                    <Phone className="w-4 h-4 ml-2" />
                    اتصال
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </nav>
  )
}
