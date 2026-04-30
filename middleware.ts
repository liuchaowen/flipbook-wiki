import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // 总是显示语言前缀，如 /zh-CN, /en 等
});

export const config = {
  // 匹配所有路径，除了 api、_next、静态文件等
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};