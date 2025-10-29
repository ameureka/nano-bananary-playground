// 导入 @google/genai 中的相关类型和模块
// FIX: Removed non-exported member 'VideosOperation'. Type will be inferred.
import { GoogleGenAI, Modality, Type, GenerateContentResponse, GenerateImagesResponse } from "@google/genai";
// 导入应用内部的类型定义
import type { GeneratedContent, ChatMessage, ImageAspectRatio } from '@/types';
// 导入日志记录的 Zustand store
import { useLogStore } from '@/store/logStore';
// 导入服务端专用的 API 密钥获取函数
// 注意：此服务现在仅在服务端 API Routes 中使用
import { getGeminiApiKey } from '@/lib/env.server';

// 初始化 GoogleGenAI 实例
const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

/**
 * 标准化的 Gemini API 调用错误处理器
 * @param error - 捕获到的未知错误
 * @param context - 发生错误的函数或服务的名称
 * @returns 返回一个标准化的 Error 对象
 */
const handleApiError = (error: unknown, context: string): Error => {
    console.error(`Error in ${context}:`, error);
    if (error instanceof Error) {
        let errorMessage = error.message;
        // Gemini SDK 的 HTTP 错误信息通常是响应体文本。
        // 尝试将其解析为 JSON 以获取更详细的错误信息。
        if (errorMessage && errorMessage.trim().startsWith('{')) {
            try {
                const parsedError = JSON.parse(errorMessage);
                if (parsedError.error) {
                    const { status, code, message } = parsedError.error;

                    if (status === 'RESOURCE_EXHAUSTED') {
                        errorMessage = "您可能已超出请求限制。请稍候再试。";
                    } else if (code === 500 || status === 'UNKNOWN' || status === 'Internal Server Error') {
                        errorMessage = "发生意外的服务器错误。这可能是暂时性问题。请稍后再试。";
                    } else if (message) {
                        errorMessage = message;
                    }
                }
            } catch (e) {
                // 看起来像 JSON 但不是有效的 JSON。坚持使用原始消息。
                console.warn(`Could not parse API error message as JSON in ${context}:`, e);
            }
        }
        return new Error(errorMessage);
    }
    return new Error(`在 ${context} 中发生未知错误。`);
};

/**
 * 集中式的 API 请求包装器，用于一致的错误处理和日志记录
 * @param apiCall - 要执行的 API 调用函数
 * @param context - 包含服务名称、模型和提示信息的上下文对象
 * @returns 返回 API 调用的结果
 */
const handleApiRequest = async <T,>(
    apiCall: () => Promise<T>,
    context: { serviceName: string; model: string; prompt: any }
): Promise<T> => {
    try {
        const result = await apiCall();
        return result;
    } catch (error) {
        const { addLog } = useLogStore.getState();
        const err = handleApiError(error, context.serviceName);
        // 记录错误日志
        addLog({
            service: context.serviceName,
            model: context.model,
            prompt: typeof context.prompt === 'string' ? context.prompt : JSON.stringify(context.prompt),
            status: 'error',
            errorDetails: err.message,
        });
        throw err;
    }
};


/**
 * 使用 Gemini API 编辑图像
 * @param prompt - 描述所需编辑的文本提示
 * @param imageParts - 包含图像 base64 数据和 MIME 类型的数组
 * @param maskBase64 - （可选）用于局部编辑的蒙版 base64 数据
 * @returns 返回包含生成图像URL和文本的 GeneratedContent 对象
 */
