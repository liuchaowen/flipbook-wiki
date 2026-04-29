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
    const handleGenerate = useCallback(async (prompt: string) => {
        setLoading(true, '正在生成可视化图像...');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
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

                // 如果可以展开，直接展开
                if (region.canExpand) {
                    await handleExpand(region);
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
        <div
            className="h-screen flex flex-col"
            style={{
                background: 'var(--canvas-white)',
                color: 'var(--ink-black)',
            }}
        >
            {/* 顶部导航栏 - Airbnb 风格 */}
            <header
                className="flex items-center justify-between px-6 py-4"
                style={{
                    height: '80px',
                    borderBottom: '1px solid var(--hairline-gray)',
                    background: 'var(--canvas-white)',
                }}
            >
                <div className="flex items-center gap-4">
                    {/* Logo - Rausch 品牌色 */}
                    <h1
                        className="font-bold"
                        style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: 'var(--rausch)',
                            letterSpacing: '-0.018em',
                        }}
                    >
                        Flipbook.wiki
                    </h1>
                </div>

                {/* 导航按钮 - 圆形图标按钮 */}
                {currentImage && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBack}
                            disabled={!canGoBack}
                            className="flex items-center justify-center transition-all"
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'var(--soft-cloud)',
                                border: 'none',
                                cursor: canGoBack ? 'pointer' : 'not-allowed',
                                opacity: canGoBack ? 1 : 0.3,
                            }}
                            title="后退"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="var(--ink-black)"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleForward}
                            disabled={!canGoForward}
                            className="flex items-center justify-center transition-all"
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'var(--soft-cloud)',
                                border: 'none',
                                cursor: canGoForward ? 'pointer' : 'not-allowed',
                                opacity: canGoForward ? 1 : 0.3,
                            }}
                            title="前进"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="var(--ink-black)"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <span
                            className="ml-2"
                            style={{
                                color: 'var(--ash-gray)',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
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

                            {/* 当前提示词显示 - Airbnb 卡片风格 */}
                            <div
                                className="absolute bottom-4 left-4 max-w-md"
                                style={{
                                    background: 'var(--canvas-white)',
                                    borderRadius: '14px',
                                    border: '1px solid var(--hairline-gray)',
                                    boxShadow: 'rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0',
                                    padding: '12px 16px',
                                }}
                            >
                                <p
                                    style={{
                                        color: 'var(--ash-gray)',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        marginBottom: '4px',
                                    }}
                                >
                                    当前主题
                                </p>
                                <p
                                    style={{
                                        color: 'var(--ink-black)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        lineHeight: 1.43,
                                    }}
                                >
                                    {currentImage.originalPrompt || currentImage.prompt}
                                </p>
                            </div>

                            {/* 新建按钮 - Secondary 按钮风格 */}
                            <button
                                onClick={() => setCurrentImage(null)}
                                className="transition-all"
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'var(--canvas-white)',
                                    color: 'var(--ink-black)',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    padding: '10px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--hairline-gray)',
                                    cursor: 'pointer',
                                }}
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
                            style={{ background: 'var(--canvas-white)' }}
                        >
                            <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

        </div>
    );
}