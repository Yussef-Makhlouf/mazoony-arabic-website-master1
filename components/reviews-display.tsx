"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, User, CheckCircle, XCircle } from "lucide-react"
import { reviewsAPI } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

interface Review {
  _id: string
  sheikhId: string
  name: string
  phone: string
  email?: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  isVerified: boolean
  reported: boolean
  createdAt: string
  updatedAt: string
}

interface ReviewsDisplayProps {
  sheikhId: string
  showPending?: boolean
}

export function ReviewsDisplay({ sheikhId, showPending = false }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await reviewsAPI.getBySheikh(sheikhId)
        setReviews(data)
      } catch (err: any) {
        setError(err.message || "حدث خطأ في تحميل التقييمات")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [sheikhId])

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

  const getStatusBadge = (status: string, isVerified: boolean) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 ml-1" />
            معتمد
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 ml-1" />
            مرفوض
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            في الانتظار
          </Badge>
        )
      default:
        return null
    }
  }

  const filteredReviews = showPending 
    ? reviews.filter(review => review.status === "pending")
    : reviews.filter(review => review.status === "approved")

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="arabic-text text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (filteredReviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="arabic-text text-muted-foreground">
            {showPending ? "لا توجد تقييمات في الانتظار" : "لا توجد تقييمات معتمدة بعد"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredReviews.map((review) => (
        <Card key={review._id} className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="arabic-heading font-semibold text-foreground">
                    {review.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="arabic-text text-sm text-muted-foreground">
                      {review.rating.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(review.status, review.isVerified)}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span className="arabic-text">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                      locale: ar
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="arabic-text text-foreground leading-relaxed">
              {review.comment}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
