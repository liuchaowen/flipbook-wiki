'use client';

import React, { useState, useEffect } from 'react';

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    isLoading?: boolean;
}

const HISTORY_STORAGE_KEY = 'flipbook-prompt-history';

export default function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
            {/* 标题区域 */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[var(--ink-black)] mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
                    探索知识的无限可能
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 搜索栏样式输入框 - Airbnb 风格 */}
                <div
                    className="relative flex items-center bg-[var(--canvas-white)] border border-[var(--hairline-gray)]"
                    style={{
                        borderRadius: '32px',
                        boxShadow: 'rgba(0, 0, 0, 0.04) 0 2px 6px 0',
                    }}
                >
                    <div className="flex-1 px-6 py-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="输入你想探索的主题..."
                            disabled={isLoading}
                            className="w-full bg-transparent text-[var(--ink-black)] placeholder-[var(--mute-gray)] focus:outline-none"
                            style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.25 }}
                        />
                    </div>

                    {/* 提交按钮 - Rausch 圆形按钮 */}
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isLoading}
                        className="flex items-center justify-center mr-3 transition-all"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: !prompt.trim() || isLoading ? 'var(--stone-gray)' : 'var(--rausch)',
                            cursor: !prompt.trim() || isLoading ? 'not-allowed' : 'pointer',
                            transform: 'scale(1)',
                        }}
                    >
                        {isLoading ? (
                            <svg
                                className="w-5 h-5 animate-spin text-white"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12" cy="12" r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* 提示词 - Pill 按钮样式 */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {displayPrompts.map((item) => (
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
                                    className="px-4 py-2 bg-[var(--canvas-white)] border border-[var(--hairline-gray)] text-[var(--ink-black)] transition-all hover:border-[var(--ink-black)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        borderRadius: '20px',
                                        paddingRight: isHistoryMode && hoveredItem === item ? '32px' : undefined,
                                    }}
                                >
                                    {item}
                                </button>
                                {/* 历史记录删除按钮 */}
                                {isHistoryMode && hoveredItem === item && (
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteHistoryItem(item, e)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full hover:bg-[var(--soft-cloud)] transition-colors"
                                        style={{
                                            color: 'var(--ash-gray)',
                                        }}
                                        title="删除此历史记录"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}