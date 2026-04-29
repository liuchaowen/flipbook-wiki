'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageRegion, ClickPosition } from '@/types';

interface CanvasViewerProps {
    imageUrl: string;
    imageId: string;
    regions: ImageRegion[];
    onImageClick: (position: ClickPosition) => void;
    onRegionHover: (region: ImageRegion | null) => void;
    isLoading?: boolean;
}

export default function CanvasViewer({
    imageUrl,
    imageId,
    regions,
    onImageClick,
    onRegionHover,
    isLoading = false,
}: CanvasViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredRegion, setHoveredRegion] = useState<ImageRegion | null>(null);

    // 更新容器和图片尺寸
    useEffect(() => {
        const updateSizes = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };

        updateSizes();
        window.addEventListener('resize', updateSizes);
        return () => window.removeEventListener('resize', updateSizes);
    }, []);

    // 图片加载后更新尺寸
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });

        // 计算适应容器的缩放比例
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const scaleX = containerRect.width / img.naturalWidth;
            const scaleY = containerRect.height / img.naturalHeight;
            const fitScale = Math.min(scaleX, scaleY, 1);
            setScale(fitScale);
        }
    };

    // 处理点击事件
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (isDragging || isLoading) return;

        const img = imageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * imageSize.width;
        const y = ((e.clientY - rect.top) / rect.height) * imageSize.height;

        onImageClick({
            x,
            y,
            imageWidth: imageSize.width,
            imageHeight: imageSize.height,
        });
    }, [isDragging, isLoading, imageSize, onImageClick]);

    // 处理鼠标移动（检测悬停区域）
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            // 处理拖拽
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setPosition(prev => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));
            setDragStart({ x: e.clientX, y: e.clientY });
            return;
        }

        // 检测悬停区域
        const img = imageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const hoveredReg = regions.find(region => {
            const { bounds } = region;
            return (
                x >= bounds.x &&
                x <= bounds.x + bounds.width &&
                y >= bounds.y &&
                y <= bounds.y + bounds.height
            );
        });

        if (hoveredReg !== hoveredRegion) {
            setHoveredRegion(hoveredReg ?? null);
            onRegionHover(hoveredReg ?? null);
        }
    }, [isDragging, dragStart, regions, hoveredRegion, onRegionHover]);

    // 处理拖拽开始
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) {
            setIsDragging(false);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    // 处理拖拽结束
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // 缩放控制
    const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.3));
    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: 'var(--soft-cloud)' }}
        >
            {/* 图片容器 */}
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center cursor-crosshair"
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <motion.div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                    className="relative"
                >
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Generated visualization"
                        className="max-w-none select-none"
                        style={{ borderRadius: '14px' }}
                        onLoad={handleImageLoad}
                        draggable={false}
                    />

                    {/* 区域高亮 - Airbnb 风格 */}
                    {regions.map((region) => (
                        <div
                            key={region.id}
                            className="absolute pointer-events-none transition-all duration-200"
                            style={{
                                left: `${region.bounds.x}%`,
                                top: `${region.bounds.y}%`,
                                width: `${region.bounds.width}%`,
                                height: `${region.bounds.height}%`,
                                background: hoveredRegion?.id === region.id
                                    ? 'rgba(255, 56, 92, 0.15)'
                                    : 'transparent',
                                border: hoveredRegion?.id === region.id
                                    ? '2px solid var(--rausch)'
                                    : '1px solid transparent',
                                borderRadius: '8px',
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* 缩放控制 - 圆形图标按钮 */}
            <div
                className="absolute bottom-4 right-4 flex gap-2"
            >
                <button
                    onClick={handleZoomOut}
                    className="flex items-center justify-center transition-all"
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--canvas-white)',
                        border: '1px solid var(--hairline-gray)',
                        boxShadow: 'rgba(255, 255, 255) 0 0 0 4px',
                    }}
                    title="缩小"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="var(--ink-black)"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <button
                    onClick={handleResetZoom}
                    className="flex items-center justify-center transition-all"
                    style={{
                        minWidth: '60px',
                        height: '44px',
                        borderRadius: '20px',
                        background: 'var(--canvas-white)',
                        border: '1px solid var(--hairline-gray)',
                        color: 'var(--ink-black)',
                        fontSize: '14px',
                        fontWeight: 500,
                        boxShadow: 'rgba(255, 255, 255) 0 0 0 4px',
                    }}
                    title="重置"
                >
                    {Math.round(scale * 100)}%
                </button>
                <button
                    onClick={handleZoomIn}
                    className="flex items-center justify-center transition-all"
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--canvas-white)',
                        border: '1px solid var(--hairline-gray)',
                        boxShadow: 'rgba(255, 255, 255) 0 0 0 4px',
                    }}
                    title="放大"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="var(--ink-black)"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* 悬停区域信息 - Airbnb 卡片风格 */}
            <AnimatePresence>
                {hoveredRegion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-4 left-4 max-w-xs"
                        style={{
                            background: 'var(--canvas-white)',
                            borderRadius: '14px',
                            border: '1px solid var(--hairline-gray)',
                            boxShadow: 'rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0',
                            padding: '16px',
                        }}
                    >
                        <h3
                            className="font-semibold"
                            style={{
                                color: 'var(--ink-black)',
                                fontSize: '16px',
                                fontWeight: 600,
                                lineHeight: 1.25,
                            }}
                        >
                            {hoveredRegion.name}
                        </h3>
                        <p
                            className="mt-1"
                            style={{
                                color: 'var(--ash-gray)',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: 1.43,
                            }}
                        >
                            {hoveredRegion.description}
                        </p>
                        {hoveredRegion.canExpand && (
                            <p
                                className="mt-2"
                                style={{
                                    color: 'var(--rausch)',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                }}
                            >
                                点击查看详情
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 加载遮罩 */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <div className="text-center">
                            <div
                                className="mx-auto"
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    border: '3px solid var(--hairline-gray)',
                                    borderTopColor: 'var(--rausch)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                }}
                            />
                            <p
                                className="mt-4"
                                style={{
                                    color: 'var(--ink-black)',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                }}
                            >
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}