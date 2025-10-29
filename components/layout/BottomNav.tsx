'use client';

import React from 'react';
// 使用 Link 组件进行客户端路由导航
import Link from 'next/link';
// 导入国际化和类型定义
import { useTranslation } from '@/i18n/context';
import type { View } from '@/types';

// BottomNav 组件的 Props 定义
interface BottomNavProps {
  currentView: View; // 当前所在的视图
  onHomepageClick?: (e: React.MouseEvent) => void; // 主页按钮点击事件
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onHomepageClick }) => {
  const { t } = useTranslation();
  // 根据视图名称生成对应的类名，用于高亮显示当前视图
  const getNavItemClass = (viewName: View) => `bn-item ripple-surface ${currentView === viewName ? 'active' : ''}`;
  
  // 封装 Link 组件，使其表现得像一个导航项
  const NavLink = ({ href, view, children }: { href: string, view: View, children: React.ReactNode }) => (
    <Link href={href} className={getNavItemClass(view)} onClick={view === 'enhancer' ? onHomepageClick : undefined}>
        {children}
    </Link>
  );

  return (
    <nav className="bottom-nav">
      <NavLink href="/" view="enhancer">
        <div className="bn-icon-container">
          <span className="material-symbols-outlined">home</span>
        </div>
        <span className="bn-label">{t('bottomNav.homepage')}</span>
      </NavLink>
      <NavLink href="/chat" view="chat">
        <div className="bn-icon-container">
          <span className="material-symbols-outlined">chat</span>
        </div>
        <span className="bn-label">{t('bottomNav.chat')}</span>
      </NavLink>
      <NavLink href="/library" view="library">
        <div className="bn-icon-container">
          <span className="material-symbols-outlined">photo_library</span>
        </div>
        <span className="bn-label">{t('bottomNav.library')}</span>
      </NavLink>
    </nav>
  );
};
