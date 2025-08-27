"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DeleteModal } from "@/components/ui/delete-modal"
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Users,
  Star,
  TrendingUp
} from "lucide-react"
import { City } from "@/lib/database"

export default function AdminCities() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFeatured, setFilterFeatured] = useState("all")
  const [citiesData, setCitiesData] = useState<City[]>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    cityId: "",
    cityName: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // تحميل البيانات من API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cities")
        if (response.ok) {
          const cities = await response.json()
          setCitiesData(cities)
          setFilteredCities(cities)
        } else {
          setError("فشل في تحميل المدن")
          toast({
            title: "خطأ",
            description: "فشل في تحميل المدن",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("خطأ في تحميل المدن:", error)
        setError("حدث خطأ في تحميل المدن")
        toast({
          title: "خطأ",
          description: "حدث خطأ في تحميل المدن",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [toast])

  // فلترة البيانات
  useEffect(() => {
    let filtered = citiesData

    // فلترة حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // فلترة حسب التصنيف
    if (filterFeatured === "featured") {
      filtered = filtered.filter(city => city.featured)
    } else if (filterFeatured === "not-featured") {
      filtered = filtered.filter(city => !city.featured)
    }

    setFilteredCities(filtered)
  }, [searchTerm, filterFeatured, citiesData])

  const openDeleteModal = (cityId: string, cityName: string) => {
    setDeleteModal({
      isOpen: true,
      cityId,
      cityName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      cityId: "",
      cityName: ""
    })
  }

  const handleDeleteCity = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/cities/${deleteModal.cityId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // إزالة المدينة من القائمة
        setCitiesData(prev => prev.filter(city => city._id !== deleteModal.cityId))
        toast({
          title: "نجح",
          description: "تم حذف المدينة بنجاح",
        })
        closeDeleteModal()
      } else {
        const errorData = await response.json()
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في حذف المدينة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("خطأ في حذف المدينة:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف المدينة",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleFeatured = async (cityId: string) => {
    try {
      const city = citiesData.find(c => c._id === cityId)
      if (!city) return

      const response = await fetch(`/api/cities/${city.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...city,
          featured: !city.featured
        }),
      })

      if (response.ok) {
        // تحديث البيانات
        setCitiesData(prev => prev.map(c => 
          c._id === cityId ? { ...c, featured: !c.featured } : c
        ))
        toast({
          title: "نجح",
          description: `تم ${city.featured ? 'إلغاء' : 'تفعيل'} التصنيف المميز للمدينة`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في تحديث تصنيف المدينة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("خطأ في تحديث تصنيف المدينة:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث تصنيف المدينة",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المدن</h1>
          <p className="text-gray-600">إدارة جميع المدن المتاحة في النظام</p>
        </div>
        <Button asChild>
          <Link href="/admin/cities/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مدينة جديدة
          </Link>
        </Button>
      </div>

      {/* Stats - لا تتأثر بالفلترة */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدن</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citiesData.length}</div>
            <p className="text-xs text-muted-foreground">مدينة مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدن المميزة</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {citiesData.filter((city: City) => city.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">مدينة مميزة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المأذونين</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {citiesData.reduce((acc: number, city: City) => acc + city.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">مأذون مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
          <CardDescription>البحث في المدن وفلترة النتائج</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث بالاسم أو المنطقة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع المدن</option>
                <option value="featured">المدن المميزة</option>
                <option value="not-featured">المدن العادية</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cities Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المدن</CardTitle>
          <CardDescription>
            عرض {filteredCities.length} من {citiesData.length} مدينة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4 font-medium">المدينة</th>
                  <th className="text-right p-4 font-medium">المنطقة</th>
                  <th className="text-right p-4 font-medium">المأذونين</th>
                  <th className="text-right p-4 font-medium">السكان</th>
                  <th className="text-right p-4 font-medium">التصنيف</th>
                  <th className="text-right p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCities.map((city) => (
                  <tr key={city._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <div className="text-sm text-gray-500">/{city.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{city.region}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{city.count}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{city.population}</td>
                    <td className="p-4">
                      <Badge 
                        variant={city.featured ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleFeatured(city._id!)}
                      >
                        {city.featured ? "مميزة" : "عادية"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/city/${city.slug}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/cities/${city.slug}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteModal(city._id!, city.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد مدن مطابقة لبحثك</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCity}
        title="حذف المدينة"
        description="هل أنت متأكد من حذف هذه المدينة؟ سيتم حذف جميع البيانات المرتبطة بها."
        itemName={deleteModal.cityName}
        isLoading={isDeleting}
      />
    </div>
  )
}