export async function editImage(
    prompt: string,
    imageParts: { base64: string; mimeType: string }[],
    maskBase64: string | null
): Promise<GeneratedContent> {
  const serviceName = 'editImage';
  const model = 'gemini-2.5-flash-image';
  const { addLog } = useLogStore.getState();

  let fullPrompt = prompt;
  const parts: any[] = [];

  // 主图像总是第一个
  if (imageParts.length > 0) {
      parts.push({
          inlineData: { data: imageParts[0].base64, mimeType: imageParts[0].mimeType },
      });
  }

  // 如果有蒙版，将其添加到请求中，并修改提示
  if (maskBase64) {
    parts.push({
      inlineData: { data: maskBase64, mimeType: 'image/png' },
    });
    fullPrompt = `Apply the following instruction only to the masked area of the image: "${prompt}". Preserve the unmasked area.`;
  }
  
  // 添加任何剩余的图像（次要、参考图等）
  if (imageParts.length > 1) {
      imageParts.slice(1).forEach(img => {
          parts.push({
              inlineData: { data: img.base64, mimeType: img.mimeType },
          });
      });
  }

  parts.push({ text: fullPrompt });

  // 执行 API 请求
  const response = await handleApiRequest<GenerateContentResponse>(
    () => ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    }),
    { serviceName, model, prompt: fullPrompt }
  );
  
  const result: GeneratedContent = { imageUrl: null, text: null };
  const responseParts = response.candidates?.[0]?.content?.parts;

  // 解析响应
  if (responseParts) {
    for (const part of responseParts) {
      if (part.text) {
        result.text = (result.text ? result.text + "\n" : "") + part.text;
      } else if (part.inlineData) {
        result.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  // 如果没有有效结果，则抛出错误
  if (!result.imageUrl && !result.text) {
      let errorMessage;
      const finishReason = response.candidates?.[0]?.finishReason;
      const safetyRatings = response.candidates?.[0]?.safetyRatings;
      errorMessage = "模型没有返回图片或文本。请求可能已被拒绝。请尝试不同的提示。";
      
      if (finishReason === 'SAFETY') {
          const blockedCategories = safetyRatings?.filter(r => r.blocked).map(r => r.category).join(', ');
          errorMessage = `由于安全原因，请求被阻止。类别：${blockedCategories || '未知'}。请修改您的提示。`;
      }
      throw new Error(errorMessage);
  }
  
  // 记录成功日志
  addLog({
      service: serviceName, model, prompt: fullPrompt, status: 'success',
      result: { text: result.text, imageUrl: result.imageUrl?.substring(0, 100) + '...' }
  });
  return result;
}

/**
 * 生成风格模仿图像
 * @param contentImage - 内容图片
 * @param styleImage - 风格参考图片
 * @returns 返回生成的图像内容
 */
export async function generateStyleMimicImage(
    contentImage: { base64: string; mimeType: string },
    styleImage: { base64: string; mimeType: string }
): Promise<GeneratedContent> {
    const serviceName = 'generateStyleMimicImage';
    const { addLog } = useLogStore.getState();
    const stylePromptModel = 'gemini-2.5-flash';
    
    // 第1步：从风格图片生成风格描述提示
    const stylePromptGenResponse = await handleApiRequest<GenerateContentResponse>(
      () => ai.models.generateContent({
          model: stylePromptModel,
          contents: {
              parts: [
                  { text: "Describe the artistic style of this image in a detailed, descriptive prompt suitable for an AI image generator. Focus on the art style, color palette, lighting, texture, brushstrokes, and overall mood. Only output the prompt." },
                  { inlineData: { data: styleImage.base64, mimeType: styleImage.mimeType } }
              ]
          },
          config: {
              thinkingConfig: { thinkingBudget: 0 },
          }
      }),
      { serviceName, model: stylePromptModel, prompt: "Generate style prompt from image" }
    );
    
    const stylePrompt = stylePromptGenResponse.text || '';

    if (!stylePrompt || stylePrompt.trim().length === 0) {
        throw new Error("未能从提供的风格图像生成风格描述。");
    }
    
    addLog({ service: serviceName, model: stylePromptModel, prompt: "Generate style prompt from image", status: 'success', result: { stylePrompt } });

    // 第2步：使用生成的提示来编辑内容图片
    return await editImage(stylePrompt.trim(), [contentImage], null);
}

/**
 * 预处理用户提示，使其更具描述性
 * @param userPrompt - 用户的原始提示
 * @param allPrompts - 应用中所有成功提示的列表作为参考
 * @param images - （可选）用户提供的上下文图片
 * @returns 返回优化后的提示字符串
 */
export async function preprocessPrompt(
    userPrompt: string,
    allPrompts: string,
    images?: { base64: string; mimeType: string }[]
): Promise<string> {
    const serviceName = 'preprocessPrompt';
    const model = 'gemini-2.5-flash';
    try {
        const imageInstruction = images && images.length > 0
            ? "用户还提供了一张或多张图片作为上下文。请使用这些图片来完善你的提示。描述图片的关键元素、风格或主题，以创建一个高度相关和描述性的提示。"
            : "";

        const systemInstruction = `你是一位为生成式 AI 图片应用服务的提示词优化专家。你的任务是重写用户的提示，使其更具描述性，更适合图片生成。
你可以访问应用中超过50个成功提示词的列表。请学习它们的结构、关键词和详细程度。
${imageInstruction}
用户的原始提示是：“${userPrompt}”
以下是应用中成功提示词的示例：
---
${allPrompts}
---
重写用户的提示。新的提示应富有创意、细节丰富，并与示例中展示的风格和能力保持一致。
只返回优化后的提示文本，不要有任何额外的解释、介绍或 markdown 格式。输出必须仅为提示本身。`;
        
        const parts: any[] = [{ text: userPrompt }];
        if (images) {
            images.forEach(image => {
                parts.push({
                    inlineData: { data: image.base64, mimeType: image.mimeType },
                });
            });
        }
        
        const response = await handleApiRequest<GenerateContentResponse>(
          () => ai.models.generateContent({
              model: model,
              contents: { parts },
              config: {
                  systemInstruction,
                  thinkingConfig: { thinkingBudget: 0 },
              }
          }),
          { serviceName, model, prompt: userPrompt }
        );

        return response.text?.trim() || userPrompt;

    } catch (error) {
        console.error("在提示预处理期间出错，返回原始提示：", error);
        return userPrompt; // 发生错误时回退到原始提示
    }
}


// 聊天中生成图片的设置接口
interface ChatGenerationSettings {
  aspectRatio: ImageAspectRatio;
  numImages: number;
  creativeDiversification?: boolean;
}

/**
 * 在聊天中生成图片
 * @param prompt - 文本提示
 * @param history - 聊天历史记录
 * @param settings - 生成设置
 * @param images - （可选）附加的图片
 * @returns 返回包含文本和图片URL数组的对象
 */
export async function generateImageInChat(
  prompt: string,
  history: ChatMessage[],
  settings: ChatGenerationSettings,
  images?: { base64: string; mimeType: string }[]
): Promise<{ text: string | null, imageUrls: string[] }> {
  const serviceName = 'generateImageInChat';
  const { addLog } = useLogStore.getState();

  const { aspectRatio, numImages, creativeDiversification } = settings;
  const hasImagesInNewInput = images && images.length > 0;
  const hasImagesInHistory = history.some(msg => msg.parts.some(part => !!part.imageUrl));
  const isMultimodalRequest = hasImagesInNewInput || hasImagesInHistory;

  // 处理创意多样化（仅文本提示）
  if (creativeDiversification && numImages > 1 && !isMultimodalRequest) {
    const modelUsed = 'gemini-2.5-flash (for prompts) + imagen-4.0-generate-001 (for images)';
    const diversePromptsResponse = await handleApiRequest<GenerateContentResponse>(
      () => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the user's prompt "${prompt}", create ${numImages} distinct, detailed, and imaginative prompts for an AI image generator. They should explore different styles, subjects, and compositions.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['prompts']
          }
        }
      }),
      { serviceName, model: 'gemini-2.5-flash', prompt: `Creative Diversification from: "${prompt}"` }
    );
    
    const result = JSON.parse(diversePromptsResponse.text || '{}');
    const diversePrompts = result.prompts;

    if (!diversePrompts || !Array.isArray(diversePrompts) || diversePrompts.length === 0) {
      throw new Error("生成多样化提示失败。正在尝试标准生成。");
    }

    const imageGenerationPromises = diversePrompts.map((p: string) => 
      generateImageFromText(p, aspectRatio, 1)
    );
    const imageGenerationResults = await Promise.all(imageGenerationPromises);
    
    const allImageUrls = imageGenerationResults.flatMap(result => result.imageUrls);
    const responseText = `使用创意提示生成：\n\n${diversePrompts.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}`;
    
    addLog({ service: serviceName, model: modelUsed, prompt: `Creative Diversification from: "${prompt}"`, status: 'success', result: { text: responseText, imageUrls: allImageUrls.map(u => u.substring(0, 100) + '...') } });
    return { text: responseText, imageUrls: allImageUrls };
  }


  // 标准文生图
  if (!isMultimodalRequest) {
    const result = await generateImageFromText(prompt, aspectRatio, numImages);
    return { text: "这是您请求的图片。", imageUrls: result.imageUrls };
  }

  // 多模态生成
  const modelUsed = 'gemini-2.5-flash-image';
  // 转换历史记录为 API 格式
  const apiHistory = history.map(msg => {
    const apiParts = msg.parts.map(part => {
      if (part.text) {
        return { text: part.text };
      }
      if (part.imageUrl) {
        const [header, base64Data] = part.imageUrl.split(',');
        if (!base64Data) return null;
        const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/png';
        return {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        };
      }
      return null;
    }).filter((p): p is ({ text: string } | { inlineData: { data: string, mimeType: string } }) => p !== null);

    return {
      role: msg.role,
      parts: apiParts,
    };
  }).filter(msg => msg.parts.length > 0);
    
  const promptWithRatio = aspectRatio === 'Auto'
    ? prompt
    : `${prompt} (如果可能，请以 ${aspectRatio} 的宽高比生成图像)。`;

  const currentUserParts: any[] = [];
  if (images) {
    images.forEach(image => {
      currentUserParts.push({
          inlineData: { data: image.base64, mimeType: image.mimeType },
      });
    });
  }
  if (promptWithRatio) {
    currentUserParts.push({ text: promptWithRatio });
  }
  
  const allContents = [...apiHistory, { role: 'user', parts: currentUserParts }];
  
  const generateSingleImage = async () => {
      const response = await handleApiRequest<GenerateContentResponse>(
        () => ai.models.generateContent({
          model: modelUsed,
          contents: allContents,
          config: {
            responseModalities: [Modality.IMAGE],
          },
        }),
        { serviceName, model: modelUsed, prompt: allContents }
      );
      
      const textResult = response.text || null;
      const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      
      if (!imagePart?.inlineData) {
          let errorMessage = "模型没有返回图片或文本。";
          if (response.candidates?.[0]?.finishReason === 'SAFETY') {
              const blockedCategories = response.candidates?.[0]?.safetyRatings?.filter(r => r.blocked).map(r => r.category).join(', ');
              errorMessage = `由于安全原因，请求被阻止。类别：${blockedCategories || '未知'}。`;
          }
          throw new Error(errorMessage);
      }

      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      return { text: textResult, imageUrl };
  };

  const promises = Array.from({ length: numImages }, () => generateSingleImage());
  const results = await Promise.all(promises);

  const finalText = results[0]?.text || null;
  const allImageUrls = results.map(r => r.imageUrl);

  addLog({ service: serviceName, model: modelUsed, prompt, status: 'success', result: { text: finalText, imageUrls: allImageUrls.map(u => u.substring(0, 100) + '...') } });
  return { text: finalText, imageUrls: allImageUrls };
}

