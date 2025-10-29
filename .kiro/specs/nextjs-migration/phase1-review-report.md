# Phase 1 迁移审查报告

生成时间：2025-10-29

## 概述
本报告记录了对 Next.js 子项目 `nano-bananary-nextjs` 的 Phase 1 迁移审查结果、运行与预览过程，以及浏览器端与终端的错误信息，用于后续修复与验证。

## 运行与环境
- 项目根目录：`/Users/ameureka/Desktop/nano-bananary-playground_v0.1`
- 目标子项目：`/Users/ameureka/Desktop/nano-bananary-playground_v0.1/nano-bananary-nextjs`
- Node 开发服务器：Next.js 16.0.1（Turbopack）
- 实际运行端口：`3001`（由于 `3000` 被占用自动切换）

### 启动过程概览
1. 误启动了根目录的 Vite 开发服务器（旧架构），随后停止。
2. 切换到 `nano-bananary-nextjs` 目录后，首次启动 Next.js 报锁文件占用，删除 `.next/dev/lock` 后再次启动。
3. Next.js 开发服务器成功运行并打开预览：`http://localhost:3001`。

## 关键错误与影响

### 1) useLayout 必须在 LayoutProvider 内使用（严重）
- 报错信息：`Error: useLayout must be used within a LayoutProvider`
- 触发组件：`EnhancerPage`（`nano-bananary-nextjs/app/page.tsx`）
- 结论（根因）：
  - `EnhancerPage` 在组件顶层调用了 `useLayout()`，而实际的 `LayoutContext.Provider` 是在 `MainLayout` 组件内部才对 `children` 进行包裹。
  - 当前树形结构为：`EnhancerPage` → 返回 `<MainLayout>...` → `MainLayout` 内部才提供 `<LayoutContext.Provider>`。
  - 因此在 `EnhancerPage` 顶层调用 `useLayout()` 时，尚未处于 Provider 的上游祖先节点内，导致 Context 为 `null` 并抛错。
- 相关代码位置：
  - `nano-bananary-nextjs/components/layout/LayoutContext.tsx`（仅导出 `LayoutContext` 与 `useLayout` 钩子，不包含提供者组件）
  - `nano-bananary-nextjs/components/layout/MainLayout.tsx`（内部使用 `<LayoutContext.Provider value={...}>`）
  - `nano-bananary-nextjs/app/page.tsx`（`EnhancerPage` 顶层调用 `useLayout()`，随后返回 `<MainLayout>`）
- 影响：应用首页无法渲染，阻断主要功能验证。

### 2) Google Fonts 加载失败（次要）
- 报错信息：`net::ERR_ABORTED https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:...`
- 发生位置：`app/layout.tsx` 的 `<head>` 通过 `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...">` 引入。
- 影响：图标字体可能无法显示，但通常不阻断核心功能。
- 可能原因：网络访问受限、CSP、第三方请求中止。可考虑改用 Next 的内置字体加载或本地资源。

### 3) Next 开发锁文件占用（已处理）
- 报错信息：`Unable to acquire lock at .../.next/dev/lock`
- 处理：删除锁文件后重新启动，服务正常运行。
- 影响：阻断首次启动，不影响后续功能。

## 代码上下文摘录

### app/layout.tsx
- 使用 `<Providers>` 包裹 `children`，并在 `<head>` 中引入 Material Symbols 字体。

### providers.tsx
- 仅包含 `LanguageProvider` 与 `ThemeProvider`，未包含布局相关 Provider。

### components/layout/LayoutContext.tsx
- 导出 `LayoutContext` 与 `useLayout()` 钩子，未提供 `LayoutProvider` 组件。
- 当在 Provider 之外使用 `useLayout()` 时抛出错误。

### components/layout/MainLayout.tsx
- 内部实现 `<LayoutContext.Provider value={...}>`，将上下文提供给其 `children`。

### app/page.tsx（EnhancerPage）
- 组件顶层调用 `useLayout()`，随后返回 `<MainLayout>...</MainLayout>`。
- 由于 Provider 在 `MainLayout` 内部才生效，导致顶层的 `useLayout()` 无法获取上下文。

## 终端与浏览器日志摘录

### 根目录误启动（Vite）
```
VITE v6.4.1  ready in 488 ms
➜  Local:   http://localhost:3001/
```

### Next.js 启动（首次失败）
```
▲ Next.js 16.0.1 (Turbopack)
⚠ Port 3000 is in use, using port 3001 instead.
⨯ Unable to acquire lock at /nano-bananary-nextjs/.next/dev/lock, is another instance of next dev running?
```

### 删除锁后再次启动（成功）
```
▲ Next.js 16.0.1 (Turbopack)
✓ Ready in 445ms
Local: http://localhost:3001
```

### 浏览器错误（关键）
```
Error: useLayout must be used within a LayoutProvider
    at useLayout (.../chunks/_284cfc7d._.js:5231:15)
    at EnhancerPage (.../chunks/_284cfc7d._.js:9998:232)
    ...
```

### 浏览器错误（字体）
```
net::ERR_ABORTED https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:...
```

