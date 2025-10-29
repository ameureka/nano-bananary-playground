import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "香蕉PS乐园 - Banana PS Playground",
  description: "一个基于 Google Gemini AI 的创意图像编辑和生成应用，提供 86 种艺术效果和智能对话功能。",
  keywords: ["AI", "图像编辑", "Gemini", "图像生成", "艺术效果"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 读取语言 cookie，确保 SSR/CSR 初始语言一致
  // 固定初始语言为 'zh'，客户端挂载后会从 localStorage 同步用户偏好
  const initialLanguage: 'zh' | 'en' = 'zh';
  return (
    <html lang="zh-CN">
      <head>
        {/* 预连接到 Google Fonts 以优化字体加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Material Symbols 图标字体 - 使用 display=swap 优化加载 */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={roboto.className} suppressHydrationWarning>
        <Providers initialLanguage={initialLanguage}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
