<div align="center">

  <h1>欢迎来到香蕉PS乐园！</h1>
  <h2>Welcome to Banana PS Playground!</h2>
  <p>AI-Powered Image & Video Generation Platform</p>

  <p>
    <a href="./README.md">简体中文</a> | <a href="./README_EN.md">English</a>
  </p>

  <br/>

  <video src="https://github.com/ameureka/nano-bananary-playground/raw/main/docs/banana_play.mp4" controls width="600">
    您的浏览器不支持视频播放，请<a href="https://github.com/ameureka/nano-bananary-playground/raw/main/docs/banana_play.mp4">点击这里下载视频</a>
  </video>
  
  <p>🎥 项目演示视频 / Project Demo Video</p>
  
  <p>
    <a href="https://www.youtube.com/watch?v=DnxjUjfClGQ">
      📺 也可以在 YouTube 观看 / Watch on YouTube
    </a>
  </p>

  <br/>

  <p>
    <a href="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js" /></a>
    <a href="https://img.shields.io/badge/React-19-61dafb?logo=react"><img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react" /></a>
    <a href="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" /></a>
    <a href="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel"><img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" /></a>
  </p>

  <p>
    <a href="https://vercel.com/new/clone?repository-url=https://github.com/ameureka/nano-bananary-playground&project-name=nano-bananary-playground&repository-name=nano-bananary-playground&env=GEMINI_API_KEY&install-command=yarn&build-command=yarn%20build"><img alt="Deploy with Vercel" src="https://vercel.com/button" /></a>
  </p>

</div>

---

## 📖 项目简介

Nano Bananary Playground 是一个基于 Next.js 16 + React 19 + TypeScript 构建的现代化 AI 图像与视频生成平台。通过集成 Google Gemini API，提供强大的图像生成、编辑、视频创作和 AI 对话功能。

### ✨ 核心特性

- 🎨 **图像生成与编辑**：文生图、图生图、图像编辑、风格迁移、批量处理
- 🎬 **视频生成**：AI 驱动的视频内容创作
- 💬 **智能对话**：基于 Gemini 的 AI 聊天助手
- 📚 **资产库管理**：统一管理生成的图像和视频资源
- 🌍 **国际化支持**：中英文双语界面
- 🎭 **主题切换**：支持明暗主题
- 📱 **响应式设计**：适配桌面端和移动端

## 🏗️ 项目架构

### 技术栈

```
Frontend:
├── Next.js 16 (App Router)
├── React 19
├── TypeScript 5
├── Zustand 5 (状态管理)
└── Material-UI (UI 组件库)

Backend:
├── Next.js API Routes
├── Google Gemini API
└── Server Actions

Development:
├── ESLint
├── Prettier
└── Yarn
```

### 目录结构

```
nano-bananary-playground/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── chat/                 # 聊天相关 API
│   │   ├── image/                # 图像处理 API
│   │   ├── video/                # 视频生成 API
│   │   └── transformations/      # 转换建议 API
│   ├── chat/                     # 聊天页面
│   ├── library/                  # 资产库页面
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页（增强器）
│   └── globals.css               # 全局样式
│
├── components/                   # React 组件
│   ├── common/                   # 通用组件
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── features/                 # 功能组件
│   │   ├── chat/                 # 聊天功能
│   │   ├── enhancer/             # 增强器功能
│   │   └── library/              # 资产库功能
│   └── layout/                   # 布局组件
│       ├── MainLayout.tsx
│       ├── Sidebar.tsx
│       ├── TopAppBar.tsx
│       └── BottomNav.tsx
│
├── store/                        # Zustand 状态管理
│   ├── enhancerStore.ts          # 增强器状态
│   ├── chatStore.ts              # 聊天状态
│   ├── assetLibraryStore.ts      # 资产库状态
│   ├── uiStore.ts                # UI 状态
│   ├── logStore.ts               # 日志状态
│   └── selectors.ts              # 状态选择器
│
├── services/                     # 服务层
│   └── geminiService.ts          # Gemini API 集成
│
├── lib/                          # 工具库
│   ├── env.server.ts             # 服务端环境变量
│   ├── api-utils.ts              # API 工具函数
│   ├── actions.ts                # Server Actions
│   └── videoOperationStore.ts    # 视频操作存储
│
├── i18n/                         # 国际化
│   ├── translations.ts           # 翻译配置
│   ├── context.tsx               # i18n Context
│   ├── zh.ts, en.ts              # 语言文件
│   └── ...
│
├── types/                        # TypeScript 类型定义
│   ├── api.ts                    # API 类型
│   └── index.ts                  # 通用类型
│
├── theme/                        # 主题配置
│   └── context.tsx               # 主题 Context
│
├── utils/                        # 工具函数
│   └── fileUtils.ts              # 文件处理工具
│
├── .github/                      # GitHub 配置
│   └── workflows/                # CI/CD 工作流
│       └── deploy.yml
│
├── docs/                         # 文档
├── next.config.ts                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
├── eslint.config.mjs             # ESLint 配置
├── .prettierrc                   # Prettier 配置
└── package.json                  # 项目依赖
```

## 🎯 设计思路

### 1. 架构设计原则

**分层架构**
- **表现层**：React 组件，负责 UI 渲染和用户交互
- **状态层**：Zustand stores，管理应用状态
- **服务层**：统一的 API 调用封装
- **数据层**：API Routes 和 Server Actions

**模块化设计**
- 按功能模块组织代码（chat、enhancer、library）
- 组件按职责分类（common、features、layout）
- 清晰的依赖关系，避免循环依赖

