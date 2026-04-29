// 风格修饰词
const STYLE_MODIFIERS: Record<string, string> = {
  infographic: 'infographic style, clean layout, icons and illustrations, educational, visually organized, labeled sections, modern design',
  illustration: 'digital illustration, artistic, vibrant colors, detailed, creative style',
  realistic: 'photorealistic, high detail, professional photography, natural lighting',
  artistic: 'artistic style, painterly, expressive, creative interpretation, fine art quality',
  chinese: 'Chinese style, traditional Chinese painting, ink wash, elegant, cultural elements',
  anime: 'anime style, vibrant colors, detailed, Japanese animation style',
  watercolor: 'watercolor painting style, soft colors, artistic, flowing, delicate',
};

// 获取 API Key
const getApiKey = () => {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY is not set in environment variables');
  }
  return apiKey;
};

// 获取 Bash Url
const getBaseUrl = () => {
  const baseUrl = process.env.DASHSCOPE_BASE_URL;
  if (!baseUrl) {
    throw new Error('DASHSCOPE_BASE_URL is not set in environment variables');
  }
  return baseUrl;
};

// 生成信息图 Prompt
export function buildInfographicPrompt(userPrompt: string, style: string = 'infographic'): string {
  const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS.infographic;
  
  return `Create a visually stunning infographic about: "${userPrompt}"

Style: ${styleModifier}

Requirements:
- Create a cohesive visual composition with multiple related elements
- Include clear visual hierarchy and organization
- Add descriptive labels and annotations in Chinese
- Make it informative and visually appealing
- Each element should be distinct and clickable for further exploration
- Use a harmonious color palette
- Include visual elements that represent key aspects of the topic

The image should be like an interactive visual guide where users can explore different sections.`;
}

// 生成展开区域的 Prompt
export function buildExpandPrompt(
  regionName: string,
  regionDescription: string,
  expandType: string,
  parentContext: string
): string {
  const expandTypeModifiers: Record<string, string> = {
    detail: 'detailed close-up view, zoomed in, intricate details',
    panorama: 'wide panoramic view, expansive scene, full context',
    interior: 'interior view, inside look, cross-section',
    overview: 'overview perspective, bird\'s eye view, comprehensive',
  };

  const modifier = expandTypeModifiers[expandType] || expandTypeModifiers.detail;

  return `Create a ${modifier} visualization of: "${regionName}"

Context: This is part of "${parentContext}"
Description: ${regionDescription}

Style: ${STYLE_MODIFIERS.infographic}

Requirements:
- Focus specifically on "${regionName}"
- Provide detailed visual information about this element
- Include relevant labels and annotations in Chinese
- Make it visually cohesive with the parent context
- Include sub-elements that can be further explored
- Create an informative and beautiful visualization`;
}

