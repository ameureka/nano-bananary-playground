'use client';

export const dynamic = 'force-dynamic';

import React, { useId } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTranslation } from '@/i18n/context';
import { useAssetLibraryStore } from '@/store/assetLibraryStore';
import { useEnhancerStore } from '@/store/enhancerStore';
import { downloadImage } from '@/utils/fileUtils';
import { useLayout } from '@/components/layout/LayoutContext';

interface AssetCardProps {
  src: string;
  isSelected: boolean;
  onEnhance: (src: string) => void;
  onToggleSelection: (src: string) => void;
  setPreviewImage: (src: string | null) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ src, isSelected, onEnhance, onToggleSelection, setPreviewImage }) => {
  const { t } = useTranslation();
  const uniqueId = useId();
  const isImage = src.startsWith('data:image');

  return (
    <div className={`asset-card ${isSelected ? 'selected' : ''}`}>
      <div className="asset-image-container">
        {isImage ? (
          <img src={src} alt="" className="asset-card-image" onClick={() => setPreviewImage(src)} loading="lazy"/>
        ) : (
          <video src={src} className="asset-card-image" controls preload="metadata" />
        )}
        <div className="asset-selection-overlay"></div>
        <label htmlFor={uniqueId} className="asset-checkbox-label" onClick={(e) => e.stopPropagation()}>
          <input id={uniqueId} type="checkbox" className="asset-checkbox-input" checked={isSelected} onChange={() => onToggleSelection(src)} />
          <div className="asset-checkbox-custom"><span className="material-symbols-outlined check-icon">check</span></div>
        </label>
      </div>
      <div className="asset-card-actions">
        {isImage && (
          <button className="icon-btn ripple-surface" style={{marginRight: 'auto'}} title={t('assetLibrary.actions.enhance')} onClick={() => onEnhance(src)}><span className="material-symbols-outlined">auto_fix_high</span></button>
        )}
        <button className="icon-btn ripple-surface" title={t('assetLibrary.actions.download')} onClick={() => downloadImage(src, `generated-${Date.now()}.${isImage ? 'png' : 'mp4'}`)}><span className="material-symbols-outlined">download</span></button>
      </div>
    </div>
  );
};

/**
 * 资产库页面
 * 该页面现在通过 useLayout 钩子从父布局组件获取 setPreviewImage 回调。
 */
const LibraryContent: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { setPreviewImageUrl: setPreviewImage } = useLayout();
    const assetLibrary = useAssetLibraryStore(s => s.assetLibrary);
    const selectedAssets = useAssetLibraryStore(s => s.selectedAssets);
    const toggleAssetSelection = useAssetLibraryStore(s => s.toggleAssetSelection);
    const useImageAsInput = useEnhancerStore(s => s.useImageAsInput);

    const handleLoadAsset = (src: string) => {
        useImageAsInput(src);
        router.push('/');
    };

    if (assetLibrary.length === 0) {
      return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--md-sys-color-outline)'}}>photo_library</span>
            <h2 style={{marginTop: '1rem'}}>{t('assetLibrary.emptyTitle')}</h2>
            <p>{t('assetLibrary.emptyMessage')}</p>
          </div>
      );
    }

    return (
        <div className="asset-grid">
          {assetLibrary.map((src) => (
            <AssetCard 
              key={src} 
              src={src} 
              isSelected={selectedAssets.has(src)}
              onEnhance={handleLoadAsset} 
              onToggleSelection={toggleAssetSelection}
              setPreviewImage={setPreviewImage} 
            />
          ))}
        </div>
    );
};

const LibraryPage: React.FC = () => {
    return (
        <MainLayout>
            <LibraryContent />
        </MainLayout>
    );
};

export default LibraryPage;