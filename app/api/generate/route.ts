import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai/openai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 生成图像（等轴测插画风格）
    const result = await generateImage(prompt);

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