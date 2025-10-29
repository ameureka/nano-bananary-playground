/**
 * 聊天生成图像 API Route
 * POST /api/chat/generate
 *
 * 在聊天上下文中使用 Gemini API 生成图像
 */

import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import type { ChatMessage, ImageAspectRatio } from '@/types';
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
import type { ChatGenerateRequest, ChatGenerateResponse } from '@/types/api';

/**
 * POST /api/chat/generate
 *
 * 请求体（JSON）：
 * - prompt: string - 生成提示词（必需）
 * - history: ChatMessage[] - 聊天历史（必需）
 * - settings: object - 生成设置（必需）
 *   - aspectRatio: string - 宽高比
 *   - numImages: number - 生成数量
 *   - creativeDiversification?: boolean - 创意多样化
 * - images?: Array<{base64: string, mimeType: string}> - 附加图片（可选）
 *
 * 响应：
 * - success: true, data: { text: "...", images: [...] }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/chat/generate');

  try {
    // 解析 JSON 请求体
    const body = await request.json();
    const { prompt, history, settings, images } = body as {
      prompt?: string;
      history?: ChatMessage[];
      settings?: {
        aspectRatio: ImageAspectRatio;
        numImages: number;
        creativeDiversification?: boolean;
      };
      images?: { base64: string; mimeType: string }[];
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

    if (!history || !Array.isArray(history)) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing or invalid field: history',
          '聊天历史格式错误'
        )
      );
    }

    if (!settings || !settings.aspectRatio || !settings.numImages) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: settings',
          '生成设置缺失'
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
    if (!validAspectRatios.includes(settings.aspectRatio)) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          `Invalid aspect ratio: ${settings.aspectRatio}`,
          '无效的宽高比设置'
        )
      );
    }

    // 验证生成数量
    if (settings.numImages < 1 || settings.numImages > 8) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          `Invalid numImages: ${settings.numImages}. Must be between 1 and 8.`,
          '生成数量必须在 1-8 之间'
        )
      );
    }

    // 调用 Gemini API（带重试）
    const result = await withRetry(
      () =>
        geminiService.generateImageInChat(
          prompt,
          history,
          settings,
          images
        ),
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
    const response: ChatGenerateResponse = {
      text: result.text,
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

    logApiResponse(
      'POST',
      '/api/chat/generate',
      true,
      Date.now() - startTime
    );
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse(
      'POST',
      '/api/chat/generate',
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
