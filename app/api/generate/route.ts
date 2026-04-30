import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/ai/bailian';
import { v4 as uuidv4 } from 'uuid';

// 将像素尺寸转换为最接近的支持尺寸
function convertToSupportedSize(width: number, height: number): string {
  // qwen-image-2.0-pro 支持的尺寸
  // 根据宽高比选择最合适的尺寸
  const ratio = width / height;
  
  if (ratio > 1.5) {
    // 宽屏：选择宽度较大的尺寸
    return '1920*1080';
  } else if (ratio < 0.67) {
    // 竖屏：选择高度较大的尺寸
    return '1080*1920';
  } else {
    // 接近正方形
    return '1024*1024';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width, height, locale } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 根据传入的窗口尺寸计算合适的图片尺寸
    let imageSize = '1024*1024';
    if (width && height) {
      imageSize = convertToSupportedSize(width, height);
      console.log(`窗口尺寸: ${width}x${height}, 选择图片尺寸: ${imageSize}`);
    }

    // 生成图像（等轴测插画风格），传入语言参数
    const result = await generateImage(prompt, imageSize, locale);

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