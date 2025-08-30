import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Star, MessageCircle, Eye, Award } from "lucide-react"
import Link from "next/link"

interface SheikhCardProps {
  sheikh: {
    id: string
    name: string
    city: string
    rating: number
    reviewCount: number
    slug?: string

    specialties: string[]
    phone: string
    whatsapp?: string
    image?: string

    availability?: "متاح" | "مشغول" | "غير متاح"
    verified?: boolean
  }
  variant?: "default" | "featured" | "compact"
  showBookingButton?: boolean
}

export function SheikhCard({ sheikh, variant = "default", showBookingButton = true }: SheikhCardProps) {
  const whatsappNumber = sheikh.whatsapp || sheikh.phone
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`

  const availabilityColors = {
    متاح: "bg-green-100 text-green-800 border-green-200",
    مشغول: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "غير متاح": "bg-red-100 text-red-800 border-red-200",
  }

  if (variant === "compact") {
    return (
      <Card className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm group">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                <img
                  src={sheikh.image || "/placeholder.svg?height=64&width=64&query=professional+arabic+sheikh"}
                  alt={sheikh.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {sheikh.verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                  <Award className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold arabic-heading text-foreground truncate">{sheikh.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                <span className="arabic-text">{sheikh.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  <span className="text-sm font-medium">{sheikh.rating}</span>
                </div>
                {sheikh.availability && (
                  <Badge variant="outline" className={`text-xs ${availabilityColors[sheikh.availability]}`}>
                    {sheikh.availability}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="p-2 bg-transparent" asChild>
                <a href={`tel:${sheikh.phone}`}>
                  <Phone className="w-4 h-4" />
                </a>
              </Button>
              <Button size="sm" className="p-2" asChild>
                <Link href={`/sheikh/${sheikh.slug || sheikh.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card className="hover-lift shadow-islamic border-0 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-secondary text-secondary-foreground">مميز</Badge>
        </div>

        <CardHeader className="text-center pb-4 relative">
          <div className="relative mx-auto mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
              <img
                src={sheikh.image || "/placeholder.svg?height=112&width=112&query=professional+arabic+sheikh"}
                alt={sheikh.name}
                className="w-full h-full object-cover"
              />
            </div>
            {sheikh.verified && (
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                <Award className="w-5 h-5" />
              </div>
            )}
            <div className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>

          <CardTitle className="text-2xl arabic-heading text-foreground mb-2">{sheikh.name}</CardTitle>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span className="arabic-text font-medium">{sheikh.city}</span>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-bold text-lg">{sheikh.rating}</span>
              <span className="text-muted-foreground">({sheikh.reviewCount})</span>
            </div>

          </div>

      
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {sheikh.specialties.map((specialty, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1 bg-primary/10 text-primary border-primary/20 arabic-text"
              >
                {specialty}
              </Badge>
            ))}
          </div>

          {sheikh.availability && (
            <div className="text-center">
              <Badge className={availabilityColors[sheikh.availability]}>{sheikh.availability}</Badge>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <Button className="w-full arabic-text text-lg py-6  rounded-[10px]" asChild>
              <Link href={`/sheikh/${sheikh.slug || sheikh.id}`}>عرض الملف الشخصي</Link>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="arabic-text bg-transparent rounded-[10px]" asChild>
                <a href={`tel:${sheikh.phone}`}>
                  <Phone className="w-4 h-4 ml-2" />
                  اتصال
                </a>
              </Button>
              <Button
                variant="outline"
                className="arabic-text bg-green-50  text-green-700 border-green-200  hover:bg-green-700 hover:text-white rounded-[10px]"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  <span className="arabic-text ">واتساب</span>
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm group">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
            <img
              src={sheikh.image || "/placeholder.svg?height=96&width=96&query=professional+arabic+sheikh"}
              alt={sheikh.name}
              className="w-full h-full object-cover"
            />
          </div>
          {sheikh.verified && (
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Award className="w-4 h-4" />
            </div>
          )}
          <div className="absolute -bottom-2 -left-2 bg-secondary text-secondary-foreground rounded-full p-1">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>

        <CardTitle className="text-xl arabic-heading text-foreground mb-2 group-hover:text-primary transition-colors">
          {sheikh.name}
        </CardTitle>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="arabic-text">{sheikh.city}</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="font-medium">{sheikh.rating}</span>
            <span className="text-muted-foreground">({sheikh.reviewCount})</span>
          </div>

        </div>

     
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {sheikh.specialties.slice(0, 2).map((specialty, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1 bg-primary/10 text-primary border-primary/20 arabic-text text-xs"
            >
              {specialty}
            </Badge>
          ))}
          {sheikh.specialties.length > 2 && (
            <Badge variant="outline" className="px-3 py-1 bg-muted text-muted-foreground text-xs">
              +{sheikh.specialties.length - 2}
            </Badge>
          )}
        </div>

        {sheikh.availability && (
          <div className="text-center">
            <Badge variant="outline" className={`text-xs ${availabilityColors[sheikh.availability]}`}>
              {sheikh.availability}
            </Badge>
          </div>
        )}

        {showBookingButton && (
          <div className="space-y-2">
            <Button size="default" className="w-full arabic-text rounded-[10px]" asChild>
              <Link href={`/sheikh/${sheikh.slug || sheikh.id}`}>عرض الملف الشخصي</Link>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="arabic-text bg-transparent rounded-[10px]" asChild>
                <a href={`tel:${sheikh.phone}`}>
                  <Phone className="w-4 h-4 ml-1" />
                  اتصال
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="arabic-text bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700 rounded-[10px]"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" >
                  <MessageCircle className="w-4 h-4 ml-1" />
                  واتساب
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
