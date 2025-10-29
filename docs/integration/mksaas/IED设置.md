好的，这是根据您的要求对第二个文档（IDE 设置）进行的完整 Markdown 格式转换。其中包含了所有标题、文本、代码块、结构，并对图片内容进行了解析和描述。

***

### 文件 2：IDE 设置

<+> MkSaaS 文档
Π
Q 搜索文档
*   **主页**
*   介绍
*   <> 代码库
*   视频教程
*   **入门**
*   <> 环境设置
*   **配置**
*   网站配置
*   导航栏菜单
*   页脚菜单
*   侧边栏菜单
*   头像按钮
*   社交媒体
*   价格计划
*   信用套餐
*   **部署**
*   韦尔塞尔
*   Cloudflare
*   码头工人
*   **集成**
*   数据库
*   验证
*   电子邮件
*   通讯
*   贮存
*   支付
*   致谢
*   ① 计划任务
*   人工智能
*   分析
*   4 通知
*   ○ 验证码
*   聊天框
*   关联公司
*   **定制**
*   目元数据
*   T字体
*   主题
*   图片
*   国际化
*   博客
*   文档
*   **成分**
*   ● 自定义页面
*   登陆页面
*   用户管理
*   **代码库**
*   □ IDE 设置
*   品项目结构
*   ▲ 格式化和 Linting
*   更新代码库

---

### IDE 设置

了解如何设置 VSCode、Cursor 或其他 IDE，以便使用 MkSaaS 实现最佳开发。

MkSaaS 附带针对 VSCode 和 Cursor 等流行代码编辑器的预配置设置，以提供最佳的开发体验。

#### 推荐的 IDE - Cursor

Cursor 是一款基于 VSCode 构建的代码编辑器，提供 AI 辅助开发功能。它尤其适用于 MkSaaS 开发。

##### 用户规则

MkSaaS 在 `.cursor/rules` 目录中包含几个预定义的 Cursor 规则，这些规则为项目中使用的不同技术提供了编码最佳实践和指南。这些规则有助于维护代码质量和一致性：

*   `项目结构.mdc`
*   `开发工作流.mdc`
*   `数据库状态管理.mdc`
*   `ui-组件.mdc`
*   `typescript-最佳实践.mdc`
*   `nextjs-最佳实践.mdc`
*   `react-best-practices.mdc`
*   `tailwindcss-最佳实践.mdc`
*   `radix-ui-最佳实践.mdc`
*   `react-hook-form-最佳实践.mdc`
*   `zustand-最佳实践.mdc`
*   `drizzle-orm-最佳实践.mdc`
*   `日期-fns-最佳实践.mdc`
*   `zod-最佳实践.mdc`
*   `条纹最佳实践.mdc`
*   `ai-sdk-最佳实践.mdc`

这些规则会自动加载到 Cursor 中，您可以通过从 Cursor 规则面板中选择它们来应用到您的代码中。它们提供上下文感知的指导，以改进您的开发工作流程。

##### 文档

为了增强您的开发体验，建议将关键技术的官方文档添加到您的 Cursor 文档面板中。

考虑添加以下文档：

*   **Next.js 文档** - 核心框架功能
*   **Drizzle ORM 文档** - 用于数据库操作
*   **Tailwind CSS 文档** - 用于样式
*   **Radix UI 文档** - 适用于 UI 组件
*   **Shadcn/ui 文档** - 适用于预构建组件
*   **Magic UI 文档** - 适用于 Magic UI 组件
*   **更好的身份验证文档** - 用于身份验证
*   **重新发送文档** - 用于电子邮件和新闻通讯功能
*   **Stripe 文档** - 用于支付处理
*   **Vercel AI SDK 文档** - 有关 AI 功能
*   **Vercel AI 网关文档** - 对于 AI 网关
*   **Vercel AI Elements 文档** - 适用于 AI Elements
*   **Zod 文档** - 用于模式验证
*   **Zustand 文档** - 用于状态管理
*   **Next-Intl 文档** - 用于国际化
*   **Fumadocs 文档** - 用于文档
*   **下一步安全行动文档** - 用于安全行动
*   **Nuqs 文档** - 用于类型安全的搜索参数状态管理器
*   **MkSaaS 文档** - 有关 MkSaaS 文档

要在 Cursor 中添加文档：

1.  打开游标设置
2.  转到 Indexing & Docs 选项卡
3.  前往 Docs 面板
4.  点击 + Add doc 按钮
5.  输入文档 URL 和名称

