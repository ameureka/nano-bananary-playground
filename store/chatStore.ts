import { create } from 'zustand';
// 导入Zustand的持久化中间件
import { persist, createJSONStorage } from 'zustand/middleware';
// 导入类型定义、API动作和其他stores
import type { ChatMessage, ImageAspectRatio } from '@/types';
import { generateImageInChatAction, preprocessPromptAction } from '@/lib/actions';
import { useUiStore } from './uiStore';
import { useAssetLibraryStore } from './assetLibraryStore';
// 导入工具函数
import { addVisibleWatermark } from '@/utils/fileUtils';

// --- STATE (状态定义) ---
export interface ChatState {
  chatHistory: ChatMessage[]; // 聊天历史记录
  chatSettings: { // 聊天相关的设置
    historyLength: number; // 作为上下文发送的历史消息数量
    isAiPreprocessing: boolean; // 是否启用AI提示词预处理
    sendImageWithPreprocessing: boolean; // 预处理时是否附带图片
    aspectRatio: ImageAspectRatio; // 生成图片的宽高比
    numImages: number; // 一次生成图片的数量
    retryCount: number; // 失败时自动重试的次数
    creativeDiversification: boolean; // 是否启用创意多样化提示
  };
  chatInputImages: string[]; // 当前输入框中待发送的图片
  chatInputText: string; // 当前输入框中的文本
  isLoading: boolean; // AI是否正在生成回复
  chatLoadingProgress: number; // 模拟的加载进度 (0-100)
  isPreprocessing: boolean; // AI是否正在预处理提示词
}

// --- ACTIONS (操作定义) ---
export interface ChatActions {
  setChatSettings: (settings: ChatState['chatSettings']) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatHistory: (history: ChatMessage[]) => void;
  clearChatHistory: () => void;
  setChatInputImages: (images: string[]) => void;
  addChatInputImages: (images: string[]) => void;
  removeChatInputImage: (index: number) => void;
  setChatInputText: (text: string) => void;
  setChatLoadingProgress: (progress: number) => void;
  setIsPreprocessing: (isPreprocessing: boolean) => void;
  startChatProgressSimulation: () => void;
  stopChatProgressSimulation: (isSuccess: boolean) => void;
  executeSendMessage: (prompt: string, images: string[], historyForApi: ChatMessage[], allPrompts: string) => Promise<void>;
  regenerateLastMessage: (allPrompts: string) => void;
  startEditingMessage: (index: number) => void;
}

// --- STORE (完整的Store类型) ---
export type ChatStore = ChatState & ChatActions;

// 用于管理进度条模拟的定时器引用
let chatProgressIntervalRef: number | null = null;

/**
 * 带重试逻辑的异步函数包装器
 * @param fn - 需要执行的异步函数
 * @param retries - 最大重试次数
 * @param delay - 每次重试的延迟（会递增）
 * @returns 返回异步函数的结果
 */
