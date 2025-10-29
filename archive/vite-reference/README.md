# Vite 版本参考代码

这个目录包含原始的 Vite 项目代码，仅供参考。

**归档日期**: 2025-10-29  
**原因**: Next.js 迁移完成，保留作为参考

---

## 📋 参考价值

### Phase 2 剩余任务：参考价值 < 5% ❌
- SEO 优化：老代码没有
- SSR/SSG：老代码没有
- 性能优化：技术栈不同

### Phase 3 任务：参考价值约 50% ✅
- 数据层抽象：70% 参考价值
- 用户上下文：30% 参考价值
- API 抽象：50% 参考价值
- 数据库设计：60% 参考价值

---

## 🎯 主要参考用途

### 1. 数据结构设计
查看文件：
- `types.ts` - 数据类型定义
- `store/*.ts` - 状态结构

### 2. 业务逻辑
查看文件：
- `store/assetLibraryStore.ts` - 资产管理逻辑
- `store/enhancerStore.ts` - 图像增强逻辑
- `store/chatStore.ts` - 聊天逻辑

### 3. 操作模式
查看：
- Store actions - 了解需要哪些操作
- 去重、过滤、批量操作的实现

---

## ❌ 不应参考的部分

- 路由系统（React Router vs Next.js App Router）
- API 调用方式（客户端 vs 服务端）
- 构建配置（Vite vs Next.js）
- 组件实现（已在 Next.js 中重写）

---

## 🚀 运行老版本（如需要）

```bash
cd archive/vite-reference

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

**注意**: 需要配置 `.env.local` 文件并添加 `VITE_GEMINI_API_KEY`

---

## 📚 相关文档

- 迁移任务清单：`../../.kiro/specs/nextjs-migration/tasks.md`
- Phase 2 分析：`../../.kiro/specs/nextjs-migration/phase-2-analysis.md`
- 参考价值分析：`../../.kiro/specs/nextjs-migration/code-reference-value-analysis.md`

---

**状态**: ✅ 归档完成  
**主项目**: Next.js 16.0.1（根目录）  
**参考项目**: Vite 6.2.0（本目录）
