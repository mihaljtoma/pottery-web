import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'hr',
});

export default function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for sitemap, robots, and static files
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }
  
  // Apply intl middleware for other paths
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|admin|_next|_vercel).*)'
  ]
};