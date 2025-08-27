import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function CityLoading() {
  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <Skeleton className="h-16 w-96 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* City Info */}
          <Card className="mb-8 shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sheikhs Grid */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
