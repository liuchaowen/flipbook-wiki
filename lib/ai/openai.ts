import OpenAI from 'openai';

// 初始化 OpenAI 客户端
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return new OpenAI({ apiKey });
};

// 风格修饰词
const STYLE_MODIFIERS: Record<string, string> = {
  infographic: 'infographic style, clean layout, icons and illustrations, educational, visually organized, labeled sections, modern design',
  illustration: 'digital illustration, artistic, vibrant colors, detailed, creative style',
  realistic: 'photorealistic, high detail, professional photography, natural lighting',
  artistic: 'artistic style, painterly, expressive, creative interpretation, fine art quality',
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

// 图像生成
export async function generateImage(prompt: string, style: string = 'infographic'): Promise<{
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
}> {
  try {
    const openai = getOpenAIClient();
    const enhancedPrompt = buildInfographicPrompt(prompt, style);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const imageData = response.data[0];
    
    return {
      success: true,
      imageUrl: imageData.url,
      revisedPrompt: imageData.revised_prompt,
    };
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image',
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

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const imageUrl = response.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error('Expand image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate expanded image',
    };
  }
}