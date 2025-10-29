/**
 * 图像编辑 API Route
 * POST /api/image/edit
 *
 * 使用 Gemini API 编辑图像
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
 * POST /api/image/edit
 *
 * 请求体（FormData）：
 * - image: File[] - 图片文件（必需，可以多张）
 * - prompt: string - 编辑提示词（必需）
 * - mask: File - 蒙版图片（可选）
 *
 * 响应：
 * - success: true, data: { images: [...], text: "..." }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/image/edit');

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

    // 提取蒙版（可选）
    let maskBase64: string | null = null;
    const maskFile = formData.get('mask') as File | null;
    if (maskFile && maskFile instanceof File) {
      const arrayBuffer = await maskFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      maskBase64 = buffer.toString('base64');
    }

    // 调用 Gemini API（带重试）
    const result = await withRetry(
      () => geminiService.editImage(prompt, images, maskBase64),
      {
        maxRetries: 3,
        delayMs: 1000,
        shouldRetry: (error) => {
          // 只对网络错误或服务器错误重试
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
      images: result.imageUrl
        ? [{ url: result.imageUrl, mimeType: 'image/png' }]
        : [],
      text: result.text,
    };

    // 验证响应有效性
    if (response.images.length === 0 && !response.text) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.GENERATION_FAILED,
          'No content generated',
          '生成失败，未返回任何内容'
        )
      );
    }

    logApiResponse('POST', '/api/image/edit', true, Date.now() - startTime);
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse('POST', '/api/image/edit', false, Date.now() - startTime);

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
