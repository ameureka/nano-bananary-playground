/**
 * 风格模仿 API Route
 * POST /api/image/style-mimic
 *
 * 使用 Gemini API 生成风格模仿图像
 */

import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import {
  apiSuccess,
  apiError,
  toNextResponse,
  handleApiError,
  extractImagesFromFormData,
  logApiRequest,
  logApiResponse,
  withRetry,
} from '@/lib/api-utils';
import { API_ERROR_CODES } from '@/types/api';
import type { ImageApiResponse } from '@/types/api';

/**
 * POST /api/image/style-mimic
 *
 * 请求体（FormData）：
 * - contentImage: File - 内容图片（必需）
 * - styleImage: File - 风格参考图片（必需）
 *
 * 响应：
 * - success: true, data: { images: [...], text: "..." }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/image/style-mimic');

  try {
    // 解析 FormData
    const formData = await request.formData();

    // 提取内容图片
    const contentImages = await extractImagesFromFormData(
      formData,
      'contentImage'
    );
    if (contentImages.length === 0) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: contentImage',
          '请上传内容图片'
        )
      );
    }

    // 提取风格图片
    const styleImages = await extractImagesFromFormData(formData, 'styleImage');
    if (styleImages.length === 0) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: styleImage',
          '请上传风格参考图片'
        )
      );
    }

    const contentImage = contentImages[0];
    const styleImage = styleImages[0];

    // 调用 Gemini API（带重试）
    const result = await withRetry(
      () => geminiService.generateStyleMimicImage(contentImage, styleImage),
      {
        maxRetries: 3,
        delayMs: 1000,
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

    logApiResponse(
      'POST',
      '/api/image/style-mimic',
      true,
      Date.now() - startTime
    );
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse(
      'POST',
      '/api/image/style-mimic',
      false,
      Date.now() - startTime
    );

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