// OpenAI 兼容模式图像生成响应类型
interface OpenAIImageResponse {
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

// 图像生成
export async function generateImage(prompt: string, style: string = 'infographic'): Promise<{
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
}> {
  try {
    const apiKey = getApiKey();
    const baseUrl = getBaseUrl();
    const enhancedPrompt = buildInfographicPrompt(prompt, style);

    console.log('Calling Wanxiang API with model: wanx2.1-image-edit');
    console.log('Prompt length:', enhancedPrompt.length);

    // 使用 OpenAI 兼容模式的 /images/generations 端点
    const response = await fetch(`${baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'wan2.7-image-pro',
        prompt: enhancedPrompt,
        size: '1024x1024',
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wanxiang API error response:', response.status, errorText);
      return {
        success: false,
        error: `API error ${response.status}: ${errorText || response.statusText}`,
      };
    }

    const data: OpenAIImageResponse = await response.json();
    console.log('Wanxiang API response:', JSON.stringify(data, null, 2));

    // 从 OpenAI 兼容模式响应中提取图片URL
    const imageData = data.data?.[0];
    if (!imageData) {
      console.error('No image data in response:', JSON.stringify(data, null, 2));
      return {
        success: false,
        error: 'No image generated in response',
      };
    }

    // 优先使用 URL，如果没有则使用 base64
    const imageUrl = imageData.url || (imageData.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null);
    if (!imageUrl) {
      console.error('No image URL or base64 in response:', JSON.stringify(imageData, null, 2));
      return {
        success: false,
        error: 'No image URL in response',
      };
    }

    return {
      success: true,
      imageUrl,
      revisedPrompt: prompt,
    };
  } catch (error: unknown) {
    console.error('Wanxiang image generation error:', error);
    let errorMessage = 'Failed to generate image with Wanxiang';
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// 图像区域分析（使用 Qwen-VL 视觉模型）
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

    // 使用 Qwen-VL 模型进行视觉分析
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-vl-max',
        input: {
          messages: [
            {
              role: 'system',
              content: [
                { text: `You are an expert at analyzing images and identifying specific regions. When given an image and a click position, you identify what element or region was clicked and provide detailed information about it.

Always respond in JSON format:
{
  "name": "Name of the clicked element",
  "description": "Detailed description of what this element represents",
  "bounds": { "x": 0-100, "y": 0-100, "width": 0-100, "height": 0-100 },
  "canExpand": true/false
}

The bounds should be approximate percentages of the image dimensions.
canExpand should be true if this element can be explored further (like a building, object, or area that has interior details).` }
              ]
            },
            {
              role: 'user',
              content: [
                { text: `This is an infographic about: "${context}"

The user clicked at position (${xPercent}%, ${yPercent}%) on the image.

Please analyze what element or region was clicked and provide information about it in JSON format.` },
                { image: imageUrl }
              ]
            }
          ]
        },
        parameters: {
          max_tokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wanxiang VL API error response:', response.status, errorText);
      return {
        success: false,
        error: `API error ${response.status}: ${errorText || response.statusText}`,
      };
    }

    const data = await response.json();
    console.log('Wanxiang VL API response:', JSON.stringify(data, null, 2));

    const content = data.output?.choices?.[0]?.message?.content;
    if (!content || content.length === 0) {
      throw new Error('No response from vision model');
    }

    // 获取文本内容
    const textContent = content.find((item: { text?: string }) => item.text);
    if (!textContent?.text) {
      throw new Error('No text in response');
    }

    // 尝试解析 JSON，可能需要从 markdown 代码块中提取
    let jsonStr = textContent.text;
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || jsonStr;
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.match(/```\s*([\s\S]*?)\s*```/)?.[1] || jsonStr;
    }
    
    const parsed = JSON.parse(jsonStr.trim());
    
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
    console.error('Wanxiang region analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze region with Wanxiang',
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
    const apiKey = getApiKey();
    const baseUrl = getBaseUrl();
    const prompt = buildExpandPrompt(regionName, regionDescription, expandType, parentContext);

    console.log('Calling Wanxiang API for expanded image with model: wan2.7-image-pro');
    console.log('Prompt length:', prompt.length);

    const response = await fetch(`${baseUrl}/services/aigc/multimodal-generation/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'wan2.7-image-pro',
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
          size: '1024*1024',
          n: 1,
          watermark: false,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Wanxiang API error response:', response.status, errorText);
      return {
        success: false,
        error: `API error ${response.status}: ${errorText || response.statusText}`,
      };
    }

    const data: WanxiangImageResponse = await response.json();
    console.log('Wanxiang API response:', JSON.stringify(data, null, 2));

    // 从响应中提取图片URL
    const choices = data.output?.choices;
    if (!choices || choices.length === 0) {
      console.error('No choices in response:', JSON.stringify(data, null, 2));
      return {
        success: false,
        error: 'No image generated in response',
      };
    }

    const content = choices[0]?.message?.content;
    if (!content || content.length === 0) {
      console.error('No content in response:', JSON.stringify(data, null, 2));
      return {
        success: false,
        error: 'No content in response',
      };
    }

    // 查找图片URL
    const imageContent = content.find((item) => item.image);
    if (!imageContent?.image) {
      console.error('No image URL in content:', JSON.stringify(content, null, 2));
      return {
        success: false,
        error: 'No image URL in response content',
      };
    }

    return {
      success: true,
      imageUrl: imageContent.image,
    };
  } catch (error: unknown) {
    console.error('Wanxiang expand image generation error:', error);
    let errorMessage = 'Failed to generate expanded image with Wanxiang';
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}