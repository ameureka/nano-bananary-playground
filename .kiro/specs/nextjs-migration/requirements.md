# Next.js App Router 迁移需求文档

## 项目概述

**项目名称**: 香蕉PS乐园 Next.js 迁移  
**当前状态**: Vite + React 19 + React Router v6 单页应用  
**目标状态**: Next.js 15 App Router 多页应用  
**迁移原因**: 
- 提升 SEO 能力
- 改善首屏加载性能
- 利用服务端渲染（SSR）和静态生成（SSG）
- 更好的代码分割和优化
- 统一的全栈开发体验

---

## 术语表 (Glossary)

- **Current App**: 当前基于 Vite + React Router 的单页应用
- **Next.js App Router**: Next.js 13+ 引入的新路由系统，基于文件系统
- **RSC (React Server Components)**: React 服务端组件
- **Client Component**: 需要客户端交互的组件（使用 'use client' 标记）
- **Server Component**: 默认在服务端渲染的组件
- **Zustand Store**: 当前使用的客户端状态管理库
- **Gemini API**: Google 的 AI 服务 API
- **Asset Library**: 资产库，使用 localStorage 存储生成的图片
- **Enhancer**: 图像增强器功能模块
- **Transformation**: 图像变换效果（86种）

---

## 当前架构分析

### ✅ 已实现的 Next.js 兼容性准备

通过分析当前代码，我们发现项目已经进行了"预迁移"重构，具有以下优势：

#### 1. **文件系统路由结构** ✅
```
app/
├── layout.tsx          # 根布局 - 已符合 Next.js 约定
├── page.tsx            # 主页 - 已符合 Next.js 约定
├── chat/
│   └── page.tsx       # 对话页 - 已符合 Next.js 约定
└── library/
    └── page.tsx       # 资产库页 - 已符合 Next.js 约定
```
**符合度**: 95% - 文件结构完全符合 Next.js App Router 约定

#### 2. **组件分层架构** ✅
```
components/
├── common/            # 通用组件（可复用）
├── features/          # 功能模块组件
└── layout/            # 布局组件
```
**符合度**: 100% - 清晰的组件分层，易于迁移

#### 3. **服务层抽象** ✅
```
services/
└── geminiService.ts   # API 调用封装
lib/
└── actions.ts         # 业务逻辑封装
```
**符合度**: 90% - 可直接转换为 Next.js Server Actions

#### 4. **状态管理独立** ✅
```
store/
├── enhancerStore.ts
├── chatStore.ts
├── assetLibraryStore.ts
└── uiStore.ts
```
**符合度**: 100% - Zustand 完全兼容 Next.js 客户端组件

#### 5. **样式系统** ✅
```
styles/
└── globals.css        # Material Design 3 全局样式
```
**符合度**: 100% - CSS 可直接在 Next.js 中使用

---

## 迁移需求 (Requirements)

### Requirement 1: 保持功能完整性

**User Story**: 作为用户，我希望迁移后所有现有功能都能正常工作，体验不受影响。

#### Acceptance Criteria

1. WHEN 用户访问应用时，THE System SHALL 保留所有 86 种图像效果功能
2. WHEN 用户使用 AI 对话时，THE System SHALL 保持多模态对话能力
3. WHEN 用户访问资产库时，THE System SHALL 保留所有图片管理功能
4. WHEN 用户切换语言时，THE System SHALL 保持中英文双语支持
5. WHEN 用户使用蒙版编辑时，THE System SHALL 保留所有编辑工具

### Requirement 2: 最大化代码复用

**User Story**: 作为开发者，我希望迁移过程中最大化复用现有代码，减少重写工作量。

#### Acceptance Criteria

1. THE System SHALL 复用至少 80% 的现有组件代码
2. THE System SHALL 保留所有 Zustand store 的状态管理逻辑
3. THE System SHALL 复用所有工具函数和类型定义
4. THE System SHALL 保留所有国际化翻译文件
5. THE System SHALL 复用所有 Material Design 3 样式

### Requirement 3: 改善性能和 SEO

**User Story**: 作为用户，我希望应用加载更快，搜索引擎能更好地索引内容。

#### Acceptance Criteria

1. WHEN 用户首次访问时，THE System SHALL 在 2 秒内显示首屏内容
2. WHEN 搜索引擎爬虫访问时，THE System SHALL 提供完整的 HTML 内容
3. WHEN 用户导航到新页面时，THE System SHALL 使用预加载优化加载速度
4. THE System SHALL 实现代码分割，按需加载组件
5. THE System SHALL 生成静态页面用于 SEO 优化

### Requirement 4: 保护 API 密钥安全

**User Story**: 作为开发者，我希望 API 密钥不暴露在客户端，提高安全性。

#### Acceptance Criteria

1. THE System SHALL 将 Gemini API 调用移至服务端
2. THE System SHALL 使用 Next.js Server Actions 处理敏感操作
3. THE System SHALL 在环境变量中安全存储 API 密钥
4. THE System SHALL 实现请求速率限制
5. THE System SHALL 添加请求验证和错误处理

### Requirement 5: 平滑过渡和渐进式迁移

**User Story**: 作为开发者，我希望迁移过程分阶段进行，降低风险。

#### Acceptance Criteria

1. THE System SHALL 支持阶段性迁移，每个阶段可独立测试
2. THE System SHALL 在迁移过程中保持应用可运行状态
3. THE System SHALL 提供回滚机制，出现问题时可快速恢复
4. THE System SHALL 记录每个迁移步骤的详细文档
5. THE System SHALL 在每个阶段完成后进行完整测试

### Requirement 6: 利用 Next.js 框架优势

**User Story**: 作为开发者，我希望充分利用 Next.js 的特性提升开发体验。

#### Acceptance Criteria

1. THE System SHALL 使用 Next.js Image 组件优化图片加载
2. THE System SHALL 使用 Next.js Font 优化字体加载
3. THE System SHALL 使用 Server Components 减少客户端 JavaScript
4. THE System SHALL 使用 Streaming 改善用户体验
5. THE System SHALL 使用 Metadata API 优化 SEO

