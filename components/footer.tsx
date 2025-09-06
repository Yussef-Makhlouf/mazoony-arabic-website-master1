"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowRight,
  Award,
  Shield,
  Users,
  Star
} from "lucide-react"
import { useEffect, useState } from "react"
import { settingsAPI, cityAPI } from "@/lib/api"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [sitePhone, setSitePhone] = useState<string>("")
  const [waNumber, setWaNumber] = useState<string>("")
  const [cities, setCities] = useState<{ name: string; href: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const s = await settingsAPI.get()
        setSitePhone(s.contactPhone || "")
        setWaNumber(s.whatsappNumber || "")
        
        // جلب 6 مدن فقط من قاعدة البيانات
        const citiesData = await cityAPI.getAll()
        // Ensure data is always an array to prevent filter errors
        const safeCitiesData = Array.isArray(citiesData) ? citiesData : []
        const citiesList = safeCitiesData
          .filter((city: any) => city.featured) // أخذ أول 6 مدن فقط
          .map((city: any) => ({
            name: city.name,
            href: `/city/${city.slug}`
          }))
        setCities(citiesList)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const quickLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المأذونين", href: "/sheikhs" },
    { name: "المدن", href: "/cities" },
    { name: "من نحن", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ]

  // تم حذف البيانات الثابتة - المدن يتم جلبها من قاعدة البيانات

  const services = [
    { name: "توثيق عقود الزواج", description: "خدمة توثيق العقود الشرعية" },
    { name: "الإرشاد الأسري", description: "استشارات إرشادية للأسرة" },
    { name: "التحكيم الشرعي", description: "خدمات التحكيم في النزاعات" },
    { name: "الاستشارات الشرعية", description: "استشارات في الأمور الشرعية" },
  ]

  const socialLinks = [
    { name: "فيسبوك", icon: Facebook, href: "#" },
    { name: "تويتر", icon: Twitter, href: "#" },
    { name: "إنستغرام", icon: Instagram, href: "#" },
    { name: "يوتيوب", icon: Youtube, href: "#" },
  ]
 
  return (
    <footer className="relative overflow-hidden bg-card border-t border-border">
      {/* Background Elements */}
      <div className="absolute inset-0 islamic-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/decor2.jpg')" }}
      ></div>
      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-islamic">
                  <span className="text-xl text-primary-foreground font-bold">م</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-secondary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold arabic-heading text-primary">مأذوني</h3>
                <p className="text-sm text-muted-foreground arabic-text">الموقع الأول للمأذونين الشرعيين</p>
              </div>
            </div>
            
            <p className="arabic-text text-muted-foreground mb-6 leading-relaxed">
              الموقع الأول والمتخصص في جميع خدمات توثيق عقود الزواج في المملكة العربية السعودية. 
              نوفر لك أفضل المأذونين الشرعيين المعتمدين في جميع مدن المملكة.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="arabic-text text-muted-foreground" dir="ltr">{sitePhone || '+966 50 123 4567'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="arabic-text text-muted-foreground">info@mazoony.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="arabic-text text-muted-foreground">المملكة العربية السعودية</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold arabic-heading text-foreground mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors arabic-text group"
                  >
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-lg font-bold arabic-heading text-foreground mb-6">المدن المتاحة</h4>
            <ul className="space-y-3">
              {cities.map((city) => (
                <li key={city.name}>
                  <Link 
                    href={city.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors arabic-text group"
                  >
                    <MapPin className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold arabic-heading text-foreground mb-6">خدماتنا</h4>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.name}>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-medium arabic-text text-foreground mb-1">{service.name}</h5>
                      <p className="text-sm arabic-text text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm arabic-text text-muted-foreground" dir="ltr">
              © {currentYear} مأذوني. جميع الحقوق محفوظة.
            </p>
          </div>

          {/* Social Links */}
          {/* <div className="flex items-center gap-4">
            <span className="text-sm arabic-text text-muted-foreground">تابعنا على:</span>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer" title={social.name}>
                      <Icon className="w-4 h-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div> */}

          {/* Contact Buttons */}
          <div className="flex items-center gap-3">
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
        </div>
      </div>
    </footer>
  )
}
