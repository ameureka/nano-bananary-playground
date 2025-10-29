# 变更总结（2025-10-25）

本次改动主要聚焦于两点：
- 将各组件的 Zustand 订阅改为精确选择器，消除 React 19 的 `getSnapshot` 警告与不必要的重渲染。
- 修复 i18n 上下文缺失 `changeLanguage` 导致的报错，并增强 `t` 的插值能力。

## 概览
- 性能与稳定性：通过精确选择器减少渲染面和订阅开销，避免 React 19 的快照警告。
- 国际化体验：语言切换函数补齐且持久化，`t` 支持 `{count}` 等占位符插值。
- 本地验证：开发服务器已启动并在浏览器中验证页面无新错误。

## 详细改动

### Zustand 订阅策略重构
将对整个 store 的解构换成精确选择器订阅：
- 组件 `components/features/enhancer/EnhancerSettingsModal.tsx`
  - 精确订阅：`enhancerSettings`、`setEnhancerSettings`、`selectedTransformation`（来自 `enhancerStore`），`isAdvancedMode`（来自 `uiStore`）。
- 组件 `components/layout/TopAppBar.tsx`
  - 资产库（`assetLibraryStore`）：`selectedAssets`、`assetLibrary`、`toggleSelectAll`、`clearAssetSelection`。
  - 聊天（`chatStore`）：`chatHistory`、`clearChatHistory`。
- 组件 `components/features/chat/ChatSettingsModal.tsx`
  - 聊天（`chatStore`）：`chatSettings`、`setChatSettings`。
  - UI（`uiStore`）：`isAdvancedMode`。
- 页面 `app/library/page.tsx`
  - 资产库（`assetLibraryStore`）：`assetLibrary`、`selectedAssets`、`toggleAssetSelection`。
  - 增强器（`enhancerStore`）：`useImageAsInput`。

重构原则：
- 改用 `useStore(s => s.slice)` 形式订阅具体状态与动作，减少不必要的 UI 更新。
- 仅在类型推导时使用 `getState`，避免其参与订阅。

### i18n 上下文修复与增强
文件：`i18n/context.tsx`
- 新增 `changeLanguage(lang: 'zh' | 'en')`，同时保留 `setLanguage`。
- 扩展 `t(key: string, params?: Record<string, any>)`，实现 `{param}` 占位符插值：
  - 示例：`t('app.advancedMode.clicksRemaining', { count: 3 })`。
- 语言在浏览器端持久化：
  - 初始化时优先使用 `localStorage` 中保存的语言；切换语言时写回 `localStorage`。
- 直接修复错误：`TypeError: changeLanguage is not a function`。

### 使用检查与兼容性
- `app/layout.tsx` 保持原有逻辑，含参数插值的翻译（如点击次数提示）现已正常显示。

## 验证与预览
- 本地开发服务器：
  - 运行命令：`npm run dev -- --port 3002`
  - 预览地址：`http://localhost:3002/`
- 验证结果：
  - 浏览器无新错误；语言切换按钮可用且立即生效；包含 `{count}` 的文案显示正确。

## 影响与收益
- 避免 React 19 快照警告，渲染更稳定、日志更干净。
- 国际化接口统一、插值生效，用户提示更准确。

## 后续建议（非必须）
- 组件去重：以下存在重复实现，可在后续统一引用以减少维护成本：
  - `components/LanguageSwitcher.tsx` 与 `components/common/LanguageSwitcher.tsx`
  - `components/LoadingSpinner.tsx` 与 `components/common/LoadingSpinner.tsx`
  - `components/ErrorMessage.tsx` 与 `components/common/ErrorMessage.tsx`
- 若仍有诊断面板条目，请记录报错文本或截图，便于逐项清理。

---
如需将此总结改名或移动到 `docs/` 目录，我可以立即调整。