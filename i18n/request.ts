import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Default to 'hr' if no locale
  if (!locale || !['en', 'hr'].includes(locale)) {
    locale = 'hr';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});