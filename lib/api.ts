import { Article, ArticleCategory, ApiResponse } from '@/lib/types'

// Helper function to get base URL for API calls
function getBaseUrl() {
  // In server-side rendering, we need to use the full URL
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default to localhost
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' || 'https://mazoony-arabic-website-master1.vercel.app'	
  }
  // Client-side: use relative URLs
  return ''
}

// Types for search and pagination (للمدونة فقط)
interface SearchParams {
  page?: number
  limit?: number
  category?: string
  status?: string
  featured?: boolean
  search?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

interface ArticlesResponse extends ApiResponse {
  data: Article[]
  pagination?: PaginationInfo
}

interface ArticleResponse extends ApiResponse {
  data: Article
}

interface CategoriesResponse extends ApiResponse {
  data: ArticleCategory[]
}

// Articles API (المدونة)
export const articlesAPI = {
  // جلب جميع المقالات
  getAll: async (params: SearchParams = {}): Promise<Article[]> => {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.category) searchParams.set('category', params.category)
    if (params.status) searchParams.set('status', params.status)
    if (params.featured !== undefined) searchParams.set('featured', params.featured.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await fetch(`${getBaseUrl()}/api/articles?${searchParams}`)
    if (!response.ok) {
      throw new Error('فشل في جلب المقالات')
    }
    
    const result: ArticlesResponse = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  // جلب مقال واحد
  getById: async (id: string, incrementViews = false): Promise<Article> => {
    const searchParams = new URLSearchParams()
    if (incrementViews) searchParams.set('incrementViews', 'true')
    
    const response = await fetch(`${getBaseUrl()}/api/articles/${id}?${searchParams}`)
    if (!response.ok) {
      throw new Error('فشل في جلب المقال')
    }
    
    const result: ArticleResponse = await response.json()
    return result.data
  },

  // جلب مقال بواسطة الـ slug
  getBySlug: async (slug: string, incrementViews = false): Promise<Article> => {
    return articlesAPI.getById(slug, incrementViews)
  },

  // إنشاء مقال جديد
  create: async (articleData: Partial<Article>): Promise<Article> => {
    const response = await fetch(`${getBaseUrl()}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في إنشاء المقال')
    }

    const result: ArticleResponse = await response.json()
    return result.data
  },

  // تحديث مقال
  update: async (id: string, articleData: Partial<Article>): Promise<Article> => {
    const response = await fetch(`${getBaseUrl()}/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث المقال')
    }

    const result: ArticleResponse = await response.json()
    return result.data
  },

  // حذف مقال
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/api/articles/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف المقال')
    }
  },

  // جلب المقالات مع معلومات التصفح
  getAllWithPagination: async (params: SearchParams = {}): Promise<{ articles: Article[], pagination: PaginationInfo }> => {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.category) searchParams.set('category', params.category)
    if (params.status) searchParams.set('status', params.status)
    if (params.featured !== undefined) searchParams.set('featured', params.featured.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await fetch(`${getBaseUrl()}/api/articles?${searchParams}`)
    if (!response.ok) {
      throw new Error('فشل في جلب المقالات')
    }
    
    const result: ArticlesResponse = await response.json()
    return {
      articles: result.data,
      pagination: result.pagination!
    }
  }
}

