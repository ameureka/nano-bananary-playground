<div align="center">

  <h1>Nano Bananary Playground (Next.js)</h1>
  <p>简体中文 | English</p>

  <p>
    <a href="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js" /></a>
    <a href="https://img.shields.io/badge/React-19-61dafb?logo=react"><img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react" /></a>
    <a href="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" /></a>
    <a href="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel"><img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" /></a>
    <a href="https://img.shields.io/github/stars/<owner>/<repo>?style=social"><img alt="Stars" src="https://img.shields.io/github/stars/<owner>/<repo>?style=social" /></a>
  </p>

  <p>
    <a href="https://vercel.com/new/clone?repository-url=<REPO_URL>&project-name=nano-bananary-nextjs&repository-name=nano-bananary-nextjs&env=GEMINI_API_KEY&install-command=yarn&build-command=yarn%20build"><img alt="Deploy with Vercel" src="https://vercel.com/button" /></a>
  </p>

</div>

---

## 简介（中文）

- 一个基于 Next.js 16 + React 19 + TypeScript 的图像/视频 AI 增强与生成应用。
- 通过 Google Gemini API 进行内容生成与编辑，支持在资产库中保存与预览图片与视频。
- 使用 Zustand 管理状态，统一服务层 `services/geminiService.ts` 与服务端环境管理 `lib/env.server.ts`。

### 技术栈
- Next.js 16（App Router）
- React 19
- TypeScript 5
- Zustand 5
- @google/genai

### 快速开始
```bash
# 安装依赖
yarn

# 配置环境变量
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 开发模式
yarn dev
# 访问 http://localhost:3000 （如端口占用，Next 会自动切换）

# 生产构建与启动
yarn build && yarn start
```

### 环境变量
- `GEMINI_API_KEY`（必填）：在服务端读取，文件 `lib/env.server.ts` 会在缺失时抛错。
- 仅在服务端组件、API Routes 或 Server Actions 中使用，不要在客户端直接读取。

### 编程与结构说明
- `app/`：页面与 API Routes（例如 `app/api/transformations/suggestions`）。
- `components/`：通用 UI（如资产卡片、选择弹窗）。
- `store/`：Zustand stores（增强器、聊天、资产库、日志）。
- `services/geminiService.ts`：与 Gemini API 的集中式交互与错误处理。
- `lib/env.server.ts`：服务端环境变量访问（`GEMINI_API_KEY`）。
- `types/`：通用类型与 API 响应体约束。
- `next.config.ts`：图片远程加载、编译优化与实验特性。

### 资产库与视频支持
- 生成/导出的视频 `objectUrl` 会保存到资产库，库页面通过 `<video>` 标签预览。
- 选择弹窗仅展示图片用于模型输入，避免视频误选。

### 标准发布与上线
- 版本管理：遵循 SemVer（如 `v0.1.0`）。
- 构建与运行：`yarn build && yarn start`。
- 部署到 Vercel（推荐）：
  - Git 集成（推送到 `main` 自动构建）。
  - 或本地 CLI：
    ```bash
    npm i -g vercel
    vercel link             # 关联项目
    vercel env add GEMINI_API_KEY production
    vercel deploy --prod
    ```

### Vercel 快速部署按钮与配置示例
- README 按钮（将 `<REPO_URL>` 替换为你的仓库地址）：
  ```markdown
  [![Deploy with Vercel](https://vercel.com/button)](
    https://vercel.com/new/clone?repository-url=<REPO_URL>&project-name=nano-bananary-nextjs&repository-name=nano-bananary-nextjs&env=GEMINI_API_KEY&install-command=yarn&build-command=yarn%20build
  )
  ```
- 可选 `vercel.json`（如需显式配置）：
  ```json
  {
    "framework": "nextjs",
    "buildCommand": "yarn build",
    "installCommand": "yarn",
    "env": { "GEMINI_API_KEY": "@gemini_api_key" }
  }
  ```

---

## Introduction (English)

- A Next.js 16 + React 19 + TypeScript app for AI-powered image/video enhancement and generation.
- Uses Google Gemini API with a centralized service layer; assets (images/videos) can be saved and previewed.
- Zustand for state, `services/geminiService.ts` for API interactions, `lib/env.server.ts` for server-only env access.

### Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Zustand 5
- @google/genai

### Quick Start
```bash
# Install dependencies
yarn

# Env vars
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Dev
yarn dev
# Visit http://localhost:3000 (auto port fallback if busy)

# Production build & start
yarn build && yarn start
```

