import { NextRequest, NextResponse } from 'next/server'
import { MessageService } from '@/lib/database'
import { adminResponseSchema } from '@/lib/validations'

// PUT /api/admin/messages/[id] - Update message status and add response
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate with Zod schema
    const validationResult = adminResponseSchema.safeParse({
      ...body,
      messageId: params.id
    })
    
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

    const updateData = {
      status: validatedData.status,
      adminResponse: validatedData.response,
      respondedAt: new Date(),
      adminNotes: body.adminNotes || ''
    }

    const updatedMessage = await MessageService.updateMessage(params.id, updateData)
    
    if (!updatedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/messages/[id] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedMessage = await MessageService.deleteMessage(params.id)
    
    if (!deletedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
