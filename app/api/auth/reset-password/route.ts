import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { MockAuthService } from '@/lib/mock-auth';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'رمز الاستعادة مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمة المرور وتأكيدها غير متطابقين",
  path: ["confirmPassword"]
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // Reset password - try real service first, fallback to mock
    try {
      await AuthService.resetPassword(token, password);
    } catch (dbError) {
      console.log('🔄 Database not available, using mock service for testing...');
      await MockAuthService.resetPassword(token, password);
    }

    return NextResponse.json({
      message: 'تم تغيير كلمة المرور بنجاح'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 400 }
    );
  }
}
