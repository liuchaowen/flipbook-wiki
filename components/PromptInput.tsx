'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PromptInputProps {
    onSubmit: (prompt: string, style: string) => void;
    isLoading?: boolean;
}

const STYLES = [
    { id: 'infographic', name: '信息图', icon: '📊', description: '清晰的信息布局' },
    { id: 'illustration', name: '插画', icon: '🎨', description: '艺术风格插画' },
    { id: 'realistic', name: '写实', icon: '📷', description: '照片级真实感' },
    { id: 'artistic', name: '艺术', icon: '🖼️', description: '创意艺术风格' },
];

export default function PromptInput({ onSubmit, isLoading = false }: PromptInputProps) {
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('infographic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt.trim(), selectedStyle);
        }
    };

    const EXAMPLE_PROMPTS = [
        '巴黎旅游攻略',
        '太阳系行星介绍',
        '咖啡制作流程',
        '人体血液循环系统',
        '中国历史朝代演变',
        '全球气候类型分布',
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 主输入框 */}
                <div className="relative">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="输入你想探索的主题..."
                        disabled={isLoading}
                        className="w-full px-6 py-4 text-lg bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                生成中
                            </span>
                        ) : (
                            '生成'
                        )}
                    </button>
                </div>

                {/* 风格选择 */}
                <div className="space-y-3">
                    <label className="text-gray-400 text-sm">选择风格</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {STYLES.map((style) => (
                            <motion.button
                                key={style.id}
                                type="button"
                                onClick={() => setSelectedStyle(style.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedStyle === style.id
                                        ? 'border-blue-500 bg-blue-500/20'
                                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                    }`}
                            >
                                <span className="text-2xl">{style.icon}</span>
                                <p className="text-white font-medium mt-2">{style.name}</p>
                                <p className="text-gray-400 text-xs mt-1">{style.description}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* 示例提示词 */}
                <div className="space-y-3">
                    <label className="text-gray-400 text-sm">试试这些示例</label>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.map((example) => (
                            <button
                                key={example}
                                type="button"
                                onClick={() => setPrompt(example)}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-full text-gray-300 text-sm transition-colors disabled:opacity-50"
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