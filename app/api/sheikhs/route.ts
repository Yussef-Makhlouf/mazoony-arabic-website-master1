import { NextRequest, NextResponse } from 'next/server'
import { SheikhService } from '@/lib/database'

// GET /api/sheikhs - Get all sheikhs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    
    let sheikhs
    
    if (search) {
      sheikhs = await SheikhService.searchSheikhs(search)
    } else if (city) {
      sheikhs = await SheikhService.getSheikhsByCity(city)
    } else {
      sheikhs = await SheikhService.getAllSheikhs()
    }
    
    return NextResponse.json({ data: sheikhs })
  } catch (error) {
    console.error('Error fetching sheikhs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sheikhs' },
      { status: 500 }
    )
  }
}

// POST /api/sheikhs - Add new sheikh
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.slug || !body.cityId || !body.phone) {
      return NextResponse.json(
        { error: 'Name, slug, cityId, and phone are required' },
        { status: 400 }
      )
    }

    const sheikhData = {
      name: body.name,
      slug: body.slug,
      cityId: body.cityId,
      city: body.city || '',
      citySlug: body.citySlug || '',
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      specialties: body.specialties || [],
      experience: body.experience || '',
      availability: body.availability || 'متاح',
      bio: body.bio || '',
      education: body.education || '',
      languages: body.languages || ['العربية'],
      ratings: body.ratings || {
        commitment: 0,
        ease: 0,
        knowledge: 0,
        price: 0
      },
      verified: body.verified || false,
      isActive: true,
      price: body.price || '0',
      image: body.image || ''
    }

    const newSheikh = await SheikhService.createSheikh(sheikhData)
    return NextResponse.json(newSheikh, { status: 201 })
  } catch (error: any) {
    console.error('Error creating sheikh:', error)
    
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create sheikh' },
      { status: 500 }
    )
  }
}

// DELETE /api/sheikhs?id=[id] - Delete sheikh (accepts both ObjectId and slug)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('DELETE sheikh request received for id:', id)
    
    if (!id) {
      return NextResponse.json(
        { error: 'Sheikh ID is required' },
        { status: 400 }
      )
    }

    // Check if id is a valid ObjectId (24 hex characters)
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    let sheikhToDelete
    
    console.log('Is ObjectId format:', isObjectId)
    
    if (isObjectId) {
      // If it's an ObjectId, get the sheikh by ID
      sheikhToDelete = await SheikhService.getSheikhById(id)
      console.log('Sheikh found by ID:', !!sheikhToDelete)
    } else {
      // If it's not an ObjectId, treat it as a slug
      sheikhToDelete = await SheikhService.getSheikhBySlug(id)
      console.log('Sheikh found by slug:', !!sheikhToDelete)
    }
    
    if (!sheikhToDelete) {
      console.log('Sheikh not found for id:', id)
      return NextResponse.json(
        { 
          error: 'Sheikh not found', 
          details: `No sheikh found with ${isObjectId ? 'ID' : 'slug'}: ${id}`,
          debug: `Searched by ${isObjectId ? 'ObjectId' : 'slug'} format`
        },
        { status: 404 }
      )
    }

    console.log('About to delete sheikh with _id:', sheikhToDelete._id)
    
    // Use the actual ObjectId for deletion
    const deleted = await SheikhService.deleteSheikh(sheikhToDelete._id!)
    
    console.log('Delete operation result:', deleted)
    
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
      { error: `Failed to delete sheikh: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