---

## 关键讨论点

### ✅ 决策 1: 客户端状态管理策略

**最终决策**: 方案 A - 保持 Zustand + 'use client'

**实施方案**:
```typescript
// 所有使用 store 的组件标记为 'use client'
'use client';
import { useEnhancerStore } from '@/store/enhancerStore';
import { useChatStore } from '@/store/chatStore';
import { useAssetLibraryStore } from '@/store/assetLibraryStore';
import { useUiStore } from '@/store/uiStore';

export default function EnhancerPage() {
  // 直接使用现有的 Zustand hooks
  const generateImage = useEnhancerStore(s => s.generateImage);
  const isGenerating = useEnhancerStore(s => s.isGenerating);
  // ...
}
```

**决策理由**:
1. ✅ **零改动**: 所有 4 个 store 文件完全复用
2. ✅ **快速迁移**: 降低风险，加快迁移速度
3. ✅ **团队熟悉**: 无需学习新的状态管理方案
4. ✅ **代码复用率**: 100% 复用现有状态管理逻辑
5. ✅ **渐进优化**: Phase 2 可以逐步引入 Server State

**迁移步骤**:
1. 保持所有 store 文件不变（enhancerStore, chatStore, assetLibraryStore, uiStore）
2. 在使用 store 的组件顶部添加 `'use client'` 指令
3. 确保 localStorage 持久化在客户端正常工作
4. 测试所有状态管理功能

**未来优化路径** (Phase 2):
- 考虑将纯展示组件改为 Server Components
- 对于数据获取，可以引入 Server Actions
- 保持 UI 状态用 Zustand，数据状态用 Server State

### ✅ 决策 2: API 调用架构

**最终决策**: 方案 A - Server Actions

**实施方案**:
```typescript
// app/actions/gemini.ts
'use server';
import { GoogleGenAI } from '@google/genai';

// API 密钥只在服务端访问
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
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
    // 复用现有的 geminiService 逻辑
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [...] },
      config: { responseModalities: ['IMAGE'] }
    });
    
    return {
      success: true,
      imageUrl: result.imageUrl,
      text: result.text
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 视频生成 Server Action
 */
export async function generateVideoAction(
  prompt: string,
  imageData: { base64: string; mimeType: string } | null,
  aspectRatio: '16:9' | '9:16'
) {
  // 实现视频生成逻辑
}

/**
 * 对话中生成图像 Server Action
 */
export async function generateImageInChatAction(
  prompt: string,
  history: ChatMessage[],
  settings: ChatGenerationSettings,
  images?: { base64: string; mimeType: string }[]
) {
  // 实现对话生成逻辑
}
```

**客户端调用示例**:
```typescript
// store/enhancerStore.ts
'use client';
import { editImageAction, generateVideoAction } from '@/app/actions/gemini';

export const useEnhancerStore = create<EnhancerStore>((set, get) => ({
  // ...
  generateImage: async () => {
    set({ isGenerating: true, error: null });
    
    try {
      // 调用 Server Action（像调用普通函数一样）
      const result = await editImageAction(
        promptToUse,
        imageParts,
        maskBase64
      );
      
      if (result.success) {
        set({ generatedContent: result });
      } else {
        set({ error: result.error });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isGenerating: false });
    }
  }
}));
```

**决策理由**:
1. ✅ **安全性**: API 密钥完全隐藏在服务端，永不暴露
2. ✅ **简单性**: Server Actions 像普通函数一样调用
3. ✅ **最佳实践**: Next.js 官方推荐的方式
4. ✅ **类型安全**: 完整的 TypeScript 支持
5. ✅ **自动优化**: Next.js 自动处理缓存和重新验证
6. ✅ **错误处理**: 统一的错误处理机制

**迁移映射**:
```typescript
// 现有代码 (lib/actions.ts)
export async function editImageAction(prompt, imageParts, maskBase64) {
  return await editImage(prompt, imageParts, maskBase64);
}

// 迁移后 (app/actions/gemini.ts)
'use server';
export async function editImageAction(prompt, imageParts, maskBase64) {
  // 添加 'use server' 指令
  // 使用 process.env.GEMINI_API_KEY 而不是客户端环境变量
  return await editImage(prompt, imageParts, maskBase64);
}
```

**需要迁移的 API 调用**:
1. ✅ `editImage` → `editImageAction`
2. ✅ `generateImageFromText` → `generateImageFromTextAction`
3. ✅ `generateVideo` → `generateVideoAction`
4. ✅ `generateStyleMimicImage` → `generateStyleMimicImageAction`
5. ✅ `preprocessPrompt` → `preprocessPromptAction`
6. ✅ `generateImageInChat` → `generateImageInChatAction`
7. ✅ `getTransformationSuggestions` → `getTransformationSuggestionsAction`
8. ✅ `generateImageEditsBatch` → `generateImageEditsBatchAction`

**性能优化**:
- 对于大文件（>1MB），考虑使用流式传输
- 实现请求去重和缓存
- 添加请求超时和重试机制

### ✅ 决策 3: 资产库存储方案

**决策**: 选项 D - 混合方案（预留数据库接口）

**实施方案**:
- **Phase 1 (迁移阶段)**: 保持 localStorage
  - ✅ 零改动，快速迁移
  - ✅ 保持现有用户体验
  
- **Phase 2 (未来扩展)**: 预留数据库接口
  - 创建抽象存储层 `StorageAdapter`
  - 实现 `LocalStorageAdapter` (当前)
  - 预留 `DatabaseAdapter` 接口（未来）
  - 预留 `CloudStorageAdapter` 接口（未来）

**架构设计**:
```typescript
interface StorageAdapter {
  saveImage(image: string, metadata: any): Promise<string>;
  getImages(): Promise<ImageRecord[]>;
  deleteImage(id: string): Promise<void>;
}

// 当前实现
class LocalStorageAdapter implements StorageAdapter { ... }

// 未来可扩展
class DatabaseAdapter implements StorageAdapter { ... }
class S3Adapter implements StorageAdapter { ... }
```

