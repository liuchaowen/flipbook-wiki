// 阿里云 DashScope API 客户端
// 支持百炼 token 团队的 baseurl 与 key

import {
  buildInfographicPrompt,
  buildExpandPrompt,
  buildImageAnalysisPrompt,
  NEGATIVE_PROMPT,
} from './prompts';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_BASE_URL = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com/api/v1';
const IMAGE_MODEL = 'qwen-image-2.0-pro';  // 图像生成模型
const VISION_MODEL = 'qwen3.6-plus';  // 视觉理解模型

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
  request_id?: string;
  output?: {
    choices?: Array<{
      message: {
        content: Array<{
          image?: string;
          text?: string;
        }>;
        role: string;
      };
      finish_reason: string;
    }>;
  };
  usage?: {
    image_count: number;
    height: number;
    width: number;
  };
  code?: string;
  message?: string;
}

// 获取 DashScope API Key
function getApiKey(): string {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('DASHSCOPE_API_KEY is not set in environment variables');
  }
  return DASHSCOPE_API_KEY;
}

// 规范化尺寸参数
function normalizeSize(size: string): string {
  return SIZE_MAP[size] || size;
}

// 图像生成调用 (qwen-image-2.0-pro 模型) - 使用 multimodal-generation API
async function imageGenerationCall(
  prompt: string,
  options: {
    size?: string;
  } = {}
): Promise<string> {
  const apiKey = getApiKey();
  const { size = '2048*2048' } = options;
  const normalizedSize = normalizeSize(size);

  const response = await fetch(`${DASHSCOPE_BASE_URL}/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      parameters: {
        negative_prompt: NEGATIVE_PROMPT,
        prompt_extend: true,
        watermark: false,
        size: normalizedSize,
      },
    }),
  });

  // 检查 HTTP 响应状态
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API 请求失败:', response.status, errorText);
    throw new Error(`API 请求失败 (${response.status}): ${errorText || response.statusText}`);
  }

  // 安全解析 JSON
  let data: DashScopeMultimodalResponse;
  try {
    const responseText = await response.text();
    console.log('API 原始响应:', responseText);
    if (!responseText || responseText.trim() === '') {
      throw new Error('API 返回空响应');
    }
    data = JSON.parse(responseText);
    console.log('API 解析后数据:', JSON.stringify(data, null, 2));
  } catch (parseError) {
    console.error('JSON 解析错误:', parseError);
    throw new Error(`JSON 解析失败: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
  }

  // 检查响应
  if (data.code && data.code !== 'Success' && data.code !== '200') {
    throw new Error(`生成失败: ${data.code} - ${data.message || 'Unknown error'}`);
  }

  const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;
  console.log('提取的图像 URL:', imageUrl);
  console.log('output 结构:', JSON.stringify(data.output, null, 2));
  
  if (imageUrl) {
    return imageUrl;
  }

  // 提供更详细的错误信息
  const errorMsg = `生成失败: ${data.message || data.code || 'No image URL returned'}`;
  console.error('完整响应数据:', JSON.stringify(data, null, 2));
  throw new Error(errorMsg);
}

// 图像生成（主函数）- 使用 multimodal-generation API
export async function generateImage(prompt: string, size?: string): Promise<{
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
}> {
  try {
    const enhancedPrompt = buildInfographicPrompt(prompt);

    console.log('--- 正在提交文生图任务 ---');
    console.log('使用 qwen-image-2.0-pro 模型...');
    console.log('Prompt:', enhancedPrompt);
    console.log('请求尺寸:', size || '2048*2048');

    const imageUrl = await imageGenerationCall(enhancedPrompt, {
      size: size || '2048*2048',
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
  parentContext: string,
  size?: string
): Promise<{
  success: boolean;
  imageUrl?: string;
  error?: string;
}> {
  try {
    const prompt = buildExpandPrompt(regionName, regionDescription, expandType, parentContext);

    console.log('--- 正在提交展开图像任务 ---');
    console.log(`使用 ${IMAGE_MODEL} 模型...`);
    console.log('Prompt:', prompt);
    console.log('请求尺寸:', size || '1024*1024');

    const imageUrl = await imageGenerationCall(prompt, {
      size: size || '1024*1024',
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

// 图像区域分析（使用视觉模型）
export async function analyzeImageRegion(
  imageUrl: string,
  clickX: number,
  clickY: number,
  imageWidth: number,
  imageHeight: number,
  context: string
): Promise<{
  success: boolean;
  region?: {
    name: string;
    description: string;
    bounds: { x: number; y: number; width: number; height: number };
    canExpand: boolean;
  };
  error?: string;
}> {
  try {
    const apiKey = getApiKey();

    // 计算相对位置百分比
    const xPercent = (clickX / imageWidth * 100).toFixed(1);
    const yPercent = (clickY / imageHeight * 100).toFixed(1);

    console.log('--- 正在分析图像区域 ---');
    console.log(`使用 ${VISION_MODEL} 模型...`);
    console.log(`点击位置: (${xPercent}%, ${yPercent}%)`);

    const analysisPrompt = buildImageAnalysisPrompt(context, xPercent, yPercent);

    const response = await fetch(`${DASHSCOPE_BASE_URL}/services/aigc/multimodal-generation/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        input: {
          messages: [
            {
              role: 'user',
              content: [
                { text: analysisPrompt },
                { image: imageUrl }
              ]
            }
          ]
        },
        parameters: {
          result_format: 'message',
        },
      }),
    });

    // 检查 HTTP 响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 请求失败:', response.status, errorText);
      throw new Error(`API 请求失败 (${response.status}): ${errorText || response.statusText}`);
    }

    // 安全解析 JSON
    let data;
    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('API 返回空响应');
      }
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 解析错误:', parseError);
      throw new Error(`JSON 解析失败: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    if (data.code && data.code !== 'Success' && data.code !== '200') {
      throw new Error(`分析失败: ${data.code} - ${data.message || 'Unknown error'}`);
    }

    const content = data.output?.choices?.[0]?.message?.content?.[0]?.text;
    if (!content) {
      throw new Error('视觉模型未返回响应');
    }

    console.log('模型响应:', content);

    // 解析 JSON 响应 - 提取 JSON 内容
    let parsed;
    try {
      // 尝试从响应中提取 JSON（可能包含 markdown 代码块）
      let jsonContent = content.trim();
      // 移除可能的 markdown 代码块标记
      const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      parsed = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('模型响应 JSON 解析错误:', content);
      throw new Error(`无法解析模型响应为 JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    return {
      success: true,
      region: {
        name: parsed.name,
        description: parsed.description,
        bounds: parsed.bounds,
        canExpand: parsed.canExpand,
      },
    };
  } catch (error) {
    console.error('区域分析错误:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze region',
    };
  }
}

// 重新导出提示词相关函数，方便外部使用
export {
  buildInfographicPrompt,
  buildExpandPrompt,
  buildImageAnalysisPrompt,
} from './prompts';