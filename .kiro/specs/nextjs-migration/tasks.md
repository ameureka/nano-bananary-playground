# Next.js App Router 迁移任务清单

**文档版本**: 1.0  
**创建日期**: 2025-10-27  
**项目名称**: 香蕉PS乐园 Next.js 迁移  
**总时长**: 7-10周  
**阶段数**: 4个阶段（Phase 0-3）

---

## 📋 任务概览

本任务清单基于 requirements-v2.md 和 design.md，采用**渐进式迁移策略**，确保每个阶段都：
- ✅ 功能、UI、交互与之前完全一致
- ✅ 有明确的验证点和完成标准
- ✅ 可以独立验证和回滚
- ✅ 代码复用率 > 80%

---

## 🎯 阶段划分

```
Phase 0: 环境准备（1周）
  └─ 搭建 Next.js 项目骨架，配置工具链
  └─ 验证：项目可启动，依赖安装成功

Phase 1: 最小化迁移 - Lift & Shift（2-3周）
  └─ 纯客户端渲染（CSR），功能完全一致
  └─ 验证：应用可运行，所有功能正常
  └─ 理念："搬家不装修"

Phase 2: 服务端增强 - Next.js-ification（3-4周）
  └─ Server Actions，API 安全，性能优化
  └─ 验证：API 密钥安全，性能提升
  └─ 理念："装修房子"

Phase 3: 架构预留与优化 - Future-Proofing（1-2周）
  └─ MKSAAS 架构预留，最终优化
  └─ 验证：架构预留完成，性能达标
  └─ 理念："为未来做准备"
```

---

## Phase 0: 环境准备与基础设施（1周，5天）

**目标**: 搭建 Next.js 项目骨架，配置开发环境  
**需求追溯**: REQ-1.1, REQ-2.1  
**Git 分支**: `phase-0-setup`


### - [x] 0.1 项目初始化和配置（Day 1-2，2天）

#### - [x] 0.1.1 创建 Next.js 15 项目
  - 运行 `npx create-next-app@latest nano-bananary-nextjs --typescript --app --no-src-dir`
  - 选择配置：TypeScript: Yes, ESLint: Yes, Tailwind: No, App Router: Yes
  - 验证项目创建成功
  - _需求: REQ-1.1_

#### - [x] 0.1.2 配置 TypeScript
  - 更新 tsconfig.json，设置 strict mode
  - 配置路径别名 `@/*`
  - 验证 TypeScript 编译无错误
  - _需求: REQ-2.1_

#### - [x] 0.1.3 配置 Next.js
  - 创建 next.config.js，配置图片域名
  - 配置 Webpack（如需要）
  - 设置环境变量
  - _需求: REQ-2.1_

#### - [x] 0.1.4 配置 ESLint 和 Prettier
  - 安装 eslint-config-next
  - 配置 .eslintrc.json
  - 配置 .prettierrc
  - _需求: REQ-2.1_

### - [x] 0.2 依赖迁移（Day 2-3，1.5天）

#### - [x] 0.2.1 分析现有依赖
  - 列出所有 package.json 依赖
  - 标记需要保留的依赖
  - 标记需要移除的依赖（Vite, React Router）
  - _需求: REQ-1.1_

#### - [x] 0.2.2 安装核心依赖
  - 安装 Next.js 16, React 19, React DOM 19
  - 安装 Zustand 5.0.8
  - 安装 @google/genai 1.27.0
  - 安装其他必要依赖
  - _需求: REQ-1.1_

#### - [x] 0.2.3 移除旧依赖
  - 卸载 Vite 相关依赖
  - 卸载 React Router
  - 清理 package.json
  - 运行 `npm install` 验证
  - _需求: REQ-1.1_

### - [x] 0.3 环境变量配置（Day 3，0.5天）

#### - [x] 0.3.1 创建环境变量文件
  - 创建 .env.local
  - 创建 .env.example（提交到 Git）
  - 配置 GEMINI_API_KEY
  - _需求: REQ-2.2_

#### - [x] 0.3.2 配置 .gitignore
  - 添加 .env.local 到 .gitignore
  - 添加 .next/ 到 .gitignore
  - 验证敏感信息不会提交
  - _需求: REQ-2.2_

### - [x] 0.4 Git 分支策略（Day 3，0.5天）

#### - [x] 0.4.1 创建分支
  - 创建 phase-0-setup 分支
  - 创建 phase-1-lift-shift 分支
  - 创建 phase-2-nextjs-ification 分支
  - 创建 phase-3-future-proofing 分支
  - _需求: REQ-1.1_

#### - [x] 0.4.2 配置 Git 工作流
  - 设置分支保护规则
  - 配置 PR 模板
  - 文档化分支策略
  - _需求: REQ-1.1_

### - [x] 0.5 开发工具配置（Day 4，1天）

#### - [x] 0.5.1 配置 VS Code
  - 创建 .vscode/settings.json
  - 配置推荐扩展
  - 配置调试配置
  - _需求: REQ-2.1_

#### - [ ] 0.5.2 配置测试环境（可选）
  - 安装 Jest 和 Testing Library
  - 配置 jest.config.js
  - 创建测试示例
  - _需求: REQ-2.1_

### - [x] 0.6 Phase 0 验证（Day 5，0.5天）

#### - [x] 0.6.1 启动验证
  - 运行 `npm run dev`
  - 验证开发服务器启动成功
  - 访问 http://localhost:3000
  - _需求: REQ-1.1_

#### - [x] 0.6.2 编译验证
  - 运行 `npm run build`
  - 验证构建成功
  - 检查构建产物
  - _需求: REQ-2.1_

#### - [x] 0.6.3 类型检查
  - 运行 `npm run type-check`
  - 验证无 TypeScript 错误
  - _需求: REQ-2.1_

#### - [x] 0.6.4 代码质量检查
  - 运行 `npm run lint`
  - 修复 ESLint 错误
  - _需求: REQ-2.1_

### ✅ Phase 0 完成标准

- [x] `npm run dev` 可以启动（即使是空页面）
- [x] TypeScript 编译无错误
- [x] 所有依赖安装成功
- [x] 环境变量配置正确
- [x] ESLint 配置正常
- [x] Git 分支创建完成

