"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  Users, 
  Star, 
  Shield, 
  Phone, 
  MessageCircle,
  ArrowRight,
  Award,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function HeroSection() {
  const [selectedCity, setSelectedCity] = useState("")

  const cities = [
    { name: "الرياض", slug: "riyadh" },
    { name: "جدة", slug: "jeddah" },
    { name: "مكة المكرمة", slug: "makkah" },
    { name: "المدينة المنورة", slug: "madinah" },
    { name: "الدمام", slug: "dammam" },
    { name: "الطائف", slug: "taif" },
  ]


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-islamic opacity-5"></div>
      <div className="absolute inset-0 islamic-pattern opacity-10"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/sign.png')" }}
      ></div>
      
      {/* Floating Islamic Elements */}
     
      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Logo and Title */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6 group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-islamic">
                <span className="text-3xl text-primary-foreground font-bold">م</span>
              </div>
              
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold arabic-heading text-primary mb-6 tracking-wide leading-tight">
              مـــأذونـــي
            </h1>
            
            <p className="text-2xl md:text-4xl arabic-text text-foreground mb-6 font-medium leading-relaxed">
              مــأذون شـرعي فـي كـل مـدن المملـكة العـربية السعـوديـة
            </p>
            
            <p className="text-lg md:text-xl arabic-text text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              الموقع الأول والمتخصص فـي جمـيع خـدمات توثـيق عقـود الزواج بأعلى معايير الجودة والاحترافية. 
              نوفـر لك أفضـل المأذونيـن الشرعييـن المعتمديـن فـي جمـيع مـدن المملـكـة
            </p>
          </div>

     
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
