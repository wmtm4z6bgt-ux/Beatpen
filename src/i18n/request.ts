import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const locales = ['en', 'ru', 'kk'];
  const defaultLocale = 'ru';

  // Validate that the incoming `locale` parameter is valid
  // and fallback to the default if it's not.
  const usedLocale = locales.includes(locale) ? locale : defaultLocale;
  
  const messages = (await import(`../messages/${usedLocale}.json`)).default;

  return {
    locale: usedLocale,
    messages,
  };
});