### ✅ 决策 4: 路由和导航

**决策**: 保持现有路由结构，仅替换实现

**迁移映射**:
```typescript
// React Router → Next.js
useNavigate()     → useRouter().push()
useLocation()     → usePathname() + useSearchParams()
<Link to="/">     → <Link href="/">
navigate('/chat') → router.push('/chat')
```

**路由结构保持不变**:
```
/           → app/page.tsx         (增强器)
/chat       → app/chat/page.tsx    (AI对话)
/library    → app/library/page.tsx (资产库)
```

**优势**:
- ✅ 用户体验无变化
- ✅ URL 结构保持一致
- ✅ 最小化代码改动
- ✅ SEO 友好的路由结构

### ✅ 决策 5: 国际化方案

**现状**:
- 自定义 i18n Context (`i18n/context.tsx`)
- 370+ 条翻译（中英文）
- 客户端切换语言
- localStorage 持久化

**选项对比分析**:

#### 选项 A: 保持现有方案
**优势**:
- ✅ 零迁移成本
- ✅ 团队完全熟悉
- ✅ 370+ 条翻译无需改动
- ✅ 代码复用率 100%

**劣势**:
- ❌ 无法利用 Next.js SSR 的 i18n 优势
- ❌ 首屏渲染时可能闪烁（语言切换）
- ❌ SEO 不友好（搜索引擎看不到翻译）
- ❌ 无法实现基于 URL 的语言路由 (/en/chat, /zh/chat)

#### 选项 B: next-intl（Next.js 官方推荐）
**优势**:
- ✅ Next.js App Router 原生支持
- ✅ 完美的 SSR/SSG 支持
- ✅ 类型安全（TypeScript 友好）
- ✅ 支持 Server Components
- ✅ 轻量级（~5KB）
- ✅ 现代化 API 设计
- ✅ 支持 URL 路由 (/en, /zh)
- ✅ 自动语言检测

**劣势**:
- ⚠️ 需要重构翻译文件结构
- ⚠️ 需要学习新 API
- ⚠️ 迁移工作量中等

**迁移工作量**:
```typescript
// 现有代码
const { t } = useTranslation();
t('app.title')

// next-intl
const t = useTranslations();
t('app.title')  // API 几乎相同！
```

#### 选项 C: next-i18next（更成熟）
**优势**:
- ✅ 非常成熟稳定（7年+）
- ✅ 大型项目验证
- ✅ 丰富的插件生态
- ✅ 详细的文档

**劣势**:
- ❌ 主要为 Pages Router 设计
- ❌ App Router 支持不完善
- ❌ 较重（~20KB）
- ❌ 配置复杂
- ❌ 不支持 Server Components（需要 workaround）

---

### 📊 推荐方案对比表

| 特性 | 保持现有 | next-intl | next-i18next |
|------|---------|-----------|--------------|
| **迁移成本** | 🟢 零成本 | 🟡 中等 | 🔴 较高 |
| **App Router 支持** | 🔴 无 | 🟢 完美 | 🟡 部分 |
| **SSR/SSG** | 🔴 不支持 | 🟢 完美 | 🟢 支持 |
| **Server Components** | 🔴 不支持 | 🟢 支持 | 🔴 不支持 |
| **类型安全** | 🟢 有 | 🟢 完美 | 🟡 部分 |
| **包大小** | 🟢 ~2KB | 🟢 ~5KB | 🟡 ~20KB |
| **SEO 友好** | 🔴 差 | 🟢 优秀 | 🟢 良好 |
| **学习曲线** | 🟢 无 | 🟢 平缓 | 🟡 陡峭 |
| **未来维护** | 🟡 自维护 | 🟢 官方支持 | 🟢 社区活跃 |

---

### ✅ 最终决策：next-intl

**决策理由**:
1. **最佳实践**: Next.js 官方推荐，专为 App Router 设计
2. **平滑迁移**: API 与现有方案相似，迁移成本可控
3. **长期价值**: 完美的 SSR/SEO 支持，提升用户体验
4. **类型安全**: 完整的 TypeScript 支持
5. **轻量级**: 不会显著增加包体积（仅 5KB）

**渐进式迁移策略**:

#### Phase 1: 基础迁移（Week 1-2）
- ✅ 保持现有 i18n/context.tsx
- ✅ 所有 370+ 条翻译文件不动
- ✅ 快速完成 Next.js 基础架构迁移
- ✅ 降低风险，确保应用可运行

#### Phase 2: 准备 next-intl（Week 3）
- 📦 安装 next-intl: `npm install next-intl`
- 📁 创建 messages/ 目录结构
- 🔧 编写自动转换脚本（TS → JSON）
- 🧪 在测试环境验证 next-intl 配置

#### Phase 3: 并行运行（Week 4）
- 🔄 两套 i18n 方案共存
- 🧪 选择简单页面（如 library）测试 next-intl
- 📊 对比性能和 SEO 效果
- 🐛 修复发现的问题

#### Phase 4: 逐步切换（Week 5-6）
- 📄 逐页迁移到 next-intl
  - Week 5: library + enhancer
  - Week 6: chat + 共享组件
- ✅ 每个页面迁移后完整测试
- 📝 记录遇到的问题和解决方案

#### Phase 5: 完全切换（Week 7）
- 🗑️ 移除旧的 i18n/context.tsx
- 🧹 清理旧翻译文件
- ✅ 完整回归测试
- 📚 更新文档

**自动转换脚本示例**:
```typescript
// scripts/convert-i18n.ts
import fs from 'fs';
import path from 'path';

// 读取现有翻译文件
import { zh } from '../i18n/zh';
import { en } from '../i18n/en';

// 转换为 next-intl 格式
const convertToNextIntl = (translations: any) => {
  return JSON.stringify(translations, null, 2);
};

// 写入新文件
fs.writeFileSync(
  path.join(__dirname, '../messages/zh.json'),
  convertToNextIntl(zh)
);

fs.writeFileSync(
  path.join(__dirname, '../messages/en.json'),
  convertToNextIntl(en)
);

console.log('✅ 翻译文件转换完成！');
```

