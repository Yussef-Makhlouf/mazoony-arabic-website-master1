import { redirect } from 'next/navigation'
import { StatisticsService } from '@/lib/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MapPin, MessageSquare, Star, TrendingUp, Activity } from 'lucide-react'

export default async function AdminDashboard() {
  try {
    const stats = await StatisticsService.getDashboardStats()
    const sheikhStats = await StatisticsService.getSheikhStats()

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            نظرة عامة على إحصائيات الموقع
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المدن</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCities}</div>
              <p className="text-xs text-muted-foreground">
                مدينة نشطة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المأذونين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSheikhs}</div>
              <p className="text-xs text-muted-foreground">
                مأذون نشط
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقييمات</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                تقييم معتمد
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الرسائل</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                رسالة جديدة: {stats.newMessages}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات المأذونين</CardTitle>
              <CardDescription>
                نظرة على أداء المأذونين
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">متوسط التقييم</span>
                <span className="text-sm text-muted-foreground">
                  {sheikhStats.avgRating.toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">المأذونين المعتمدين</span>
                <span className="text-sm text-muted-foreground">
                  {sheikhStats.verifiedCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">المتاحين حالياً</span>
                <span className="text-sm text-muted-foreground">
                  {sheikhStats.availableCount}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>التقييمات المعلقة</CardTitle>
              <CardDescription>
                تقييمات تنتظر الموافقة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                تقييم معلق
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>
                آخر التحديثات على الموقع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm">تم تحديث قاعدة البيانات</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">زيادة في عدد الزيارات</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading dashboard:', error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            خطأ في تحميل البيانات
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              حدث خطأ أثناء تحميل الإحصائيات. يرجى المحاولة مرة أخرى.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