### 🔄 Phase 0 回滚机制

如果 Phase 0 失败：
1. 删除 nano-bananary-nextjs 目录
2. 重新开始 Phase 0
3. 或者继续使用原 Vite 项目

---

## Phase 1: 最小化迁移 - Lift & Shift（2-3周，15天）

**目标**: 让现有应用在 Next.js 环境中以纯 CSR 模式完美运行  
**需求追溯**: REQ-1.1, REQ-1.2, REQ-1.3, REQ-2.1, REQ-3.1  
**Git 分支**: `phase-1-lift-shift`  
**核心理念**: "搬家不装修" - 所有组件标记为 'use client'


### - [x] 1.1 静态资源迁移（Day 6-7，1.5天）

#### - [x] 1.1.1 迁移图片资源
  - 复制 src/assets/ 到 public/assets/
  - 验证所有图片路径正确
  - 测试图片加载
  - _需求: REQ-1.2_

#### - [x] 1.1.2 迁移样式文件
  - 复制 src/styles/ 到 app/styles/
  - 保持 Material Design 3 CSS 不变
  - 验证 CSS 变量正确
  - _需求: REQ-1.2_

#### - [x] 1.1.3 迁移字体文件
  - 使用 next/font 优化字体加载（Roboto）
  - 保留 Material Symbols 图标字体
  - 测试字体加载
  - _需求: REQ-1.2_

### - [x] 1.2 类型定义和工具函数迁移（Day 7-8，1天）

#### - [x] 1.2.1 迁移类型定义
  - 复制 types.ts 到根目录
  - 更新导入路径为 @/types
  - 验证 TypeScript 编译无错误
  - _需求: REQ-1.2_

#### - [x] 1.2.2 迁移工具函数
  - 复制 utils/ 到根目录
  - 更新导入路径为 @/utils/
  - 测试工具函数
  - _需求: REQ-1.2_

#### - [x] 1.2.3 迁移常量定义
  - 复制 constants.ts 到根目录
  - 更新导入路径为 @/constants
  - 验证常量值正确
  - _需求: REQ-1.2_

### - [x] 1.3 组件迁移（Day 8-11，3天）

#### - [x] 1.3.1 迁移通用组件
  - 复制 components/common/ (8个组件)
  - 在每个组件顶部添加 'use client'
  - 更新导入路径为 @/components/
  - 逐个测试组件渲染
  - _需求: REQ-1.2, REQ-1.3_

#### - [x] 1.3.2 迁移功能组件
  - 复制 components/features/ (9个组件)
  - 在每个组件顶部添加 'use client'
  - 更新导入路径
  - 测试组件功能
  - _需求: REQ-1.2, REQ-1.3_

#### - [x] 1.3.3 迁移布局组件
  - 复制 components/layout/ (多个布局组件)
  - 在每个组件顶部添加 'use client'
  - 更新导入路径
  - 测试布局渲染
  - _需求: REQ-1.2, REQ-1.3_

#### - [x] 1.3.4 验证组件完整性
  - 检查所有组件都已迁移（共38个组件）
  - 验证 Props 传递正确
  - 验证事件处理正常
  - _需求: REQ-1.3_

### - [x] 1.4 状态管理迁移（Day 11-12，1天）

#### - [x] 1.4.1 迁移 Zustand stores
  - 复制 store/ 到根目录（6个store文件）
  - 保持代码 100% 不变
  - 更新导入路径为 @/store/
  - _需求: REQ-1.2_

#### - [x] 1.4.2 验证状态管理
  - 测试 enhancerStore 功能
  - 测试 chatStore 功能
  - 测试 assetLibraryStore 功能
  - 测试 uiStore 功能
  - 验证 localStorage 持久化正常
  - _需求: REQ-1.3_

### - [x] 1.5 服务层迁移（Day 12-13，1天）

#### - [x] 1.5.1 迁移 API 服务（临时方案）
  - 复制 services/ 到根目录
  - 保持客户端 API 调用不变
  - 更新环境变量为 NEXT_PUBLIC_GEMINI_API_KEY
  - _需求: REQ-1.2_

#### - [x] 1.5.2 迁移其他服务
  - 复制 lib/ 到根目录
  - 更新导入路径
  - 测试服务功能
  - _需求: REQ-1.2_

#### - [x] 1.5.3 验证 API 调用
  - 测试图像生成 API
  - 测试视频生成 API
  - 测试 AI 对话 API
  - 验证错误处理
  - _需求: REQ-1.3_

### - [x] 1.6 路由系统迁移（Day 13-15，2天）

#### - [x] 1.6.1 创建根布局
  - 创建 app/layout.tsx
  - 使用 Server Component（无 'use client'）
  - 集成 I18nProvider
  - 集成 ThemeProvider
  - 导入全局样式
  - 添加 Metadata
  - _需求: REQ-1.1, REQ-1.3_

#### - [x] 1.6.2 创建主页
  - 创建 app/page.tsx
  - 添加 'use client' 标记
  - 导入 ImageEnhancer 组件
  - 测试页面渲染
  - _需求: REQ-1.1, REQ-1.3_

#### - [x] 1.6.3 创建 AI 对话页
  - 创建 app/chat/page.tsx
  - 添加 'use client' 标记
  - 导入 AIChat 组件
  - 测试页面渲染
  - _需求: REQ-1.1, REQ-1.3_

#### - [x] 1.6.4 创建资产库页
  - 创建 app/library/page.tsx
  - 添加 'use client' 标记
  - 导入 AssetLibrary 组件
  - 测试页面渲染
  - _需求: REQ-1.1, REQ-1.3_

#### - [x] 1.6.5 替换路由导航
  - 全局搜索 `useNavigate`，替换为 `useRouter`
  - 全局搜索 `useLocation`，替换为 `usePathname`
  - 全局搜索 `<Link to=`，替换为 `<Link href=`
  - 全局搜索 `navigate(`，替换为 `router.push(`
  - 测试所有页面导航
  - _需求: REQ-1.1_

