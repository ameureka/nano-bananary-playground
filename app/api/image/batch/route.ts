/**
 * 批量图像编辑 API Route
 * POST /api/image/batch
 *
 * 使用 Gemini API 批量生成图像变体（通常生成 4 张）
 */

import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import {
  apiSuccess,
  apiError,
  toNextResponse,
  handleApiError,
  extractImagesFromFormData,
  validateRequiredFields,
  logApiRequest,
  logApiResponse,
  withRetry,
} from '@/lib/api-utils';
import { API_ERROR_CODES } from '@/types/api';
import type { ImageApiResponse } from '@/types/api';

/**
 * POST /api/image/batch
 *
 * 请求体（FormData）：
 * - image: File[] - 图片文件（必需，可以多张）
 * - prompt: string - 编辑提示词（必需）
 *
 * 响应：
 * - success: true, data: { images: [...] }
 * - success: false, error: { code, message, userMessage }
 *
 * 注意：此 API 会并行生成 4 张图像变体
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/image/batch');

  try {
    // 解析 FormData
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    // 验证必需字段
    if (!prompt) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: prompt',
          '请提供编辑提示词'
        )
      );
    }

    // 提取图片文件
    const images = await extractImagesFromFormData(formData, 'image');

    if (images.length === 0) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'No images provided',
          '请至少上传一张图片'
        )
      );
    }

    // 调用 Gemini API（带重试）
    // 注意：generateImageEditsBatch 内部会并行生成 4 张图片
    const imageUrls = await withRetry(
      () => geminiService.generateImageEditsBatch(prompt, images),
      {
        maxRetries: 2, // 批量生成失败率较高，减少重试次数
        delayMs: 2000, // 增加重试延迟
        shouldRetry: (error) => {
          if (error instanceof Error) {
            const message = error.message.toLowerCase();
            return (
              message.includes('network') ||
              message.includes('timeout') ||
              message.includes('server error')
            );
          }
          return false;
        },
      }
    );

    // 构建响应
    const response: ImageApiResponse = {
      images: imageUrls.map((url) => ({
        url,
        mimeType: 'image/png',
      })),
    };

    // 验证响应有效性
    if (response.images.length === 0) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.GENERATION_FAILED,
          'No images generated',
          '生成失败，未返回任何图片'
        )
      );
    }

    logApiResponse('POST', '/api/image/batch', true, Date.now() - startTime);
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse('POST', '/api/image/batch', false, Date.now() - startTime);

    return toNextResponse(
      apiError(
        apiErr.code as any,
        apiErr.message,
        apiErr.userMessage,
        apiErr.details
      )
    );
  }
}
