import { NextRequest, NextResponse } from 'next/server'
import { ReviewService } from '@/lib/database'
import { reviewFormSchema } from '@/lib/validations'

// GET /api/reviews - Get reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sheikhId = searchParams.get('sheikhId')
    const status = searchParams.get('status') as any
    
    let reviews
    
    if (sheikhId) {
      reviews = await ReviewService.getReviewsBySheikh(sheikhId)
    } else if (status) {
      if (status === 'pending') {
        reviews = await ReviewService.getPendingReviews()
      } else {
        reviews = await ReviewService.getReviewsByStatus(status)
      }
    } else {
      // Get all reviews for admin
      reviews = await ReviewService.getAllReviews()
    }
    
    return NextResponse.json({ data: reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate with Zod schema
    const validationResult = reviewFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    const reviewData = {
      sheikhId: validatedData.sheikhId,
      sheikhName: (validatedData as any).sheikhName || '',
      sheikhImage: (validatedData as any).sheikhImage || '',
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || '',
      rating: validatedData.rating,
      comment: validatedData.comment,
      status: 'pending' as const,
      isVerified: false,
      reported: false
    }

    const newReview = await ReviewService.createReview(reviewData)
    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
