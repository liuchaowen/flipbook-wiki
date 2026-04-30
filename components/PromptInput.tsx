'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, ArrowUp } from 'lucide-react';

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    isLoading?: boolean;
}

const HISTORY_STORAGE_KEY = 'flipbook-prompt-history';

export default function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    // 从 localStorage 加载历史记录
    useEffect(() => {
        const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                }
            } catch {
                // 忽略解析错误
            }
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            const trimmedPrompt = prompt.trim();
            onSubmit(trimmedPrompt);

            // 添加到历史记录（避免重复）
            setHistory(prev => {
                const newHistory = [trimmedPrompt, ...prev.filter(item => item !== trimmedPrompt)].slice(0, 5);
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
        }
    };

    // 删除单条历史记录
    const handleDeleteHistoryItem = (itemToDelete: string, e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止触发标签的点击事件
        setHistory(prev => {
            const newHistory = prev.filter(item => item !== itemToDelete);
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const EXAMPLE_PROMPTS = [
        '中国旅游攻略',
        '宇宙到地球的视角',
        '五一广州两日游指南',
        '极端气候形成演变',
        '歼20战斗机组成'
    ];

    // 如果有历史记录，显示历史记录；否则显示示例
    const displayPrompts = history.length > 0 ? history : EXAMPLE_PROMPTS;
    const isHistoryMode = history.length > 0;

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* 标题区域 - 遵循设计系统排版规则 */}
            <div className="text-center mb-10">
                <h1
                    className="font-bold"
                    style={{
                        color: 'var(--color-ink)',
                        fontSize: 'clamp(20px, 3vw, 36px)',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                    }}
                >
                    探索知识的无限可能
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 搜索框 - 遵循设计系统搜索框规范 */}
                <div
                    className="relative flex items-center"
                    style={{
                        background: 'var(--color-white)',
                        border: '2px solid #1a1a1a',
                        borderRadius: '32px',
                        boxShadow: 'none',
                    }}
                >
                    {/* 左侧搜索图标 */}
                    <div className="pl-5 flex items-center">
                        <Search className="w-5 h-5" style={{ color: 'var(--color-ink-light)' }} />
                    </div>
                    <div className="flex-1 px-4 py-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="输入你想探索的主题..."
                            disabled={isLoading}
                            className="w-full bg-transparent focus:outline-none"
                            style={{
                                fontSize: '16px',
                                fontWeight: 400,
                                lineHeight: 1.6,
                                color: 'var(--color-ink)',
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </div>

                    {/* 提交按钮 - 遵循设计系统主要按钮规范 */}
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isLoading}
                        className="flex items-center justify-center mr-3"
                        style={{
                            height: '44px',
                            width: '44px',
                            padding: '0',
                            borderRadius: '24px',
                            background: !prompt.trim() || isLoading
                                ? 'var(--color-ink-muted)'
                                : 'var(--color-primary-beige)',
                            cursor: !prompt.trim() || isLoading ? 'not-allowed' : 'pointer',
                            border: '2px solid #1a1a1a',
                            boxShadow: 'none',
                            opacity: !prompt.trim() || isLoading ? 0.5 : 1,
                            color: 'var(--color-ink)',
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-ink)' }} />
                        ) : (
                            <ArrowUp className="w-5 h-5" style={{ color: 'var(--color-ink)' }} />
                        )}
                    </button>
                </div>

                {/* 提示词标签 - 遵循设计系统粉彩标签规范 */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {displayPrompts.map((item, index) => {
                            // 根据设计系统使用粉彩标签样式
                            const tagStyles: React.CSSProperties = {
                                background: index % 3 === 0
                                    ? 'rgba(126, 184, 218, 0.2)'
                                    : index % 3 === 1
                                        ? 'rgba(168, 213, 186, 0.2)'
                                        : 'rgba(212, 196, 224, 0.2)',
                                color: 'var(--color-ink)',
                                border: `1.5px solid ${index % 3 === 0
                                    ? 'var(--color-primary-blue)'
                                    : index % 3 === 1
                                        ? 'var(--color-primary-green)'
                                        : 'var(--color-pastel-lavender)'}`,
                                borderRadius: '20px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.5 : 1,
                                transition: 'all 0.3s ease',
                                paddingRight: isHistoryMode && hoveredItem === item ? '32px' : '14px',
                            };

                            return (
                                <div
                                    key={item}
                                    className="relative"
                                    onMouseEnter={() => isHistoryMode && setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setPrompt(item)}
                                        disabled={isLoading}
                                        className="transition-all hover:scale-105"
                                        style={tagStyles}
                                    >
                                        {item}
                                    </button>
                                    {/* 历史记录删除按钮 */}
                                    {isHistoryMode && hoveredItem === item && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeleteHistoryItem(item, e)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full transition-colors"
                                            style={{
                                                color: 'var(--color-ink-light)',
                                                background: 'transparent',
                                            }}
                                            title="删除此历史记录"
                                        >
                                            <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    strokeWidth: 2,
                                                    strokeLinecap: 'round',
                                                    strokeLinejoin: 'round',
                                                }}
                                            >
                                                <path d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </form>
        </div>
    );
}