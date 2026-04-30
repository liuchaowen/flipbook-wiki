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
        setIsHovering(false);
    }, [headerVisible]);

    // 鼠标接近顶部时触发显示
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const threshold = 80; // 距离顶部 80px 内触发
            if (e.clientY < threshold) {
                setIsHovering(true);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 显示条件：store 中可见 或 鼠标悬停在顶部区域
    const showHeader = headerVisible || isHovering;

    return (
        <>
            <AnimatePresence>
                {showHeader && (
                    <motion.header
                        initial={{ y: -80 }}
                        animate={{ y: 0 }}
                        exit={{ y: -80 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-0 left-0 right-0 z-40 nav-header"
                        style={{
                            height: '72px',
                            backdropFilter: 'blur(10px)',
                        }}
                        onMouseLeave={() => !headerVisible && setIsHovering(false)}
                    >
                        <div className="h-full flex items-center justify-between px-8">
                            {/* Logo - 天际蓝品牌色 */}
                            <h1
                                className="font-bold"
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: 'var(--color-ink)',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                <a href="/">Flipbook Wiki</a>
                            </h1>

                            {/* 中间导航按钮 - 圆形线条图标按钮 */}
                            {showNavigation && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={onBack}
                                        disabled={!canGoBack}
                                        className="btn-icon"
                                        style={{
                                            opacity: canGoBack ? 1 : 0.3,
                                            cursor: canGoBack ? 'pointer' : 'not-allowed',
                                        }}
                                        title="后退"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{
                                                strokeWidth: 2,
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                            }}
                                        >
                                            <path d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={onForward}
                                        disabled={!canGoForward}
                                        className="btn-icon"
                                        style={{
                                            opacity: canGoForward ? 1 : 0.3,
                                            cursor: canGoForward ? 'pointer' : 'not-allowed',
                                        }}
                                        title="前进"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{
                                                strokeWidth: 2,
                                                strokeLinecap: 'round',
                                                strokeLinejoin: 'round',
                                            }}
                                        >
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    <span
                                        className="ml-2"
                                        style={{
                                            color: 'var(--color-ink-light)',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {currentIndex + 1} / {totalItems}
                                    </span>
                                </div>
                            )}

                            {/* 右侧按钮 */}
                            <div className="flex items-center gap-3">
                                {showNavigation && onNew && (
                                    <button
                                        onClick={onNew}
                                        className="btn-secondary"
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        新建探索
                                    </button>
                                )}
                                {/* 主题切换按钮 */}
                                {mounted && (
                                    <button
                                        onClick={toggleTheme}
                                        className="btn-icon"
                                        title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
                                    >
                                        {theme === 'light' ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    strokeWidth: 2,
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                }}
                                            >
                                                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    strokeWidth: 2,
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                }}
                                            >
                                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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