**URL 路由策略**:
```
默认路由（自动检测语言）:
  https://your-app.com/          → 根据浏览器语言自动跳转
  https://your-app.com/chat      → 自动检测

显式语言路由:
  https://your-app.com/zh        → 中文主页
  https://your-app.com/zh/chat   → 中文对话页
  https://your-app.com/en        → 英文主页
  https://your-app.com/en/chat   → 英文对话页
```

**代码迁移示例**:
```typescript
// 现有代码 (保持不变)
const { t } = useTranslation();
t('app.title')
t('app.advancedMode.clicksRemaining', { count: 3 })

// next-intl 代码 (API 几乎相同！)
const t = useTranslations();
t('app.title')
t('app.advancedMode.clicksRemaining', { count: 3 })

// 只需要改变导入语句！
// import { useTranslation } from '../i18n/context';
// import { useTranslations } from 'next-intl';
```

---

## 🏗️ Phase 1 架构预留方案（MKSAAS 集成准备）

### 背景说明

基于对 MKSAAS 框架的深入分析，我们确定采用**分阶段集成策略**：
- **Phase 1**: Next.js 基础迁移（7-8周）+ 架构预留
- **Phase 2**: Tailwind CSS 迁移（4-6周）
- **Phase 3**: MKSAAS 集成（8-12周）

在 Phase 1 中，虽然不实现 MKSAAS 的完整功能，但必须做好**架构预留**，以确保未来能够平滑集成。这些预留工作投入约 5 天，但可以节省 Phase 3 的 6-7 周重构时间，**投资回报率约 800-1000%**。

详细的 MKSAAS 集成策略请参考：[mksaas-integration-strategy.md](./mksaas-integration-strategy.md)

---

### Requirement 7: MKSAAS 架构预留

**User Story**: 作为开发者，我希望在 Phase 1 迁移中预留 MKSAAS 集成接口，以便未来能够平滑集成 SaaS 功能，避免大规模重构。

#### Acceptance Criteria

1. THE System SHALL 实现数据层抽象接口，支持未来从 localStorage 切换到数据库
2. THE System SHALL 预留用户上下文接口，支持未来从匿名用户切换到真实用户
3. THE System SHALL 实现 API 调用层抽象，预留配额检查和使用记录接口
4. THE System SHALL 在数据库表设计中预留 userId 字段和 JSONB metadata 字段
5. THE System SHALL 遵循 MKSAAS 环境变量命名规范，预留未来需要的配置项

---

### 必须做的 5 个架构预留

#### ✅ 预留 1: 数据层抽象

**投入**: 1天  
**收益**: 节省 Phase 3 的 2周重构时间  
**优先级**: 🔴 P0

**实施要求**:

```typescript
// lib/storage/adapter.ts
export interface StorageAdapter {
  // 资产管理
  saveAsset(asset: Asset): Promise<string>;
  getAssets(userId: string, filters?: AssetFilters): Promise<Asset[]>;
  deleteAsset(id: string): Promise<void>;
  
  // 用户偏好
  savePreferences(userId: string, prefs: UserPreferences): Promise<void>;
  getPreferences(userId: string): Promise<UserPreferences>;
}

// lib/storage/local-storage-adapter.ts
export class LocalStorageAdapter implements StorageAdapter {
  // Phase 1: localStorage 实现
  async saveAsset(asset: Asset): Promise<string> {
    const assets = JSON.parse(localStorage.getItem('assets') || '[]');
    assets.push(asset);
    localStorage.setItem('assets', JSON.stringify(assets));
    return asset.id;
  }
  // ... 其他方法实现
}

// lib/storage/index.ts
// Phase 1: 使用 localStorage
export const storage: StorageAdapter = new LocalStorageAdapter();

// Phase 3: 切换到数据库（只需改这一行）
// export const storage: StorageAdapter = new DatabaseAdapter();
```

**验收标准**:
- [ ] 创建 `StorageAdapter` 接口定义
- [ ] 实现 `LocalStorageAdapter` 类
- [ ] 所有数据操作都通过适配器接口
- [ ] 预留 `DatabaseAdapter` 接口注释

---

#### ✅ 预留 2: 用户上下文预留

**投入**: 0.5天  
**收益**: 节省 Phase 3 的 1周重构时间  
**优先级**: 🔴 P0

**实施要求**:

```typescript
// types/user.ts
export interface UserContext {
  id: string;  // Phase 1: session ID, Phase 3: real userId
  isAnonymous: boolean;
  email?: string;  // Phase 3 添加
  plan?: 'free' | 'pro' | 'lifetime';  // Phase 3 添加
  credits?: number;  // Phase 3 添加
  settings: UserSettings;
}

// lib/user-context.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext<UserContext | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContext | null>(null);
  
  useEffect(() => {
    // Phase 1: 创建匿名用户
    const sessionId = getOrCreateSessionId();
    const settings = loadSettings(sessionId);
    
    setUser({
      id: sessionId,
      isAnonymous: true,
      settings
    });
    
    // Phase 3: 从认证系统获取真实用户（预留代码，注释掉）
    // const session = await auth.api.getSession();
    // if (session) {
    //   setUser({
    //     id: session.user.id,
    //     isAnonymous: false,
    //     email: session.user.email,
    //     plan: session.user.plan,
    //     credits: session.user.credits,
    //     settings: await loadUserSettings(session.user.id)
    //   });
    // }
  }, []);
  
  if (!user) return <LoadingSpinner />;
  
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

**验收标准**:
- [ ] 定义 `UserContext` 接口（包含未来字段）
- [ ] 实现 `UserProvider` 组件
- [ ] 实现 `useUser` hook
- [ ] 在根布局中使用 `UserProvider`
- [ ] 预留 Phase 3 认证代码（注释）

---

#### ✅ 预留 3: API 调用层抽象

**投入**: 1天  
**收益**: 节省 Phase 3 的 1-2周重构时间  
**优先级**: 🔴 P0

**实施要求**:

```typescript
// lib/api/image-api.ts
export interface ImageGenerationParams {
  prompt: string;
  effect?: string;
  userId?: string;  // Phase 1: 可选, Phase 3: 必填
  images?: string[];
  mask?: string;
  aspectRatio?: string;
}

