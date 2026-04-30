import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flipbook - AI 可视化探索",
  description: "输入任何主题，AI 将为你生成可视化图像。点击图像中的任意区域，深入探索更多内容。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body
        className="h-full flex flex-col overflow-hidden"
        style={{
          fontFamily: "'Nunito', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
