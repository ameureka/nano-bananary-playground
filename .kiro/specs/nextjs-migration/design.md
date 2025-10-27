# Next.js App Router 迁移设计文档

**文档版本**: 1.0  
**创建日期**: 2025-10-27  
**最后更新**: 2025-10-27  
**文档状态**: ✅ 待审查  
**项目名称**: 香蕉PS乐园 Next.js 迁移  
**项目代号**: NEXTJS-MIGRATION-PHASE1

---

## 📋 文档修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|---------|
| 1.0 | 2025-10-27 | Kiro AI | 初始版本，基于 requirements-v2.md 创建 |

---

## 1. 设计概述

### 1.1 设计目标

本设计文档定义了香蕉PS乐园从 Vite + React 单页应用迁移到 Next.js 15 App Router 的完整技术方案。设计遵循**渐进式迁移**理念，通过 4 个阶段（Phase 0-3）实现平滑过渡，确保每个阶段都可独立验证和回滚。

### 1.2 设计原则

1. **最小风险原则**: 每个阶段都保持应用可运行状态
2. **渐进式增强**: 从简单到复杂，从客户端到服务端
3. **功能一致性**: 迁移过程中功能、UI、交互保持完全一致
4. **可验证性**: 每个阶段都有明确的验证点和完成标准
5. **可回滚性**: 使用 Git 分支策略，任何阶段都可回滚
6. **未来扩展性**: 为 MKSAAS 集成预留架构接口

### 1.3 设计策略

```
Phase 0: 环境准备（1周）
  └─ 搭建 Next.js 项目骨架，配置工具链
  └─ 验证点：项目可启动，依赖安装成功

Phase 1: 最小化迁移 - Lift & Shift（2-3周）
  └─ 纯客户端渲染（CSR），功能完全一致
  └─ 验证点：应用可运行，所有功能正常
  └─ 理念："搬家不装修" - 原封不动搬到 Next.js

Phase 2: 服务端增强 - Next.js-ification（3-4周）
  └─ Server Actions，API 安全，性能优化
  └─ 验证点：API 密钥安全，性能提升
  └─ 理念："装修房子" - 使用 Next.js 高级功能

Phase 3: 架构预留与优化 - Future-Proofing（1-2周）
  └─ MKSAAS 架构预留，最终优化
  └─ 验证点：架构预留完成，性能达标
  └─ 理念："为未来做准备" - 预留扩展接口

总计：7-10周（符合需求文档的 7-8周目标）
```

### 1.4 技术栈对比

| 技术层 | 当前（Vite） | 目标（Next.js） | 迁移策略 |
|--------|-------------|----------------|---------|
| 框架 | Vite + React 19 | Next.js 15 + React 19 | Phase 0-1 |
| 路由 | React Router v6 | Next.js App Router | Phase 1 |
| 渲染 | 纯客户端（CSR） | SSR + CSR 混合 | Phase 2 |
| 状态管理 | Zustand | Zustand（保持） | Phase 1 |
| 样式 | Material Design 3 CSS | MD3 CSS（Phase 1）→ Tailwind（Phase 2+） | Phase 1 |
| 国际化 | 自定义 i18n Context | 自定义（Phase 1）→ next-intl（Phase 2+） | Phase 1 |
| API 调用 | 客户端直接调用 | Server Actions | Phase 2 |
| 数据存储 | localStorage | localStorage（Phase 1）→ Database（Phase 3+） | Phase 1 |

---

## 2. 系统架构设计

### 2.1 整体架构演进

#### 2.1.1 当前架构（Vite + React）

```
┌─────────────────────────────────────────────────────────┐
│                      浏览器（客户端）                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 应用（SPA）                                │  │
│  │  ├─ React Router（路由）                          │  │
│  │  ├─ Zustand（状态管理）                           │  │
│  │  ├─ Components（组件）                            │  │
│  │  ├─ localStorage（数据存储）                      │  │
│  │  └─ Gemini API 调用（直接调用，API Key 暴露）     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                    Gemini API
```

**问题**:
- ❌ API 密钥暴露在客户端
- ❌ 无 SEO 支持
- ❌ 首屏加载慢
- ❌ 无服务端渲染

---

#### 2.1.2 Phase 1 架构（Next.js CSR）

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 服务器                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js App Router（路由系统）                   │  │
│  │  └─ 所有页面标记为 'use client'（纯 CSR）         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      浏览器（客户端）                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 应用（与之前完全一致）                      │  │
│  │  ├─ Zustand（状态管理）                           │  │
│  │  ├─ Components（组件）                            │  │
│  │  ├─ localStorage（数据存储）                      │  │
│  │  └─ Gemini API 调用（暂时保持客户端调用）         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                    Gemini API
```

**改进**:
- ✅ 运行在 Next.js 环境中
- ✅ 使用 Next.js 路由系统
- ✅ 为后续优化打下基础

**保持不变**:
- 功能、UI、交互完全一致
- API 调用方式暂不改变（Phase 2 再优化）

---

#### 2.1.3 Phase 2 架构（Next.js SSR + Server Actions）

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 服务器                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App Router                                       │  │
│  │  ├─ Server Components（部分页面）                 │  │
│  │  └─ Client Components（交互组件）                 │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Server Actions（'use server'）                   │  │
│  │  ├─ editImageAction                               │  │
│  │  ├─ generateVideoAction                           │  │
│  │  ├─ generateImageInChatAction                     │  │
│  │  └─ ... (8个 API 函数)                            │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  环境变量（服务端）                                │  │
│  │  └─ GEMINI_API_KEY（安全存储）                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
                    Gemini API
                          ↑
┌─────────────────────────────────────────────────────────┐
│                      浏览器（客户端）                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 应用                                       │  │
│  │  ├─ Zustand（状态管理）                           │  │
│  │  ├─ Components（组件）                            │  │
│  │  ├─ localStorage（数据存储）                      │  │
│  │  └─ 调用 Server Actions（安全）                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**改进**:
- ✅ API 密钥完全隐藏在服务端
- ✅ 部分页面使用 SSR，改善 SEO
- ✅ 使用 Next.js Image、Font 等优化
- ✅ 性能显著提升

---

#### 2.1.4 Phase 3 架构（MKSAAS 预留）

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 服务器                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App Router + Server Actions                      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  抽象层（为 MKSAAS 预留）                          │  │
│  │  ├─ StorageAdapter（数据层抽象）                  │  │
│  │  ├─ UserContext（用户上下文）                     │  │
│  │  ├─ API 调用层抽象（配额预留）                     │  │
│  │  └─ 环境变量标准化                                │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  数据库 Schema（预留）                             │  │
│  │  └─ userId 字段 + JSONB metadata                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**改进**:
- ✅ 为 MKSAAS 集成预留接口
- ✅ 投入 5 天，节省未来 6-7 周
- ✅ ROI: 636-742%

---

### 2.2 目录结构设计

#### 2.2.1 Phase 0-1: 初始结构

```
nano-bananary-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局（'use client'）
│   ├── page.tsx                  # 主页 - 增强器（'use client'）
│   ├── chat/
│   │   └── page.tsx              # AI 对话页（'use client'）
│   ├── library/
│   │   └── page.tsx              # 资产库页（'use client'）
│   └── globals.css               # 全局样式（MD3）
│
├── components/                   # React 组件（100% 复用）
│   ├── common/                   # 通用组件
│   ├── features/                 # 功能组件
│   └── layout/                   # 布局组件
│
├── store/                        # Zustand 状态管理（100% 复用）
│   ├── enhancerStore.ts
│   ├── chatStore.ts
│   ├── assetLibraryStore.ts
│   └── uiStore.ts
│
├── lib/                          # 工具和服务
│   ├── services/                 # API 服务（Phase 1 保持客户端）
│   │   └── geminiService.ts
│   ├── utils/                    # 工具函数（100% 复用）
│   └── constants/                # 常量（100% 复用）
│
├── types/                        # TypeScript 类型（100% 复用）
│
├── i18n/                         # 国际化（Phase 1 保持现有）
│   ├── context.tsx
│   ├── zh.ts
│   └── en.ts
│
├── public/                       # 静态资源
│   └── assets/
│
├── .env.local                    # 环境变量
├── next.config.js                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json
```

---

#### 2.2.2 Phase 2: 添加 Server Actions

```
nano-bananary-nextjs/
├── app/
│   ├── actions/                  # ⭐ 新增：Server Actions
│   │   └── gemini.ts             # 'use server'
│   ├── api/                      # ⭐ 新增：API Routes（可选）
│   │   └── rate-limit/
│   ├── layout.tsx                # 移除 'use client'（部分）
│   ├── page.tsx                  # 混合 SSR + CSR
│   ├── loading.tsx               # ⭐ 新增：Loading UI
│   └── ...
│
├── lib/
│   ├── rate-limiter.ts           # ⭐ 新增：速率限制
│   └── ...
```

---

#### 2.2.3 Phase 3: MKSAAS 架构预留

```
nano-bananary-nextjs/
├── lib/
│   ├── storage/                  # ⭐ 新增：存储抽象层
│   │   ├── adapter.ts            # StorageAdapter 接口
│   │   ├── local-storage-adapter.ts
│   │   └── index.ts
│   ├── user-context.tsx          # ⭐ 新增：用户上下文
│   └── api/                      # ⭐ 新增：API 调用层抽象
│       └── image-api.ts
│
├── db/                           # ⭐ 新增：数据库 Schema
│   └── schema/
│       ├── assets.ts
│       └── user-preferences.ts
│
├── config/
│   └── env.ts                    # ⭐ 新增：环境变量验证
```

---

## 3. 分阶段实施设计

### Phase 0: 环境准备与基础设施（1周）

#### 3.0.1 阶段目标

搭建 Next.js 项目骨架，配置开发环境，不改动任何业务逻辑。

#### 3.0.2 技术任务

**Task 0.1: 项目初始化**
```bash
# 创建 Next.js 15 项目
npx create-next-app@latest nano-bananary-nextjs --typescript --app --no-src-dir

