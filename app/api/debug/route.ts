import { NextRequest, NextResponse } from 'next/server'
import { CityService, SheikhService } from '@/lib/database'

// GET /api/debug - Debug endpoint to check data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    
    console.log('Debug request for type:', type)
    
    let result: any = {}
    
    if (type === 'all' || type === 'cities') {
      const cities = await CityService.getAllCities()
      result.cities = {
        count: cities.length,
        data: cities.slice(0, 3).map(city => ({
          _id: city._id,
          name: city.name,
          slug: city.slug,
          isActive: city.isActive
        }))
      }
    }
    
    if (type === 'all' || type === 'sheikhs') {
      const sheikhs = await SheikhService.getAllSheikhs()
      result.sheikhs = {
        count: sheikhs.length,
        data: sheikhs.slice(0, 3).map(sheikh => ({
          _id: sheikh._id,
          name: sheikh.name,
          slug: sheikh.slug,
          isActive: sheikh.isActive
        }))
      }
    }
    
    console.log('Debug result:', result)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: `Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
