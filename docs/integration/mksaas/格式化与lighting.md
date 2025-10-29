好的，这是对您提供的最后一个文档“格式化和 Linting”的完整 Markdown 格式转换。所有内容，包括标题、文本、代码块和结构，都已包含在内。至此，您提供的所有文档都已转换完毕。

***

### 文件 19：格式化和 Linting (Formatting and Linting)

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
    *   □ IDE 设置
    *   品项目结构
    *   **▲ 格式化和 Linting**
    *   更新代码库

---

### 格式化和 Linting

在 MkSaaS 中使用 Biome 提高代码质量的指南。

MkSaaS 使用 **Biome** 进行代码格式化和 linting，以确保整个项目的代码质量一致。

Biome 在项目根目录中通过 `biome.json` 进行配置。此配置强制执行一致的代码风格并捕获常见错误。

#### 运行 Linting 和格式化

##### 检查代码质量

要在不进行更改的情况下检查代码：
```bash
pnpm run lint```
此命令将报告代码库中的任何 linting 错误或警告。

##### 修复代码问题

自动修复 linting 问题：
```bash
pnpm run lint:fix
```
这将尝试修复代码中任何可自动修复的问题。

##### 格式代码

要自动格式化您的代码：
```bash
pnpm run format
```
这将根据项目的样式规则格式化所有支持的文件。

#### 自定义规则

项目的 Biome 配置在 `biome.json` 中定义。以下是我们的配置的简化视图：

`biome.json`
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      // Various rule customizations...
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always"
    }
  }
}
```
MkSaaS 定制了一些规则，以更好地适应我们的开发工作流程。完整的配置可以在项目根目录下的 `biome.json` 文件中查看。

有关如何自定义规则配置的更多信息，请参阅 [Biome Lint 规则文档](https://biomejs.dev/linter/rules/)。

#### 编辑器集成

Biome 与编辑器集成时效果最佳：

*   **VSCode/Cursor**：安装 [Biome 扩展](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)，用于实时检查和格式化。
*   **其他编辑器**：查看 [Biome 文档](https://biomejs.dev/guides/integrate-in-editor/)以了解集成选项。

MkSaaS 附带针对 Biome 的预配置 VSCode/Cursor 设置：

`.vscode/settings.json`
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

这些设置确保：

*   Biome 被用作 JavaScript 和 TypeScript 文件的默认格式化程序。
*   文件保存时自动格式化。
*   导入语句在保存时进行组织。
*   当明确请求时，将应用 Biome 的快速修复。

#### 后续步骤

现在您了解了如何在 MkSaaS 中维护代码质量，请探索以下相关主题：

| | |
| :--- | :--- |
| **项目结构**<br>了解项目的组织结构 | **IDE 设置**<br>配置开发环境以确保代码质量 |
| **更新代码库**<br>保持代码库与最新更改同步 | **环境设置**<br>配置环境变量 |

< **项目结构**
MkSaaS 样板文件和文件夹组织概述

**更新代码库 >**
如何让您的 MkSaaS 项目保持最新更新