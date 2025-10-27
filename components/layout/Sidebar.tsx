// 'use client'
import React from 'react';
// 使用 Link 组件进行客户端路由导航，避免页面刷新
import { Link } from 'react-router-dom';
// 导入国际化和类型定义
import { useTranslation } from '../../i18n/context';
import type { View } from '../../types';

// Sidebar 组件的 Props 定义
interface SidebarProps {
  currentView: View; // 当前所在的视图
  isCollapsed: boolean; // 侧边栏是否折叠
  onToggleCollapse: () => void; // 切换折叠状态的回调
  onHomepageClick?: (e: React.MouseEvent) => void; // 主页按钮点击事件，用于特殊逻辑（如激活进阶模式）
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, isCollapsed, onToggleCollapse, onHomepageClick }) => {
  const { t } = useTranslation();
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* 侧边栏头部 */}
        <div className="sidebar-header">
            {/* 根据折叠状态显示 Logo 或标题 */}
            <span className="sidebar-logo-text">{isCollapsed ? '🍌' : t('app.title')}</span>
        </div>
        {/* 导航项 */}
        <div className="sidebar-nav-items">
            <Link
                to="/"
                className={`sidebar-item ripple-surface ${currentView === 'enhancer' ? 'active' : ''}`}
                onClick={onHomepageClick}
            >
                <span className="material-symbols-outlined">home</span>
                <span className="sidebar-item-text">{t('sidebar.homepage')}</span>
            </Link>
            <Link
                to="/chat"
                className={`sidebar-item ripple-surface ${currentView === 'chat' ? 'active' : ''}`}
            >
                <span className="material-symbols-outlined">chat</span>
                <span className="sidebar-item-text">{t('sidebar.chat')}</span>
            </Link>
            <Link
                to="/library"
                className={`sidebar-item ripple-surface ${currentView === 'library' ? 'active' : ''}`}
            >
                <span className="material-symbols-outlined">photo_library</span>
                <span className="sidebar-item-text">{t('sidebar.library')}</span>
            </Link>
        </div>
        {/* 侧边栏底部 */}
        <div className="sidebar-footer">
            <button onClick={onToggleCollapse} className="icon-btn ripple-surface sidebar-toggle" title={t('sidebar.toggle')}>
                {/* 根据折叠状态显示不同的图标 */}
                <span className="material-symbols-outlined">{isCollapsed ? 'menu_open' : 'menu'}</span>
            </button>
        </div>
    </aside>
  );
};