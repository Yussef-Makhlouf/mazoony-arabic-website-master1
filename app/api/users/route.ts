import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
    const currentUser = await AuthService.getUserById(payload.userId);
    
    if (!currentUser || !AuthService.hasPermission(currentUser.permissions, 'users:read')) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض المستخدمين' },
        { status: 403 }
      );
    }

    // Get all users
    const users = await AuthService.getAllUsers();

    return NextResponse.json({
      users
    });

  } catch (error: any) {
    console.error('Get users error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المستخدمين' },
      { status: 500 }
    );
  }
}
