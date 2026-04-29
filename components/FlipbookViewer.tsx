'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasViewer from './CanvasViewer';
import PromptInput from './PromptInput';
import { GeneratedImage, ImageRegion, ClickPosition, HistoryNode } from '@/types';
import { useFlipbookStore } from '@/lib/store';

export default function FlipbookViewer() {
    const {
        currentImage,
        historyTree,
        navigationStack,
        currentIndex,
        isLoading,
        loadingMessage,
        hoveredRegion,
        setCurrentImage,
        addToHistory,
        pushToStack,
        goBack,
        goForward,
        setLoading,
        setHoveredRegion,
        updateImageRegions,
    } = useFlipbookStore();

    // 生成图像
    const handleGenerate = useCallback(async (prompt: string, style: string) => {
        setLoading(true, '正在生成可视化图像...');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, style }),
            });

            const data = await response.json();

            if (data.success && data.image) {
                const image: GeneratedImage = {
                    ...data.image,
                    createdAt: new Date(data.image.createdAt),
                };

                setCurrentImage(image);

                // 添加到历史记录
                const historyNode: HistoryNode = {
                    id: image.id,
                    image,
                    children: [],
                    createdAt: new Date(),
                };
                addToHistory(historyNode);
                pushToStack(image.id);
            } else {
                console.error('Generation failed:', data.error);
                alert(data.error || '生成失败，请重试');
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert('网络错误，请重试');
        } finally {
            setLoading(false);
        }
    }, [setLoading, setCurrentImage, addToHistory, pushToStack]);

    // 处理图像点击
    const handleImageClick = useCallback(async (position: ClickPosition) => {
        if (!currentImage || isLoading) return;

        setLoading(true, '正在分析点击区域...');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageId: currentImage.id,
                    imageUrl: currentImage.url,
                    position,
                    context: currentImage.prompt,
                }),
            });

            const data = await response.json();

            if (data.success && data.region) {
                const region: ImageRegion = data.region;

                // 更新图像的区域信息
                const existingRegions = currentImage.regions || [];
                updateImageRegions(currentImage.id, [...existingRegions, region]);

                // 如果可以展开，询问用户是否展开
                if (region.canExpand) {
                    const shouldExpand = window.confirm(
                        `「${region.name}」\n${region.description}\n\n是否展开查看详情？`
                    );

                    if (shouldExpand) {
                        await handleExpand(region);
                    }
                } else {
                    alert(`「${region.name}」\n${region.description}`);
                }
            } else {
                console.error('Analysis failed:', data.error);
            }
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setLoading(false);
        }
    }, [currentImage, isLoading, setLoading, updateImageRegions]);

    // 展开区域
    const handleExpand = useCallback(async (region: ImageRegion) => {
        if (!currentImage) return;

        setLoading(true, '正在生成展开视图...');

        try {
            const response = await fetch('/api/expand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageId: currentImage.id,
                    regionName: region.name,
                    regionDescription: region.description,
                    expandType: 'detail',
                    parentContext: currentImage.prompt,
                }),
            });

            const data = await response.json();

            if (data.success && data.image) {
                const image: GeneratedImage = {
                    ...data.image,
                    createdAt: new Date(data.image.createdAt),
                };

                setCurrentImage(image);

                // 添加到历史记录
                const historyNode: HistoryNode = {
                    id: image.id,
                    image,
                    parentId: currentImage.id,
                    children: [],
                    createdAt: new Date(),
                };
                addToHistory(historyNode);
                pushToStack(image.id);
            } else {
                console.error('Expand failed:', data.error);
                alert(data.error || '展开失败，请重试');
            }
        } catch (error) {
            console.error('Expand error:', error);
            alert('网络错误，请重试');
        } finally {
            setLoading(false);
        }
    }, [currentImage, setLoading, setCurrentImage, addToHistory, pushToStack]);

    // 导航控制
    const handleBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleForward = useCallback(() => {
        goForward();
    }, [goForward]);

    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex < navigationStack.length - 1;

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-white">
            {/* 顶部导航栏 */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Flipbook
                    </h1>
                    <span className="text-gray-500 text-sm">AI 可视化探索</span>
                </div>

                {/* 导航按钮 */}
                {currentImage && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBack}
                            disabled={!canGoBack}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="后退"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleForward}
                            disabled={!canGoForward}
                            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="前进"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <span className="text-gray-400 text-sm ml-2">
                            {currentIndex + 1} / {navigationStack.length}
                        </span>
                    </div>
                )}
            </header>

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentImage ? (
                        <motion.div
                            key="viewer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 relative"
                        >
                            <CanvasViewer
                                imageUrl={currentImage.url}
                                imageId={currentImage.id}
                                regions={currentImage.regions || []}
                                onImageClick={handleImageClick}
                                onRegionHover={setHoveredRegion}
                                isLoading={isLoading}
                            />

                            {/* 当前提示词显示 */}
                            <div className="absolute bottom-4 left-4 right-16 bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 max-w-md">
                                <p className="text-gray-400 text-xs mb-1">当前主题</p>
                                <p className="text-white text-sm">{currentImage.originalPrompt || currentImage.prompt}</p>
                            </div>

                            {/* 新建按钮 */}
                            <button
                                onClick={() => setCurrentImage(null)}
                                className="absolute top-4 right-4 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                            >
                                新建探索
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex-1 flex flex-col items-center justify-center p-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    探索无限可能
                                </h2>
                                <p className="text-gray-400 text-lg max-w-xl">
                                    输入任何主题，AI 将为你生成可视化图像。点击图像中的任意区域，深入探索更多内容。
                                </p>
                            </div>

                            <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />

                            {/* 功能说明 */}
                            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">输入主题</h3>
                                    <p className="text-gray-400 text-sm">输入任何你想探索的主题，AI 将生成专属可视化图像</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">点击探索</h3>
                                    <p className="text-gray-400 text-sm">点击图像中的任意区域，AI 将识别并展示该区域的详细信息</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-white font-semibold mb-2">无限展开</h3>
                                    <p className="text-gray-400 text-sm">对感兴趣的区域继续展开，探索无限层级的可视化内容</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 加载遮罩 */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-white mt-6 text-lg">{loadingMessage || 'AI 正在处理...'}</p>
                            <p className="text-gray-400 mt-2 text-sm">这可能需要几秒钟</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}