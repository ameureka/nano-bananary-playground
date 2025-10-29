# Server Actions vs API Routes - 技术决策文档

**创建日期**: 2025-10-29  
**最终决策日期**: 2025-10-29  
**决策**: ✅ **使用 API Routes 作为主要方案**

---

## 🎯 执行摘要

经过详细分析和讨论，我们决定在 Phase 2 中**全面使用 API Routes**，而不是 Server Actions。

**核心原因**:
1. ✅ 无 1MB 请求大小限制
2. ✅ 无 60 秒超时限制
3. ✅ 支持文件上传（FormData）
4. ✅ 支持流式响应（SSE）
5. ✅ 更灵活的错误处理和缓存控制

**权衡**:
- ⚠️ 需要写更多代码（~3倍代码量）
- ⚠️ 失去自动类型推导
- ✅ 但获得更强的灵活性和可扩展性

---

## 📚 基础概念对比

### Server Actions（服务器操作）

**定义**: Next.js 14+ 引入的新特性，允许在组件中直接调用服务端函数。

**示例**:
```typescript
// lib/actions.ts
'use server'
export async function editImageAction(prompt: string, imageBase64: string) {
  const result = await geminiService.editImage(prompt, imageBase64);
  return result;
}

// 组件中使用（像调用普通函数）
'use client'
const result = await editImageAction(prompt, imageBase64);
```

**特点**:
- ✅ 调用简单，像普通函数
- ✅ 自动类型安全
- ✅ 自动序列化/反序列化
- ❌ 1MB 请求大小限制
- ❌ 60 秒超时限制（Vercel Hobby）
- ❌ 不支持流式响应

### API Routes（API 路由）

**定义**: Next.js 传统的 API 端点，基于标准 HTTP 协议。

**示例**:
```typescript
// app/api/image/edit/route.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get('image') as File;
  const prompt = formData.get('prompt') as string;
  
  const buffer = Buffer.from(await image.arrayBuffer());
  const base64 = buffer.toString('base64');
  
  const result = await geminiService.editImage(prompt, base64);
  return Response.json(result);
}

// 组件中使用（需要 fetch）
'use client'
const formData = new FormData();
formData.append('image', imageFile);
formData.append('prompt', prompt);

const result = await fetch('/api/image/edit', {
  method: 'POST',
  body: formData
}).then(r => r.json());
```

**特点**:
- ✅ 无大小限制（可配置，默认 4.5MB）
- ✅ 超时可配置（最长 300 秒）
- ✅ 支持 FormData/文件上传
- ✅ 支持流式响应（SSE）
- ✅ 完全控制 HTTP 缓存
- ⚠️ 需要写更多代码
- ⚠️ 需要手动处理类型


---

## 📊 详细对比表

| 特性 | Server Actions | API Routes | 对项目的影响 |
|------|----------------|------------|--------------|
| **调用方式** | `await action()` | `fetch('/api/...')` | API Routes 需要更多代码 |
| **类型安全** | ✅ 自动推导 | ⚠️ 手动定义 | 需要定义接口类型 |
| **请求大小限制** | ❌ **1MB 硬限制** | ✅ 4.5MB（可配置） | **关键差异**：多图会超限 |
| **超时时间** | ❌ 60秒（Hobby） | ✅ 300秒（可配置） | **关键差异**：视频生成需要 |
| **文件上传** | ⚠️ 需转 base64 | ✅ 原生 FormData | API Routes 更高效 |
| **流式响应** | ❌ 不支持 | ✅ SSE/Streaming | 未来可能需要 |
| **缓存控制** | ⚠️ 有限 | ✅ 完全控制 | API Routes 更灵活 |
| **错误处理** | 自动序列化 | 手动处理 | 需要统一错误格式 |
| **开发体验** | ✅ 简单直观 | ⚠️ 需要更多代码 | 权衡：灵活性 vs 简洁性 |
| **代码量** | ~5 行/API | ~15 行/API | 3倍代码量 |

---

## 🔍 项目实际场景分析

### 8 个 API 函数的需求分析

| API 函数 | 输入大小 | 执行时间 | Server Actions 可行性 | 推荐方案 |
|----------|----------|----------|----------------------|----------|
| `editImageAction` | 1-5MB | 5-15秒 | ❌ 多图超限 | API Routes |
| `generateImageFromTextAction` | <1KB | 5-10秒 | ✅ 可行 | API Routes（统一） |
| `generateStyleMimicImageAction` | 2-3MB | 10-20秒 | ❌ 超限 | API Routes |
| `generateVideoAction` | 0-1.5MB | 2-5分钟 | ❌ 超时 | API Routes |
| `generateImageInChatAction` | 0.5-3MB | 5-15秒 | ⚠️ 可能超限 | API Routes |
| `preprocessPromptAction` | 0-1.5MB | 2-5秒 | ⚠️ 有图片时超限 | API Routes |
| `getTransformationSuggestionsAction` | <10KB | 1-2秒 | ✅ 可行 | API Routes（统一） |
| `generateImageEditsBatchAction` | 1-2MB | 20-40秒 | ❌ 超限 | API Routes |

