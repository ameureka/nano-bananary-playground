import { create } from 'zustand';
// 导入Zustand的持久化中间件
import { persist, createJSONStorage } from 'zustand/middleware';
// 导入类型定义、API动作和其他stores
import type { GeneratedContent, Transformation } from '../types';
import { editImageAction, generateVideoAction, generateImageFromTextAction, generateStyleMimicImageAction } from '../lib/actions';
import { embedWatermark, addVisibleWatermark } from '../utils/fileUtils';
import { useUiStore } from './uiStore';
import { useAssetLibraryStore } from './assetLibraryStore';

// --- 类型定义 ---
type ActiveTool = 'mask' | 'none'; // 当前激活的工具
type EnhancerImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4'; // 图片宽高比

// --- STATE (状态定义) ---
export interface EnhancerState {
  enhancerSettings: { // 增强器相关的设置
    numImages: number; // 生成图片变体的数量
    retryCount: number; // 失败时自动重试的次数
  };
  selectedTransformation: Transformation | null; // 当前选择的变换效果
  primaryImageUrl: string | null; // 主输入图片
  secondaryImageUrl: string | null; // 次输入图片（用于多图效果）
  multiImageUrls: string[]; // 网格输入的多张图片
  generatedContent: GeneratedContent | null; // 最新生成的内内容（图片/视频）
  enhancerHistory: GeneratedContent[]; // 历史生成记录
  maskDataUrl: string | null; // 蒙版数据
  customPrompt: string; // 用户自定义的提示词
  aspectRatio: '16:9' | '9:16'; // 视频宽高比
  imageAspectRatio: EnhancerImageAspectRatio; // 图片宽高比
  activeTool: ActiveTool; // 当前激活的工具（如蒙版）
  activeCategory: Transformation | null; // 在效果选择器中展开的类别
  imageOptions: string[] | null; // 当一次生成多张图片时，供用户选择的选项
  selectedOption: string | null; // 用户从多个选项中选择的一张
  isGenerating: boolean; // 是否正在生成内容
  loadingMessage: string; // 加载时显示的具体信息
  error: string | null; // 发生的错误信息
  progress: number; // 模拟的加载进度 (0-100)
}

// --- ACTIONS (操作定义) ---
export interface EnhancerActions {
  setEnhancerSettings: (settings: EnhancerState['enhancerSettings']) => void;
  setSelectedTransformation: (transformation: Transformation | null) => void;
  setPrimaryImageUrl: (url: string | null) => void;
  setSecondaryImageUrl: (url: string | null) => void;
  setMultiImageUrls: (urls: string[]) => void;
  setGeneratedContent: (content: GeneratedContent | null) => void;
  setMaskDataUrl: (url: string | null) => void;
  setCustomPrompt: (prompt: string) => void;
  setAspectRatio: (ratio: '16:9' | '9:16') => void;
  setImageAspectRatio: (ratio: EnhancerImageAspectRatio) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setActiveCategory: (category: Transformation | null) => void;
  setImageOptions: (options: string[] | null) => void;
  setSelectedOption: (option: string | null) => void;
  startProgressSimulation: () => void;
  stopProgressSimulation: (isSuccess: boolean) => void;
  generateImage: () => Promise<void>;
  generateVideo: () => Promise<void>;
  clearEnhancerState: () => void;
  useImageAsInput: (imageUrl: string) => void;
}

// --- STORE (完整的Store类型) ---
export type EnhancerStore = EnhancerState & EnhancerActions;

let progressIntervalRef: number | null = null;

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

