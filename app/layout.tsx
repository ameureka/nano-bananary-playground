// 'use client'
import React, { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TRANSFORMATIONS } from '../constants';
import type { View } from '../types';
import { useTranslation } from '../i18n/context';
import { downloadImage } from '../utils/fileUtils';
import { useUiStore } from '../store/uiStore';
import { useAssetLibraryStore } from '../store/assetLibraryStore';
import { useChatStore } from '../store/chatStore';
import { useEnhancerStore } from '../store/enhancerStore';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { TopAppBar } from '../components/layout/TopAppBar';
import ImagePreviewModal from '../components/common/ImagePreviewModal';
import Toast from '../components/common/Toast';
import HistoryPanel from '../components/HistoryPanel';
import AssetLibraryModal from '../components/features/library/AssetLibraryModal';
import ChatSettingsModal from '../components/features/chat/ChatSettingsModal';
import EnhancerSettingsModal from '../components/features/enhancer/EnhancerSettingsModal';
import { LayoutContext } from '../components/layout/LayoutContext';

/**
 * MainLayout 组件
 * 这个组件现在是应用的 "壳"，包含了所有共享的UI元素（侧边栏、顶部栏等），
 * 并管理着全局的UI状态和交互逻辑。
 * 它通过 LayoutContext 将需要传递给页面的函数暴露出去。
 */
