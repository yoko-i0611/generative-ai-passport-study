import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // API ルートに対するセキュリティチェック
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // セキュリティヘッダーの追加
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    
    // 本番環境でのオリジンチェック
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const allowedOrigins = [
        'https://ai-learning-platform.vercel.app',
        process.env.NEXT_PUBLIC_APP_URL
      ].filter(Boolean);
      
      if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/(.*)',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};