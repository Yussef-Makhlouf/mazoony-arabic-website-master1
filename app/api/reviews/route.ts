import { NextRequest, NextResponse } from 'next/server'
import { ReviewService } from '@/lib/database'

// GET /api/reviews - Get reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sheikhId = searchParams.get('sheikhId')
    const status = searchParams.get('status') as any
    
    let reviews
    
    if (sheikhId) {
      reviews = await ReviewService.getReviewsBySheikh(sheikhId)
    } else if (status === 'pending') {
      reviews = await ReviewService.getPendingReviews()
    } else {
      return NextResponse.json(
        { error: 'sheikhId parameter is required' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(reviews)
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
    
    // Validate required fields
    if (!body.sheikhId || !body.name || !body.phone || !body.rating || !body.comment) {
      return NextResponse.json(
        { error: 'sheikhId, name, phone, rating, and comment are required' },
        { status: 400 }
      )
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const reviewData = {
      sheikhId: body.sheikhId,
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      rating: body.rating,
      comment: body.comment,
      status: 'pending' as const, // Fix status type
      isVerified: false, // Add default verification status
      reported: false // Add default reported status
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
