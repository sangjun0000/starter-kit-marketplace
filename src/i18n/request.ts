import { getRequestConfig } from 'next-intl/server';

const SUPPORTED_LOCALES = ['ko', 'en'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const resolved = SUPPORTED_LOCALES.includes(locale as 'ko' | 'en') ? locale! : 'ko';

  return {
    locale: resolved,
    messages: (await import(`@/messages/${resolved}/common.json`)).default,
  };
});