/**
 * 获取变换效果建议
 * @param query - 用户的搜索查询
 * @param transformations - 可用的变换效果列表
 * @returns 返回一个包含建议效果 key 的字符串数组
 */
export async function getTransformationSuggestions(
    query: string,
    transformations: { key: string; title: string; description: string }[]
): Promise<string[]> {
    const serviceName = 'getTransformationSuggestions';
    const model = 'gemini-2.5-flash';
    try {
        const prompt = `你是一个图像编辑应用的有用助手。用户正在使用查询搜索效果：“${query}”。
        根据用户的查询，分析以下可用变换列表，并返回最多5个最相关变换的 key。

        可用变换：
        ${JSON.stringify(transformations, null, 2)}

        只返回一个 JSON 对象，其中包含一个 "suggestions" 属性，该属性是一个包含最相关变换 key 的字符串数组。例如：{"suggestions": ["key1", "key2", "key3"]}`;
        
        const response = await handleApiRequest<GenerateContentResponse>(
          () => ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                  thinkingConfig: { thinkingBudget: 0 },
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          suggestions: {
                              type: Type.ARRAY,
                              items: {
                                  type: Type.STRING,
                              }
                          }
                      }
                  }
              }
          }),
          { serviceName, model, prompt: query }
        );

        const jsonString = response.text?.trim() || '{}';
        const result = JSON.parse(jsonString);

        if (result && Array.isArray(result.suggestions)) {
            return result.suggestions.slice(0, 5);
        }
        
        return [];

    } catch (error) {
        console.error("获取 AI 变换建议时出错：", error);
        return []; // 失败时返回空数组，以免 UI 崩溃
    }
}

