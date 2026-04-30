import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言环境
  let locale = await requestLocale;
  
  // 验证语言环境是否有效，否则使用默认值
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'zh-CN';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});