export async function generateImage(
  params: ImageGenerationParams
): Promise<ImageGenerationResult> {
  // Phase 1: 直接调用 Gemini Service
  const startTime = Date.now();
  
  const result = await geminiService.generateImage({
    prompt: params.prompt,
    effect: params.effect,
    images: params.images,
    mask: params.mask,
    aspectRatio: params.aspectRatio
  });
  
  const generationTime = Date.now() - startTime;
  
  // Phase 3: 添加配额检查（预留代码，注释掉）
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
    url: result.imageUrl,
    prompt: params.prompt,
    effect: params.effect,
    metadata: {
      generationTime
    },
    createdAt: new Date()
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

// Phase 3: 配额管理函数（预留接口定义）
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

**验收标准**:
- [ ] 创建统一的 API 函数接口
- [ ] 所有 API 调用都通过统一接口
- [ ] 预留配额检查接口（注释）
- [ ] 预留使用记录接口（注释）
- [ ] 添加完整的错误处理

---

#### ✅ 预留 4: 数据库表设计预留

**投入**: 2天  
**收益**: 节省 Phase 3 的 2-3周重构时间  
**优先级**: 🔴 P0

**实施要求**:

```typescript
// db/schema/assets.ts
import { pgTable, uuid, text, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';

export const assets = pgTable('assets', {
  // 主键
  id: uuid('id').primaryKey().defaultRandom(),
  
  // 🔑 关键：预留 userId 字段
  // Phase 1: nullable, Phase 3: NOT NULL + FK
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
    // Phase 3 可以添加更多字段，无需修改表结构
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
  
  // 通知偏好（Phase 3 使用）
  emailNotifications: boolean('email_notifications').default(true),
  
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**数据库选择建议**: **Neon PostgreSQL**（与 MKSAAS 完全兼容，无需数据迁移）

**验收标准**:
- [ ] 所有业务表都预留 `userId` 字段（nullable）
- [ ] 使用 UUID 作为主键
- [ ] 添加 `metadata` JSONB 字段
- [ ] 添加 `createdAt`, `updatedAt`, `deletedAt` 时间戳
- [ ] 创建必要的索引
- [ ] 使用 Drizzle ORM
- [ ] 编写数据库迁移脚本

---

#### ✅ 预留 5: 环境变量标准化

**投入**: 0.25天（2小时）  
**收益**: 节省 Phase 3 的 2-3天  
**优先级**: 🟡 P1

**实施要求**:

```bash
# .env.example

# ============================================
# 数据库配置（Phase 1 需要）
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/dbname

# ============================================
# AI 服务配置（Phase 1 需要）
# ============================================
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # 可选

# ============================================
# 文件存储配置（Phase 1 需要）
# ============================================
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket.r2.dev

# ============================================
# 应用配置
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Nano Bananary"

# ============================================
# 认证配置（Phase 3 需要，现在预留）
# ============================================
# BETTER_AUTH_SECRET=
# BETTER_AUTH_URL=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=

# ============================================
# 支付配置（Phase 3 需要，现在预留）
# ============================================
# STRIPE_SECRET_KEY=
# STRIPE_PUBLISHABLE_KEY=
# STRIPE_WEBHOOK_SECRET=

# ============================================
# 邮件配置（Phase 3 需要，现在预留）
# ============================================
# RESEND_API_KEY=

# ============================================
# 分析配置（可选）
# ============================================
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_UMAMI_ID=
```

**类型安全验证**:

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Phase 1 需要的变量
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Nano Bananary'),
  
  // Phase 3 需要的变量（optional）
  BETTER_AUTH_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

**验收标准**:
- [ ] 创建 `.env.example` 模板
- [ ] 遵循 MKSAAS 命名规范
- [ ] 使用 Zod 进行类型验证
- [ ] 区分公开变量（`NEXT_PUBLIC_`）和私密变量
- [ ] 添加注释说明每个变量的用途
- [ ] 预留 Phase 3 需要的变量（注释）

---

### 架构预留实施检查清单

**Phase 1 必须完成**:
- [ ] ✅ 预留 1: 数据层抽象（1天）
- [ ] ✅ 预留 2: 用户上下文预留（0.5天）
- [ ] ✅ 预留 3: API 调用层抽象（1天）
- [ ] ✅ 预留 4: 数据库表设计预留（2天）
- [ ] ✅ 预留 5: 环境变量标准化（0.25天）

**总投入**: 约 4.75天（38小时）  
**预期收益**: 节省 Phase 3 的 6-7周（280-320小时）  
**投资回报率**: 约 636-742%

**Phase 1 不应该做**:
- [ ] ❌ 不引入 Better Auth 认证系统
- [ ] ❌ 不集成 Stripe 支付系统
- [ ] ❌ 不实现配额管理逻辑
- [ ] ❌ 不重构所有组件为 MKSAAS UI
- [ ] ❌ 不过度设计未来功能

---

### 投资回报分析

| 项目 | Phase 1 投入 | Phase 3 节省 | ROI |
|------|-------------|-------------|-----|
| 数据层抽象 | 1天 | 2周 | 900% |
| 用户上下文 | 0.5天 | 1周 | 900% |
| API 调用层 | 1天 | 1-2周 | 600-900% |
| 数据库设计 | 2天 | 2-3周 | 400-650% |
| 环境变量 | 0.25天 | 2-3天 | 700-1100% |
| **总计** | **4.75天** | **6-7周** | **636-742%** |

**结论**: Phase 1 的架构预留是一项**高回报投资**，强烈建议执行。

---

---

## 📊 迁移风险评估（基于已确定决策）

### 🔴 高风险项（需要重点关注）

#### 1. API 调用迁移到 Server Actions
**风险等级**: 🔴 高  
**影响范围**: 8 个核心 API 函数  
**风险描述**:
- 需要重构所有 `services/geminiService.ts` 中的函数
- 需要修改所有调用这些函数的地方
- 大文件（base64 图片）传输可能有性能问题

**缓解措施**:
- ✅ 保持函数签名和返回值结构不变
- ✅ 先迁移简单的 API（如文本生成）
- ✅ 再迁移复杂的 API（如图像编辑）
- ✅ 对每个 API 进行充分测试
- ✅ 实现错误处理和重试机制
- ✅ 监控 Server Action 性能

**迁移优先级**: P0（第一阶段）

---

#### 2. localStorage 在 SSR 中的处理
**风险等级**: 🔴 高  
**影响范围**: 资产库、用户设置、语言偏好  
**风险描述**:
- localStorage 在服务端不可用
- 首次渲染时可能出现水合错误（hydration mismatch）
- 需要处理客户端和服务端状态不一致

**缓解措施**:
- ✅ 所有使用 localStorage 的组件标记为 'use client'
- ✅ 使用 `useEffect` 在客户端加载数据
- ✅ 提供合理的默认值
- ✅ 实现 loading 状态避免闪烁

**示例代码**:
```typescript
'use client';
import { useEffect, useState } from 'react';

export function AssetLibrary() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 只在客户端加载
    const stored = localStorage.getItem('images');
    if (stored) {
      setImages(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);
  
  if (isLoading) return <LoadingSpinner />;
  return <ImageGrid images={images} />;
}
```

**迁移优先级**: P0（第一阶段）

---

### 🟡 中风险项（需要注意）

#### 3. React Router 到 Next.js Router 的迁移
**风险等级**: 🟡 中  
**影响范围**: 所有使用路由的组件  
**风险描述**:
- 需要替换所有 `useNavigate`、`useLocation`、`<Link>` 等
- API 略有不同，可能导致行为变化

**缓解措施**:
- ✅ 创建迁移映射表
- ✅ 使用全局搜索替换
- ✅ 逐个文件测试

**迁移映射**:
```typescript
// React Router → Next.js
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useRouter, usePathname, Link } from 'next/navigation';

