import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 配置
  turbopack: {
    root: process.cwd(),
  },

  // 图片配置 - 允许从 Gemini API 加载图片
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'generativelanguage.googleapis.com',
      },
    ],
    // 图片优化配置
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 编译优化
  compiler: {
    // 生产环境移除 console.log
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['zustand'],
  },
};

export default nextConfig;
