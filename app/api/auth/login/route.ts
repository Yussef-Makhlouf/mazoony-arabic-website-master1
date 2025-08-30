import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Attempt login
    const { user, token } = await AuthService.login(email, password, ipAddress, userAgent);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Set HTTP-only cookie for token
    const response = NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      user: userWithoutPassword,
      token
    });

    // Set secure cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 401 }
    );
  }
}
