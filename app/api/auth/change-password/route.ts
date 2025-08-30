import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(6, 'كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمة المرور الجديدة وتأكيدها غير متطابقين",
  path: ["confirmPassword"]
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const payload = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(payload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = changePasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Verify current password
    const isCurrentPasswordValid = await AuthService.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      );
    }

    // Update password
    await AuthService.updateUser(user._id!, { password: newPassword }, user._id);

    return NextResponse.json({
      message: 'تم تغيير كلمة المرور بنجاح'
    });

  } catch (error: any) {
    console.error('Change password error:', error);
    
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    );
  }
}
