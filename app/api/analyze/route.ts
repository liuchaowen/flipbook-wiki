import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageRegion } from '@/lib/ai/openai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, imageUrl, position, context } = body;

    if (!imageUrl || !position) {
      return NextResponse.json(
        { success: false, error: 'Image URL and position are required' },
        { status: 400 }
      );
    }

    const { x, y, imageWidth, imageHeight } = position;

    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof imageWidth !== 'number' ||
      typeof imageHeight !== 'number'
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid position data' },
        { status: 400 }
      );
    }

    // 分析点击区域
    const result = await analyzeImageRegion(
      imageUrl,
      x,
      y,
      imageWidth,
      imageHeight,
      context || ''
    );

    if (!result.success || !result.region) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to analyze region' },
        { status: 500 }
      );
    }

    // 返回区域信息
    return NextResponse.json({
      success: true,
      region: {
        id: uuidv4(),
        name: result.region.name,
        description: result.region.description,
        bounds: result.region.bounds,
        canExpand: result.region.canExpand,
      },
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}