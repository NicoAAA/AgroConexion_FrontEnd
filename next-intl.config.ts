import { getRequestConfig } from 'next-intl/server';

// ✅ Ajustamos la ruta porque messages está dentro de src
import es from './src/messages/es.json';
import en from './src/messages/en.json';

const messagesMap: Record<string, any> = {
  es,
  en,
};

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale ?? 'es';

  return {
    locale: currentLocale,
    messages: messagesMap[currentLocale] || messagesMap['es'],
  };
});
