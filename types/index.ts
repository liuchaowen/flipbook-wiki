// 图像生成相关类型
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  originalPrompt?: string;
  createdAt: Date;
  regions?: ImageRegion[];
}

// 图像区域
export interface ImageRegion {
  id: string;
  name: string;
  description: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  canExpand: boolean;
}

// 点击位置
export interface ClickPosition {
  x: number;
  y: number;
  imageWidth: number;
  imageHeight: number;
}

// 生成请求
export interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
}

// 生成响应
export interface GenerateResponse {
  success: boolean;
  image?: GeneratedImage;
  error?: string;
}

// 区域分析请求
export interface AnalyzeRequest {
  imageId: string;
  imageUrl: string;
  position: ClickPosition;
  context: string;
}

// 区域分析响应
export interface AnalyzeResponse {
  success: boolean;
  region?: ImageRegion;
  error?: string;
}

// 展开请求
export interface ExpandRequest {
  imageId: string;
  regionId: string;
  regionName: string;
  expandType: 'detail' | 'panorama' | 'interior' | 'overview';
}

// 展开响应
export interface ExpandResponse {
  success: boolean;
  image?: GeneratedImage;
  error?: string;
}

// 历史记录节点
export interface HistoryNode {
  id: string;
  image: GeneratedImage;
  parentId?: string;
  children: string[];
  createdAt: Date;
}

// 应用状态
export interface AppState {
  currentImage: GeneratedImage | null;
  history: Map<string, HistoryNode>;
  historyStack: string[];
  currentIndex: number;
  isLoading: boolean;
  loadingMessage: string;
}