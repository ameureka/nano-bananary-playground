### 文件 1：Cloudflare 部署

<+> MkSaaS 文档
Π
部署
Q 搜索文档
K
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
*   中文档
*   **成分**
*   ● 自定义页面
*   登陆页面
*   用户管理
*   **代码库**
*   IDE 设置
*   品项目结构
*   A格式化和 Linting
*   更新代码库

#### 部署

### Cloudflare

了解如何将您的项目部署到 Cloudflare Workers 平台

本指南将帮助您将 mksaas 项目部署到 Cloudflare Workers 平台。

> ▲ **重要提示: 使用 Cloudflare 分支**
> 部署到 Cloudflare Workers 需要使用 cloudflare 分支，而不是 main 分支。此分支包含必要的 OpenNext.js 配置和 Cloudflare 特定的适配。

### 先决条件

在将您的项目部署到 Cloudflare Workers 之前，请确保您已：

1.  包含项目代码的 Git 存储库（例如 GitHub）
2.  Cloudflare 帐户，如果您没有，请在此处注册
3.  PostgreSQL 数据库（如果使用默认数据库配置）

> ▲ **关于 Worker 大小限制的说明**
> Cloudflare Worker 的大小限制在 Workers 免费计划中为 3 MiB，在 Workers 付费计划中为 10 MiB。构建 Worker 后，wrangler 将显示原始大小和压缩大小：
>
> `Total Upload: 13833.20 KiB / gzip: 2295.89 KiB`
>
> 只有后者（压缩大小）对 Worker 大小限制有影响，因此如果您的项目大于 3 MiB，则需要订阅 Workers Paid 计划。

### 部署步骤

#### 1\. 切换到 Cloudflare 分支

克隆 MkSaaS 模板存储库的 cloudflare 分支，并将代码推送到新的 GitHub 存储库：

```bash
# Clone the cloudflare branch of the MkSaaS template repository
git clone -b cloudflare https://github.com/MkSaaSHQ/mksaas-template.git <your-project-name>
cd <your-project-name>
#Add the upstream repository and fetch the latest changes
git remote add upstream https://github.com/MkSaaSHQ/mksaas-template.git
git fetch upstream
# Remove the origin repository and add your new GitHub repository
git remote remove origin
git remote add origin <your-repository-url>
# Rename the branch to main and push the changes to the origin repository
git branch -M main
git push -u origin main
```

#### 2\. 安装依赖项

安装所有必需的依赖项，包括 Wrangler CLI：

```bash
pnpm install
```

#### 3\. 安装 Wrangler CLI

安装 Wrangler CLI，然后运行 `wrangler login` 登录您的 Cloudflare 帐户。

```bash
pnpm install -g wrangler
# Login to your Cloudflare account
wrangler login
```

#### 4\. 设置 PostgreSQL 数据库

如果您使用默认的 PostgreSQL 数据库配置，则需要设置一个 PostgreSQL 数据库。

*   对于生产，您可以使用托管 PostgreSQL 数据库，例如 Neon 或 Supabase。
*   对于本地开发，请参阅数据库指南以创建本地 PostgreSQL 实例。

准备好 PostgreSQL 数据库后，请记下以下格式的连接字符串：

`postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name`

数据库创建完成后，需要按照数据库指南初始化数据库。

#### 5\. 配置本地开发数据库

对于本地开发，请使用本地 PostgreSQL 连接字符串更新 `wrangler.jsonc` 文件，将 `localConnectionString` 替换为实际的本地数据库连接字符串：

`wrangler.jsonc`
```json
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "YOUR_HYPERDRIVE_ID_HERE",
      "localConnectionString": "postgres://user:password@localhost:5432/your_local_database"
    }
  ]
}
```

#### 6\. 配置 Hyperdrive 绑定

Cloudflare Hyperdrive 通过池化连接和缓存请求来加速数据库查询。为您的生产数据库创建 Hyperdrive 配置：

`npx wrangler hyperdrive create <NAME_OF_HYPERDRIVE_CONFIG> --connection-string="postgres://u`

将连接字符串替换为您的实际 PostgreSQL 连接详细信息。成功创建后，您将收到一个 Hyperdrive ID，您也可以在 Cloudflare 仪表板中查看该 ID。

使用您的 Hyperdrive ID 更新 `wrangler.jsonc` 文件：

`wrangler.jsonc`
```json
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "YOUR_HYPERDRIVE_ID_HERE"
    }
  ]
}
```

#### 7\. 禁用 Hyperdrive 查询缓存