const navigate = useNavigate();          → const router = useRouter();
navigate('/chat')                        → router.push('/chat')
const location = useLocation();          → const pathname = usePathname();
location.pathname                        → pathname
<Link to="/chat">                        → <Link href="/chat">
```

**迁移优先级**: P1（第二阶段）

---

#### 4. 国际化方案迁移
**风险等级**: 🟡 中  
**影响范围**: 370+ 条翻译，所有使用 `t()` 的地方  
**风险描述**:
- 需要转换翻译文件格式
- 需要更新所有使用 i18n 的组件
- 可能出现翻译缺失或格式错误

**缓解措施**:
- ✅ 编写自动转换脚本
- ✅ 分阶段迁移（7 周计划）
- ✅ 两套方案可共存
- ✅ 充分测试每个翻译

**迁移优先级**: P2（第三阶段）

---

#### 5. 样式系统在 SSR 中的兼容性
**风险等级**: 🟡 中  
**影响范围**: 全局样式、Material Design 3  
**风险描述**:
- CSS 在 SSR 中可能出现闪烁（FOUC）
- 动态样式可能不工作

**缓解措施**:
- ✅ 使用 Next.js 推荐的 CSS 导入方式
- ✅ 在 `app/layout.tsx` 中导入全局样式
- ✅ 测试所有页面的样式渲染

**示例代码**:
```typescript
// app/layout.tsx
import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**迁移优先级**: P1（第二阶段）

---

### 🟢 低风险项（可以放心）

#### 6. 组件复用
**风险等级**: 🟢 低  
**影响范围**: 50+ 个 React 组件  
**风险描述**: 几乎无风险  
**理由**:
- ✅ 组件代码完全兼容
- ✅ 只需添加 'use client' 指令
- ✅ Props 和逻辑无需改动

**迁移优先级**: P1（第二阶段）

---

#### 7. 类型定义和工具函数
**风险等级**: 🟢 低  
**影响范围**: types.ts, utils/, constants.ts  
**风险描述**: 几乎无风险  
**理由**:
- ✅ 纯 TypeScript 代码，完全兼容
- ✅ 工具函数是纯函数，无副作用
- ✅ 可以直接复制粘贴

**迁移优先级**: P0（第一阶段）

---

### 📈 风险缓解总体策略

1. **分阶段迁移**: 每个阶段独立测试，降低风险
2. **保持可回滚**: 使用 Git 分支，随时可以回退
3. **充分测试**: 每个功能迁移后立即测试
4. **文档记录**: 记录所有遇到的问题和解决方案
5. **团队沟通**: 及时同步进度和问题

---

### 🎯 风险优先级排序

| 优先级 | 风险项 | 风险等级 | 迁移阶段 |
|--------|--------|---------|---------|
| P0 | API 调用迁移 | 🔴 高 | Phase 1 |
| P0 | localStorage 处理 | 🔴 高 | Phase 1 |
| P0 | 类型定义复用 | 🟢 低 | Phase 1 |
| P1 | 路由迁移 | 🟡 中 | Phase 2 |
| P1 | 样式系统 | 🟡 中 | Phase 2 |
| P1 | 组件复用 | 🟢 低 | Phase 2 |
| P2 | 国际化迁移 | 🟡 中 | Phase 3 |

---

## 成功标准

迁移成功的标准：

1. ✅ 所有功能正常工作
2. ✅ 首屏加载时间 < 2 秒
3. ✅ Lighthouse 性能分数 > 90
4. ✅ SEO 分数 > 90
5. ✅ 无控制台错误或警告
6. ✅ 所有测试通过
7. ✅ API 密钥不暴露在客户端
8. ✅ 代码复用率 > 80%

