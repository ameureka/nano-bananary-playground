// 'use client'
import React from 'react';
// 导入国际化上下文钩子
import { useTranslation } from '../i18n/context';

const LanguageSwitcher: React.FC = () => {
  // 从上下文中获取当前语言和改变语言的函数
  const { language, changeLanguage } = useTranslation();

  // 切换语言的函数
  const toggleLanguage = () => {
    // 在 'en' 和 'zh' 之间切换
    const newLang = language === 'en' ? 'zh' : 'en';
    changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="icon-btn"
      aria-label="Switch language" // 为无障碍访问提供标签
    >
      <span className="material-symbols-outlined">language</span>
      <span className="state-layer"></span>
    </button>
  );
};

export default LanguageSwitcher;
