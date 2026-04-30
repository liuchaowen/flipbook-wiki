// 提示词管理模块
// 用于管理和构建AI图像生成的提示词

import { Locale } from '@/i18n/config';

// 将 locale 转换为简化的语言代码
export function localeToLanguage(locale: Locale | string): string {
  const mapping: Record<string, string> = {
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'en': 'en',
    'es': 'es',
    'de': 'de',
    'it': 'it',
    'fr': 'fr',
    'th': 'th',
    'ja': 'ja',
    'ko': 'ko',
    'ru': 'ru',
  };
  return mapping[locale] || 'en';
}

// 检测文本语言
// 返回 'zh'（中文）、'en'（英文）或其他语言代码
export function detectLanguage(text: string): string {
  // 检测中文字符
  const chineseRegex = /[\u4e00-\u9fff]/;
  if (chineseRegex.test(text)) {
    return 'zh-CN';
  }
  
  // 检测日文字符
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  if (japaneseRegex.test(text)) {
    return 'ja';
  }
  
  // 检测韩文字符
  const koreanRegex = /[\uac00-\ud7af]/;
  if (koreanRegex.test(text)) {
    return 'ko';
  }
  
  // 检测泰文字符
  const thaiRegex = /[\u0e00-\u0e7f]/;
  if (thaiRegex.test(text)) {
    return 'th';
  }
  
  // 检测西里尔字母（俄语）
  const cyrillicRegex = /[\u0400-\u04ff]/;
  if (cyrillicRegex.test(text)) {
    return 'ru';
  }
  
  // 默认为英文
  return 'en';
}

// 获取语言对应的文字指令
function getLanguageTextInstruction(language: string): string {
  const instructions: Record<string, string> = {
    'zh-CN': 'All text labels, titles, and annotations in the image must be in Simplified Chinese (简体中文). Use clear, readable Chinese characters for all text elements.',
    'zh-TW': 'All text labels, titles, and annotations in the image must be in Traditional Chinese (繁體中文). Use clear, readable Chinese characters for all text elements.',
    'en': 'All text labels, titles, and annotations in the image must be in English. Use clear, readable English text for all text elements.',
    'es': 'All text labels, titles, and annotations in the image must be in Spanish (Español). Use clear, readable Spanish text for all text elements.',
    'de': 'All text labels, titles, and annotations in the image must be in German (Deutsch). Use clear, readable German text for all text elements.',
    'it': 'All text labels, titles, and annotations in the image must be in Italian (Italiano). Use clear, readable Italian text for all text elements.',
    'fr': 'All text labels, titles, and annotations in the image must be in French (Français). Use clear, readable French text for all text elements.',
    'th': 'All text labels, titles, and annotations in the image must be in Thai (ไทย). Use clear, readable Thai characters for all text elements.',
    'ja': 'All text labels, titles, and annotations in the image must be in Japanese (日本語). Use clear, readable Japanese characters for all text elements.',
    'ko': 'All text labels, titles, and annotations in the image must be in Korean (한국어). Use clear, readable Korean characters for all text elements.',
    'ru': 'All text labels, titles, and annotations in the image must be in Russian (Русский). Use clear, readable Russian characters for all text elements.',
  };
  
  return instructions[language] || instructions.en;
}

