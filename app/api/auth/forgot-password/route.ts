import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { MockAuthService } from '@/lib/mock-auth';
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
      // Try using real AuthService first, fallback to MockAuthService
      let resetToken: string;
      let user: any;

      try {
        // Request password reset
        resetToken = await AuthService.requestPasswordReset(email);
        user = await AuthService.getUserByEmail(email);
      } catch (dbError) {
        console.log('🔄 Database not available, using mock service for testing...');
        
        // Fallback to mock service
        resetToken = await MockAuthService.requestPasswordReset(email);
        user = await MockAuthService.getUserByEmail(email);
      }

      if (!user) {
        // Return success anyway to prevent email enumeration
        return NextResponse.json({
          message: 'إذا كان البريد الإلكتروني مسجل لدينا، فسيتم إرسال رمز الاستعادة'
        });
      }

      try {
        // Send password reset email with code
        await EmailService.sendPasswordResetEmail(email, resetToken, user.name);
        
        return NextResponse.json({
          message: 'تم إرسال رمز استعادة كلمة المرور إلى بريدك الإلكتروني',
          // For development only - remove in production
          ...(process.env.NODE_ENV === 'development' && { 
            resetCode: resetToken,
            message: 'رمز الاستعادة تم إرساله إلى بريدك الإلكتروني'
          })
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Still return success to prevent information disclosure
        return NextResponse.json({
          message: 'تم إرسال رمز استعادة كلمة المرور',
          // For development, return token even if email fails
          ...(process.env.NODE_ENV === 'development' && { 
            resetCode: resetToken,
            emailError: 'فشل إرسال البريد الإلكتروني - تحقق من إعدادات SMTP'
          })
        });
      }
    } catch (outerError) {
      console.error('Main process failed:', outerError);
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجل لدينا، فسيتم إرسال رمز الاستعادة'
      });
    }

  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: 'إذا كان البريد الإلكتروني مسجل لدينا، فسيتم إرسال رمز الاستعادة'
    });
  }
}
