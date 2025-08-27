import { NextRequest, NextResponse } from 'next/server'
import { SheikhRequestService } from '@/lib/database'
import { sheikhRequestSchema } from '@/lib/validations'

// GET /api/sheikh-requests - Get all sheikh requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const sheikhId = searchParams.get('sheikhId')
    
    let requests
    
    if (sheikhId) {
      requests = await SheikhRequestService.getRequestsBySheikh(sheikhId)
    } else if (status) {
      requests = await SheikhRequestService.getRequestsByStatus(status)
    } else {
      requests = await SheikhRequestService.getAllRequests()
    }
    
    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching sheikh requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sheikh requests' },
      { status: 500 }
    )
  }
}

// POST /api/sheikh-requests - Create new sheikh request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate with Zod schema
    const validationResult = sheikhRequestSchema.safeParse(body)
    
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

    const requestData = {
      sheikhId: body.sheikhId,
      fullName: validatedData.fullName,
      phone: validatedData.phone,
      email: validatedData.email || '',
      serviceType: validatedData.serviceType,
      preferredDate: validatedData.preferredDate,
      preferredTime: validatedData.preferredTime,
      additionalNotes: validatedData.additionalNotes || '',
      status: 'pending' as const,
      priority: 'medium' as const
    }

    const newRequest = await SheikhRequestService.createRequest(requestData)
    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating sheikh request:', error)
    return NextResponse.json(
      { error: 'Failed to create sheikh request' },
      { status: 500 }
    )
  }
}
