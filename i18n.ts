import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // This will be validated by the middleware, so we don't need to check it here.
  return {
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});
