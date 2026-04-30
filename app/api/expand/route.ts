import { NextRequest, NextResponse } from 'next/server';
import { generateExpandedImage } from '@/lib/ai/bailian';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageId, regionName, regionDescription, expandType, parentContext } = body;

    if (!regionName || !regionDescription) {
      return NextResponse.json(
        { success: false, error: 'Region name and description are required' },
        { status: 400 }
      );
    }

    // 生成展开图像
    const result = await generateExpandedImage(
      regionName,
      regionDescription,
      expandType || 'detail',
      parentContext || ''
    );

    if (!result.success || !result.imageUrl) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate expanded image' },
        { status: 500 }
      );
    }

    // 返回新图像
    const newImageId = uuidv4();
    
    return NextResponse.json({
      success: true,
      image: {
        id: newImageId,
        parentId: imageId,
        url: result.imageUrl,
        prompt: `Expanded view of: ${regionName}`,
        regionName,
        expandType,
        createdAt: new Date().toISOString(),
        regions: [],
      },
    });
  } catch (error) {
    console.error('Expand API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}