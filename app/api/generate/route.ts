import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai/wanxiang';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style = 'infographic' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 生成图像
    const result = await generateImage(prompt, style);

    if (!result.success || !result.imageUrl) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate image' },
        { status: 500 }
      );
    }

    // 返回生成的图像信息
    const imageId = uuidv4();
    
    return NextResponse.json({
      success: true,
      image: {
        id: imageId,
        url: result.imageUrl,
        prompt: result.revisedPrompt || prompt,
        originalPrompt: prompt,
        style,
        createdAt: new Date().toISOString(),
        regions: [],
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}