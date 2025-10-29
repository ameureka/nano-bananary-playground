'use client';



import React from 'react';
import { useTranslation } from '@/i18n/context';
import type { View } from '@/types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onHomepageClick?: (e: React.MouseEvent) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onHomepageClick }) => {
  const { t } = useTranslation();
  const getNavItemClass = (viewName: View) => `bn-item ripple-surface ${currentView === viewName ? 'active' : ''}`;
  return (
    <nav className="bottom-nav">
      <button className={getNavItemClass('enhancer')} onClick={(e) => {
          onNavigate('enhancer');
          onHomepageClick?.(e);
      }}>
        <div className="bn-icon-container">
          <span className="material-symbols-outlined">home</span>
        </div>
        <span className="bn-label">{t('bottomNav.homepage')}</span>
      </button>
      <button className={getNavItemClass('chat')} onClick={() => onNavigate('chat')}>
        <div className="bn-icon-container">
          <span className="material-symbols-outlined">chat</span>
        </div>
        <span className="bn-label">{t('bottomNav.chat')}</span>
      </button>
      <button className={getNavItemClass('library')} onClick={() => onNavigate('library')}>
        <div className="bn-icon-container">
          <span className="material-symbols-outlined">photo_library</span>
        </div>
        <span className="bn-label">{t('bottomNav.library')}</span>
      </button>
    </nav>
  );
};