![图片描述：Cursor 编辑器的设置界面，展示了“Indexing & Docs”功能。用户可以在此添加和管理外部技术文档，以便 AI 在编码时参考。列表中已添加了 Fumadocs、Vercel AI SDK、Resend 等多个文档源。](https://storage.googleapis.com/agent-tools-public-mde/1723143360211-1.png)

#### 推荐的 IDE 扩展

该项目包含一个 `.vscode/extensions.json` 文件，当您在 VSCode 或 Cursor 中打开项目时，该文件会提示您安装推荐的扩展程序。MkSaaS 与以下扩展程序配合使用效果最佳：

1.  **生物群系 (Biome)**
    Biome 是一款功能强大的格式化程序、lint 等工具，适用于 JavaScript 和 TypeScript 项目。它是 ESLint 和 Prettier 等工具的高性能替代品，在一个快速的软件包中同时提供格式化和 lint 功能。
    [下载 Biome 扩展](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

2.  **Tailwind CSS IntelliSense**
    Tailwind CSS IntelliSense 为 Tailwind CSS 类、linting 和悬停预览提供自动完成建议，使使用实用优先 CSS 变得更加容易。
    [下载 Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

3.  **i18n 盟友 (i18n Ally)**
    i18n Ally 是 VSCode 的强大国际化扩展，可帮助您管理翻译、提供键的自动完成功能并在代码中显示内联翻译。
    [下载 i18n Ally 扩展](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

    ![图片描述：i18n Ally 扩展在 VS Code 中的使用界面。左侧边栏显示了翻译键的树状视图和翻译进度（英语和中文均为100%）。右侧编辑器中打开了`en.json`语言文件，展示了键值对结构的翻译内容。](https://storage.googleapis.com/agent-tools-public-mde/1723143360211-2.png)

4.  **GitLens**
    GitLens 增强了 VSCode/Cursor 中的 Git 功能。它可以帮助您直观地查看代码作者，无缝浏览 Git 存储库，浏览提交历史记录，并直接在编辑器中比较更改。
    [下载 GitLens 扩展](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

5.  **编辑器配置 (EditorConfig)**
    EditorConfig 有助于在不同的编辑器和 IDE 之间保持一致的编码风格。它对于强制执行一致的代码格式和缩进规则尤其有用。
    [下载 EditorConfig 扩展](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

6.  **MDX**
    MDX 扩展为 MDX 文件提供了语法高亮、智能语言功能和丰富的编辑支持。它对于处理 MkSaaS 项目中的文档和内容至关重要。
    [下载 MDX 扩展](https://marketplace.visualstudio.com/items?itemName=mdx-js.mdx)

#### 推荐的编辑器配置

该存储库包含 `.vscode/settings.json` 中的预配置设置，用于设置：

*   生物群系设置
*   i18n 设置
*   搜索设置

#### 推荐的工作流程

为了获得 MkSaaS 的最佳开发体验：

1.  **使用集成终端**
    使用 VSCode/Cursor 中的集成终端运行开发命令，而无需切换上下文。

2.  **使用源代码控制面板**
    VSCode/Cursor 中的 Git 集成使得暂存、提交和推送更改变得容易。

3.  **利用 IntelliSense**
    TypeScript 和 React 内置的 IntelliSense 可帮助您更快地编写正确的代码。

4.  **使用 i18n Ally 进行翻译**
    利用 i18n Ally 直接在编辑器中管理翻译，确保您的应用程序正确国际化。

#### 视频教程

![图片描述：一个视频教程的缩略图，标题为“MkSaaS 模板 配置和部署教程”，副标题为“从拉取代码到部署上线的全流程实录”。画面中有一个火箭图标，象征着部署和启动。](https://storage.googleapis.com/agent-tools-public-mde/1723143360211-3.png)
> [在 YouTube 上观看：MkSaaS 模板的网站配置和部署教程](https://www.youtube.com/watch?v=placeholder)

#### 后续步骤

现在您的编辑器已配置完毕，请探索以下相关主题：

| | |
| :--- | :--- |
| **项目结构**<br>了解项目的组织结构 | **代码检查和格式化**<br>使用 linting 和格式化代码 |
| **环境设置**<br>配置环境变量 | **更新代码库**<br>保持代码库更新 |

< **用户管理**
了解如何在 MkSaaS 模板中管理用户

**项目结构 >**
MkSaaS 样板文件和文件夹组织概述