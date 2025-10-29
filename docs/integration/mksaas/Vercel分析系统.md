好的，这是对第四个文档“分析”的完整 Markdown 格式转换。所有内容，包括标题、文本、代码块、结构，以及对图片（视频缩略图）的识别和描述，都已包含在内。

***

### 文件 4：分析 (Analytics)

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
*   **分析**
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

---

### 分析

了解如何在 MkSaaS 网站中设置和使用各种分析工具。

MkSaaS 支持多种分析工具来追踪网站流量和用户行为。这种灵活的方法允许您选择最符合您需求、隐私要求和预算的分析服务。

#### 分析系统结构

MkSaaS 中的分析系统设计有以下组件：

*   `源码`
    *   `分析`
        *   `analytics.tsx`
        *   `google-analytics.tsx`
        *   `umami-analytics.tsx`
        *   `合理分析.tsx` (plausible-analytics.tsx)
        *   `ahrefs-analytics.tsx`
        *   `打开面板分析.tsx` (openpanel-analytics.tsx)
        *   `数据快速分析.tsx` (datafast-analytics.tsx)
        *   `seline-analytics.tsx`
        *   `vercel-analytics.tsx`
        *   `speed-insights.tsx`

这种模块化结构使得启用或禁用特定的分析提供商以及根据需要添加新的分析提供商变得容易。

#### 设置

MkSaaS 预先配置了对几种流行分析服务的支持：

##### Vercel 分析

Vercel Analytics 提供有关您网站访问者的详细见解，同时不会损害用户隐私。

1.  在您的 Vercel 项目中启用 Web Analytics：
    *   转到 Vercel 仪表板并选择您的项目。
    *   导航至 **Analytics** 选项卡。
    *   单击 **Web Analytics** 部分中的 **Enable**。
2.  由于 MkSaaS 通过网站配置集成了 Vercel Analytics，因此不需要环境变量：

    `src/config/website.tsx`
    ```tsx
    analytics: {
      enableVercelAnalytics: true,
    }
    ```
3.  如果您不想使用 Vercel Analytics，您可以在网站配置中禁用它：

    `src/config/website.tsx`
    ```tsx
    analytics: {
      enableVercelAnalytics: false,
    }
    ```
    Vercel Analytics 是使用官方 `@vercel/analytics` 包实现的。

##### Vercel 速度洞察 (Speed Insights)

Speed Insights 通过测量核心网络生命力和用户交互来帮助您监控和改善网站的性能。

1.  在您的 Vercel 项目中启用 Speed Insights：
    *   转到 Vercel 仪表板并选择您的项目。
    *   导航至“分析”选项卡。
    *   在 **Speed Insights** 部分中单击“启用”。
2.  由于 MkSaaS 通过网站配置集成了 Speed Insights，因此不需要环境变量：

    `src/config/website.tsx`
    ```tsx
    analytics: {
      enableSpeedInsights: true,
    }
    ```
3.  如果您不想使用 Speed Insights，您可以在网站配置中禁用它：

    `src/config/website.tsx`
    ```tsx
    analytics: {
      enableSpeedInsights: false,
    }
    ```
    Speed Insights 是使用官方 `@vercel/speed-insights` 包实现的。

##### 谷歌 (Google)

Google Analytics 是一种广泛使用的分析服务，提供全面的网站跟踪和分析功能。

1.  在 `analytics.google.com` 上创建 Google Analytics 帐户。
2.  设置新属性并获取您的测量 ID（以“G-”开头）。
3.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
    ```
    Google Analytics 使用 Next.js 的官方 `@next/third-parties` 包进行集成。

##### 鲜味 (Umami)

Umami 是一款简单易用且注重隐私的 Google Analytics 替代方案。它提供重要的网站统计信息，且不会侵犯访客隐私。

1.  在 `umami.is` 创建 Umami 帐户或设置您自己的 Umami 实例。
2.  在您的 Umami 仪表板中创建一个新网站。
3.  获取您的网站 ID 和脚本 URL。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_UMAMI_WEBSITE_ID="your-website-id"
    NEXT_PUBLIC_UMAMI_SCRIPT="https://cloud.umami.is/script.js"
    ```
    > ▲ 对于自托管的 Umami 实例，请使用自定义脚本 URL 而不是默认 URL。

##### 似是而非 (Plausible)

Plausible 是一款轻量级、开源且隐私友好的分析工具，不需要 cookie 通知。

1.  在 `plausible.io` 创建一个 Plausible 帐户或设置您自己的 Plausible 实例。
2.  添加您的网站。
3.  获取您的域名。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"
    NEXT_PUBLIC_PLAUSIBLE_SCRIPT="https://plausible.io/js/script.js"
    ```
    > ▲ 对于自托管的 Plausible 实例，请使用自定义脚本 URL 而不是默认 URL。

##### PostHog

PostHog 是一款功能强大的分析工具，可提供有关您网站流量和用户行为的详细见解。

1.  在 `posthog.com` 创建 PostHog 帐户。
2.  创建新项目。
3.  获取您的项目 API 密钥和主机服务器域，例如 `https://your-host.posthog.com`。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_POSTHOG_KEY="your-project-api-key"
    NEXT_PUBLIC_POSTHOG_HOST="your-host"
    ```

##### Ahrefs

Ahrefs 是一款强大的 SEO 工具，可提供有关您网站流量和反向链接的详细见解。

1.  在 `ahrefs.com` 上创建 Ahrefs 帐户。
2.  在 Ahrefs 信息中心中创建一个新网站。
3.  从 Web Analytics 获取您的网站 ID。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_AHREFS_WEBSITE_ID="your-website-id"
    ```

##### 打开面板 (OpenPanel)

OpenPanel 是一个用于跟踪用户行为的开源产品分析平台。

