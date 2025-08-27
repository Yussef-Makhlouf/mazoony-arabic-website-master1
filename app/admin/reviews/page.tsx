"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DeleteModal } from "@/components/ui/delete-modal"
import { 
  Star, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  MessageSquare,
  Calendar,
  User
} from "lucide-react"
import { reviewsAPI } from "@/lib/api"

export default function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [reviews, setReviews] = useState<any[]>([])
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: 0,
    reviewName: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // جلب جميع التقييمات من API
    const fetchReviews = async () => {
      try {
        const allReviews = await reviewsAPI.getAll()
        setReviews(allReviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast({
          title: "خطأ",
          description: "فشل في جلب التقييمات",
          variant: "destructive",
        })
      }
    }
    
    fetchReviews()
  }, [toast])

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.sheikhName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
    const matchesStatus = filterStatus === "all" || review.status === filterStatus

    return matchesSearch && matchesRating && matchesStatus
  })

  const handleApproveReview = async (reviewId: number) => {
    try {
      // تحديث حالة التقييم إلى معتمد
      await reviewsAPI.update(reviewId.toString(), { status: 'approved' })
      
      // تحديث القائمة
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, status: 'approved' }
            : review
        )
      )
      
      toast({
        title: "نجح",
        description: "تم الموافقة على التقييم بنجاح",
      })
    } catch (error) {
      console.error('Error approving review:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في الموافقة على التقييم",
        variant: "destructive",
      })
    }
  }

  const handleRejectReview = async (reviewId: number) => {
    try {
      // تحديث حالة التقييم إلى مرفوض
      await reviewsAPI.update(reviewId.toString(), { status: 'rejected' })
      
      // تحديث القائمة
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, status: 'rejected' }
            : review
        )
      )
      
      toast({
        title: "نجح",
        description: "تم رفض التقييم بنجاح",
      })
    } catch (error) {
      console.error('Error rejecting review:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في رفض التقييم",
        variant: "destructive",
      })
    }
  }

  const openDeleteModal = (reviewId: number, reviewName: string) => {
    setDeleteModal({
      isOpen: true,
      reviewId,
      reviewName
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      reviewId: 0,
      reviewName: ""
    })
  }

  const handleDeleteReview = async () => {
    setIsDeleting(true)
    try {
      // حذف التقييم من API
      await reviewsAPI.delete(deleteModal.reviewId.toString())
      
      // تحديث القائمة
      setReviews(prevReviews => prevReviews.filter(review => review.id !== deleteModal.reviewId))
      
      toast({
        title: "نجح",
        description: "تم حذف التقييم بنجاح",
      })
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting review:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف التقييم",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4) return "ممتاز"
    if (rating >= 3) return "جيد"
    return "ضعيف"
  }

  const stats = {
    totalReviews: reviews.length,
    pendingReviews: reviews.filter(r => r.status === "pending").length,
    approvedReviews: reviews.filter(r => r.status === "approved").length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة التقييمات</h1>
          <p className="text-gray-600">إدارة جميع التقييمات والمراجعات</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التقييمات</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">تقييم مقدم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في انتظار المراجعة</CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">تقييم معلق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التقييمات المعتمدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedReviews}</div>
            <p className="text-xs text-muted-foreground">تقييم معتمد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">من 5 نجوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
          <CardDescription>البحث في التقييمات وفلترة النتائج</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في التقييمات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع التقييمات</option>
                <option value="5">5 نجوم</option>
                <option value="4">4 نجوم</option>
                <option value="3">3 نجوم</option>
                <option value="2">2 نجوم</option>
                <option value="1">1 نجمة</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">معتمد</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>

            <div>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 ml-2" />
                فلترة متقدمة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة التقييمات</CardTitle>
          <CardDescription>
            عرض {filteredReviews.length} من {reviews.length} تقييم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.uniqueId} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.phone}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 fill-yellow-400 text-yellow-400 ${getRatingColor(review.rating)}`} />
                        <span className={`font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}
                        </span>
                        <span className="text-sm text-gray-500">({getRatingText(review.rating)})</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {review.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {review.sheikhName} - {review.sheikhCity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {review.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveReview(review.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectReview(review.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/sheikh/${review.sheikhSlug}`}>
                        <Eye className="w-4 h-4" />
                      </a>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openDeleteModal(review.id, review.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        review.status === "approved" ? "default" :
                        review.status === "rejected" ? "destructive" : "secondary"
                      }
                    >
                      {review.status === "pending" ? "في الانتظار" :
                       review.status === "approved" ? "معتمد" : "مرفوض"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد تقييمات مطابقة لبحثك</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
          <CardDescription>آخر التقييمات المضافة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.uniqueId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.sheikhName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{review.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {review.date}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteReview}
        title="حذف التقييم"
        description="هل أنت متأكد من حذف هذا التقييم؟ سيتم حذفه نهائياً من النظام."
        itemName={deleteModal.reviewName}
        isLoading={isDeleting}
      />
    </div>
  )
}
