"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Building2,
  Star,
  Eye,
  MessageSquare,
  Calendar,
  MapPin
} from "lucide-react"
import { useState, useEffect } from "react"
import { City, Sheikh } from "@/lib/database"

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("month")
  const [cities, setCities] = useState<City[]>([])
  const [sheikhs, setSheikhs] = useState<Sheikh[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalStats, setTotalStats] = useState({
    totalCities: 0,
    totalSheikhs: 0,
    totalReviews: 0,
    averageRating: 0,
    featuredCities: 0,
    activeSheikhs: 0,
    verifiedSheikhs: 0
  })
  const [filteredStats, setFilteredStats] = useState({
    topCities: [] as any[],
    topSheikhs: [] as any[]
  })

  // تحميل البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [citiesResponse, sheikhsResponse] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/sheikhs")
        ])
        
        if (citiesResponse.ok && sheikhsResponse.ok) {
          const citiesData = await citiesResponse.json()
          const sheikhsData = await sheikhsResponse.json()
          setCities(Array.isArray(citiesData.data) ? citiesData.data : [])
          setSheikhs(Array.isArray(sheikhsData.data) ? sheikhsData.data : [])
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // حساب الإحصائيات الإجمالية (ثابتة لا تتغير مع الفلتر)
  useEffect(() => {
    if (cities.length === 0 && sheikhs.length === 0) return

    const safeCities = Array.isArray(cities) ? cities : []
    const safeSheikhs = Array.isArray(sheikhs) ? sheikhs : []
    const totalReviews = safeSheikhs.reduce((acc, sheikh) => acc + sheikh.reviewCount, 0)
    const averageRating = safeSheikhs.length > 0 
      ? (safeSheikhs.reduce((acc, sheikh) => acc + sheikh.rating, 0) / safeSheikhs.length).toFixed(1)
      : 0
    const featuredCities = safeCities.filter(city => city.featured).length
    const activeSheikhs = safeSheikhs.filter(sheikh => sheikh.availability === "متاح").length
    const verifiedSheikhs = safeSheikhs.filter(sheikh => sheikh.verified).length

    setTotalStats({
      totalCities: safeCities.length,
      totalSheikhs: safeSheikhs.length,
      totalReviews,
      averageRating: parseFloat(averageRating as unknown as string),
      featuredCities,
      activeSheikhs,
      verifiedSheikhs
    })
  }, [cities, sheikhs])

  // حساب الإحصائيات المفلترة (تتغير مع الفلتر)
  useEffect(() => {
    if (cities.length === 0 && sheikhs.length === 0) return

    // أفضل المدن حسب عدد المأذونين
    const topCities = [...cities]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // أفضل المأذونين حسب التقييم
    const topSheikhs = [...sheikhs]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)

    setFilteredStats({
      topCities,
      topSheikhs
    })
  }, [cities, sheikhs])

  const StatCard = ({ title, value, change, icon: Icon, color, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center gap-1 text-xs">
            {change > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={change > 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground">من الشهر الماضي</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  const ChartCard = ({ title, children }: any) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>إحصائيات مفصلة</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإحصائيات</h1>
          <p className="text-gray-600">تحليل شامل لمعلومات النظام</p>
        </div>

      </div>




      {/* Charts and Detailed Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Cities */}
        <ChartCard title="أفضل المدن">
          <div className="space-y-4">
            {filteredStats.topCities.map((city, index) => (
              <div key={city._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.region}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-medium">{city.count} مأذون</div>
                  <div className="text-sm text-gray-500">{city.population}</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top Sheikhs */}
        <ChartCard title="أفضل المأذونين">
          <div className="space-y-4">
            {filteredStats.topSheikhs.map((sheikh, index) => (
              <div key={sheikh._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{sheikh.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {sheikh.city}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{sheikh.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-gray-500">{sheikh.reviewCount} تقييم</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Regional Distribution */}
      <ChartCard title="التوزيع الإقليمي">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from(new Set(cities.map(city => city.region))).map(region => {
            const regionCities = cities.filter(city => city.region === region)
            const regionSheikhs = regionCities.reduce((acc, city) => acc + city.count, 0)
            
            return (
              <div key={region} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <h3 className="font-medium">{region}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>المدن:</span>
                    <span className="font-medium">{regionCities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المأذونين:</span>
                    <span className="font-medium">{regionSheikhs}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ChartCard>


    </div>
  )
}
