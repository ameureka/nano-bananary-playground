/**
 * 视频生成启动 API Route
 * POST /api/video/generate
 *
 * 启动 Gemini API 视频生成操作
 */

import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from '@/lib/env.server';
import {
  apiSuccess,
  apiError,
  toNextResponse,
  handleApiError,
  logApiRequest,
  logApiResponse,
} from '@/lib/api-utils';
import { API_ERROR_CODES } from '@/types/api';
import type { VideoGenerateRequest, VideoGenerateResponse } from '@/types/api';
import { saveVideoOperation } from '@/lib/videoOperationStore';

/**
 * POST /api/video/generate
 *
 * 请求体（JSON）：
 * - prompt: string - 视频生成提示词（必需）
 * - imageUrl?: string - 参考图片 URL（可选，data URL 格式）
 * - aspectRatio?: string - 宽高比（可选，默认 '16:9'）
 *
 * 响应：
 * - success: true, data: { operationId: "...", status: "processing" }
 * - success: false, error: { code, message, userMessage }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logApiRequest('POST', '/api/video/generate');

  try {
    // 解析 JSON 请求体
    const body = await request.json();
    const { prompt, imageUrl, aspectRatio = '16:9' } = body as {
      prompt?: string;
      imageUrl?: string;
      aspectRatio?: '16:9' | '9:16';
    };

    // 验证必需字段
    if (!prompt) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing required field: prompt',
          '请提供视频生成提示词'
        )
      );
    }

    // 验证宽高比
    if (aspectRatio !== '16:9' && aspectRatio !== '9:16') {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          `Invalid aspect ratio: ${aspectRatio}. Must be '16:9' or '9:16'.`,
          '宽高比必须是 16:9 或 9:16'
        )
      );
    }

    // 初始化 Google Gen AI 客户端
    const apiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey });

    // 构建请求
    const videoRequest: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        aspectRatio,
      },
    };

    // 如果有参考图片，添加到请求中
    if (imageUrl) {
      // 从 data URL 中提取 base64 和 mimeType
      const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return toNextResponse(
          apiError(
            API_ERROR_CODES.VALIDATION_ERROR,
            'Invalid image URL format',
            '图片URL格式错误，必须是 data URL 格式'
          )
        );
      }

      const [, mimeType, base64] = match;
      videoRequest.image = {
        imageBytes: base64,
        mimeType,
      };
    }

    // 启动视频生成操作
    const operation: any = await ai.models.generateVideos(videoRequest);

    // 验证操作对象
    if (!operation || !operation.name) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VIDEO_GENERATION_FAILED,
          'Failed to start video generation: no operation ID returned',
          '视频生成启动失败'
        )
      );
    }

    // 保存 operation 对象以供后续状态轮询使用
    saveVideoOperation(operation);

    // 构建响应
    const response: VideoGenerateResponse = {
      operationId: operation.name,
      status: 'processing',
    };

    logApiResponse('POST', '/api/video/generate', true, Date.now() - startTime);
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse(
      'POST',
      '/api/video/generate',
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
