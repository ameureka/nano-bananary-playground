'use client';

import React from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';
// 导入文件处理工具
import { dataUrlToFile } from '@/utils/fileUtils';
// 导入图片编辑器组件
import ImageEditorCanvas from '../../../ImageEditorCanvas';
// 导入 Zustand stores
import { useEnhancerStore } from '@/store/enhancerStore';
import { useUiStore } from '@/store/uiStore';
// 导入类型定义
import type { Transformation } from '@/types';

interface VideoTransformationProps {
  transformation: Transformation;
  onOpenAssetLibrary: (config: any) => void;
}

const VideoTransformation: React.FC<VideoTransformationProps> = ({ onOpenAssetLibrary }) => {
  const { t } = useTranslation();
  // 从 enhancer store 中获取状态和 actions
  const {
    customPrompt, primaryImageUrl, aspectRatio,
    setCustomPrompt, setPrimaryImageUrl, setAspectRatio
  } = useEnhancerStore();
  // 从 ui store 中获取显示提示消息的 action
  const { setToast } = useUiStore();

  // 处理图片选择
  const handlePrimaryImageSelect = (file: File, dataUrl: string) => setPrimaryImageUrl(dataUrl);

  // 从资产库选择图片后的处理逻辑
  const handleImageSelectFromLibrary = React.useCallback(async (dataUrl: string, handler: (file: File, dataUrl: string) => void) => {
    try {
      const file = await dataUrlToFile(dataUrl, `library-img-${Date.now()}.png`);
      handler(file, dataUrl);
    } catch (err) {
      console.error("Failed to load image from library:", err);
      setToast(err instanceof Error ? err.message : "Failed to load image from library.");
    }
  }, [setToast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 视频生成提示词输入框 */}
      <textarea
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder={t('transformations.video.promptPlaceholder')}
        rows={4}
        className="textarea"
      />
      {/* 宽高比选择 */}
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '0.5rem' }}>
          {t('transformations.video.aspectRatio')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {(['16:9', '9:16'] as const).map(ratio => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`btn ${aspectRatio === ratio ? 'btn-filled' : 'btn-tonal'} ripple-surface`}
            >
              {t(ratio === '16:9' ? 'transformations.video.landscape' : 'transformations.video.portrait')}
            </button>
          ))}
        </div>
      </div>
      {/* 可选的初始图片上传 */}
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '0.5rem' }}>
          {t('transformations.effects.customPrompt.uploader2Title')}
        </h3>
        <ImageEditorCanvas
          onImageSelect={handlePrimaryImageSelect}
          initialImageUrl={primaryImageUrl}
          onMaskChange={() => {}} // 视频生成不需要蒙版
          onClearImage={() => setPrimaryImageUrl(null)}
          isMaskToolActive={false} // 禁用蒙版工具
          onOpenAssetLibrary={() => onOpenAssetLibrary({
            selectionMode: 'single',
            onSelect: (urls: string[]) => { if (urls.length > 0) handleImageSelectFromLibrary(urls[0], handlePrimaryImageSelect); }
          })}
        />
      </div>
    </div>
  );
};

export default VideoTransformation;
