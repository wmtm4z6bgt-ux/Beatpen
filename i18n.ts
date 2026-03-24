import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Доступные локали
  const locales = ['en', 'ru', 'kk'];
  const defaultLocale = 'ru';

  // Если locale не определён или не входит в список, используем defaultLocale
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    // Укажите правильный путь к файлам переводов
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