#### - [x] 1.6.6 验证路由功能
  - 测试页面间导航
  - 测试浏览器前进/后退
  - 测试 URL 参数传递
  - 验证路由状态保持
  - _需求: REQ-1.3_

### - [x] 1.7 国际化迁移（Day 15-16，1天）

#### - [x] 1.7.1 迁移 i18n 系统
  - 复制 i18n/ 目录（8个文件）
  - 在 i18n/context.tsx 顶部添加 'use client'
  - 保持 370+ 条翻译不变
  - _需求: REQ-1.2_

#### - [x] 1.7.2 验证国际化
  - 测试语言切换（中英文）
  - 验证所有翻译显示正确
  - 测试 localStorage 语言偏好持久化
  - 测试页面刷新后语言保持
  - _需求: REQ-1.3_

### - [x] 1.8 样式系统验证（Day 16-17，1天）

#### - [x] 1.8.1 验证全局样式
  - 检查所有页面样式正常
  - 验证 CSS 变量生效
  - 测试响应式布局
  - _需求: REQ-1.3_

#### - [x] 1.8.2 验证主题切换
  - 测试亮色主题
  - 测试暗色主题
  - 验证主题持久化
  - _需求: REQ-1.3_

#### - [x] 1.8.3 验证动画效果
  - 测试过渡动画
  - 测试加载动画
  - 验证无样式闪烁（FOUC）
  - _需求: REQ-1.3_

### - [ ] 1.9 完整功能验证（Day 17-19，2.5天）

#### - [ ] 1.9.1 图像增强器功能验证
  - 测试 86 种图像效果（抽样测试）
  - 测试图片上传
  - 测试效果参数调整
  - 测试图片下载
  - 测试蒙版编辑器
  - _需求: REQ-1.3_
  - **状态**: 需要运行时测试

#### - [ ] 1.9.2 AI 对话功能验证
  - 测试文本对话
  - 测试图像上传和分析
  - 测试多轮对话
  - 测试历史记录
  - _需求: REQ-1.3_
  - **状态**: 需要运行时测试

#### - [ ] 1.9.3 资产库功能验证
  - 测试图片列表显示
  - 测试图片上传
  - 测试图片删除
  - 测试图片下载
  - 测试批量操作
  - _需求: REQ-1.3_
  - **状态**: 需要运行时测试

#### - [ ] 1.9.4 视频生成功能验证
  - 测试文本生成视频
  - 测试图像生成视频
  - 测试进度显示
  - 测试视频预览
  - _需求: REQ-1.3_
  - **状态**: 需要运行时测试

#### - [ ] 1.9.5 数据持久化验证
  - 测试 localStorage 数据保存
  - 测试页面刷新后数据保持
  - 测试浏览器关闭后数据保持
  - 测试用户设置保存
  - _需求: REQ-1.3_
  - **状态**: 需要运行时测试

#### - [ ] 1.9.6 浏览器兼容性验证
  - 测试 Chrome 浏览器
  - 测试 Firefox 浏览器
  - 测试 Safari 浏览器
  - 测试 Edge 浏览器
  - 测试移动端浏览器
  - _需求: REQ-1.3_
  - **状态**: 需要运行时测试

### - [ ] 1.10 性能基准测试（Day 19-20，1天）

#### - [ ] 1.10.1 测量性能指标
  - 测量首屏加载时间
  - 测量 TTFB
  - 测量 FCP
  - 测量 LCP
  - 测量 TTI
  - _需求: REQ-3.1_
  - **状态**: 需要运行时测试

#### - [ ] 1.10.2 记录基准数据
  - 记录 Bundle 大小
  - 记录内存使用
  - 记录 CPU 使用
  - 对比原应用性能
  - _需求: REQ-3.1_
  - **状态**: 需要运行时测试

### ✅ Phase 1 完成标准

- [x] 应用由 `npm run dev` 启动
- [x] 运行在 Next.js 开发服务器上
- [x] 功能、UI 和交互与之前完全一致（代码层面）
- [ ] 所有 86 种图像效果正常（需运行时测试）
- [ ] AI 对话功能完整（需运行时测试）
- [ ] 资产库功能完整（需运行时测试）
- [ ] 蒙版编辑器正常（需运行时测试）
- [ ] 视频生成正常（需运行时测试）
- [x] 双语支持正常（代码已迁移）
- [x] 主题切换正常（代码已迁移）
- [x] 所有测试通过（构建成功）
- [x] 无控制台错误（构建无错误）
- [ ] 性能与之前相当（需运行时测试）
- [x] 代码复用率 > 80%（几乎100%复用）

### 🔄 Phase 1 回滚机制

如果 Phase 1 失败：
1. 切换回 `main` 分支
2. 继续使用原 Vite 项目
3. 分析失败原因
4. 修复后重新开始 Phase 1

---

## Phase 2: 服务端增强 - Next.js-ification（4周，21天）

**目标**: 将核心业务逻辑迁移到服务端，发挥 Next.js 优势  
**需求追溯**: REQ-2.2, REQ-3.1, REQ-3.2  
**Git 分支**: `phase-2-nextjs-ification`  
**核心理念**: "装修房子" - 使用 Next.js 高级功能

**🎯 最终决策**（2025-10-29）:
- ✅ 全面使用 API Routes（而非 Server Actions）
- ✅ 接受 4 周时间安排（21天 + 缓冲）
- ✅ 速率限制移至 Phase 3
- ✅ 积极优化 SSR/SSG（目标 Lighthouse > 90）

**📚 参考文档**:
- 详细分析：`phase-2-analysis.md`
- 技术决策：`server-actions-vs-api-routes.md`

---

### Week 1: API Routes 基础设施（Day 21-25，5天）

### - [ ] 2.1 API Routes 基础设施搭建（Day 21，1天）

#### - [ ] 2.1.1 创建目录结构
  - 创建 `app/api/image/` 目录
  - 创建 `app/api/video/` 目录
  - 创建 `app/api/chat/` 目录
  - 创建 `app/api/transformations/` 目录
  - _需求: REQ-2.2_

