import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const verifyCodeSchema = z.object({
  code: z.string().min(6, 'رمز الاستعادة يجب أن يكون مكون من 6 أرقام').max(6, 'رمز الاستعادة يجب أن يكون مكون من 6 أرقام'),
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

    // Verify reset code using real AuthService only
    const result = await AuthService.verifyResetCode(code, email);
    const user = result.user;
    const token = result.token;

    return NextResponse.json({
      message: 'رمز الاستعادة صحيح',
      valid: true,
      userEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email for security
      token: token, // This will be used for the actual password reset
      success: true
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
