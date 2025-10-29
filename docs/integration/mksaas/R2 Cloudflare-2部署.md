好的，这是对第三个文档“贮存”的完整 Markdown 格式转换。所有内容，包括标题、文本、代码块、结构，以及对图片（视频缩略图）的识别和描述，都已包含在内。

***

### 文件 3：贮存 (Storage)

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

---

### 贮存

了解如何设置和使用云存储进行文件上传和媒体处理。

MkSaaS 使用 Amazon S3 和 Cloudflare R2 等兼容服务进行文件存储和媒体处理，为存储图像和其他媒体文件提供可靠且可扩展的解决方案。

#### 设置

要在 MkSaaS 中设置存储，请按照以下步骤配置必要的环境变量：

##### Cloudflare R2 (推荐)

1.  在 `cloudflare.com` 上创建 Cloudflare 帐户。
2.  创建一个新的 R2 存储桶：
    *   选择一个全局唯一的存储桶名称（例如， `your-project-name`）。
    *   选择靠近目标受众的地区。
    *   根据需要设置其他选项。
3.  允许公共访问存储桶：
    *   前往 **Settings > Public Development URL**，点击 **Enable**。
    *   将公共访问 URL 保存为 `STORAGE_PUBLIC_URL`。
    *   设置自定义域以供公共访问存储桶。
4.  创建一个新的 API 令牌：
    *   前往 **R2 > API > Manage API Tokens**，单击 **Create User API Token**。
    *   设置存储桶的 **Object Read & Write** 权限。
    *   创建 API Token，获取 **Access Key ID** 和 **Secret Access Key**。
5.  设置以下环境变量：

    ```env
    # .env
    STORAGE_REGION=your-region-or-auto
    STORAGE_BUCKET_NAME=your-bucket-name
    STORAGE_ACCESS_KEY_ID=your-access-key
    STORAGE_SECRET_ACCESS_KEY=your-secret-key
    STORAGE_ENDPOINT=https://xxx.r2.cloudflarestorage.com
    STORAGE_PUBLIC_URL=https://pub-xxx.r2.dev
    ```
    *   将存储提供商设置为 `s3`，因为 Cloudflare R2 与 S3 兼容。

##### 亚马逊 S3

1.  在 `aws.amazon.com` 创建 AWS 账户。
2.  创建一个新的 S3 存储桶：
    *   选择一个全局唯一的存储桶名称（例如，`your-project-name`）。
    *   选择靠近目标受众的地区。
    *   如果您希望文件可公开访问，请禁用 **Block all public access**。
    *   根据需要设置其他选项。
3.  添加存储桶策略以允许公开访问。转到 **Permissions** 选项卡并添加：

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
    *   导航到 IAM 服务。
    *   创建具有 S3 权限的新策略：`GetObject`、`PutObject`、`DeleteObject`、`ListBucket`。
    *   创建具有 **Programmatic access** 的新 IAM 用户。
    *   附加您创建的策略。
    *   保存访问密钥 ID 和秘密访问密钥。
5.  添加以下环境变量：

    ```env
    # .env
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

#### 存储系统结构

MkSaaS 中的存储系统设计有以下组件：

*   `源码`
    *   `贮存`
        *   `提供者`
        *   `配置`
        *   `索引.ts`
        *   `类型.ts`
        *   `客户端.ts`
        *   `自述文件.md`

这种模块化结构使得使用新的提供商和功能扩展存储系统变得容易。

#### 核心功能

*   直接文件上传和管理服务器端操作
*   基于大小优化的浏览器端文件上传
*   支持 Amazon S3 和兼容存储服务（例如 Cloudflare R2）
*   用于文件管理的文件夹组织
*   自动文件路径生成和文件命名
*   可配置的存储区域和存储桶设置

#### 用法

##### 基本文件操作

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

##### 浏览器端上传

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

##### 与表单组件一起使用

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

#### 定制

##### 创建自定义提供程序

MkSaaS 可以轻松地通过新的存储服务提供商扩展存储系统：

1.  在 `src/storage/provider` 目录下新建一个文件作为自定义存储服务提供者。
2.  实现 `StorageProvider` 接口。

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

#### 最佳实践

1.  **文件组织**：使用文件夹按类型或用途组织文件（例如，`uploads/images`、`documents/contracts`）。
2.  **文件大小限制**：设置合理的文件大小限制以防止滥用。
3.  **文件类型验证**：验证客户端和服务器端的文件类型以确保安全。

#### 视频教程

![图片描述：一个视频教程的缩略图，标题为“MkSaaS模板 配置和部署教程”，副标题为“从拉取代码到部署上线的全流程实录”。画面中有一个火箭图标，象征着部署和启动。](https://storage.googleapis.com/agent-tools-public-mde/1723143360211-3.png)> [在 YouTube 上观看：MkSaaS 模板的网站配置和部署教程](https://www.youtube.com/watch?v=placeholder)

#### 后续步骤

现在您已经了解了如何在 MkSaaS 中使用文件存储，请探索以下相关主题：

| | |
| :--- | :--- |
| **Π 支付**<br>配置支付系统 | **验证**<br>配置用户身份验证 |
| **Θ 数据库**<br>配置数据库 | **环境设置**<br>配置环境变量 |

< **通讯**
了解如何设置和使用“重新发送”功能进行新闻通讯管理

**支付 >**
了解如何设置和使用 Stripe 处理付款和订阅