**类型安全**
- 全面的 TypeScript 类型定义
- API 请求/响应类型约束
- 严格的类型检查

### 2. 状态管理策略

使用 Zustand 实现轻量级状态管理：

```typescript
// 增强器状态
enhancerStore: {
  - 转换类型选择
  - 输入参数管理
  - 生成结果处理
  - 历史记录
}

// 聊天状态
chatStore: {
  - 消息列表
  - 会话管理
  - 流式响应处理
}

// 资产库状态
assetLibraryStore: {
  - 资产列表
  - 筛选和排序
  - 选择模式
}

// UI 状态
uiStore: {
  - 侧边栏展开/收起
  - 模态框状态
  - Toast 通知
}
```

### 3. API 设计

**RESTful 风格**
```
POST   /api/image/generate        # 生成图像
POST   /api/image/edit            # 编辑图像
POST   /api/image/batch           # 批量处理
POST   /api/image/style-mimic     # 风格迁移
POST   /api/video/generate        # 生成视频
GET    /api/video/status/:id      # 查询视频状态
POST   /api/chat/generate         # 聊天生成
POST   /api/chat/preprocess       # 聊天预处理
GET    /api/transformations/suggestions  # 获取转换建议
```

**统一响应格式**
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

### 4. 服务关系图

```
┌─────────────────────────────────────────────────────────┐
│                     用户界面层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 增强器页面 │  │  聊天页面  │  │ 资产库页面 │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    状态管理层                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Enhancer  │  │  Chat    │  │  Asset   │              │
│  │  Store   │  │  Store   │  │  Store   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                     服务层                               │
│              ┌──────────────────┐                       │
│              │  geminiService   │                       │
│              │  (统一 API 封装)  │                       │
│              └──────────────────┘                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   API Routes 层                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Image   │  │  Video   │  │   Chat   │              │
│  │   API    │  │   API    │  │   API    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Google Gemini API                       │
└─────────────────────────────────────────────────────────┘
```

### 5. 核心功能实现

**图像生成流程**
1. 用户选择转换类型（文生图、图生图等）
2. 输入参数（提示词、参考图像、配置）
3. 前端验证 → 调用 API
4. API Routes 处理请求 → geminiService
5. Gemini API 生成结果
6. 返回结果 → 更新状态 → 保存到资产库

**视频生成流程**
1. 用户输入视频描述和参数
2. 调用 `/api/video/generate`
3. 返回操作 ID（异步处理）
4. 轮询 `/api/video/status/:id` 查询进度
5. 完成后获取视频 URL
6. 保存到资产库

**聊天功能流程**
1. 用户发送消息
2. 可选：预处理（图像分析等）
3. 调用 `/api/chat/generate`
4. 流式返回响应
5. 实时更新聊天界面

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Yarn 或 npm
- Google Gemini API Key

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/ameureka/nano-bananary-playground.git
cd nano-bananary-playground

# 2. 安装依赖
yarn install

# 3. 配置环境变量
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. 启动开发服务器
yarn dev

# 5. 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 环境变量配置

创建 `.env.local` 文件：

```env
# 必填：Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# 可选：其他配置
# NODE_ENV=development
```

## 📦 构建与部署

### 本地构建

```bash
# 生产构建
yarn build

# 启动生产服务器
yarn start
```

### Vercel 部署（推荐）

**方式一：一键部署**

点击上方的 "Deploy with Vercel" 按钮

**方式二：CLI 部署**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 关联项目
vercel link

# 添加环境变量
vercel env add GEMINI_API_KEY production

# 部署到生产环境
vercel deploy --prod
```

**方式三：Git 集成**

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署（推送到 main 分支时触发）

## 🛠️ 开发指南

### 代码规范

```bash
# 代码检查
yarn lint

# 代码格式化
yarn format

# 类型检查
yarn type-check
```

### 分支管理

- `main`：主分支，生产环境代码
- `develop`：开发分支
- `feat/*`：新功能分支
- `fix/*`：bug 修复分支
- `docs/*`：文档更新分支

### 提交规范

遵循 Conventional Commits：

```
feat: 新功能
fix: bug 修复
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

示例：
```bash
git commit -m "feat(enhancer): 添加批量图像处理功能"
git commit -m "fix(chat): 修复流式响应中断问题"
```

## 🤔 设计思考

### 为什么选择 Next.js？

1. **全栈能力**：API Routes 和 Server Actions 简化后端开发
2. **性能优化**：自动代码分割、图像优化、SSR/SSG
3. **开发体验**：热重载、TypeScript 支持、文件路由
4. **部署便捷**：Vercel 原生支持，零配置部署

### 为什么使用 Zustand？

1. **轻量级**：相比 Redux 更简单，无需 boilerplate
2. **TypeScript 友好**：完整的类型推导
3. **灵活性**：支持中间件、持久化、DevTools
4. **性能**：基于 React hooks，细粒度更新

### 为什么采用模块化组件设计？

1. **可维护性**：职责清晰，易于定位和修改
2. **可复用性**：通用组件可在多处使用
3. **可测试性**：独立组件易于单元测试
4. **团队协作**：降低代码冲突，提高开发效率

### API 设计考虑

1. **统一错误处理**：所有 API 返回统一格式
2. **类型安全**：请求/响应类型约束
3. **性能优化**：流式响应、异步处理
4. **安全性**：服务端环境变量，避免 API Key 泄露

## 📝 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

---

<div align="center">
  <p>Made with ❤️ by the Nano Bananary Team</p>
  <p>Powered by Google Gemini API</p>
</div>
