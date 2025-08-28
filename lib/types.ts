// Next.js 15 Route Types
export type RouteContext = {
  params: Promise<{ slug: string }>
}

// Next.js 15 Page Props Types
export type PageProps = {
  params: Promise<{ slug: string }>
}

// Client Component Props Types
export type ClientPageProps = {
  params: { slug: string }
}

// API Response Types
export type ApiResponse<T = any> = {
  data?: T
  error?: string
  message?: string
}

// Sheikh Types
export type Sheikh = {
  _id: string
  name: string
  slug: string
  city: string
  citySlug: string
  specialties: string[]
  rating: number
  reviewCount: number
  experience: number
  availability: string
  verified: boolean
  phone: string
  address: string
  bio: string
  image?: string
  certificates: string[]
  languages: string[]
  fees?: {
    marriage: number
    divorce: number
    other: number
  }
  workingHours?: {
    days: string[]
    hours: string
  }
  createdAt: Date
  updatedAt: Date
}

// City Types
export type City = {
  _id: string
  name: string
  slug: string
  description: string
  image?: string
  sheikhCount: number
  createdAt: Date
  updatedAt: Date
}

// Review Types
export type Review = {
  _id: string
  sheikhId: string
  sheikhName?: string
  sheikhImage?: string
  name: string
  phone: string
  email?: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// Message Types
export type Message = {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  sheikhId?: string
  priority: 'low' | 'medium' | 'high'
  type: 'general' | 'inquiry' | 'complaint' | 'suggestion'
  tags: string[]
  status: 'unread' | 'read' | 'replied' | 'closed'
  createdAt: Date
  updatedAt: Date
}