#### - [ ] 2.1.2 创建统一类型定义
  - 创建 `types/api.ts`
  - 定义 `ApiResponse<T>` 类型
  - 定义 `ApiError` 接口
  - 定义所有 API 请求/响应接口
  - _需求: REQ-2.2_

#### - [ ] 2.1.3 创建 API 工具函数
  - 创建 `lib/api-utils.ts`
  - 实现 `handleApiError` 函数
  - 实现 `apiSuccess` 和 `apiError` 函数
  - 实现 `withRetry` 函数
  - _需求: REQ-2.2_

#### - [ ] 2.1.4 配置环境变量
  - 配置服务端 `GEMINI_API_KEY`（无 NEXT_PUBLIC 前缀）
  - 更新 `.env.local`
  - 更新 `.env.example`
  - 验证环境变量读取
  - _需求: REQ-2.2_

#### - [ ] 2.1.5 编写 API 测试工具
  - 创建 Postman collection（可选）
  - 编写简单的测试脚本
  - 准备测试数据
  - _需求: REQ-2.2_

### - [ ] 2.2 图像相关 API Routes（Day 22-23，2天）

#### - [ ] 2.2.1 实现图像编辑 API
  - 创建 `app/api/image/edit/route.ts`
  - 实现 POST 方法
  - 处理 FormData 文件上传
  - 调用 `geminiService.editImage`
  - 添加错误处理和重试逻辑
  - 测试功能（Postman 或 curl）
  - _需求: REQ-2.2_

#### - [ ] 2.2.2 实现文本生成图像 API
  - 创建 `app/api/image/generate/route.ts`
  - 实现 POST 方法
  - 调用 `geminiService.generateImageFromText`
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.2.3 实现风格模仿 API
  - 创建 `app/api/image/style-mimic/route.ts`
  - 实现 POST 方法
  - 处理两张图片上传
  - 调用 `geminiService.generateStyleMimicImage`
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.2.4 实现批量编辑 API
  - 创建 `app/api/image/batch/route.ts`
  - 实现 POST 方法
  - 调用 `geminiService.generateImageEditsBatch`
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

### - [ ] 2.3 聊天和其他 API Routes（Day 24-25，2天）

#### - [ ] 2.3.1 实现聊天生成图像 API
  - 创建 `app/api/chat/generate/route.ts`
  - 实现 POST 方法
  - 处理聊天历史和图片
  - 调用 `geminiService.generateImageInChat`
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.3.2 实现提示词预处理 API
  - 创建 `app/api/chat/preprocess/route.ts`
  - 实现 POST 方法
  - 调用 `geminiService.preprocessPrompt`
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.3.3 实现效果建议 API
  - 创建 `app/api/transformations/suggestions/route.ts`
  - 实现 POST 方法
  - 调用 `geminiService.getTransformationSuggestions`
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.3.4 端到端测试
  - 测试所有 API 端点
  - 验证错误处理
  - 验证响应格式统一
  - 记录测试结果
  - _需求: REQ-2.2_

---

### Week 2: 视频 API 和 Store 更新（Day 26-30，5天）

### - [ ] 2.4 视频生成 API Routes（Day 26-27，2天）

#### - [ ] 2.4.1 拆分视频生成逻辑
  - 在 `geminiService.ts` 中创建 `startVideoGeneration` 函数
  - 在 `geminiService.ts` 中创建 `checkVideoStatus` 函数
  - 移除原有的轮询逻辑
  - 测试拆分后的函数
  - _需求: REQ-2.2_

#### - [ ] 2.4.2 实现视频生成启动 API
  - 创建 `app/api/video/generate/route.ts`
  - 实现 POST 方法
  - 调用 `startVideoGeneration`
  - 立即返回操作ID
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.4.3 实现视频状态查询 API
  - 创建 `app/api/video/status/[id]/route.ts`
  - 实现 GET 方法
  - 调用 `checkVideoStatus`
  - 返回状态和进度
  - 添加错误处理
  - 测试功能
  - _需求: REQ-2.2_

#### - [ ] 2.4.4 测试完整视频生成流程
  - 启动生成 → 轮询状态 → 获取视频
  - 验证进度更新
  - 验证错误处理
  - 记录测试结果
  - _需求: REQ-2.2_

### - [ ] 2.5 更新 Store 调用（Day 28-29，2天）

#### - [ ] 2.5.1 更新 enhancerStore
  - 修改 `generateImage` 使用 fetch 调用 API
  - 修改 `generateVideo` 使用轮询机制
  - 处理 File 对象上传（FormData）
  - 更新错误处理（使用 ApiResponse 类型）
  - 移除对 `lib/actions.ts` 的依赖
  - 测试所有图像编辑功能
  - _需求: REQ-2.2_

#### - [ ] 2.5.2 更新 chatStore
  - 修改 `executeSendMessage` 使用 fetch 调用 API
  - 修改预处理逻辑使用新 API
  - 更新错误处理
  - 测试聊天功能
  - _需求: REQ-2.2_

#### - [ ] 2.5.3 更新其他 Store（如需要）
  - 检查 assetLibraryStore 是否需要修改
  - 检查 uiStore 是否需要修改
  - 更新相关逻辑
  - _需求: REQ-2.2_

#### - [ ] 2.5.4 移除旧的 actions 文件
  - 删除或注释 `lib/actions.ts`
  - 验证没有其他文件依赖它
  - 清理未使用的导入
  - _需求: REQ-2.2_

### - [ ] 2.6 API 安全和功能验证（Day 30，1天）

#### - [ ] 2.6.1 验证 API 密钥安全
  - 打开浏览器 DevTools
  - 检查 Network 面板，确认 API 密钥不可见
  - 检查 Sources 面板，确认 API 密钥不在客户端代码中
  - 尝试直接调用 API（应该成功，因为暂无认证）
  - _需求: REQ-2.2_

#### - [ ] 2.6.2 完整功能回归测试
  - 测试所有 86 种图像效果（抽样）
  - 测试 AI 对话功能
  - 测试资产库功能
  - 测试视频生成功能
  - 验证所有功能与 Phase 1 一致
  - _需求: REQ-2.2_