# 配置选项
✔ Would you like to use TypeScript? Yes
✔ Would you like to use ESLint? Yes
✔ Would you like to use Tailwind CSS? No (Phase 1 使用 MD3)
✔ Would you like to use `app/` directory? Yes
✔ Would you like to customize the default import alias? Yes (@/*)
```

**Task 0.2: 依赖迁移**
```json
// package.json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    
    // 保留现有依赖
    "zustand": "^4.x.x",
    "@google/generative-ai": "^x.x.x",
    "canvas-confetti": "^x.x.x",
    "lucide-react": "^x.x.x",
    
    // 移除 Vite 相关
    // "vite": "^x.x.x",  ❌ 移除
    // "react-router-dom": "^6.x.x",  ❌ 移除
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "eslint": "^8",
    "eslint-config-next": "^15"
  }
}
```

**Task 0.3: Next.js 配置**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片域名配置
  images: {
    domains: ['generativelanguage.googleapis.com'],
    unoptimized: true, // Phase 1 暂不优化
  },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: 'Nano Bananary',
  },
  
  // Webpack 配置（如果需要）
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
```

**Task 0.4: TypeScript 配置**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Task 0.5: 环境变量配置**
```bash
# .env.local
GEMINI_API_KEY=your_api_key_here

# .env.example（提交到 Git）
GEMINI_API_KEY=your_api_key_here
```

**Task 0.6: Git 分支策略**
```bash
# 创建分支
git checkout -b phase-0-setup
git checkout -b phase-1-lift-shift
git checkout -b phase-2-nextjs-ification
git checkout -b phase-3-future-proofing
```

#### 3.0.3 验收标准

- [ ] ✅ `npm run dev` 可以启动（即使是空页面）
- [ ] ✅ TypeScript 编译无错误
- [ ] ✅ 所有依赖安装成功
- [ ] ✅ 环境变量配置正确
- [ ] ✅ ESLint 配置正常
- [ ] ✅ Git 分支创建完成

#### 3.0.4 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 依赖冲突 | 20% | 中 | 使用 npm ls 检查依赖树 |
| 配置错误 | 15% | 低 | 参考官方文档 |
| 环境问题 | 10% | 低 | 使用 Node.js 20+ |

---

### Phase 1: 最小化迁移 - Lift & Shift（2-3周）

#### 3.1.1 阶段目标

让现有应用在 Next.js 环境中以纯客户端渲染（CSR）的模式完美运行。这是风险最低、最快看到成果的一步。

**核心理念**: "搬家不装修" - 把所有东西原封不动地搬到 Next.js 的房子里。

#### 3.1.2 Week 1: 文件结构迁移

**Task 1.1: 静态资源迁移**
```bash
# 迁移路径
src/assets/     → public/assets/
src/styles/     → app/styles/  (保持不变)

# 验证
- 所有图片可访问
- 所有字体可加载
- CSS 文件正常
```

**Task 1.2: 类型定义和工具函数迁移**
```bash
# 迁移路径（100% 复用）
src/types/      → types/
src/utils/      → lib/utils/
src/constants/  → lib/constants/

# 验证
- TypeScript 编译无错误
- 所有导入路径正确
- 工具函数测试通过
```

**Task 1.3: 组件迁移（关键！）**
```bash
# 迁移路径
src/components/ → components/
  ├── common/    → components/common/
  ├── features/  → components/features/
  └── layout/    → components/layout/
```

**策略**: 所有组件都标记为 'use client'（纯客户端渲染）

```typescript
// components/common/Button.tsx
'use client';  // ⭐ 关键：标记为客户端组件

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}
```

**验证点**:
- [ ] 每个组件单独测试
- [ ] 确保渲染正常
- [ ] Props 传递正确
- [ ] 事件处理正常

**Task 1.4: 状态管理迁移**
```bash
# 迁移路径（100% 复用）
src/store/      → store/
  ├── enhancerStore.ts
  ├── chatStore.ts
  ├── assetLibraryStore.ts
  └── uiStore.ts
```

**策略**: Zustand store 完全不改动

```typescript
// store/enhancerStore.ts
// ⭐ 无需任何修改，直接复制
import { create } from 'zustand';

interface EnhancerStore {
  // ... 保持原有代码不变
}

export const useEnhancerStore = create<EnhancerStore>((set, get) => ({
  // ... 保持原有代码不变
}));
```

**验证点**:
- [ ] 状态管理功能正常
- [ ] localStorage 持久化正常
- [ ] 所有 store 方法可用

**Task 1.5: 服务层迁移（临时方案）**
```bash
# 迁移路径（临时保持客户端调用）
src/services/   → lib/services/
src/lib/        → lib/
```

**策略**: 暂时保持客户端 API 调用（Phase 2 再迁移到服务端）

```typescript
// lib/services/geminiService.ts
// ⭐ Phase 1: 保持客户端调用（虽然不安全，但功能正常）
import { GoogleGenerativeAI } from '@google/generative-ai';

// 客户端环境变量（Phase 1 临时方案）
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

export async function editImage(prompt: string, images: any[], mask: any) {
  // ... 保持原有代码不变
}
```

**验证点**:
- [ ] API 调用正常
- [ ] 错误处理正常
- [ ] 所有服务方法可用

---

#### 3.1.3 Week 1-2: 路由系统迁移

**Task 1.6: 创建页面文件**

```typescript
// app/layout.tsx
'use client';  // ⭐ 关键：整个应用都是客户端渲染

import '@/app/styles/globals.css';
import { I18nProvider } from '@/i18n/context';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <I18nProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
```

```typescript
// app/page.tsx
'use client';

import { ImageEnhancer } from '@/components/features/ImageEnhancer';

export default function HomePage() {
  return <ImageEnhancer />;
}
```

```typescript
// app/chat/page.tsx
'use client';

import { AIChat } from '@/components/features/AIChat';

export default function ChatPage() {
  return <AIChat />;
}
```

```typescript
// app/library/page.tsx
'use client';

import { AssetLibrary } from '@/components/features/AssetLibrary';

export default function LibraryPage() {
  return <AssetLibrary />;
}
```

**Task 1.7: 路由导航替换**

创建迁移脚本：
```typescript
// scripts/migrate-router.ts
// 全局搜索替换规则

// 1. 导入语句替换
import { useNavigate, useLocation, Link } from 'react-router-dom';
// 替换为 ↓
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// 2. Hook 替换
const navigate = useNavigate();
// 替换为 ↓
const router = useRouter();

// 3. 导航方法替换
navigate('/chat')
// 替换为 ↓
router.push('/chat')

navigate(-1)
// 替换为 ↓
router.back()

// 4. 位置获取替换
const location = useLocation();
const pathname = location.pathname;
// 替换为 ↓
const pathname = usePathname();

// 5. Link 组件替换
<Link to="/chat">Chat</Link>
// 替换为 ↓
<Link href="/chat">Chat</Link>
```

**验证点**:
- [ ] 所有页面可以访问
- [ ] 页面间导航正常
- [ ] URL 结构与之前一致
- [ ] 浏览器前进/后退按钮正常
- [ ] 路由参数传递正常

---

#### 3.1.4 Week 2: 国际化迁移

**Task 1.8: 保持现有 i18n 系统**

**策略**: Phase 1 完全保持现有方案

```typescript
// i18n/context.tsx
// ⭐ 无需任何修改，直接复制
'use client';  // 添加这一行

import { createContext, useContext, useState, useEffect } from 'react';
import { zh } from './zh';
import { en } from './en';

// ... 保持原有代码不变
```

```typescript
// i18n/zh.ts
// ⭐ 无需任何修改，直接复制
export const zh = {
  app: {
    title: '香蕉PS乐园',
    // ... 370+ 条翻译保持不变
  }
};
```

**验证点**:
- [ ] 语言切换正常
- [ ] 所有翻译显示正确
- [ ] localStorage 语言偏好持久化正常
- [ ] 页面刷新后语言保持

---

#### 3.1.5 Week 2: 样式系统迁移

**Task 1.9: 保持 Material Design 3 样式**

**策略**: 在根布局中导入全局样式

```typescript
// app/layout.tsx
'use client';

import '@/app/styles/globals.css';  // ⭐ Material Design 3 样式

// ... 其他代码
```

```css
/* app/styles/globals.css */
/* ⭐ 无需任何修改，直接复制 */

:root {
  /* Material Design 3 CSS 变量 */
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  /* ... 100+ 个 CSS 变量保持不变 */
}

/* ... 2000+ 行 CSS 保持不变 */
```

**验证点**:
- [ ] 所有页面样式正常
- [ ] 无样式闪烁（FOUC）
- [ ] 响应式布局正常
- [ ] 主题切换正常
- [ ] 动画效果正常

---

#### 3.1.6 Week 3: 完整功能验证

**Task 1.10: 端到端测试**

**验证清单**:

**功能验证**:
- [ ] ✅ 86 种图像效果全部正常
  - [ ] 基础效果（像素化、模糊等）
  - [ ] 艺术效果（油画、水彩等）
  - [ ] 风格迁移效果
  - [ ] 高级效果（HDR、去噪等）

- [ ] ✅ AI 对话功能正常
  - [ ] 文本对话
  - [ ] 图像上传
  - [ ] 多模态对话
  - [ ] 历史记录

- [ ] ✅ 资产库功能正常
  - [ ] 图片列表显示
  - [ ] 图片上传
  - [ ] 图片删除
  - [ ] 图片下载
  - [ ] 批量操作

- [ ] ✅ 蒙版编辑器正常
  - [ ] 画笔工具
  - [ ] 橡皮擦工具
  - [ ] 清除功能
  - [ ] 蒙版预览

- [ ] ✅ 视频生成功能正常
  - [ ] 文本生成视频
  - [ ] 图像生成视频
  - [ ] 进度显示
  - [ ] 视频预览

**UI/UX 验证**:
- [ ] ✅ 语言切换正常（中英文）
- [ ] ✅ 主题切换正常（亮色/暗色）
- [ ] ✅ 响应式布局正常（手机/平板/桌面）
- [ ] ✅ 加载状态显示正常
- [ ] ✅ 错误提示友好

**数据持久化验证**:
- [ ] ✅ localStorage 数据保存正常
- [ ] ✅ 页面刷新后数据保持
- [ ] ✅ 浏览器关闭后数据保持
- [ ] ✅ 用户设置保存正常

**性能验证**:
- [ ] ✅ 页面加载速度与之前相当
- [ ] ✅ 无明显性能下降
- [ ] ✅ 内存使用正常
- [ ] ✅ 无内存泄漏

**兼容性验证**:
- [ ] ✅ Chrome 浏览器正常
- [ ] ✅ Firefox 浏览器正常
- [ ] ✅ Safari 浏览器正常
- [ ] ✅ Edge 浏览器正常
- [ ] ✅ 移动端浏览器正常

#### 3.1.7 Phase 1 完成标准

```
✅ 应用由 npm run dev 启动
✅ 运行在 Next.js 开发服务器上
✅ 功能、UI 和交互与之前完全一致
✅ 所有 86 种图像效果正常
✅ AI 对话功能完整
✅ 资产库功能完整
✅ 蒙版编辑器正常
✅ 视频生成正常
✅ 双语支持正常
✅ 主题切换正常
✅ 所有测试通过
✅ 无控制台错误
✅ 性能与之前相当（不要求提升）
✅ 代码复用率 > 80%
```

#### 3.1.8 Phase 1 的关键决策

**✅ 要做的**:
- ✅ 所有组件标记为 'use client'
- ✅ 100% 复用 Zustand store
- ✅ 100% 复用工具函数和类型
- ✅ 100% 复用翻译文件
- ✅ 100% 复用 MD3 样式
- ✅ 保持 localStorage 存储
- ✅ 保持客户端 API 调用（临时）

**❌ 不做的**:
- ❌ 不迁移到 Server Actions
- ❌ 不优化性能
- ❌ 不改变任何业务逻辑
- ❌ 不引入新的依赖
- ❌ 不重构组件结构
- ❌ 不修改数据流

**理念**: "搬家不装修" - 只是让应用在 Next.js 中运行起来

---

### Phase 2: 服务端增强 - Next.js-ification（3-4周）

#### 3.2.1 阶段目标

将核心业务逻辑迁移到服务端，发挥 Next.js 的最大优势——安全性和性能。

**核心理念**: "装修房子" - 开始使用 Next.js 的高级功能。

#### 3.2.2 Week 4-5: API 安全迁移

**Task 2.1: 创建 Server Actions**

```typescript
// app/actions/gemini.ts
'use server';  // ⭐ 关键：服务端函数

import { GoogleGenerativeAI } from '@google/genai';

// API 密钥只在服务端访问
const ai = new GoogleGenerativeAI({ 
  apiKey: process.env.GEMINI_API_KEY  // 服务端环境变量，不暴露
});

/**
 * 图像编辑 Server Action
 */
export async function editImageAction(
  prompt: string,
  imageParts: { base64: string; mimeType: string }[],
  maskBase64: string | null
) {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
          ...imageParts.map(img => ({
            inlineData: { data: img.base64, mimeType: img.mimeType }
          })),
          ...(maskBase64 ? [{
            inlineData: { data: maskBase64, mimeType: 'image/png' }
          }] : [])
        ]
      },
      config: { responseModalities: ['IMAGE'] }
    });
    
    return {
      success: true,
      imageUrl: result.imageUrl,
      text: result.text
    };
  } catch (error) {
    console.error('Image generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '生成失败'
    };
  }
}
```

**Task 2.2: 迁移 8 个核心 API（优先级顺序）**

```
优先级顺序（从简单到复杂）:
1. preprocessPromptAction          (简单：纯文本处理)
2. getTransformationSuggestionsAction (简单：文本生成)
3. generateImageFromTextAction     (中等：文本生成图像)
4. generateStyleMimicImageAction   (中等：风格迁移)
5. editImageAction                 (复杂：图像编辑)
6. generateVideoAction             (复杂：视频生成)
7. generateImageInChatAction       (复杂：多模态对话)
8. generateImageEditsBatchAction   (复杂：批量处理)
```

**Task 2.3: 更新 Store 调用**

```typescript
// store/enhancerStore.ts
'use client';
import { editImageAction, generateVideoAction } from '@/app/actions/gemini';

