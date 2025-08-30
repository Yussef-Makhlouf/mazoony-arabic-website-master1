import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { EmailService } from '@/lib/email';
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

    try {
      // Check if user exists first
      const user = await AuthService.getUserByEmail(email);

      if (!user) {
        // Return success anyway to prevent email enumeration
        return NextResponse.json({
          message: 'إذا كان البريد الإلكتروني مسجل لدينا، فسيتم إرسال رمز الاستعادة'
        });
      }

      // Request password reset using real AuthService only
      const resetCode = await AuthService.requestPasswordReset(email);

      try {
        // Send password reset email with code
        await EmailService.sendPasswordResetEmail(email, resetCode);
        
        return NextResponse.json({
          message: 'تم إرسال رمز الاستعادة إلى بريدك الإلكتروني',
          success: true
        });
        
      } catch (emailError: any) {
        console.error('Email sending error:', emailError);
        
        return NextResponse.json(
          { error: 'حدث خطأ في إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى لاحقاً.' },
          { status: 500 }
        );
      }

    } catch (authError: any) {
      console.error('Auth service error:', authError);
      
      // Return success anyway to prevent email enumeration
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجل لدينا، فسيتم إرسال رمز الاستعادة'
      });
    }

  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الطلب' },
      { status: 500 }
    );
  }
}