/**
 * 批量生成图像编辑
 * @param prompt - 文本提示
 * @param imageParts - 图像部分
 * @returns 返回一个包含图像 URL 的字符串数组
 */
export async function generateImageEditsBatch(
    prompt: string,
    imageParts: { base64: string; mimeType: string }[]
): Promise<string[]> {
    const promises: Promise<GeneratedContent>[] = [];
    for (let i = 0; i < 4; i++) {
        // 此流程不使用蒙版，因此传入 null
        promises.push(editImage(prompt, imageParts, null));
    }
    const results = await Promise.all(promises);
    const imageUrls = results.map(r => r.imageUrl).filter((url): url is string => !!url);
    
    if (imageUrls.length === 0) {
      throw new Error("未能生成任何图像变体。模型可能拒绝了该请求。");
    }
    
    return imageUrls;
}

/**
 * 从文本生成图像
 * @param prompt - 文本提示
 * @param aspectRatio - 宽高比
 * @param numImages - 生成数量
 * @returns 返回包含图像 URL 的对象
 */
export async function generateImageFromText(
    prompt: string,
    aspectRatio: ImageAspectRatio,
    numImages: number
): Promise<{ imageUrls: string[] }> {
  const serviceName = 'generateImageFromText';
  const model = 'imagen-4.0-generate-001';
  const { addLog } = useLogStore.getState();

  const config: {
      numberOfImages: number;
      outputMimeType: string;
      aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  } = {
      numberOfImages: numImages,
      outputMimeType: 'image/png',
  };

  if (aspectRatio !== 'Auto') {
      config.aspectRatio = aspectRatio;
  }

  const response = await handleApiRequest<GenerateImagesResponse>(
    () => ai.models.generateImages({
        model: model,
        prompt: prompt,
        config: config,
    }),
    { serviceName, model, prompt }
  );

  if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("模型没有返回图片。请求可能已被拒绝。");
  }

  const imageUrls = response.generatedImages.map(img => {
    const base64ImageBytes: string = img.image?.imageBytes || '';
    return `data:image/png;base64,${base64ImageBytes}`;
  });

  addLog({ service: serviceName, model, prompt, status: 'success', result: { imageUrls: imageUrls.map(u => u.substring(0, 100) + '...') } });
  return { imageUrls };
}

