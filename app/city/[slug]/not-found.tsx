import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MapPin, Search } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function CityNotFound() {
  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
              <CardTitle className="text-3xl font-bold arabic-heading text-foreground mb-4">
                المدينة غير موجودة
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground">
                عذراً، المدينة التي تبحث عنها غير موجودة في قاعدة البيانات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="arabic-text text-muted-foreground text-lg">
                يمكنك البحث عن مدينة أخرى أو العودة إلى الصفحة الرئيسية
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cities">
                  <Button 
                    size="lg"
                    className="text-lg px-8 py-6 arabic-text shadow-islamic"
                  >
                    <Search className="w-5 h-5 ml-2" />
                    تصفح المدن
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 arabic-text bg-transparent"
                  >
                    <Home className="w-5 h-5 ml-2" />
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
