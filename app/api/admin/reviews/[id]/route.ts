import { NextRequest, NextResponse } from 'next/server'
import { ReviewService } from '@/lib/database'
import { adminReviewApprovalSchema } from '@/lib/validations'

// PUT /api/admin/reviews/[id] - Update review status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate with Zod schema
    const validationResult = adminReviewApprovalSchema.safeParse({
      ...body,
      reviewId: params.id
    })
    
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

    const updateData = {
      status: validatedData.status,
      adminNotes: validatedData.adminNotes || '',
      reviewedAt: new Date(),
      isVerified: validatedData.status === 'approved'
    }

    const updatedReview = await ReviewService.updateReview(params.id, updateData)
    
    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/reviews/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedReview = await ReviewService.deleteReview(params.id)
    
    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