// Article Categories API (تصنيفات المدونة)
export const articleCategoriesAPI = {
  // جلب جميع التصنيفات
  getAll: async (activeOnly = false): Promise<ArticleCategory[]> => {
    const searchParams = new URLSearchParams()
    if (activeOnly) searchParams.set('active', 'true')

    const response = await fetch(`${getBaseUrl()}/api/articles/categories?${searchParams}`)
    if (!response.ok) {
      throw new Error('فشل في جلب تصنيفات المقالات')
    }
    
    const result: CategoriesResponse = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  // إنشاء تصنيف جديد
  create: async (categoryData: Partial<ArticleCategory>): Promise<ArticleCategory> => {
    const response = await fetch(`${getBaseUrl()}/api/articles/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في إنشاء التصنيف')
    }

    const result = await response.json()
    return result.data
  }
}

// Sheikhs API (الأصلي)
export const sheikhsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs`)
    if (!response.ok) throw new Error('فشل في جلب المأذونين')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  getById: async (id: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs/${id}`)
    if (!response.ok) throw new Error('فشل في جلب المأذون')
    const result = await response.json()
    return result.data
  },

  getBySlug: async (slug: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs/${slug}`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('المأذون غير موجود')
      }
      throw new Error('فشل في جلب المأذون')
    }
    const result = await response.json()
    return result
  },

  getByCity: async (citySlug: string): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs?city=${citySlug}`)
    if (!response.ok) throw new Error('فشل في جلب مأذوني المدينة')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  search: async (query: string): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs?search=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('فشل في البحث عن المأذونين')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  create: async (sheikhData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheikhData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في إضافة المأذون')
    }
    const result = await response.json()
    return result.data
  },

  update: async (id: string, sheikhData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheikhData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث المأذون')
    }
    const result = await response.json()
    return result.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/api/sheikhs/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف المأذون')
    }
  }
}

// Cities API (الأصلي)
export const citiesAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/cities`)
    if (!response.ok) throw new Error('فشل في جلب المدن')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  getFeatured: async (): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/cities?featured=true`)
    if (!response.ok) throw new Error('فشل في جلب المدن المميزة')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  getById: async (id: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/cities/${id}`)
    if (!response.ok) throw new Error('فشل في جلب المدينة')
    const result = await response.json()
    return result.data
  },

  getBySlug: async (slug: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/cities/${slug}`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('المدينة غير موجودة')
      }
      throw new Error('فشل في جلب المدينة')
    }
    const result = await response.json()
    return result
  },

  create: async (cityData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في إضافة المدينة')
    }
    const result = await response.json()
    return result.data
  },

  update: async (id: string, cityData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/cities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cityData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث المدينة')
    }
    const result = await response.json()
    return result.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/api/cities/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف المدينة')
    }
  }
}

// Reviews API (الأصلي)
export const reviewsAPI = {
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/reviews`)
    if (!response.ok) throw new Error('فشل في جلب التقييمات')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  getById: async (id: string): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/reviews/${id}`)
    if (!response.ok) throw new Error('فشل في جلب التقييم')
    const result = await response.json()
    return result.data
  },

  getBySheikh: async (sheikhId: string): Promise<any[]> => {
    const response = await fetch(`${getBaseUrl()}/api/reviews?sheikhId=${sheikhId}`)
    if (!response.ok) throw new Error('فشل في جلب تقييمات المأذون')
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : []
  },

  create: async (reviewData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في إضافة التقييم')
    }
    const result = await response.json()
    return result.data
  },

  update: async (id: string, reviewData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث التقييم')
    }
    const result = await response.json()
    return result.data
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${getBaseUrl()}/api/reviews/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف التقييم')
    }
  }
}

// Settings API (الأصلي)
export const settingsAPI = {
  get: async (): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/settings`)
    if (!response.ok) throw new Error('فشل في جلب الإعدادات')
    const result = await response.json()
    return result.data || {}
  },

  update: async (settingsData: any): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث الإعدادات')
    }
    const result = await response.json()
    return result.data
  }
}

// Messages API
export const messagesAPI = {
  async create(messageData: any) {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في إرسال الرسالة')
    }
    return await response.json()
  },

  async getAll(params: any = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const response = await fetch(`/api/admin/messages?${queryParams}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في جلب الرسائل')
    }
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : [])
  },

  async getById(id: string) {
    const response = await fetch(`/api/admin/messages/${id}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في جلب الرسالة')
    }
    return await response.json()
  },

  async update(id: string, messageData: any) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث الرسالة')
    }
    return await response.json()
  },

  async delete(id: string) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف الرسالة')
    }
    return await response.json()
  }
}

// Admin API
export const adminAPI = {
  async getStats() {
    const response = await fetch('/api/stats')
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في جلب الإحصائيات')
    }
    return await response.json()
  },

  async getMessages(params: any = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const response = await fetch(`/api/admin/messages?${queryParams}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في جلب الرسائل')
    }
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : [])
  },

  async getReviews(params: any = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const response = await fetch(`/api/admin/reviews?${queryParams}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في جلب التقييمات')
    }
    const result = await response.json()
    return Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : [])
  },

  async updateMessageStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث حالة الرسالة')
    }
    return await response.json()
  },

  async updateReviewStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في تحديث حالة التقييم')
    }
    return await response.json()
  },

  async deleteReview(id: string) {
    const response = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف التقييم')
    }
    return await response.json()
  },

  async deleteMessage(id: string) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'فشل في حذف الرسالة')
    }
    return await response.json()
  },

  messages: {
    async respond(id: string, data: { status: string; response?: string }) {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'فشل في تحديث الرسالة')
      }
      return await response.json()
    }
  }
}

// Search API (البحث الشامل)
export const searchAPI = {
  search: async (query: string, type: 'all' | 'cities' | 'sheikhs' = 'all', limit: number = 10): Promise<any> => {
    const searchParams = new URLSearchParams()
    searchParams.set('q', query)
    searchParams.set('type', type)
    searchParams.set('limit', limit.toString())

    const response = await fetch(`${getBaseUrl()}/api/search?${searchParams}`)
    if (!response.ok) throw new Error('فشل في البحث')
    const result = await response.json()
    return result
  }
}

// Backward compatibility aliases (للتوافق مع الكود السابق)
export const cityAPI = citiesAPI
export const sheikhAPI = sheikhsAPI