1.  前往 Cloudflare 仪表板
2.  导航至 Storage & Databases → Hyperdrive
3.  单击创建的 Hyperdrive 配置，导航至 Settings
4.  单击 Disable Caching

#### 8\. 配置环境变量

为开发和生产设置环境变量：

1.  **对于开发**：复制示例文件并进行配置
    `cp env.example .env`
    `cp dev.vars.example .dev.vars`
2.  **配置变量**：按照环境设置指南在 `.env` 文件中设置所有必需的环境变量，并暂时保留 `.dev.vars` 。

> ▲ **对于本地开发，您需要注意2个环境变量：**
> *   `NEXT_PUBLIC_BASE_URL`: 应用程序的基本 URL，将其设置为 http://localhost:8787 而不是用于本地开发的 http://localhost:3000，因为您的应用程序将由 opennext-cloudflare 运行，它将默认自动在端口 8787 上运行。
> *   `DATABASE_URL`: 数据库的连接字符串，将其设置为本地开发的本地数据库连接字符串，而不是生产托管数据库连接字符串。

#### 9\. 设置 Wrangler 配置名称

将 `wrangler.jsonc` 文件中的 `name` 设置为您的项目名称：

`wrangler.jsonc`
```json
{
  "name": "your-project-name"
}
```

#### 10\. 生成类型

配置 `.env` 和 `wrangler.jsonc` 文件后，生成 Cloudflare 特定的类型：

`pnpm run cf-typegen`

此命令将自动生成包含 Cloudflare Worker 运行时环境的类型定义的 `cloudflare-env.d.ts` 文件。

#### 11\. 创建 Cloudflare Worker 项目

1.  前往 Cloudflare 仪表板
2.  导航至 Compute (Workers) → Workers and Pages → Create → Import a repository
3.  选择您的存储库（默认使用 main 分支）
4.  **配置构建设置：**
    *   **名称：** 与 `wrangler.jsonc` 文件中的 `name` 保持一致
    *   **构建命令：** 留空
    *   **部署命令：** `pnpm run deploy`
    *   **根目录：** 保留默认
    *   **构建环境变量：** 添加 `NEXT_PUBLIC_BASE_URL` 变量，并将其设置为 `https://<your-project-name>.<account>.workers.dev` 或您的自定义域

#### 12\. 配置环境变量

在 Cloudflare Worker 中配置环境变量有两种方法：

1.  **在 Cloudflare Worker Dashboard 中配置环境变量**
    *   前往 Settings → Variables and Secrets
    *   点击 + Add，添加生产环境所有环境变量
    *   单击 Deploy 以保存变量并触发构建和部署

2.  **使用 Wrangler CLI 配置环境变量**

在项目根目录中创建一个新的 `.env.production` 文件，并将 `.env` 文件中的环境变量复制到其中：

```bash
# Copy the env file to .env.production
cp .env .env.production
# Update the environment variables in .env.production
# For example, you need to update the NEXT_PUBLIC_BASE_URL and DATABASE_URL environment variable
# Set the environment variables in Cloudflare Worker with Wrangler CLI
# https://developers.cloudflare.com/workers/wrangler/commands/#secret-bulk
wrangler secret bulk .env.production```

#### 13\. 部署您的应用程序

您可以通过两种方式部署应用程序：

**选项 1：自动部署**

*   将更改推送到 `main` 分支（`main` 分支是默认分支）
*   Cloudflare 将自动触发构建和部署

**选项 2：手动部署**

*   直接从本地机器部署：

`pnpm run deploy`

#### 14\. 设置自定义域

部署成功后，您的应用程序将在自动生成的域名上可用。您可以：

*   设置自定义域，Cloudflare 将自动为您创建 DNS 记录
*   在 Cloudflare 仪表板中监控您的应用程序，例如流量和日志



### 最佳实践

1.  **使用 `pnpm run dev` 进行本地开发**
    对于本地开发，请优先使用 `pnpm run dev` 命令，因为它可以更快地开发和调试 Next.js 应用程序。在此模式下，代码更改可以通过热重载快速反映出来。如果您使用 `pnpm run preview`，则项目将首先构建并以生产模式运行，这意味着代码更改需要再次运行 `pnpm run preview` 才能生效。

    如果您的应用程序在本地使用 `pnpm run dev` 正常运行，但在生产环境中出现异常，请检查生产日志以分析问题。如果生产日志难以访问，您可以在本地运行 `pnpm run preview` 来在类似生产环境中调试问题。

    请查看 OpenNext.js Cloudflare | 开发和部署以了解更多详细信息。

