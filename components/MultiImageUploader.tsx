'use client';

import React, { useCallback, useState } from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';

// 单个上传框的 Props
interface UploaderBoxProps {
    onImageSelect: (file: File, dataUrl: string) => void; // 选择图片后的回调
    imageUrl: string | null; // 当前显示的图片 URL
    onClear: () => void; // 清除图片的回调
    title: string; // 上传框标题
    description: string; // 上传框描述
    onOpenAssetLibrary: () => void; // 打开资产库的回调
}

// 单个上传框组件
const UploaderBox: React.FC<UploaderBoxProps> = ({ onImageSelect, imageUrl, onClear, title, description, onOpenAssetLibrary }) => {
    const [isDragging, setIsDragging] = useState(false); // 是否有文件拖拽到此区域
    const { t } = useTranslation();

    // 统一处理文件（来自选择或拖放）
    const handleFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => onImageSelect(file, e.target?.result as string);
        reader.readAsDataURL(file);
    }, [onImageSelect]);

    // 事件处理
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) handleFile(event.target.files[0]);
    };
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); event.stopPropagation(); setIsDragging(false);
        if (event.dataTransfer.files?.[0]) handleFile(event.dataTransfer.files[0]);
    }, [handleFile]);
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    
    // 为文件输入框生成唯一ID
    const inputId = `file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <h3 style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)'}}>{title}</h3>
            <div
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                style={{
                    position: 'relative', width: '100%', aspectRatio: '1/1',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 200ms ease', userSelect: 'none',
                    padding: imageUrl ? '0' : '1rem',
                    border: imageUrl ? '1px solid var(--md-sys-color-outline-variant)' : '2px dashed var(--md-sys-color-outline)',
                    outline: isDragging ? '2px dashed var(--md-sys-color-primary)' : 'none',
                    outlineOffset: '4px'
                }}
            >
                {!imageUrl ? (
                    // 未上传图片时的视图
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-surface-variant)', width: '100%', height: '100%', textAlign: 'center'}}>
                        <label htmlFor={inputId} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%', cursor: 'pointer'}}>
                            <span className="material-symbols-outlined" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>image</span>
                            <p style={{fontSize: '0.75rem', fontWeight: 500}}>{t('imageEditor.upload')}</p>
                            <p style={{fontSize: '0.75rem', padding: '0 0.5rem'}}>{description}</p>
                            <input id={inputId} type="file" onChange={handleFileChange} accept="image/*" style={{display: 'none'}} />
                        </label>
                        <div style={{padding: '0 1rem 1rem 1rem', width: '100%', marginTop: 'auto'}}>
                            <button onClick={onOpenAssetLibrary} className="btn btn-tonal" style={{height: '36px', width: '100%'}}>
                                <span className="material-symbols-outlined">photo_library</span>
                                {t('imageEditor.importFromLibrary')}
                            </button>
                        </div>
                    </div>
                ) : (
                    // 已上传图片时的视图
                    <>
                        <img src={imageUrl} alt={title} style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px'}} />
                        <button onClick={onClear} className="icon-btn" style={{position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10, backgroundColor: 'color-mix(in srgb, var(--md-sys-color-scrim), transparent 50%)', color: 'var(--md-sys-color-inverse-on-surface)'}} aria-label={`Remove ${title} image`}>
                            <span className="material-symbols-outlined">close</span>
                            <span className="state-layer"></span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};


// 包含两个上传框的父组件 Props
interface MultiImageUploaderProps {
    onPrimarySelect: (file: File, dataUrl: string) => void;
    onSecondarySelect: (file: File, dataUrl: string) => void;
    primaryImageUrl: string | null;
    secondaryImageUrl: string | null;
    onClearPrimary: () => void;
    onClearSecondary: () => void;
    primaryTitle?: string;
    primaryDescription?: string;
    secondaryTitle?: string;
    secondaryDescription?: string;
    onPrimaryOpenLibrary: () => void;
    onSecondaryOpenLibrary: () => void;
}

// 包含两个上传框的父组件
const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
    onPrimarySelect,
    onSecondarySelect,
    primaryImageUrl,
    secondaryImageUrl,
    onClearPrimary,
    onClearSecondary,
    primaryTitle,
    primaryDescription,
    secondaryTitle,
    secondaryDescription,
    onPrimaryOpenLibrary,
    onSecondaryOpenLibrary
}) => {
    const { t } = useTranslation();
    return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
            <UploaderBox
                title={primaryTitle ?? t('transformations.pose.uploader1Title')}
                description={primaryDescription ?? t('transformations.pose.uploader1Desc')}
                imageUrl={primaryImageUrl}
                onImageSelect={onPrimarySelect}
                onClear={onClearPrimary}
                onOpenAssetLibrary={onPrimaryOpenLibrary}
            />
            <UploaderBox
                title={secondaryTitle ?? t('transformations.pose.uploader2Title')}
                description={secondaryDescription ?? t('transformations.pose.uploader2Desc')}
                imageUrl={secondaryImageUrl}
                onImageSelect={onSecondarySelect}
                onClear={onClearSecondary}
                onOpenAssetLibrary={onSecondaryOpenLibrary}
            />
        </div>
    );
};

export default MultiImageUploader;