/**
 * 生成视频
 * @param prompt - 文本提示
 * @param image - （可选）初始图像
 * @param aspectRatio - 宽高比
 * @param onProgress - 进度回调函数
 * @returns 返回视频的下载链接
 */
export async function generateVideo(
    prompt: string,
    image: { base64: string; mimeType: string } | null,
    aspectRatio: '16:9' | '9:16',
    onProgress: (message: string) => void
): Promise<string> {
    const serviceName = 'generateVideo';
    const model = 'veo-3.1-fast-generate-preview';
    const { addLog } = useLogStore.getState();
    
    onProgress("正在初始化视频生成...");

    const request = {
        model: model,
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            aspectRatio: aspectRatio
        },
        ...(image && {
            image: {
                imageBytes: image.base64,
                mimeType: image.mimeType
            }
        })
    };

    // 启动视频生成操作
    // FIX: The return types for video operations are not explicitly exported from the SDK.
    // We use 'any' to access properties like 'done', 'name', 'error', and 'response'.
    let operation: any = await handleApiRequest(
      () => ai.models.generateVideos(request),
      { serviceName, model, prompt }
    );
    
    onProgress("正在轮询结果，这可能需要几分钟...");

    // 轮询操作状态直到完成
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await handleApiRequest(
          () => ai.operations.getVideosOperation({ operation: operation }),
          { serviceName, model, prompt: `Polling operation ${operation.name}` }
        );
    }

    if (operation.error) {
        throw new Error(typeof operation.error.message === 'string' ? (operation.error.message || "视频生成操作失败。") : "视频生成操作失败。");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("视频生成完成，但未找到下载链接。");
    }
    
    // 返回包含 API 密钥的最终 URL
    const finalUrl = `${downloadLink}&key=${getGeminiApiKey()}`;
    addLog({ service: serviceName, model, prompt, status: 'success', result: { videoUrl: finalUrl } });
    return finalUrl;
}
