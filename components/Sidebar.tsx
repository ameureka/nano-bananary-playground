'use client';



import React from 'react';
import { useTranslation } from '@/i18n/context';
import type { View } from '@/types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onHomepageClick?: (e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, onToggleCollapse, onHomepageClick }) => {
  const { t } = useTranslation();
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
            <span className="sidebar-logo-text">{isCollapsed ? '🍌' : t('app.title')}</span>
        </div>
        <div className="sidebar-nav-items">
            <div
                className={`sidebar-item ripple-surface ${currentView === 'enhancer' ? 'active' : ''}`}
                onClick={(e) => {
                    onNavigate('enhancer');
                    onHomepageClick?.(e);
                }}
            >
                <span className="material-symbols-outlined">home</span>
                <span className="sidebar-item-text">{t('sidebar.homepage')}</span>
            </div>
            <div
                className={`sidebar-item ripple-surface ${currentView === 'chat' ? 'active' : ''}`}
                onClick={() => onNavigate('chat')}
            >
                <span className="material-symbols-outlined">chat</span>
                <span className="sidebar-item-text">{t('sidebar.chat')}</span>
            </div>
            <div
                className={`sidebar-item ripple-surface ${currentView === 'library' ? 'active' : ''}`}
                onClick={() => onNavigate('library')}
            >
                <span className="material-symbols-outlined">photo_library</span>
                <span className="sidebar-item-text">{t('sidebar.library')}</span>
            </div>
        </div>
        <div className="sidebar-footer">
            <button onClick={onToggleCollapse} className="icon-btn ripple-surface sidebar-toggle" title={t('sidebar.toggle')}>
                <span className="material-symbols-outlined">{isCollapsed ? 'menu_open' : 'menu'}</span>
            </button>
        </div>
    </aside>
  );
};
