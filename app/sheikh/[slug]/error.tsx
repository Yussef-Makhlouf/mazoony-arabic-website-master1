'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, RefreshCw, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SheikhSlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <User className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-3xl font-bold arabic-heading text-foreground mb-4">
                خطأ في تحميل المأذون
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground">
                عذراً، حدث خطأ أثناء تحميل بيانات المأذون
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="arabic-text text-muted-foreground text-lg">
                يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={reset}
                  size="lg"
                  className="text-lg px-8 py-6 arabic-text shadow-islamic group"
                >
                  <RefreshCw className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform" />
                  المحاولة مرة أخرى
                </Button>
                
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
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-8">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto text-right">
                    {error.message}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
