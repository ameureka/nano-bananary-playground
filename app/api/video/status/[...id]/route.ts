/**
 * 视频状态查询 API Route
 * GET /api/video/status/[...id]
 *
 * 查询 Gemini API 视频生成操作的状态
 * 使用 catch-all 路由以支持包含斜杠的 operationId
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
import type { VideoStatusResponse } from '@/types/api';
import { getVideoOperation, updateVideoOperation } from '@/lib/videoOperationStore';

/**
 * GET /api/video/status/[...id]
 *
 * 路径参数：
 * - id: string[] - 操作ID路径段（会被组合成完整的 operationId）
 *   例如：/api/video/status/models/veo-3.1-fast-generate-preview/operations/xxx
 *
 * 响应：
 * - success: true, data: { status: "processing" | "completed" | "error", videoUrl?: "...", error?: "..." }
 * - success: false, error: { code, message, userMessage }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const startTime = Date.now();
  const resolvedParams = await params;
  // 将路径段数组重新组合成完整的 operationId
  const operationId = resolvedParams.id.join('/');
  logApiRequest('GET', `/api/video/status/${operationId}`);

  try {
    // 验证操作ID
    if (!operationId) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VALIDATION_ERROR,
          'Missing operation ID',
          '缺少操作ID'
        )
      );
    }

    // 初始化 Google Gen AI 客户端
    const apiKey = getGeminiApiKey();
    const ai = new GoogleGenAI({ apiKey });

    // 从内存中获取最初的 operation 对象
    const storedOperation = getVideoOperation(operationId);

    if (!storedOperation) {
      // 如果没有存储的 operation，对客户端返回可预期的错误而不是 500
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VIDEO_NOT_FOUND,
          `Operation not found in store: ${operationId}`,
          '未找到指定的视频生成操作（可能服务器已重启或操作已过期）'
        )
      );
    }

    // 运行时校验：必须存在 SDK 生成的内部方法 _fromAPIResponse
    const opForPolling = storedOperation as any;
    const hasRequiredMethod = typeof opForPolling?._fromAPIResponse === 'function';
    if (!hasRequiredMethod) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VIDEO_NOT_FOUND,
          `Stored operation is invalid: ${operationId}`,
          '存储的操作对象无效（可能已过期或服务器已重启），请重新开始生成。'
        )
      );
    }

    // 使用 SDK 刷新该 operation 的最新状态
    let operation: any = await ai.operations.getVideosOperation({
      operation: opForPolling,
    });

    // 验证操作对象
    if (!operation) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VIDEO_NOT_FOUND,
          `Operation not found: ${operationId}`,
          '未找到指定的视频生成操作'
        )
      );
    }

    // 检查是否完成
    if (!operation.done) {
      // 仍在处理中
      const response: VideoStatusResponse = {
        status: 'processing',
        progress: undefined, // Gemini API 不提供进度信息
      };

      logApiResponse(
        'GET',
        `/api/video/status/${operationId}`,
        true,
        Date.now() - startTime
      );
      // 将最新状态写回存储
      updateVideoOperation(operation);
      return toNextResponse(apiSuccess(response));
    }

    // 检查是否有错误
    if (operation.error) {
      const errorMessage =
        typeof operation.error.message === 'string'
          ? operation.error.message || '视频生成失败'
          : '视频生成失败';

      const response: VideoStatusResponse = {
        status: 'error',
        error: errorMessage,
      };

      logApiResponse(
        'GET',
        `/api/video/status/${operationId}`,
        true,
        Date.now() - startTime
      );
      updateVideoOperation(operation);
      return toNextResponse(apiSuccess(response));
    }

    // 提取视频URL
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      return toNextResponse(
        apiError(
          API_ERROR_CODES.VIDEO_GENERATION_FAILED,
          'Video generation completed but no download link found',
          '视频生成完成，但未找到下载链接'
        )
      );
    }

    // 在下载链接后附加 API 密钥（Gemini 视频下载需要）
    const videoUrl = `${downloadLink}&key=${apiKey}`;

    // 将最终状态写回存储
    updateVideoOperation(operation);
    // 完成
    const response: VideoStatusResponse = {
      status: 'completed',
      videoUrl,
    };

    logApiResponse(
      'GET',
      `/api/video/status/${operationId}`,
      true,
      Date.now() - startTime
    );
    return toNextResponse(apiSuccess(response));
  } catch (error) {
    const apiErr = handleApiError(error);
    logApiResponse(
      'GET',
      `/api/video/status/${operationId}`,
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
