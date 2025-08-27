import { NextRequest, NextResponse } from 'next/server'
import { CityService, SheikhService } from '@/lib/database'
import { RouteContext } from '@/lib/types'

// GET /api/cities/[slug]/sheikhs - Get sheikhs by city slug
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

    const sheikhs = await SheikhService.getSheikhsByCity(slug)
    
    return NextResponse.json({
      city,
      sheikhs,
      count: sheikhs.length
    })
  } catch (error) {
    console.error('Error fetching sheikhs for city:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sheikhs for city' },
      { status: 500 }
    )
  }
}
