/**
 * 提示词预处理 API Route
 * POST /api/chat/preprocess
 *
 * 使用 Gemini API 优化用户的提示词
 */

import { NextRequest } from 'next/server';
import * as geminiService from '@/services/geminiService';
import {
  apiSuccess,
  apiError,
  toNextResponse,
  handleApiError,
  logApiRequest,
  logApiResponse,
  withRetry,
} from '@/lib/api-utils';
import { API_ERROR_CODES } from '@/types/api';
import type { PromptPreprocessRequest, PromptPreprocessResponse } from '@/types/api';

/**
 * POST /api/chat/preprocess
 *
 * 请求体（JSON）：
 * - userPrompt: string - 用户原始提示词（必需）
 * - allPrompts: string - 所有可用效果的提示词集合（必需）
 * - images?: Array<{base64: string, mimeType: string}> - 附加图片（可选）
 *
 * 响应：
 * - success: true, data: { processedPrompt: "..." }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/chat/preprocess');

  try {
    // 解析 JSON 请求体
    const body = await request.json();
    const { userPrompt, allPrompts, images } = body as {
      userPrompt?: string;
      allPrompts?: string;
      images?: { base64: string; mimeType: string }[];
    };

    // 验证必需字段
    if (!userPrompt) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: userPrompt',
          '请提供用户提示词'
        )
      );
    }

    if (!allPrompts) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: allPrompts',
          '缺少提示词参考库'
        )
      );
    }

    // 调用 Gemini API（带重试）
    // 注意：preprocessPrompt 内部已经有错误处理，会在失败时返回原始提示词
    const processedPrompt = await withRetry(
      () => geminiService.preprocessPrompt(userPrompt, allPrompts, images),
      {
        maxRetries: 2, // 降低重试次数，因为函数内部已经有回退机制
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
    const response: PromptPreprocessResponse = {
      processedPrompt,
    };

    // 验证响应有效性（即使失败也会返回原始提示词，所以这里总是有值）
    if (!response.processedPrompt) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.GENERATION_FAILED,
          'No processed prompt returned',
          '提示词处理失败'
        )
      );
    }

    logApiResponse(
      'POST',
      '/api/chat/preprocess',
      true,
      Date.now() - startTime
    );
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse(
      'POST',
      '/api/chat/preprocess',
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
