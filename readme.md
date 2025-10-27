# 🍌 香蕉PS乐园 (Banana PS Playground)

一个基于 Google Gemini AI 的创意图像编辑和生成应用，提供 **86 种**艺术效果和智能对话功能。

## ✨ 项目简介

香蕉PS乐园是一个现代化的 Web 应用，利用 Google 最新的 **Gemini 2.5 Flash**、**Imagen 4.0** 和 **Veo 3.1** 模型，为用户提供强大的图像编辑、生成和 AI 对话功能。无论是将照片转换为各种艺术风格，还是通过自然语言与 AI 交流生成创意内容，都能在这里实现。

### 核心功能

- **🎨 图像增强器 (Enhancer)**: 86 种预设效果，涵盖 7 种不同的处理类型
  - 单图标准效果（55个）：乐高小人仔、高清增强、像素艺术等
  - 多图网格效果（3个）：拍立得合照、极简插画
  - 双图多模态效果（5个）：姿势迁移、表情参考
  - 风格模仿效果（1个）：智能风格迁移
  - 两步处理效果（1个）：配色方案
  - 视频生成效果（1个）：文本转视频
  - 多步视频效果（1个）：动态拍立得
- **💬 AI 对话 (Chat)**: 支持多模态对话，可以上传图片并与 AI 进行创意交流
- **📚 资产库 (Library)**: 自动保存所有生成的图像，支持预览、下载和重新编辑
- **🎬 视频生成**: 支持从文本或图片生成短视频（使用 Veo 3.1 模型）
- **🌐 国际化**: 完整的中英文双语支持（86个效果 × 2语言 = 172条翻译）

## 🏗️ 项目架构

### 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **状态管理**: Zustand (带持久化)
- **路由**: React Router v6
- **AI 服务**: Google Gemini API (@google/genai)
- **样式**: 原生 CSS + Material Design 3 设计系统

### 目录结构

```
香蕉PS乐园-(banana-ps-playground)/
├── app/                          # 页面路由
│   ├── layout.tsx               # 根布局组件
│   ├── page.tsx                 # 增强器主页
│   ├── chat/
│   │   └── page.tsx            # AI 对话页面
│   └── library/
│       └── page.tsx            # 资产库页面
│
├── components/                   # React 组件
│   ├── common/                  # 通用组件
│   │   ├── ErrorMessage.tsx    # 错误提示
│   │   ├── LoadingSpinner.tsx  # 加载动画
│   │   ├── ImagePreviewModal.tsx # 图片预览弹窗
│   │   ├── LanguageSwitcher.tsx # 语言切换器
│   │   ├── ThemeSwitcher.tsx   # 主题切换器
│   │   ├── MaterialSwitch.tsx  # Material Design 开关
│   │   └── Toast.tsx           # 提示消息
│   │
│   ├── features/                # 功能模块组件
│   │   ├── chat/               # 聊天相关
│   │   │   └── ChatSettingsModal.tsx
│   │   ├── enhancer/           # 增强器相关
│   │   │   ├── EnhancerSettingsModal.tsx
│   │   │   ├── TransformationInputArea.tsx
│   │   │   └── transformation-types/  # 各类输入组件
│   │   │       ├── SingleImageTransformation.tsx
│   │   │       ├── MultiImageTransformation.tsx
│   │   │       ├── TextToImageTransformation.tsx
│   │   │       └── VideoTransformation.tsx
│   │   └── library/            # 资产库相关
│   │       └── AssetLibraryModal.tsx
│   │
│   └── layout/                  # 布局组件
│       ├── LayoutContext.tsx   # 布局上下文
│       ├── TopAppBar.tsx       # 顶部导航栏
│       ├── Sidebar.tsx         # 侧边栏（桌面端）
│       └── BottomNav.tsx       # 底部导航（移动端）
│
├── services/                     # API 服务层
│   └── geminiService.ts        # Gemini API 封装
│
├── store/                        # Zustand 状态管理
│   ├── enhancerStore.ts        # 增强器状态
│   ├── chatStore.ts            # 对话状态
│   ├── assetLibraryStore.ts    # 资产库状态
│   ├── uiStore.ts              # UI 状态
│   └── logStore.ts             # 日志记录
│
├── i18n/                         # 国际化
│   ├── context.tsx             # i18n 上下文
│   ├── translations.ts         # 翻译配置
│   ├── zh.ts / zh-ui.ts / zh-effects.ts  # 中文翻译
│   └── en.ts / en-ui.ts / en-effects.ts  # 英文翻译
│
├── lib/                          # 业务逻辑层
│   └── actions.ts              # API 调用封装
│
├── utils/                        # 工具函数
│   ├── fileUtils.ts            # 文件处理（水印、下载等）
│   └── env.ts                  # 环境变量管理
│
├── styles/                       # 全局样式
│   └── globals.css             # Material Design 3 主题
│
├── theme/                        # 主题管理
│   └── context.tsx             # 主题上下文
│
├── constants.ts                  # 常量定义（50+ 种效果配置）
├── types.ts                      # TypeScript 类型定义
├── providers.tsx                 # 全局 Provider 组合
├── App.tsx                       # 应用入口
├── index.tsx                     # React 渲染入口
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd 香蕉PS乐园-(banana-ps-playground)
```

