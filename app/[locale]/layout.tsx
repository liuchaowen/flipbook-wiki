import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import "../globals.css";

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    // 动态加载对应语言的翻译
    const messages = await getMessages();
    const metadata = messages.metadata as { title: string; description: string };

    return {
        title: metadata.title,
        description: metadata.description,
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    // 验证语言环境是否有效
    if (!locales.includes(locale as Locale)) {
      notFound();
    }

    // 获取翻译消息
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            className={`${nunito.variable} h-full antialiased`}
        >
            <body
                className="h-full flex flex-col overflow-hidden"
                style={{
                    fontFamily: "'Nunito', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
                }}
            >
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}