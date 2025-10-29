'use client';

import React, { ReactNode } from 'react';
// 导入语言上下文提供者
import { LanguageProvider } from '@/i18n/context';
// 导入主题上下文提供者
import { ThemeProvider } from '@/theme/context';

/**
 * Providers 组件
 * 该组件封装了应用中所有的全局上下文提供者。
 * 这是一种常见的模式，用于保持根组件的整洁，并与 Next.js 的 app/providers.tsx 结构对齐。
 */
export const Providers: React.FC<{ children: ReactNode; initialLanguage?: 'zh' | 'en' }> = ({ children, initialLanguage }) => {
  return (
    <LanguageProvider initialLanguage={initialLanguage}
    >
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
};