// 通用提示词模板 - 用于生成风格统一的专业规划图
// 模板结构：主题 + 等距视角 + 放大细节窗口 + 柔和浅色调 + 标注元素
export const ISOMETRIC_STYLE_TEMPLATE = {
  // 主题类型映射（支持多语言）
  themes: {
    campus: { en: 'campus planning', zh: '校园规划' },
    industrial: { en: 'industrial park planning', zh: '工业园区规划' },
    forest: { en: 'forest park planning', zh: '森林公园规划' },
    urban: { en: 'urban planning', zh: '城市规划' },
    coastal: { en: 'coastal city planning', zh: '滨海城市规划' },
    residential: { en: 'residential area planning', zh: '住宅区规划' },
    commercial: { en: 'commercial district planning', zh: '商业区规划' },
    cultural: { en: 'cultural heritage site planning', zh: '文化遗产地规划' },
    ecological: { en: 'ecological reserve planning', zh: '生态保护区规划' },
    smart: { en: 'smart city planning', zh: '智慧城市规划' },
  },
  // 细节类型映射（支持多语言）
  detailTypes: {
    library: { en: 'a modern library with reading rooms and book stacks', zh: '一个拥有阅览室和书库的现代图书馆' },
    factory: { en: 'a high-tech factory with automated production lines', zh: '一个拥有自动化生产线的高科技工厂' },
    lake: { en: 'a lakeside promenade with recreational facilities', zh: '一个配有休闲设施的湖滨步道' },
    plaza: { en: 'a central plaza with fountains and gathering spaces', zh: '一个配有喷泉和聚会空间的中心广场' },
    garden: { en: 'a botanical garden with diverse plant species', zh: '一个拥有多种植物物种的植物园' },
    museum: { en: 'a museum with exhibition halls and artifacts', zh: '一个拥有展厅和文物的博物馆' },
    stadium: { en: 'a sports stadium with seating and playing field', zh: '一个配有座位和运动场的体育场' },
    market: { en: 'a vibrant market with stalls and vendors', zh: '一个充满活力的集市，有摊位和商贩' },
    station: { en: 'a transit station with platforms and waiting areas', zh: '一个配有站台和候车区的交通站点' },
    campus: { en: 'an academic building with classrooms and laboratories', zh: '一个配有教室和实验室的教学楼' },
  },
  // 基础风格模板（支持多语言）
  baseStyle: {
    en: 'The style is clean line art combined with a soft pastel color palette (light blues, soft greens, and beige). The layout incorporates clean annotation labels, graphic design elements, and a minimalist aesthetic. High-quality architectural presentation style, professional and organized.',
    zh: '风格为清晰的线条艺术，配以柔和的粉彩色调（浅蓝、柔绿和米色）。布局包含清晰的标注标签、平面设计元素和极简美学。高质量的建筑展示风格，专业且有条理。',
  },
  // 信息图风格指南（支持多语言）
  infographicStyle: {
    en: 'This is a professional infographic illustration. Leave adequate padding and white space around the edges of the image for a clean, balanced composition. Use a compact, elegant title at the top (small font size, not dominating the image). Mark key knowledge points and important areas with clear annotation labels and pointer lines. In the blank areas of the image, arrange a series of concise knowledge point summaries in an organized manner (using small text boxes or bullet points). Maximize information density while maintaining visual clarity and breathing room. The image should feel information-rich and educational, with proper margins for a polished look.',
    zh: '这是一张专业的信息图插画。在图片四周留出适当的边距和留白，使构图干净、平衡。在顶部使用紧凑优雅的标题（小字体，不占据主导地位）。在图片的特定知识点或重要位置使用清晰的标注标签和指示线进行标注说明。在图片的空白处，以有序的方式罗列一系列简明的知识点摘要（使用小文本框或项目符号）。在保持视觉清晰和呼吸感的同时最大化信息密度。图片应具有丰富的信息量和教育价值，边距适当，整体精致美观。',
  },
};

// 展开类型的英文修饰词
export const EXPAND_TYPE_MODIFIERS: Record<string, string> = {
  detail: 'detailed close-up view with magnified elements',
  panorama: 'panoramic view with wide scene coverage',
  interior: 'interior cross-section view showing internal structure',
  overview: 'overview perspective with bird\'s-eye view',
};

// 获取主题名称（根据语言）
function getThemeName(theme: string, language: string): string {
  const themeData = ISOMETRIC_STYLE_TEMPLATE.themes[theme as keyof typeof ISOMETRIC_STYLE_TEMPLATE.themes];
  if (themeData && typeof themeData === 'object') {
    return themeData[language as keyof typeof themeData] || themeData.en || theme;
  }
  return theme;
}

