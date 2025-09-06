import { NextRequest, NextResponse } from 'next/server'
import { MessageService } from '@/lib/database'

// GET /api/admin/messages - Get all messages for admin panel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let messages
    
    if (status && status !== 'all') {
      messages = await MessageService.getMessagesByStatus(status)
    } else {
      messages = await MessageService.getAllMessages()
    }
    
    // Sort by creation date (newest first)
    messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Apply pagination if needed
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMessages = messages.slice(startIndex, endIndex)
    
    return NextResponse.json({
      data: paginatedMessages,
      pagination: {
        page,
        limit,
        total: messages.length,
        pages: Math.ceil(messages.length / limit),
        hasNext: endIndex < messages.length,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching admin messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
