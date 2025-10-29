好的，这是对您提供的最后一个文档“Docker”的完整 Markdown 格式转换。所有内容，包括标题、文本、代码块、结构，以及对所有图片的识别和描述，都已包含在内。至此，您提供的所有文档都已转换完毕。

***

### 文件 33：Docker

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
    *   韦尔塞尔
    *   Cloudflare
    *   **码头工人**
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

#### Docker

了解如何使用 Docker 部署项目。

本指南将帮助您使用 Docker 或 Dokploy 部署您的项目。

##### 使用 Dockerfile 部署

MkSaaS 模板附带预先配置的 `Dockerfile` 和 `.dockerignore` 文件，因此您可以轻松地使用 Docker 进行部署。

`Dockerfile`
```dockerfile
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from-builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
```

##### 使用 Docker 在本地运行

如果您在本地计算机上安装了 Docker，并希望在那里运行 Next.js 应用程序来测试 docker 镜像，只需从项目的根目录运行以下命令：
```bash
docker build --no-cache -t mksaas-template .
docker run -p 3000:3000 mksaas-template
```现在您可以将您的应用程序部署到任何支持 docker 镜像的服务器。

##### 使用 Dokploy 部署

我强烈建议使用 **Dokploy** 来部署 MkSaaS，因为它可以更轻松地设置整个过程，并且可以开箱即用地获得像 Vercel 这样的自动 CI/CD 管道。

###### 先决条件

在使用 Dokploy 部署项目之前，请确保您已：

1.  包含项目代码的 Git 存储库（例如 GitHub）。
2.  安装在您自己的服务器上的自托管 Dokploy 实例。
3.  为生产环境配置的环境变量。

###### 部署步骤

1.  **在 Dokploy 上创建新项目**
    点击 **Create project** 按钮，设置项目名称和描述。

2.  **在项目中创建应用程序**
    点击 **Create services** 按钮并选择 **Application**，然后设置应用程序名称和描述。

3.  **绑定你的 Github 账户、仓库和分支**
    在 **Provider** 部分，单击 **Github** 按钮并选择 Github 帐户、存储库和分支。

4.  **设置构建类型和 Docker 文件**
    在 **Build Type** 部分中，选择 **Dockerfile**，并将 **Dockerfile** 路径设置为 `./Dockerfile`。

5.  **设置环境变量**
    从 `.env` 文件复制内容并将其粘贴到 **Environment** 设置中。
    > ● 确保添加在生产环境中运行项目所需的所有环境变量，有关更多详细信息，请参阅**环境设置指南**。

6.  **部署项目**
    单击 **Deploy** 按钮开始部署过程。Dokploy 将自动构建并部署您的项目。

7.  **绑定您的域名**
    *   在 **Domains** 部分中，单击 **Add Domain** 按钮。
    *   将 **Domain** 设置为您的自定义域，**Path** 为 `/`，**Port** 为 `3000`。
    *   启用 **HTTPS** 选项，并将 **Let'sEncrypt** 设置为证书提供商。
    *   点击 **Create** 按钮。
    *   在您的 DNS 提供商处添加您的域的 DNS 记录。
    *   将环境变量 `NEXT_PUBLIC_BASE_URL` 更改为您的自定义域。
    *   重新部署项目以应用更改。

![图片描述：Dokploy 的部署设置界面截图。用户正在配置一个名为“mksaas-template”的项目的部署，设置了 GitHub 仓库、构建类型（Dockerfile）、环境变量和域名等信息。](https://storage.googleapis.com/agent-tools-public-mde/1723147820790-1.png)

#### 后续步骤

现在您已了解如何将 MkSaaS 网站部署到 Dokploy，请探索以下相关主题：

| | |
| :--- | :--- |
| **Vercel 部署**<br>将您的应用程序部署到 Vercel | **Cloudflare 部署**<br>将您的应用程序部署到 Cloudflare |
| **更新代码库**<br>保持你的申请最新 | **数据库设置**<br>设置和配置数据库 |

< **Cloudflare**
了解如何将您的项目部署到 Cloudflare Workers 平台

**数据库 >**
了解数据库选项以及如何为项目配置数据库