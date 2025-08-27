import { NextRequest, NextResponse } from 'next/server'
import { SettingsService } from '@/lib/database'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Fetching settings...')
    
    // Test database connection first
    try {
      const db = await getDatabase()
      console.log('Database connection successful')
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }
    
    const settings = await SettingsService.getSettings()
    console.log('Settings fetched successfully:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Updating settings with:', body)
    
    // Test database connection first
    try {
      const db = await getDatabase()
      console.log('Database connection successful')
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }
    
    const updated = await SettingsService.updateSettings(body)
    console.log('Settings updated successfully:', updated)
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


