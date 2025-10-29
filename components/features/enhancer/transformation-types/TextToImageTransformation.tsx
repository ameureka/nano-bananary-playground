'use client';

import React from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';
// 导入 Zustand store
import { useEnhancerStore } from '@/store/enhancerStore';
// 导入类型定义
import type { Transformation } from '@/types';

interface TextToImageTransformationProps {
  transformation: Transformation;
}

const TextToImageTransformation: React.FC<TextToImageTransformationProps> = () => {
  const { t } = useTranslation();
  // 从 store 中获取状态和 actions
  const { customPrompt, setCustomPrompt, imageAspectRatio, setImageAspectRatio } = useEnhancerStore();

  return (
    <div className="animate-fade-in-fast" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 提示词输入框 */}
      <textarea
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="e.g., A robot holding a red skateboard."
        rows={3}
        className="textarea"
      />
      {/* 宽高比选择器 */}
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '0.5rem' }}>
          {t('app.aspectRatio')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '0.5rem' }}>
          {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map(ratio => (
            <button
              key={ratio}
              onClick={() => setImageAspectRatio(ratio)}
              className={`btn ${imageAspectRatio === ratio ? 'btn-filled' : 'btn-tonal'} ripple-surface`}
              style={{ padding: '0 0.5rem', height: '36px', fontSize: '0.75rem' }}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextToImageTransformation;
