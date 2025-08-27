import { z } from "zod"

// Contact Form Validation Schema
export const contactFormSchema = z.object({
  firstName: z.string()
    .min(2, "الاسم الأول يجب أن يكون على الأقل حرفين")
    .max(50, "الاسم الأول يجب أن لا يتجاوز 50 حرف")
    .regex(/[\u0600-\u06FFa-zA-Z0-9\s]+/, "الاسم يمكن أن يحتوي على عربي/إنجليزي/أرقام"),
  
  lastName: z.string()
    .min(2, "اسم العائلة يجب أن يكون على الأقل حرفين")
    .max(50, "اسم العائلة يجب أن لا يتجاوز 50 حرف")
    .regex(/[\u0600-\u06FFa-zA-Z0-9\s]+/, "الاسم يمكن أن يحتوي على عربي/إنجليزي/أرقام"),
  
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .min(5, "البريد الإلكتروني يجب أن يكون على الأقل 5 أحرف")
    .max(100, "البريد الإلكتروني يجب أن لا يتجاوز 100 حرف"),
  
  phone: z.string()
    .regex(/^05\d{8}$/, "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام")
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام")
    .max(10, "رقم الهاتف يجب أن يكون 10 أرقام"),
  
  subject: z.enum([
    "general",
    "sheikh", 
    "registration",
    "support",
    "complaint",
    "suggestion"
  ], {
    required_error: "يرجى اختيار الموضوع"
  }),
  
  message: z.string()
    .min(10, "الرسالة يجب أن تكون على الأقل 10 أحرف")
    .max(1000, "الرسالة يجب أن لا تتجاوز 1000 حرف")
    .regex(/^[\u0600-\u06FF\s\.,!?()]+$/, "الرسالة يجب أن تكون باللغة العربية")
})

// Review Form Validation Schema
export const reviewFormSchema = z.object({
  sheikhId: z.string()
    .min(1, "معرف المأذون مطلوب"),
  
  name: z.string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب أن لا يتجاوز 100 حرف")
    .regex(/[\u0600-\u06FFa-zA-Z0-9\s]+/, "الاسم يمكن أن يحتوي على عربي/إنجليزي/أرقام"),
  
  phone: z.string()
    .regex(/^05\d{8}$/, "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام")
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام")
    .max(10, "رقم الهاتف يجب أن يكون 10 أرقام"),
  
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  
  rating: z.number()
    .min(1, "التقييم يجب أن يكون على الأقل نجمة واحدة")
    .max(5, "التقييم يجب أن لا يتجاوز 5 نجوم"),
  
  comment: z.string()
    .min(10, "التعليق يجب أن يكون على الأقل 10 أحرف")
    .max(500, "التعليق يجب أن لا يتجاوز 500 حرف")
    .regex(/^[\u0600-\u06FF\s\.,!?()]+$/, "التعليق يجب أن يكون باللغة العربية")
})

// Sheikh Request Form Validation Schema
export const sheikhRequestSchema = z.object({
  fullName: z.string()
    .min(2, "الاسم الكامل يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم الكامل يجب أن لا يتجاوز 100 حرف")
    .regex(/[\u0600-\u06FFa-zA-Z0-9\s]+/, "الاسم يمكن أن يحتوي على عربي/إنجليزي/أرقام"),
  
  phone: z.string()
    .regex(/^05\d{8}$/, "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام")
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام")
    .max(10, "رقم الهاتف يجب أن يكون 10 أرقام"),
  
  email: z.string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  
  serviceType: z.enum([
    "marriage",
    "divorce", 
    "other"
  ], {
    required_error: "يرجى اختيار نوع الخدمة"
  }),
  
  preferredDate: z.string()
    .min(1, "التاريخ المفضل مطلوب"),
  
  preferredTime: z.string()
    .min(1, "الوقت المفضل مطلوب"),
  
  additionalNotes: z.string()
    .max(500, "الملاحظات الإضافية يجب أن لا تتجاوز 500 حرف")
    .optional()
    .or(z.literal(""))
})

// Admin Message Response Schema
export const adminResponseSchema = z.object({
  messageId: z.string()
    .min(1, "معرف الرسالة مطلوب"),
  
  response: z.string()
    .max(1000, "الرد يجب أن لا يتجاوز 1000 حرف")
    .regex(/^[\u0600-\u06FF\s\.,!?()]*$/, "الرد يجب أن يكون باللغة العربية")
    .optional()
    .or(z.literal("")),
  
  status: z.enum([
    "read",
    "replied", 
    "closed"
  ], {
    required_error: "يرجى اختيار حالة الرسالة"
  })
}).superRefine((data, ctx) => {
  // الرد مطلوب فقط عندما تكون الحالة "تم الرد"
  if (data.status === 'replied') {
    const resp = (data.response || '').trim()
    if (resp.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الرد يجب أن يكون على الأقل 10 أحرف",
        path: ['response']
      })
    }
  }
})

// Admin Review Approval Schema
export const adminReviewApprovalSchema = z.object({
  reviewId: z.string()
    .min(1, "معرف التقييم مطلوب"),
  
  status: z.enum([
    "approved",
    "rejected"
  ], {
    required_error: "يرجى اختيار حالة التقييم"
  }),
  
  adminNotes: z.string()
    .max(500, "ملاحظات المدير يجب أن لا تتجاوز 500 حرف")
    .optional()
    .or(z.literal(""))
})

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>
export type ReviewFormData = z.infer<typeof reviewFormSchema>
export type SheikhRequestData = z.infer<typeof sheikhRequestSchema>
export type AdminResponseData = z.infer<typeof adminResponseSchema>
export type AdminReviewApprovalData = z.infer<typeof adminReviewApprovalSchema>
