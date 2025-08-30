import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
  role: z.enum(['admin', 'manager', 'editor']).optional().default('editor'),
  department: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has permission (only admins can create users)
    const token = request.cookies.get('auth-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const payload = AuthService.verifyToken(token);
    const currentUser = await AuthService.getUserById(payload.userId);
    
    if (!currentUser || !AuthService.hasPermission(currentUser.permissions, 'users:write')) {
      return NextResponse.json(
        { error: 'غير مصرح بإنشاء مستخدمين' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { name, email, password, role, department } = validationResult.data;

    // Create user data
    const userData = {
      name,
      email,
      password,
      role,
      permissions: AuthService.getRolePermissions(role),
      isActive: true,
      profile: {
        department: department || ''
      },
      settings: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: 'ar',
        timezone: 'Asia/Riyadh'
      },
      createdBy: currentUser._id
    };

    // Create user
    const user = await AuthService.createUser(userData);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'تم إنشاء المستخدم بنجاح',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error: any) {
    console.error('Register error:', error);
    
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء إنشاء المستخدم' },
      { status: 400 }
    );
  }
}
