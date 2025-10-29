# Nano Bananary 集成 MkSaaS 设计指南

> **文档目标**: 为将真实应用（如 nano-bananary）集成到 MkSaaS SaaS 模板框架提供完整的架构设计指南  
> **生成日期**: 2025-10-17  
> **适用场景**: AI 应用、图像处理应用、SaaS 产品化

---

## 📋 目录

1. [核心问题分析](#1-核心问题分析)
2. [架构设计原则](#2-架构设计原则)
3. [应用能力要求](#3-应用能力要求)
4. [MkSaaS 框架能力映射](#4-mksaas-框架能力映射)
5. [集成架构设计](#5-集成架构设计)
6. [数据模型设计](#6-数据模型设计)
7. [API 设计规范](#7-api-设计规范)
8. [前端集成策略](#8-前端集成策略)
9. [用户体验设计](#9-用户体验设计)
10. [安全与性能](#10-安全与性能)
11. [实施路线图](#11-实施路线图)
12. [最佳实践清单](#12-最佳实践清单)

---

## 1. 核心问题分析

### 1.1 问题本质

**你的核心疑问**：
> MkSaaS 是一个 SaaS 模板框架，提供了完整的商业化基础设施（认证、支付、用户管理等），但**没有真实的业务应用**。如何将一个真实的应用（如 nano-bananary 图像编辑器）集成进去，使其成为一个完整的商业化 SaaS 产品？

**问题拆解**：
1. **应用侧**：nano-bananary 需要具备哪些能力才能被集成？
2. **框架侧**：MkSaaS 提供了哪些能力，如何利用？
3. **集成侧**：两者如何无缝对接，形成统一的产品体验？

### 1.2 当前状态分析

**Nano Bananary 现状**：
```
✅ 功能完整：50+ 图像效果、AI 聊天、视频生成
✅ 用户体验好：Material Design 3、国际化、响应式
❌ 无用户系统：任何人都可以无限使用
❌ 无商业化：没有付费、订阅、配额管理
❌ API Key 暴露：前端直接调用 Gemini API
❌ 无数据持久化：刷新后资产库清空
❌ 无后端服务：纯前端应用
```

**MkSaaS 现状**：
```
✅ 完整的用户系统：注册、登录、OAuth
✅ 支付系统：Stripe 订阅、一次性付款
✅ 积分系统：购买、赠送、到期管理
✅ 后端基础设施：Next.js API Routes、数据库
✅ 管理后台：用户管理、权限控制
❌ 无具体业务逻辑：只是框架，没有实际应用
```



---

## 2. 架构设计原则

### 2.1 核心设计原则

#### 原则 1：关注点分离（Separation of Concerns）

```
┌─────────────────────────────────────────────────────────────┐
│                    MkSaaS 框架层                              │
│  负责：认证、授权、支付、用户管理、数据持久化                    │
└─────────────────────────────────────────────────────────────┘
                            ↕️ 清晰的接口
┌─────────────────────────────────────────────────────────────┐
│                    业务应用层                                 │
│  负责：核心业务逻辑、AI 调用、图像处理、用户交互                 │
└─────────────────────────────────────────────────────────────┘
```

**实践要点**：
- ✅ 框架不应该知道具体的业务逻辑（如图像效果列表）
- ✅ 应用不应该直接处理用户认证、支付逻辑
- ✅ 通过标准化的接口和数据模型进行通信

#### 原则 2：渐进式集成（Progressive Integration）

```
阶段 1: 基础集成
  └─ 用户认证 + 简单的图像生成功能

阶段 2: 商业化
  └─ 添加积分系统 + 配额限制

阶段 3: 完整功能
  └─ 所有 50+ 效果 + 资产库 + 聊天

阶段 4: 优化增强
  └─ 性能优化 + 高级功能
```

#### 原则 3：数据驱动配置（Data-Driven Configuration）

```typescript
// ❌ 错误：硬编码业务逻辑
if (user.plan === 'free') {
  maxGenerations = 10;
}

// ✅ 正确：配置驱动
const planConfig = {
  free: { maxGenerations: 10, features: ['basic'] },
  pro: { maxGenerations: 100, features: ['basic', 'advanced'] },
  lifetime: { maxGenerations: -1, features: ['all'] }
};
```

### 2.2 架构模式选择

#### 推荐模式：微前端 + BFF（Backend for Frontend）

```
┌──────────────────────────────────────────────────────────────┐
│                        用户浏览器                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  MkSaaS Shell  │  │  Nano Bananary │  │  其他应用模块   │ │
│  │  (导航/布局)    │  │  (业务组件)     │  │  (可扩展)      │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            ↕️ API 调用
┌──────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (BFF)                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Auth API      │  │  Payment API   │  │  Image API     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            ↕️
┌──────────────────────────────────────────────────────────────┐
│                        外部服务                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Database      │  │  Stripe        │  │  Gemini AI     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**优势**：
- ✅ 前端组件可以独立开发和测试
- ✅ API Key 安全存储在后端
- ✅ 统一的错误处理和日志记录
- ✅ 易于扩展新功能

---

## 3. 应用能力要求

### 3.1 必备能力清单

为了能够集成到 MkSaaS，你的应用需要具备以下能力：

#### ✅ 能力 1：模块化架构

**要求**：
```typescript
// 应用应该能够作为独立模块导出
export const ImageEditorModule = {
  // 核心组件
  components: {
    Editor: ImageEditor,
    Gallery: AssetGallery,
    Chat: AIChatInterface
  },
  
  // 业务逻辑
  services: {
    imageService: ImageProcessingService,
    aiService: AIIntegrationService
  },
  
  // 配置
  config: {
    effects: TRANSFORMATION_EFFECTS,
    limits: USAGE_LIMITS
  }
};
```

**Nano Bananary 现状**：
- ❌ 当前是单体应用（App.tsx 1300+ 行）
- ✅ 组件已经分离（components/ 目录）
- ⚠️ 需要重构：将业务逻辑提取为独立服务

#### ✅ 能力 2：用户上下文感知

**要求**：
```typescript
// 应用需要能够接收用户上下文
interface UserContext {
  userId: string;
  email: string;
  plan: 'free' | 'pro' | 'lifetime';
  credits: number;
  permissions: string[];
}

// 组件应该接受用户上下文作为 prop
<ImageEditor 
  user={userContext}
  onCreditsChange={handleCreditsUpdate}
/>
```

**Nano Bananary 现状**：
- ❌ 完全无用户概念
- ❌ 无权限控制
- ✅ 有国际化和主题上下文（可以参考）

#### ✅ 能力 3：配额管理接口

**要求**：
```typescript
// 应用需要在关键操作前检查配额
interface QuotaManager {
  checkQuota(action: string, cost: number): Promise<boolean>;
  consumeQuota(action: string, cost: number): Promise<void>;
  getRemaining(): Promise<number>;
}

// 使用示例
async function generateImage() {
  const canGenerate = await quotaManager.checkQuota('image_generation', 1);
  if (!canGenerate) {
    throw new Error('配额不足');
  }
  
  const result = await aiService.generate();
  await quotaManager.consumeQuota('image_generation', 1);
  return result;
}
```

**Nano Bananary 现状**：
- ❌ 无配额概念
- ❌ 无使用限制
- ✅ 有错误处理机制（可以扩展）



#### ✅ 能力 4：数据持久化接口

**要求**：
```typescript
// 应用需要通过标准接口保存数据
interface DataPersistence {
  saveAsset(asset: Asset): Promise<string>;
  getAssets(userId: string, filters?: AssetFilters): Promise<Asset[]>;
  deleteAsset(assetId: string): Promise<void>;
  updateAsset(assetId: string, updates: Partial<Asset>): Promise<void>;
}

// 数据模型
interface Asset {
  id: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  metadata: {
    prompt: string;
    effect: string;
    createdAt: Date;
  };
}
```

**Nano Bananary 现状**：
- ❌ 只有内存存储（assetLibrary: string[]）
- ❌ 刷新后数据丢失
- ✅ 有清晰的数据结构（可以映射到数据库）

#### ✅ 能力 5：API 安全调用

**要求**：
```typescript
// 应用不应该直接调用外部 API，而是通过后端代理
// ❌ 错误做法
const result = await fetch('https://api.gemini.com', {
  headers: { 'Authorization': `Bearer ${API_KEY}` } // 暴露 Key
});

// ✅ 正确做法
const result = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt, images }),
  headers: { 'Authorization': `Bearer ${userToken}` } // 用户 token
});
```

**Nano Bananary 现状**：
- ❌ 前端直接调用 Gemini API
- ❌ API Key 暴露在客户端
- ✅ 有统一的 geminiService 封装（易于重构）

#### ✅ 能力 6：事件通知机制

**要求**：
```typescript
// 应用需要在关键事件发生时通知框架
interface EventEmitter {
  emit(event: string, data: any): void;
}

// 使用示例
eventEmitter.emit('image:generated', {
  userId: user.id,
  assetId: asset.id,
  creditsUsed: 1
});

eventEmitter.emit('quota:exceeded', {
  userId: user.id,
  action: 'image_generation'
});
```

**Nano Bananary 现状**：
- ❌ 无事件系统
- ✅ 有状态管理（可以扩展为事件）

### 3.2 推荐能力清单

这些能力不是必须的，但会显著提升用户体验：

#### 🌟 能力 7：批量操作支持

```typescript
interface BatchOperations {
  generateBatch(requests: GenerationRequest[]): Promise<GenerationResult[]>;
  deleteBatch(assetIds: string[]): Promise<void>;
  downloadBatch(assetIds: string[]): Promise<Blob>;
}
```

**Nano Bananary 现状**：
- ✅ 已支持多图上传
- ✅ 已支持批量下载
- ⚠️ 需要优化：添加队列管理

#### 🌟 能力 8：实时进度反馈

```typescript
interface ProgressTracker {
  onProgress(callback: (progress: number, message: string) => void): void;
  cancel(): void;
}
```

**Nano Bananary 现状**：
- ✅ 有加载状态
- ✅ 视频生成有进度反馈
- ⚠️ 需要优化：统一进度接口

#### 🌟 能力 9：离线支持

```typescript
interface OfflineCapability {
  cacheAssets(assets: Asset[]): Promise<void>;
  getOfflineAssets(): Promise<Asset[]>;
  syncWhenOnline(): Promise<void>;
}
```

**Nano Bananary 现状**：
- ❌ 无离线支持
- ⚠️ 可选功能：PWA + Service Worker

---

## 4. MkSaaS 框架能力映射

### 4.1 MkSaaS 提供的核心能力

#### 🔐 认证与授权

**提供的能力**：
```typescript
// Better Auth 集成
- 邮箱密码登录
- Google/GitHub OAuth
- 邮箱验证
- 密码重置
- 会话管理
- 角色权限（admin/user）
```

**集成点**：
```typescript
// 在应用中使用
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 使用 session.user 获取用户信息
  const user = session.user;
}
```

#### 💳 支付与订阅

**提供的能力**：
```typescript
// Stripe 集成
- 订阅管理（月付/年付）
- 一次性付款（终身会员）
- 客户门户
- Webhook 处理
- 发票生成
```

**集成点**：
```typescript
// 检查用户订阅状态
import { getUserSubscription } from '@/lib/stripe';

const subscription = await getUserSubscription(userId);
if (subscription.plan === 'free') {
  // 限制功能
}
```

#### 🎫 积分系统

**提供的能力**：
```typescript
// 积分管理
- 购买积分套餐
- 注册赠送积分
- 积分到期管理
- 交易历史
- Cron Job 自动分配
```

**集成点**：
```typescript
// 消费积分
import { consumeCredits, getUserCredits } from '@/lib/credits';

const credits = await getUserCredits(userId);
if (credits < cost) {
  throw new Error('积分不足');
}

await consumeCredits(userId, cost, {
  type: 'image_generation',
  metadata: { effect: 'pixel_art' }
});
```



#### 🗄️ 数据库与 ORM

**提供的能力**：
```typescript
// Drizzle ORM + PostgreSQL
- 类型安全的数据库操作
- 迁移管理
- 关系查询
- 事务支持
```

**集成点**：
```typescript
// 定义应用数据模型
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const assets = pgTable('assets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(), // 'image' | 'video'
  url: text('url').notNull(),
  prompt: text('prompt'),
  effect: text('effect'),
  createdAt: timestamp('created_at').defaultNow()
});

// 查询
import { db } from '@/lib/db';
const userAssets = await db.select().from(assets).where(eq(assets.userId, userId));
```

#### 📧 邮件系统

**提供的能力**：
```typescript
// Resend + React Email
- 事务性邮件模板
- 邮件预览工具
- 通讯订阅
```

**集成点**：
```typescript
// 发送自定义邮件
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: user.email,
  subject: '您的图像已生成',
  template: 'image-ready',
  data: {
    userName: user.name,
    imageUrl: asset.url
  }
});
```

#### 📦 文件存储

**提供的能力**：
```typescript
// Cloudflare R2 / S3
- 文件上传
- 文件删除
- 公共/私有访问
```

**集成点**：
```typescript
// 上传生成的图像
import { uploadFile } from '@/lib/storage';

const url = await uploadFile({
  file: imageBlob,
  path: `users/${userId}/assets/${assetId}.png`,
  contentType: 'image/png'
});
```

#### 📊 分析与监控

**提供的能力**：
```typescript
// 多种分析工具
- Vercel Analytics
- Google Analytics
- Umami / Plausible
```

**集成点**：
```typescript
// 追踪自定义事件
import { trackEvent } from '@/lib/analytics';

trackEvent('image_generated', {
  effect: 'pixel_art',
  userId: user.id,
  plan: user.plan
});
```

#### 🌍 国际化

**提供的能力**：
```typescript
// Next-intl
- 多语言路由
- 翻译管理
- 语言切换
```

**集成点**：
```typescript
// 在组件中使用翻译
import { useTranslations } from 'next-intl';

export function ImageEditor() {
  const t = useTranslations('ImageEditor');
  
  return (
    <button>{t('generate')}</button>
  );
}
```

### 4.2 MkSaaS 能力与应用需求映射表

| 应用需求 | MkSaaS 能力 | 集成难度 | 优先级 |
|---------|------------|---------|--------|
| 用户认证 | Better Auth | 🟢 低 | 🔴 高 |
| 付费订阅 | Stripe 订阅 | 🟢 低 | 🔴 高 |
| 配额管理 | 积分系统 | 🟡 中 | 🔴 高 |
| 数据持久化 | Drizzle ORM | 🟡 中 | 🔴 高 |
| API 安全 | Next.js API Routes | 🟡 中 | 🔴 高 |
| 文件存储 | R2/S3 | 🟢 低 | 🔴 高 |
| 邮件通知 | Resend | 🟢 低 | 🟡 中 |
| 用户管理 | 管理后台 | 🟢 低 | 🟡 中 |
| 分析统计 | Analytics | 🟢 低 | 🟡 中 |
| 国际化 | Next-intl | 🟢 低 | 🟢 低 |
| 博客/文档 | Fumadocs | 🟢 低 | 🟢 低 |

---

## 5. 集成架构设计

### 5.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户界面层                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MkSaaS Shell (src/app/)                                  │  │
│  │  ├─ 导航栏 (Header)                                       │  │
│  │  ├─ 侧边栏 (Sidebar)                                      │  │
│  │  └─ 主内容区                                              │  │
│  │      └─ Nano Bananary Module                             │  │
│  │          ├─ ImageEditor (增强器)                          │  │
│  │          ├─ AssetGallery (资产库)                         │  │
│  │          └─ AIChat (聊天)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      API 层 (BFF Pattern)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js API Routes (src/app/api/)                        │  │
│  │  ├─ /api/auth/*          (认证)                           │  │
│  │  ├─ /api/payments/*      (支付)                           │  │
│  │  ├─ /api/credits/*       (积分)                           │  │
│  │  └─ /api/images/*        (图像处理) ← 新增                │  │
│  │      ├─ POST /generate   (生成图像)                       │  │
│  │      ├─ POST /edit       (编辑图像)                       │  │
│  │      ├─ POST /chat       (AI 聊天)                        │  │
│  │      ├─ POST /video      (视频生成)                       │  │
│  │      ├─ GET  /assets     (获取资产)                       │  │
│  │      └─ DELETE /assets/:id (删除资产)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                        服务层                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Business Logic Services (src/lib/)                       │  │
│  │  ├─ authService          (MkSaaS 提供)                    │  │
│  │  ├─ paymentService       (MkSaaS 提供)                    │  │
│  │  ├─ creditsService       (MkSaaS 提供)                    │  │
│  │  ├─ storageService       (MkSaaS 提供)                    │  │
│  │  └─ imageService         (新增) ← 核心业务逻辑            │  │
│  │      ├─ generateImage()                                   │  │
│  │      ├─ editImage()                                       │  │
│  │      ├─ generateVideo()                                   │  │
│  │      └─ saveAsset()                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      数据层                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database (Drizzle ORM)                                   │  │
│  │  ├─ users                (MkSaaS 提供)                    │  │
│  │  ├─ subscriptions        (MkSaaS 提供)                    │  │
│  │  ├─ credits              (MkSaaS 提供)                    │  │
│  │  └─ assets               (新增) ← 应用数据                │  │
│  │      ├─ id, userId, type                                  │  │
│  │      ├─ url, prompt, effect                               │  │
│  │      └─ metadata, createdAt                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      外部服务                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Gemini AI   │  │  Stripe      │  │  R2 Storage  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 目录结构设计

```
mksaas-nano-bananary/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 认证相关页面 (MkSaaS)
│   │   ├── (marketing)/              # 营销页面 (MkSaaS)
│   │   ├── dashboard/                # 用户仪表板
│   │   │   ├── layout.tsx            # 仪表板布局
│   │   │   ├── page.tsx              # 仪表板首页
│   │   │   ├── editor/               # 图像编辑器 ← 新增
│   │   │   │   └── page.tsx
│   │   │   ├── gallery/              # 资产库 ← 新增
│   │   │   │   └── page.tsx
│   │   │   ├── chat/                 # AI 聊天 ← 新增
│   │   │   │   └── page.tsx
│   │   │   └── settings/             # 用户设置
│   │   │       └── page.tsx
│   │   └── api/                      # API Routes
│   │       ├── auth/                 # 认证 API (MkSaaS)
│   │       ├── payments/             # 支付 API (MkSaaS)
│   │       ├── credits/              # 积分 API (MkSaaS)
│   │       └── images/               # 图像 API ← 新增
│   │           ├── generate/
│   │           │   └── route.ts
│   │           ├── edit/
│   │           │   └── route.ts
│   │           ├── chat/
│   │           │   └── route.ts
│   │           ├── video/
│   │           │   └── route.ts
│   │           └── assets/
│   │               ├── route.ts      # GET, POST
│   │               └── [id]/
│   │                   └── route.ts  # DELETE, PATCH
│   │
│   ├── components/                   # React 组件
│   │   ├── ui/                       # 基础 UI 组件 (MkSaaS)
│   │   ├── auth/                     # 认证组件 (MkSaaS)
│   │   ├── dashboard/                # 仪表板组件 (MkSaaS)
│   │   └── image-editor/             # 图像编辑器组件 ← 新增
│   │       ├── ImageEditor.tsx       # 主编辑器
│   │       ├── TransformationSelector.tsx
│   │       ├── ImageCanvas.tsx
│   │       ├── ResultDisplay.tsx
│   │       ├── AssetGallery.tsx
│   │       ├── AIChat.tsx
│   │       └── index.ts
│   │
│   ├── lib/                          # 业务逻辑和工具
│   │   ├── auth.ts                   # 认证服务 (MkSaaS)
│   │   ├── db.ts                     # 数据库连接 (MkSaaS)
│   │   ├── stripe.ts                 # Stripe 服务 (MkSaaS)
│   │   ├── credits.ts                # 积分服务 (MkSaaS)
│   │   ├── storage.ts                # 文件存储 (MkSaaS)
│   │   └── image-service/            # 图像服务 ← 新增
│   │       ├── index.ts              # 主服务
│   │       ├── gemini-client.ts      # Gemini API 客户端
│   │       ├── image-processor.ts    # 图像处理
│   │       ├── quota-manager.ts      # 配额管理
│   │       └── asset-manager.ts      # 资产管理
│   │
│   ├── db/                           # 数据库模式
│   │   ├── schema/
│   │   │   ├── users.ts              # 用户表 (MkSaaS)
│   │   │   ├── subscriptions.ts      # 订阅表 (MkSaaS)
│   │   │   ├── credits.ts            # 积分表 (MkSaaS)
│   │   │   └── assets.ts             # 资产表 ← 新增
│   │   └── migrations/               # 数据库迁移
│   │
│   ├── config/                       # 配置文件
│   │   ├── website.tsx               # 网站配置 (MkSaaS)
│   │   ├── credits-config.tsx        # 积分配置 (MkSaaS)
│   │   └── image-effects.ts          # 图像效果配置 ← 新增
│   │
│   └── types/                        # TypeScript 类型
│       ├── auth.ts                   # 认证类型 (MkSaaS)
│       ├── payment.ts                # 支付类型 (MkSaaS)
│       └── image.ts                  # 图像类型 ← 新增
│
├── public/                           # 静态资源
│   ├── images/
│   └── icons/
│
├── .env.local                        # 环境变量
├── drizzle.config.ts                 # Drizzle 配置
├── next.config.js                    # Next.js 配置
├── package.json
└── tsconfig.json
```



---

## 6. 数据模型设计

### 6.1 核心数据表设计

#### Assets 表（资产表）

```typescript
// src/db/schema/assets.ts
import { pgTable, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const assets = pgTable('assets', {
  // 基础字段
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // 资产信息
  type: text('type').notNull(), // 'image' | 'video'
  url: text('url').notNull(),   // 存储在 R2 的 URL
  thumbnailUrl: text('thumbnail_url'), // 缩略图
  
  // 生成信息
  prompt: text('prompt'),       // 用户提示
  effect: text('effect'),       // 使用的效果
  model: text('model'),         // AI 模型
  
  // 元数据
  metadata: jsonb('metadata').$type<{
    width?: number;
    height?: number;
    fileSize?: number;
    mimeType?: string;
    aspectRatio?: string;
    generationTime?: number; // 生成耗时（秒）
  }>(),
  
  // 统计
  viewCount: integer('view_count').default(0),
  downloadCount: integer('download_count').default(0),
  
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 索引
export const assetsUserIdIdx = index('assets_user_id_idx').on(assets.userId);
export const assetsCreatedAtIdx = index('assets_created_at_idx').on(assets.createdAt);
```

#### Usage Logs 表（使用日志表）

```typescript
// src/db/schema/usage-logs.ts
export const usageLogs = pgTable('usage_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  
  // 操作信息
  action: text('action').notNull(), // 'image_generation' | 'image_edit' | 'video_generation'
  creditsUsed: integer('credits_used').notNull(),
  
  // 关联资产
  assetId: text('asset_id').references(() => assets.id),
  
  // 详细信息
  details: jsonb('details').$type<{
    effect?: string;
    model?: string;
    prompt?: string;
    success?: boolean;
    errorMessage?: string;
  }>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull()
});
```

#### User Preferences 表（用户偏好表）

```typescript
// src/db/schema/user-preferences.ts
export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey().references(() => users.id),
  
  // 编辑器偏好
  defaultEffect: text('default_effect'),
  defaultAspectRatio: text('default_aspect_ratio').default('Auto'),
  autoSaveAssets: boolean('auto_save_assets').default(true),
  
  // 聊天偏好
  chatHistoryLength: integer('chat_history_length').default(8),
  enableAiPreprocessing: boolean('enable_ai_preprocessing').default(false),
  
  // 通知偏好
  emailOnGeneration: boolean('email_on_generation').default(false),
  emailOnQuotaLow: boolean('email_on_quota_low').default(true),
  
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
```

### 6.2 数据关系图

```
users (MkSaaS)
  ├─ 1:N → assets (新增)
  ├─ 1:N → usageLogs (新增)
  ├─ 1:1 → userPreferences (新增)
  ├─ 1:N → subscriptions (MkSaaS)
  └─ 1:N → creditTransactions (MkSaaS)

assets
  ├─ N:1 → users
  └─ 1:N → usageLogs

subscriptions (MkSaaS)
  └─ N:1 → users

creditTransactions (MkSaaS)
  └─ N:1 → users
```

---

## 7. API 设计规范

### 7.1 RESTful API 设计

#### POST /api/images/generate

**功能**：生成新图像

**请求**：
```typescript
{
  prompt: string;
  effect?: string;          // 预设效果 ID
  images?: string[];        // Base64 图像（用于编辑）
  mask?: string;            // Base64 蒙版
  aspectRatio?: string;     // '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
  numVariants?: number;     // 生成变体数量（1-4）
}
```

**响应**：
```typescript
{
  success: boolean;
  data: {
    assets: Array<{
      id: string;
      url: string;
      thumbnailUrl: string;
    }>;
    creditsUsed: number;
    remainingCredits: number;
  };
  error?: string;
}
```

**实现示例**：
```typescript
// src/app/api/images/generate/route.ts
import { auth } from '@/lib/auth';
import { consumeCredits, getUserCredits } from '@/lib/credits';
import { imageService } from '@/lib/image-service';

export async function POST(req: Request) {
  // 1. 认证
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. 解析请求
  const body = await req.json();
  const { prompt, effect, images, mask, aspectRatio, numVariants = 1 } = body;
  
  // 3. 检查配额
  const creditsRequired = numVariants * 1; // 每个变体 1 积分
  const userCredits = await getUserCredits(session.user.id);
  
  if (userCredits < creditsRequired) {
    return Response.json({ 
      error: '积分不足',
      data: { requiredCredits: creditsRequired, userCredits }
    }, { status: 402 });
  }
  
  try {
    // 4. 调用图像服务
    const results = await imageService.generate({
      userId: session.user.id,
      prompt,
      effect,
      images,
      mask,
      aspectRatio,
      numVariants
    });
    
    // 5. 消费积分
    await consumeCredits(session.user.id, creditsRequired, {
      type: 'image_generation',
      metadata: { effect, numVariants }
    });
    
    // 6. 返回结果
    const remainingCredits = await getUserCredits(session.user.id);
    
    return Response.json({
      success: true,
      data: {
        assets: results,
        creditsUsed: creditsRequired,
        remainingCredits
      }
    });
    
  } catch (error) {
    console.error('Image generation failed:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : '生成失败'
    }, { status: 500 });
  }
}
```

#### GET /api/images/assets

**功能**：获取用户资产列表

**查询参数**：
```typescript
{
  page?: number;           // 页码（默认 1）
  limit?: number;          // 每页数量（默认 20）
  type?: 'image' | 'video' | 'all'; // 类型过滤
  sortBy?: 'createdAt' | 'viewCount' | 'downloadCount';
  order?: 'asc' | 'desc';
}
```

**响应**：
```typescript
{
  success: boolean;
  data: {
    assets: Asset[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

#### DELETE /api/images/assets/[id]

**功能**：删除资产

**响应**：
```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### 7.2 实时通信设计（可选）

对于需要实时进度反馈的场景（如视频生成），可以使用 Server-Sent Events (SSE)：

```typescript
// src/app/api/images/video/stream/route.ts
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await req.json();
  
  // 创建 SSE 流
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        await imageService.generateVideo({
          ...body,
          userId: session.user.id,
          onProgress: (progress, message) => {
            // 发送进度更新
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ progress, message })}\n\n`)
            );
          }
        });
        
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
        );
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

---

## 8. 前端集成策略

### 8.1 组件集成模式

#### 模式 1：页面级集成（推荐）

```typescript
// src/app/dashboard/editor/page.tsx
import { ImageEditor } from '@/components/image-editor';
import { getUserCredits } from '@/lib/credits';
import { auth } from '@/lib/auth';

export default async function EditorPage() {
  const session = await auth.api.getSession();
  if (!session) redirect('/login');
  
  const credits = await getUserCredits(session.user.id);
  
  return (
    <div className="container mx-auto p-6">
      <ImageEditor 
        user={session.user}
        credits={credits}
      />
    </div>
  );
}
```

#### 模式 2：布局级集成

```typescript
// src/app/dashboard/layout.tsx
import { DashboardNav } from '@/components/dashboard/nav';
import { CreditsBadge } from '@/components/dashboard/credits-badge';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 border-r">
        <DashboardNav items={[
          { href: '/dashboard', label: '首页', icon: 'home' },
          { href: '/dashboard/editor', label: '图像编辑', icon: 'image' },
          { href: '/dashboard/gallery', label: '资产库', icon: 'folder' },
          { href: '/dashboard/chat', label: 'AI 聊天', icon: 'chat' }
        ]} />
      </aside>
      
      {/* 主内容 */}
      <main className="flex-1 overflow-auto">
        {/* 顶部栏 */}
        <header className="border-b p-4 flex justify-between items-center">
          <h1>Nano Bananary</h1>
          <CreditsBadge />
        </header>
        
        {/* 页面内容 */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### 8.2 状态管理策略

#### 使用 React Context + Server Actions

```typescript
// src/components/image-editor/context.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface EditorContextType {
  credits: number;
  updateCredits: (amount: number) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children, initialCredits }) {
  const [credits, setCredits] = useState(initialCredits);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const updateCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };
  
  return (
    <EditorContext.Provider value={{
      credits,
      updateCredits,
      isGenerating,
      setIsGenerating
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};
```

#### 使用 Server Actions

```typescript
// src/app/actions/image-actions.ts
'use server';

import { auth } from '@/lib/auth';
import { imageService } from '@/lib/image-service';
import { revalidatePath } from 'next/cache';

export async function generateImage(formData: FormData) {
  const session = await auth.api.getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }
  
  const prompt = formData.get('prompt') as string;
  const effect = formData.get('effect') as string;
  
  try {
    const result = await imageService.generate({
      userId: session.user.id,
      prompt,
      effect
    });
    
    // 重新验证资产库页面
    revalidatePath('/dashboard/gallery');
    
    return { success: true, data: result };
  } catch (error) {
    return { error: error.message };
  }
}
```



---

## 9. 用户体验设计

### 9.1 用户流程设计

#### 新用户首次使用流程

```
1. 访问网站 → 查看落地页
   ↓
2. 注册账户 → 获得 10 免费积分
   ↓
3. 进入仪表板 → 看到引导教程
   ↓
4. 上传第一张图片 → 选择效果 → 生成（消耗 1 积分）
   ↓
5. 查看结果 → 保存到资产库
   ↓
6. 积分用完 → 引导购买积分或订阅
```

#### 付费用户流程

```
免费用户 (10 积分)
   ↓
选择付费方案：
   ├─ 购买积分包 (一次性)
   │   └─ 100 积分 $9.99
   │   └─ 500 积分 $39.99
   │
   └─ 订阅会员 (按月/年)
       ├─ Pro ($19/月): 每月 200 积分 + 高级功能
       └─ Lifetime ($199): 无限积分 + 所有功能
```

### 9.2 配额提示设计

#### 积分不足提示

```typescript
// src/components/image-editor/QuotaWarning.tsx
export function QuotaWarning({ credits, required }) {
  if (credits >= required) return null;
  
  return (
    <Alert variant="warning">
      <AlertTitle>积分不足</AlertTitle>
      <AlertDescription>
        此操作需要 {required} 积分，您当前有 {credits} 积分。
      </AlertDescription>
      <div className="mt-4 flex gap-2">
        <Button asChild>
          <Link href="/dashboard/credits">购买积分</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/pricing">查看订阅方案</Link>
        </Button>
      </div>
    </Alert>
  );
}
```

#### 实时积分显示

```typescript
// src/components/dashboard/credits-badge.tsx
'use client';

import { useEffect, useState } from 'react';

export function CreditsBadge() {
  const [credits, setCredits] = useState(0);
  
  useEffect(() => {
    // 订阅积分更新事件
    const unsubscribe = subscribeToCreditsUpdate((newCredits) => {
      setCredits(newCredits);
    });
    
    return unsubscribe;
  }, []);
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
      <CoinIcon className="w-5 h-5" />
      <span className="font-semibold">{credits}</span>
      <span className="text-sm text-muted-foreground">积分</span>
    </div>
  );
}
```

### 9.3 错误处理与用户反馈

#### 统一错误处理

```typescript
// src/lib/error-handler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public userMessage?: string
  ) {
    super(message);
  }
}

export const ErrorCodes = {
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  INVALID_INPUT: 'INVALID_INPUT',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR'
} as const;

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: error.userMessage || error.message,
      code: error.code,
      statusCode: error.statusCode
    };
  }
  
  console.error('Unexpected error:', error);
  return {
    error: '服务暂时不可用，请稍后重试',
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  };
}
```

#### 用户友好的错误提示

```typescript
// src/components/image-editor/ErrorDisplay.tsx
export function ErrorDisplay({ error }) {
  const errorMessages = {
    INSUFFICIENT_CREDITS: {
      title: '积分不足',
      description: '您的积分不足以完成此操作',
      action: { label: '购买积分', href: '/dashboard/credits' }
    },
    QUOTA_EXCEEDED: {
      title: '已达使用上限',
      description: '您今天的生成次数已达上限，请明天再试或升级套餐',
      action: { label: '升级套餐', href: '/pricing' }
    },
    AI_SERVICE_ERROR: {
      title: 'AI 服务暂时不可用',
      description: '请稍后重试，如果问题持续请联系客服',
      action: { label: '重试', onClick: () => window.location.reload() }
    }
  };
  
  const config = errorMessages[error.code] || {
    title: '出错了',
    description: error.message,
    action: null
  };
  
  return (
    <Alert variant="destructive">
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{config.description}</AlertDescription>
      {config.action && (
        <Button className="mt-4" {...config.action}>
          {config.action.label}
        </Button>
      )}
    </Alert>
  );
}
```

---

## 10. 安全与性能

### 10.1 安全最佳实践

#### API Key 保护

```typescript
// ❌ 错误：前端暴露 API Key
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ 正确：后端代理
// src/lib/image-service/gemini-client.ts
import { GoogleGenerativeAI } from '@google/genai';

class GeminiClient {
  private client: GoogleGenerativeAI;
  
  constructor() {
    // API Key 只在服务端使用
    if (typeof window !== 'undefined') {
      throw new Error('GeminiClient can only be used on the server');
    }
    
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  
  async generate(params) {
    // 实现生成逻辑
  }
}

export const geminiClient = new GeminiClient();
```

#### 输入验证

```typescript
// src/lib/validators/image-validator.ts
import { z } from 'zod';

export const generateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  effect: z.string().optional(),
  images: z.array(z.string()).max(10).optional(),
  mask: z.string().optional(),
  aspectRatio: z.enum(['Auto', '1:1', '16:9', '9:16', '4:3', '3:4']).optional(),
  numVariants: z.number().int().min(1).max(4).default(1)
});

// 在 API Route 中使用
export async function POST(req: Request) {
  const body = await req.json();
  
  // 验证输入
  const result = generateImageSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ 
      error: '无效的请求参数',
      details: result.error.errors
    }, { status: 400 });
  }
  
  // 继续处理...
}
```

#### 速率限制

```typescript
// src/lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 每分钟 10 次
  analytics: true
});

// 在 API Route 中使用
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  
  const { success } = await rateLimiter.limit(session.user.id);
  if (!success) {
    return Response.json({ 
      error: '请求过于频繁，请稍后再试'
    }, { status: 429 });
  }
  
  // 继续处理...
}
```

### 10.2 性能优化

#### 图像优化

```typescript
// src/lib/image-service/image-processor.ts
import sharp from 'sharp';

export class ImageProcessor {
  // 生成缩略图
  async generateThumbnail(imageBuffer: Buffer): Promise<Buffer> {
    return sharp(imageBuffer)
      .resize(400, 400, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer();
  }
  
  // 压缩图像
  async compressImage(imageBuffer: Buffer, quality: number = 85): Promise<Buffer> {
    return sharp(imageBuffer)
      .webp({ quality })
      .toBuffer();
  }
  
  // 添加水印
  async addWatermark(imageBuffer: Buffer, text: string): Promise<Buffer> {
    const watermark = Buffer.from(
      `<svg width="200" height="50">
        <text x="10" y="30" font-size="20" fill="rgba(255,255,255,0.5)">
          ${text}
        </text>
      </svg>`
    );
    
    return sharp(imageBuffer)
      .composite([{ input: watermark, gravity: 'southeast' }])
      .toBuffer();
  }
}
```

#### 数据库查询优化

```typescript
// src/lib/image-service/asset-manager.ts
import { db } from '@/lib/db';
import { assets } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export class AssetManager {
  // 分页查询（带缓存）
  async getUserAssets(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    // 使用 Drizzle 的高效查询
    const [items, totalCount] = await Promise.all([
      db.select()
        .from(assets)
        .where(eq(assets.userId, userId))
        .orderBy(desc(assets.createdAt))
        .limit(limit)
        .offset(offset),
      
      db.select({ count: count() })
        .from(assets)
        .where(eq(assets.userId, userId))
    ]);
    
    return {
      items,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        totalPages: Math.ceil(totalCount[0].count / limit)
      }
    };
  }
  
  // 批量删除（事务）
  async deleteAssets(assetIds: string[], userId: string) {
    return db.transaction(async (tx) => {
      // 1. 验证所有资产属于该用户
      const ownedAssets = await tx.select()
        .from(assets)
        .where(and(
          inArray(assets.id, assetIds),
          eq(assets.userId, userId)
        ));
      
      if (ownedAssets.length !== assetIds.length) {
        throw new Error('部分资产不存在或无权删除');
      }
      
      // 2. 从存储中删除文件
      await Promise.all(
        ownedAssets.map(asset => storageService.deleteFile(asset.url))
      );
      
      // 3. 从数据库中删除记录
      await tx.delete(assets)
        .where(inArray(assets.id, assetIds));
    });
  }
}
```

#### 缓存策略

```typescript
// src/lib/cache.ts
import { unstable_cache } from 'next/cache';

// 缓存用户积分（5 分钟）
export const getCachedUserCredits = unstable_cache(
  async (userId: string) => {
    return getUserCredits(userId);
  },
  ['user-credits'],
  {
    revalidate: 300, // 5 分钟
    tags: ['credits']
  }
);

// 缓存效果列表（1 小时）
export const getCachedEffects = unstable_cache(
  async () => {
    return TRANSFORMATION_EFFECTS;
  },
  ['effects'],
  {
    revalidate: 3600 // 1 小时
  }
);

// 手动重新验证缓存
import { revalidateTag } from 'next/cache';

export async function updateUserCredits(userId: string, amount: number) {
  // 更新数据库
  await db.update(users)
    .set({ credits: sql`credits + ${amount}` })
    .where(eq(users.id, userId));
  
  // 重新验证缓存
  revalidateTag('credits');
}
```

---

## 11. 实施路线图

### 11.1 阶段 1：基础集成（2-3 周）

#### Week 1: 环境搭建与数据模型

**任务清单**：
- [ ] Fork MkSaaS 模板仓库
- [ ] 配置开发环境（数据库、环境变量）
- [ ] 设计并创建数据表（assets, usageLogs, userPreferences）
- [ ] 运行数据库迁移
- [ ] 测试 MkSaaS 基础功能（认证、支付）

**交付物**：
- 可运行的 MkSaaS 环境
- 完整的数据库模式

#### Week 2: 后端 API 开发

**任务清单**：
- [ ] 创建 Image Service 核心逻辑
- [ ] 实现 Gemini API 客户端（后端代理）
- [ ] 开发 API Routes（/api/images/*）
- [ ] 集成积分系统
- [ ] 实现配额检查和消费
- [ ] 添加错误处理和日志

**交付物**：
- 完整的后端 API
- API 文档

#### Week 3: 前端组件迁移

**任务清单**：
- [ ] 重构 nano-bananary 组件为模块化结构
- [ ] 创建 ImageEditor 页面
- [ ] 集成用户认证
- [ ] 连接后端 API
- [ ] 实现积分显示和提示
- [ ] 测试端到端流程

**交付物**：
- 可用的图像编辑器
- 基础用户流程

### 11.2 阶段 2：功能完善（2-3 周）

#### Week 4: 资产库与存储

**任务清单**：
- [ ] 集成 Cloudflare R2 存储
- [ ] 实现资产上传和管理
- [ ] 创建 AssetGallery 组件
- [ ] 添加缩略图生成
- [ ] 实现批量操作（下载、删除）
- [ ] 优化图像加载性能

#### Week 5: AI 聊天功能

**任务清单**：
- [ ] 迁移 AI 聊天组件
- [ ] 实现聊天历史持久化
- [ ] 添加流式响应支持
- [ ] 集成配额管理
- [ ] 优化用户体验

#### Week 6: 测试与优化

**任务清单**：
- [ ] 编写单元测试
- [ ] 进行集成测试
- [ ] 性能优化（缓存、懒加载）
- [ ] 安全审计
- [ ] Bug 修复

### 11.3 阶段 3：商业化与上线（1-2 周）

#### Week 7: 商业化配置

**任务清单**：
- [ ] 配置 Stripe 产品和价格
- [ ] 设置积分套餐
- [ ] 创建定价页面
- [ ] 配置邮件模板
- [ ] 设置分析工具

#### Week 8: 上线准备

**任务清单**：
- [ ] 创建营销落地页
- [ ] 编写用户文档
- [ ] 配置生产环境
- [ ] 部署到 Vercel
- [ ] 监控和日志设置
- [ ] 软启动测试

---

## 12. 最佳实践清单

### 12.1 开发阶段

#### ✅ 代码组织
- [ ] 使用清晰的目录结构
- [ ] 遵循 Next.js 约定
- [ ] 组件单一职责
- [ ] 提取可复用逻辑为 hooks
- [ ] 使用 TypeScript 严格模式

#### ✅ 数据管理
- [ ] 使用 Drizzle ORM 类型安全
- [ ] 定义清晰的数据模型
- [ ] 使用数据库索引优化查询
- [ ] 实现数据验证（Zod）
- [ ] 使用事务处理关键操作

#### ✅ API 设计
- [ ] RESTful 风格
- [ ] 统一的响应格式
- [ ] 完善的错误处理
- [ ] 输入验证
- [ ] 速率限制

### 12.2 安全阶段

#### ✅ 认证与授权
- [ ] 所有 API 都需要认证
- [ ] 验证用户权限
- [ ] 使用 HTTPS
- [ ] 安全的会话管理
- [ ] CSRF 保护

#### ✅ 数据安全
- [ ] API Key 存储在服务端
- [ ] 敏感数据加密
- [ ] 输入清理和验证
- [ ] SQL 注入防护（ORM 自动处理）
- [ ] XSS 防护

### 12.3 性能阶段

#### ✅ 前端优化
- [ ] 图像懒加载
- [ ] 代码分割
- [ ] 使用 Next.js Image 组件
- [ ] 实现虚拟滚动（大列表）
- [ ] 优化 Bundle 大小

#### ✅ 后端优化
- [ ] 数据库查询优化
- [ ] 使用缓存（Redis/Next.js Cache）
- [ ] 批量操作
- [ ] 异步处理长任务
- [ ] CDN 加速静态资源

### 12.4 用户体验

#### ✅ 交互设计
- [ ] 加载状态提示
- [ ] 错误友好提示
- [ ] 操作确认（删除等）
- [ ] 键盘快捷键
- [ ] 响应式设计

#### ✅ 引导与帮助
- [ ] 新手引导
- [ ] 工具提示
- [ ] 帮助文档
- [ ] 示例和模板
- [ ] 常见问题解答

---

## 总结

### 核心要点回顾

1. **关注点分离**：框架负责基础设施，应用负责业务逻辑
2. **模块化设计**：应用应该能够作为独立模块集成
3. **用户上下文感知**：应用需要理解用户身份、权限和配额
4. **数据持久化**：通过标准接口保存和管理数据
5. **API 安全**：后端代理保护敏感信息
6. **渐进式集成**：分阶段实施，快速验证

### 成功关键因素

✅ **技术层面**：
- 清晰的架构设计
- 标准化的接口
- 完善的错误处理
- 性能优化

✅ **产品层面**：
- 流畅的用户体验
- 合理的定价策略
- 有效的配额管理
- 及时的用户反馈

✅ **运营层面**：
- 完善的文档
- 持续的监控
- 快速的响应
- 数据驱动的优化

### 下一步行动

1. **立即开始**：Fork MkSaaS 仓库，搭建开发环境
2. **设计优先**：完成数据模型和 API 设计
3. **小步快跑**：先实现核心功能，再逐步完善
4. **持续测试**：每个阶段都要充分测试
5. **收集反馈**：尽早让用户试用，根据反馈迭代

---

**文档版本**: 1.0  
**最后更新**: 2025-10-17  
**作者**: Kiro AI Assistant

祝你的 SaaS 产品开发顺利！🚀
