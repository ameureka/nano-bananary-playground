'use client';

import React, { useState, useEffect } from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';

// AssetLibraryModal 组件的 Props 定义
const AssetLibraryModal: React.FC<{
  isOpen: boolean; // 模态框是否打开
  onClose: () => void; // 关闭回调
  onSelectImages: (imageUrls: string[]) => void; // 选择图片后的回调
  assetLibrary: string[]; // 资产库中的所有图片 URL
  selectionMode?: 'single' | 'multiple'; // 选择模式：单选或多选
  maxSelection?: number; // 最大可选数量
}> = ({
  isOpen,
  onClose,
  onSelectImages,
  assetLibrary,
  selectionMode = 'single',
  maxSelection = Infinity
}) => {
  const { t } = useTranslation();
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set()); // 存储选中的图片 URL
  const [isClosing, setIsClosing] = useState(false); // 是否正在关闭（用于动画）

  // 当模态框打开时，重置状态
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setSelectedImages(new Set());
    }
  }, [isOpen]);

  // 处理图片选择/取消选择
  const handleToggleSelection = (src: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (selectionMode === 'single') {
        // 单选模式下，清空之前的选择，只保留当前选择
        newSet.clear();
        newSet.add(src);
        return newSet;
      }
      // 多选模式
      if (newSet.has(src)) {
        newSet.delete(src);
      } else if (newSet.size < maxSelection) { // 检查是否达到最大选择数
        newSet.add(src);
      }
      return newSet;
    });
  };

  // 请求关闭模态框
  const handleCloseRequest = () => {
    setIsClosing(true);
  };

  // 在关闭动画结束后调用 onClose
  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target === e.currentTarget && isClosing) {
      onClose();
    }
  };

  // 处理导入按钮点击事件
  const handleImport = () => {
    onSelectImages(Array.from(selectedImages));
    handleCloseRequest();
  };
  
  // 如果模态框既不是打开状态也不是正在关闭状态，则不渲染任何内容
  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'animating-out' : 'animating-in'}`}
      onClick={handleCloseRequest}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="modal-content asset-library-modal" onClick={(e) => e.stopPropagation()}>
        <div className="asset-library-modal-header">
          <h2 style={{fontSize: '1.5rem'}}>{t('assetLibrary.modalTitle')}</h2>
          <button onClick={handleCloseRequest} className="icon-btn ripple-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="asset-library-modal-body">
            {assetLibrary.length === 0 ? (
                // 资产库为空时的提示信息
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--md-sys-color-outline)'}}>photo_library</span>
                  <h2 style={{marginTop: '1rem'}}>{t('assetLibrary.emptyTitle')}</h2>
                  <p>{t('assetLibrary.emptyMessage')}</p>
                </div>
            ) : (
                // 渲染资产库图片网格
                <div className="asset-grid">
                    {assetLibrary.filter(src => src.startsWith('data:image')).map(src => (
                        <div key={src} className={`asset-card ${selectedImages.has(src) ? 'selected' : ''}`} onClick={() => handleToggleSelection(src)} style={{cursor: 'pointer'}}>
                            <div className="asset-image-container">
                                <img src={src} alt="" className="asset-card-image" loading="lazy"/>
                                <div className="asset-selection-overlay" style={{opacity: selectedImages.has(src) ? 0.3 : 0}}></div>
                                <div className="asset-checkbox-label" style={{pointerEvents: 'none'}}>
                                    <div className="asset-checkbox-custom" style={{backgroundColor: selectedImages.has(src) ? 'var(--md-sys-color-primary)' : 'color-mix(in srgb, var(--md-sys-color-scrim) 40%, transparent)'}}>
                                        <span className="material-symbols-outlined check-icon" style={{opacity: selectedImages.has(src) ? 1 : 0, transform: selectedImages.has(src) ? 'scale(1)' : 'scale(0.5)'}}>check</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="asset-library-modal-footer">
          <button className="btn btn-text ripple-surface" onClick={handleCloseRequest}>{t('app.cancel')}</button>
          <button className="btn btn-filled ripple-surface" onClick={handleImport} disabled={selectedImages.size === 0}>
            {t('assetLibrary.importSelected', {count: selectedImages.size})}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetLibraryModal;