2. **安装依赖**
```bash
npm install
```

3. **配置 API 密钥**

创建 `.env.local` 文件并添加你的 Gemini API 密钥：
```env
GEMINI_API_KEY=your_api_key_here
```

> 获取 API 密钥：访问 [Google AI Studio](https://aistudio.google.com/apikey)

4. **启动开发服务器**
```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
npm run preview
```

## 📖 核心功能详解

### 1. 图像增强器 (Enhancer)

提供 **86 种**预设效果，分为 **5 大类别**，**7 种处理类型**：

#### 🎉 病毒式传播 (Viral) - 11个效果
- **拍立得合照** (Type 2): 将多张照片融合成温馨搞笑的拍立得合照
- **动态拍立得** (Type 7): 先生成拍立得照片，再制作成动态视频
- **3D手办**: 将照片变成可收藏的角色手办
- **Cosplay**: 将动漫角色转换为真人 Cosplay 照片
- **Funko Pop / LEGO**: 转换为玩具风格
- **钩针娃娃 / 毛绒玩具**: 手工艺品风格
- **亚克力钥匙扣**: 周边产品效果
- **极简插画** (Type 2): 将多张照片转换为黑白极简风插画
- **纸模风格**: 立体纸模型效果

#### 📷 照片处理 (Photo) - 7个效果
- **高清增强**: 提升图片分辨率和清晰度
- **照片级真实**: 将插画转换为照片
- **时尚杂志**: 高级时尚摄影风格
- **超写实**: 强闪光灯效果
- **分离并增强**: 智能背景移除
- **妆容分析**: AI 妆容建议
- **随意拍摄**: 自然快照效果

#### 🎨 设计工具 (Design) - 5个效果
- **建筑模型**: 建筑物转微缩模型
- **产品渲染**: 草图转 3D 渲染
- **工业设计渲染**: 设计稿转产品照
- **iPhone壁纸效果**: 生成手机锁屏界面
- **汽水罐设计**: 产品包装设计

#### 🛠️ 实用工具 (Tools) - 12个效果
- **自定义提示** (Type 3): 完全自由的 AI 编辑，支持双图输入
- **视频生成** (Type 6): 文本/图片转视频（Veo 3.1）
- **姿势参考** (Type 3): 将参考图的姿势应用到目标人物
- **风格模仿** (Type 4): 智能风格迁移（两步处理）
- **表情参考** (Type 3): 表情迁移
- **线稿绘画**: 生成手绘线稿
- **色板换色** (Type 5): 两步处理 - 先生成线稿，再应用调色板
- **绘画过程**: 生成4步创作过程图
- **马克笔素描**: Copic 马克笔风格
- **添加插画**: 在真实场景中添加手绘角色
- **更换背景**: Y2K 美学风格背景
- **3D屏幕效果**: 裸眼3D效果

#### ✨ 艺术效果 (Artistic) - 51个效果
包含丰富的艺术风格转换：
- **经典艺术**: 梵高风格、印象派、立体主义、浮世绘
- **现代风格**: 波普艺术、赛博朋克、蒸汽朋克、故障艺术
- **手工艺**: 水彩画、炭笔素描、十字绣、木雕、冰雕
- **数字艺术**: 像素艺术、矢量艺术、低多边形、霓虹灯光
- **特殊效果**: 双重曝光、全息图、热成像、红外线
- **材质模拟**: 火焰、水流、烟雾、星系、针织
- 以及更多创意效果...

### 2. AI 对话 (Chat)

- **多模态输入**: 支持文本 + 图片混合输入
- **上下文记忆**: 保持对话连贯性
- **图片生成**: 在对话中直接生成图片
- **提示词优化**: AI 自动优化用户输入
- **创意多样化**: 一次生成多个不同风格的图片
- **消息编辑**: 可编辑和重新生成历史消息

### 3. 资产库 (Library)

- **自动保存**: 所有生成的图片自动保存
- **批量管理**: 支持全选、删除、下载
- **快速预览**: 点击图片查看大图
- **重新编辑**: 一键将图片导入增强器继续编辑
- **持久化存储**: 使用 localStorage 保存

## 🎯 核心技术实现

### 效果类型系统

应用实现了 **7 种不同的效果处理类型**，每种类型有独特的数据流和交互模式：

#### Type 1: 单图标准效果（55个）
- **输入**: 1张图片
- **组件**: `SingleImageTransformation`
- **示例**: 乐高小人仔、高清增强、像素艺术
- **数据流**: `primaryImageUrl → editImage() → result`

#### Type 2: 多图网格效果（3个）
- **输入**: 1-4张图片（2x2网格）
- **组件**: `ImageGridTransformation` → `MultiImageGridUploader`
- **示例**: 拍立得合照、极简插画
- **数据流**: `multiImageUrls[] → editImage() → result`

#### Type 3: 双图多模态效果（5个）
- **输入**: 2张图片（第二张可选）
- **组件**: `MultiImageTransformation`
- **示例**: 自定义提示、姿势迁移、表情参考
- **数据流**: `primaryImage + secondaryImage → editImage() → result`

#### Type 4: 风格模仿效果（1个）
- **输入**: 2张图片（内容图 + 风格图）
- **特殊处理**: 两步 AI 调用
- **数据流**: 
  ```
  Step 1: styleImage → Gemini (文本生成) → stylePrompt
  Step 2: contentImage + stylePrompt → Gemini (图像生成) → result
  ```

#### Type 5: 两步处理效果（1个）✨ 新实现
- **输入**: 2张图片（原图 + 调色板）
- **效果**: 配色方案
- **数据流**:
  ```
  Step 1: primaryImage → editImage() → lineArt
  Step 2: lineArt + secondaryImage → editImage() → coloredResult
  ```

#### Type 6: 视频生成效果（1个）
- **输入**: 文本提示 + 可选图片
- **组件**: `VideoTransformation`
- **模型**: Veo 3.1 Fast
- **数据流**: `prompt + optionalImage → generateVideo() → videoUrl`

#### Type 7: 多步视频效果（1个）✨ 新完善
- **输入**: 1-4张图片
- **效果**: 动态拍立得
- **交互流程**:
  ```
  Step 1: multiImages → generateImage() → 4个图片选项
  用户选择 → setSelectedOption(url)
  Step 2: selectedOption + videoPrompt → generateVideo() → videoUrl
  ```

### 状态管理架构

使用 Zustand 实现轻量级状态管理，每个功能模块独立管理：

```typescript
// 增强器状态
enhancerStore: {
  - 图片输入管理 (primaryImageUrl, secondaryImageUrl, multiImageUrls)
  - 效果选择 (selectedTransformation)
  - 生成历史 (enhancerHistory)
  - 加载状态 (isGenerating, loadingMessage, progress)
  - 多选项管理 (imageOptions, selectedOption)
}

// 对话状态
chatStore: {
  - 聊天历史 (chatHistory)
  - 输入管理 (chatInputText, chatInputImages)
  - 设置配置 (chatSettings)
}

// 资产库状态
assetLibraryStore: {
  - 图片列表 (images)
  - 选择状态 (selectedImages)
}

// UI 状态
uiStore: {
  - 主题模式 (theme)
  - 进阶模式 (isAdvancedMode)
  - 全局提示 (toastMessage)
}
```

### AI 服务封装

`services/geminiService.ts` 提供统一的 API 调用接口：

#### 核心 API 函数

- **editImage**: 图像编辑（支持多图输入和蒙版）
  - 模型: `gemini-2.5-flash-image`
  - 支持: 单图/多图、蒙版编辑
  
- **generateImageFromText**: 纯文本生成图像
  - 模型: `imagen-4.0-generate-001`
  - 支持: 宽高比选择、批量生成
  
- **generateVideo**: 视频生成
  - 模型: `veo-3.1-fast-generate-preview`
  - 支持: 文本提示、图片起始帧、宽高比
  
- **generateStyleMimicImage**: 风格模仿（两步处理）
  - Step 1: 使用 `gemini-2.5-flash` 分析风格
  - Step 2: 使用 `gemini-2.5-flash-image` 应用风格
  
- **preprocessPrompt**: 提示词优化
  - 模型: `gemini-2.5-flash`
  - 功能: 学习成功案例，优化用户输入
  
- **generateImageInChat**: 对话中生成图像
  - 支持: 多模态输入、创意多样化、历史上下文

#### 统一的基础设施

所有 API 调用都包含：
- ✅ 统一的错误处理和友好提示
- ✅ 自动重试机制（可配置次数）
- ✅ 完整的日志记录（logStore）
- ✅ 进度反馈和状态更新
- ✅ 水印系统（可见 + 隐形）

### 水印系统

支持双重水印保护：
- **隐形水印**: 使用 LSB 算法嵌入不可见水印
- **可见水印**: 在图片角落添加文字水印
- **进阶模式**: 可关闭水印功能

### 国际化实现

完整的中英文双语支持：
- **UI 文本翻译**: 200+ 条界面文本
- **效果翻译**: 86 种效果 × 2 语言 = 172 条翻译
  - 每个效果包含: title + description
  - 特殊效果额外包含: uploader1Title, uploader1Desc, uploader2Title, uploader2Desc
- **动态语言切换**: 实时切换无需刷新
- **持久化语言偏好**: 使用 localStorage 保存用户选择

#### 翻译文件结构
```
i18n/
├── context.tsx          # i18n 上下文和 Hook
├── translations.ts      # 翻译配置入口
├── zh.ts / en.ts       # 语言入口文件
├── zh-ui.ts / en-ui.ts # UI 文本翻译
└── zh-effects.ts / en-effects.ts # 效果翻译
```

## 🎨 设计系统

基于 Material Design 3 规范：

### 视觉设计
- **动态主题**: 支持亮色/暗色模式，自动适配系统偏好
- **Material Symbols**: 使用 Google 图标库（Outlined 风格）
- **色彩系统**: 完整的 MD3 色彩令牌（primary, secondary, tertiary, error 等）
- **圆角系统**: 统一的圆角规范（8px, 12px, 16px）

### 响应式布局
- **桌面端**: 左右两栏卡片布局（侧边栏 + 主内容）
- **移动端**: 自动堆叠布局（底部导航 + 主内容）
- **断点**: 768px（通过 CSS Grid 的 `auto-fit` 实现）
- **自适应网格**: `repeat(auto-fit, minmax(350px, 1fr))`

### 交互设计
- **水波纹效果**: 所有可点击元素的 Material Ripple
- **流畅动画**: CSS 过渡和关键帧动画
- **加载状态**: 进度条 + 旋转图标 + 状态文字
- **状态反馈**: 禁用、加载、成功、错误的完整视觉反馈

### 无障碍支持
- **语义化 HTML**: 正确使用 `<button>`, `<nav>`, `<main>` 等标签
- **ARIA 属性**: `aria-label`, `aria-disabled`, `aria-busy` 等
- **键盘导航**: 完整的 Tab 键导航支持
- **对比度**: 符合 WCAG AA 标准

## 🔧 配置说明

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,              // 默认端口（如被占用会自动递增）
      host: '0.0.0.0',         // 支持局域网访问
    },
    plugins: [react()],        // React 插件（支持 Fast Refresh）
    define: {
      // 环境变量注入
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),  // 路径别名
      }
    }
  };
});
```

### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",              // 现代 JavaScript 特性
    "module": "ESNext",              // ES 模块
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",              // React 17+ 新 JSX 转换
    "moduleResolution": "bundler",   // Vite 模块解析
    "paths": {
      "@/*": ["./*"]                 // 路径映射
    },
    "skipLibCheck": true,            // 跳过类型检查以提升速度
    "noEmit": true                   // 不生成输出文件
  }
}
```

