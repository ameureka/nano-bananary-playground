# Next.js App Router 迁移需求规格说明书

**文档版本**: 2.0  
**创建日期**: 2025-10-27  
**最后更新**: 2025-10-27  
**文档状态**: ✅ 已确认  
**项目名称**: 香蕉PS乐园 Next.js 迁移  
**项目代号**: NEXTJS-MIGRATION-PHASE1

---

## 📋 文档修订历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|---------|
| 1.0 | 2025-10-27 | Kiro AI | 初始版本，包含基础需求 |
| 2.0 | 2025-10-27 | Kiro AI | 重构版本，添加 MKSAAS 架构预留需求，按软件工程方法论重新组织 |

---

## 1. 引言

### 1.1 文档目的

本文档定义了香蕉PS乐园从 Vite + React 单页应用迁移到 Next.js 15 App Router 多页应用的完整需求规格。文档遵循 EARS (Easy Approach to Requirements Syntax) 和 INCOSE 语义质量规则，确保需求的清晰性、可测试性和可追溯性。

### 1.2 项目范围

**当前状态**:
- 技术栈: Vite + React 19 + React Router v6
- 架构: 客户端单页应用 (SPA)
- 状态管理: Zustand
- 样式系统: Material Design 3 (CSS)
- 国际化: 自定义 i18n Context
- API 调用: 客户端直接调用 Gemini API

**目标状态**:
- 技术栈: Next.js 15 + React 19 + App Router
- 架构: 服务端渲染 (SSR) + 静态生成 (SSG)
- 状态管理: Zustand (客户端组件)
- 样式系统: Material Design 3 (Phase 1), Tailwind CSS (Phase 2)
- 国际化: next-intl
- API 调用: Next.js Server Actions

**迁移阶段**:
- **Phase 1**: Next.js 基础迁移 + MKSAAS 架构预留（7-8周）← 本文档范围
- **Phase 2**: Tailwind CSS 迁移（4-6周）
- **Phase 3**: MKSAAS 完整集成（8-12周）

### 1.3 预期收益

1. **性能提升**: 首屏加载时间 < 2秒，Lighthouse 分数 > 90
2. **SEO 优化**: 完整的 HTML 内容，搜索引擎友好
3. **安全增强**: API 密钥隐藏在服务端
4. **代码复用**: 80%+ 现有代码可复用
5. **未来扩展**: 为 MKSAAS SaaS 化预留架构接口

### 1.4 参考文档