---

---

## 剩余关键决策点

### ~~🔴 待讨论 1: 客户端状态管理策略~~ ✅ 已决策

**现状**: 
- 使用 Zustand 管理所有状态（enhancer, chat, library, ui）
- localStorage 持久化部分状态
- 完全客户端运行

**核心问题**: 
- Zustand 在 Server Components 中不可用
- 需要决定哪些组件应该是 Server Components，哪些是 Client Components

**推荐方案 A: 保持 Zustand + 'use client'** ⭐
```typescript
// 所有使用 store 的组件标记为 'use client'
'use client';
import { useEnhancerStore } from '@/store/enhancerStore';

export default function EnhancerPage() {
  const generateImage = useEnhancerStore(s => s.generateImage);
  // ...
}
```

**优势**:
- ✅ 零改动，直接复用所有 store 代码
- ✅ 团队完全熟悉
- ✅ 代码复用率 100%
- ✅ 快速迁移

**劣势**:
- ⚠️ 所有使用 store 的组件都是客户端组件
- ⚠️ 无法利用 Server Components 的优势

**推荐方案 B: 混合方案（UI 状态 + Server State）**
```typescript
// UI 状态继续用 Zustand
'use client';
const isAdvancedMode = useUiStore(s => s.isAdvancedMode);

// 数据获取用 Server Components + Server Actions
// app/page.tsx (Server Component)
export default async function Page() {
  const effects = await getEffects(); // Server Action
  return <EnhancerClient effects={effects} />;
}
```

**优势**:
- ✅ 充分利用 Server Components
- ✅ 更好的 SEO 和性能
- ✅ 减少客户端 JavaScript

**劣势**:
- ⚠️ 需要重构部分代码
- ⚠️ 学习曲线
- ⚠️ 迁移工作量增加

**我的建议**: 
- **Phase 1**: 使用方案 A（保持 Zustand），快速完成迁移
- **Phase 2**: 逐步引入方案 B，优化性能

**你的选择**: 你倾向于哪个方案？

---

### ~~🔴 待讨论 2: API 调用架构~~ ✅ 已决策

**现状**:
- `services/geminiService.ts` 在客户端直接调用 Gemini API
- API 密钥暴露在客户端（安全风险）
- 所有 API 调用都是客户端发起

**核心问题**: 
- 如何保护 API 密钥？
- 如何平衡安全性和开发便利性？

**推荐方案 A: Server Actions** ⭐
```typescript
// app/actions/gemini.ts
'use server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY // 服务端环境变量
});

export async function generateImageAction(prompt: string, imageData: string) {
  // API 调用在服务端执行
  const result = await ai.models.generateContent({...});
  return result;
}

// 客户端调用
'use client';
import { generateImageAction } from '@/app/actions/gemini';

const handleGenerate = async () => {
  const result = await generateImageAction(prompt, imageData);
  // ...
};
```

**优势**:
- ✅ API 密钥完全隐藏在服务端
- ✅ 简单直接，类似函数调用
- ✅ 自动处理序列化
- ✅ 内置错误处理

**劣势**:
- ⚠️ 需要重构所有 API 调用
- ⚠️ 大文件传输（base64 图片）可能有性能问题

**推荐方案 B: API Routes**
```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  const { prompt, imageData } = await request.json();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const result = await ai.models.generateContent({...});
  return NextResponse.json(result);
}

// 客户端调用
const response = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt, imageData })
});
```

**优势**:
- ✅ 更灵活的控制
- ✅ 可以添加中间件（认证、限流等）
- ✅ 更适合大文件传输

**劣势**:
- ⚠️ 需要手动处理序列化
- ⚠️ 更多样板代码

**推荐方案 C: 混合方案**
```typescript
// 简单操作用 Server Actions
export async function generateTextAction(prompt: string) { ... }

// 复杂操作（大文件）用 API Routes
// app/api/generate-image/route.ts
export async function POST(request: NextRequest) { ... }
```

**我的建议**: 
- **推荐方案 A（Server Actions）** 作为主要方案
- 对于大文件上传（>1MB），使用 API Routes
- 理由：Server Actions 更简单，更符合 Next.js 最佳实践

**你的选择**: 你倾向于哪个方案？

---

## 🎯 所有关键决策总结

### ✅ 已确定的 6 个核心决策

1. ✅ **状态管理策略**: 保持 Zustand + 'use client'
   - 100% 复用现有 store 代码
   - 所有使用 store 的组件标记为客户端组件
   - Phase 2 可渐进优化

2. ✅ **API 调用架构**: Server Actions
   - 所有 Gemini API 调用移至服务端
   - API 密钥完全隐藏
   - 8 个主要 API 函数需要迁移

3. ✅ **存储方案**: 混合方案（localStorage + 预留数据库接口）
   - Phase 1 保持 localStorage
   - 实现 StorageAdapter 抽象层
   - 预留数据库和云存储接口

4. ✅ **路由结构**: 保持现有结构，替换实现
   - 使用 Next.js `useRouter` 和 `usePathname`
   - 替换 React Router 的 `<Link>`
   - URL 结构完全不变

5. ✅ **国际化方案**: 渐进式迁移到 next-intl
   - 7 周分阶段迁移计划
   - 自动转换脚本（TS → JSON）
   - 支持 URL 语言路由（/zh, /en）

6. ✅ **样式系统策略**: 分阶段迁移（先 Next.js，再 Tailwind CSS）
   - Phase 1: 保持 Material Design 3 样式系统
   - Phase 2: 未来迁移到 Tailwind CSS（4-6周）
   - 降低风险，渐进式现代化改造

---

## ✅ 决策 6: 样式系统迁移策略

**最终决策**: 方案 B - 分阶段迁移（先 Next.js，再 Tailwind CSS）

### 决策背景

当前应用使用 Material Design 3 全局样式系统（~2000行CSS + 100+个CSS变量）。未来计划迁移到 Tailwind CSS 以实现现代化改造。

### 方案对比