### 环境变量配置

创建 `.env.local` 文件：

```env
# Gemini API 密钥（必需）
GEMINI_API_KEY=your_api_key_here

# 获取方式：访问 https://aistudio.google.com/apikey
```

## 📝 开发指南

### 添加新效果

#### 1. 确定效果类型

首先确定你的效果属于哪种类型：
- Type 1: 单图标准效果（最常见）
- Type 2: 多图网格效果（需要 `maxImages: 4`）
- Type 3: 双图多模态效果（需要 `isMultiImage: true`）
- Type 4: 风格模仿效果（需要 `isStyleMimic: true`）
- Type 5: 两步处理效果（需要 `isTwoStep: true` + `stepTwoPrompt`）
- Type 6: 视频生成效果（需要 `isVideo: true`）
- Type 7: 多步视频效果（需要 `isMultiStepVideo: true` + `videoPrompt`）

#### 2. 在 `constants.ts` 中添加配置

```typescript
{
  key: "myNewEffect",                    // 唯一标识
  titleKey: "transformations.effects.myNewEffect.title",
  descriptionKey: "transformations.effects.myNewEffect.description",
  prompt: "Your AI prompt here...",      // 发送给 Gemini 的提示词
  icon: "auto_awesome",                  // Material Symbols 图标名
  // 根据类型添加特殊属性
  // maxImages: 4,                       // Type 2
  // isMultiImage: true,                 // Type 3
  // isTwoStep: true,                    // Type 5
  // stepTwoPrompt: "...",               // Type 5
  // isVideo: true,                      // Type 6
  // isMultiStepVideo: true,             // Type 7
  // videoPrompt: "...",                 // Type 7
}
```

