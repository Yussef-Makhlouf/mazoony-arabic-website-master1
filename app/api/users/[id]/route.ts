import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين').optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  role: z.enum(['admin', 'manager', 'editor']).optional(),
  isActive: z.boolean().optional(),
  profile: z.object({
    avatar: z.string().optional(),
    phone: z.string().optional(),
    department: z.string().optional()
  }).optional(),
  settings: z.object({
    notifications: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional()
    }).optional(),
    language: z.string().optional(),
    timezone: z.string().optional()
  }).optional()
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف')
});

// Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    const currentUser = await AuthService.getUserById(payload.userId);
    
    if (!currentUser || !AuthService.hasPermission(currentUser.permissions, 'users:read')) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض المستخدمين' },
        { status: 403 }
      );
    }

    // Get user
    const user = await AuthService.getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المستخدم' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    const currentUser = await AuthService.getUserById(payload.userId);
    
    if (!currentUser || !AuthService.hasPermission(currentUser.permissions, 'users:write')) {
      return NextResponse.json(
        { error: 'غير مصرح بتعديل المستخدمين' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update permissions if role changed
    if (updateData.role) {
      updateData.permissions = AuthService.getRolePermissions(updateData.role);
    }

    // Update user
    const updatedUser = await AuthService.updateUser(id, updateData, currentUser._id);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'تم تحديث المستخدم بنجاح',
      user: userWithoutPassword
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحديث المستخدم' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    const currentUser = await AuthService.getUserById(payload.userId);
    
    if (!currentUser || !AuthService.hasPermission(currentUser.permissions, 'users:write')) {
      return NextResponse.json(
        { error: 'غير مصرح بحذف المستخدمين' },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (id === currentUser._id) {
      return NextResponse.json(
        { error: 'لا يمكن حذف حسابك الخاص' },
        { status: 400 }
      );
    }

    // Delete user
    const deleted = await AuthService.deleteUser(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'تم حذف المستخدم بنجاح'
    });

  } catch (error: any) {
    console.error('Delete user error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المستخدم' },
      { status: 500 }
    );
  }
}

// Reset user password (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    const currentUser = await AuthService.getUserById(payload.userId);
    
    if (!currentUser || !AuthService.hasPermission(currentUser.permissions, 'users:write')) {
      return NextResponse.json(
        { error: 'غير مصرح بإعادة تعيين كلمات المرور' },
        { status: 403 }
      );
    }

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

    const { newPassword } = validationResult.data;

    // Update password
    const updatedUser = await AuthService.updateUser(id, { password: newPassword }, currentUser._id);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'تم إعادة تعيين كلمة المرور بنجاح'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' },
      { status: 500 }
    );
  }
}
