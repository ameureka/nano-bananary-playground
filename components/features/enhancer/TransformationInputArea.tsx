'use client';

import React from 'react';
import dynamic from 'next/dynamic';
// 导入 Zustand store
import { useEnhancerStore } from '@/store/enhancerStore';
// 导入类型定义
import type { Transformation } from '@/types';

// 动态导入不同变换类型的输入区域组件以优化初始加载
// 每个变换类型只在需要时才加载对应的组件
const SingleImageTransformation = dynamic(() => import('./transformation-types/SingleImageTransformation'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>,
});

const MultiImageTransformation = dynamic(() => import('./transformation-types/MultiImageTransformation'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>,
});

const ImageGridTransformation = dynamic(() => import('./transformation-types/ImageGridTransformation'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>,
});

const VideoTransformation = dynamic(() => import('./transformation-types/VideoTransformation'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>,
});

const TextToImageTransformation = dynamic(() => import('./transformation-types/TextToImageTransformation'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>,
});

interface TransformationInputAreaProps {
  transformation: Transformation; // 当前选定的变换效果对象
  onOpenAssetLibrary: (config: any) => void; // 打开资产库的回调函数
}

/**
 * 该组件是一个 "路由器" 或 "分发器"。
 * 它根据传入的 `transformation` 对象的属性，
 * 动态地决定渲染哪种类型的输入界面。
 */
const TransformationInputArea: React.FC<TransformationInputAreaProps> = ({ transformation, onOpenAssetLibrary }) => {
  // 从 store 中订阅主图片 URL，用于逻辑判断（避免在渲染中直接调用 getState）
  const primaryImageUrl = useEnhancerStore(state => state.primaryImageUrl);

  // 如果效果需要多张图片（网格形式）
  if (transformation.maxImages) {
    return <ImageGridTransformation transformation={transformation} onOpenAssetLibrary={onOpenAssetLibrary} />;
  }

  // 如果效果是视频生成
  if (transformation.isVideo) {
    return <VideoTransformation transformation={transformation} onOpenAssetLibrary={onOpenAssetLibrary} />;
  }
  
  // 如果效果需要两张输入图片或进行风格模仿
  if (transformation.isMultiImage || transformation.isStyleMimic) {
    return <MultiImageTransformation transformation={transformation} onOpenAssetLibrary={onOpenAssetLibrary} />;
  }
  
  // 特殊情况：如果是自定义提示，并且用户还未上传图片，则显示纯文本输入界面
  if (transformation.key === 'customPrompt' && !primaryImageUrl) {
    return <TextToImageTransformation transformation={transformation} />;
  }

  // 默认情况：渲染单图编辑界面
  return <SingleImageTransformation transformation={transformation} onOpenAssetLibrary={onOpenAssetLibrary} />;
};

export default TransformationInputArea;
