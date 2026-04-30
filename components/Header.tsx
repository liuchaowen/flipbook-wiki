'use client';

import React, { useState, useEffect } from 'react';
import { useFlipbookStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    showNavigation?: boolean;
    currentIndex?: number;
    totalItems?: number;
    canGoBack?: boolean;
    canGoForward?: boolean;
    onBack?: () => void;
    onForward?: () => void;
    onNew?: () => void;
}

export default function Header({
    showNavigation = false,
    currentIndex = 0,
    totalItems = 1,
    canGoBack = false,
    canGoForward = false,
    onBack,
    onForward,
    onNew,
}: HeaderProps) {
    const { headerVisible } = useFlipbookStore();
    const [isHovering, setIsHovering] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // 初始化主题
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    // 切换主题
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // 当 headerVisible 变化时，重置 hover 状态
    useEffect(() => {
        if (headerVisible) {
            setIsHovering(false);
        }
    }, [headerVisible]);

    // 显示条件：store 中可见 或 鼠标悬停在顶部区域
    const showHeader = headerVisible || isHovering;

    return (
        <>
            {/* 顶部悬停检测区域 */}
            <div
                className="fixed top-0 left-0 right-0 h-4 z-50"
                onMouseEnter={() => setIsHovering(true)}
            />

            <AnimatePresence>
                {showHeader && (
                    <motion.header
                        initial={{ y: -80 }}
                        animate={{ y: 0 }}
                        exit={{ y: -80 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-0 left-0 right-0 z-40"
                        style={{
                            height: '80px',
                            borderBottom: '1px solid var(--hairline-gray)',
                            background: 'var(--canvas-white)',
                        }}
                        onMouseLeave={() => !headerVisible && setIsHovering(false)}
                    >
                        <div className="h-full flex items-center justify-between px-6">
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
                                <a href="/">Flipbook Wiki</a>
                            </h1>

                            {/* 中间导航按钮 - 圆形图标按钮 */}
                            {showNavigation && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onBack}
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
                                        onClick={onForward}
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
                                        {currentIndex + 1} / {totalItems}
                                    </span>
                                </div>
                            )}

                            {/* 右侧按钮 */}
                            <div className="flex items-center gap-2">
                                {showNavigation && onNew && (
                                    <button
                                        onClick={onNew}
                                        className="transition-all"
                                        style={{
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
                                )}
                                {/* 主题切换按钮 */}
                                {mounted && (
                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center justify-center transition-all"
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: 'var(--soft-cloud)',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                        title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
                                    >
                                        {theme === 'light' ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="var(--ink-black)"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="var(--ink-black)"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>
        </>
    );
}