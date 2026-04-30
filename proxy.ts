import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, Locale } from './i18n/config';

// IP地址到语言的映射（基于国家/地区）
const countryToLocale: Record<string, Locale> = {
  'CN': 'zh-CN',  // 中国 -> 简体中文
  'TW': 'zh-TW',  // 台湾 -> 繁体中文
  'HK': 'zh-TW',  // 香港 -> 繁体中文
  'US': 'en',     // 美国 -> 英语
  'GB': 'en',     // 英国 -> 英语
  'AU': 'en',     // 澳大利亚 -> 英语
  'CA': 'en',     // 加拿大 -> 英语
  'ES': 'es',     // 西班牙 -> 西班牙语
  'MX': 'es',     // 墨西哥 -> 西班牙语
  'DE': 'de',     // 德国 -> 德语
  'AT': 'de',     // 奥地利 -> 德语
  'IT': 'it',     // 意大利 -> 意大利语
  'FR': 'fr',     // 法国 -> 法语
  'TH': 'th',     // 泰国 -> 泰语
  'JP': 'ja',     // 日本 -> 日语
  'KR': 'ko',     // 韩国 -> 韩语
  'RU': 'ru',     // 俄罗斯 -> 俄语
};

// 获取用户IP地址
function getClientIP(request: NextRequest): string | null {
  // Vercel等平台会设置这些头部
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) {
    return xRealIP;
  }
  
  // 本地开发环境
  return null;
}

// 根据IP获取国家代码（使用免费的IP地理位置API）
async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // 使用ip-api.com免费API（每分钟45次请求限制）
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(2000) // 2秒超时
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.countryCode || null;
  } catch (error) {
    console.error('Failed to get country from IP:', error);
    return null;
  }
}

// 根据国家代码获取语言
function getLocaleFromCountry(countryCode: string): Locale {
  return countryToLocale[countryCode] || defaultLocale;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经包含语言前缀
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  
  // 如果路径已经包含语言前缀，使用默认的next-intl中间件
  if (!pathnameIsMissingLocale) {
    return createMiddleware({
      locales,
      defaultLocale,
      localePrefix: 'always'
    })(request);
  }
  
  // 检查是否已有语言偏好cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && locales.includes(localeCookie.value as Locale)) {
    // 已有偏好，直接重定向
    const url = new URL(`/${localeCookie.value}${pathname}`, request.url);
    return NextResponse.redirect(url);
  }
  
  // 尝试根据IP获取用户位置
  const clientIP = getClientIP(request);
  let detectedLocale = defaultLocale;
  
  if (clientIP) {
    const countryCode = await getCountryFromIP(clientIP);
    if (countryCode) {
      detectedLocale = getLocaleFromCountry(countryCode);
    }
  }
  
  // 如果没有IP信息，尝试使用Accept-Language头部
  if (detectedLocale === defaultLocale) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      // 解析Accept-Language头部
      const languages = acceptLanguage.split(',').map(lang => {
        const [code, q] = lang.trim().split(';q=');
        return { code: code.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
      }).sort((a, b) => b.q - a.q);
      
      // 匹配支持的语言
      for (const lang of languages) {
        const matchedLocale = locales.find(locale => 
          locale.toLowerCase().startsWith(lang.code)
        );
        if (matchedLocale) {
          detectedLocale = matchedLocale;
          break;
        }
      }
    }
  }
  
  // 重定向到检测到的语言版本
  const url = new URL(`/${detectedLocale}${pathname}`, request.url);
  const response = NextResponse.redirect(url);
  
  // 设置cookie以便下次访问直接使用
  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1年有效期
    path: '/',
    sameSite: 'lax'
  });
  
  return response;
}

export const config = {
  // 匹配所有路径，除了 api、_next、静态文件等
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};