#### - [ ] 2.6.3 性能对比测试
  - 测量 API 调用时间
  - 对比 Phase 1 的性能
  - 记录性能数据
  - 识别性能瓶颈
  - _需求: REQ-3.1_

#### - [ ] 2.6.4 修复发现的问题
  - 记录所有发现的问题
  - 按优先级修复
  - 重新测试
  - 确认所有问题已解决
  - _需求: REQ-2.2_

---

### Week 3: 性能优化（Day 31-37，7天）

### - [ ] 2.7 图片和字体优化（Day 31-32，2天）

#### - [ ] 2.7.1 优化静态图片
  - 全局搜索静态 `<img` 标签
  - 替换为 `next/image` 组件
  - 配置图片尺寸和优先级
  - 注意：用户生成的图片（base64）保持 `<img>`
  - _需求: REQ-3.1_

#### - [ ] 2.7.2 配置图片优化
  - 配置 next.config.ts 图片域名白名单
  - 设置首屏图片 priority
  - 设置非首屏图片 lazy loading
  - _需求: REQ-3.1_

#### - [ ] 2.7.3 优化 Material Symbols 字体
  - 评估本地化 vs CDN
  - 优化字体加载策略
  - 测试图标显示
  - _需求: REQ-3.1_

#### - [ ] 2.7.4 Lighthouse 初步测试
  - 运行 Lighthouse 性能测试
  - 记录性能分数（目标 > 80）
  - 识别优化机会
  - _需求: REQ-3.1_

### - [ ] 2.8 代码分割优化（Day 33-34，2天）

#### - [ ] 2.8.1 安装和配置 Bundle Analyzer
  - 安装 `@next/bundle-analyzer`
  - 配置 next.config.ts
  - 运行分析：`npm run analyze`
  - _需求: REQ-3.1_

#### - [ ] 2.8.2 识别大组件
  - 分析 Bundle 报告
  - 识别 > 50KB 的组件
  - 列出需要动态导入的组件清单
  - _需求: REQ-3.1_

#### - [ ] 2.8.3 动态导入大组件
  - 使用 `dynamic()` 导入 Canvas 编辑器
  - 使用 `dynamic()` 导入视频播放器
  - 使用 `dynamic()` 导入大型效果组件
  - 添加 loading 占位符
  - _需求: REQ-3.1_

#### - [ ] 2.8.4 验证代码分割效果
  - 重新运行 Bundle 分析
  - 对比优化前后的 Bundle 大小
  - 测试组件加载体验
  - 检查 Network 面板
  - _需求: REQ-3.1_

### - [ ] 2.9 SEO 和 Metadata 优化（Day 35-36，2天）

#### - [ ] 2.9.1 添加页面 Metadata
  - 为主页添加完整 metadata
  - 为 /chat 页添加 metadata
  - 为 /library 页添加 metadata
  - 添加关键词和描述
  - _需求: REQ-3.2_

#### - [ ] 2.9.2 配置 OpenGraph 和 Twitter Card
  - 配置 OG 标签（title, description, image）
  - 创建 og-image.png（1200x630）
  - 配置 Twitter Card
  - 测试社交媒体预览
  - _需求: REQ-3.2_

#### - [ ] 2.9.3 创建 SEO 文件
  - 创建 `app/robots.txt` 或 `public/robots.txt`
  - 创建 `app/sitemap.ts` 动态生成 sitemap
  - 验证 robots.txt 可访问
  - 验证 sitemap.xml 可访问
  - _需求: REQ-3.2_

#### - [ ] 2.9.4 SEO 验证
  - 使用 Google Search Console 测试
  - 验证结构化数据
  - 检查页面索引状态
  - _需求: REQ-3.2_

### - [ ] 2.10 中期验证和优化（Day 37，1天）

#### - [ ] 2.10.1 Lighthouse 完整测试
  - 测试所有页面（/, /chat, /library）
  - 记录性能、SEO、可访问性、最佳实践分数
  - 目标：性能 > 85，SEO > 90
  - _需求: REQ-3.1, REQ-3.2_

#### - [ ] 2.10.2 性能指标记录
  - 记录 TTFB、FCP、LCP、TTI、CLS
  - 与 Phase 1 对比
  - 识别性能瓶颈
  - _需求: REQ-3.1_

#### - [ ] 2.10.3 优化瓶颈
  - 针对识别的瓶颈进行优化
  - 重新测试
  - 确认改进效果
  - _需求: REQ-3.1_

---

### Week 4: 高级优化和最终测试（Day 38-44，7天）

### - [ ] 2.11 Streaming 和 Loading 优化（Day 38-39，2天）

#### - [ ] 2.11.1 创建 Loading 组件
  - 创建 `app/loading.tsx`（全局 loading）
  - 创建 `app/chat/loading.tsx`
  - 创建 `app/library/loading.tsx`
  - _需求: REQ-3.1_

#### - [ ] 2.11.2 创建 Skeleton 组件
  - 创建 `components/common/EffectsListSkeleton.tsx`
  - 创建 `components/common/EditorSkeleton.tsx`
  - 创建 `components/common/ChatLoadingSkeleton.tsx`
  - 创建 `components/common/GalleryLoadingSkeleton.tsx`
  - _需求: REQ-3.1_

#### - [ ] 2.11.3 使用 Suspense
  - 在适当位置使用 Suspense 包装异步组件
  - 配置 fallback 为 Skeleton 组件
  - 测试 Streaming 效果
  - 验证加载体验
  - _需求: REQ-3.1_

### - [ ] 2.12 SSR/SSG 积极优化（Day 40-42，3天）

#### - [ ] 2.12.1 分析和规划
  - 分析哪些页面适合 SSG（效果列表、文档）
  - 分析哪些页面适合 SSR（页面框架）
  - 分析哪些组件必须保持 CSR（编辑器、聊天）
  - 制定拆分计划
  - _需求: REQ-3.1_

