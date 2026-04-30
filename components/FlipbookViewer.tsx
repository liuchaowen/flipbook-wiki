'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import CanvasViewer from './CanvasViewer';
import PromptInput from './PromptInput';
import Header from './Header';
import Footer from './Footer';
import { GeneratedImage, ImageRegion, ClickPosition, HistoryNode } from '@/types';
import { useFlipbookStore } from '@/lib/store';

export default function FlipbookViewer() {
    const t = useTranslations('flipbookViewer');

    const {
        currentImage,
        historyTree,
        navigationStack,
        currentIndex,
        isLoading,
        loadingMessage,
        hoveredRegion,
        headerVisible,
        footerVisible,
        setCurrentImage,
        addToHistory,
        pushToStack,
        goBack,
        goForward,
        setLoading,
        setHoveredRegion,
        updateImageRegions,
        setHeaderVisible,
        setFooterVisible,
    } = useFlipbookStore();

    // 初始时显示导航栏和底部栏，有图片时隐藏
    useEffect(() => {
        if (!currentImage) {
            setHeaderVisible(true);
            setFooterVisible(true);
        }
    }, [currentImage, setHeaderVisible, setFooterVisible]);

    // 获取窗口可用尺寸（除去顶部导航栏高度）
    const getAvailableSize = useCallback(() => {
        const headerHeight = 72; // 顶部导航栏高度
        const width = window.innerWidth;
        const height = window.innerHeight - headerHeight;
        return { width, height };
    }, []);

    // 生成图像
    const handleGenerate = useCallback(async (prompt: string) => {
        setLoading(true, t('generatingImage'));

        try {
            const { width, height } = getAvailableSize();
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, width, height }),
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

                // 生成图片后隐藏导航栏和底部栏
                setHeaderVisible(false);
                setFooterVisible(false);
            } else {
                console.error('Generation failed:', data.error);
                alert(data.error || t('generationFailed'));
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert(t('networkError'));
        } finally {
            setLoading(false);
        }
    }, [setLoading, setCurrentImage, addToHistory, pushToStack, setHeaderVisible, setFooterVisible, t]);

    // 处理图像点击
    const handleImageClick = useCallback(async (position: ClickPosition) => {
        if (!currentImage || isLoading) return;

        setLoading(true, t('expandingRegion'));

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
    }, [currentImage, isLoading, setLoading, updateImageRegions, t]);

    // 展开区域
    const handleExpand = useCallback(async (region: ImageRegion) => {
        if (!currentImage) return;

        setLoading(true, t('expandingRegion'));

        try {
            const { width, height } = getAvailableSize();
            const response = await fetch('/api/expand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageId: currentImage.id,
                    imageUrl: currentImage.url,
                    regionName: region.name,
                    regionDescription: region.description,
                    expandType: 'detail',
                    parentContext: currentImage.prompt,
                    width,
                    height,
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

                // 展开生成新图片后隐藏导航栏和底部栏
                setHeaderVisible(false);
                setFooterVisible(false);
            } else {
                console.error('Expand failed:', data.error);
                alert(data.error || t('generationFailed'));
            }
        } catch (error) {
            console.error('Expand error:', error);
            alert(t('networkError'));
        } finally {
            setLoading(false);
        }
    }, [currentImage, setLoading, setCurrentImage, addToHistory, pushToStack, setHeaderVisible, setFooterVisible, t]);

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
            className="h-screen flex flex-col overflow-hidden"
            style={{
                background: 'var(--color-white)',
                color: 'var(--color-ink)',
            }}
        >
            {/* 可自动隐藏的顶部导航栏 */}
            <Header
                showNavigation={!!currentImage}
                currentIndex={currentIndex}
                totalItems={navigationStack.length}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onBack={handleBack}
                onForward={handleForward}
                onNew={() => setCurrentImage(null)}
            />

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentImage ? (
                        <motion.div
                            key="viewer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
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

                            {/* 当前提示词显示 - 线条艺术卡片风格 */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
                                className="absolute bottom-4 left-4 max-w-md card"
                                style={{
                                    background: 'var(--color-white)',
                                    borderRadius: '16px',
                                    border: '2px solid var(--color-ink-muted)',
                                    boxShadow: 'var(--shadow-soft)',
                                    padding: '12px 16px',
                                }}
                            >
                                <p
                                    className="text-micro"
                                    style={{
                                        color: 'var(--color-ink-light)',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {t('currentTopic')}
                                </p>
                                <p
                                    className="text-body"
                                    style={{
                                        color: 'var(--color-ink)',
                                        fontWeight: 500,
                                    }}
                                >
                                    {currentImage.originalPrompt || currentImage.prompt}
                                </p>
                            </motion.div>


                        </motion.div>
                    ) : (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="flex-1 flex flex-col items-center justify-center p-8"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-primary-beige) 0%, var(--color-white) 50%, rgba(126, 184, 218, 0.05) 100%)',
                            }}
                        >
                            {/* 装饰性背景图案 */}
                            <div
                                className="absolute inset-0 pattern-dots opacity-30"
                                style={{ zIndex: 0 }}
                            />

                            {/* 主内容 */}
                            <div style={{ zIndex: 1 }}>
                                <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 底部信息栏 */}
            <Footer />

        </div>
    );
}