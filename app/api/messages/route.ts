import { NextRequest, NextResponse } from 'next/server'
import { MessageService } from '@/lib/database'

// GET /api/messages - Get all messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as any
    
    let messages
    
    if (status) {
      messages = await MessageService.getMessagesByStatus(status)
    } else {
      messages = await MessageService.getAllMessages()
    }
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const messageData = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject,
      message: body.message,
      sheikhId: body.sheikhId || undefined,
      priority: body.priority || 'medium',
      type: body.type || 'general',
      tags: body.tags || [],
      status: 'new' as const // Fix status type
    }

    const newMessage = await MessageService.createMessage(messageData)
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}
