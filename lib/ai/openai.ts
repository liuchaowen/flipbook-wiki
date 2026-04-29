import OpenAI from 'openai';

// 初始化 OpenAI 客户端
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  const baseURL = process.env.OPENAI_BASE_URL;
  return new OpenAI({ apiKey, baseURL });
};

// 等轴测插画风格修饰词 - 统一风格和色彩
const ISOMETRIC_STYLE = 'isometric illustration style, 3D isometric view, isometric projection, dimensional feel, geometric shapes, clean modern design, soft pastel color palette with blue, teal, coral and warm orange accents, consistent lighting, infographic style, clean layout, icons and illustrations, educational, visual organization, labeled sections, vector art style, smooth gradients, professional infographic design';

// 构建图像生成 Prompt（等轴测插画风格）
export function buildInfographicPrompt(userPrompt: string): string {
  return `${userPrompt}, ${ISOMETRIC_STYLE}`;
}

// 构建展开区域 Prompt（等轴测插画风格）
export function buildExpandPrompt(
  regionName: string,
  regionDescription: string,
  expandType: string,
  parentContext: string
): string {
  const expandTypeModifiers: Record<string, string> = {
    detail: 'detailed close-up view, zoomed in details',
    panorama: 'panoramic view, wide scene',
    interior: 'interior view, cross-section',
    overview: 'overview perspective, bird\'s eye view',
  };

  const modifier = expandTypeModifiers[expandType] || expandTypeModifiers.detail;
  return `${regionName}, ${modifier}, ${regionDescription}, part of "${parentContext}", ${ISOMETRIC_STYLE}`;
}

// 图像生成（使用 OpenAI DALL-E API）
export async function generateImage(prompt: string): Promise<{
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
}> {
  try {
    const openai = getOpenAIClient();
    const enhancedPrompt = buildInfographicPrompt(prompt);

    console.log('--- Generating image with OpenAI DALL-E ---');
    console.log('Prompt:', enhancedPrompt);

    const response = await openai.images.generate({
      model: 'gpt-image-1-all',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data[0]?.url;
    const revisedPrompt = response.data[0]?.revised_prompt;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    console.log('Image generated successfully!');
    console.log('Image URL:', imageUrl);

    return {
      success: true,
      imageUrl,
      revisedPrompt: revisedPrompt || enhancedPrompt,
    };
  } catch (error) {
    console.error('Image generation error:', error);
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
    const openai = getOpenAIClient();
    const prompt = buildExpandPrompt(regionName, regionDescription, expandType, parentContext);

    console.log('--- Generating expanded image with OpenAI DALL-E ---');
    console.log('Prompt:', prompt);

    const response = await openai.images.generate({
      model: 'z-image-turbo',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    console.log('Expanded image generated successfully!');
    console.log('Image URL:', imageUrl);

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error('Expanded image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate expanded image',
    };
  }
}

// 图像区域分析（使用 GPT-4 Vision）
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
    const openai = getOpenAIClient();

    // 计算相对位置百分比
    const xPercent = (clickX / imageWidth * 100).toFixed(1);
    const yPercent = (clickY / imageHeight * 100).toFixed(1);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing images and identifying specific regions. When given an image and a click position, you identify what element or region was clicked and provide detailed information about it.

Always respond in JSON format:
{
  "name": "Name of the clicked element",
  "description": "Detailed description of what this element represents",
  "bounds": { "x": 0-100, "y": 0-100, "width": 0-100, "height": 0-100 },
  "canExpand": true/false
}

The bounds should be approximate percentages of the image dimensions.
canExpand should be true if this element can be explored further (like a building, object, or area that has interior details).`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `This is an infographic about: "${context}"

The user clicked at position (${xPercent}%, ${yPercent}%) on the image.

Please analyze what element or region was clicked and provide information about it in JSON format.`,
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from vision model');
    }

    const parsed = JSON.parse(content);
    
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
    console.error('Region analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze region',
    };
  }
}