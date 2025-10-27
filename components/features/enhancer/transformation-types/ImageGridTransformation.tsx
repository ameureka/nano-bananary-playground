// 'use client'
import React from 'react';
// 导入多图网格上传器组件
import MultiImageGridUploader from '../../../MultiImageGridUploader';
// 导入 Zustand store
import { useEnhancerStore } from '../../../../store/enhancerStore';
// 导入类型定义
import type { Transformation } from '../../../../types';

interface ImageGridTransformationProps {
  transformation: Transformation; // 当前变换效果的配置
  onOpenAssetLibrary: (config: any) => void; // 打开资产库的回调
}

const ImageGridTransformation: React.FC<ImageGridTransformationProps> = ({ transformation, onOpenAssetLibrary }) => {
  // 从 store 中获取和设置多图 URL
  const { multiImageUrls, setMultiImageUrls } = useEnhancerStore();

  return (
    <MultiImageGridUploader
      imageUrls={multiImageUrls} // 传递当前已有的图片
      onImagesChange={setMultiImageUrls} // 图片变化时更新 store
      maxImages={transformation.maxImages!} // 传递最大图片数量
      onOpenAssetLibrary={() => onOpenAssetLibrary({
        selectionMode: 'multiple', // 允许从资产库多选
        maxSelection: transformation.maxImages! - multiImageUrls.length, // 限制最大选择数量
        onSelect: (urls: string[]) => setMultiImageUrls([...multiImageUrls, ...urls]), // 将选择的图片添加到当前列表
      })}
    />
  );
};

export default ImageGridTransformation;
