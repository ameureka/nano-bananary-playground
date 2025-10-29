'use client';

import { createContext, useContext } from 'react';

// 定义 Context 中将要提供的数据和函数的类型
interface LayoutContextType {
  allPrompts: string; // 所有预设提示词的列表
  setPreviewImageUrl: (url: string | null) => void; // 设置全局图片预览
  openAssetLibraryModal: (config: {
    selectionMode: 'single' | 'multiple';
    onSelect: (urls: string[]) => void;
    maxSelection?: number;
  }) => void; // 打开资产库模态框
  addChatInputImages: (images: string[]) => void; // 向聊天输入框添加图片
  onAttachImage: () => void; // 触发聊天图片上传
}

// 创建 Context，初始值为 null
export const LayoutContext = createContext<LayoutContextType | null>(null);

/**
 * 自定义钩子 `useLayout`
 * 方便子组件消费 LayoutContext 提供的值。
 * 如果组件不在 LayoutContext.Provider 内部使用，将抛出错误。
 */
export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
