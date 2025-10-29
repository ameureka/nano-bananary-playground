好的，这是对您提供的最后一个文档“韦尔塞尔”的完整 Markdown 格式转换。所有内容，包括标题、文本、代码块、结构，以及对所有图片的识别和描述，都已包含在内。至此，您提供的所有文档都已转换完毕。

***

### 文件 34：韦尔塞尔 (Vercel)

<+> MkSaaS 文档
Π
Q 搜索文档
*   **主页**
*   **介绍**
*   <> 代码库
*   **视频教程**
*   **入门**
*   <> 环境设置
*   **配置**
*   **部署**
    *   **韦尔塞尔**
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
    *   通知
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
    *   IDE 设置
    *   品项目结构
    *   A格式化和 Linting
    *   更新代码库

---

### 部署

#### 韦尔塞尔

了解如何将您的项目部署到 Vercel 平台。

本指南将帮助您将项目部署到 Vercel 平台。由于该项目使用 Next.js 构建，因此 Vercel 作为 Next.js 的创建者，提供了最佳的开发者体验和性能优化。

##### 先决条件

在部署项目之前，请确保您已：

1.  包含项目代码的 Git 存储库（例如 GitHub）。
2.  一个 Vercel 帐户，如果您没有，请在[此处](https://vercel.com/signup)注册。
3.  为生产环境配置的环境变量。

##### 部署步骤

1.  **将代码推送到 Git 存储库**
    确保您的代码已推送到 GitHub、GitLab 或 Bitbucket 上的代码存储库。

2.  **连接到 Vercel**
    *   登录 Vercel 控制台。
    *   单击 **Add New Project** 按钮。
    *   导入您的 Git 存储库。

3.  **配置新项目**
    在配置页面，您需要设置以下选项：
    *   **框架预设**: 选择 `Next.js`。
    *   **构建命令**: 使用默认的 `npm run build`（如果使用 pnpm，则使用 `pnpm build`）。
    *   **输出目录**: 使用默认的 `.next`。
    *   **安装命令**: 使用默认的 `npm install`（如果使用 pnpm，则 `pnpm install`）。

    如果您不确定某个设置，可以保留默认值。Vercel 通常会自动检测正确的配置。

4.  **配置环境变量**
    在配置页面上，找到 **Environment Variables** 部分。
    *   添加所有必要的环境变量，例如：
        ```
        NEXT_PUBLIC_BASE_URL="https://your-domain.com"
        DATABASE_URL="your_database_URL"
        BETTER_AUTH_SECRET="your_better_auth_secret_key"
        RESEND_API_KEY="your_resend_api_key"
        ```    *   确保添加运行项目所需的所有环境变量。
    *   确保为生产环境设置了环境变量。

5.  **部署项目**
    单击 **Deploy** 按钮开始部署过程。Vercel 将自动构建并部署您的项目。

> ▲ **重要环境变量：`NEXT_PUBLIC_BASE_URL`**
>
> `NEXT_PUBLIC_BASE_URL` 环境变量用于设置应用程序的基本 URL。
>
> 如果要部署到自定义域，则需要按照**自定义域**部分中的步骤将 `NEXT_PUBLIC_BASE_URL` 环境变量设置为自定义域。部署成功后，即可使用自定义域访问您的应用程序。
>
> 如果您没有自定义域名，可以使用 Vercel 提供的域名。例如，如果您的项目部署到 `https://your-project.vercel.app`，则需要将 `NEXT_PUBLIC_BASE_URL` 环境变量设置为 `https://your-project.vercel.app`。
>
> 但是 Vercel 提供的域名在部署成功后即可使用，因此您需要在部署成功后将 `NEXT_PUBLIC_BASE_URL` 环境变量设置为 Vercel 提供的域名。然后重新部署项目以使环境变量生效。之后，您就可以使用 Vercel 提供的域名访问您的应用程序了。

##### 自定义域

如果您想向您的项目添加自定义域：

1.  转到 Vercel 控制台中的项目设置。
2.  导航至 **Domains** 部分。
3.  添加您的自定义域。
4.  按照 DNS 配置说明进行操作。

##### 更新环境变量

如果在部署项目后想要添加或更新环境变量，可以在 **Project Settings > Environment Variables** 中进行添加或更新，然后重新部署项目。

![图片描述：Vercel 项目的环境变量设置页面截图，展示了如何添加、链接或导入环境变量，并可以选择应用的环境（生产、预览、开发）。](https://storage.googleapis.com/agent-tools-public-mde/1723147596048-1.png)

##### 自动部署

当您执行以下操作时，Vercel 提供自动部署功能：

*   将代码推送到主分支。
*   创建新的 Pull 请求。
*   推送到启用预览部署的分支。

每个 Pull 请求都会获得一个唯一的预览 URL，允许您在合并到生产之前测试更改。

##### 常问问题

*   **构建失败**
    如果构建过程失败：
    *   检查构建日志以获取详细的错误信息。
    *   确保所有依赖项均已正确安装。
    *   验证环境变量是否配置正确。

*   **应用程序功能不正确**
    *   确认所有环境变量设置正确。
    *   检查数据库连接是否正常。
    *   验证第三方服务的 API 密钥是否有效。
    *   检查日志中是否有任何错误或消息可以帮助您诊断问题。

##### 视频教程

<br>
![图片描述：一个视频教程的缩略图，标题为“MkSaaS模板 配置和部署教程”，副标题为“从拉取代码到部署上线的全流程实录”。画面中有一个火箭图标，象征着部署和启动。](https://storage.googleapis.com/agent-tools-public-mde/1723149495094-2.png)
> [在 YouTube 上观看：MkSaaS 模板的网站配置和部署教程](https://www.youtube.com/watch?v=placeholder)
<br>

##### 后续步骤

现在您了解了如何将 MkSaaS 网站部署到 Vercel，请探索以下相关主题：

| | |
| :--- | :--- |
| **Cloudflare 部署**<br>将您的应用程序部署到 Cloudflare | **数据库设置**<br>设置和配置数据库 |
| **环境变量**<br>配置生产环境变量 | **更新代码库**<br>保持你的申请最新 |

< **信用套餐**
配置信用包

**Cloudflare >**
了解如何将您的项目部署到 Cloudflare Workers 平台