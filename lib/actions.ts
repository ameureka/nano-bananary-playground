/**
 * API Actions - 客户端 API 调用层
 *
 * 这个文件作为所有 API 调用的抽象层。
 * Phase 2: 现在通过 fetch 调用内部 API Routes，而不是直接调用 geminiService。
 * 这样做的好处是：
 * 1. API 密钥完全保护在服务端
 * 2. 所有的 stores 和组件保持不变，只需修改这一层
 * 3. 统一的错误处理和类型安全
 */

import type { ChatMessage, ImageAspectRatio } from '@/types';
import type { ApiResponse, ImageApiResponse, ChatGenerateResponse, PromptPreprocessResponse, TransformationSuggestionsResponse, VideoGenerateResponse, VideoStatusResponse } from '@/types/api';

// ============================================
// 工具函数
// ============================================

/**
 * 统一的 API 错误处理
 */
function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.error.userMessage || response.error.message);
  }
}

/**
 * 将 data URL 转换为 File 对象
 */
function dataUrlToFile(dataUrl: string, filename: string = 'image.png'): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * 从 data URL 中提取 base64 和 mimeType
 */
function parseDataUrl(dataUrl: string): { base64: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL format');
  }
  return {
    mimeType: match[1],
    base64: match[2],
  };
}

// ============================================
// API Actions
// ============================================

/**
 * 动作：编辑图像
 * POST /api/image/edit
 */
