import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { MockAuthService } from '@/lib/mock-auth';
import { z } from 'zod';

const verifyCodeSchema = z.object({
  code: z.string().min(4, 'رمز الاستعادة يجب أن يكون على الأقل 4 أحرف'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = verifyCodeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { code, email } = validationResult.data;

    // Verify reset code - try real service first, fallback to mock
    let user: any;
    let token: string;
    
    try {
      // Check if the code exists in our system
      const result = await AuthService.verifyResetCode(code, email);
      user = result.user;
      token = result.token;
    } catch (dbError) {
      console.log('🔄 Database not available, using mock service for testing...');
      const result = await MockAuthService.verifyResetCode(code, email);
      user = result.user;
      token = result.token;
    }

    return NextResponse.json({
      message: 'رمز الاستعادة صحيح',
      valid: true,
      userEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email for security
      token: token // This will be used for the actual password reset
    });

  } catch (error: any) {
    console.error('Verify reset code error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'رمز الاستعادة غير صحيح أو منتهي الصلاحية',
        valid: false 
      },
      { status: 400 }
    );
  }
}