#### 3. 添加翻译

在 `i18n/zh-effects.ts`:
```typescript
myNewEffect: { 
  title: "我的新效果", 
  description: "效果描述..." 
}
```

在 `i18n/en-effects.ts`:
```typescript
myNewEffect: { 
  title: "My New Effect", 
  description: "Effect description..." 
}
```

#### 4. 测试效果

- 重启开发服务器（如果需要）
- 在效果选择器中找到新效果
- 测试各种输入情况
- 检查错误处理

### 添加新页面

1. 在 `app/` 目录创建页面组件（如 `app/mypage/page.tsx`）
2. 在 `App.tsx` 添加路由配置
3. 在 `components/layout/Sidebar.tsx` 和 `BottomNav.tsx` 添加导航入口
4. 添加相应的翻译文本

### 调试技巧

#### 查看 API 调用日志
```typescript
// 在浏览器控制台
useLogStore.getState().logs  // 查看所有日志
```

#### 开启进阶模式
- 连续点击应用标题 5 次
- 进阶模式会禁用水印，显示更多调试信息

#### 使用 React DevTools
- 安装 React DevTools 浏览器扩展
- 查看组件树和 Props
- 监控 Zustand Store 状态变化

#### 查看网络请求
- 打开浏览器 DevTools → Network 标签
- 筛选 XHR/Fetch 请求
- 查看 Gemini API 的请求和响应

