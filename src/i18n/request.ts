import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'ru', 'kk'].includes(locale as any)) locale = 'ru';
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});