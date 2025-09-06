import { NextRequest, NextResponse } from 'next/server'
import { ReviewService } from '@/lib/database'

// GET /api/admin/reviews - Get all reviews for admin panel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let reviews
    
    if (status && status !== 'all') {
      reviews = await ReviewService.getReviewsByStatus(status)
    } else {
      reviews = await ReviewService.getAllReviews()
    }
    
    // Sort by creation date (newest first)
    reviews.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Apply pagination if needed
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = reviews.slice(startIndex, endIndex)
    
    return NextResponse.json({
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total: reviews.length,
        pages: Math.ceil(reviews.length / limit),
        hasNext: endIndex < reviews.length,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching admin reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