2.  **本地开发和生产使用不同的数据库**
    您应该在本地开发和生产环境中使用不同的数据库。对于本地开发，您应该使用数据库指南创建本地 PostgreSQL 实例。对于生产环境，您应该使用托管 PostgreSQL 数据库，例如 Neon 或 Supabase。

    请查看使用 Cloudflare Workers 连接到 PostgreSQL 数据库以了解更多详细信息。

3.  **启用 Worker 日志进行调试**
    默认情况下，MkSaaS 模板已在 `wrangler.jsonc` 中启用了可观察性。您可以在项目设置的“可观察性”部分下启用 Worker 日志。这可能需要创建一个新的 R2 存储桶来保存日志数据 - 只需按照仪表板上的引导设置流程操作即可。成功启用后，您可以在“日志”选项卡中查看应用程序的运行时日志。

    请查看 Cloudflare Wrangler 配置以了解更多详细信息。

### 常问问题

1.  **构建尺寸太大**：如果您的 Worker 超出尺寸限制，请考虑：
    *   升级到 Workers Paid 计划
    *   优化捆绑包大小
    *   删除不必要的依赖项

2.  **数据库连接问题**：确保您的 Hyperdrive 配置正确并且您的 PostgreSQL 数据库可访问。

3.  **环境变量问题**：确保在 Cloudflare 的两个 Worker 运行时环境中配置了所有环境变量。

4.  **类型错误**：在任何配置更改后运行 `pnpm run cf-types` 以重新生成类型定义。

### 参考

*   Cloudflare Workers 文档
*   Cloudflare Wrangler 配置
*   使用 Cloudflare Workers 连接到 PostgreSQL 数据库
*   Cloudflare Workers 定价
*   Cloudflare Hyperdrive
*   OpenNext.js Cloudflare
*   OpenNext.js Cloudflare | 开发和部署

### 视频教程

