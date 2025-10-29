/**
 * API Routes 统一类型定义
 *
 * 这个文件定义了所有 API 请求和响应的类型
 * 确保类型安全和统一的错误处理
 */

// ============================================
// 通用 API 响应类型
// ============================================

/**
 * 统一的 API 响应类型
 * 使用 discriminated union 确保类型安全
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

/**
 * API 错误接口
 */
export interface ApiError {
  code: string;          // 错误代码（用于程序判断）
  message: string;       // 技术错误信息（用于日志）
  userMessage: string;   // 用户友好的错误信息（用于显示）
  details?: any;         // 额外的错误详情
}

// ============================================
// 图像相关 API 类型
// ============================================

/**
 * 图像编辑 API 请求
 * POST /api/image/edit
 */
export interface ImageEditRequest {
  prompt: string;
  images: ImageInput[];
  mask?: string | null;  // base64 encoded mask image
}

/**
 * 文本生成图像 API 请求
 * POST /api/image/generate
 */
export interface ImageGenerateRequest {
  prompt: string;
}

/**
 * 风格模仿 API 请求
 * POST /api/image/style-mimic
 */
export interface StyleMimicRequest {
  prompt: string;
  contentImage: ImageInput;
  styleImage: ImageInput;
}

/**
 * 批量编辑 API 请求
 * POST /api/image/batch
 */
export interface ImageBatchRequest {
  prompt: string;
  images: ImageInput[];
  count?: number;  // 生成数量，默认 4
}

/**
 * 图像输入（支持多种格式）
 */
export interface ImageInput {
  base64: string;     // base64 编码的图像数据
  mimeType: string;   // MIME 类型，如 'image/png'
}

/**
 * 图像 API 响应
 */
export interface ImageApiResponse {
  images: GeneratedImage[];
  text?: string | null;
}

/**
 * 生成的图像
 */
export interface GeneratedImage {
  url: string;        // Data URL (base64)
  mimeType?: string;
}

// ============================================
// 视频相关 API 类型
// ============================================

/**
 * 启动视频生成 API 请求
 * POST /api/video/generate
 */
export interface VideoGenerateRequest {
  prompt: string;
  imageUrl?: string;  // 可选的参考图片
}

/**
 * 启动视频生成 API 响应
 */
export interface VideoGenerateResponse {
  operationId: string;  // 操作 ID，用于查询状态
  status: 'processing';
}

/**
 * 查询视频状态 API 响应
 * GET /api/video/status/[id]
 */
export interface VideoStatusResponse {
  status: 'processing' | 'completed' | 'error';
  videoUrl?: string;      // 完成时返回视频 URL
  error?: string;         // 错误时返回错误信息
  progress?: number;      // 可选的进度信息 (0-100)
}

// ============================================
// 聊天相关 API 类型
// ============================================

/**
 * 聊天生成图像 API 请求
 * POST /api/chat/generate
 */
export interface ChatGenerateRequest {
  messages: ChatMessageInput[];
  inputImages?: string[];  // 当前输入的图片 URLs
}

/**
 * 聊天消息输入
 */
export interface ChatMessageInput {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

/**
 * 聊天消息部分
 */
export interface ChatMessagePart {
  text?: string;
  imageUrl?: string;
}

/**
 * 聊天生成图像 API 响应
 */
export interface ChatGenerateResponse {
  text: string | null;
  images: GeneratedImage[];
}

/**
 * 提示词预处理 API 请求
 * POST /api/chat/preprocess
 */
export interface PromptPreprocessRequest {
  userPrompt: string;
  allPrompts: string;  // 所有可用效果的提示词
}

/**
 * 提示词预处理 API 响应
 */
export interface PromptPreprocessResponse {
  processedPrompt: string;
}

// ============================================
// 效果建议 API 类型
// ============================================

/**
 * 效果建议 API 请求
 * POST /api/transformations/suggestions
 */
export interface TransformationSuggestionsRequest {
  userPrompt: string;
  allPrompts: string;
}

/**
 * 效果建议 API 响应
 */
export interface TransformationSuggestionsResponse {
  suggestions: string;
}

// ============================================
// 错误代码常量
// ============================================

export const API_ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // AI 服务错误
  GENERATION_FAILED: 'GENERATION_FAILED',
  API_KEY_INVALID: 'API_KEY_INVALID',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  MODEL_ERROR: 'MODEL_ERROR',

  // 文件处理错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_PROCESSING_ERROR: 'FILE_PROCESSING_ERROR',

  // 视频处理错误
  VIDEO_GENERATION_FAILED: 'VIDEO_GENERATION_FAILED',
  VIDEO_NOT_FOUND: 'VIDEO_NOT_FOUND',
  VIDEO_TIMEOUT: 'VIDEO_TIMEOUT',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