**统计**:
- ✅ Server Actions 完全可行: 2个（25%）
- ⚠️ Server Actions 可能超限: 2个（25%）
- ❌ Server Actions 不可行: 4个（50%）

**结论**: 50% 的 API 无法使用 Server Actions，为了代码一致性，全部使用 API Routes。

---

## 💡 实际问题演示

### 问题 1: 图片大小限制

**场景**: 用户上传 4 张 1MB 的图片进行批量编辑

```typescript
// ❌ Server Actions 方式（会失败）
'use server'
export async function editImageAction(images: string[]) {
  // images = [base64_1, base64_2, base64_3, base64_4]
  // 每张 1MB → base64 1.37MB
  // 总计: 5.48MB > 1MB 限制
  // 错误: Payload too large
  return await geminiService.editImage(images);
}
```

```typescript
// ✅ API Routes 方式（成功）
export async function POST(req: Request) {
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];
  
  // 直接处理文件，无需转 base64
  const imageBuffers = await Promise.all(
    images.map(img => img.arrayBuffer())
  );
  
  // 总计: 4MB < 4.5MB 默认限制
  // ✅ 成功处理
  return Response.json(await geminiService.editImage(imageBuffers));
}
```

### 问题 2: 视频生成超时

**场景**: 用户生成一个 5 分钟的视频

```typescript
// ❌ Server Actions 方式（会超时）
'use server'
export async function generateVideoAction(prompt: string) {
  const operation = await geminiService.startVideoGeneration(prompt);
  
  // 轮询等待完成（需要 2-5 分钟）
  while (!operation.done) {
    await sleep(10000); // 等待 10 秒
    operation = await checkStatus(operation.id);
  }
  // ❌ 60 秒后超时，视频还没生成完
  
  return operation.videoUrl;
}
```

```typescript
// ✅ API Routes 方式（成功）

// 1. 启动生成（立即返回）
// POST /api/video/generate
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const operation = await geminiService.startVideoGeneration(prompt);
  
  // ✅ 立即返回操作ID，不等待完成
  return Response.json({ 
    operationId: operation.id,
    status: 'processing'
  });
}

// 2. 查询状态（客户端轮询）
// GET /api/video/status/[id]
export async function GET(
  req: Request, 
  { params }: { params: { id: string } }
) {
  const operation = await checkStatus(params.id);
  
  // ✅ 每次请求都很快（<1秒），不会超时
  return Response.json({
    status: operation.done ? 'completed' : 'processing',
    progress: operation.progress,
    videoUrl: operation.videoUrl
  });
}

// 3. 客户端轮询
async function generateVideo(prompt: string) {
  // 启动生成
  const { operationId } = await fetch('/api/video/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  }).then(r => r.json());
  
  // 轮询状态（每 10 秒）
  while (true) {
    await sleep(10000);
    const status = await fetch(`/api/video/status/${operationId}`)
      .then(r => r.json());
    
    if (status.status === 'completed') {
      return status.videoUrl;
    }
    
    // 更新进度条
    updateProgress(status.progress);
  }
}
```

### 问题 3: 进度反馈

**场景**: 用户希望看到"正在生成图像...50%"的进度

```typescript
// ❌ Server Actions 无法实时推送进度
'use server'
export async function editImageAction(prompt: string) {
  // 无法向客户端推送进度更新
  const result = await geminiService.editImage(prompt);
  return result;
}
```

```typescript
// ✅ API Routes 支持 SSE（Server-Sent Events）
export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 发送进度更新
      controller.enqueue(
        encoder.encode('data: {"progress": 10, "message": "开始生成..."}\n\n')
      );
      
      // 调用 API
      const result = await geminiService.editImage(prompt, (progress) => {
        // 实时推送进度
        controller.enqueue(
          encoder.encode(`data: {"progress": ${progress}}\n\n`)
        );
      });
      
      // 发送最终结果
      controller.enqueue(
        encoder.encode(`data: {"progress": 100, "result": ${JSON.stringify(result)}}\n\n`)
      );
      
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// 客户端使用 EventSource
const eventSource = new EventSource('/api/image/edit');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateProgress(data.progress);
  if (data.result) {
    setResult(data.result);
    eventSource.close();
  }
};
```

