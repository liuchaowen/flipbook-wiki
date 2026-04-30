'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
            <p className="flex items-center justify-center gap-1">
                <span>Inspired by</span>
                <a
                    href="https://flipbook.page"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
                >
                    flipbook.page
                </a>
            </p>
        </motion.footer>
    );
}