## 🚨 常见问题

### API 密钥相关

**Q: 如何获取 Gemini API 密钥？**
- 访问 https://aistudio.google.com/apikey
- 使用 Google 账号登录
- 创建新的 API 密钥
- 复制密钥到 `.env.local` 文件

**Q: API 密钥配置后不生效？**
- 确保 `.env.local` 文件在项目根目录
- 密钥格式：`GEMINI_API_KEY=AIza...`（不要有引号）
- 重启开发服务器使环境变量生效
- 检查浏览器控制台是否有错误

### 图片生成相关

**Q: 图片生成失败怎么办？**
1. 检查网络连接（需要访问 Google API）
2. 查看浏览器控制台错误信息
3. 某些提示词可能触发安全过滤（尝试修改提示词）
4. 使用自动重试功能（在设置中配置）
5. 检查 API 配额是否用完

**Q: 为什么生成的图片有水印？**
- 默认情况下会添加水印保护版权
- 开启进阶模式可以禁用水印（连续点击标题5次）

**Q: 多图效果如何使用？**
- **拍立得合照**: 上传1-4张照片到网格上传器
- **配色方案**: 上传原图 + 调色板参考图
- **姿势迁移**: 上传角色图 + 姿势参考图
- **动态拍立得**: 上传多张照片 → 选择一张 → 创建视频

### 视频生成相关

**Q: 视频生成需要多长时间？**
- 通常需要 2-5 分钟
- 系统会显示实时进度提示
- 请耐心等待，不要关闭页面

**Q: 视频生成失败？**
- 检查提示词是否合理
- 确保起始图片清晰度足够
- 视频生成对 API 配额要求较高

### 性能优化

**Q: 应用运行缓慢？**
- 图片会自动压缩为 base64（可能占用内存）
- 使用资产库管理大量图片
- 定期清理浏览器缓存
- 关闭不需要的浏览器标签页

**Q: 如何提升生成速度？**
- 减少生成图片数量（在设置中调整）
- 使用较小尺寸的输入图片
- 避免过于复杂的提示词

