'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <h1 className="text-xl font-semibold text-white">
                            Flipbook
                        </h1>
                    </Link>
                </div>
            </div>
        </header>
    );
}