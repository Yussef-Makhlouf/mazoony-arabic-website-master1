import { NextRequest, NextResponse } from 'next/server'
import { CityService } from '@/lib/database'

// GET /api/cities - Get all cities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    
    let cities
    
    if (featured === 'true') {
      cities = await CityService.getFeaturedCitiesWithActualCounts()
    } else {
      cities = await CityService.getCitiesWithActualCounts()
    }
    
    return NextResponse.json({ data: cities })
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}

// POST /api/cities - Add new city
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const cityData = {
      name: body.name,
      slug: body.slug,
      count: body.count || 0,
      region: body.region || '',
      population: body.population || '',
      description: body.description || '',
      featured: body.featured || false,
      isActive: true
    }

    const newCity = await CityService.createCity(cityData)
    return NextResponse.json(newCity, { status: 201 })
  } catch (error: any) {
    console.error('Error creating city:', error)
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    )
  }
}

// DELETE /api/cities/[id] - Delete city
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'City ID is required' },
        { status: 400 }
      )
    }

    const deleted = await CityService.deleteCity(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
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