### 其他问题

**Q: 如何切换语言？**
- 点击顶部导航栏的语言切换按钮
- 支持中文和英文

**Q: 生成的图片保存在哪里？**
- 自动保存到资产库（使用 localStorage）
- 可以在资产库页面查看、下载、删除
- 建议定期下载重要图片到本地

**Q: 如何报告 Bug 或提出建议？**
- 查看浏览器控制台的错误信息
- 记录复现步骤
- 在项目 Issues 中提交反馈

## � 项目证统计

- **总代码行数**: ~15,000+ 行
- **组件数量**: 50+ 个 React 组件
- **效果数量**: 86 种图像/视频效果
- **翻译条目**: 370+ 条（中英文）
- **AI 模型**: 3 个（Gemini 2.5 Flash, Imagen 4.0, Veo 3.1）
- **支持的图片格式**: PNG, JPEG, WebP
- **支持的视频格式**: MP4
- **最大图片数量**: 4 张（多图网格效果）

## 🔄 更新日志

### v1.1.0 (2025-10-25)
- ✅ 实现了 `isTwoStep` 两步处理逻辑（配色方案效果）
- ✅ 完善了 `isMultiStepVideo` 视频生成流程（动态拍立得）
- ✅ 验证了所有 86 个效果的翻译完整性
- ✅ 统一了所有效果的页面布局
- ✅ 添加了完整的效果类型分类系统
- ✅ 优化了多选项图片的交互体验

### v1.0.0 (2025-10-24)
- 🎉 初始版本发布
- 实现了 7 种效果处理类型
- 完整的中英文双语支持
- Material Design 3 设计系统
- 响应式布局适配

## 🛣️ 未来计划

- [ ] 添加更多艺术效果
- [ ] 支持批量处理
- [ ] 添加效果预览功能
- [ ] 实现效果收藏功能
- [ ] 支持自定义水印
- [ ] 添加社区分享功能
- [ ] 优化移动端体验
- [ ] 支持更多语言

## 📄 许可证

本项目仅供学习和研究使用。

## 🙏 致谢

- **Google Gemini AI 团队** - 提供强大的 AI 模型
- **Material Design 团队** - 优秀的设计系统
- **React 社区** - 现代化的前端框架
- **Vite 团队** - 快速的构建工具
- **Zustand 团队** - 简洁的状态管理
- **所有开源贡献者** - 让这个项目成为可能

## 📞 联系方式

- **项目作者**: ZHO
- **GitHub**: [项目仓库链接]
- **问题反馈**: [Issues 页面]

---

**Made with ❤️ by ZHO**

*香蕉PS乐园 - 让创意触手可及* 🍌✨

## Button System (MD3)
- 使用 `btn` 基类与以下修饰：`btn-filled`, `btn-tonal`, `btn-text`, `btn-outlined`。
- 交互反馈统一通过 `ripple-surface`，提供 hover/pressed 与涟漪效果。
- 禁用态：通过 `:disabled` 控制外观与交互，建议同时设置 `aria-disabled`。
- 示例（主操作按钮，全宽 48px）：
```
<button class="btn btn-filled ripple-surface" style="width:100%;height:48px" disabled={isDisabled}>
  {isLoading ? (<span class="material-symbols-outlined" style="animation:spin 1s linear infinite">progress_activity</span>) : (<span class="material-symbols-outlined">auto_fix_high</span>)}
  {isLoading ? t('app.generating') : t('app.generateImage')}
</button>
```

## Enhancer Workflow
- 视图层：`app/page.tsx`（EnhancerPage）负责渲染与交互。
- 状态层：`store/enhancerStore.ts` 管理 `primaryImageUrl`, `isGenerating`, `generatedContent`, `error` 等。
- 选择器：建议在 `store/selectors.ts` 提供 `getGenerateDisabled(state)` 与 `getLoadingMessage(state)`，集中维护禁用逻辑与加载文案。
- 上传路由：`components/features/enhancer/TransformationInputArea.tsx` 根据效果类型分发到具体上传组件。
- 结果面板：`components/ResultDisplay.tsx` 展示成功态；空态建议复用 `components/common/EmptyState.tsx`。

## Global Styles
- 所有样式集中在 `styles/globals.css`，`index.css` 已移除，不再引用。
- 主题令牌：使用 Material Design 3 变量 `--md-sys-color-*` 统一颜色与状态。