## 后续修复建议（记录，不执行）
- 修复上下文提供关系：
  - 方案 A：将 `MainLayout` 上移为页面的外层，使 `EnhancerPage` 不在顶层调用 `useLayout()`（在 `MainLayout` 的子树内调用）。
  - 方案 B：新增 `LayoutProvider` 组件（或在 `providers.tsx` 中统一注入 `<LayoutContext.Provider>`），使页面在调用 `useLayout()` 之前已处于 Provider 上游。
- 字体加载：
  - 可尝试使用 `next/font/google` 的 `Material_Symbols_Outlined`（避免运行时外链依赖），或使用本地图标资源以规避网络问题。
- 启动稳定性：
  - 保持只启用一个 `next dev` 实例；异常退出后清理 `.next/dev/lock`。

## 复现步骤（供回归验证）
1. 在 `nano-bananary-nextjs` 目录运行：`npm run dev`。
2. 打开 `http://localhost:3001`。
3. 首页出现 `useLayout must be used within a LayoutProvider` 错误；图标字体可能加载失败。

—— 完 ——

## 修复更新（Hydration 与上下文）
更新时间：2025-10-29

### 概览
- 解决了首页与顶栏出现的水合不一致（Hydration failed）问题。
- 稳定了主题与语言在首屏的初始渲染，避免 SSR/CSR 差异导致的警告。
- 保留了字体加载问题为次要、非阻断项，并给出优化建议。

### 关键代码变更
1) ThemeSwitcher（避免水合不一致）

在挂载前不渲染依赖主题的动态文案与图标：

```tsx
// nano-bananary-nextjs/components/common/ThemeSwitcher.tsx
'use client';
import React from 'react';
import { useTheme } from '@/theme/context';
import { useTranslation } from '@/i18n/context';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="icon-btn"
      aria-label={theme === 'light' ? t('app.theme.switchToDark') : t('app.theme.switchToLight')}
    >
      <span className="material-symbols-outlined">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
      <span className="state-layer"></span>
    </button>
  );
};

export default ThemeSwitcher;
```

2) i18n（LanguageProvider 支持服务端初始语言 + 客户端同步）

新增 `initialLanguage`，并在客户端挂载后与 `localStorage` 同步，写入 `cookie` 以便后续（如需）在服务端读取：

```tsx
// nano-bananary-nextjs/i18n/context.tsx
export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: 'zh' | 'en' }>
  = ({ children, initialLanguage }) => {
  const [language, setLanguage] = React.useState<'zh' | 'en'>(() => {
    if (initialLanguage === 'zh' || initialLanguage === 'en') return initialLanguage;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'zh' || saved === 'en') return saved as 'zh' | 'en';
      try {
        const match = document.cookie.match(/(?:^|;\s*)language=(zh|en)(?:;|$)/);
        if (match) return match[1] as 'zh' | 'en';
      } catch {}
    }
    return 'zh';
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('language');
        if ((saved === 'zh' || saved === 'en') && saved !== language) {
          setLanguage(saved as 'zh' | 'en');
          document.cookie = `language=${saved}; path=/; max-age=${60 * 60 * 24 * 365}`;
        }
      } catch {}
    }
  }, []);

  const changeLanguage = (lang: 'zh' | 'en') => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('language', lang); } catch {}
      try { document.cookie = `language=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`; } catch {}
    }
  };
  // ...其余逻辑保持不变
};
```

3) Providers 与 app/layout.tsx（传递稳定初始语言）

```tsx
// nano-bananary-nextjs/providers.tsx
export const Providers: React.FC<{ children: React.ReactNode; initialLanguage?: 'zh' | 'en' }>
  = ({ children, initialLanguage }) => {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
};

// nano-bananary-nextjs/app/layout.tsx
const initialLanguage: 'zh' | 'en' = 'zh'; // 稳定首屏，挂载后同步偏好
<Providers initialLanguage={initialLanguage}>{children}</Providers>
```

4) MainLayout（SSR 防护简述）

为避免 SSR 访问 `window`，将初始状态改为固定值并使用 `useEffect` 在客户端更新（具体改动已应用于 `MainLayout.tsx`，此处不赘述）。

### 预览与验证
- 已在 `http://localhost:3001` 进行验证：浏览器端不再出现水合不一致错误。
- 主题与语言切换功能正常；首屏保持稳定渲染，挂载后自动恢复用户偏好。
- 字体加载问题仍属外部网络问题（非阻断）。

### 额外说明与取舍
- 由于当前 Next 16 + Turbopack 环境下 `next/headers` 的 cookies/headers API 在 RSC 中表现不稳，已改为“稳定初始语言 + 客户端同步”策略，保证可靠性与改动最小。
- 如需首屏即严格跟随用户偏好语言，可进一步在中间层（如 middleware）或自定义服务器逻辑中读取 `language` cookie，并传递给 `Providers`。

### 下一步（可选）
- 字体稳健化：改用 `next/font` 或本地化 Material Symbols。
- 语言首屏严格对齐：引入服务端读取 cookie 的稳定方案（middleware 或 server action）。