import { NextRequest, NextResponse } from 'next/server'
import { CityService } from '@/lib/database'
import { RouteContext } from '@/lib/types'

// GET /api/cities/[slug] - Get city by slug
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    const city = await CityService.getCityBySlug(slug)
    
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(city)
  } catch (error) {
    console.error('Error fetching city:', error)
    return NextResponse.json(
      { error: 'Failed to fetch city' },
      { status: 500 }
    )
  }
}

// PUT /api/cities/[slug] - Update city
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    const body = await request.json()
    
    // Get city first to get its ID
    const city = await CityService.getCityBySlug(slug)
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }
    
    const updatedCity = await CityService.updateCity(city._id!, body)
    
    if (!updatedCity) {
      return NextResponse.json(
        { error: 'Failed to update city' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedCity)
  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json(
      { error: 'Failed to update city' },
      { status: 500 }
    )
  }
}

// DELETE /api/cities/[slug] - Delete city
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params
    
    // Get city first to get its ID
    const city = await CityService.getCityBySlug(slug)
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }
    
    const deleted = await CityService.deleteCity(city._id!)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete city' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ message: 'City deleted successfully' })
  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json(
      { error: 'Failed to delete city' },
      { status: 500 }
    )
  }
}
