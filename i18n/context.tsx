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

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'zh' || saved === 'en') return saved;
    }
    return 'zh';
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('language', lang); } catch {}
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