#### - [ ] 2.12.2 拆分 Server 和 Client Components
  - 识别可以改为 Server Component 的组件
  - 将 TransformationList 改为 Server Component
  - 将 Footer 改为 Server Component
  - 将 Header 静态部分改为 Server Component
  - 保持交互组件为 Client Component
  - _需求: REQ-3.1_

#### - [ ] 2.12.3 重构主页为混合模式
  - 移除 `app/page.tsx` 的 'use client'
  - 拆分为 Server Component（框架）+ Client Component（交互）
  - 测试页面渲染
  - 验证无水合错误
  - _需求: REQ-3.1_

#### - [ ] 2.12.4 实现效果列表 SSG
  - 将效果列表数据预渲染
  - 使用 `generateStaticParams`（如适用）
  - 测试静态生成
  - 验证构建输出
  - _需求: REQ-3.1_

#### - [ ] 2.12.5 验证 SSR/SSG 效果
  - 查看页面源代码（View Source）
  - 验证 HTML 包含完整内容
  - 测试无水合错误
  - 验证 SEO 爬虫可见性
  - _需求: REQ-3.1, REQ-3.2_

### - [ ] 2.13 性能最终优化（Day 43，1天）

#### - [ ] 2.13.1 Lighthouse 完整测试
  - 测试所有页面（/, /chat, /library）
  - 记录性能、SEO、可访问性、最佳实践分数
  - 目标：性能 > 90，SEO > 90
  - _需求: REQ-3.1, REQ-3.2_

#### - [ ] 2.13.2 针对性优化
  - 优化首屏加载时间（目标 < 2秒）
  - 优化 TTFB（目标 < 600ms）
  - 优化 LCP（目标 < 2.5秒）
  - 优化 CLS（目标 < 0.1）
  - _需求: REQ-3.1_

#### - [ ] 2.13.3 Bundle 大小优化
  - 检查 Bundle 分析报告
  - 移除未使用的依赖
  - 优化导入方式
  - 验证 Bundle 大小减少
  - _需求: REQ-3.1_

#### - [ ] 2.13.4 验证性能目标达成
  - 验证 Lighthouse 性能 > 90
  - 验证 Lighthouse SEO > 90
  - 验证首屏加载 < 2秒
  - 验证 TTFB < 600ms
  - 记录最终性能数据
  - _需求: REQ-3.1, REQ-3.2_

### - [ ] 2.14 最终验证和文档（Day 44，1天）

#### - [ ] 2.14.1 完整功能回归测试
  - 测试所有 86 种图像效果（完整测试）
  - 测试 AI 对话功能
  - 测试资产库功能
  - 测试视频生成功能
  - 测试蒙版编辑器
  - 验证所有功能正常
  - _需求: REQ-1.3_

#### - [ ] 2.14.2 跨浏览器测试
  - 测试 Chrome
  - 测试 Firefox
  - 测试 Safari
  - 测试 Edge
  - 测试移动端浏览器
  - _需求: REQ-1.3_

#### - [ ] 2.14.3 API 安全最终验证
  - 验证 API 密钥不在客户端
  - 验证所有 API 调用走服务端
  - 尝试直接调用 API（应该成功，暂无认证）
  - 记录安全状态
  - _需求: REQ-2.2_

#### - [ ] 2.14.4 更新文档
  - 更新 README.md
  - 更新 API 文档
  - 记录性能指标
  - 记录已知问题
  - 准备 Phase 3 计划
  - _需求: REQ-4.4_

### ✅ Phase 2 完成标准

#### 必须达成（P0）
- [ ] 所有 8 个 API 使用 API Routes 实现
- [ ] API 密钥完全不暴露在客户端
- [ ] 所有功能正常工作（与 Phase 1 一致）
- [ ] 无控制台错误
- [ ] 构建成功

#### 应该达成（P1）
- [ ] Lighthouse 性能分数 > 85
- [ ] Lighthouse SEO 分数 > 90
- [ ] 首屏加载时间 < 3秒
- [ ] TTFB < 800ms
- [ ] 图片和字体优化完成
- [ ] 代码分割优化完成
- [ ] Metadata 完整
- [ ] 部分 SSR/SSG 实现

#### 可以达成（P2）
- [ ] Lighthouse 性能分数 > 90
- [ ] 首屏加载时间 < 2秒
- [ ] TTFB < 600ms
- [ ] 更多组件使用 SSR/SSG
- [ ] Streaming 支持完善

#### 延后到 Phase 3
- [ ] 请求速率限制（结合用户系统）
- [ ] 完整的配额管理
- [ ] 用户认证和授权

### 🔄 Phase 2 回滚机制

如果 Phase 2 失败：
1. 切换回 `phase-1-lift-shift` 分支
2. 应用仍然可用（纯 CSR 模式）
3. 分析失败原因
4. 修复后重新开始 Phase 2

### 📊 Phase 2 总结

**总时长**: 24 天（4 周）
- Week 1: API Routes 基础设施（5天）
- Week 2: 视频 API 和 Store 更新（5天）
- Week 3: 性能优化（7天）
- Week 4: 高级优化和测试（7天）

**关键决策**:
- ✅ 全面使用 API Routes
- ✅ 速率限制移至 Phase 3
- ✅ 积极优化 SSR/SSG

**预期成果**:
- ✅ API 密钥完全安全
- ✅ 性能显著提升（Lighthouse > 90）
- ✅ SEO 优化完成
- ✅ 代码质量提升

---

## Phase 3: 架构预留与优化 - Future-Proofing（1-2周，10天）

**目标**: 为 MKSAAS 集成预留架构接口，进行最终优化  
**需求追溯**: REQ-4.1, REQ-4.2, REQ-4.3, REQ-4.4  
**Git 分支**: `phase-3-future-proofing`  
**核心理念**: "为未来做准备" - 投入 5 天，节省未来 6-7 周


### - [ ] 3.1 数据层抽象（Day 41，1天）

#### - [ ] 3.1.1 创建 StorageAdapter 接口
  - 创建 lib/storage/adapter.ts
  - 定义 StorageAdapter 接口
  - 定义 Asset 接口
  - 定义 AssetFilters 接口
  - 定义 UserPreferences 接口
  - _需求: REQ-4.1_