export async function editImageAction(
  prompt: string,
  imageParts: { base64: string; mimeType: string }[],
  maskBase64: string | null
): Promise<{ imageUrl: string | null; text: string | null }> {
  try {
    // 构建 FormData
    const formData = new FormData();
    formData.append('prompt', prompt);

    // 添加图片
    for (const imagePart of imageParts) {
      const dataUrl = `data:${imagePart.mimeType};base64,${imagePart.base64}`;
      const file = dataUrlToFile(dataUrl, 'image.png');
      formData.append('image', file);
    }

    // 添加蒙版（如果有）
    if (maskBase64) {
      const maskDataUrl = `data:image/png;base64,${maskBase64}`;
      const maskFile = dataUrlToFile(maskDataUrl, 'mask.png');
      formData.append('mask', maskFile);
    }

    // 调用 API
    const response = await fetch('/api/image/edit', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result: ApiResponse<ImageApiResponse> = await response.json();
    const data = handleApiResponse(result);

    return {
      imageUrl: data.images[0]?.url || null,
      text: data.text || null,
    };
  } catch (error) {
    console.error('editImageAction error:', error);
    throw error;
  }
}

/**
 * 动作：生成风格模仿图像
 * POST /api/image/style-mimic
 */
export async function generateStyleMimicImageAction(
  contentImage: { base64: string; mimeType: string },
  styleImage: { base64: string; mimeType: string }
): Promise<{ imageUrl: string | null; text: string | null }> {
  try {
    // 构建 FormData
    const formData = new FormData();

    // 添加内容图片
    const contentDataUrl = `data:${contentImage.mimeType};base64,${contentImage.base64}`;
    const contentFile = dataUrlToFile(contentDataUrl, 'content.png');
    formData.append('contentImage', contentFile);

    // 添加风格图片
    const styleDataUrl = `data:${styleImage.mimeType};base64,${styleImage.base64}`;
    const styleFile = dataUrlToFile(styleDataUrl, 'style.png');
    formData.append('styleImage', styleFile);

    // 调用 API
    const response = await fetch('/api/image/style-mimic', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result: ApiResponse<ImageApiResponse> = await response.json();
    const data = handleApiResponse(result);

    return {
      imageUrl: data.images[0]?.url || null,
      text: data.text || null,
    };
  } catch (error) {
    console.error('generateStyleMimicImageAction error:', error);
    throw error;
  }
}

/**
 * 动作：预处理用户提示
 * POST /api/chat/preprocess
 */
export async function preprocessPromptAction(
  userPrompt: string,
  allPrompts: string,
  images?: { base64: string; mimeType: string }[]
): Promise<string> {
  try {
    // 调用 API
    const response = await fetch('/api/chat/preprocess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPrompt,
        allPrompts,
        images,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result: ApiResponse<PromptPreprocessResponse> = await response.json();
    const data = handleApiResponse(result);

    return data.processedPrompt;
  } catch (error) {
    console.error('preprocessPromptAction error:', error);
    // 发生错误时回退到原始提示
    return userPrompt;
  }
}

/**
 * 聊天中生成图像的设置接口
 */
interface ChatGenerationSettings {
  aspectRatio: ImageAspectRatio;
  numImages: number;
  creativeDiversification?: boolean;
}

/**
 * 动作：在聊天中生成图像
 * POST /api/chat/generate
 */
export async function generateImageInChatAction(
  prompt: string,
  history: ChatMessage[],
  settings: ChatGenerationSettings,
  images?: { base64: string; mimeType: string }[]
): Promise<{ text: string | null; imageUrls: string[] }> {
  try {
    // 调用 API
    const response = await fetch('/api/chat/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        history,
        settings,
        images,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result: ApiResponse<ChatGenerateResponse> = await response.json();
    const data = handleApiResponse(result);

    return {
      text: data.text,
      imageUrls: data.images.map((img) => img.url),
    };
  } catch (error) {
    console.error('generateImageInChatAction error:', error);
    throw error;
  }
}

/**
 * 动作：获取变换效果建议
 * POST /api/transformations/suggestions
 */
export async function getTransformationSuggestionsAction(
  query: string,
  transformations: { key: string; title: string; description: string }[]
): Promise<string[]> {
  try {
    // 调用 API
    const response = await fetch('/api/transformations/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        transformations,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result: ApiResponse<TransformationSuggestionsResponse> = await response.json();
    const data = handleApiResponse(result);

    // 将逗号分隔的字符串转换为数组
    return data.suggestions.split(',').filter(s => s.trim());
  } catch (error) {
    console.error('getTransformationSuggestionsAction error:', error);
    // 发生错误时返回空数组
    return [];
  }
}

/**
 * 动作：从文本生成图像
 * POST /api/image/generate
 */
export async function generateImageFromTextAction(
  prompt: string,
  aspectRatio: ImageAspectRatio,
  numImages: number
): Promise<{ imageUrls: string[] }> {
  try {
    // 调用 API
    const response = await fetch('/api/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        numImages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result: ApiResponse<ImageApiResponse> = await response.json();
    const data = handleApiResponse(result);

    return {
      imageUrls: data.images.map((img) => img.url),
    };
  } catch (error) {
    console.error('generateImageFromTextAction error:', error);
    throw error;
  }
}

/**
 * 动作：生成视频
 * POST /api/video/generate + GET /api/video/status/[id]
 *
 * 这个函数实现了轮询机制，与原有的 generateVideo 行为一致
 */
export async function generateVideoAction(
  prompt: string,
  image: { base64: string; mimeType: string } | null,
  aspectRatio: '16:9' | '9:16',
  onProgress: (message: string) => void
): Promise<string> {
  try {
    onProgress('正在初始化视频生成...');

    // 第一步：启动视频生成
    const generateResponse = await fetch('/api/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        imageUrl: image ? `data:${image.mimeType};base64,${image.base64}` : undefined,
        aspectRatio,
      }),
    });

    if (!generateResponse.ok) {
      throw new Error(`Failed to start video generation: ${generateResponse.statusText}`);
    }

    const generateResult: ApiResponse<VideoGenerateResponse> = await generateResponse.json();
    const { operationId } = handleApiResponse(generateResult);

    onProgress('正在轮询结果，这可能需要几分钟...');

    // 第二步：轮询视频生成状态
    while (true) {
      // 等待 10 秒
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // 查询状态（使用 catch-all 路由，可以直接传递包含斜杠的 operationId）
      const statusResponse = await fetch(`/api/video/status/${operationId}`);

      if (!statusResponse.ok) {
        let errorText = statusResponse.statusText;
        try {
          const errorBody: any = await statusResponse.json();
          if (
            errorBody?.error?.userMessage &&
            typeof errorBody.error.userMessage === 'string' &&
            errorBody.error.userMessage.trim().length > 0
          ) {
            errorText = errorBody.error.userMessage;
          } else if (
            errorBody?.error?.message &&
            typeof errorBody.error.message === 'string' &&
            errorBody.error.message.trim().length > 0
          ) {
            errorText = errorBody.error.message;
          }
        } catch (_) {
          // 如果响应不是 JSON，继续使用 statusText
        }
        throw new Error(`视频状态检查失败: ${errorText}`);
      }

      const statusResult: ApiResponse<VideoStatusResponse> = await statusResponse.json();
      const status = handleApiResponse(statusResult);

      // 检查状态
      if (status.status === 'completed') {
        if (!status.videoUrl) {
          throw new Error('视频生成完成，但未找到下载链接');
        }
        return status.videoUrl;
      } else if (status.status === 'error') {
        throw new Error(status.error || '视频生成失败');
      }

      // status === 'processing'，继续轮询
      onProgress('正在轮询结果，这可能需要几分钟...');
    }
  } catch (error) {
    console.error('generateVideoAction error:', error);
    throw error;
  }
}
