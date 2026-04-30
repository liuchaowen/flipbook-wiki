'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlipbookStore } from '@/lib/store';

export default function Footer() {
    const { footerVisible } = useFlipbookStore();
    const [isHovering, setIsHovering] = useState(false);

    // 当 footerVisible 变化时，重置 hover 状态
    useEffect(() => {
        if (footerVisible) {
            setIsHovering(false);
        }
    }, [footerVisible]);

    // 显示条件：store 中可见 或 鼠标悬停在底部区域
    const showFooter = footerVisible || isHovering;

    return (
        <>
            {/* 底部悬停检测区域 - 接近底部时触发显示 */}
            <div
                className="fixed bottom-0 left-0 right-0 h-16 z-50"
                onMouseEnter={() => setIsHovering(true)}
            />

            <AnimatePresence>
                {showFooter && (
                    <motion.footer
                        initial={{ y: 80 }}
                        animate={{ y: 0 }}
                        exit={{ y: 80 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed bottom-0 left-0 right-0 z-40"
                        style={{
                            height: '60px',
                            borderTop: '1px solid var(--hairline-gray)',
                            background: 'var(--canvas-white)',
                        }}
                        onMouseLeave={() => !footerVisible && setIsHovering(false)}
                    >
                        <div className="h-full flex items-center justify-center">
                            <p className="flex items-center justify-center gap-1 text-sm" style={{ color: 'var(--ash-gray)' }}>
                                <span>Inspired by</span>
                                <a
                                    href="https://flipbook.page"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium transition-colors duration-200"
                                    style={{ color: 'var(--rausch)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    flipbook.page
                                </a>
                            </p>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>
        </>
    );
}