export const locales = [
  'zh-CN',  // 简体中文（默认）
  'en',     // English
  'es',     // Español
  'de',     // Deutsch
  'it',     // Italiano
  'fr',     // Français
  'zh-TW',  // 繁體中文
  'th',     // ไทย
  'ja',     // 日本語
  'ko',     // 한국어
  'ru',     // Русский
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh-CN';

export const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'fr': 'Français',
  'zh-TW': '繁體中文',
  'th': 'ไทย',
  'ja': '日本語',
  'ko': '한국어',
  'ru': 'Русский',
};

export const localeFlags: Record<Locale, string> = {
  'zh-CN': '🇨🇳',
  'en': '🇺🇸',
  'es': '🇪🇸',
  'de': '🇩🇪',
  'it': '🇮🇹',
  'fr': '🇫🇷',
  'zh-TW': '🇭🇰',
  'th': '🇹🇭',
  'ja': '🇯🇵',
  'ko': '🇰🇷',
  'ru': '🇷🇺',
};