export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 840);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isAssetLibraryModalOpen, setIsAssetLibraryModalOpen] = useState(false);
  const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
  const [isEnhancerSettingsOpen, setIsEnhancerSettingsOpen] = useState(false);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  
  const [assetLibraryModalConfig, setAssetLibraryModalConfig] = useState<{
      selectionMode: 'single' | 'multiple';
      onSelect: (urls: string[]) => void;
      maxSelection?: number;
  }>({
      selectionMode: 'single',
      onSelect: () => {},
      maxSelection: 1,
  });
  
  const isAdvancedMode = useUiStore(s => s.isAdvancedMode);
  const toastMessage = useUiStore(s => s.toastMessage);
  const setToast = useUiStore(s => s.setToast);
  const setIsAdvancedMode = useUiStore(s => s.setIsAdvancedMode);
  
  const assetLibrary = useAssetLibraryStore(s => s.assetLibrary);
  const isLibraryDragging = useAssetLibraryStore(s => s.isLibraryDragging);
  const addImagesToLibrary = useAssetLibraryStore(s => s.addImagesToLibrary);
  const setIsLibraryDragging = useAssetLibraryStore(s => s.setIsLibraryDragging);
  
  const addChatInputImages = useChatStore(s => s.addChatInputImages);
  
  const selectedTransformation = useEnhancerStore(s => s.selectedTransformation);
  const enhancerHistory = useEnhancerStore(s => s.enhancerHistory);
  const setSelectedTransformation = useEnhancerStore(s => s.setSelectedTransformation);
  const setPrimaryImageUrl = useEnhancerStore(s => s.setPrimaryImageUrl);
  const useImageAsInput = useEnhancerStore(s => s.useImageAsInput);
  
  const getCurrentView = (): View => {
    switch (location.pathname) {
      case '/chat': return 'chat';
      case '/library': return 'library';
      default: return 'enhancer';
    }
  };
  const currentView = getCurrentView();
  const isEnhancerDetailView = currentView === 'enhancer' && !!selectedTransformation;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 840);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [homepageClickCount, setHomepageClickCount] = useState(0);
  const resetHomepageClickCount = useCallback(() => {
    if (homepageClickCount > 0 && !isAdvancedMode) {
        setHomepageClickCount(0);
    }
  }, [homepageClickCount, isAdvancedMode]);

  const handleHomepageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdvancedMode) return;
    const newCount = homepageClickCount + 1;
    setHomepageClickCount(newCount);
    if (newCount >= 5) {
      setIsAdvancedMode(true);
      setToast(t('app.advancedMode.activated'));
    } else if (newCount >= 2) {
      const clicksRemaining = 5 - newCount;
      setToast(t('app.advancedMode.clicksRemaining', { count: clicksRemaining }));
    }
  }, [homepageClickCount, isAdvancedMode, t, setIsAdvancedMode, setToast]);
  
  const openAssetLibraryModal = useCallback((config: {
      selectionMode: 'single' | 'multiple';
      onSelect: (urls: string[]) => void;
      maxSelection?: number;
  }) => {
      setAssetLibraryModalConfig({
          selectionMode: config.selectionMode,
          onSelect: config.onSelect,
          maxSelection: config.maxSelection ?? (config.selectionMode === 'single' ? 1 : Infinity)
      });
      setIsAssetLibraryModalOpen(true);
  }, []);

  const allPromptsRef = useRef<string>('');
  useEffect(() => {
      allPromptsRef.current = TRANSFORMATIONS
          .flatMap(category => category.items || [])
          .filter(item => item.prompt && item.prompt !== 'CUSTOM')
          .map(item => `${t(item.titleKey)}: ${item.prompt}`)
          .join('\n\n');
  }, [t]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleAddFilesToLibrary = useCallback(async (files: FileList) => {
      const results = await Promise.all(Array.from(files).map(file => new Promise<string | null>((resolve) => {
          if (!file.type.startsWith('image/')) return resolve(null);
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
      })));
      addImagesToLibrary(results);
      if (results.some(r => r !== null) && currentView !== 'library') navigate('/library');
  }, [currentView, navigate, addImagesToLibrary]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) { e.target.value = ''; return; }
    if (currentView === 'enhancer' && files.length === 1 && files[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) setPrimaryImageUrl(event.target.result as string);
        };
        reader.readAsDataURL(files[0]);
    } else {
      handleAddFilesToLibrary(files);
    }
    e.target.value = '';
  }, [currentView, handleAddFilesToLibrary, setPrimaryImageUrl]);

  const contextValue = {
    allPrompts: allPromptsRef.current,
    setPreviewImageUrl,
    openAssetLibraryModal,
    addChatInputImages,
    onAttachImage: () => chatFileInputRef.current?.click(),
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="app-container" onClick={resetHomepageClickCount}>
        <Sidebar 
          currentView={currentView} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          onHomepageClick={handleHomepageClick}
        />
        <main 
          className="main-content"
          onDragOver={(e) => { if (currentView === 'library') { e.preventDefault(); e.stopPropagation(); setIsLibraryDragging(true); } }}
          onDragLeave={(e) => { if (currentView === 'library') { e.preventDefault(); e.stopPropagation(); setIsLibraryDragging(false); } }}
          onDrop={(e) => { if (currentView === 'library') { e.preventDefault(); e.stopPropagation(); setIsLibraryDragging(false); if (e.dataTransfer.files?.length) handleAddFilesToLibrary(e.dataTransfer.files); } }}
        >
          <TopAppBar 
              onUploadClick={handleUploadClick} 
              currentView={currentView}
              showBackButton={isEnhancerDetailView}
              onBackClick={() => setSelectedTransformation(null)}
              onChatSettingsClick={() => setIsChatSettingsOpen(true)}
              onEnhancerSettingsClick={() => setIsEnhancerSettingsOpen(true)}
              onHistoryClick={() => setIsHistoryPanelOpen(true)}
          />
          <div className="view-wrapper">
            <div className="view-container">
              {children} {/* 页面内容在这里渲染 */}
              {currentView === 'library' && isLibraryDragging && (
                  <div className="library-drop-overlay">
                      <span className="material-symbols-outlined">upload</span>
                      <p>{t('assetLibrary.dropToAdd')}</p>
                  </div>
              )}
            </div>
            {currentView === 'chat' && isDesktop && (
              <aside className={`chat-settings-panel ${isChatSettingsOpen ? '' : 'hidden'}`}>
                  <div className="settings-panel-header">
                       <h2 style={{fontSize: '1.25rem', fontWeight: 500, whiteSpace: 'nowrap'}}>{t('chat.settings')}</h2>
                      <button onClick={() => setIsChatSettingsOpen(false)} className="icon-btn ripple-surface"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="settings-panel-content">
                    <ChatSettingsModal.Content />
                  </div>
              </aside>
            )}
            {currentView === 'enhancer' && isDesktop && (
              <aside className={`chat-settings-panel ${isEnhancerSettingsOpen ? '' : 'hidden'}`}>
                   <div className="settings-panel-header">
                       <h2 style={{fontSize: '1.25rem', fontWeight: 500, whiteSpace: 'nowrap'}}>{t('enhancer.settings')}</h2>
                      <button onClick={() => setIsEnhancerSettingsOpen(false)} className="icon-btn ripple-surface"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="settings-panel-content">
                    <EnhancerSettingsModal.Content />
                  </div>
              </aside>
            )}
          </div>
        </main>
        
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept="image/*" multiple />
        <input type="file" ref={chatFileInputRef} onChange={(e) => {
            if (!e.target.files) return;
            Promise.all(Array.from(e.target.files).map(file => new Promise<string>(res => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => res(event.target?.result as string);
                    reader.onerror = () => res('');
                    reader.readAsDataURL(file);
                } else res('');
            }))).then(imgs => addChatInputImages(imgs.filter(i => i)));
            e.target.value = '';
        }} style={{ display: 'none' }} accept="image/*" multiple/>
        
        <ImagePreviewModal src={previewImageUrl} onClose={() => setPreviewImageUrl(null)}/>
        <AssetLibraryModal
          isOpen={isAssetLibraryModalOpen}
          onClose={() => setIsAssetLibraryModalOpen(false)}
          assetLibrary={assetLibrary}
          selectionMode={assetLibraryModalConfig.selectionMode}
          onSelectImages={assetLibraryModalConfig.onSelect}
          maxSelection={assetLibraryModalConfig.maxSelection}
        />
        <BottomNav currentView={currentView} onHomepageClick={handleHomepageClick} />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToast(null)} />}
        {!isDesktop && (
          <>
              <ChatSettingsModal 
                isOpen={isChatSettingsOpen}
                onClose={() => setIsChatSettingsOpen(false)}
              />
              <EnhancerSettingsModal
                isOpen={isEnhancerSettingsOpen}
                onClose={() => setIsEnhancerSettingsOpen(false)}
              />
          </>
        )}
         <HistoryPanel
          isOpen={isHistoryPanelOpen}
          onClose={() => setIsHistoryPanelOpen(false)}
          history={enhancerHistory}
          onUseImage={(imageUrl) => {
            useImageAsInput(imageUrl);
            setIsHistoryPanelOpen(false);
            navigate('/');
          }}
          onDownload={(url, type) => {
              const extension = type === 'video-result' ? 'mp4' : 'png';
              downloadImage(url, `${type.replace(/\s+/g, '-')}-${Date.now()}.${extension}`);
          }}
        />
      </div>
    </LayoutContext.Provider>
  );
};