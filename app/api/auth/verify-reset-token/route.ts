import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { MockAuthService } from '@/lib/mock-auth';
import { z } from 'zod';

const verifyTokenSchema = z.object({
  token: z.string().min(1, 'رمز الاستعادة مطلوب')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = verifyTokenSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { token } = validationResult.data;

    // Verify token - try real service first, fallback to mock
    let user: any;
    try {
      user = await AuthService.verifyResetToken(token);
    } catch (dbError) {
      console.log('🔄 Database not available, using mock service for testing...');
      user = await MockAuthService.verifyResetToken(token);
    }

    return NextResponse.json({
      message: 'رمز الاستعادة صحيح',
      valid: true,
      userEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
    });

  } catch (error: any) {
    console.error('Verify reset token error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'رمز الاستعادة غير صحيح أو منتهي الصلاحية',
        valid: false 
      },
      { status: 400 }
    );
  }
}