// 获取细节描述（根据语言）
function getDetailDescription(detail: string, language: string): string {
  const detailData = ISOMETRIC_STYLE_TEMPLATE.detailTypes[detail as keyof typeof ISOMETRIC_STYLE_TEMPLATE.detailTypes];
  if (detailData && typeof detailData === 'object') {
    return detailData[language as keyof typeof detailData] || detailData.en || detail;
  }
  return detail;
}

// 获取基础风格（根据语言）
function getBaseStyle(language: string): string {
  return ISOMETRIC_STYLE_TEMPLATE.baseStyle[language as keyof typeof ISOMETRIC_STYLE_TEMPLATE.baseStyle]
    || ISOMETRIC_STYLE_TEMPLATE.baseStyle.en;
}

// 获取信息图风格指南（根据语言）
function getInfographicStyle(language: string): string {
  return ISOMETRIC_STYLE_TEMPLATE.infographicStyle[language as keyof typeof ISOMETRIC_STYLE_TEMPLATE.infographicStyle]
    || ISOMETRIC_STYLE_TEMPLATE.infographicStyle.en;
}

// 构建等距视角风格提示词
export function buildIsometricPrompt(
  theme: string,
  detailDescription: string,
  customTitle?: string,
  language: string = 'en'
): string {
  const themeName = getThemeName(theme, language);
  const title = customTitle || themeName;
  const baseStyle = getBaseStyle(language);
  const infographicStyle = getInfographicStyle(language);
  const textInstruction = getLanguageTextInstruction(language);
  
  // 根据语言选择提示词模板
  // 中文变体使用中文模板
  if (language === 'zh-CN' || language === 'zh-TW' || language === 'zh') {
    return `一张专业的${themeName}信息图插画，标题为"${title}"。构图采用等距视角，融合宏观与微观视图。在图片的特定知识点或重要位置使用清晰的标注标签和指示线进行标注说明，展示${detailDescription}的关键信息。在图片的空白处，以有序的方式罗列一系列简明的知识点摘要。${infographicStyle} ${baseStyle} ${textInstruction}`;
  }
  
  // 默认英文提示词
  return `A professional ${themeName} infographic illustration, titled "${title}". The composition features an isometric perspective with a blend of macro and micro views. Mark key knowledge points and important areas with clear annotation labels and pointer lines, highlighting key information about ${detailDescription}. In the blank areas of the image, arrange a series of concise knowledge point summaries in an organized manner. ${infographicStyle} ${baseStyle} ${textInstruction}`;
}

// 解析用户提示词，提取主题和细节
export function parseUserPrompt(userPrompt: string, preferredLanguage?: string): { theme: string; detail: string; title: string; language: string } {
  // 如果提供了首选语言，优先使用；否则检测用户输入的语言
  const language = preferredLanguage || detectLanguage(userPrompt);
  
  // 尝试从用户输入中识别主题关键词
  const themeKeywords = Object.keys(ISOMETRIC_STYLE_TEMPLATE.themes);
  let detectedTheme = 'urban'; // 默认主题
  let detectedDetail = (language === 'zh-CN' || language === 'zh-TW' || language === 'zh') ? '一个关键区域' : 'a key area of interest';
  let title = userPrompt;
  
  for (const keyword of themeKeywords) {
    if (userPrompt.toLowerCase().includes(keyword)) {
      detectedTheme = keyword;
      break;
    }
  }
  
  // 尝试从用户输入中识别细节关键词
  const detailKeywords = Object.keys(ISOMETRIC_STYLE_TEMPLATE.detailTypes);
  for (const keyword of detailKeywords) {
    if (userPrompt.toLowerCase().includes(keyword)) {
      detectedDetail = getDetailDescription(keyword, language);
      break;
    }
  }
  
  return { theme: detectedTheme, detail: detectedDetail, title, language };
}

