import { NextRequest, NextResponse } from 'next/server';
import { AuthEdgeService } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = [
    '/admin',
    '/api/admin',
    '/api/users',
    '/api/auth/register',
    '/api/auth/change-password'
  ];

  // Define public auth routes and pages
  const publicAuthRoutes = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-reset-token'
  ];

  const publicAuthPages = [
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password'
  ];

  const { pathname } = request.nextUrl;

  // Allow public auth routes and pages
  if (publicAuthRoutes.some(route => pathname.startsWith(route)) ||
      publicAuthPages.some(page => pathname.startsWith(page))) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get token from cookie or header
  const token = request.cookies.get('auth-token')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      // Redirect to login page for admin routes (except login page itself)
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else if (pathname.startsWith('/api/')) {
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }
    // Allow access to login page and other non-protected routes
    return NextResponse.next();
  }

  try {
    // Verify token
    const payload = await AuthEdgeService.verifyToken(token);
    
    // Add user info to headers for use in API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-role', payload.role);
    response.headers.set('x-user-permissions', JSON.stringify(payload.permissions));

    return response;

  } catch (error) {
    console.error('Token verification failed:', error);
    
    if (pathname.startsWith('/admin')) {
      // Redirect to login page for admin routes
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else {
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/users/:path*',
    '/api/auth/register',
    '/api/auth/change-password'
  ]
};
