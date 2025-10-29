// 'use client'
import React from 'react';
// 导入主题上下文钩子
import { useTheme } from '../theme/context';
// 导入国际化钩子
import { useTranslation } from '../i18n/context';

const ThemeSwitcher: React.FC = () => {
  // 从上下文中获取当前主题和切换主题的函数
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className="icon-btn"
      // 为无障碍访问提供动态的 aria-label
      aria-label={theme === 'light' ? t('app.theme.switchToDark') : t('app.theme.switchToLight')}
    >
      <span className="material-symbols-outlined">
        {/* 根据当前主题显示不同的图标 */}
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
      <span className="state-layer"></span>
    </button>
  );
};

export default ThemeSwitcher;