export const useEnhancerStore = create<EnhancerStore>()(
  persist(
    (set, get) => ({
      // --- 默认状态 (Default State) ---
      enhancerSettings: { numImages: 1, retryCount: 3 },
      selectedTransformation: null,
      primaryImageUrl: null,
      secondaryImageUrl: null,
      multiImageUrls: [],
      generatedContent: null,
      enhancerHistory: [],
      maskDataUrl: null,
      customPrompt: '',
      aspectRatio: '16:9',
      imageAspectRatio: '1:1',
      activeTool: 'none',
      activeCategory: null,
      imageOptions: null,
      selectedOption: null,
      isGenerating: false,
      loadingMessage: '',
      error: null,
      progress: 0,

      // --- 操作实现 (Actions) ---
      setEnhancerSettings: (settings) => set({ enhancerSettings: settings }),
      setSelectedTransformation: (transformation) => {
        const currentPrimary = get().primaryImageUrl;
        get().clearEnhancerState();
        set({
          primaryImageUrl: currentPrimary, // 保留主图片，方便效果链式操作
          selectedTransformation: transformation,
          customPrompt: transformation?.prompt !== 'CUSTOM' ? '' : get().customPrompt,
          error: null,
        });
      },
      setPrimaryImageUrl: (url) => set({
        primaryImageUrl: url, generatedContent: null, maskDataUrl: null,
        activeTool: 'none', imageOptions: null, selectedOption: null,
      }),
      setSecondaryImageUrl: (url) => set({ secondaryImageUrl: url, generatedContent: null }),
      setMultiImageUrls: (urls) => set({ multiImageUrls: urls }),
      setGeneratedContent: (content) => set({ generatedContent: content }),
      setMaskDataUrl: (url) => set({ maskDataUrl: url }),
      setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      setImageAspectRatio: (ratio) => set({ imageAspectRatio: ratio }),
      setActiveTool: (tool) => set({ activeTool: tool }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setImageOptions: (options) => set({ imageOptions: options }),
      setSelectedOption: (option) => set({ selectedOption: option }),
      
      startProgressSimulation: () => {
        if (progressIntervalRef) clearInterval(progressIntervalRef);
        set({ progress: 0 });
        const startTime = Date.now();
        const duration = 30000;
        progressIntervalRef = window.setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < 15000) set({ progress: Math.round((elapsedTime / 15000) * 70) });
          else if (elapsedTime < duration) set({ progress: Math.round(70 + ((elapsedTime - 15000) / 15000) * 25) });
          else if (progressIntervalRef) clearInterval(progressIntervalRef);
        }, 100);
      },

      stopProgressSimulation: (isSuccess) => {
        if (progressIntervalRef) clearInterval(progressIntervalRef);
        if (isSuccess) {
          set({ progress: 100 });
          setTimeout(() => set({ progress: 0 }), 1000);
        } else {
          set({ progress: 0 });
        }
      },

      generateVideo: async () => {
        const { customPrompt, primaryImageUrl, aspectRatio, selectedTransformation, startProgressSimulation, stopProgressSimulation } = get();

        set({ isGenerating: true, error: null, generatedContent: null });
        startProgressSimulation();
        try {
          let imagePayload = null;
          if (primaryImageUrl) {
            imagePayload = { base64: primaryImageUrl.split(',')[1], mimeType: primaryImageUrl.split(';')[0].split(':')[1] ?? 'image/png' };
          }
          const videoDownloadUrl = await generateVideoAction(customPrompt, imagePayload, aspectRatio, (msg) => set({ loadingMessage: msg }));
          set({ loadingMessage: 'Fetching your video...' });
          const response = await fetch(videoDownloadUrl);
          if (!response.ok) throw new Error(`Failed to download video file. Status: ${response.statusText}`);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);

          const newContent: GeneratedContent = {
            imageUrl: null, text: null, videoUrl: objectUrl,
            timestamp: Date.now(), prompt: customPrompt,
            transformationTitleKey: selectedTransformation?.titleKey
          };
          set((state) => ({
            generatedContent: newContent,
            enhancerHistory: [newContent, ...state.enhancerHistory],
          }));
          stopProgressSimulation(true);
        } catch (err) {
          console.error(err);
          set({ error: err instanceof Error ? err.message : "An unknown error occurred." });
          stopProgressSimulation(false);
        } finally {
          set({ isGenerating: false, loadingMessage: '', selectedOption: null });
        }
      },

      generateImage: async () => {
        const { selectedTransformation, customPrompt, primaryImageUrl, secondaryImageUrl, multiImageUrls, maskDataUrl, imageAspectRatio, enhancerSettings, startProgressSimulation, stopProgressSimulation } = get();
        const { isAdvancedMode } = useUiStore.getState();
        const { addImagesToLibrary } = useAssetLibraryStore.getState();

        const promptToUse = selectedTransformation?.prompt === 'CUSTOM' ? customPrompt : selectedTransformation?.prompt;
        if (!selectedTransformation || (!promptToUse?.trim() && !selectedTransformation.isStyleMimic)) {
          set({ error: "请上传图片并选择一个效果。" });
          return;
        }

        set({ isGenerating: true, error: null, generatedContent: null, imageOptions: null, loadingMessage: '' });
        startProgressSimulation();

        const applyWatermarks = async (imageUrl: string | null) => {
          if (!imageUrl || isAdvancedMode) return imageUrl;
          try {
            const invisiblyWatermarked = await embedWatermark(imageUrl, "香蕉PS乐园");
            return await addVisibleWatermark(invisiblyWatermarked, "香蕉PS乐园");
          } catch (err) {
            console.error("Failed to apply watermarks", err);
            return imageUrl;
          }
        };

        const generationTask = async () => {
            const base64ify = (url: string) => ({ base64: url.split(',')[1], mimeType: url.split(';')[0].split(':')[1] ?? 'image/png' });
            
            const isSimpleGeneration = selectedTransformation && !selectedTransformation.isMultiStepVideo && !selectedTransformation.isTwoStep && !selectedTransformation.maxImages && !selectedTransformation.isStyleMimic;

            // 分支1: 风格模仿效果
            if (selectedTransformation.isStyleMimic) {
                if (!primaryImageUrl || !secondaryImageUrl) throw new Error("Please upload both images for Style Mimic.");
                set({ loadingMessage: "Analyzing style..." });
                const result = await generateStyleMimicImageAction(base64ify(primaryImageUrl), base64ify(secondaryImageUrl));
                result.imageUrl = await applyWatermarks(result.imageUrl);
                 const newContent: GeneratedContent = { ...result, timestamp: Date.now(), prompt: "Style Mimic", transformationTitleKey: selectedTransformation.titleKey };
                set(state => ({ generatedContent: newContent, enhancerHistory: [newContent, ...state.enhancerHistory] }));
                addImagesToLibrary([result.imageUrl]);
            } 
            // 分支2: 两步处理效果（如配色方案）
            else if (selectedTransformation.isTwoStep) {
                if (!primaryImageUrl || !secondaryImageUrl) throw new Error("Please upload both images for Two-Step transformation.");
                
                // 第一步：生成线稿
                set({ loadingMessage: "第1步：创建线稿..." });
                const step1Result = await editImageAction(
                    selectedTransformation.prompt!, 
                    [base64ify(primaryImageUrl)], 
                    null
                );
                
                if (!step1Result.imageUrl) throw new Error("Failed to generate line art in step 1.");
                
                // 第二步：使用第二张图的颜色为线稿上色
                set({ loadingMessage: "第2步：应用调色板..." });
                const step2Result = await editImageAction(
                    selectedTransformation.stepTwoPrompt!, 
                    [base64ify(step1Result.imageUrl), base64ify(secondaryImageUrl)], 
                    null
                );
                
                step2Result.imageUrl = await applyWatermarks(step2Result.imageUrl);
                
                // 保存两步的结果
                const newContent: GeneratedContent = { 
                    imageUrl: step2Result.imageUrl, 
                    text: null,
                    secondaryImageUrl: step1Result.imageUrl, // 保存线稿作为中间结果
                    timestamp: Date.now(), 
                    prompt: `${selectedTransformation.prompt} → ${selectedTransformation.stepTwoPrompt}`,
                    transformationTitleKey: selectedTransformation.titleKey 
                };
                set(state => ({ generatedContent: newContent, enhancerHistory: [newContent, ...state.enhancerHistory] }));
                addImagesToLibrary([step2Result.imageUrl, step1Result.imageUrl]);
            } 
            // 分支3: 纯文本生成图片
            else if (selectedTransformation.key === 'customPrompt' && !primaryImageUrl) {
                const result = await generateImageFromTextAction(promptToUse!, imageAspectRatio, enhancerSettings.numImages);
                const watermarkedUrls = await Promise.all(result.imageUrls.map(url => applyWatermarks(url)));
                const validUrls = watermarkedUrls.filter((url): url is string => !!url);
                if (enhancerSettings.numImages > 1) {
                    set({ imageOptions: validUrls });
                } else {
                    const newContent: GeneratedContent = { imageUrl: validUrls[0], text: null, timestamp: Date.now(), prompt: promptToUse!, transformationTitleKey: selectedTransformation.titleKey };
                    set(state => ({ generatedContent: newContent, enhancerHistory: [newContent, ...state.enhancerHistory] }));
                }
                addImagesToLibrary(validUrls);
            } else {
                const imageParts = multiImageUrls.length > 0 ? multiImageUrls.map(base64ify) : (primaryImageUrl ? [base64ify(primaryImageUrl)] : []);
                if (secondaryImageUrl) imageParts.push(base64ify(secondaryImageUrl));
                if (imageParts.length === 0) throw new Error("Please upload an image.");

                const maskBase64 = maskDataUrl ? maskDataUrl.split(',')[1] : null;

                if (isSimpleGeneration && enhancerSettings.numImages > 1) {
                    set({ loadingMessage: "Generating image options..." });
                    const promises = Array.from({ length: enhancerSettings.numImages }, () => 
                        editImageAction(promptToUse!, imageParts, maskBase64)
                    );
                    const results = await Promise.all(promises);
                    const imageUrls = results.map(r => r.imageUrl).filter((url): url is string => !!url);
                    
                    if (imageUrls.length === 0) {
                      throw new Error("Failed to generate any image variations. The model may have refused the request.");
                    }
                    
                    const watermarkedUrls = await Promise.all(imageUrls.map(url => applyWatermarks(url)));
                    const validUrls = watermarkedUrls.filter((url): url is string => !!url);
                    
                    set({ imageOptions: validUrls });
                    addImagesToLibrary(validUrls);
                } else {
                    const result = await editImageAction(promptToUse!, imageParts, maskBase64);
                    result.imageUrl = await applyWatermarks(result.imageUrl);
                    const newContent: GeneratedContent = { ...result, timestamp: Date.now(), prompt: promptToUse!, transformationTitleKey: selectedTransformation.titleKey };
                    set(state => ({ generatedContent: newContent, enhancerHistory: [newContent, ...state.enhancerHistory] }));
                    addImagesToLibrary([result.imageUrl]);
                }
            }
        };

        try {
          await retry(generationTask, enhancerSettings.retryCount);
          stopProgressSimulation(true);
        } catch (err) {
          console.error(err);
          set({ error: err instanceof Error ? err.message : "An unknown error occurred." });
          stopProgressSimulation(false);
        } finally {
          set({ isGenerating: false, loadingMessage: '' });
        }
      },

      clearEnhancerState: () => set({
        primaryImageUrl: null,
        secondaryImageUrl: null,
        multiImageUrls: [],
        generatedContent: null,
        maskDataUrl: null,
        customPrompt: '',
        activeTool: 'none',
        imageOptions: null,
        selectedOption: null,
        selectedTransformation: null,
        activeCategory: null,
        error: null,
      }),

      useImageAsInput: (imageUrl) => {
        get().clearEnhancerState();
        set({
          primaryImageUrl: imageUrl,
          error: null,
        });
      },
    }),
    {
      name: 'bananary-enhancer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        enhancerSettings: state.enhancerSettings,
      }),
    }
  )
);
