// utils/env.ts

/**
 * 获取 API 密钥。
 * 这是一个统一的调用点，方便未来迁移。
 * 在 Next.js 中，这会变成 process.env.NEXT_PUBLIC_API_KEY。
 * @returns 返回 API 密钥字符串。
 * @throws 如果 API_KEY 环境变量未设置，则抛出错误。
 */
export const getApiKey = (): string => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    return process.env.API_KEY;
};
