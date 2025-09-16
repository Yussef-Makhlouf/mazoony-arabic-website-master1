import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// تنسيق التاريخ باللغة العربية
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory'
  }).format(dateObj)
}

// حساب المدة منذ التاريخ
export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'اليوم'
  } else if (diffInDays === 1) {
    return 'أمس'
  } else if (diffInDays < 7) {
    return `منذ ${diffInDays} أيام`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`
  }
}

// تحويل النص إلى slug
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FF\w\s-]/g, '') // إزالة الرموز باستثناء العربية والإنجليزية
    .replace(/\s+/g, '-') // تحويل المسافات إلى شرطات
    .replace(/--+/g, '-') // تنظيف الشرطات المتعددة
    .replace(/^-|-$/g, '') // إزالة الشرطات من البداية والنهاية
}

// قطع النص مع إضافة نقاط
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength).trim() + '...'
}

// تحويل الرقم إلى نص عربي
export function numberToArabic(num: number): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumbers[parseInt(digit)])
}

// دالة debounce لتأخير تنفيذ الدالة
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}