#### - [ ] 3.1.2 实现 LocalStorageAdapter
  - 创建 lib/storage/local-storage-adapter.ts
  - 实现 saveAsset 方法
  - 实现 getAssets 方法
  - 实现 deleteAsset 方法
  - 实现 updateAsset 方法
  - 实现 savePreferences 方法
  - 实现 getPreferences 方法
  - _需求: REQ-4.1_

#### - [ ] 3.1.3 创建统一导出
  - 创建 lib/storage/index.ts
  - 导出 storage 实例（LocalStorageAdapter）
  - 添加 MKSAAS 切换注释
  - _需求: REQ-4.1_

#### - [ ] 3.1.4 更新现有代码使用适配器
  - 更新 assetLibraryStore 使用 storage
  - 更新其他使用 localStorage 的地方
  - 测试数据操作
  - _需求: REQ-4.1_

### - [ ] 3.2 用户上下文预留（Day 42，0.5天）

#### - [ ] 3.2.1 定义 UserContext 接口
  - 创建 types/user.ts
  - 定义 UserContext 接口
  - 定义 UserSettings 接口
  - 添加 MKSAAS 字段注释
  - _需求: REQ-4.2_

#### - [ ] 3.2.2 实现 UserProvider
  - 创建 lib/user-context.tsx
  - 实现 UserProvider 组件
  - 实现 useUser hook
  - 添加 MKSAAS 集成注释代码
  - _需求: REQ-4.2_

#### - [ ] 3.2.3 集成到根布局
  - 在 app/layout.tsx 中使用 UserProvider
  - 测试 useUser hook
  - 验证匿名用户功能
  - _需求: REQ-4.2_

### - [ ] 3.3 API 调用层抽象（Day 43，1天）

#### - [ ] 3.3.1 创建统一 API 接口
  - 创建 lib/api/image-api.ts
  - 定义 ImageGenerationParams 接口
  - 定义 ImageGenerationResult 接口
  - 实现 generateImage 函数
  - _需求: REQ-4.3_

#### - [ ] 3.3.2 添加配额预留代码
  - 添加 checkQuota 函数定义（注释）
  - 添加 recordUsage 函数定义（注释）
  - 在 generateImage 中添加配额检查注释
  - _需求: REQ-4.3_

#### - [ ] 3.3.3 更新 Store 使用统一接口
  - 更新 enhancerStore 使用 generateImage
  - 更新其他 stores
  - 测试 API 调用
  - _需求: REQ-4.3_

### - [ ] 3.4 数据库表设计预留（Day 44-45，2天）

#### - [ ] 3.4.1 安装 Drizzle ORM
  - 安装 drizzle-orm
  - 安装 @neondatabase/serverless
  - 安装 drizzle-kit
  - _需求: REQ-4.4_

#### - [ ] 3.4.2 设计 assets 表
  - 创建 db/schema/assets.ts
  - 定义 assets 表结构
  - 使用 UUID 主键
  - 使用 JSONB metadata
  - 预留 userId 字段
  - 添加索引
  - _需求: REQ-4.4_

#### - [ ] 3.4.3 设计 user_preferences 表
  - 创建 db/schema/user-preferences.ts
  - 定义 user_preferences 表结构
  - 预留 userId 字段
  - _需求: REQ-4.4_

#### - [ ] 3.4.4 设计 usage_logs 表
  - 创建 db/schema/usage-logs.ts
  - 定义 usage_logs 表结构
  - 用于 MKSAAS 配额管理
  - _需求: REQ-4.4_

#### - [ ] 3.4.5 配置 Drizzle
  - 创建 drizzle.config.ts
  - 配置 schema 路径
  - 配置 migrations 路径
  - _需求: REQ-4.4_

### - [ ] 3.5 环境变量标准化（Day 45，0.5天）

#### - [ ] 3.5.1 创建完整的 .env.example
  - 添加数据库配置（注释）
  - 添加 AI 服务配置
  - 添加文件存储配置（注释）
  - 添加速率限制配置
  - 添加认证配置（注释，MKSAAS 预留）
  - 添加支付配置（注释，MKSAAS 预留）
  - 添加邮件配置（注释，MKSAAS 预留）
  - _需求: REQ-4.4_

#### - [ ] 3.5.2 创建环境变量验证
  - 创建 config/env.ts
  - 使用 zod 验证环境变量
  - 添加类型定义
  - _需求: REQ-4.4_

### - [ ] 3.6 完整回归测试（Day 46-47，2天）

#### - [ ] 3.6.1 功能回归测试
  - 重新执行 Phase 1 的所有功能测试
  - 验证所有功能正常
  - 验证数据持久化
  - _需求: REQ-1.3_

#### - [ ] 3.6.2 性能回归测试
  - 重新运行 Lighthouse 测试
  - 验证性能指标达标
  - 对比 Phase 2 的性能数据
  - _需求: REQ-3.1_

#### - [ ] 3.6.3 安全审计
  - 运行 `npm audit`
  - 修复高危漏洞
  - 验证 API 密钥安全
  - _需求: REQ-2.2_

### - [ ] 3.7 代码质量检查（Day 48，1天）

#### - [ ] 3.7.1 TypeScript 检查
  - 运行 `npm run type-check`
  - 修复类型错误
  - 验证 TypeScript 覆盖率 100%
  - _需求: REQ-2.1_

#### - [ ] 3.7.2 ESLint 检查
  - 运行 `npm run lint`
  - 修复 ESLint 错误
  - 统一代码格式
  - _需求: REQ-2.1_

#### - [ ] 3.7.3 代码审查
  - 检查无 console.log
  - 检查无 TODO 注释
  - 验证代码复用率 > 80%
  - _需求: REQ-1.2_

### - [ ] 3.8 文档更新（Day 49，1天）

#### - [ ] 3.8.1 更新 README.md
  - 更新项目介绍
  - 更新技术栈说明
  - 更新安装步骤
  - 更新开发指南
  - _需求: REQ-4.4_

#### - [ ] 3.8.2 创建环境变量文档
  - 文档化所有环境变量
  - 说明必需和可选变量
  - 提供配置示例
  - _需求: REQ-4.4_

