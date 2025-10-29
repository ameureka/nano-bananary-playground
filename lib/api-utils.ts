/**
 * API Routes 工具函数
 *
 * 提供统一的错误处理、响应格式化、重试逻辑等功能
 */

import { NextResponse } from 'next/server';
import type { ApiResponse, ApiError, ApiErrorCode } from '@/types/api';
import { API_ERROR_CODES } from '@/types/api';

// ============================================
// 响应构建器
// ============================================

/**
 * 创建成功响应
 */
export function apiSuccess<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * 创建错误响应
 */
export function apiError(
  code: ApiErrorCode,
  message: string,
  userMessage: string,
  details?: any
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      userMessage,
      details,
    },
  };
}

/**
 * 将 ApiResponse 转换为 NextResponse
 */
export function toNextResponse<T>(
  response: ApiResponse<T>,
  status?: number
): NextResponse {
  if (response.success) {
    return NextResponse.json(response, { status: status || 200 });
  } else {
    // 根据错误代码决定 HTTP 状态码
    const httpStatus = getHttpStatus(response.error.code);
    return NextResponse.json(response, { status: httpStatus });
  }
}

/**
 * 根据错误代码获取 HTTP 状态码
 */
function getHttpStatus(code: string): number {
  switch (code) {
    case API_ERROR_CODES.VALIDATION_ERROR:
    case API_ERROR_CODES.INVALID_FILE_TYPE:
    case API_ERROR_CODES.FILE_TOO_LARGE:
      return 400; // Bad Request

    case API_ERROR_CODES.API_KEY_INVALID:
      return 401; // Unauthorized

    case API_ERROR_CODES.QUOTA_EXCEEDED:
      return 429; // Too Many Requests

    case API_ERROR_CODES.TIMEOUT_ERROR:
    case API_ERROR_CODES.VIDEO_TIMEOUT:
      return 504; // Gateway Timeout

    case API_ERROR_CODES.NETWORK_ERROR:
    case API_ERROR_CODES.GENERATION_FAILED:
    case API_ERROR_CODES.MODEL_ERROR:
    case API_ERROR_CODES.FILE_PROCESSING_ERROR:
    case API_ERROR_CODES.VIDEO_GENERATION_FAILED:
      return 500; // Internal Server Error

    case API_ERROR_CODES.VIDEO_NOT_FOUND:
      return 404; // Not Found

    default:
      return 500;
  }
}

// ============================================
// 错误处理
// ============================================

/**
 * 统一的错误处理函数
 * 将各种错误转换为 ApiError 格式
 */
export function handleApiError(error: unknown): ApiError {
  console.error('API Error:', error);

  // 如果已经是 ApiError 格式，直接返回
  if (isApiError(error)) {
    return error;
  }

  // 处理标准 Error 对象
  if (error instanceof Error) {
    // 检查是否是网络错误
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        code: API_ERROR_CODES.NETWORK_ERROR,
        message: error.message,
        userMessage: '网络连接失败，请检查网络后重试',
        details: error,
      };
    }

    // 检查是否是超时错误
    if (error.message.includes('timeout')) {
      return {
        code: API_ERROR_CODES.TIMEOUT_ERROR,
        message: error.message,
        userMessage: '请求超时，请稍后重试',
        details: error,
      };
    }

    // 检查是否是 Gemini API 错误
    if (error.message.includes('API key') || error.message.includes('API_KEY')) {
      return {
        code: API_ERROR_CODES.API_KEY_INVALID,
        message: error.message,
        userMessage: 'API 配置错误，请联系管理员',
        details: error,
      };
    }

    if (error.message.includes('quota') || error.message.includes('limit')) {
      return {
        code: API_ERROR_CODES.QUOTA_EXCEEDED,
        message: error.message,
        userMessage: 'API 使用配额已用尽，请稍后再试',
        details: error,
      };
    }

    // 通用生成失败错误
    return {
      code: API_ERROR_CODES.GENERATION_FAILED,
      message: error.message,
      userMessage: '生成失败，请重试',
      details: error,
    };
  }

  // 处理未知错误
  return {
    code: API_ERROR_CODES.UNKNOWN_ERROR,
    message: String(error),
    userMessage: '发生未知错误，请重试',
    details: error,
  };
}

/**
 * 检查是否是 ApiError 类型
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'userMessage' in error
  );
}

// ============================================
// 重试逻辑
// ============================================

/**
 * 带重试的异步函数执行器
 *
 * @param fn 要执行的异步函数
 * @param maxRetries 最大重试次数（默认 3 次）
 * @param delayMs 重试延迟时间（毫秒，默认 1000）
 * @param shouldRetry 判断是否应该重试的函数（默认所有错误都重试）
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 检查是否应该重试
      if (!shouldRetry(error)) {
        throw error;
      }

      // 如果是最后一次尝试，直接抛出错误
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // 等待后重试（指数退避）
      const backoffDelay = delayMs * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${backoffDelay}ms`);
      await delay(backoffDelay);
    }
  }

  throw lastError;
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// 请求验证
// ============================================

/**
 * 验证请求体是否存在
 */
export function validateRequestBody<T>(body: unknown): body is T {
  return body !== null && body !== undefined;
}

/**
 * 验证必需字段
 */
export function validateRequiredFields(
  obj: Record<string, any>,
  fields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = fields.filter((field) => {
    const value = obj[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * 验证图片 base64 数据
 */
export function validateImageBase64(base64: string): boolean {
  // 简单验证：检查是否是合法的 base64 字符串
  if (!base64 || typeof base64 !== 'string') {
    return false;
  }

  // 移除 data URL 前缀（如果有）
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  // 检查是否是合法的 base64
  try {
    // 尝试解码
    if (typeof window !== 'undefined') {
      atob(base64Data);
    } else {
      Buffer.from(base64Data, 'base64');
    }
    return true;
  } catch {
    return false;
  }
}

// ============================================
// 文件处理
// ============================================

/**
 * 将 File 对象转换为 base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * 从 FormData 中提取图片
 */
export async function extractImagesFromFormData(
  formData: FormData,
  fieldName: string = 'image'
): Promise<{ base64: string; mimeType: string }[]> {
  const images: { base64: string; mimeType: string }[] = [];
  const files = formData.getAll(fieldName);

  for (const file of files) {
    if (file instanceof File) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error(`只支持图片文件 (收到的类型: ${file.type})`);
      }

      // 验证文件大小（10MB 限制）
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`图片文件不能超过 10MB (当前大小: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      }

      // 转换为 base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      images.push({
        base64,
        mimeType: file.type,
      });
    }
  }

  return images;
}

// ============================================
// 日志工具
// ============================================

/**
 * API 请求日志
 */
export function logApiRequest(
  method: string,
  path: string,
  params?: Record<string, any>
) {
  console.log(`[API] ${method} ${path}`, params ? { params } : '');
}

/**
 * API 响应日志
 */
export function logApiResponse(
  method: string,
  path: string,
  success: boolean,
  duration: number
) {
  const status = success ? '✓' : '✗';
  console.log(`[API] ${status} ${method} ${path} (${duration}ms)`);
}
