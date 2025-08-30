import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Request password reset
    const resetToken = await AuthService.requestPasswordReset(email);

    // In a real application, you would send this token via email
    // For development, we'll return it in the response
    // TODO: Implement email service
    
    return NextResponse.json({
      message: 'تم إرسال رمز استعادة كلمة المرور',
      // Remove this in production - send via email instead
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: 'إذا كان البريد الإلكتروني مسجل لدينا، فسيتم إرسال رمز الاستعادة'
    });
  }
}
