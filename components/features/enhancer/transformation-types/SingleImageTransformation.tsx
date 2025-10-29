'use client';

import React from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';
// 导入文件处理工具
import { dataUrlToFile } from '@/utils/fileUtils';
// 导入图片编辑器组件
import ImageEditorCanvas from '../../../ImageEditorCanvas';
// 导入 Zustand stores
import { useEnhancerStore } from '@/store/enhancerStore';
import { useUiStore } from '@/store/uiStore';
// 导入类型定义
import type { Transformation } from '@/types';

interface SingleImageTransformationProps {
  transformation: Transformation; // 当前变换效果的配置
  onOpenAssetLibrary: (config: any) => void; // 打开资产库的回调
}

const SingleImageTransformation: React.FC<SingleImageTransformationProps> = ({ transformation, onOpenAssetLibrary }) => {
    const { t } = useTranslation();
    // 从 enhancer store 中获取状态和 actions
    const { 
        primaryImageUrl, customPrompt, activeTool,
        setPrimaryImageUrl, setMaskDataUrl, setCustomPrompt, setActiveTool 
    } = useEnhancerStore();
    // 从 ui store 中获取显示提示消息的 action
    const { setToast } = useUiStore();

    // 处理图片选择
    const handlePrimaryImageSelect = (file: File, dataUrl: string) => setPrimaryImageUrl(dataUrl);

    // 从资产库选择图片后的处理逻辑
    const handleImageSelectFromLibrary = React.useCallback(async (dataUrl: string, handler: (file: File, dataUrl: string) => void) => {
        try {
            // 将 dataUrl 转换回 File 对象
            const file = await dataUrlToFile(dataUrl, `library-img-${Date.now()}.png`);
            handler(file, dataUrl);
        } catch (err) {
            console.error("Failed to load image from library:", err);
            setToast(err instanceof Error ? err.message : "Failed to load image from library.");
        }
    }, [setToast]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 如果是自定义提示类型，显示文本输入框 */}
            {transformation.prompt === 'CUSTOM' && (
                <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., A robot holding a red skateboard."
                    rows={3}
                    className="textarea"
                />
            )}
            {/* 图片编辑器，用于上传和蒙版绘制 */}
            <ImageEditorCanvas
                onImageSelect={handlePrimaryImageSelect}
                initialImageUrl={primaryImageUrl}
                onMaskChange={setMaskDataUrl}
                onClearImage={() => setPrimaryImageUrl(null)}
                isMaskToolActive={activeTool === 'mask'}
                onOpenAssetLibrary={() => onOpenAssetLibrary({
                    selectionMode: 'single',
                    onSelect: (urls: string[]) => { if (urls.length > 0) handleImageSelectFromLibrary(urls[0], handlePrimaryImageSelect); }
                })}
            />
            {/* 如果有图片，则显示蒙版工具切换按钮 */}
            {primaryImageUrl && (
                <button
                    onClick={() => setActiveTool(activeTool === 'mask' ? 'none' : 'mask')}
                    className={`btn ${activeTool === 'mask' ? 'btn-filled' : 'btn-tonal'} ripple-surface`}
                    style={{ height: '48px', flexShrink: 0, whiteSpace: 'nowrap' }}
                    title={t('imageEditor.drawMask')}
                >
                    <span className="material-symbols-outlined">{activeTool === 'mask' ? 'palette' : 'edit_square'}</span>
                    <span>{t('imageEditor.drawMask')}</span>
                </button>
            )}
        </div>
    );
};

export default SingleImageTransformation;