---

## 🎯 最终决策：全面使用 API Routes

### 决策理由

1. **技术限制**
   - 50% 的 API 无法使用 Server Actions（大小或超时限制）
   - 混合使用会导致代码不一致

2. **代码一致性**
   - 统一的调用方式
   - 统一的错误处理
   - 统一的类型定义

3. **未来扩展性**
   - 支持流式响应（未来可能需要）
   - 支持更复杂的缓存策略
   - 支持 Webhook 集成

4. **开发体验**
   - 虽然代码量增加，但更清晰
   - 更容易调试（标准 HTTP）
   - 更容易测试（可以用 Postman）

### 权衡分析

**放弃的优势**:
- ❌ Server Actions 的简洁性（~5 行 vs ~15 行）
- ❌ 自动类型推导
- ❌ 表单集成的便利性

**获得的优势**:
- ✅ 无大小和超时限制
- ✅ 支持文件上传
- ✅ 支持流式响应
- ✅ 更灵活的控制
- ✅ 代码一致性

**结论**: 对于我们的项目，灵活性和可扩展性比简洁性更重要。



---

## 🏗️ 实施方案

### API Routes 目录结构

```
app/api/
├── image/
│   ├── edit/
│   │   └── route.ts          # POST - 编辑图像
│   ├── generate/
│   │   └── route.ts          # POST - 文本生成图像
│   ├── style-mimic/
│   │   └── route.ts          # POST - 风格模仿
│   └── batch/
│       └── route.ts          # POST - 批量编辑
├── video/
│   ├── generate/
│   │   └── route.ts          # POST - 启动视频生成
│   └── status/
│       └── [id]/
│           └── route.ts      # GET - 查询视频状态
├── chat/
│   ├── generate/
│   │   └── route.ts          # POST - 聊天中生成图像
│   └── preprocess/
│       └── route.ts          # POST - 预处理提示词
└── transformations/
    └── suggestions/
        └── route.ts          # POST - 获取效果建议
```

### 统一的类型定义

```typescript
// types/api.ts

// 统一的响应格式
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

// 错误格式
export interface ApiError {
  code: string;           // 错误代码（如 'GENERATION_FAILED'）
  message: string;        // 技术错误信息
  userMessage: string;    // 用户友好的错误信息
  details?: any;          // 额外的错误详情
}

// 图像编辑请求
export interface EditImageRequest {
  prompt: string;
  // 图片通过 FormData 上传，不在这里定义
}

// 图像编辑响应
export interface EditImageResponse {
  imageUrl: string | null;
  text: string | null;
}

// 视频生成请求
export interface GenerateVideoRequest {
  prompt: string;
  imageUrl?: string;
  aspectRatio: '16:9' | '9:16';
}

// 视频生成响应（启动）
export interface GenerateVideoResponse {
  operationId: string;
  status: 'processing';
}

// 视频状态响应
export interface VideoStatusResponse {
  status: 'processing' | 'completed' | 'error';
  progress?: number;
  videoUrl?: string;
  error?: string;
}

// ... 其他类型定义
```

### 统一的错误处理中间件