#### 方案 A: 本次迁移中同时引入 Tailwind CSS
**优势**:
- ✅ 一次性完成现代化改造
- ✅ 避免二次迁移成本
- ✅ 最终架构一步到位

**劣势**:
- 🔴 迁移复杂度大幅增加（风险叠加）
- 🔴 工作量翻倍（11-14周 vs 7-8周）
- 🔴 样式重写工作量巨大（50+组件）
- 🔴 Material Design 3 适配困难
- 🔴 问题难以定位（Next.js还是Tailwind？）

#### 方案 B: 先完成 Next.js 迁移，再引入 Tailwind CSS ⭐
**优势**:
- ✅ 风险可控（一次只处理一个大变更）
- ✅ 渐进式改进（每个阶段都有明确回滚点）
- ✅ 团队学习曲线平缓
- ✅ 可以选择性迁移（新旧组件可共存）
- ✅ 更好的时间规划

**劣势**:
- ⚠️ 需要二次迁移
- ⚠️ 短期内两套样式系统共存

### 最终决策：方案 B

**决策理由**:
1. **风险管理**: 同时迁移风险极高（高×高=极高），分阶段风险可控（中等）
2. **时间可预测**: 每个阶段都有明确目标和验收标准
3. **质量保证**: 充分的测试和验证时间
4. **团队压力**: 学习曲线平缓，避免同时学习两个新技术
5. **灵活性**: 可根据实际情况调整 Phase 2 计划

### 实施计划

#### Phase 1: Next.js 迁移（7-8周）- 本次迁移范围

**样式系统策略**:
- ✅ **保持现有 Material Design 3 样式系统**
- ✅ **保持 styles/globals.css 不变**
- ✅ **所有组件样式保持原样**
- ✅ **专注于架构和功能迁移**

**具体措施**:
```typescript
// app/layout.tsx
import '@/styles/globals.css';  // 直接导入现有样式

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        {/* 保持所有现有的 className 和样式 */}
        {children}
      </body>
    </html>
  );
}
```

**为 Tailwind 做准备**（不影响当前迁移）:
1. ✅ 保持组件结构清晰
2. ✅ 避免过度使用内联样式
3. ✅ 使用语义化的 className
4. ✅ 文档化设计系统（颜色、间距、圆角等）

#### Phase 2: Tailwind CSS 迁移（4-6周）- 未来计划

**前提条件**: Next.js 迁移完成，应用稳定运行

**迁移路线图**:
```
Week 1: 准备和配置
  - 安装 Tailwind CSS
  - 配置 MD3 颜色到 Tailwind theme
  - 设置 PostCSS 和 autoprefixer
  - 创建 Tailwind 配置文件

Week 2-3: 逐步迁移组件
  - 从简单组件开始（Button, Card, Badge）
  - 保持旧样式作为备份
  - 两套系统共存，逐步切换

Week 4-5: 迁移复杂组件
  - 布局组件（Sidebar, TopAppBar, BottomNav）
  - 功能组件（TransformationSelector, ResultDisplay）
  - 逐步移除旧样式

Week 6: 清理和优化
  - 移除旧的 globals.css
  - 优化 Tailwind 配置
  - 性能测试和优化
  - 文档更新
```

**Tailwind + Material Design 3 集成示例**:
```javascript
// tailwind.config.js (Phase 2)
module.exports = {
  theme: {
    extend: {
      colors: {
        // 映射 MD3 颜色到 Tailwind
        primary: '#6750A4',
        'on-primary': '#FFFFFF',
        'primary-container': '#EADDFF',
        'on-primary-container': '#21005D',
        // ... 其他 MD3 颜色
      },
      borderRadius: {
        'md3-xs': '4px',
        'md3-sm': '8px',
        'md3-md': '12px',
        'md3-lg': '16px',
        'md3-xl': '28px',
      }
    }
  }
}
```

### 风险评估

**Phase 1 风险**（本次迁移）:
- 🟢 **样式风险**: 极低（完全保持不变）
- 🟡 **架构风险**: 中等（Next.js 迁移）
- 🟢 **总体风险**: 中等（可控）

**Phase 2 风险**（未来）:
- 🟢 **样式风险**: 低（在稳定基础上进行）
- 🟢 **架构风险**: 极低（Next.js 已稳定）
- 🟢 **总体风险**: 低

### 成功标准

**Phase 1 完成标准**:
- ✅ Next.js 迁移完成
- ✅ 所有功能正常工作
- ✅ Material Design 3 样式完全保留
- ✅ 无样式相关的 bug
- ✅ 性能指标达标

**Phase 2 完成标准**（未来）:
- ✅ 所有组件迁移到 Tailwind
- ✅ 移除旧的 globals.css
- ✅ Material Design 3 视觉效果保持一致
- ✅ CSS 包体积减小
- ✅ 开发体验提升

---

## ✅ 需求文档完成状态

### 📋 文档完整性检查

- [x] 项目概述和迁移原因
- [x] 术语表定义
- [x] 当前架构分析（5 个方面）
- [x] 6 个核心需求（EARS 格式）
- [x] 6 个关键决策（全部确定）✨ 新增样式系统决策
- [x] 详细的风险评估（7 个风险项）
- [x] 成功标准定义

### 🎯 下一步行动

**需求阶段已完成！** 现在可以进入设计阶段。

**接下来我们将**:
1. ✅ 需求文档已完成 ← **当前状态**
2. 📝 创建详细的设计文档（design.md）
3. 📋 制定实施计划（tasks.md）
4. 🚀 开始分阶段迁移

---

## 💬 准备好进入设计阶段了吗？

**设计文档将包含**:
- 详细的技术架构设计
- 组件结构和数据流
- Server Actions 实现细节
- 国际化迁移方案
- 分阶段迁移计划（7-8 周）
- 每个阶段的具体任务

**请确认**: 你是否对当前的需求文档满意？是否需要调整任何决策？

如果满意，请回复 **"进入设计阶段"** 或 **"继续"**，我将立即创建设计文档！
