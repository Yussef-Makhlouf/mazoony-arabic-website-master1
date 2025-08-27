import { NextRequest, NextResponse } from 'next/server'
import { StatisticsService } from '@/lib/database'

// GET /api/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let stats
    
    if (type === 'sheikhs') {
      stats = await StatisticsService.getSheikhStats()
    } else {
      stats = await StatisticsService.getDashboardStats()
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
