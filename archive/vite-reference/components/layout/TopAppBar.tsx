// 'use client'
import React, { useEffect, useRef } from 'react';
// 导入国际化和类型定义
import { useTranslation } from '../../i18n/context';
import type { View } from '../../types';
// 导入子组件
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
// 导入 Zustand stores
import { useAssetLibraryStore } from '../../store/assetLibraryStore';
import { useChatStore } from '../../store/chatStore';

// TopAppBar 组件的 Props 定义
export const TopAppBar: React.FC<{
  onUploadClick: () => void; // "上传"按钮点击事件
  currentView: View; // 当前所在的视图
  showBackButton?: boolean; // 是否显示返回按钮
  onBackClick?: () => void; // 返回按钮点击事件
  onChatSettingsClick?: () => void; // 聊天设置按钮点击事件
  onEnhancerSettingsClick?: () => void; // 增强器设置按钮点击事件
  onHistoryClick?: () => void; // 历史记录按钮点击事件
}> = (props) => {
  const { t } = useTranslation();
  const {
    onUploadClick, currentView, showBackButton, onBackClick,
    onChatSettingsClick, onEnhancerSettingsClick, onHistoryClick,
  } = props;

  // 从 store 中获取状态和操作（使用精确 selectors 防止不必要重渲染）
  const selectedAssets = useAssetLibraryStore(s => s.selectedAssets);
  const assetLibrary = useAssetLibraryStore(s => s.assetLibrary);
  const toggleSelectAll = useAssetLibraryStore(s => s.toggleSelectAll);
  const clearAssetSelection = useAssetLibraryStore(s => s.clearAssetSelection);
  const chatHistory = useChatStore(s => s.chatHistory);
  const clearChatHistory = useChatStore(s => s.clearChatHistory);
  
  // 判断是否处于资产库的多选模式
  const isMultiSelectMode = currentView === 'library' && selectedAssets.size > 0;
  const numSelected = selectedAssets.size;
  const isAllSelected = assetLibrary.length > 0 && numSelected === assetLibrary.length;
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // 根据选择状态更新“全选”复选框的中间状态 (indeterminate)
  useEffect(() => {
      if (selectAllCheckboxRef.current) {
          selectAllCheckboxRef.current.indeterminate = numSelected > 0 && !isAllSelected;
      }
  }, [numSelected, isAllSelected]);

  return (
    <header className={`top-app-bar ${isMultiSelectMode ? 'contextual-app-bar' : ''}`}>
      {isMultiSelectMode ? (
        // 多选模式下的顶部栏
        <>
          <div className="top-app-bar-start">
            <label className="multi-select-all-label">
              <input 
                ref={selectAllCheckboxRef}
                type="checkbox" 
                className="multi-select-checkbox" 
                checked={isAllSelected}
                onChange={toggleSelectAll}
                aria-label={t('topAppBar.selectAll')}
              />
              <span>{t('topAppBar.selected', { count: numSelected })}</span>
            </label>
          </div>
          <div className="top-app-bar-actions">
            {/* 在未来可以实现下载和删除功能 */}
            <button onClick={() => alert('下载功能待实现')} className="icon-btn ripple-surface" title={t('topAppBar.downloadSelected')}>
              <span className="material-symbols-outlined">download</span>
            </button>
            <button onClick={() => alert('删除功能待实现')} className="icon-btn ripple-surface" title={t('topAppBar.deleteSelected')}>
              <span className="material-symbols-outlined">delete</span>
            </button>
            <button onClick={clearAssetSelection} className="icon-btn ripple-surface" title={t('topAppBar.cancel')}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </>
      ) : (
        // 正常模式下的顶部栏
        <>
          <div className="top-app-bar-start">
            {showBackButton && (
              <button onClick={onBackClick} className="btn btn-tonal ripple-surface">
                <span className="material-symbols-outlined">arrow_back</span>
                <span>{t('app.back')}</span>
              </button>
            )}
            {currentView === 'chat' && !showBackButton && <h2 style={{fontSize: '1.25rem'}}>{t('chat.title')}</h2>}
          </div>
          <div className="top-app-bar-actions">
            {/* 根据不同视图显示不同的操作按钮 */}
            {currentView !== 'chat' && (
              <button onClick={onUploadClick} className="btn btn-tonal ripple-surface upload-btn">
                <span className="material-symbols-outlined">{currentView === 'library' ? 'add_photo_alternate' : 'upload'}</span>
                <span className="upload-btn-label">{currentView === 'library' ? t('topAppBar.import') : t('topAppBar.upload')}</span>
              </button>
            )}
             {currentView === 'enhancer' && (
              <>
                <button onClick={onHistoryClick} className="icon-btn ripple-surface" title={t('app.history')}>
                    <span className="material-symbols-outlined">history</span>
                </button>
                <button onClick={onEnhancerSettingsClick} className="icon-btn ripple-surface" title={t('enhancer.settings')}>
                    <span className="material-symbols-outlined">settings</span>
                </button>
              </>
              )}
            {currentView === 'chat' && (
              <>
                <button onClick={clearChatHistory} className="icon-btn ripple-surface" title={t('chat.clear')} disabled={chatHistory.length === 0}>
                    <span className="material-symbols-outlined">delete_sweep</span>
                </button>
                <button onClick={onChatSettingsClick} className="icon-btn ripple-surface" title={t('chat.settings')}>
                    <span className="material-symbols-outlined">settings</span>
                </button>
              </>
            )}
            {/* 通用操作按钮 */}
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </>
      )}
    </header>
  );
};