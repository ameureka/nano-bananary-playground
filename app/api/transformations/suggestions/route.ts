/**
 * 效果建议 API Route
 * POST /api/transformations/suggestions
 *
 * 使用 Gemini API 根据用户查询推荐相关效果
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
import type {
  TransformationSuggestionsRequest,
  TransformationSuggestionsResponse,
} from '@/types/api';

/**
 * POST /api/transformations/suggestions
 *
 * 请求体（JSON）：
 * - query: string - 用户搜索查询（必需）
 * - transformations: Array<{key: string, title: string, description: string}> - 可用效果列表（必需）
 *
 * 响应：
 * - success: true, data: { suggestions: ["key1", "key2", ...] }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/transformations/suggestions');

  try {
    // 解析 JSON 请求体
    const body = await request.json();
    const { query, transformations } = body as {
      query?: string;
      transformations?: { key: string; title: string; description: string }[];
    };

    // 验证必需字段
    if (!query) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: query',
          '请提供搜索查询'
        )
      );
    }

    if (!transformations || !Array.isArray(transformations)) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing or invalid field: transformations',
          '效果列表格式错误'
        )
      );
    }

    if (transformations.length === 0) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Empty transformations array',
          '效果列表不能为空'
        )
      );
    }

    // 验证效果列表格式
    for (const transformation of transformations) {
      if (!transformation.key || !transformation.title || !transformation.description) {
        return toNextResponse(
          apiError(
            API_ERROR_CODES.VALIDATION_ERROR,
            'Invalid transformation format: missing key, title, or description',
            '效果列表格式错误'
          )
        );
      }
    }

    // 调用 Gemini API（带重试）
    // 注意：getTransformationSuggestions 内部已经有错误处理，会在失败时返回空数组
    const suggestions = await withRetry(
      () => geminiService.getTransformationSuggestions(query, transformations),
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
    // 将 string[] 转换为逗号分隔的字符串（按照类型定义）
    const response: TransformationSuggestionsResponse = {
      suggestions: suggestions.join(','),
    };

    logApiResponse(
      'POST',
      '/api/transformations/suggestions',
      true,
      Date.now() - startTime
    );
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse(
      'POST',
      '/api/transformations/suggestions',
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
