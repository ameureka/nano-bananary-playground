// lib/actions.ts
import * as geminiService from '../services/geminiService';
import type { ChatMessage, ImageAspectRatio } from '../types';

/**
 * 这个文件作为所有 API 调用的抽象层。
 * 这样做的目的是为了将来的迁移。如果这个应用迁移到 Next.js，
 * 这个文件将被修改为使用 `fetch` 来调用内部 API 路由（例如 /api/generate），
 * 而不是直接调用 geminiService。
 * 这样做的好处是，所有的 stores 和组件都将保持不变，只需修改这一层即可。
 */

// 动作：编辑图像
export const editImageAction = (
    prompt: string,
    imageParts: { base64: string; mimeType: string }[],
    maskBase64: string | null
) => geminiService.editImage(prompt, imageParts, maskBase64);

// 动作：生成风格模仿图像
export const generateStyleMimicImageAction = (
    contentImage: { base64: string; mimeType: string },
    styleImage: { base64: string; mimeType: string }
) => geminiService.generateStyleMimicImage(contentImage, styleImage);

// 动作：预处理用户提示
export const preprocessPromptAction = (
    userPrompt: string,
    allPrompts: string,
    images?: { base64: string; mimeType: string }[]
) => geminiService.preprocessPrompt(userPrompt, allPrompts, images);

// 聊天中生成图像的设置接口
interface ChatGenerationSettings {
  aspectRatio: ImageAspectRatio;
  numImages: number;
  creativeDiversification?: boolean;
}

// 动作：在聊天中生成图像
export const generateImageInChatAction = (
  prompt: string,
  history: ChatMessage[],
  settings: ChatGenerationSettings,
  images?: { base64: string; mimeType: string }[]
) => geminiService.generateImageInChat(prompt, history, settings, images);

// 动作：获取变换效果建议
export const getTransformationSuggestionsAction = (
    query: string,
    transformations: { key: string; title: string; description: string }[]
) => geminiService.getTransformationSuggestions(query, transformations);

// 动作：从文本生成图像
export const generateImageFromTextAction = (
    prompt: string,
    aspectRatio: ImageAspectRatio,
    numImages: number
) => geminiService.generateImageFromText(prompt, aspectRatio, numImages);

// 动作：生成视频
export const generateVideoAction = (
    prompt: string,
    image: { base64: string; mimeType: string } | null,
    aspectRatio: '16:9' | '9:16',
    onProgress: (message: string) => void
) => geminiService.generateVideo(prompt, image, aspectRatio, onProgress);
