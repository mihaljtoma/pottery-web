import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
   defaultLocale: 'hr',
});

export const config = {
  // Matcher koji ignorira admin, api i static fajlove
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};