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

// DELETE /api/cities?id=[id] - Delete city (accepts both ObjectId and slug)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('DELETE city request received for id:', id)
    
    if (!id) {
      return NextResponse.json(
        { error: 'City ID is required' },
        { status: 400 }
      )
    }

    // Check if id is a valid ObjectId (24 hex characters)
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    let cityToDelete
    
    console.log('Is ObjectId format:', isObjectId)
    
    if (isObjectId) {
      // If it's an ObjectId, get the city by ID
      cityToDelete = await CityService.getCityById(id)
      console.log('City found by ID:', !!cityToDelete)
    } else {
      // If it's not an ObjectId, treat it as a slug
      cityToDelete = await CityService.getCityBySlug(id)
      console.log('City found by slug:', !!cityToDelete)
    }
    
    if (!cityToDelete) {
      console.log('City not found for id:', id)
      return NextResponse.json(
        { 
          error: 'City not found', 
          details: `No city found with ${isObjectId ? 'ID' : 'slug'}: ${id}`,
          debug: `Searched by ${isObjectId ? 'ObjectId' : 'slug'} format`
        },
        { status: 404 }
      )
    }

    console.log('About to delete city with _id:', cityToDelete._id)
    
    // Use the actual ObjectId for deletion
    const deleted = await CityService.deleteCity(cityToDelete._id!)
    
    console.log('Delete operation result:', deleted)
    
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
      { error: `Failed to delete city: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