export const useEnhancerStore = create<EnhancerStore>((set, get) => ({
  generateImage: async () => {
    set({ isGenerating: true, error: null });
    
    try {
      const { prompt, images, mask } = get();
      
      // ⭐ 调用 Server Action（像调用普通函数一样）
      const result = await editImageAction(
        prompt,
        images.map(img => ({ base64: img.data, mimeType: img.type })),
        mask?.data || null
      );
      
      if (result.success) {
        set({ 
          generatedContent: {
            imageUrl: result.imageUrl,
            text: result.text
          }
        });
      } else {
        set({ error: result.error });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '未知错误' });
    } finally {
      set({ isGenerating: false });
    }
  }
}));
```

**Task 2.4: 实现请求速率限制**

```typescript
// lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 每分钟 10 次
  analytics: true,
  prefix: 'ratelimit'
});
```

```typescript
// app/actions/gemini.ts
'use server';
import { rateLimiter } from '@/lib/rate-limiter';

export async function editImageAction(...) {
  // ⭐ 速率限制检查
  const identifier = 'anonymous'; // Phase 2: 匿名用户
  const { success } = await rateLimiter.limit(identifier);
  
  if (!success) {
    return { 
      success: false, 
      error: '请求过于频繁，请稍后再试' 
    };
  }
  
  // 继续处理...
}
```

**验证点**:
- [ ] API 密钥不在客户端代码中
- [ ] 所有 API 调用正常
- [ ] 错误处理正常
- [ ] 速率限制生效
- [ ] 性能无明显下降

---

#### 3.2.3 Week 5-6: 性能优化

**Task 2.5: 图片优化**

```typescript
// 替换所有 <img> 为 next/image
import Image from 'next/image';

