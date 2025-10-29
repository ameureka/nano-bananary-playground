// 'use client'
import React, { useCallback, useState } from 'react';
// 导入国际化钩子
import { useTranslation } from '../i18n/context';

interface MultiImageGridUploaderProps {
    imageUrls: string[]; // 当前已上传的图片 URL 数组
    onImagesChange: (dataUrls: string[]) => void; // 图片数组变化时的回调
    maxImages: number; // 允许上传的最大图片数量
    onOpenAssetLibrary: () => void; // 打开资产库的回调
}

const MultiImageGridUploader: React.FC<MultiImageGridUploaderProps> = ({ imageUrls, onImagesChange, maxImages, onOpenAssetLibrary }) => {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false); // 是否有文件拖拽到此区域

    // 处理文件列表（来自选择或拖放）
    const handleFiles = useCallback((files: FileList) => {
        const newUrls: string[] = [];
        // 计算还能上传多少张图片
        const filesToProcess = Array.from(files).slice(0, maxImages - imageUrls.length);

        if (filesToProcess.length === 0) return;

        let processedCount = 0;
        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newUrls.push(e.target?.result as string);
                processedCount++;
                // 当所有文件都处理完毕后，更新状态
                if (processedCount === filesToProcess.length) {
                    const allUrls = [...imageUrls, ...newUrls];
                    onImagesChange(allUrls);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [imageUrls, maxImages, onImagesChange]);

    // 事件处理
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) handleFiles(event.target.files);
    };
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); event.stopPropagation(); setIsDragging(false);
        if (event.dataTransfer.files) handleFiles(event.dataTransfer.files);
    }, [handleFiles]);
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

    // 移除指定索引的图片
    const removeImage = (indexToRemove: number) => {
        const newUrls = imageUrls.filter((_, index) => index !== indexToRemove);
        onImagesChange(newUrls);
    };
    
    const inputId = `multi-image-upload`;

    return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
            {/* 渲染已上传的图片 */}
            {imageUrls.map((url, index) => (
                <div key={index} className="image-container" style={{position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: 'var(--md-sys-color-surface)', borderRadius: '12px', overflow: 'hidden'}}>
                    <img src={url} alt={`Uploaded image ${index + 1}`} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    <button 
                        onClick={() => removeImage(index)} 
                        className="icon-btn"
                        style={{
                            position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10,
                            backgroundColor: 'color-mix(in srgb, var(--md-sys-color-scrim), transparent 50%)', 
                            color: 'var(--md-sys-color-inverse-on-surface)',
                            opacity: 0, // 默认隐藏
                            transition: 'opacity 200ms ease'
                        }}
                        aria-label={`Remove image ${index + 1}`}
                    >
                       <span className="material-symbols-outlined" style={{fontSize: '1.25rem'}}>close</span>
                    </button>
                    {/* CSS to show button on hover */}
                    <style>{`.image-container:hover .icon-btn { opacity: 1; }`}</style>
                </div>
            ))}

            {/* 如果未达到最大数量，显示上传框 */}
            {imageUrls.length < maxImages && (
                 <div
                    onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                    style={{
                        position: 'relative', width: '100%', aspectRatio: '1/1',
                        backgroundColor: 'var(--md-sys-color-surface)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 200ms ease',
                        border: '2px dashed var(--md-sys-color-outline)',
                        outline: isDragging ? '2px dashed var(--md-sys-color-primary)' : 'none',
                        outlineOffset: '4px',
                        padding: '1rem',
                    }}
                >
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-surface-variant)', width: '100%', height: '100%', textAlign: 'center'}}>
                        <label htmlFor={inputId} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%', cursor: 'pointer'}}>
                            <span className="material-symbols-outlined" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>add_photo_alternate</span>
                            <p style={{fontSize: '0.875rem', fontWeight: 500}}>{t('imageEditor.upload')}</p>
                            <p style={{fontSize: '0.75rem', padding: '0 0.5rem'}}>{`(${imageUrls.length}/${maxImages}) ${t('imageEditor.dragAndDrop')}`}</p>
                            <input id={inputId} type="file" onChange={handleFileChange} accept="image/*" multiple style={{display: 'none'}} />
                        </label>
                        <div style={{paddingTop: '1rem', width: '100%', marginTop: 'auto'}}>
                            <button onClick={(e) => { e.preventDefault(); onOpenAssetLibrary(); }} className="btn btn-tonal" style={{height: '36px', width: '100%'}}>
                                <span className="material-symbols-outlined">photo_library</span>
                                {t('imageEditor.importFromLibrary')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiImageGridUploader;
