import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import UserSession from '@/services/UserSession';

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Define public paths
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth',
    '/api/auth/login-post',
    '/api/auth/signup-post',
    '/api/business/public-profile',
  ];

  const isPublic = publicPaths.some(path => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  });

  // Get token from cookies
  const token = request.cookies.get('userSession')?.value;

  if (isPublic) {
    // If it's a public path and we have a token, check if they are logged in
    if (token) {
      const result = await UserSession(token);
      if (result.success) {
        // If they have a valid session and are trying to access login/signup/auth error page,
        // redirect them to the dashboard or their redirect URL.
        const authPages = ['/auth/login', '/auth/signup', '/auth'];
        const isAuthPage = authPages.some(page => pathname.startsWith(page));
        if (isAuthPage) {
          const redirect = request.nextUrl.searchParams.get('redirect');
          return NextResponse.redirect(new URL(redirect || '/app/dashboard', request.url));
        }
      }
    }
    return NextResponse.next();
  }

  // Protected paths
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Session missing' },
        { status: 401 }
      );
    } else {
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('error', 'Please log in to access this page');
      authUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(authUrl);
    }
  }

  // Verify token via UserSession
  const result = await UserSession(token);

  if (!result.success) {
    const message = result.message || 'Session expired';
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: message },
        { status: 401 }
      );
    } else {
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('error', message);
      authUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(authUrl);
    }
  }

  const requestHeaders = new Headers(request.headers);
  if (result.data?.userId) {
    requestHeaders.set('x-user-id', result.data.userId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/app/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/',
  ],
};