[MkSaaS模板的Cloudflare部署教程](https://www.youtube.com/watch?v=example)

### 后续步骤

现在您已了解如何将您的网站部署到 Cloudflare Workers，请探索以下相关主题：

*   **Vercel 部署**
    将您的应用程序部署到 Vercel
*   **Docker 部署**
    使用 Docker 部署应用程序
*   **更新代码库**
    保持你的申请最新
*   **数据库设置**
    设置和配置数据库

< 韦尔塞尔
了解如何将您的项目部署到 Vercel 平台

Docker >
了解如何使用 Docker 部署项目
---

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

#### IDE 设置

了解如何设置 VSCode、Cursor 或其他 IDE，以便使用 MkSaaS 实现最佳开发

MkSaaS 附带针对 VSCode 和 Cursor 等流行代码编辑器的预配置设置，以提供最佳的开发体验。

##### 推荐的 IDE - Cursor

Cursor 是一款基于 VSCode 构建的代码编辑器，提供 AI 辅助开发功能。它尤其适用于 MkSaaS 开发。

##### 用户规则

MkSaaS 在 `.cursor/rules` 目录中包含几个预定义的 Cursor 规则，这些规则为项目中使用的不同技术提供了编码最佳实践和指南。这些规则有助于维护代码质量和一致性：

*   项目结构.mdc
*   开发工作流.mdc
*   数据库状态管理.mdc
*   ui-组件.mdc
*   typescript-最佳实践.mdc
*   nextjs-最佳实践.mdc
*   react-best-practices.mdc
*   tailwindcss-最佳实践.mdc
*   radix-ui-最佳实践.mdc
*   react-hook-form-最佳实践.mdc
*   zustand-最佳实践.mdc
*   drizzle-orm-最佳实践.mdc
*   日期-fns-最佳实践.mdc
*   zod-最佳实践.mdc
*   条纹最佳实践.mdc
*   ai-sdk-最佳实践.mdc

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



##### 推荐的 IDE 扩展

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

    

4.  **GitLens**
    GitLens 增强了 VSCode/Cursor 中的 Git 功能。它可以帮助您直观地查看代码作者，无缝浏览 Git 存储库，浏览提交历史记录，并直接在编辑器中比较更改。
    [下载 GitLens 扩展](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

5.  **编辑器配置 (EditorConfig)**
    EditorConfig 有助于在不同的编辑器和 IDE 之间保持一致的编码风格。它对于强制执行一致的代码格式和缩进规则尤其有用。
    [下载 EditorConfig 扩展](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

6.  **MDX**
    MDX 扩展为 MDX 文件提供了语法高亮、智能语言功能和丰富的编辑支持。它对于处理 MkSaaS 项目中的文档和内容至关重要。
    [下载 MDX 扩展](https://marketplace.visualstudio.com/items?itemName=mdx-js.mdx)

##### 推荐的编辑器配置

该存储库包含 `.vscode/settings.json` 中的预配置设置，用于设置：

*   生物群系设置
*   i18n 设置
*   搜索设置

##### 推荐的工作流程

为了获得 MkSaaS 的最佳开发体验：

1.  **使用集成终端**
    使用 VSCode/Cursor 中的集成终端运行开发命令，而无需切换上下文。

2.  **使用源代码控制面板**
    VSCode/Cursor 中的 Git 集成使得暂存、提交和推送更改变得容易。

3.  **利用 IntelliSense**
    TypeScript 和 React 内置的 IntelliSense 可帮助您更快地编写正确的代码。

4.  **使用 i18n Ally 进行翻译**
    利用 i18n Ally 直接在编辑器中管理翻译，确保您的应用程序正确国际化。

##### 视频教程

[MkSaaS模板的网站配置和部署教程](https://www.youtube.com/watch?v=example4)

##### 后续步骤

现在您的编辑器已配置完毕，请探索以下相关主题：

*   **项目结构**
    了解项目的组织结构
*   **代码检查和格式化**
    使用 linting 和格式化代码
*   **环境设置**
    配置环境变量
*   **更新代码库**
    保持代码库更新
*   **< 用户管理**
    了解如何在 MkSaaS 模板中管理用户
*   **项目结构 >**
    MkSaaS 样板文件和文件夹组织概述

---
### 文件 3：存储

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
*   **贮存**
*   日支付
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
*   中文档
*   **成分**
*   ● 自定义页面
*   登陆页面
*   用户管理
*   **代码库**
*   IDE 设置
*   品项目结构
*   A格式化和 Linting
*   更新代码库

#### 贮存

了解如何设置和使用云存储进行文件上传和媒体处理

MkSaaS 使用 Amazon S3 和 Cloudflare R2 等兼容服务进行文件存储和媒体处理，为存储图像和其他媒体文件提供可靠且可扩展的解决方案。

##### 设置

要在 MkSaaS 中设置存储，请按照以下步骤配置必要的环境变量：

##### Cloudflare R2 (推荐)

1.  在 `cloudflare.com` 上创建 Cloudflare 帐户
2.  创建一个新的 R2 存储桶：
    *   选择一个全局唯一的存储桶名称（例如，`your-project-name`）
    *   选择靠近目标受众的地区
    *   根据需要设置其他选项
3.  允许公共访问存储桶：
    *   `Settings > Public Development URL`，点击 `Enable`
    *   将公共访问 URL 保存为 `STORAGE_PUBLIC_URL`
    *   设置自定义域以供公共访问存储桶
4.  创建一个新的 API 令牌：
    *   `R2 > API > Manage API Tokens`，单击 `Create User API Token`
    *   设置存储桶的 Object Read & Write 权限
    *   创建 API Token，获取 Access Key ID 和 Secret Access Key
5.  设置以下环境变量：
    ```.env
    STORAGE_REGION=your-region-or-auto
    STORAGE_BUCKET_NAME=your-bucket-name
    STORAGE_ACCESS_KEY_ID=your-access-key
    STORAGE_SECRET_ACCESS_KEY=your-secret-key
    STORAGE_ENDPOINT=https://xxx.r2.cloudflarestorage.com
    STORAGE_PUBLIC_URL=https://pub-xxx.r2.dev
    ```
    *   将存储提供商设置为 `s3`，因为 Cloudflare R2 与 S3 兼容。

##### 亚马逊 S3

1.  在 `aws.amazon.com` 创建 AWS 账户
2.  创建一个新的 S3 存储桶：
    *   选择一个全局唯一的存储桶名称（例如，`your-project-name`）
    *   选择靠近目标受众的地区
    *   如果您希望文件可公开访问，请禁用 `Block all public access`
    *   根据需要设置其他选项
3.  添加存储桶策略以允许公开访问。转到 `Permissions` 选项卡并添加：
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
      ]
    }
    ```
4.  创建具有 S3 访问权限的 IAM 用户：
    *   导航到 IAM 服务
    *   创建具有 S3 权限的新策略：`GetObject`, `PutObject`, `DeleteObject`, `ListBucket`
    *   创建具有 `Programmatic access` 的新 IAM 用户
    *   附加您创建的策略
    *   保存访问密钥 ID 和秘密访问密钥
5.  添加以下环境变量：
    ```.env
    STORAGE_REGION=your-region
    STORAGE_BUCKET_NAME=your-bucket-name
    STORAGE_ACCESS_KEY_ID=your-access-key
    STORAGE_SECRET_ACCESS_KEY=your-secret-key
    ```

##### S3 兼容的替代方案

MkSaaS 与任何 S3 兼容的存储服务兼容，包括：

*   **Backblaze B2** - 非常划算的选择
*   **Google Cloud Storage** - Google 基础架构带来的高性能
*   **数字海洋空间** - 定价简单并与 DO 基础设施集成

> ▲ 如果您正在设置环境，现在可以返回环境设置指南并继续。本指南的其余部分可以稍后阅读。
>
> **<> 环境设置**
> 设置环境变量

##### 存储系统结构

MkSaaS 中的存储系统设计有以下组件：

*   源码
    *   贮存
        *   提供者
        *   配置
        *   索引.ts
        *   类型.ts
        *   客户端.ts
        *   自述文件.md

这种模块化结构使得使用新的提供商和功能扩展存储系统变得容易。

##### 核心功能

*   直接文件上传和管理服务器端操作
*   基于大小优化的浏览器端文件上传
*   支持 Amazon S3 和兼容存储服务（例如 Cloudflare R2）
*   用于文件管理的文件夹组织
*   自动文件路径生成和文件命名
*   可配置的存储区域和存储桶设置

##### 用法

###### 基本文件操作

MkSaaS 为常见的文件操作提供了简单的实用程序：

```typescript
import { uploadFile, deleteFile } from '@/storage';

// Upload a file to storage
const { url, key } = await uploadFile(
  fileBuffer,
  'original-filename.jpg',
  'image/jpeg',
  'uploads/images'
);

// Delete a file from storage
await deleteFile(key);
```

###### 浏览器端上传

要直接从浏览器上传文件，请使用 `uploadFileFromBrowser` 函数：

```typescript
'use client';

import { uploadFileFromBrowser } from '@/storage/client';

// In your React component
async function handleFileUpload(event) {
  const file = event.target.files[0];
  try {
    const { url, key } = await uploadFileFromBrowser(file, 'uploads/images');
    console.log('File uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

###### 与表单组件一起使用

下面是使用存储系统和表单组件的示例：

`图片上传器.tsx`
```tsx
return (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => document.getElementById('file-upload')?.click()}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
    {imageUrl && (
      <div className="w-32 h-32 relative">
        <img
          src={imageUrl}
          alt="Uploaded image"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
    )}
  </div>
);
```

##### 定制

###### 创建自定义提供程序

MkSaaS 可以轻松地通过新的存储服务提供商扩展存储系统：

1.  在 `src/storage/provider` 目录下新建一个文件作为自定义存储服务提供者
2.  实现 `StorageProvider` 接口

`src/storage/provider/custom-provider.ts`
```typescript
import {
  PresignedUploadUrlParams,
  StorageProvider,
  UploadFileParams,
  UploadFileResult
} from '@/storage/types';

export class CustomStorageProvider implements StorageProvider {
  constructor() {
    // Initialize your storage service provider
  }

  public getProviderName(): string {
    return 'CustomProvider';
  }

  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    // Implementation for uploading a file
    return { url: 'https://example.com/file.jpg', key: 'file.jpg' };
  }

  async deleteFile(key: string): Promise<void> {
    // Implementation for deleting a file
  }
}
```

3.  更新 `index.ts` 中的存储服务提供商选择：

`src/存储/索引.ts`
```typescript
import { CustomStorageProvider } from './provider/custom-provider';

export const initializeStorageProvider = (): StorageProvider => {
  if (!storageProvider) {
    if (websiteConfig.storage.provider === 's3') {
      storageProvider = new S3Provider();
    } else if (websiteConfig.storage.provider === 'custom') {
      storageProvider = new CustomStorageProvider();
    } else {
      throw new Error(
        `Unsupported storage provider: ${websiteConfig.storage.provider}`
      );
    }
  }
  return storageProvider;
};
```

##### 最佳实践

1.  **文件组织**：使用文件夹按类型或用途组织文件（例如，`uploads/images`, `documents/contracts`）
2.  **文件大小限制**：设置合理的文件大小限制以防止滥用
3.  **文件类型验证**：验证客户端和服务器端的文件类型以确保安全

##### 视频教程

[MkSaaS模板的网站配置和部署教程](https://www.youtube.com/watch?v=example5)

##### 后续步骤

现在您已经了解了如何在 MkSaaS 中使用文件存储，请探索以下相关主题：

*   **Π 支付**
    配置支付系统
*   **Θ 数据库**
    配置数据库
*   **验证**
    配置用户身份验证
*   **环境设置**
    配置环境变量

< 通讯
了解如何设置和使用“重新发送”功能进行新闻通讯管理

支付 >
了解如何设置和使用 Stripe 处理付款和订阅