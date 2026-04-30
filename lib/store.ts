import { create } from 'zustand';
import { GeneratedImage, HistoryNode, ImageRegion } from '@/types';

interface FlipbookState {
  // 当前显示的图像
  currentImage: GeneratedImage | null;
  
  // 历史记录树
  historyTree: Map<string, HistoryNode>;
  
  // 导航栈（用于前进/后退）
  navigationStack: string[];
  currentIndex: number;
  
  // 加载状态
  isLoading: boolean;
  loadingMessage: string;
  
  // 悬停区域
  hoveredRegion: ImageRegion | null;
  
  // 导航栏可见性
  headerVisible: boolean;
  
  // 底部栏可见性
  footerVisible: boolean;
  
  // Actions
  setCurrentImage: (image: GeneratedImage | null) => void;
  addToHistory: (node: HistoryNode) => void;
  pushToStack: (imageId: string) => void;
  goBack: () => string | null;
  goForward: () => string | null;
  setLoading: (loading: boolean, message?: string) => void;
  setHoveredRegion: (region: ImageRegion | null) => void;
  updateImageRegions: (imageId: string, regions: ImageRegion[]) => void;
  setHeaderVisible: (visible: boolean) => void;
  setFooterVisible: (visible: boolean) => void;
}

export const useFlipbookStore = create<FlipbookState>((set, get) => ({
  currentImage: null,
  historyTree: new Map(),
  navigationStack: [],
  currentIndex: -1,
  isLoading: false,
  loadingMessage: '',
  hoveredRegion: null,
  headerVisible: true,
  footerVisible: true,

  setCurrentImage: (image) => set({ currentImage: image }),

  addToHistory: (node) => set((state) => {
    const newTree = new Map(state.historyTree);
    newTree.set(node.id, node);
    return { historyTree: newTree };
  }),

  pushToStack: (imageId) => set((state) => {
    // 如果当前不在栈末尾，截断后面的内容
    const newStack = state.navigationStack.slice(0, state.currentIndex + 1);
    newStack.push(imageId);
    return {
      navigationStack: newStack,
      currentIndex: newStack.length - 1,
    };
  }),

  goBack: () => {
    const state = get();
    if (state.currentIndex > 0) {
      const newIndex = state.currentIndex - 1;
      const imageId = state.navigationStack[newIndex];
      const node = state.historyTree.get(imageId);
      if (node) {
        set({ currentIndex: newIndex, currentImage: node.image });
        return imageId;
      }
    }
    return null;
  },

  goForward: () => {
    const state = get();
    if (state.currentIndex < state.navigationStack.length - 1) {
      const newIndex = state.currentIndex + 1;
      const imageId = state.navigationStack[newIndex];
      const node = state.historyTree.get(imageId);
      if (node) {
        set({ currentIndex: newIndex, currentImage: node.image });
        return imageId;
      }
    }
    return null;
  },

  setLoading: (loading, message = '') => set({
    isLoading: loading,
    loadingMessage: message,
  }),

  setHoveredRegion: (region) => set({ hoveredRegion: region }),

  updateImageRegions: (imageId, regions) => set((state) => {
    const node = state.historyTree.get(imageId);
    if (node) {
      const updatedNode = {
        ...node,
        image: { ...node.image, regions },
      };
      const newTree = new Map(state.historyTree);
      newTree.set(imageId, updatedNode);
      
      // 如果是当前图像，也更新 currentImage
      if (state.currentImage?.id === imageId) {
        return {
          historyTree: newTree,
          currentImage: updatedNode.image,
        };
      }
      return { historyTree: newTree };
    }
    return state;
  }),

  setHeaderVisible: (visible) => set({ headerVisible: visible }),
  setFooterVisible: (visible) => set({ footerVisible: visible }),
}));