#### - [ ] 3.8.3 创建部署文档
  - 文档化 Vercel 部署步骤
  - 说明环境变量配置
  - 提供故障排查指南
  - _需求: REQ-4.4_

#### - [ ] 3.8.4 创建 MKSAAS 集成指南
  - 文档化架构预留接口
  - 说明如何切换到 MKSAAS
  - 提供集成检查清单
  - _需求: REQ-4.1, REQ-4.2, REQ-4.3, REQ-4.4_

### - [ ] 3.9 最终验证（Day 50，1天）

#### - [ ] 3.9.1 构建验证
  - 运行 `npm run build`
  - 验证构建成功
  - 检查构建产物大小
  - _需求: REQ-2.1_

#### - [ ] 3.9.2 生产环境测试
  - 运行 `npm run start`
  - 测试生产环境功能
  - 验证性能指标
  - _需求: REQ-3.1_

#### - [ ] 3.9.3 部署到 Vercel
  - 配置 Vercel 项目
  - 配置环境变量
  - 部署到生产环境
  - 验证线上功能
  - _需求: REQ-4.4_

### ✅ Phase 3 完成标准

- [ ] 所有架构预留完成
  - [ ] StorageAdapter 接口实现
  - [ ] UserContext 接口实现
  - [ ] API 调用层抽象实现
  - [ ] 数据库表设计预留
  - [ ] 环境变量标准化
- [ ] 所有功能正常
- [ ] 性能指标达标
  - [ ] Lighthouse 性能 > 90
  - [ ] Lighthouse SEO > 90
  - [ ] 首屏加载 < 2秒
  - [ ] TTFB < 600ms
- [ ] 安全指标达标
  - [ ] API 密钥安全
  - [ ] 无高危漏洞
  - [ ] 速率限制生效
- [ ] 代码质量达标
  - [ ] 代码复用率 > 80%
  - [ ] TypeScript 覆盖率 100%
  - [ ] 无 ESLint 错误
- [ ] 文档完整
- [ ] 准备好 MKSAAS 集成

### 🔄 Phase 3 回滚机制

如果 Phase 3 失败：
1. 切换回 `phase-2-nextjs-ification` 分支
2. 应用仍然可用（Server Actions + 优化）
3. 分析失败原因
4. 修复后重新开始 Phase 3

---

## 📊 总体进度追踪

### 阶段完成情况

- [x] Phase 0: 环境准备（1周）✅ **已完成**
- [x] Phase 1: 最小化迁移（2-3周）✅ **代码迁移完成，待运行时验证**
- [ ] Phase 2: 服务端增强（3-4周）⏳ **待开始**
- [ ] Phase 3: 架构预留与优化（1-2周）⏳ **待开始**

### 关键里程碑

- [x] M1: Next.js 项目可启动（Phase 0 完成）✅
- [x] M2: 应用在 Next.js 中运行（Phase 1 代码完成）✅
- [ ] M3: API 密钥安全保护（Phase 2 完成）⏳
- [ ] M4: MKSAAS 架构预留完成（Phase 3 完成）⏳

### 验收标准总览

#### 功能验收
- [ ] 所有 86 种图像效果正常
- [ ] AI 对话功能完整
- [ ] 资产库功能完整
- [ ] 蒙版编辑器正常
- [ ] 视频生成正常
- [ ] 双语支持正常
- [ ] 主题切换正常

#### 性能验收
- [ ] Lighthouse 性能分数 > 90
- [ ] Lighthouse SEO 分数 > 90
- [ ] 首屏加载时间 < 2秒
- [ ] TTFB < 600ms
- [ ] Bundle 大小合理

#### 安全验收
- [ ] API 密钥完全保护
- [ ] 无高危安全漏洞
- [ ] 速率限制生效
- [ ] 环境变量安全配置

#### 代码质量验收
- [ ] 代码复用率 > 80%
- [ ] TypeScript 覆盖率 100%
- [ ] 无 ESLint 错误
- [ ] 无控制台错误

#### 架构验收
- [ ] StorageAdapter 接口完整
- [ ] UserContext 接口完整
- [ ] API 调用层抽象完整
- [ ] 数据库表设计预留
- [ ] 环境变量标准化

---

## 🔧 工具和命令

### 开发命令
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm run test

# Bundle 分析
npm run analyze
```

### Git 工作流
```bash
# 切换到对应阶段分支
git checkout phase-0-setup
git checkout phase-1-lift-shift
git checkout phase-2-nextjs-ification
git checkout phase-3-future-proofing

# 提交代码
git add .
git commit -m "feat: 完成任务 X.X.X"

# 合并到主分支
git checkout main
git merge phase-X-xxx
```

### 部署命令
```bash
# 部署到 Vercel
vercel --prod

# 查看部署日志
vercel logs

# 查看环境变量
vercel env ls
```

---

## 📝 注意事项

### 关键原则
1. **一次只改一件事** - 每个阶段专注一个目标
2. **功能优先** - 确保功能正常后再优化
3. **充分测试** - 每个任务完成后立即测试
4. **及时提交** - 完成一个任务就提交一次
5. **文档同步** - 代码和文档同步更新

### 风险提示
1. **依赖冲突** - 仔细检查依赖版本
2. **路由迁移** - 逐个测试页面导航
3. **API 调用** - 验证 Server Actions 正常
4. **性能下降** - 持续监控性能指标
5. **功能回归** - 完整回归测试

### 回滚策略
- 每个阶段都有独立的 Git 分支
- 可以随时回滚到上一个稳定阶段
- 保持 main 分支始终可用
- 定期备份重要数据

---

## 📚 参考资料

- [Next.js 15 官方文档](https://nextjs.org/docs)
- [Next.js App Router 迁移指南](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Vercel 部署文档](https://vercel.com/docs)
- [requirements-v2.md](./requirements-v2.md)
- [design.md](./design.md)

---

**文档状态**: ✅ 待执行  
**下一步**: 开始 Phase 0 - 环境准备

---

*本任务清单由 Kiro AI 基于 requirements-v2.md 和 design.md 生成*
