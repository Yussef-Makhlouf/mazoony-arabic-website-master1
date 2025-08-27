import { NextRequest, NextResponse } from 'next/server'
import { CityService, SheikhService } from '@/lib/database'

// GET /api/search - Search cities and sheikhs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // 'cities', 'sheikhs', 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query.trim()) {
      return NextResponse.json({
        cities: [],
        sheikhs: [],
        total: 0
      })
    }

    let results = {
      cities: [] as any[],
      sheikhs: [] as any[],
      total: 0
    }

    // Search cities
    if (type === 'all' || type === 'cities') {
      results.cities = await CityService.searchCities(query, limit)
    }

    // Search sheikhs
    if (type === 'all' || type === 'sheikhs') {
      results.sheikhs = await SheikhService.searchSheikhs(query, limit)
    }

    results.total = results.cities.length + results.sheikhs.length

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}
