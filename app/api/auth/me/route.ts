import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or header
    const token = request.cookies.get('auth-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = AuthService.verifyToken(token);
    
    // Get user
    const user = await AuthService.getUserById(payload.userId);
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
      { error: 'غير مصرح بالوصول' },
      { status: 401 }
    );
  }
}
