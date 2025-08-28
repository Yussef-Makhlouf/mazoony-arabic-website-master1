// API utility functions for fetching data from our APIs

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

// Generic fetch function with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error)
    throw error
  }
}

// City API functions
export const cityAPI = {
  // Get all cities
  getAll: () => apiFetch<any[]>('/cities'),
  
  // Get featured cities
  getFeatured: () => apiFetch<any[]>('/cities?featured=true'),
  
  // Get city by slug
  getBySlug: (slug: string) => apiFetch<any>(`/cities/${slug}`),
  
  // Search cities
  search: (query: string, limit?: number) => {
    const params = new URLSearchParams({ q: query })
    if (limit) params.append('limit', limit.toString())
    return apiFetch<any[]>(`/search?type=cities&${params.toString()}`)
  },
  
  // Get sheikhs by city
  getSheikhs: (citySlug: string) => apiFetch<any>(`/cities/${citySlug}/sheikhs`),
}

// Sheikh API functions
export const sheikhAPI = {
  // Get all sheikhs
  getAll: () => apiFetch<any[]>('/sheikhs'),
  
  // Get sheikh by slug
  getBySlug: (slug: string) => apiFetch<any>(`/sheikhs/${slug}`),
  
  // Get sheikhs by city
  getByCity: (citySlug: string) => apiFetch<any[]>(`/sheikhs?city=${citySlug}`),
  
  // Search sheikhs
  search: (query: string, limit?: number) => {
    const params = new URLSearchParams({ q: query })
    if (limit) params.append('limit', limit.toString())
    return apiFetch<any[]>(`/search?type=sheikhs&${params.toString()}`)
  },
}

// Search API function
export const searchAPI = {
  // Search both cities and sheikhs
  search: (query: string, type: 'all' | 'cities' | 'sheikhs' = 'all', limit?: number) => {
    const params = new URLSearchParams({ q: query, type })
    if (limit) params.append('limit', limit.toString())
    return apiFetch<any>(`/search?${params.toString()}`)
  },
}

// Stats API function
export const statsAPI = {
  // Get dashboard stats
  getDashboard: () => apiFetch<any>('/stats'),
}

// Reviews API function
export const reviewsAPI = {
  // Get all reviews
  getAll: () => apiFetch<any[]>('/reviews'),
  
  // Get reviews by sheikh
  getBySheikh: (sheikhId: string) => apiFetch<any[]>(`/reviews?sheikhId=${sheikhId}`),
  
  // Create review
  create: (reviewData: any) => apiFetch<any>('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  // Update review
  update: (reviewId: string, reviewData: any) => apiFetch<any>(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),
  
  // Delete review
  delete: (reviewId: string) => apiFetch<any>(`/reviews/${reviewId}`, {
    method: 'DELETE',
  }),
}

// Settings API
export const settingsAPI = {
  get: () => apiFetch<any>('/settings'),
  update: (data: any) => apiFetch<any>('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// Messages API function
export const messagesAPI = {
  // Get all messages
  getAll: () => apiFetch<any[]>('/messages'),
  
  // Get messages by status
  getByStatus: (status: string) => apiFetch<any[]>(`/messages?status=${status}`),
  
  // Create message
  create: (messageData: any) => apiFetch<any>('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
  
  // Update message
  update: (messageId: string, messageData: any) => apiFetch<any>(`/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify(messageData),
  }),
  
  // Delete message
  delete: (messageId: string) => apiFetch<any>(`/messages/${messageId}`, {
    method: 'DELETE',
  }),
}

// Sheikh Requests API function
export const sheikhRequestsAPI = {
  // Get all requests
  getAll: () => apiFetch<any[]>('/sheikh-requests'),
  
  // Get requests by sheikh
  getBySheikh: (sheikhId: string) => apiFetch<any[]>(`/sheikh-requests?sheikhId=${sheikhId}`),
  
  // Get requests by status
  getByStatus: (status: string) => apiFetch<any[]>(`/sheikh-requests?status=${status}`),
  
  // Create request
  create: (requestData: any) => apiFetch<any>('/sheikh-requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),
  
  // Update request
  update: (requestId: string, requestData: any) => apiFetch<any>(`/sheikh-requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(requestData),
  }),
  
  // Delete request
  delete: (requestId: string) => apiFetch<any>(`/sheikh-requests/${requestId}`, {
    method: 'DELETE',
  }),
}

// Admin API functions
export const adminAPI = {
  // Messages
  messages: {
    // Respond to message
    respond: (messageId: string, responseData: any) => apiFetch<any>(`/admin/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(responseData),
    }),
    
    // Delete message
    delete: (messageId: string) => apiFetch<any>(`/admin/messages/${messageId}`, {
      method: 'DELETE',
    }),
  },
  
  // Reviews
  reviews: {
    // Approve/Reject review
    updateStatus: (reviewId: string, statusData: any) => apiFetch<any>(`/admin/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),
    
    // Delete review
    delete: (reviewId: string) => apiFetch<any>(`/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
  },
}
