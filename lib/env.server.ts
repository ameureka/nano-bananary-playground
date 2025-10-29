/**
 * 服务端环境变量工具
 *
 * 这个文件只能在服务端使用（API Routes、Server Actions、Server Components）
 * 不要在客户端组件中导入这个文件！
 */

/**
 * 获取 Gemini API 密钥（服务端专用）
 *
 * 注意：这个函数只能在服务端使用
 * - API Routes: ✅
 * - Server Actions: ✅
 * - Server Components: ✅
 * - Client Components: ❌
 *
 * @returns Gemini API 密钥
 * @throws 如果 API 密钥未配置则抛出错误
 */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add it to your .env.local file.'
    );
  }

  return apiKey;
}

/**
 * 检查 API 密钥是否配置
 */
export function hasGeminiApiKey(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * 获取 Node 环境
 */
export function getNodeEnv(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * 判断是否是生产环境
 */
export function isProduction(): boolean {
  return getNodeEnv() === 'production';
}

/**
 * 判断是否是开发环境
 */
export function isDevelopment(): boolean {
  return getNodeEnv() === 'development';
}
