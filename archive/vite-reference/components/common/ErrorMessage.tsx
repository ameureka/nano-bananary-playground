// 'use client'
import React from 'react';
// 导入国际化钩子
import { useTranslation } from '../../i18n/context';

interface ErrorMessageProps {
  message: string; // 要显示的错误信息
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation(); // 获取翻译函数
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '1rem',
        backgroundColor: 'var(--md-sys-color-error-container)',
        color: 'var(--md-sys-color-on-error-container)',
        borderRadius: '8px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      role="alert" // ARIA role，表示这是一个警告信息
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <span className="material-symbols-outlined">error</span>
        <p style={{fontWeight: 500}}>{t('error.title')}</p>
      </div>
      <p style={{fontSize: '0.875rem'}}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
