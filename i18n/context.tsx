'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from './translations';

type Language = 'zh' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode; initialLanguage?: Language }> = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // 优先使用服务端传入的初始语言，确保 SSR 与 CSR 一致
    if (initialLanguage === 'zh' || initialLanguage === 'en') {
      return initialLanguage;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'zh' || saved === 'en') return saved;
      // 尝试从 cookie 读取（避免首次渲染不一致）
      try {
        const match = document.cookie.match(/(?:^|;\s*)language=(zh|en)(?:;|$)/);
        if (match && (match[1] === 'zh' || match[1] === 'en')) {
          return match[1] as Language;
        }
      } catch {}
    }
    return 'zh';
  });

  // 在挂载后同步本地存储的语言设置，避免首次渲染水合不一致但又保持用户偏好
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('language');
        if ((saved === 'zh' || saved === 'en') && saved !== language) {
          setLanguage(saved as Language);
          document.cookie = `language=${saved}; path=/; max-age=${60 * 60 * 24 * 365}`;
        }
      } catch {}
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('language', lang); } catch {}
      // 写入 cookie，供服务端下一次渲染使用，保持一致性
      try { document.cookie = `language=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`; } catch {}
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    let str = typeof value === 'string' ? value : key;
    if (params) {
      str = str.replace(/\{(\w+)\}/g, (_, p) => {
        const v = params[p];
        return v !== undefined && v !== null ? String(v) : `{${p}}`;
      });
    }
    return str;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