const retry = async <T,>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> => {
    let lastError: Error | undefined;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed. Retrying...`);
            lastError = error as Error;
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay * (i + 1)));
            }
        }
    }
    throw lastError;
};

// 创建AI聊天的 Zustand store
export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // --- 默认状态 (Default State) ---
      chatHistory: [],
      chatSettings: {
        historyLength: 8,
        isAiPreprocessing: false,
        sendImageWithPreprocessing: false,
        aspectRatio: 'Auto',
        numImages: 1,
        retryCount: 3,
        creativeDiversification: false,
      },
      chatInputImages: [],
      chatInputText: '',
      isLoading: false,
      chatLoadingProgress: 0,
      isPreprocessing: false,

      // --- 操作实现 (Actions) ---
      setChatSettings: (settings) => set({ chatSettings: settings }),
      addChatMessage: (message) => set((state) => ({ chatHistory: [...state.chatHistory, message] })),
      setChatHistory: (history) => set({ chatHistory: history }),
      clearChatHistory: () => {
        const confirmation = confirm("您确定要清空整个对话吗？此操作无法撤销。");
        if (confirmation) {
          set({ chatHistory: [], chatInputImages: [], chatInputText: '' });
        }
      },
      setChatInputImages: (images) => set({ chatInputImages: images }),
      addChatInputImages: (images) => set((state) => ({ chatInputImages: Array.from(new Set([...state.chatInputImages, ...images])) })),
      removeChatInputImage: (indexToRemove) => set((state) => ({
        chatInputImages: state.chatInputImages.filter((_, index) => index !== indexToRemove),
      })),
      setChatInputText: (text) => set({ chatInputText: text }),
      setChatLoadingProgress: (progress) => set({ chatLoadingProgress: progress }),
      setIsPreprocessing: (isPreprocessing) => set({ isPreprocessing: isPreprocessing }),

      // 开始模拟加载进度条
      startChatProgressSimulation: () => {
        if (chatProgressIntervalRef) clearInterval(chatProgressIntervalRef);
        set({ chatLoadingProgress: 0 });
        const startTime = Date.now();
        chatProgressIntervalRef = window.setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          let currentProgress = 0;
          if (elapsedTime < 15000) currentProgress = Math.round((elapsedTime / 15000) * 80);
          else if (elapsedTime < 30000) currentProgress = 80 + Math.round(((elapsedTime - 15000) / 15000) * 15);
          else { currentProgress = 95; if (chatProgressIntervalRef) clearInterval(chatProgressIntervalRef); }
          set({ chatLoadingProgress: currentProgress });
        }, 100);
      },
      // 停止模拟加载进度条
      stopChatProgressSimulation: (isSuccess) => {
        if (chatProgressIntervalRef) clearInterval(chatProgressIntervalRef);
        set({ chatLoadingProgress: isSuccess ? 100 : 0 });
      },

      // 执行发送消息的完整流程
      executeSendMessage: async (prompt, images, historyForApi, allPrompts) => {
        const { startChatProgressSimulation, stopChatProgressSimulation, addChatMessage, chatSettings, setIsPreprocessing, setChatInputText, setChatInputImages } = get();
        const { addImagesToLibrary } = useAssetLibraryStore.getState();

        let processedMessage = prompt.trim();
        
        // 1. 如果启用了预处理，先优化提示词
        if (chatSettings.isAiPreprocessing && prompt.trim()) {
            setIsPreprocessing(true);
            try {
                let imagesForPreprocessing = (chatSettings.sendImageWithPreprocessing && images.length > 0)
                    ? images.map(img => ({ base64: img.split(',')[1], mimeType: img.split(';')[0].split(':')[1] ?? 'image/png' }))
                    : undefined;
                processedMessage = await preprocessPromptAction(prompt.trim(), allPrompts, imagesForPreprocessing);
            } catch (err) {
                console.error("Preprocessing failed, using original prompt.", err);
            } finally {
                setIsPreprocessing(false);
            }
        }
        
        // 2. 将用户消息添加到聊天记录
        const userMessage: ChatMessage = { role: 'user', parts: [] };
        images.forEach(img => userMessage.parts.push({ imageUrl: img }));
        if (processedMessage) userMessage.parts.push({ text: processedMessage });
        addChatMessage(userMessage);
        
        // 3. 清空输入框
        setChatInputText('');
        setChatInputImages([]);
        
        // 4. 调用API生成回复
        set({ isLoading: true });
        startChatProgressSimulation();
        let success = false;
        try {
          const imagePayloads = images.map(image => ({
            base64: image.split(',')[1],
            mimeType: image.split(';')[0].split(':')[1] ?? 'image/png',
          }));

          const generationTask = () => generateImageInChatAction(processedMessage, historyForApi, chatSettings, imagePayloads);
          const response = await retry(generationTask, chatSettings.retryCount);
          
          // 5. 处理返回的图片：添加水印并存入资产库
          const isAdvancedMode = useUiStore.getState().isAdvancedMode;
          const watermarkedUrls = await Promise.all(response.imageUrls.map(url => isAdvancedMode ? url : addVisibleWatermark(url, "香蕉PS乐园")));
          const validUrls = watermarkedUrls.filter((url): url is string => !!url);
          addImagesToLibrary(validUrls);

          // 6. 将模型回复添加到聊天记录
          const modelMessage: ChatMessage = { role: 'model', parts: [] };
          if (response.text) modelMessage.parts.push({ text: response.text });
          validUrls.forEach(url => modelMessage.parts.push({ imageUrl: url }));

          if (modelMessage.parts.length > 0) addChatMessage(modelMessage);
          success = true;
        } catch (err) {
          // 7. 处理错误
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
          addChatMessage({ role: 'model', parts: [{ text: `错误: ${errorMessage}` }] });
        } finally {
          // 8. 结束加载状态
          stopChatProgressSimulation(success);
          setTimeout(() => set({ isLoading: false }), success ? 500 : 0);
        }
      },

      // 重新生成最后一条消息
      regenerateLastMessage: (allPrompts) => {
        const { isLoading, chatHistory, setChatHistory, executeSendMessage } = get();
        if (isLoading || chatHistory.length === 0) return;
        let lastUserMessageIndex = chatHistory.map(m => m.role).lastIndexOf('user');
        if (lastUserMessageIndex === -1) return;

        const lastUserMessage = chatHistory[lastUserMessageIndex];
        // 截断历史记录到最后一条用户消息
        const historyForRegen = chatHistory.slice(0, lastUserMessageIndex + 1);
        setChatHistory(historyForRegen);

        // 重新发送该消息
        const text = lastUserMessage.parts.find(p => p.text)?.text || '';
        const images = lastUserMessage.parts.filter(p => p.imageUrl).map(p => p.imageUrl!);
        executeSendMessage(text, images, historyForRegen.slice(0, -1), allPrompts);
      },

      // 编辑指定的用户消息
      startEditingMessage: (index) => {
        const { isLoading, chatHistory, setChatHistory, setChatInputText, setChatInputImages } = get();
        if (isLoading) return;
        const messageToEdit = chatHistory[index];
        if (messageToEdit?.role !== 'user') return;

        // 将该消息的内容填充到输入框，并截断历史记录
        setChatInputText(messageToEdit.parts.find(p => p.text)?.text || '');
        setChatInputImages(messageToEdit.parts.filter(p => p.imageUrl).map(p => p.imageUrl!));
        setChatHistory(chatHistory.slice(0, index));
      },
    }),
    {
      name: 'bananary-chat-storage', // 在localStorage中使用的键名
      storage: createJSONStorage(() => localStorage),
      // 只持久化聊天设置
      partialize: (state) => ({
        chatSettings: state.chatSettings,
      }),
    }
  )
);
