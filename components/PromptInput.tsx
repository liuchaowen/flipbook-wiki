'use client';

import React, { useState } from 'react';

interface PromptInputProps {
    onSubmit: (prompt: string) => void;
    isLoading?: boolean;
}

export default function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt.trim());
        }
    };

    const EXAMPLE_PROMPTS = [
        '巴黎旅游攻略',
        '太阳系行星介绍',
        '咖啡制作流程',
        '中国历史朝代演变',
        '全球气候类型分布',
    ];

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* 标题区域 */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[var(--ink-black)] mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
                    探索知识的无限可能
                </h1>
                <p className="text-[var(--ash-gray)]" style={{ fontSize: '16px', fontWeight: 500 }}>
                    输入主题，AI 将为你生成可视化探索之旅
                </p>
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

                {/* 示例提示词 - Pill 按钮样式 */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.map((example) => (
                            <button
                                key={example}
                                type="button"
                                onClick={() => setPrompt(example)}
                                disabled={isLoading}
                                className="px-4 py-2 bg-[var(--canvas-white)] border border-[var(--hairline-gray)] text-[var(--ink-black)] transition-all hover:border-[var(--ink-black)] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    borderRadius: '20px',
                                }}
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}