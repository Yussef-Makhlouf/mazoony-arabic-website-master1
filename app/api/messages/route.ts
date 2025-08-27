import { NextRequest, NextResponse } from 'next/server'
import { MessageService } from '@/lib/database'
import { contactFormSchema } from '@/lib/validations'

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
    
    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    const messageData = {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      phone: validatedData.phone,
      subject: validatedData.subject,
      message: validatedData.message,
      sheikhId: body.sheikhId || undefined,
      priority: body.priority || 'medium',
      type: body.type || 'general',
      tags: body.tags || [],
      status: 'new' as const
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
