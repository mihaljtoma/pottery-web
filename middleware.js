import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'hr',
});

export const config = {
  // Explicitly exclude sitemap.xml and robots.txt
  matcher: [
    '/((?!api|admin|_next|_vercel|sitemap.xml|robots.txt|favicon.ico|.*\\..*).*)'
  ]
};