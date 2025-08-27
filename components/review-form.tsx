"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Star, Loader2, Send } from "lucide-react"
import { reviewFormSchema, type ReviewFormData } from "@/lib/validations"
import { reviewsAPI } from "@/lib/api"

interface ReviewFormProps {
  sheikhId: string
  sheikhName: string
  onSuccess?: () => void
}

export function ReviewForm({ sheikhId, sheikhName, onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      sheikhId,
      name: "",
      phone: "",
      email: "",
      rating: 5,
      comment: ""
    }
  })

  const currentRating = form.watch("rating")

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    
    try {
      await reviewsAPI.create(data)
      
      toast.success("تم إرسال تقييمك بنجاح!", {
        description: "سيتم مراجعة التقييم وعرضه قريباً",
        duration: 5000,
      })
      
      // Reset form
      form.reset({
        sheikhId,
        name: "",
        phone: "",
        email: "",
        rating: 5,
        comment: ""
      })
      
      // Call success callback
      onSuccess?.()
    } catch (error: any) {
      console.error("Error submitting review:", error)
      
      toast.error("حدث خطأ في إرسال التقييم", {
        description: error.message || "يرجى المحاولة مرة أخرى",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= rating
      const isHovered = interactive && starValue <= hoveredRating
      
      return (
        <button
          key={index}
          type={interactive ? "button" : "button"}
          className={`transition-colors duration-200 ${
            interactive ? "hover:scale-110" : ""
          }`}
          onClick={() => {
            if (interactive) {
              form.setValue("rating", starValue)
            }
          }}
          onMouseEnter={() => {
            if (interactive) {
              setHoveredRating(starValue)
            }
          }}
          onMouseLeave={() => {
            if (interactive) {
              setHoveredRating(0)
            }
          }}
          disabled={!interactive}
        >
          <Star
            className={`w-8 h-8 ${
              isFilled || isHovered
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      )
    })
  }

  return (
    <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="arabic-heading text-foreground text-xl mb-2">
          قيّم {sheikhName}
        </CardTitle>
        <CardDescription className="arabic-text text-muted-foreground">
          شاركنا تجربتك مع المأذون لمساعدة الآخرين
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Stars */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="arabic-text font-medium text-foreground block mb-3">
                    التقييم
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {renderStars(field.value, true)}
                      <span className="arabic-text text-muted-foreground mr-3">
                        {field.value}/5
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="arabic-text font-medium text-foreground">
                    الاسم الكامل
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسمك الكامل"
                      className="arabic-text bg-background border-primary/20 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="arabic-text font-medium text-foreground">
                    رقم الهاتف
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="05xxxxxxxx"
                      className="arabic-text bg-background border-primary/20 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (Optional) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="arabic-text font-medium text-foreground">
                    البريد الإلكتروني (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      className="arabic-text bg-background border-primary/20 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="arabic-text font-medium text-foreground">
                    التعليق
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب تعليقك هنا..."
                      rows={4}
                      className="arabic-text bg-background border-primary/20 focus:border-primary resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg py-6 arabic-text shadow-islamic hover-lift"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  إرسال التقييم
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