### Environment Variables
- `GEMINI_API_KEY` (required): Read server-side only via `lib/env.server.ts`.
- Do not import server env helpers in client components.

### Programming Details & Structure
- `app/`: Pages and API Routes (e.g. `app/api/transformations/suggestions`).
- `components/`: UI components (asset cards, selection modal).
- `store/`: Zustand stores (enhancer, chat, asset library, logs).
- `services/geminiService.ts`: Central Gemini API calls with error handling.
- `lib/env.server.ts`: Server-only env helpers (`GEMINI_API_KEY`).
- `types/`: Types and API contracts.
- `next.config.ts`: Image remote patterns and compiler settings.

### Asset Library & Video Support
- Video `objectUrl` is persisted, library previews with `<video>`.
- Selection modal filters to images-only for model inputs.

### Standard Release & Deployment
- Versioning: SemVer (e.g., `v0.1.0`).
- Build & run: `yarn build && yarn start`.
- Vercel deployment:
  ```bash
  npm i -g vercel
  vercel link
  vercel env add GEMINI_API_KEY production
  vercel deploy --prod
  ```

### Vercel Quick Deploy Button & Config
- README button (replace `<REPO_URL>`):
  ```markdown
  [![Deploy with Vercel](https://vercel.com/button)](
    https://vercel.com/new/clone?repository-url=<REPO_URL>&project-name=nano-bananary-nextjs&repository-name=nano-bananary-nextjs&env=GEMINI_API_KEY&install-command=yarn&build-command=yarn%20build
  )
  ```
- Optional `vercel.json`:
  ```json
  {
    "framework": "nextjs",
    "buildCommand": "yarn build",
    "installCommand": "yarn",
    "env": { "GEMINI_API_KEY": "@gemini_api_key" }
  }
  ```

---

## Notes
- Replace `<owner>/<repo>` in badges and `<REPO_URL>` in the deploy button with your actual repository.
- Requires Node.js 18+.
- Images remote patterns are pre-configured in `next.config.ts` for Gemini-related hosts.

### CI 所需 GitHub Secrets（用于自动发布与 Vercel 部署）
- `GEMINI_API_KEY`：用于构建与运行（服务端读取）。
- `VERCEL_TOKEN`：Vercel 访问令牌。
- `ORG_ID`：Vercel 组织 ID。
- `PROJECT_ID`：Vercel 项目 ID。
设置方式：GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret。

---

## 发布流程（Release Guide, 中文 / English）

### 中文
- 版本号（语义化）：
  ```bash
  npm version patch   # 或 minor / major
  git push && git push --tags
  ```
- GitHub Release：在仓库创建新 Release，附上变更日志。
- 构建与上线：
  ```bash
  yarn build
  yarn start
  # Vercel（推荐）
  vercel deploy --prod
  ```
- 生产环境变量：在 Vercel 项目 Settings → Environment Variables 添加 `GEMINI_API_KEY`。
- 质量检查：
  ```bash
  yarn lint
  ```

### English
- Version bump (SemVer):
  ```bash
  npm version patch   # or minor / major
  git push && git push --tags
  ```
- GitHub Release: create a new release with changelog.
- Build & launch:
  ```bash
  yarn build
  yarn start
  # Vercel (recommended)
  vercel deploy --prod
  ```
- Production env variables: set `GEMINI_API_KEY` in Vercel Project Settings.
- Quality checks:
  ```bash
  yarn lint
  ```

---

## 贡献指南（Contributing）

### 中文
- 分支规范：`feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`。
- 提交信息（Conventional Commits）：
  - 示例：`feat(enhancer): support video preview in asset library`
  - 类型：`feat|fix|docs|chore|refactor|test|perf`。
- 开发流程：
  - Fork 仓库 → 创建分支 → 本地运行 `yarn lint && yarn build` → 提交 PR。
  - PR 请描述变更、截图（如涉及 UI）、以及对现有功能的影响。
- 变更日志：在 `CHANGELOG.md` 的 `Unreleased` 下添加条目，按 Added/Changed/Fixed/Removed 分类。

### English
- Branch naming: `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`.
- Conventional Commits:
  - Example: `feat(enhancer): support video preview in asset library`
  - Types: `feat|fix|docs|chore|refactor|test|perf`.
- Workflow:
  - Fork → create branch → run `yarn lint && yarn build` → open PR.
  - Provide description, screenshots for UI changes, and impact analysis.
- Changelog: add entries under `Unreleased` in `CHANGELOG.md` using Added/Changed/Fixed/Removed.
