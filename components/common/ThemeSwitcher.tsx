'use client';

import React from 'react';
// 导入主题上下文钩子
import { useTheme } from '@/theme/context';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';

const ThemeSwitcher: React.FC = () => {
  // 从上下文中获取当前主题和切换主题的函数
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // 在客户端挂载后再渲染，避免 SSR/CSR 初始渲染不一致导致的水合警告
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="icon-btn"
      aria-label={theme === 'light' ? t('app.theme.switchToDark') : t('app.theme.switchToLight')}
    >
      <span className="material-symbols-outlined">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
      <span className="state-layer"></span>
    </button>
  );
};

export default ThemeSwitcher;