// Before
<img src="/assets/logo.png" alt="Logo" />

// After
<Image 
  src="/assets/logo.png"
  width={200}
  height={200}
  alt="Logo"
  priority  // 首屏图片
/>
```

**Task 2.6: 字体优化**

```typescript
// app/layout.tsx
import { Inter, Noto_Sans_SC } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['chinese-simplified'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-sc'
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${notoSansSC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Task 2.7: 代码分割优化**

```typescript
// 动态导入大组件
import dynamic from 'next/dynamic';

const ImageEditor = dynamic(() => import('@/components/ImageEditor'), {
  loading: () => <LoadingSpinner />,
  ssr: false  // 客户端组件
});

const Canvas = dynamic(() => import('@/components/Canvas'), {
  loading: () => <CanvasSkeleton />,
  ssr: false
});
```

**Task 2.8: Metadata 优化**

```typescript
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '香蕉PS乐园 - AI 图像编辑器',
  description: '使用 AI 技术进行图像编辑和增强，支持 86 种图像效果',
  keywords: ['AI', '图像编辑', 'Gemini', '图像增强'],
  openGraph: {
    title: '香蕉PS乐园',
    description: '使用 AI 技术进行图像编辑和增强',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '香蕉PS乐园',
    description: '使用 AI 技术进行图像编辑和增强',
  },
};
```

**Task 2.9: Streaming 支持**

```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <LoadingSpinner />
      <p>加载中...</p>
    </div>
  );
}

// app/chat/loading.tsx
export default function ChatLoading() {
  return <ChatLoadingSkeleton />;
}
```

```typescript
// 使用 Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Suspense fallback={<EffectsListSkeleton />}>
        <EffectsList />
      </Suspense>
      
      <Suspense fallback={<EditorSkeleton />}>
        <ImageEditor />
      </Suspense>
    </div>
  );
}
```

**验证点**:
- [ ] Lighthouse 性能分数 > 90
- [ ] 首屏加载时间 < 2秒
- [ ] TTFB < 600ms
- [ ] 图片加载优化明显
- [ ] 字体加载无闪烁

---

#### 3.2.4 Week 6-7: SSR/SSG 页面优化

**Task 2.10: 识别需要 SSR/SSG 的页面**

```
- 首页（增强器页面）- SSG（静态生成）
- 资产库页面 - CSR（用户数据，保持客户端）
- 聊天页面 - CSR（用户数据，保持客户端）
```

**Task 2.11: 移除不必要的 'use client'**

```typescript
// app/page.tsx
// ⭐ 移除 'use client'，改为混合模式
import { Metadata } from 'next';
import { ImageEditorClient } from '@/components/ImageEditorClient';

export const metadata: Metadata = {
  // ... metadata
};

// Server Component（默认）
export default function HomePage() {
  // 服务端可以做一些数据准备
  const effects = getEffectsList(); // 静态数据
  
  return (
    <div>
      <h1>香蕉PS乐园</h1>
      {/* 传递静态数据给客户端组件 */}
      <ImageEditorClient effects={effects} />
    </div>
  );
}
```

```typescript
// components/ImageEditorClient.tsx
'use client';  // 只有需要交互的部分是客户端组件

export function ImageEditorClient({ effects }) {
  // 客户端交互逻辑
  return <div>...</div>;
}
```

**Task 2.12: 部分 Server Components 迁移**

```
可以改为 Server Component 的组件:
- TransformationList（效果列表 - 静态数据）
- Footer（页脚 - 静态内容）
- Header（部分静态内容）

必须保持 Client Component 的组件:
- ImageEditor（需要交互）
- Canvas（需要交互）
- AssetGallery（需要交互）
- Chat（需要交互）
```

**验证点**:
- [ ] 查看页面源代码，HTML 中包含完整内容
- [ ] SEO 分数 > 90
- [ ] 所有交互功能正常
- [ ] 无水合错误
- [ ] 客户端 JavaScript 减少 10-20%

---

#### 3.2.5 Phase 2 完成标准

```
✅ API 密钥完全保护
✅ 所有 API 调用在服务端
✅ 8 个 API 函数全部迁移
✅ 请求速率限制生效
✅ Lighthouse 性能分数 > 90
✅ 首屏加载时间 < 2秒
✅ TTFB < 600ms
✅ SEO 分数 > 90
✅ 图片加载优化
✅ 字体加载优化
✅ 代码分割优化
✅ Metadata 完整
✅ Streaming 支持
✅ 部分 SSR/SSG 实现
✅ 所有功能正常
```

---

### Phase 3: 架构预留与优化 - Future-Proofing（1-2周）

#### 3.3.1 阶段目标

为 MKSAAS 集成预留架构接口，进行最终优化和测试。

**核心理念**: "为未来做准备" - 预留扩展接口，投入 5 天，节省未来 6-7 周。

#### 3.3.2 Week 8: MKSAAS 架构预留（Day 1-5）

**Task 3.1: 数据层抽象（Day 1，8小时）**

```typescript
// lib/storage/adapter.ts
export interface StorageAdapter {
  // 资产管理
  saveAsset(asset: Asset): Promise<string>;
  getAssets(userId: string, filters?: AssetFilters): Promise<Asset[]>;
  deleteAsset(id: string): Promise<void>;
  updateAsset(id: string, updates: Partial<Asset>): Promise<void>;
  
  // 用户偏好
  savePreferences(userId: string, prefs: UserPreferences): Promise<void>;
  getPreferences(userId: string): Promise<UserPreferences>;
}

export interface Asset {
  id: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  prompt?: string;
  effect?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetFilters {
  type?: 'image' | 'video';
  startDate?: Date;
  endDate?: Date;
  effect?: string;
}
```

```typescript
// lib/storage/local-storage-adapter.ts
export class LocalStorageAdapter implements StorageAdapter {
  private readonly ASSETS_KEY = 'nano_bananary_assets';
  private readonly PREFS_KEY_PREFIX = 'nano_bananary_prefs_';
  
  async saveAsset(asset: Asset): Promise<string> {
    const assets = this.getAssetsFromStorage();
    assets.push(asset);
    localStorage.setItem(this.ASSETS_KEY, JSON.stringify(assets));
    return asset.id;
  }
  
  async getAssets(userId: string, filters?: AssetFilters): Promise<Asset[]> {
    let assets = this.getAssetsFromStorage();
    assets = assets.filter(a => a.userId === userId);
    
    if (filters?.type) {
      assets = assets.filter(a => a.type === filters.type);
    }
    
    if (filters?.effect) {
      assets = assets.filter(a => a.effect === filters.effect);
    }
    
    return assets;
  }
  
  async deleteAsset(id: string): Promise<void> {
    const assets = this.getAssetsFromStorage();
    const filtered = assets.filter(a => a.id !== id);
    localStorage.setItem(this.ASSETS_KEY, JSON.stringify(filtered));
  }
  
  async updateAsset(id: string, updates: Partial<Asset>): Promise<void> {
    const assets = this.getAssetsFromStorage();
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(this.ASSETS_KEY, JSON.stringify(assets));
    }
  }
  
  async savePreferences(userId: string, prefs: UserPreferences): Promise<void> {
    localStorage.setItem(
      `${this.PREFS_KEY_PREFIX}${userId}`,
      JSON.stringify(prefs)
    );
  }
  
  async getPreferences(userId: string): Promise<UserPreferences> {
    const stored = localStorage.getItem(`${this.PREFS_KEY_PREFIX}${userId}`);
    return stored ? JSON.parse(stored) : this.getDefaultPreferences();
  }
  
  private getAssetsFromStorage(): Asset[] {
    const stored = localStorage.getItem(this.ASSETS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      language: 'en',
      defaultAspectRatio: 'Auto',
      autoSaveAssets: true
    };
  }
}
```

```typescript
// lib/storage/index.ts
import { StorageAdapter } from './adapter';
import { LocalStorageAdapter } from './local-storage-adapter';

// Phase 2: 使用 localStorage
export const storage: StorageAdapter = new LocalStorageAdapter();

// Phase 3 MKSAAS: 切换到数据库（只需改这一行）
// import { DatabaseAdapter } from './database-adapter';
// export const storage: StorageAdapter = new DatabaseAdapter();
```

**验证点**:
- [ ] StorageAdapter 接口定义清晰
- [ ] LocalStorageAdapter 实现完整
- [ ] 所有数据操作通过适配器
- [ ] 功能正常
- [ ] 预留接口清晰

---

**Task 3.2: 用户上下文预留（Day 2，4小时）**

```typescript
// types/user.ts
export interface UserContext {
  id: string;  // Phase 2: session ID, Phase 3 MKSAAS: real userId
  isAnonymous: boolean;
  email?: string;  // Phase 3 MKSAAS 添加
  plan?: 'free' | 'pro' | 'lifetime';  // Phase 3 MKSAAS 添加
  credits?: number;  // Phase 3 MKSAAS 添加
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'zh';
  defaultEffect?: string;
  defaultAspectRatio: string;
  autoSaveAssets: boolean;
}
```

```typescript
// lib/user-context.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserContext, UserSettings } from '@/types/user';
import { storage } from '@/lib/storage';

const UserContextInstance = createContext<UserContext | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContext | null>(null);
  
  useEffect(() => {
    // Phase 2: 创建匿名用户
    const sessionId = getOrCreateSessionId();
    
    storage.getPreferences(sessionId).then(settings => {
      setUser({
        id: sessionId,
        isAnonymous: true,
        settings
      });
    });
    
    // Phase 3 MKSAAS: 从认证系统获取真实用户（预留代码，注释）
    // const loadUser = async () => {
    //   const session = await auth.api.getSession();
    //   if (session) {
    //     const settings = await storage.getPreferences(session.user.id);
    //     setUser({
    //       id: session.user.id,
    //       isAnonymous: false,
    //       email: session.user.email,
    //       plan: session.user.plan,
    //       credits: session.user.credits,
    //       settings
    //     });
    //   }
    // };
    // loadUser();
  }, []);
  
  if (!user) {
    return <LoadingSpinner />;
  }
  
  return (
    <UserContextInstance.Provider value={user}>
      {children}
    </UserContextInstance.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContextInstance);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('nano_bananary_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('nano_bananary_session_id', sessionId);
  }
  return sessionId;
}
```

**验证点**:
- [ ] UserContext 接口定义清晰
- [ ] UserProvider 正常工作
- [ ] useUser hook 可用
- [ ] 预留代码清晰（注释）
- [ ] 功能正常

---

**Task 3.3: API 调用层抽象（Day 3，8小时）**

```typescript
// lib/api/image-api.ts
import { editImageAction, generateVideoAction } from '@/app/actions/gemini';
import { storage } from '@/lib/storage';
import { Asset } from '@/types/user';

export interface ImageGenerationParams {
  prompt: string;
  effect?: string;
  userId?: string;  // Phase 2: 可选, Phase 3 MKSAAS: 必填
  images?: string[];
  mask?: string;
  aspectRatio?: string;
}

export interface ImageGenerationResult {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata: {
    prompt: string;
    effect?: string;
    generationTime: number;
  };
}

export async function generateImage(
  params: ImageGenerationParams
): Promise<ImageGenerationResult> {
  // Phase 2: 直接调用
  const startTime = Date.now();
  
  const result = await editImageAction(
    params.prompt,
    params.images?.map(img => ({ base64: img, mimeType: 'image/png' })) || [],
    params.mask || null
  );
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  const generationTime = Date.now() - startTime;
  
  // Phase 3 MKSAAS: 添加配额检查（预留代码，注释）
  // if (params.userId) {
  //   await checkQuota(params.userId, 'image_generation', 1);
  //   await recordUsage(params.userId, 'image_generation', 1, {
  //     effect: params.effect,
  //     generationTime
  //   });
  // }
  
  // 保存到存储
  const asset: Asset = {
    id: crypto.randomUUID(),
    userId: params.userId || 'anonymous',
    type: 'image',
    url: result.imageUrl!,
    prompt: params.prompt,
    effect: params.effect,
    metadata: {
      generationTime
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await storage.saveAsset(asset);
  
  return {
    id: asset.id,
    url: asset.url,
    metadata: {
      prompt: params.prompt,
      effect: params.effect,
      generationTime
    }
  };
}

// Phase 3 MKSAAS: 配额管理函数（预留接口定义）
// async function checkQuota(
//   userId: string,
//   action: string,
//   cost: number
// ): Promise<void> {
//   const credits = await getUserCredits(userId);
//   if (credits < cost) {
//     throw new Error('INSUFFICIENT_CREDITS');
//   }
// }

// async function recordUsage(
//   userId: string,
//   action: string,
//   cost: number,
//   metadata?: any
// ): Promise<void> {
//   await consumeCredits(userId, cost);
//   await db.insert(usageLogs).values({
//     userId,
//     action,
//     creditsUsed: cost,
//     details: metadata
//   });
// }
```

**验证点**:
- [ ] 统一的 API 接口
- [ ] 预留代码清晰（注释）
- [ ] 功能正常
- [ ] 错误处理完整

---

**Task 3.4: 数据库表设计预留（Day 4-5，16小时）**

```typescript
// db/schema/assets.ts
import { pgTable, uuid, text, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';

export const assets = pgTable('assets', {
  // 主键
  id: uuid('id').primaryKey().defaultRandom(),
  
  // 🔑 关键：预留 userId 字段
  // Phase 2: nullable, Phase 3 MKSAAS: NOT NULL + FK
  userId: uuid('user_id'),
  
  // 资产信息
  type: text('type').notNull(),  // 'image' | 'video'
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  
  // 生成信息
  prompt: text('prompt'),
  effect: text('effect'),
  
  // 🔑 关键：使用 JSONB 存储灵活数据
  metadata: jsonb('metadata').$type<{
    width?: number;
    height?: number;
    fileSize?: number;
    mimeType?: string;
    aspectRatio?: string;
    generationTime?: number;
    aiModel?: string;
    // Phase 3 MKSAAS 可以添加更多字段，无需修改表结构
    creditsUsed?: number;
    subscriptionTier?: string;
  }>(),
  
  // 统计（可选）
  viewCount: integer('view_count').default(0),
  downloadCount: integer('download_count').default(0),
  
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),  // 软删除
}, (table) => ({
  // 索引（提前规划）
  userIdIdx: index('assets_user_id_idx').on(table.userId),
  createdAtIdx: index('assets_created_at_idx').on(table.createdAt),
  typeIdx: index('assets_type_idx').on(table.type),
}));

// TypeScript 类型推导
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
```

```typescript
// db/schema/user-preferences.ts
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),  // 现在可以用 session ID，未来用真实 userId
  
  // UI 偏好
  theme: text('theme').default('light'),
  language: text('language').default('en'),
  
  // 业务偏好
  defaultEffect: text('default_effect'),
  defaultAspectRatio: text('default_aspect_ratio').default('Auto'),
  autoSaveAssets: boolean('auto_save_assets').default(true),
  
  // 通知偏好（Phase 3 MKSAAS 使用）
  emailNotifications: boolean('email_notifications').default(true),
  
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**数据库选择**: **Neon PostgreSQL**（与 MKSAAS 完全兼容）

**验证点**:
- [ ] Schema 设计合理
- [ ] 使用 UUID
- [ ] 使用 JSONB
- [ ] 预留 userId
- [ ] 索引设计合理

---

**Task 3.5: 环境变量标准化（Day 5，2小时）**

```bash
# .env.example

# ============================================
# 数据库配置（Phase 2 需要）
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/dbname

# ============================================
# AI 服务配置（Phase 2 需要）
# ============================================
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # 可选

# ============================================
# 文件存储配置（Phase 2 需要）
# ============================================
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket.r2.dev

# ============================================
# 速率限制配置（Phase 2 需要）
# ============================================
UPSTASH_REDIS_URL=your_redis_url
UPSTASH_REDIS_TOKEN=your_redis_token

# ============================================
# 应用配置
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Nano Bananary"

# ============================================
# 认证配置（Phase 3 MKSAAS 需要，现在预留）
# ============================================
# BETTER_AUTH_SECRET=
# BETTER_AUTH_URL=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=

# ============================================
# 支付配置（Phase 3 MKSAAS 需要，现在预留）
# ============================================
# STRIPE_SECRET_KEY=
# STRIPE_PUBLISHABLE_KEY=
# STRIPE_WEBHOOK_SECRET=

# ============================================
# 邮件配置（Phase 3 MKSAAS 需要，现在预留）
# ============================================
# RESEND_API_KEY=

# ============================================
# 分析配置（可选）
# ============================================
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_UMAMI_ID=
```

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Phase 2 需要的变量
  DATABASE_URL: z.string().url().optional(),
  GEMINI_API_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Nano Bananary'),
  
  // Phase 3 MKSAAS 需要的变量（optional）
  BETTER_AUTH_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

**验证点**:
- [ ] 命名规范正确
- [ ] 预留变量清晰
- [ ] 类型验证正常
- [ ] 文档完整

---

#### 3.3.3 Week 9: 最终优化与测试（Day 6-10）

**Task 3.6: 完整回归测试**

参考 Phase 1.5 的验证清单，进行完整的端到端测试。

**Task 3.7: 性能测试和优化**

```bash
# Lighthouse 测试
npm run build
npm run start
# 使用 Chrome DevTools Lighthouse 测试

# Bundle 分析
npm run build
npm run analyze
```

**目标**:
- [ ] Lighthouse 性能分数 > 90
- [ ] Lighthouse SEO 分数 > 90
- [ ] 首屏加载时间 < 2秒
- [ ] TTFB < 600ms
- [ ] Bundle 大小合理

**Task 3.8: 安全审计**

```bash
# 依赖漏洞扫描
npm audit

# 修复高危漏洞
npm audit fix

# TypeScript 类型检查
npm run type-check

# ESLint 检查
npm run lint
```

**Task 3.9: 代码审查**

- [ ] 代码复用率 > 80%
- [ ] TypeScript 覆盖率 100%
- [ ] 无 console.log
- [ ] 无 TODO 注释
- [ ] 代码格式统一

**Task 3.10: 文档更新**

- [ ] README.md 更新
- [ ] 环境变量文档
- [ ] 部署文档
- [ ] 开发指南
- [ ] API 文档

#### 3.3.4 Phase 3 完成标准

```
✅ 所有架构预留完成
  ✅ StorageAdapter 接口实现
  ✅ UserContext 接口实现
  ✅ API 调用层抽象实现
  ✅ 数据库表设计预留
  ✅ 环境变量标准化
✅ 所有功能正常
✅ 性能指标达标
  ✅ Lighthouse 性能 > 90
  ✅ Lighthouse SEO > 90
  ✅ 首屏加载 < 2秒
  ✅ TTFB < 600ms
✅ 安全指标达标
  ✅ API 密钥安全
  ✅ 无高危漏洞
  ✅ 速率限制生效
✅ 代码质量达标
  ✅ 代码复用率 > 80%
  ✅ TypeScript 覆盖率 100%
  ✅ 测试覆盖率 > 70%
✅ 文档完整
✅ 准备好进入 Phase 2（Tailwind CSS）或 Phase 3（MKSAAS）
```

---


## 4. 技术决策与权衡

### 4.1 关键技术决策

#### 4.1.1 为什么选择渐进式迁移？

**决策**: 采用 4 阶段渐进式迁移，而非一次性重写

**理由**:
- ✅ **风险最小化**: 每个阶段独立验证，可随时回滚
- ✅ **持续交付**: 每个阶段都有可用的产品
- ✅ **学习曲线**: 团队逐步学习 Next.js 特性
- ✅ **代码复用**: 80%+ 代码可复用，节省时间

**权衡**:
- ❌ 总时间较长（7-10周 vs 4-5周一次性重写）
- ✅ 但风险更低，质量更高

---

#### 4.1.2 为什么 Phase 1 使用纯 CSR？

**决策**: Phase 1 所有组件标记为 'use client'，保持纯客户端渲染

**理由**:
- ✅ **最小改动**: 只需改路由，其他代码 100% 复用
- ✅ **快速验证**: 2-3周即可看到成果
- ✅ **功能一致**: 与原应用完全一致
- ✅ **降低风险**: 不涉及 SSR 的复杂性

**权衡**:
- ❌ 暂时无法享受 SSR 的 SEO 优势
- ✅ 但为 Phase 2 打下基础

---

#### 4.1.3 为什么 Phase 1 保持客户端 API 调用？

**决策**: Phase 1 暂时保持客户端 API 调用，Phase 2 再迁移到 Server Actions

**理由**:
- ✅ **最小改动**: 服务层代码 100% 复用
- ✅ **快速验证**: 不需要重写 API 调用逻辑
- ✅ **降低风险**: 一次只改一件事

**权衡**:
- ❌ API 密钥暂时暴露（Phase 1 临时问题）
- ✅ Phase 2 会完全解决

---

#### 4.1.4 为什么选择 Zustand 而非 Redux？

**决策**: 保持使用 Zustand，不迁移到 Redux 或其他状态管理

**理由**:
- ✅ **已有投入**: 现有代码已使用 Zustand
- ✅ **简单高效**: Zustand 比 Redux 更简单
- ✅ **Next.js 兼容**: Zustand 与 Next.js 完美兼容
- ✅ **无需改动**: 100% 复用现有 store

**权衡**:
- ❌ 无（Zustand 是最佳选择）

---

#### 4.1.5 为什么 Phase 1 保持 Material Design 3？

**决策**: Phase 1 保持 MD3 CSS，Phase 2+ 可选迁移到 Tailwind

**理由**:
- ✅ **已有投入**: 2000+ 行 MD3 CSS
- ✅ **设计一致**: 保持现有设计系统
- ✅ **无需改动**: 100% 复用现有样式
- ✅ **降低风险**: 一次只改一件事

**权衡**:
- ❌ 暂时无法享受 Tailwind 的便利
- ✅ Phase 2+ 可选迁移

---

#### 4.1.6 为什么 Phase 1 保持自定义 i18n？

**决策**: Phase 1 保持自定义 i18n Context，Phase 2+ 可选迁移到 next-intl

**理由**:
- ✅ **已有投入**: 370+ 条翻译
- ✅ **功能完整**: 现有方案满足需求
- ✅ **无需改动**: 100% 复用现有代码
- ✅ **降低风险**: 一次只改一件事

**权衡**:
- ❌ 暂时无法享受 next-intl 的 SSR 优势
- ✅ Phase 2+ 可选迁移

---

#### 4.1.7 为什么选择 Neon PostgreSQL？

**决策**: Phase 3 使用 Neon PostgreSQL 作为数据库

**理由**:
- ✅ **MKSAAS 兼容**: MKSAAS 使用 Neon
- ✅ **Serverless**: 无需管理服务器
- ✅ **免费额度**: 开发阶段免费
- ✅ **性能优秀**: 低延迟，高可用

**权衡**:
- ❌ 无（Neon 是最佳选择）

---

#### 4.1.8 为什么使用 Drizzle ORM？

**决策**: Phase 3 使用 Drizzle ORM 而非 Prisma

**理由**:
- ✅ **MKSAAS 兼容**: MKSAAS 使用 Drizzle
- ✅ **类型安全**: 完整的 TypeScript 支持
- ✅ **性能优秀**: 比 Prisma 更快
- ✅ **灵活性**: 更接近 SQL

**权衡**:
- ❌ 学习曲线略高
- ✅ 但长期收益更大

---

### 4.2 技术栈选择矩阵

| 技术层 | 选项 A | 选项 B | 选择 | 理由 |
|--------|--------|--------|------|------|
| 框架 | Next.js 15 | Remix | Next.js | 生态更成熟，文档更完善 |
| 路由 | App Router | Pages Router | App Router | 未来方向，更强大 |
| 状态管理 | Zustand | Redux | Zustand | 更简单，已有投入 |
| 样式 | Tailwind | MD3 CSS | MD3 (Phase 1) | 保持一致，降低风险 |
| 国际化 | next-intl | 自定义 | 自定义 (Phase 1) | 已有投入，降低风险 |
| 数据库 | Neon | Supabase | Neon | MKSAAS 兼容 |
| ORM | Drizzle | Prisma | Drizzle | MKSAAS 兼容，性能更好 |
| 认证 | Better Auth | NextAuth | Better Auth | MKSAAS 兼容 |
| 文件存储 | Cloudflare R2 | AWS S3 | R2 | 更便宜，更快 |
| 速率限制 | Upstash | Redis | Upstash | Serverless，易用 |

---

## 5. 风险管理

### 5.1 风险识别与缓解

| 风险 | 概率 | 影响 | 缓解措施 | 应急方案 |
|------|------|------|---------|---------|
| **Phase 1: 依赖冲突** | 20% | 中 | 使用 npm ls 检查依赖树 | 降级依赖版本 |
| **Phase 1: 路由迁移错误** | 15% | 高 | 创建迁移脚本，逐个测试 | 回滚到 React Router |
| **Phase 1: 组件渲染问题** | 10% | 中 | 逐个组件测试 | 修复或回滚 |
| **Phase 2: Server Actions 错误** | 25% | 高 | 充分测试，错误处理 | 回退到客户端调用 |
| **Phase 2: 性能下降** | 15% | 中 | 性能监控，优化 | 回滚优化 |
| **Phase 2: API 速率限制问题** | 10% | 低 | 测试限流逻辑 | 调整限流参数 |
| **Phase 3: 架构预留不足** | 20% | 中 | 参考 MKSAAS 架构 | 补充预留接口 |
| **Phase 3: 数据库设计问题** | 15% | 中 | 参考最佳实践 | 修改 Schema |
| **整体: 时间超期** | 30% | 高 | 每周检查进度 | 调整范围或延期 |
| **整体: 功能回归** | 10% | 高 | 完整回归测试 | 修复或回滚 |

---

### 5.2 回滚策略

#### 5.2.1 Git 分支策略

```
main (生产分支，始终可用)
  ├── phase-0-setup (环境准备)
  ├── phase-1-lift-shift (最小化迁移)
  ├── phase-2-nextjs-ification (服务端增强)
  └── phase-3-future-proofing (架构预留)
```

**回滚流程**:
1. 发现问题 → 评估严重性
2. 如果严重 → 立即回滚到上一个稳定分支
3. 如果不严重 → 在当前分支修复
4. 修复后 → 重新测试 → 合并

---

#### 5.2.2 数据备份策略

**Phase 1-2（localStorage）**:
- 用户数据在客户端，无需备份
- 但建议提供导出功能

**Phase 3（数据库）**:
- 每日自动备份
- 迁移前手动备份
- 保留 7 天备份

---

### 5.3 质量保证

#### 5.3.1 测试策略

| 测试类型 | 覆盖率目标 | 工具 | 执行时机 |
|---------|-----------|------|---------|
| 单元测试 | > 70% | Jest + Testing Library | 每次提交 |
| 集成测试 | > 50% | Jest + Testing Library | 每次提交 |
| E2E 测试 | 核心流程 | Playwright | 每个阶段完成 |
| 性能测试 | 关键页面 | Lighthouse | 每个阶段完成 |
| 安全测试 | 全部 | npm audit | 每周 |

---

#### 5.3.2 代码审查清单

**Phase 1**:
- [ ] 所有组件标记为 'use client'
- [ ] 路由导航正确替换
- [ ] 所有导入路径正确
- [ ] TypeScript 编译无错误
- [ ] 所有功能正常

**Phase 2**:
- [ ] API 密钥不在客户端
- [ ] Server Actions 错误处理完整
- [ ] 速率限制生效
- [ ] 性能指标达标
- [ ] SEO 优化完成

**Phase 3**:
- [ ] 架构预留接口清晰
- [ ] 预留代码有注释
- [ ] 环境变量标准化
- [ ] 文档完整
- [ ] 准备好 MKSAAS 集成

---

## 6. 性能优化策略

### 6.1 Phase 1 性能基准

**目标**: 与原应用性能相当

| 指标 | 原应用 | Phase 1 目标 |
|------|--------|-------------|
| 首屏加载时间 | ~3秒 | ~3秒 |
| TTFB | ~800ms | ~800ms |
| FCP | ~1.5秒 | ~1.5秒 |
| LCP | ~2.5秒 | ~2.5秒 |
| TTI | ~4秒 | ~4秒 |
| Bundle 大小 | ~500KB | ~500KB |

---

### 6.2 Phase 2 性能目标

**目标**: 显著提升性能

| 指标 | Phase 1 | Phase 2 目标 | 优化措施 |
|------|---------|-------------|---------|
| 首屏加载时间 | ~3秒 | < 2秒 | SSR + 代码分割 |
| TTFB | ~800ms | < 600ms | Server Actions |
| FCP | ~1.5秒 | < 1秒 | 字体优化 |
| LCP | ~2.5秒 | < 1.8秒 | 图片优化 |
| TTI | ~4秒 | < 3秒 | 代码分割 |
| Bundle 大小 | ~500KB | < 400KB | Tree shaking |
| Lighthouse 性能 | ~70 | > 90 | 综合优化 |
| Lighthouse SEO | ~60 | > 90 | Metadata + SSR |

---

### 6.3 性能优化技术清单

#### 6.3.1 图片优化

- [ ] 使用 next/image 组件
- [ ] 配置图片域名
- [ ] 使用 priority 属性（首屏图片）
- [ ] 使用 loading="lazy"（非首屏图片）
- [ ] 使用 WebP 格式
- [ ] 配置图片尺寸

#### 6.3.2 字体优化

- [ ] 使用 next/font
- [ ] 使用 display: 'swap'
- [ ] 预加载关键字体
- [ ] 移除外部字体链接

#### 6.3.3 代码分割

- [ ] 使用 dynamic() 动态导入
- [ ] 识别大组件（> 50KB）
- [ ] 按路由分割
- [ ] 按功能分割

#### 6.3.4 缓存策略

- [ ] 配置 Cache-Control
- [ ] 使用 stale-while-revalidate
- [ ] 配置 CDN 缓存
- [ ] 使用 Service Worker（可选）

#### 6.3.5 Bundle 优化

- [ ] Tree shaking
- [ ] 移除未使用的依赖
- [ ] 使用 Bundle Analyzer
- [ ] 压缩代码

---

## 7. 部署策略

### 7.1 部署平台选择

**推荐**: Vercel（Next.js 官方平台）

**理由**:
- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动预览部署
- ✅ 免费额度充足

**备选**: Cloudflare Pages, Netlify

---

### 7.2 部署流程

#### 7.2.1 Phase 1 部署

```bash
# 1. 构建
npm run build

# 2. 测试构建产物
npm run start

# 3. 部署到 Vercel
vercel --prod
```

#### 7.2.2 Phase 2 部署

```bash
# 1. 配置环境变量
# 在 Vercel Dashboard 中配置:
# - GEMINI_API_KEY
# - UPSTASH_REDIS_URL
# - UPSTASH_REDIS_TOKEN

# 2. 构建和部署
vercel --prod
```

#### 7.2.3 Phase 3 部署

```bash
# 1. 配置数据库
# 在 Neon Dashboard 中创建数据库

# 2. 运行迁移
npm run db:push

# 3. 配置环境变量
# 在 Vercel Dashboard 中配置:
# - DATABASE_URL
# - R2_*（文件存储）

# 4. 构建和部署
vercel --prod
```

---

### 7.3 环境管理

| 环境 | 分支 | 域名 | 用途 |
|------|------|------|------|
| 开发 | dev | localhost:3000 | 本地开发 |
| 预览 | feature/* | auto-generated.vercel.app | PR 预览 |
| 测试 | staging | staging.example.com | 测试环境 |
| 生产 | main | example.com | 生产环境 |

---

## 8. 监控与维护

### 8.1 性能监控

**工具**:
- Vercel Analytics（内置）
- Google Analytics（可选）
- Sentry（错误监控）

**关键指标**:
- 页面加载时间
- API 响应时间
- 错误率
- 用户留存率

---

### 8.2 日志管理

**Phase 2**:
```typescript
// lib/logger.ts
export function logError(error: Error, context?: any) {
  console.error('[ERROR]', error.message, context);
  
  // Phase 3: 发送到 Sentry
  // Sentry.captureException(error, { extra: context });
}

export function logInfo(message: string, data?: any) {
  console.log('[INFO]', message, data);
}
```

---

### 8.3 维护计划

| 任务 | 频率 | 负责人 |
|------|------|--------|
| 依赖更新 | 每月 | 开发团队 |
| 安全审计 | 每周 | 开发团队 |
| 性能监控 | 每天 | 自动化 |
| 备份检查 | 每周 | 运维团队 |
| 日志审查 | 每周 | 开发团队 |

---

## 9. 成本估算

### 9.1 开发成本

| 阶段 | 时间 | 人力 | 成本（假设 $50/小时） |
|------|------|------|---------------------|
| Phase 0 | 1周 | 1人 | $2,000 |
| Phase 1 | 2-3周 | 1人 | $4,000-$6,000 |
| Phase 2 | 3-4周 | 1人 | $6,000-$8,000 |
| Phase 3 | 1-2周 | 1人 | $2,000-$4,000 |
| **总计** | **7-10周** | **1人** | **$14,000-$20,000** |

---

### 9.2 运营成本（月）

| 服务 | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| Vercel | $0（免费） | $0（免费） | $0（免费） |
| Neon PostgreSQL | N/A | N/A | $0（免费额度） |
| Upstash Redis | N/A | $0（免费额度） | $0（免费额度） |
| Cloudflare R2 | N/A | N/A | $0（免费额度） |
| Gemini API | $0（免费额度） | $0（免费额度） | $0（免费额度） |
| **总计** | **$0** | **$0** | **$0** |

**注**: 免费额度足够小型应用使用

---

## 10. 成功标准与验收

### 10.1 Phase 0 验收标准

- [ ] ✅ `npm run dev` 可以启动
- [ ] ✅ TypeScript 编译无错误
- [ ] ✅ 所有依赖安装成功
- [ ] ✅ 环境变量配置正确
- [ ] ✅ Git 分支创建完成

---

### 10.2 Phase 1 验收标准

- [ ] ✅ 应用运行在 Next.js 上
- [ ] ✅ 功能与原应用完全一致
- [ ] ✅ 所有 86 种图像效果正常
- [ ] ✅ AI 对话功能完整
- [ ] ✅ 资产库功能完整
- [ ] ✅ 蒙版编辑器正常
- [ ] ✅ 视频生成正常
- [ ] ✅ 双语支持正常
- [ ] ✅ 主题切换正常
- [ ] ✅ 性能与原应用相当
- [ ] ✅ 代码复用率 > 80%
- [ ] ✅ 无控制台错误

---

### 10.3 Phase 2 验收标准

- [ ] ✅ API 密钥完全保护
- [ ] ✅ 所有 API 调用在服务端
- [ ] ✅ 请求速率限制生效
- [ ] ✅ Lighthouse 性能 > 90
- [ ] ✅ Lighthouse SEO > 90
- [ ] ✅ 首屏加载 < 2秒
- [ ] ✅ TTFB < 600ms
- [ ] ✅ 图片加载优化
- [ ] ✅ 字体加载优化
- [ ] ✅ 代码分割优化
- [ ] ✅ Metadata 完整
- [ ] ✅ 所有功能正常

---

### 10.4 Phase 3 验收标准

- [ ] ✅ StorageAdapter 接口实现
- [ ] ✅ UserContext 接口实现
- [ ] ✅ API 调用层抽象实现
- [ ] ✅ 数据库表设计预留
- [ ] ✅ 环境变量标准化
- [ ] ✅ 所有功能正常
- [ ] ✅ 性能指标达标
- [ ] ✅ 安全指标达标
- [ ] ✅ 代码质量达标
- [ ] ✅ 文档完整
- [ ] ✅ 准备好 MKSAAS 集成

---

## 11. 附录

### 11.1 参考资料

- [Next.js 15 官方文档](https://nextjs.org/docs)
- [Next.js App Router 迁移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Better Auth 文档](https://www.better-auth.com/)
- [Vercel 部署文档](https://vercel.com/docs)

---

### 11.2 术语表

| 术语 | 定义 |
|------|------|
| CSR | Client-Side Rendering（客户端渲染） |
| SSR | Server-Side Rendering（服务端渲染） |
| SSG | Static Site Generation（静态站点生成） |
| ISR | Incremental Static Regeneration（增量静态再生成） |
| TTFB | Time To First Byte（首字节时间） |
| FCP | First Contentful Paint（首次内容绘制） |
| LCP | Largest Contentful Paint（最大内容绘制） |
| TTI | Time To Interactive（可交互时间） |
| FOUC | Flash Of Unstyled Content（无样式内容闪烁） |
| Server Actions | Next.js 服务端函数 |
| App Router | Next.js 15 的新路由系统 |
| MKSAAS | 多租户 SaaS 架构 |

---

### 11.3 联系方式

**项目负责人**: [待填写]  
**技术负责人**: [待填写]  
**项目邮箱**: [待填写]

---

## 12. 文档变更记录

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|---------|
| 1.0 | 2025-10-27 | Kiro AI | 初始版本，完整设计文档 |

---

**文档状态**: ✅ 待审查  
**下一步**: 等待用户审查和反馈

---

*本文档由 Kiro AI 基于需求文档 v2.0 自动生成*
