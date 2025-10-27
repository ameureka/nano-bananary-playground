// 'use client'
import React from 'react';
// 导入国际化钩子
import { useTranslation } from '../i18n/context';

interface LoadingSpinnerProps {
    message?: string; // 可选的加载信息
    progress?: number; // 可选的进度值 (0-100)
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, progress = 0 }) => {
  const { t } = useTranslation(); // 获取翻译函数
  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--md-sys-color-on-surface)'}}>
        {/* 旋转的加载图标 */}
        <span 
          className="material-symbols-outlined" 
          style={{
            fontSize: '2.5rem', 
            color: 'var(--md-sys-color-primary)',
            animation: 'spin 1.5s linear infinite' // 应用旋转动画
          }}
        >
          progress_activity
        </span>
        {/* 加载文本 */}
        <p style={{fontSize: '1rem', fontWeight: 500}}>{message || t('app.loading.default')}</p>
        
        {/* 进度条 (仅当 progress > 0 时显示) */}
        {progress > 0 && (
          <div style={{width: '80%', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: '4px', overflow: 'hidden', height: '8px'}}>
            <div style={{width: `${progress}%`, height: '100%', backgroundColor: 'var(--md-sys-color-primary)', transition: 'width 0.2s ease-out'}}></div>
          </div>
        )}

        {/* 提示用户等待的附加信息 */}
        <p style={{fontSize: '0.875rem', color: 'var(--md-sys-color-on-surface-variant)'}}>{t('app.loading.wait')}</p>
        {/* 内联样式定义旋转动画 */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
    </div>
  );
};

export default LoadingSpinner;