```typescript
// lib/api-utils.ts

export function handleApiError(error: unknown): ApiError {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // 解析 Gemini API 错误
    if (error.message.includes('RESOURCE_EXHAUSTED')) {
      return {
        code: 'RATE_LIMIT_EXCEEDED',
        message: error.message,
        userMessage: '请求过于频繁，请稍后再试'
      };
    }
    
    if (error.message.includes('SAFETY')) {
      return {
        code: 'SAFETY_BLOCKED',
        message: error.message,
        userMessage: '内容被安全过滤器阻止，请修改提示词'
      };
    }
    
    return {
      code: 'GENERATION_FAILED',
      message: error.message,
      userMessage: '生成失败，请重试'
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Unknown error occurred',
    userMessage: '发生未知错误，请重试'
  };
}

// 统一的 API 响应包装器
export function apiSuccess<T>(data: T): Response {
  return Response.json({ success: true, data });
}

export function apiError(error: ApiError, status: number = 500): Response {
  return Response.json({ success: false, error }, { status });
}

// 带重试的 API 调用
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed. Retrying...`);
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
}
```

### 示例：图像编辑 API

```typescript
// app/api/image/edit/route.ts
import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import { apiSuccess, apiError, handleApiError, withRetry } from '@/lib/api-utils';
import type { EditImageResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    // 1. 解析请求
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const images = formData.getAll('images') as File[];
    const mask = formData.get('mask') as File | null;
    
    // 2. 验证输入
    if (!prompt || !prompt.trim()) {
      return apiError({
        code: 'INVALID_INPUT',
        message: 'Prompt is required',
        userMessage: '请输入提示词'
      }, 400);
    }
    
    if (images.length === 0) {
      return apiError({
        code: 'INVALID_INPUT',
        message: 'At least one image is required',
        userMessage: '请上传至少一张图片'
      }, 400);
    }
    
    // 3. 转换图片为 base64
    const imageParts = await Promise.all(
      images.map(async (img) => {
        const buffer = Buffer.from(await img.arrayBuffer());
        return {
          base64: buffer.toString('base64'),
          mimeType: img.type
        };
      })
    );
    
    // 4. 处理蒙版（如果有）
    let maskBase64: string | null = null;
    if (mask) {
      const maskBuffer = Buffer.from(await mask.arrayBuffer());
      maskBase64 = maskBuffer.toString('base64');
    }
    
    // 5. 调用 Gemini API（带重试）
    const result = await withRetry(
      () => geminiService.editImage(prompt, imageParts, maskBase64),
      3
    );
    
    // 6. 返回成功响应
    return apiSuccess<EditImageResponse>(result);
    
  } catch (error) {
    // 7. 错误处理
    const apiErr = handleApiError(error);
    return apiError(apiErr);
  }
}

// 配置
export const config = {
  api: {
    bodyParser: false, // 使用 FormData
    responseLimit: '10mb' // 允许大响应
  }
};
```

### 示例：视频生成 API

```typescript
// app/api/video/generate/route.ts
import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-utils';
import type { GenerateVideoRequest, GenerateVideoResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateVideoRequest = await req.json();
    const { prompt, imageUrl, aspectRatio } = body;
    
    // 验证输入
    if (!prompt || !prompt.trim()) {
      return apiError({
        code: 'INVALID_INPUT',
        message: 'Prompt is required',
        userMessage: '请输入提示词'
      }, 400);
    }
    
    // 处理图片（如果有）
    let imagePayload = null;
    if (imageUrl) {
      const [header, base64Data] = imageUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/png';
      imagePayload = { base64: base64Data, mimeType };
    }
    
    // 启动视频生成（不等待完成）
    const operation = await geminiService.startVideoGeneration(
      prompt,
      imagePayload,
      aspectRatio
    );
    
    // 立即返回操作ID
    return apiSuccess<GenerateVideoResponse>({
      operationId: operation.name,
      status: 'processing'
    });
    
  } catch (error) {
    const apiErr = handleApiError(error);
    return apiError(apiErr);
  }
}

// app/api/video/status/[id]/route.ts
import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-utils';
import type { VideoStatusResponse } from '@/types/api';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const operationId = params.id;
    
    // 查询视频生成状态
    const operation = await geminiService.checkVideoStatus(operationId);
    
    if (operation.done) {
      if (operation.error) {
        return apiSuccess<VideoStatusResponse>({
          status: 'error',
          error: operation.error.message
        });
      }
      
      const videoUrl = operation.response?.generatedVideos?.[0]?.video?.uri;
      return apiSuccess<VideoStatusResponse>({
        status: 'completed',
        videoUrl: videoUrl
      });
    }
    
    // 仍在处理中
    return apiSuccess<VideoStatusResponse>({
      status: 'processing',
      progress: operation.metadata?.progress || 0
    });
    
  } catch (error) {
    const apiErr = handleApiError(error);
    return apiError(apiErr);
  }
}
```

### Store 中的调用方式

```typescript
// store/enhancerStore.ts

// 图像编辑
async function editImage(prompt: string, images: File[], mask?: File) {
  const formData = new FormData();
  formData.append('prompt', prompt);
  images.forEach(img => formData.append('images', img));
  if (mask) formData.append('mask', mask);
  
  const response = await fetch('/api/image/edit', {
    method: 'POST',
    body: formData
  });
  
  const result: ApiResponse<EditImageResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error.userMessage);
  }
  
  return result.data;
}

