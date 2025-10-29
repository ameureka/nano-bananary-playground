'use client';

import React from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';
// 导入文件处理工具
import { dataUrlToFile } from '@/utils/fileUtils';
// 导入多图上传器 UI 组件
import MultiImageUploader from '../../../MultiImageUploader';
// 导入 Zustand stores
import { useEnhancerStore } from '@/store/enhancerStore';
import { useUiStore } from '@/store/uiStore';
// 导入类型定义
import type { Transformation } from '@/types';

interface MultiImageTransformationProps {
  transformation: Transformation; // 当前变换效果的配置
  onOpenAssetLibrary: (config: any) => void; // 打开资产库的回调
}

const MultiImageTransformation: React.FC<MultiImageTransformationProps> = ({ transformation, onOpenAssetLibrary }) => {
  const { t } = useTranslation();
  // 从 enhancer store 中获取状态和 action
  const { primaryImageUrl, secondaryImageUrl, setPrimaryImageUrl, setSecondaryImageUrl } = useEnhancerStore();
  // 从 ui store 中获取显示提示消息的 action
  const { setToast } = useUiStore();

  // 处理主图片选择
  const handlePrimaryImageSelect = (file: File, dataUrl: string) => setPrimaryImageUrl(dataUrl);
  // 处理次要图片选择
  const handleSecondaryImageSelect = (file: File, dataUrl: string) => setSecondaryImageUrl(dataUrl);
  
  // 从资产库选择图片后的处理逻辑
  const handleImageSelectFromLibrary = React.useCallback(async (dataUrl: string, handler: (file: File, dataUrl: string) => void) => {
    try {
      // 将 dataUrl 转换回 File 对象，以便统一处理
      const file = await dataUrlToFile(dataUrl, `library-img-${Date.now()}.png`);
      handler(file, dataUrl);
    } catch (err) {
      console.error("Failed to load image from library:", err);
      // 如果转换失败，显示错误提示
      setToast(err instanceof Error ? err.message : "Failed to load image from library.");
    }
  }, [setToast]);

  return (
    <MultiImageUploader
      onPrimarySelect={handlePrimaryImageSelect}
      onSecondarySelect={handleSecondaryImageSelect}
      primaryImageUrl={primaryImageUrl}
      secondaryImageUrl={secondaryImageUrl}
      onClearPrimary={() => setPrimaryImageUrl(null)}
      onClearSecondary={() => setSecondaryImageUrl(null)}
      // 动态设置上传框的标题和描述
      primaryTitle={transformation.primaryUploaderTitle ? t(transformation.primaryUploaderTitle) : undefined}
      primaryDescription={transformation.primaryUploaderDescription ? t(transformation.primaryUploaderDescription) : undefined}
      secondaryTitle={transformation.secondaryUploaderTitle ? t(transformation.secondaryUploaderTitle) : undefined}
      secondaryDescription={transformation.secondaryUploaderDescription ? t(transformation.secondaryUploaderDescription) : undefined}
      // 配置从资产库导入主图片的回调
      onPrimaryOpenLibrary={() => onOpenAssetLibrary({
        selectionMode: 'single',
        onSelect: (urls: string[]) => { if (urls.length > 0) handleImageSelectFromLibrary(urls[0], handlePrimaryImageSelect); }
      })}
      // 配置从资产库导入次要图片的回调
      onSecondaryOpenLibrary={() => onOpenAssetLibrary({
        selectionMode: 'single',
        onSelect: (urls: string[]) => { if (urls.length > 0) handleImageSelectFromLibrary(urls[0], handleSecondaryImageSelect); }
      })}
    />
  );
};

export default MultiImageTransformation;