// 构建图像生成 Prompt（等轴测插画风格）
// 支持两种模式：
// 1. 直接传入主题和细节参数
// 2. 从用户提示词中自动解析
// 支持传入语言参数，生成对应语言的图片文字
export function buildInfographicPrompt(
  userPrompt: string,
  options?: { theme?: string; detail?: string; title?: string; language?: string }
): string {
  let theme: string;
  let detail: string;
  let title: string;
  let language: string;
  
  if (options?.theme && options?.detail) {
    // 使用显式指定的主题和细节
    theme = options.theme;
    detail = options.detail;
    title = options.title || userPrompt;
    language = options.language || detectLanguage(userPrompt);
  } else {
    // 从用户提示词中解析，传入首选语言
    const parsed = parseUserPrompt(userPrompt, options?.language);
    theme = options?.theme || parsed.theme;
    detail = options?.detail || parsed.detail;
    title = options?.title || parsed.title;
    language = options?.language || parsed.language;
  }
  
  return buildIsometricPrompt(theme, detail, title, language);
}

// 构建展开区域 Prompt（等轴测插画风格）
export function buildExpandPrompt(
  regionName: string,
  regionDescription: string,
  expandType: string,
  parentContext: string,
  language?: string
): string {
  const modifier = EXPAND_TYPE_MODIFIERS[expandType] || EXPAND_TYPE_MODIFIERS.detail;
  
  // 从父上下文中提取主题，语言使用传入的或从上下文检测
  const parsed = parseUserPrompt(parentContext, language);
  const theme = parsed.theme;
  const finalLanguage = language || parsed.language;
  const themeName = getThemeName(theme, finalLanguage);
  const baseStyle = getBaseStyle(finalLanguage);
  const infographicStyle = getInfographicStyle(finalLanguage);
  const textInstruction = getLanguageTextInstruction(finalLanguage);
  
  // 根据语言选择提示词模板
  if (finalLanguage === 'zh-CN' || finalLanguage === 'zh-TW' || finalLanguage === 'zh') {
    return `一张专业的${themeName}信息图插画，标题为"${regionName}"。构图采用等距视角，${modifier}。在图片的特定知识点或重要位置使用清晰的标注标签和指示线进行标注说明，展示${regionDescription}的关键信息。在图片的空白处，以有序的方式罗列一系列简明的知识点摘要。这是"${parentContext}"的一部分。${infographicStyle} ${baseStyle} ${textInstruction}`;
  }
  
  // 默认英文提示词
  return `A professional ${themeName} infographic illustration, titled "${regionName}". The composition features an isometric perspective with ${modifier}. Mark key knowledge points and important areas with clear annotation labels and pointer lines, highlighting key information about ${regionDescription}. In the blank areas of the image, arrange a series of concise knowledge point summaries in an organized manner. This is part of "${parentContext}". ${infographicStyle} ${baseStyle} ${textInstruction}`;
}

// 图像分析提示词构建
export function buildImageAnalysisPrompt(
  context: string,
  xPercent: string,
  yPercent: string
): string {
  return `你是一个图像分析专家，擅长识别图像中的特定区域。当给定一张图像和点击位置时，你需要识别点击了哪个元素或区域，并提供关于它的详细信息。

请始终以 JSON 格式回复：
{
  "name": "点击元素的名称",
  "description": "该元素代表内容的详细描述",
  "bounds": { "x": 0-100, "y": 0-100, "width": 0-100, "height": 0-100 },
  "canExpand": true/false
}

bounds 应该是图像尺寸的近似百分比。
canExpand 应该为 true，如果这个元素可以进一步探索（比如建筑、物体或有内部细节的区域）。

---

这是一张关于 "${context}" 的信息图。

用户点击了图像上的位置 (${xPercent}%, ${yPercent}%)。

请分析点击了哪个元素或区域，并以 JSON 格式提供相关信息。`;
}

// 负面提示词（用于图像生成）
export const NEGATIVE_PROMPT = '低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。';