// 视频生成
async function generateVideo(prompt: string, imageUrl?: string) {
  // 1. 启动生成
  const startResponse = await fetch('/api/video/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageUrl, aspectRatio: '16:9' })
  });
  
  const startResult: ApiResponse<GenerateVideoResponse> = await startResponse.json();
  
  if (!startResult.success) {
    throw new Error(startResult.error.userMessage);
  }
  
  const { operationId } = startResult.data;
  
  // 2. 轮询状态
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10秒
    
    const statusResponse = await fetch(`/api/video/status/${operationId}`);
    const statusResult: ApiResponse<VideoStatusResponse> = await statusResponse.json();
    
    if (!statusResult.success) {
      throw new Error(statusResult.error.userMessage);
    }
    
    const status = statusResult.data;
    
    if (status.status === 'completed') {
      return status.videoUrl!;
    }
    
    if (status.status === 'error') {
      throw new Error(status.error || '视频生成失败');
    }
    
    // 更新进度
    if (status.progress) {
      set({ progress: status.progress });
    }
  }
}
```

---

## 📈 实施计划

### Week 1: API Routes 基础设施（Day 21-23）

**Day 21: 基础设施**
- [ ] 创建 `app/api/` 目录结构
- [ ] 创建 `types/api.ts` 类型定义
- [ ] 创建 `lib/api-utils.ts` 工具函数
- [ ] 配置环境变量（`GEMINI_API_KEY`）

**Day 22-23: 图像相关 API**
- [ ] 实现 `POST /api/image/edit`
- [ ] 实现 `POST /api/image/generate`
- [ ] 实现 `POST /api/image/style-mimic`
- [ ] 实现 `POST /api/image/batch`
- [ ] 测试：Postman 测试所有端点

### Week 2: 聊天和视频 API（Day 24-27）

**Day 24-25: 聊天相关 API**
- [ ] 实现 `POST /api/chat/generate`
- [ ] 实现 `POST /api/chat/preprocess`
- [ ] 实现 `POST /api/transformations/suggestions`
- [ ] 测试：聊天流程端到端测试

**Day 26-27: 视频生成 API**
- [ ] 实现 `POST /api/video/generate`
- [ ] 实现 `GET /api/video/status/[id]`
- [ ] 在 `geminiService.ts` 中拆分视频生成逻辑
- [ ] 测试：视频生成完整流程

### Week 3: Store 更新（Day 28-30）

**Day 28: 更新 enhancerStore**
- [ ] 修改所有 API 调用为 fetch
- [ ] 处理文件上传（File 对象）
- [ ] 更新错误处理
- [ ] 测试：图像编辑功能

**Day 29: 更新 chatStore**
- [ ] 修改聊天 API 调用
- [ ] 修改预处理 API 调用
- [ ] 更新错误处理
- [ ] 测试：聊天功能

**Day 30: 完整测试**
- [ ] 所有功能回归测试
- [ ] API 安全验证（密钥不可见）
- [ ] 性能测试（对比 Phase 1）
- [ ] 修复发现的问题

---

## ✅ 验收标准

### 功能验收
- [ ] 所有 8 个 API 端点正常工作
- [ ] 图片上传和编辑功能正常
- [ ] 视频生成和轮询功能正常
- [ ] 聊天功能正常
- [ ] 错误处理正确（显示用户友好的错误信息）

### 安全验收
- [ ] API 密钥不在客户端代码中
- [ ] API 密钥不在网络请求中可见
- [ ] 浏览器 DevTools 无法看到 API 密钥
- [ ] 直接调用 API 端点需要正确的请求格式

### 性能验收
- [ ] 图片上传速度 < 2 秒（1MB 图片）
- [ ] 图像生成时间与 Phase 1 相当
- [ ] 视频生成轮询不阻塞 UI
- [ ] 无内存泄漏

### 代码质量验收
- [ ] 所有 API 有统一的错误处理
- [ ] 所有 API 有统一的响应格式
- [ ] 类型定义完整
- [ ] 代码注释清晰
- [ ] 无 TypeScript 错误

---

## 🎓 总结

### 关键决策
✅ **使用 API Routes 作为唯一方案**

### 核心原因
1. 技术限制：50% 的 API 无法使用 Server Actions
2. 代码一致性：统一的调用方式和错误处理
3. 未来扩展性：支持流式响应和更复杂的场景

### 权衡结果
- 放弃：简洁性（3倍代码量）
- 获得：灵活性、可扩展性、无限制

### 实施要点
1. 统一的类型定义（`types/api.ts`）
2. 统一的错误处理（`lib/api-utils.ts`）
3. 清晰的目录结构（`app/api/`）
4. 完整的测试覆盖

### 预期成果
- ✅ API 密钥完全安全
- ✅ 支持大文件上传
- ✅ 支持长时间运行任务
- ✅ 代码清晰易维护

---

**文档状态**: ✅ 最终版本  
**决策人**: 用户 + Kiro AI  
**决策日期**: 2025-10-29  
**下一步**: 开始实施 Phase 2

