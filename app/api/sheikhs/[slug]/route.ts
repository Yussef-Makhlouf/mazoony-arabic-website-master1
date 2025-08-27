import { NextRequest, NextResponse } from 'next/server'
import { SheikhService } from '@/lib/database'
import { RouteContext } from '@/lib/types'

// GET /api/sheikhs/[slug] - Get sheikh by slug
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    const sheikh = await SheikhService.getSheikhBySlug(slug)
    
    if (!sheikh) {
      return NextResponse.json(
        { error: 'Sheikh not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(sheikh)
  } catch (error) {
    console.error('Error fetching sheikh:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sheikh' },
      { status: 500 }
    )
  }
}

// PUT /api/sheikhs/[slug] - Update sheikh
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    const body = await request.json()
    
    // Get sheikh first to get its ID
    const sheikh = await SheikhService.getSheikhBySlug(slug)
    if (!sheikh) {
      return NextResponse.json(
        { error: 'Sheikh not found' },
        { status: 404 }
      )
    }
    
    const updatedSheikh = await SheikhService.updateSheikh(sheikh._id!, body)
    
    if (!updatedSheikh) {
      return NextResponse.json(
        { error: 'Failed to update sheikh' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedSheikh)
  } catch (error) {
    console.error('Error updating sheikh:', error)
    return NextResponse.json(
      { error: 'Failed to update sheikh' },
      { status: 500 }
    )
  }
}

// DELETE /api/sheikhs/[slug] - Delete sheikh
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    
    // Get sheikh first to get its ID
    const sheikh = await SheikhService.getSheikhBySlug(slug)
    if (!sheikh) {
      return NextResponse.json(
        { error: 'Sheikh not found' },
        { status: 404 }
      )
    }
    
    const deleted = await SheikhService.deleteSheikh(sheikh._id!)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete sheikh' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'Sheikh deleted successfully' })
  } catch (error) {
    console.error('Error deleting sheikh:', error)
    return NextResponse.json(
      { error: 'Failed to delete sheikh' },
      { status: 500 }
    )
  }
}
