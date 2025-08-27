"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { DeleteModal } from "@/components/ui/delete-modal"
import { reviewsAPI, adminAPI } from "@/lib/api"
import { 
  Star, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  Phone,
  Loader2,
  UserCheck
} from "lucide-react"

export default function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [reviews, setReviews] = useState<any[]>([])
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: "",
    reviewerName: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    action: "",
    reviewId: ""
  })

  // جلب التقييمات من API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const pendingReviews = await reviewsAPI.getAll()
        setReviews(pendingReviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast.error("فشل في جلب التقييمات")
      }
    }
    
    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.sheikhName && review.sheikhName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = filterStatus === "all" || review.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleApprove = async () => {
    if (!actionDialog.reviewId) return

    setIsProcessing(true)
    try {
      await adminAPI.reviews.updateStatus(actionDialog.reviewId, {
        status: "approved",
        adminNotes: adminNotes
      })
      
      setReviews(prev => prev.map(review => 
        review._id === actionDialog.reviewId ? { 
          ...review, 
          status: "approved",
          adminNotes: adminNotes,
          reviewedAt: new Date().toISOString()
        } : review
      ))
      
      toast.success("تم الموافقة على التقييم بنجاح")
      setActionDialog({ isOpen: false, action: "", reviewId: "" })
      setAdminNotes("")
    } catch (error) {
      console.error('Error approving review:', error)
      toast.error("حدث خطأ في الموافقة على التقييم")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!actionDialog.reviewId) return

    setIsProcessing(true)
    try {
      await adminAPI.reviews.updateStatus(actionDialog.reviewId, {
        status: "rejected",
        adminNotes: adminNotes
      })
      
      setReviews(prev => prev.map(review => 
        review._id === actionDialog.reviewId ? { 
          ...review, 
          status: "rejected",
          adminNotes: adminNotes,
          reviewedAt: new Date().toISOString()
        } : review
      ))
      
      toast.success("تم رفض التقييم بنجاح")
      setActionDialog({ isOpen: false, action: "", reviewId: "" })
      setAdminNotes("")
    } catch (error) {
      console.error('Error rejecting review:', error)
      toast.error("حدث خطأ في رفض التقييم")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.reviewId) return

    setIsDeleting(true)
    try {
      await adminAPI.reviews.delete(deleteModal.reviewId)
      setReviews(prev => prev.filter(review => review._id !== deleteModal.reviewId))
      toast.success("تم حذف التقييم بنجاح")
      setDeleteModal({ isOpen: false, reviewId: "", reviewerName: "" })
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error("حدث خطأ في حذف التقييم")
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">في الانتظار</Badge>
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 ml-1" />
          معتمد
        </Badge>
      case "rejected":
        return <Badge variant="destructive">
          <XCircle className="w-3 h-3 ml-1" />
          مرفوض
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= rating
      
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${
            isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold arabic-heading text-foreground">إدارة التقييمات</h1>
          <p className="arabic-text text-muted-foreground">إدارة تقييمات المأذونين من الزوار</p>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-8 w-8 text-primary" />
          <span className="arabic-text font-semibold text-foreground">{reviews.length} تقييم</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <ThumbsUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="arabic-text text-sm text-muted-foreground">إجمالي التقييمات</p>
                <p className="arabic-text font-semibold text-foreground">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Eye className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="arabic-text text-sm text-muted-foreground">في الانتظار</p>
                <p className="arabic-text font-semibold text-foreground">{reviews.filter(r => r.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="arabic-text text-sm text-muted-foreground">معتمد</p>
                <p className="arabic-text font-semibold text-foreground">{reviews.filter(r => r.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="arabic-text text-sm text-muted-foreground">مرفوض</p>
                <p className="arabic-text font-semibold text-foreground">{reviews.filter(r => r.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="arabic-text text-sm text-muted-foreground">متوسط التقييم</p>
                <p className="arabic-text font-semibold text-foreground">
                  {reviews.length > 0 
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في التقييمات أو اسم الشيخ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 arabic-text"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background arabic-text"
              >
                <option value="all">جميع التقييمات</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">معتمد</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review._id} className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="arabic-heading font-semibold text-foreground text-lg">{review.name}</h3>
                    {getStatusBadge(review.status)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="arabic-text text-sm text-muted-foreground">التقييم لـ:</span>
                    {review.sheikhSlug ? (
                      <a 
                        href={`/sheikh/${review.sheikhSlug}`}
                        className="arabic-text font-medium text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {review.sheikhName || 'غير محدد'}
                      </a>
                    ) : (
                      <span className="arabic-text font-medium text-primary">{review.sheikhName || 'غير محدد'}</span>
                    )}
                  </div>
                  {review.sheikhImage && (
                    <div className="mb-2">
                      <img src={review.sheikhImage} alt={review.sheikhName} className="w-12 h-12 rounded-full object-cover border" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{review.phone}</span>
                    </div>
                    {review.email && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{review.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(review.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="arabic-text text-sm text-muted-foreground">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActionDialog({ isOpen: true, action: "approve", reviewId: review._id })
                          setSelectedReview(review)
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        <ThumbsUp className="h-4 w-4 ml-1" />
                        موافقة
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActionDialog({ isOpen: true, action: "reject", reviewId: review._id })
                          setSelectedReview(review)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ThumbsDown className="h-4 w-4 ml-1" />
                        رفض
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteModal({
                      isOpen: true,
                      reviewId: review._id,
                      reviewerName: review.name
                    })}
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="arabic-heading font-medium text-foreground mb-2">التعليق:</h4>
                  <p className="arabic-text text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
                {review.adminNotes && (
                  <div className="border-r-4 border-primary pr-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="arabic-heading font-medium text-foreground mb-2">ملاحظات المدير:</h4>
                    <p className="arabic-text text-muted-foreground leading-relaxed">{review.adminNotes}</p>
                    {review.reviewedAt && (
                      <p className="arabic-text text-xs text-muted-foreground mt-2">
                        تم المراجعة في: {new Date(review.reviewedAt).toLocaleDateString('ar-SA')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ isOpen: false, action: "", reviewId: "" })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="arabic-heading">
              {actionDialog.action === "approve" ? "الموافقة على التقييم" : "رفض التقييم"}
            </DialogTitle>
            <DialogDescription className="arabic-text">
              {actionDialog.action === "approve" 
                ? `الموافقة على تقييم ${selectedReview?.name}`
                : `رفض تقييم ${selectedReview?.name}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="arabic-heading font-medium text-foreground mb-2">التقييم:</h4>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(selectedReview?.rating || 0)}
                  <span className="arabic-text text-sm text-muted-foreground">
                    {selectedReview?.rating}/5
                  </span>
                </div>
                <p className="arabic-text text-muted-foreground">
                  {selectedReview?.comment}
                </p>
              </div>
            </div>
            <div>
              <label className="arabic-text font-medium text-foreground block mb-2">ملاحظات المدير (اختياري):</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="اكتب ملاحظاتك هنا..."
                rows={4}
                className="arabic-text"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setActionDialog({ isOpen: false, action: "", reviewId: "" })
                  setAdminNotes("")
                  setSelectedReview(null)
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={actionDialog.action === "approve" ? handleApprove : handleReject}
                disabled={isProcessing}
                variant={actionDialog.action === "approve" ? "default" : "destructive"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    {actionDialog.action === "approve" ? (
                      <>
                        <ThumbsUp className="h-4 w-4 ml-2" />
                        موافقة
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-4 w-4 ml-2" />
                        رفض
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reviewId: "", reviewerName: "" })}
        onConfirm={handleDelete}
        title="حذف التقييم"
        description={`هل أنت متأكد من حذف تقييم ${deleteModal.reviewerName}؟`}
        isLoading={isDeleting}
      />
    </div>
  )
}
