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
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Star,
  Phone,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Sheikh } from "@/lib/database"

export default function AdminSheikhs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCity, setFilterCity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterVerified, setFilterVerified] = useState("all")
  const [sheikhsData, setSheikhsData] = useState<Sheikh[]>([])
  const [filteredSheikhs, setFilteredSheikhs] = useState<Sheikh[]>([])
  const [citiesData, setCitiesData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    sheikhId: "",
    sheikhName: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // تحميل البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [sheikhsResponse, citiesResponse] = await Promise.all([
          fetch("/api/sheikhs"),
          fetch("/api/cities")
        ])
        
        if (sheikhsResponse.ok && citiesResponse.ok) {
          const sheikhs = await sheikhsResponse.json()
          const cities = await citiesResponse.json()
          setSheikhsData(sheikhs)
          setFilteredSheikhs(sheikhs)
          setCitiesData(cities)
        } else {
          setError("فشل في تحميل البيانات")
          toast({
            title: "خطأ",
            description: "فشل في تحميل البيانات",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات:", error)
        setError("حدث خطأ في تحميل البيانات")
        toast({
          title: "خطأ",
          description: "حدث خطأ في تحميل البيانات",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // فلترة البيانات
  useEffect(() => {
    let filtered = sheikhsData

    // فلترة حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(sheikh => 
        sheikh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheikh.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // فلترة حسب المدينة
    if (filterCity !== "all") {
      filtered = filtered.filter(sheikh => sheikh.citySlug === filterCity)
    }

    // فلترة حسب الحالة
    if (filterStatus !== "all") {
      filtered = filtered.filter(sheikh => sheikh.availability === filterStatus)
    }

    // فلترة حسب التحقق
    if (filterVerified !== "all") {
      const isVerified = filterVerified === "verified"
      filtered = filtered.filter(sheikh => sheikh.verified === isVerified)
    }

    setFilteredSheikhs(filtered)
  }, [searchTerm, filterCity, filterStatus, filterVerified, sheikhsData])

  const openDeleteModal = (sheikhId: string, sheikhName: string) => {
    setDeleteModal({
      isOpen: true,
      sheikhId,
      sheikhName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      sheikhId: "",
      sheikhName: ""
    })
  }

  const handleDeleteSheikh = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/sheikhs/${deleteModal.sheikhId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // إزالة المأذون من القائمة
        setSheikhsData(prev => prev.filter(sheikh => sheikh._id !== deleteModal.sheikhId))
        toast({
          title: "نجح",
          description: "تم حذف المأذون بنجاح",
        })
        closeDeleteModal()
      } else {
        const errorData = await response.json()
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في حذف المأذون",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("خطأ في حذف المأذون:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف المأذون",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleVerified = async (sheikhId: string) => {
    try {
      const sheikh = sheikhsData.find(s => s._id === sheikhId)
      if (!sheikh) return

      const response = await fetch(`/api/sheikhs/${sheikh.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...sheikh,
          verified: !sheikh.verified
        }),
      })

      if (response.ok) {
        // تحديث البيانات
        setSheikhsData(prev => prev.map(s => 
          s._id === sheikhId ? { ...s, verified: !s.verified } : s
        ))
        toast({
          title: "نجح",
          description: `تم ${sheikh.verified ? 'إلغاء' : 'تفعيل'} التحقق من المأذون`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في تحديث حالة التحقق",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("خطأ في تحديث حالة التحقق:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة التحقق",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-green-100 text-green-800"
      case "مشغول":
        return "bg-yellow-100 text-yellow-800"
      case "غير متاح":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المأذونين</h1>
          <p className="text-gray-600">إدارة جميع المأذونين المسجلين في النظام</p>
        </div>
        <Button asChild>
          <Link href="/admin/sheikhs/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مأذون جديد
          </Link>
        </Button>
      </div>

      {/* Stats - لا تتأثر بالفلترة */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المأذونين</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sheikhsData.length}</div>
            <p className="text-xs text-muted-foreground">مأذون مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المأذونين المتاحين</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sheikhsData.filter((sheikh: Sheikh) => sheikh.availability === "متاح").length}
            </div>
            <p className="text-xs text-muted-foreground">متاح للعمل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المأذونين المعتمدين</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sheikhsData.filter((sheikh: Sheikh) => sheikh.verified).length}
            </div>
            <p className="text-xs text-muted-foreground">معتمد رسمياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sheikhsData.length > 0 ? (sheikhsData.reduce((acc: number, sheikh: Sheikh) => acc + sheikh.rating, 0) / sheikhsData.length).toFixed(1) : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
          <CardDescription>البحث في المأذونين وفلترة النتائج</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث بالاسم أو المدينة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع المدن</option>
                {citiesData.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع الحالات</option>
                <option value="متاح">متاح</option>
                <option value="مشغول">مشغول</option>
                <option value="غير متاح">غير متاح</option>
              </select>
            </div>

            <div>
              <select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع المأذونين</option>
                <option value="verified">معتمد</option>
                <option value="not-verified">غير معتمد</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheikhs Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المأذونين</CardTitle>
          <CardDescription>
            عرض {filteredSheikhs.length} من {sheikhsData.length} مأذون
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4 font-medium">المأذون</th>
                  <th className="text-right p-4 font-medium">المدينة</th>
                  <th className="text-right p-4 font-medium">التقييم</th>
                  <th className="text-right p-4 font-medium">الحالة</th>
                  <th className="text-right p-4 font-medium">التحقق</th>
                  <th className="text-right p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSheikhs.map((sheikh) => (
                  <tr key={sheikh._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{sheikh.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            {sheikh.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{sheikh.city}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{sheikh.rating}</span>
                        <span className="text-sm text-gray-500">({sheikh.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(sheikh.availability)}>
                        {sheikh.availability}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {sheikh.verified ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVerified(sheikh._id!)}
                        >
                          {sheikh.verified ? "إلغاء التحقق" : "تحقق"}
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/sheikh/${sheikh.slug}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/sheikhs/${sheikh.slug}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteModal(sheikh._id!, sheikh.name)}
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

          {filteredSheikhs.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد مأذونين مطابقين لبحثك</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSheikh}
        title="حذف المأذون"
        description="هل أنت متأكد من حذف هذا المأذون؟ سيتم حذف جميع البيانات المرتبطة به."
        itemName={deleteModal.sheikhName}
        isLoading={isDeleting}
      />
    </div>
  )
}