- [MKSAAS 集成策略文档](./mksaas-integration-strategy.md)
- [Next.js 15 官方文档](https://nextjs.org/docs)
- [EARS 需求规范](https://www.iaria.org/conferences2012/filesICCGI12/Tutorial%20ICCGI%202012%20EARS.pdf)
- [INCOSE 需求质量规则](https://www.incose.org/)

---

## 2. 术语表 (Glossary)

| 术语 | 定义 |
|------|------|
| **System** | 香蕉PS乐园应用系统 |
| **Current App** | 当前基于 Vite + React Router 的单页应用 |
| **Next.js App Router** | Next.js 13+ 引入的新路由系统，基于文件系统 |
| **RSC** | React Server Components，React 服务端组件 |
| **Client Component** | 需要客户端交互的组件，使用 'use client' 标记 |
| **Server Component** | 默认在服务端渲染的组件 |
| **Server Action** | Next.js 服务端函数，用于处理表单提交和数据变更 |
| **Zustand Store** | 当前使用的客户端状态管理库 |
| **Gemini API** | Google 的 AI 服务 API |
| **Asset Library** | 资产库，存储用户生成的图片 |
| **Enhancer** | 图像增强器功能模块 |
| **Transformation** | 图像变换效果（86种） |
| **MKSAAS** | 企业级 SaaS 快速开发框架 |
| **StorageAdapter** | 存储适配器接口，用于抽象数据存储层 |
| **UserContext** | 用户上下文接口，包含用户信息和设置 |
| **Phase 1/2/3** | 迁移的三个阶段 |
| **EARS** | Easy Approach to Requirements Syntax，需求编写规范 |
| **INCOSE** | International Council on Systems Engineering，系统工程国际委员会 |

---

## 3. 系统概述

### 3.1 当前系统架构分析

#### 3.1.1 已实现的 Next.js 兼容性准备

通过对当前代码的分析，项目已经进行了"预迁移"重构，具有以下优势：

**文件系统路由结构** (符合度: 95%)
```
app/
├── layout.tsx          # 根布局 - 已符合 Next.js 约定
├── page.tsx            # 主页 - 已符合 Next.js 约定
├── chat/page.tsx       # 对话页 - 已符合 Next.js 约定
└── library/page.tsx    # 资产库页 - 已符合 Next.js 约定
```

**组件分层架构** (符合度: 100%)
```
components/
├── common/            # 通用组件（可复用）
├── features/          # 功能模块组件
└── layout/            # 布局组件
```

**服务层抽象** (符合度: 90%)
```
services/geminiService.ts   # API 调用封装
lib/actions.ts              # 业务逻辑封装
```

**状态管理独立** (符合度: 100%)
```
store/
├── enhancerStore.ts
├── chatStore.ts
├── assetLibraryStore.ts
└── uiStore.ts
```

**样式系统** (符合度: 100%)
```
styles/globals.css        # Material Design 3 全局样式
```

### 3.2 系统边界

**包含在范围内**:
- Next.js 15 App Router 架构迁移
- Server Actions 实现
- 客户端组件标记 ('use client')
- 路由系统替换 (React Router → Next.js Router)
- MKSAAS 架构预留（5个关键接口）
- 现有功能完整保留（86种图像效果、AI对话、资产库）

**不包含在范围内** (Phase 1):
- Tailwind CSS 迁移（Phase 2）
- next-intl 完整迁移（Phase 2）
- MKSAAS 完整集成（Phase 3）
- 用户认证系统（Phase 3）
- 支付和订阅系统（Phase 3）
- 配额管理系统（Phase 3）

---

## 4. 功能需求 (Functional Requirements)

### 4.1 核心功能保持需求

#### FR-1: 功能完整性保持

**需求编号**: FR-1  
**优先级**: 🔴 P0 (Critical)  
**需求类型**: 功能性需求  
**需求来源**: 用户体验连续性

**User Story**:  
作为用户，我希望迁移后所有现有功能都能正常工作，体验不受影响。

**Acceptance Criteria**:

1. **FR-1.1**: WHEN 用户访问应用时，THE System SHALL 保留所有 86 种图像效果功能
   - 验证方法: 功能测试，逐一验证每个效果
   - 成功标准: 所有效果正常工作，无功能缺失

2. **FR-1.2**: WHEN 用户使用 AI 对话时，THE System SHALL 保持多模态对话能力
   - 验证方法: 集成测试，测试文本+图像输入
   - 成功标准: 对话功能完整，支持图像上传和生成

3. **FR-1.3**: WHEN 用户访问资产库时，THE System SHALL 保留所有图片管理功能
   - 验证方法: 功能测试，测试增删改查操作
   - 成功标准: 资产库功能完整，数据持久化正常

4. **FR-1.4**: WHEN 用户切换语言时，THE System SHALL 保持中英文双语支持
   - 验证方法: UI 测试，切换语言验证翻译
   - 成功标准: 370+ 条翻译正确显示

5. **FR-1.5**: WHEN 用户使用蒙版编辑时，THE System SHALL 保留所有编辑工具
   - 验证方法: 功能测试，测试蒙版绘制和编辑
   - 成功标准: 蒙版编辑器功能完整

**依赖关系**: 无  
**风险等级**: 🔴 高  
**可追溯性**: 映射到测试用例 TC-FR-1.1 至 TC-FR-1.5

---

#### FR-2: 代码复用最大化

**需求编号**: FR-2  
**优先级**: 🔴 P0 (Critical)  
**需求类型**: 技术需求  
**需求来源**: 开发效率和风险控制

**User Story**:  
作为开发者，我希望迁移过程中最大化复用现有代码，减少重写工作量。

**Acceptance Criteria**:

1. **FR-2.1**: THE System SHALL 复用至少 80% 的现有组件代码
   - 验证方法: 代码审查，统计复用率
   - 成功标准: 组件复用率 ≥ 80%

2. **FR-2.2**: THE System SHALL 保留所有 Zustand store 的状态管理逻辑
   - 验证方法: 代码审查，验证 store 文件未修改
   - 成功标准: 4个 store 文件 100% 复用

3. **FR-2.3**: THE System SHALL 复用所有工具函数和类型定义
   - 验证方法: 代码审查，验证 utils/ 和 types/ 目录
   - 成功标准: 工具函数和类型定义 100% 复用

4. **FR-2.4**: THE System SHALL 保留所有国际化翻译文件
   - 验证方法: 文件对比，验证翻译文件完整性
   - 成功标准: 370+ 条翻译文件完整保留

5. **FR-2.5**: THE System SHALL 复用所有 Material Design 3 样式
   - 验证方法: 样式审查，验证 globals.css 未修改
   - 成功标准: 样式文件 100% 复用

**依赖关系**: 依赖 FR-1（功能完整性）  
**风险等级**: 🟡 中  
**可追溯性**: 映射到代码审查清单 CR-FR-2

---

### 4.2 性能和质量需求

#### FR-3: 性能和 SEO 改善

**需求编号**: FR-3  
**优先级**: 🔴 P0 (Critical)  
**需求类型**: 非功能性需求（性能）  
**需求来源**: 用户体验和搜索引擎优化

**User Story**:  
作为用户，我希望应用加载更快，搜索引擎能更好地索引内容。

**Acceptance Criteria**:

1. **FR-3.1**: WHEN 用户首次访问时，THE System SHALL 在 2 秒内显示首屏内容
   - 验证方法: 性能测试，使用 Lighthouse 测量 FCP
   - 成功标准: First Contentful Paint (FCP) < 2秒

2. **FR-3.2**: WHEN 搜索引擎爬虫访问时，THE System SHALL 提供完整的 HTML 内容
   - 验证方法: SSR 测试，验证 HTML 源代码
   - 成功标准: 页面内容在 HTML 源代码中可见

3. **FR-3.3**: WHEN 用户导航到新页面时，THE System SHALL 使用预加载优化加载速度
   - 验证方法: 性能测试，测量页面切换时间
   - 成功标准: 页面切换时间 < 500ms

4. **FR-3.4**: THE System SHALL 实现代码分割，按需加载组件
   - 验证方法: Bundle 分析，验证代码分割
   - 成功标准: 初始 Bundle 大小 < 200KB

5. **FR-3.5**: THE System SHALL 生成静态页面用于 SEO 优化
   - 验证方法: SEO 测试，使用 Lighthouse SEO 分数
   - 成功标准: Lighthouse SEO 分数 > 90

**依赖关系**: 依赖 FR-1（功能完整性）  
**风险等级**: 🟡 中  
**可追溯性**: 映射到性能测试用例 TC-FR-3

---

### 4.3 安全需求

#### FR-4: API 密钥安全保护

**需求编号**: FR-4  
**优先级**: 🔴 P0 (Critical)  
**需求类型**: 安全需求  
**需求来源**: 安全合规和最佳实践

**User Story**:  
作为开发者，我希望 API 密钥不暴露在客户端，提高安全性。

**Acceptance Criteria**:

1. **FR-4.1**: THE System SHALL 将 Gemini API 调用移至服务端
   - 验证方法: 代码审查，验证 API 调用位置
   - 成功标准: 所有 API 调用在 Server Actions 中

2. **FR-4.2**: THE System SHALL 使用 Next.js Server Actions 处理敏感操作
   - 验证方法: 代码审查，验证 'use server' 指令
   - 成功标准: 8个 API 函数都使用 Server Actions

3. **FR-4.3**: THE System SHALL 在环境变量中安全存储 API 密钥
   - 验证方法: 配置审查，验证 .env 文件
   - 成功标准: API 密钥不在客户端代码中

4. **FR-4.4**: THE System SHALL 实现请求速率限制
   - 验证方法: 集成测试，测试速率限制
   - 成功标准: 超过限制时返回 429 错误

5. **FR-4.5**: THE System SHALL 添加请求验证和错误处理
   - 验证方法: 单元测试，测试错误处理逻辑
   - 成功标准: 所有 API 都有完整的错误处理

**依赖关系**: 无  
**风险等级**: 🔴 高  
**可追溯性**: 映射到安全测试用例 TC-FR-4

---

### 4.4 迁移过程需求

#### FR-5: 平滑过渡和渐进式迁移

**需求编号**: FR-5  
**优先级**: 🔴 P0 (Critical)  
**需求类型**: 过程需求  
**需求来源**: 风险管理和项目管理

**User Story**:  
作为开发者，我希望迁移过程分阶段进行，降低风险。

**Acceptance Criteria**:

1. **FR-5.1**: THE System SHALL 支持阶段性迁移，每个阶段可独立测试
   - 验证方法: 项目管理，验证阶段划分
   - 成功标准: 3个明确的阶段，每个阶段可独立验收

2. **FR-5.2**: THE System SHALL 在迁移过程中保持应用可运行状态
   - 验证方法: 持续集成测试
   - 成功标准: 每次提交后应用可正常运行

3. **FR-5.3**: THE System SHALL 提供回滚机制，出现问题时可快速恢复
   - 验证方法: Git 分支策略审查
   - 成功标准: 使用 Git 分支，可随时回滚

4. **FR-5.4**: THE System SHALL 记录每个迁移步骤的详细文档
   - 验证方法: 文档审查
   - 成功标准: 每个步骤都有文档记录

5. **FR-5.5**: THE System SHALL 在每个阶段完成后进行完整测试
   - 验证方法: 测试报告审查
   - 成功标准: 每个阶段都有完整的测试报告

**依赖关系**: 无  
**风险等级**: 🟡 中  
**可追溯性**: 映射到项目管理文档 PM-FR-5

---

### 4.5 框架特性利用需求

#### FR-6: Next.js 框架优势利用

**需求编号**: FR-6  
**优先级**: 🟡 P1 (High)  
**需求类型**: 技术需求  
**需求来源**: 技术现代化和最佳实践

**User Story**:  
作为开发者，我希望充分利用 Next.js 的特性提升开发体验。

**Acceptance Criteria**:

1. **FR-6.1**: THE System SHALL 使用 Next.js Image 组件优化图片加载
   - 验证方法: 代码审查，验证 Image 组件使用
   - 成功标准: 所有图片使用 next/image

2. **FR-6.2**: THE System SHALL 使用 Next.js Font 优化字体加载
   - 验证方法: 代码审查，验证 Font 配置
   - 成功标准: 字体使用 next/font 加载

3. **FR-6.3**: THE System SHALL 使用 Server Components 减少客户端 JavaScript
   - 验证方法: Bundle 分析
   - 成功标准: 客户端 JavaScript 减少 20%+

4. **FR-6.4**: THE System SHALL 使用 Streaming 改善用户体验
   - 验证方法: 性能测试，测量 TTFB
   - 成功标准: Time to First Byte (TTFB) < 600ms

5. **FR-6.5**: THE System SHALL 使用 Metadata API 优化 SEO
   - 验证方法: SEO 测试，验证 meta 标签
   - 成功标准: 所有页面都有完整的 metadata

**依赖关系**: 依赖 FR-1（功能完整性）  
**风险等级**: 🟢 低  
**可追溯性**: 映射到技术审查清单 TR-FR-6

---

### 4.6 MKSAAS 架构预留需求

#### FR-7: MKSAAS 集成架构预留

**需求编号**: FR-7  
**优先级**: 🔴 P0 (Critical)  
**需求类型**: 架构需求  
**需求来源**: 长期技术规划和投资回报优化

**User Story**:  
作为开发者，我希望在 Phase 1 迁移中预留 MKSAAS 集成接口，以便未来能够平滑集成 SaaS 功能，避免大规模重构。

**背景说明**:  
基于对 MKSAAS 框架的深入分析，采用分阶段集成策略。在 Phase 1 中预留架构接口，投入约 5 天，可节省 Phase 3 的 6-7 周重构时间，投资回报率约 800-1000%。

**Acceptance Criteria**:

1. **FR-7.1**: THE System SHALL 实现数据层抽象接口，支持未来从 localStorage 切换到数据库
   - 验证方法: 代码审查，验证 StorageAdapter 接口
   - 成功标准: 实现 StorageAdapter 接口和 LocalStorageAdapter 类
   - 投入: 1天，收益: 节省 2周

2. **FR-7.2**: THE System SHALL 预留用户上下文接口，支持未来从匿名用户切换到真实用户
   - 验证方法: 代码审查，验证 UserContext 接口
   - 成功标准: 实现 UserContext 接口和 UserProvider 组件
   - 投入: 0.5天，收益: 节省 1周

3. **FR-7.3**: THE System SHALL 实现 API 调用层抽象，预留配额检查和使用记录接口
   - 验证方法: 代码审查，验证 API 函数接口
   - 成功标准: 统一的 API 函数接口，预留配额检查代码（注释）
   - 投入: 1天，收益: 节省 1-2周

4. **FR-7.4**: THE System SHALL 在数据库表设计中预留 userId 字段和 JSONB metadata 字段
   - 验证方法: 数据库 schema 审查
   - 成功标准: 所有业务表都有 userId (nullable) 和 metadata (JSONB)
   - 投入: 2天，收益: 节省 2-3周

5. **FR-7.5**: THE System SHALL 遵循 MKSAAS 环境变量命名规范，预留未来需要的配置项
   - 验证方法: 配置文件审查
   - 成功标准: .env.example 遵循 MKSAAS 命名规范，预留 Phase 3 变量
   - 投入: 0.25天，收益: 节省 2-3天

**总投入**: 4.75天（38小时）  
**总收益**: 节省 6-7周（280-320小时）  
**投资回报率**: 636-742%

**依赖关系**: 无  
**风险等级**: 🟡 中  
**可追溯性**: 映射到架构审查清单 AR-FR-7，详见 [mksaas-integration-strategy.md](./mksaas-integration-strategy.md)

---

## 5. 非功能需求 (Non-Functional Requirements)

### 5.1 性能需求

| 需求编号 | 指标 | 目标值 | 测量方法 |
|---------|------|--------|---------|
| NFR-1.1 | 首屏加载时间 (FCP) | < 2秒 | Lighthouse |
| NFR-1.2 | 页面切换时间 | < 500ms | Performance API |
| NFR-1.3 | Time to First Byte (TTFB) | < 600ms | Lighthouse |
| NFR-1.4 | Lighthouse 性能分数 | > 90 | Lighthouse |
| NFR-1.5 | 初始 Bundle 大小 | < 200KB | Webpack Bundle Analyzer |

### 5.2 可用性需求

| 需求编号 | 指标 | 目标值 | 测量方法 |
|---------|------|--------|---------|
| NFR-2.1 | 系统可用性 | > 99.9% | 监控系统 |
| NFR-2.2 | 错误率 | < 0.1% | 错误追踪系统 |
| NFR-2.3 | 响应时间 | < 1秒 | APM 工具 |

### 5.3 兼容性需求

| 需求编号 | 指标 | 目标值 |
|---------|------|--------|
| NFR-3.1 | 浏览器支持 | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| NFR-3.2 | 移动设备支持 | iOS 14+, Android 10+ |
| NFR-3.3 | 屏幕分辨率 | 320px - 3840px |

### 5.4 可维护性需求

| 需求编号 | 指标 | 目标值 |
|---------|------|--------|
| NFR-4.1 | 代码复用率 | > 80% |
| NFR-4.2 | 测试覆盖率 | > 70% |
| NFR-4.3 | 文档完整性 | 100% API 文档化 |
| NFR-4.4 | TypeScript 覆盖率 | 100% |

### 5.5 安全需求

| 需求编号 | 指标 | 目标值 |
|---------|------|--------|
| NFR-5.1 | API 密钥暴露 | 0 次 |
| NFR-5.2 | XSS 漏洞 | 0 个 |
| NFR-5.3 | CSRF 保护 | 100% 覆盖 |
| NFR-5.4 | 依赖漏洞 | 0 个高危漏洞 |

---

## 6. 技术决策 (Technical Decisions)

### 6.1 决策总览

| 决策编号 | 决策主题 | 最终方案 | 决策日期 | 状态 |
|---------|---------|---------|---------|------|
| TD-1 | 状态管理策略 | 保持 Zustand + 'use client' | 2025-10-27 | ✅ 已确认 |
| TD-2 | API 调用架构 | Server Actions | 2025-10-27 | ✅ 已确认 |
| TD-3 | 存储方案 | 混合方案（localStorage + 预留数据库接口） | 2025-10-27 | ✅ 已确认 |
| TD-4 | 路由结构 | 保持现有结构，替换实现 | 2025-10-27 | ✅ 已确认 |
| TD-5 | 国际化方案 | 渐进式迁移到 next-intl | 2025-10-27 | ✅ 已确认 |
| TD-6 | 样式系统 | 分阶段迁移（先 Next.js，再 Tailwind CSS） | 2025-10-27 | ✅ 已确认 |

### 6.2 TD-1: 状态管理策略

**决策**: 保持 Zustand + 'use client'

**理由**:
1. 零改动，所有 4 个 store 文件完全复用
2. 快速迁移，降低风险
3. 团队完全熟悉，无需学习新方案
4. 代码复用率 100%
5. Phase 2 可渐进优化

**实施方案**:
- 保持所有 store 文件不变
- 在使用 store 的组件顶部添加 'use client' 指令
- 确保 localStorage 持久化在客户端正常工作

**影响的需求**: FR-2（代码复用）

### 6.3 TD-2: API 调用架构

**决策**: Server Actions

**理由**:
1. API 密钥完全隐藏在服务端
2. 简单直接，类似函数调用
3. Next.js 官方推荐的方式
4. 完整的 TypeScript 支持
5. 自动处理缓存和重新验证

**实施方案**:
- 将所有 Gemini API 调用移至 app/actions/gemini.ts
- 添加 'use server' 指令
- 8 个主要 API 函数需要迁移

**影响的需求**: FR-4（API 密钥安全）

### 6.4 TD-3: 存储方案

**决策**: 混合方案（localStorage + 预留数据库接口）

**理由**:
1. Phase 1 保持 localStorage，零改动
2. 实现 StorageAdapter 抽象层
3. 预留数据库和云存储接口
4. 为 Phase 3 MKSAAS 集成做准备

**实施方案**:
- 创建 StorageAdapter 接口
- 实现 LocalStorageAdapter
- 预留 DatabaseAdapter 接口（注释）

**影响的需求**: FR-7.1（数据层抽象）

### 6.5 TD-4: 路由结构

**决策**: 保持现有结构，替换实现

**理由**:
1. 用户体验无变化
2. URL 结构保持一致
3. 最小化代码改动
4. SEO 友好的路由结构

**实施方案**:
- 使用 Next.js useRouter 和 usePathname
- 替换 React Router 的 Link
- URL 结构完全不变

**影响的需求**: FR-1（功能完整性）

### 6.6 TD-5: 国际化方案

**决策**: 渐进式迁移到 next-intl

**理由**:
1. Next.js 官方推荐，专为 App Router 设计
2. API 与现有方案相似，迁移成本可控
3. 完美的 SSR/SEO 支持
4. 完整的 TypeScript 支持
5. 轻量级（仅 5KB）

**实施方案**:
- Phase 1: 保持现有 i18n/context.tsx
- Phase 2-5: 7周分阶段迁移到 next-intl
- 编写自动转换脚本（TS → JSON）

**影响的需求**: FR-1.4（双语支持）

### 6.7 TD-6: 样式系统

**决策**: 分阶段迁移（先 Next.js，再 Tailwind CSS）

**理由**:
1. 风险可控（一次只处理一个大变更）
2. 渐进式改进（每个阶段都有明确回滚点）
3. 团队学习曲线平缓
4. 可以选择性迁移（新旧组件可共存）

**实施方案**:
- Phase 1: 保持 Material Design 3 样式系统
- Phase 2: 4-6周迁移到 Tailwind CSS

**影响的需求**: FR-2.5（样式复用）

---

## 7. 约束条件 (Constraints)

### 7.1 技术约束

| 约束编号 | 约束描述 | 影响 |
|---------|---------|------|
| C-1 | 必须使用 Next.js 15 | 限制框架版本 |
| C-2 | 必须保持 React 19 | 限制 React 版本 |
| C-3 | 必须使用 TypeScript | 限制编程语言 |
| C-4 | 必须兼容现有 Zustand store | 限制状态管理方案 |
| C-5 | 必须保持 Material Design 3 样式（Phase 1） | 限制样式系统 |

### 7.2 时间约束

| 约束编号 | 约束描述 | 影响 |
|---------|---------|------|
| C-6 | Phase 1 必须在 7-8 周内完成 | 限制开发时间 |
| C-7 | 每个阶段必须可独立验收 | 限制开发流程 |
| C-8 | 必须保持应用持续可运行 | 限制迁移策略 |

### 7.3 资源约束

| 约束编号 | 约束描述 | 影响 |
|---------|---------|------|
| C-9 | 开发团队规模有限 | 限制并行任务数量 |
| C-10 | 必须最大化代码复用（>80%） | 限制重写范围 |
| C-11 | MKSAAS 架构预留投入限制在 5 天内 | 限制预留工作范围 |

### 7.4 业务约束

| 约束编号 | 约束描述 | 影响 |
|---------|---------|------|
| C-12 | 不能影响现有用户使用 | 限制迁移策略 |
| C-13 | 必须保持所有现有功能 | 限制功能变更 |
| C-14 | 必须保持用户数据��整性 | 限制数据迁移方案 |

---

## 8. 风险评估 (Risk Assessment)

### 8.1 高风险项

| 风险编号 | 风险描述 | 概率 | 影响 | 风险等级 | 缓解措施 | 负责人 |
|---------|---------|------|------|---------|---------|--------|
| R-1 | API 调用迁移到 Server Actions 失败 | 30% | 极高 | 🔴 高 | 保持函数签名不变，分步迁移，充分测试 | 技术负责人 |
| R-2 | localStorage 在 SSR 中导致水合错误 | 40% | 高 | 🔴 高 | 所有使用 localStorage 的组件标记为 'use client'，使用 useEffect | 前端负责人 |
| R-3 | 性能指标未达标 | 20% | 高 | 🟡 中 | 使用 Next.js 优化特性，充分的性能测试 | 性能负责人 |

### 8.2 中风险项

| 风险编号 | 风险描述 | 概率 | 影响 | 风险等级 | 缓解措施 | 负责人 |
|---------|---------|------|------|---------|---------|--------|
| R-4 | React Router 到 Next.js Router 迁移问题 | 25% | 中 | 🟡 中 | 创建迁移映射表，逐个文件测试 | 前端负责人 |
| R-5 | 国际化方案迁移出现翻译缺失 | 20% | 中 | 🟡 中 | 编写自动转换脚本，充分测试 | 前端负责人 |
| R-6 | 样式系统在 SSR 中出现闪烁 | 15% | 中 | 🟡 中 | 使用 Next.js 推荐的 CSS 导入方式 | 前端负责人 |

### 8.3 低风险项

| 风险编号 | 风险描述 | 概率 | 影响 | 风险等级 | 缓解措施 | 负责人 |
|---------|---------|------|------|---------|---------|--------|
| R-7 | 组件复用出现兼容性问题 | 10% | 低 | 🟢 低 | 组件代码完全兼容，只需添加 'use client' | 前端负责人 |
| R-8 | 类型定义和工具函数迁移问题 | 5% | 低 | 🟢 低 | 纯 TypeScript 代码，完全兼容 | 技术负责人 |

### 8.4 风险缓解总体策略

1. **分阶段迁移**: 每个阶段独立测试，降低风险
2. **保持可回滚**: 使用 Git 分支，随时可以回退
3. **充分测试**: 每个功能迁移后立即测试
4. **文档记录**: 记录所有遇到的问题和解决方案
5. **团队沟通**: 及时同步进度和问题

---

## 9. 验收标准 (Acceptance Criteria)

### 9.1 功能验收标准

| 验收项 | 标准 | 验证方法 | 状态 |
|--------|------|---------|------|
| AC-1 | 所有 86 种图像效果正常工作 | 功能测试 | ⏳ 待验收 |
| AC-2 | AI 对话功能完整 | 集成测试 | ⏳ 待验收 |
| AC-3 | 资产库功能完整 | 功能测试 | ⏳ 待验收 |
| AC-4 | 双语支持正常 | UI 测试 | ⏳ 待验收 |
| AC-5 | 蒙版编辑功能完整 | 功能测试 | ⏳ 待验收 |

### 9.2 性能验收标准

| 验收项 | 标准 | 验证方法 | 状态 |
|--------|------|---------|------|
| AC-6 | 首屏加载时间 < 2秒 | Lighthouse | ⏳ 待验收 |
| AC-7 | Lighthouse 性能分数 > 90 | Lighthouse | ⏳ 待验收 |
| AC-8 | Lighthouse SEO 分数 > 90 | Lighthouse | ⏳ 待验收 |
| AC-9 | 无控制台错误或警告 | 手动测试 | ⏳ 待验收 |

### 9.3 安全验收标准

| 验收项 | 标准 | 验证方法 | 状态 |
|--------|------|---------|------|
| AC-10 | API 密钥不暴露在客户端 | 代码审查 | ⏳ 待验收 |
| AC-11 | 所有 API 调用在服务端 | 代码审查 | ⏳ 待验收 |
| AC-12 | 无安全漏洞 | 安全扫描 | ⏳ 待验收 |

### 9.4 代码质量验收标准

| 验收项 | 标准 | 验证方法 | 状态 |
|--------|------|---------|------|
| AC-13 | 代码复用率 > 80% | 代码审查 | ⏳ 待验收 |
| AC-14 | 测试覆盖率 > 70% | 测试报告 | ⏳ 待验收 |
| AC-15 | TypeScript 覆盖率 100% | 编译检查 | ⏳ 待验收 |
| AC-16 | 所有测试通过 | CI/CD | ⏳ 待验收 |

### 9.5 架构预留验收标准

| 验收项 | 标准 | 验证方法 | 状态 |
|--------|------|---------|------|
| AC-17 | StorageAdapter 接口实现 | 代码审查 | ⏳ 待验收 |
| AC-18 | UserContext 接口实现 | 代码审查 | ⏳ 待验收 |
| AC-19 | API 调用层抽象实现 | 代码审查 | ⏳ 待验收 |
| AC-20 | 数据库表设计预留 | Schema 审查 | ⏳ 待验收 |
| AC-21 | 环境变量标准化 | 配置审查 | ⏳ 待验收 |

---

## 10. 可追溯性矩阵 (Traceability Matrix)

### 10.1 需求到测试用例映射

| 需求编号 | 需求描述 | 测试用例 | 优先级 |
|---------|---------|---------|--------|
| FR-1.1 | 保留 86 种图像效果 | TC-FR-1.1 | P0 |
| FR-1.2 | 保持多模态对话能力 | TC-FR-1.2 | P0 |
| FR-1.3 | 保留图片管理功能 | TC-FR-1.3 | P0 |
| FR-1.4 | 保持双语支持 | TC-FR-1.4 | P0 |
| FR-1.5 | 保留蒙版编辑工具 | TC-FR-1.5 | P0 |
| FR-2.1 | 复用 80%+ 组件代码 | CR-FR-2.1 | P0 |
| FR-2.2 | 保留 Zustand store | CR-FR-2.2 | P0 |
| FR-2.3 | 复用工具函数和类型 | CR-FR-2.3 | P0 |
| FR-2.4 | 保留翻译文件 | CR-FR-2.4 | P0 |
| FR-2.5 | 复用 MD3 样式 | CR-FR-2.5 | P0 |
| FR-3.1 | 首屏加载 < 2秒 | TC-FR-3.1 | P0 |
| FR-3.2 | 提供完整 HTML | TC-FR-3.2 | P0 |
| FR-3.3 | 页面切换 < 500ms | TC-FR-3.3 | P0 |
| FR-3.4 | 代码分割 | TC-FR-3.4 | P0 |
| FR-3.5 | SEO 分数 > 90 | TC-FR-3.5 | P0 |
| FR-4.1 | API 调用在服务端 | TC-FR-4.1 | P0 |
| FR-4.2 | 使用 Server Actions | TC-FR-4.2 | P0 |
| FR-4.3 | 安全存储 API 密钥 | TC-FR-4.3 | P0 |
| FR-4.4 | 请求速率限制 | TC-FR-4.4 | P0 |
| FR-4.5 | 请求验证和错误处理 | TC-FR-4.5 | P0 |
| FR-7.1 | 数据层抽象 | AR-FR-7.1 | P0 |
| FR-7.2 | 用户上下文预留 | AR-FR-7.2 | P0 |
| FR-7.3 | API 调用层抽象 | AR-FR-7.3 | P0 |
| FR-7.4 | 数据库表设计预留 | AR-FR-7.4 | P0 |
| FR-7.5 | 环境变量标准化 | AR-FR-7.5 | P1 |

### 10.2 需求到技术决策映射

| 需求编号 | 技术决策 | 决策编号 |
|---------|---------|---------|
| FR-2 | 状态管理策略 | TD-1 |
| FR-4 | API 调用架构 | TD-2 |
| FR-7.1 | 存储方案 | TD-3 |
| FR-1 | 路由结构 | TD-4 |
| FR-1.4 | 国际化方案 | TD-5 |
| FR-2.5 | 样式系统 | TD-6 |

---

## 11. 附录 (Appendix)

### 11.1 参考文档

1. [MKSAAS 集成策略文档](./mksaas-integration-strategy.md)
2. [Next.js 15 官方文档](https://nextjs.org/docs)
3. [React 19 文档](https://react.dev/)
4. [Zustand 文档](https://docs.pmnd.rs/zustand)
5. [Drizzle ORM 文档](https://orm.drizzle.team/docs)
6. [next-intl 文档](https://next-intl-docs.vercel.app/)

### 11.2 缩略语表

| 缩略语 | 全称 | 中文 |
|--------|------|------|
| SPA | Single Page Application | 单页应用 |
| SSR | Server-Side Rendering | 服务端渲染 |
| SSG | Static Site Generation | 静态站点生成 |
| RSC | React Server Components | React 服务端组件 |
| FCP | First Contentful Paint | 首次内容绘制 |
| TTFB | Time to First Byte | 首字节时间 |
| SEO | Search Engine Optimization | 搜索引擎优化 |
| API | Application Programming Interface | 应用程序接口 |
| UI | User Interface | 用户界面 |
| UX | User Experience | 用户体验 |
| MD3 | Material Design 3 | Material Design 3 |
| i18n | Internationalization | 国际化 |
| ROI | Return on Investment | 投资回报率 |

### 11.3 需求优先级定义

| 优先级 | 符号 | 定义 | 处理方式 |
|--------|------|------|---------|
| P0 | 🔴 | Critical - 关键需求 | 必须在 Phase 1 完成 |
| P1 | 🟡 | High - 高优先级 | 应该在 Phase 1 完成 |
| P2 | 🟢 | Medium - 中优先级 | 可以在 Phase 2 完成 |
| P3 | ⚪ | Low - 低优先级 | 可以在 Phase 3 完成 |

### 11.4 需求变更流程

1. **提出变更**: 填写需求变更申请表
2. **影响分析**: 评估变更对时间、成本、风险的影响
3. **评审决策**: 项目组评审并决策
4. **更新文档**: 更新需求文档和相关文档
5. **通知相关方**: 通知所有相关人员

---

## 12. 批准签字 (Approval Signatures)

| 角色 | 姓名 | 签字 | 日期 |
|------|------|------|------|
| 项目负责人 | [待填写] | ________ | ________ |
| 技术负责人 | [待填写] | ________ | ________ |
| 产品负责人 | [待填写] | ________ | ________ |
| 质量负责人 | [待填写] | ________ | ________ |

---

**文档结束**