1.  在 `openpanel.dev` 上创建一个 OpenPanel 帐户。
2.  创建新项目。
3.  获取您的客户端 ID。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID="your-client-id"
    ```

##### 数据快 (DataFast)

DataFast 是一款简单、隐私友好的分析工具，专注于速度和可靠性。

1.  在 `datafa.st` 创建 DataFast 帐户。
2.  添加您的网站。
3.  获取您的网站 ID 和域名。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_DATAFAST_WEBSITE_ID="your-website-id"
    NEXT_PUBLIC_DATAFAST_DOMAIN="yourdomain.com"
    ```
    > ● 如果您想启用 datafast 收入轨道，您需要在网站配置中启用 `enableDatafastRevenueTrack` 功能。
    >
    > `src/config/website.tsx`
    > ```tsx
    > features: {
    >   enableDatafastRevenueTrack: true,
    > }
    > ```

##### 明晰 (Clarity)

Clarity 是一款注重隐私的分析工具，可提供有关您网站流量和用户行为的详细见解。

1.  在 `clarity.microsoft.com` 创建 Clarity 帐户。
2.  创建新项目。
3.  获取您的项目 ID。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_CLARITY_PROJECT_ID="your-project-id"
    ```

##### 塞琳娜 (Seline)

Seline 是一个专注于订阅业务和转化跟踪的分析平台。

1.  在 `seline.com` 创建 Seline 帐户。
2.  设置你的项目。
3.  获取您的代币。
4.  添加以下环境变量：

    `.env`
    ```env
    NEXT_PUBLIC_SELINE_TOKEN="your-token"
    ```

#### 工作原理

MkSaaS 通过中央 `Analytics` 组件实现分析跟踪，该组件根据环境变量和配置有条件地呈现各个分析组件：

`src/analytics/analytics.tsx`
```tsx
{/* umami analytics */}
<UmamiAnalytics />
{/* plausible analytics */}
<PlausibleAnalytics />
{/* ahrefs analytics */}
<AhrefsAnalytics />
{/* datafast analytics */}
<DataFastAnalytics />
{/* openpanel analytics */}
<OpenPanelAnalytics />
{/* seline analytics */}
<SelineAnalytics />
{/* vercel analytics */}
{websiteConfig.analytics.enableVercelAnalytics && (
  <VercelAnalytics />
)}
{/* speed insights */}
{websiteConfig.analytics.enableSpeedInsights && (
  <SpeedInsights />
)}
```

每个分析组件都是：

*   仅在生产模式下有效。
*   仅在网站配置中设置或启用所需的环境变量时加载。

这意味着您可以同时启用多个分析服务，或者只使用一个适合您需求的服务。

#### 定制

##### 添加自定义分析

您可以按照以下步骤添加对其他分析服务的支持：

1.  在 `src/analytics` 目录中创建一个新文件（例如 `my-analytics.tsx`）。
2.  实施您的分析组件。
3.  将其添加到 `Analytics` 组件。

以下是添加自定义分析服务的示例：

`src/analytics/my-analytics.tsx`
```tsx
'use client';

import Script from 'next/script';

/**
 * My Custom Analytics
 * 
 * https://example.com
 */
export function MyAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  const apiKey = process.env.NEXT_PUBLIC_MY_ANALYTICS_API_KEY;

  if (!apiKey) {
    return null;
  }

  return (
    <Script
      strategy="afterInteractive"
      src="https://example.com/analytics.js"
      data-api-key={apiKey}
    />
  );
}
```

然后，更新 `Analytics` 组件以包含您的新服务：

`src/analytics/analytics.tsx`
```tsx
import { MyAnalytics } from './my-analytics';

export function Analytics() {
  //...existing code
  return (
    <>
      {/* existing analytics components */}

      {/* your custom analytics */}
      <MyAnalytics />
    </>
  );
}
```
最后添加必要的环境变量：

`.env`
```env
NEXT_PUBLIC_MY_ANALYTICS_API_KEY="your-api-key"
```

#### 最佳实践

1.  **考虑隐私法规**：选择符合 GDPR 和 CCPA 等隐私法规的分析工具。
2.  **实施 Cookie 同意**：如果您的分析解决方案使用 Cookie，请实施适当的 Cookie 同意机制。
3.  **使用多种工具实现不同目的**：考虑将隐私友好型工具（例如 Plausible 或 Vercel Analytics）与更全面的工具（用于基本指标）结合起来，用于详细分析。
4.  **保持环境变量的安全**：切勿将您的 API 密钥提交到版本控制；使用环境变量和秘密管理。
5.  **开发中测试**：虽然分析组件仅在生产中激活，但测试它们在设置所需的环境变量时是否正确加载。
6.  **最小化性能影响**：使用延迟的脚本加载策略 (`afterInteractive` 或 `lazyOnload`) 以最大限度地减小性能的影响。

#### 视频教程

![图片描述：一个视频教程的缩略图，标题为“MkSaaS 模板 其他功能的配置和使用”，副标题为“集成统计分析、联盟营销、企业邮箱等”。画面中有一个显示图表的画板。](https://storage.googleapis.com/agent-tools-public-mde/1723146430335-1.png)
> [在 YouTube 上观看：MkSaaS 模板的其他功能配置教程](https://www.youtube.com/watch?v=placeholder)

#### 后续步骤

现在您已经了解了如何为 MkSaaS 网站设置分析，请探索以下相关集成：

| | |
| :--- | :--- |
| **电子邮件**<br>配置电子邮件服务 | **通讯**<br>配置新闻稿 |
| **支付**<br>配置付款和订阅 | **数据库**<br>配置数据库 |

< **人工智能**
了解如何设置和使用 AI 功能

**通知 >**
了解如何在 MkSaaS 中设置和使用通知