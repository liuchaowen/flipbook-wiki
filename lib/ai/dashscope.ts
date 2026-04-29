// 阿里云 DashScope API 客户端（用于万相图像生成）
// 支持百炼 token 团队的 baseurl 与 key

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_BASE_URL = process.env.DASHSCOPE_BASE_URL || 'https://dashscope.aliyuncs.com/api/v1';
const MODEL = 'wan2.7-image-pro';

// 等轴测插画风格修饰词
const ISOMETRIC_STYLE = '等轴测插画风格 (Isometric Illustration)，3D等距视角，等轴测投影，立体感，几何形状，简洁现代设计，柔和渐变色彩，信息图风格，清晰的布局，图标和插图，教育性，视觉组织，标注部分，中文标注';

// 尺寸映射
const SIZE_MAP: Record<string, string> = {
  '1024*1024': '1024*1024',
  '1024x1024': '1024*1024',
  '1K': '1024*1024',
  '2048*2048': '2048*2048',
  '2048x2048': '2048*2048',
  '2K': '2048*2048',
};

interface DashScopeMultimodalResponse {
  output?: {
    results?: Array<{
      url: string;
    }>;
  };
  code?: string;
  message?: string;
  request_id?: string;
}

// 获取 DashScope API Key
function getApiKey(): string {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('DASHSCOPE_API_KEY is not set in environment variables');
  }
  return DASHSCOPE_API_KEY;
}

// 构建图像生成 Prompt（等轴测插画风格）
export function buildInfographicPrompt(userPrompt: string): string {
  return `${userPrompt}，${ISOMETRIC_STYLE}`;
}

// 构建展开区域 Prompt（等轴测插画风格）
export function buildExpandPrompt(
  regionName: string,
  regionDescription: string,
  expandType: string,
  parentContext: string
): string {
  const expandTypeModifiers: Record<string, string> = {
    detail: '细节特写视图，放大细节',
    panorama: '全景视图，广阔场景',
    interior: '内部视图，剖面图',
    overview: '概览视角，鸟瞰图',
  };

  const modifier = expandTypeModifiers[expandType] || expandTypeModifiers.detail;
  return `${regionName}，${modifier}，${regionDescription}，属于"${parentContext}"的一部分，${ISOMETRIC_STYLE}`;
}

// 规范化尺寸参数
function normalizeSize(size: string): string {
  return SIZE_MAP[size] || size;
}

// 多模态图像生成调用 (wan2.7-image-pro 模型)
async function multimodalGenerationCall(
  prompt: string,
  options: {
    n?: number;
    size?: string;
    watermark?: boolean;
    thinking_mode?: boolean;
  } = {}
): Promise<string> {
  const apiKey = getApiKey();
  const { n = 1, size = '2K', watermark = false, thinking_mode = true } = options;
  const normalizedSize = normalizeSize(size);

  const response = await fetch(`${DASHSCOPE_BASE_URL}/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { text: prompt }
            ]
          }
        ]
      },
      parameters: {
        size: normalizedSize,
        n,
        watermark,
        thinking_mode,
      },
    }),
  });

  const data: DashScopeMultimodalResponse = await response.json();

  // 检查响应
  if (data.code && data.code !== 'Success' && data.code !== '200') {
    throw new Error(`生成失败: ${data.code} - ${data.message || 'Unknown error'}`);
  }

  const imageUrl = data.output?.results?.[0]?.url;
  if (imageUrl) {
    return imageUrl;
  }

  throw new Error(`生成失败: ${data.message || data.code || 'No image URL returned'}`);
}

// 图像生成（主函数）- 使用 multimodal-generation API
export async function generateImage(prompt: string): Promise<{
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
}> {
  try {
    const enhancedPrompt = buildInfographicPrompt(prompt);

    console.log('--- 正在提交文生图任务 ---');
    console.log('使用 multimodal-generation API...');
    console.log('Prompt:', enhancedPrompt);

    const imageUrl = await multimodalGenerationCall(enhancedPrompt, {
      size: '2K',
      n: 1,
      watermark: false,
      thinking_mode: true,
    });

    console.log('生成成功！图片地址：');
    console.log(imageUrl);

    return {
      success: true,
      imageUrl,
      revisedPrompt: enhancedPrompt,
    };
  } catch (error) {
    console.error('发生错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image',
    };
  }
}

// 生成展开图像
export async function generateExpandedImage(
  regionName: string,
  regionDescription: string,
  expandType: string,
  parentContext: string
): Promise<{
  success: boolean;
  imageUrl?: string;
  error?: string;
}> {
  try {
    const prompt = buildExpandPrompt(regionName, regionDescription, expandType, parentContext);

    console.log('--- 正在提交展开图像任务 ---');
    console.log('使用 multimodal-generation API...');
    console.log('Prompt:', prompt);

    const imageUrl = await multimodalGenerationCall(prompt, {
      size: '2K',
      n: 1,
      watermark: false,
      thinking_mode: true,
    });

    console.log('生成成功！图片地址：');
    console.log(imageUrl);

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error('展开图像生成错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate expanded image',
    };
  }
}