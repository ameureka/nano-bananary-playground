/**
 * 文本生成图像 API Route
 * POST /api/image/generate
 *
 * 使用 Gemini API 从文本提示生成图像
 */

import { NextRequest, NextResponse } from 'next/server';
import * as geminiService from '@/services/geminiService';
import type { ImageAspectRatio } from '@/types';
import {
  apiSuccess,
  apiError,
  toNextResponse,
  handleApiError,
  validateRequiredFields,
  logApiRequest,
  logApiResponse,
  withRetry,
} from '@/lib/api-utils';
import { API_ERROR_CODES } from '@/types/api';
import type { ImageApiResponse, ImageGenerateRequest } from '@/types/api';

/**
 * POST /api/image/generate
 *
 * 请求体（JSON）：
 * - prompt: string - 生成提示词（必需）
 * - aspectRatio?: string - 宽高比（可选，默认 'Auto'）
 * - numImages?: number - 生成数量（可选，默认 4）
 *
 * 响应：
 * - success: true, data: { images: [...] }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/image/generate');

  try {
    // 解析 JSON 请求体
    const body = await request.json();
    const { prompt, aspectRatio = 'Auto', numImages = 4 } = body as {
      prompt?: string;
      aspectRatio?: ImageAspectRatio;
      numImages?: number;
    };

    // 验证必需字段
    if (!prompt) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: prompt',
          '请提供生成提示词'
        )
      );
    }

    // 验证宽高比
    const validAspectRatios: ImageAspectRatio[] = [
      'Auto',
      '1:1',
      '16:9',
      '9:16',
      '4:3',
      '3:4',
    ];
    if (!validAspectRatios.includes(aspectRatio)) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          `Invalid aspect ratio: ${aspectRatio}`,
          '无效的宽高比设置'
        )
      );
    }

    // 验证生成数量
    if (numImages < 1 || numImages > 8) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          `Invalid numImages: ${numImages}. Must be between 1 and 8.`,
          '生成数量必须在 1-8 之间'
        )
      );
    }

    // 调用 Gemini API（带重试）
    const result = await withRetry(
      () => geminiService.generateImageFromText(prompt, aspectRatio, numImages),
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
      images: result.imageUrls.map((url) => ({
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

    logApiResponse('POST', '/api/image/generate', true, Date.now() - startTime);
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse('POST', '/api/image/generate', false, Date.now() - startTime);

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
