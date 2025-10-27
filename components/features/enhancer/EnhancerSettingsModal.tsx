// 'use client'
import React, { useState, useEffect } from 'react';
// 导入国际化和 Zustand stores
import { useTranslation } from '../../../i18n/context';
import { useEnhancerStore } from '../../../store/enhancerStore';
import { useUiStore } from '../../../store/uiStore';
import { useLogStore } from '../../../store/logStore';

// 定义设置类型
type EnhancerSettings = ReturnType<typeof useEnhancerStore.getState>['enhancerSettings'];

interface ContentProps {}

/**
 * 增强器设置面板的内容部分。
 * 可被用在模态框（移动端）或侧边面板（桌面端）。
 */
const EnhancerSettingsContent: React.FC<ContentProps> = () => {
    const { t } = useTranslation();
    const enhancerSettings = useEnhancerStore(s => s.enhancerSettings);
    const setEnhancerSettings = useEnhancerStore(s => s.setEnhancerSettings);
    const selectedTransformation = useEnhancerStore(s => s.selectedTransformation);
    const isAdvancedMode = useUiStore(s => s.isAdvancedMode);
    const { logs, downloadLogs, clearLogs } = useLogStore();

    // 通用的设置变更处理函数
    const handleSettingChange = <K extends keyof EnhancerSettings>(key: K, value: EnhancerSettings[K]) => {
        setEnhancerSettings({ ...enhancerSettings, [key]: value });
    };

    // 确保滑块在加载时也能正确显示填充效果
    useEffect(() => {
        const sliders = document.querySelectorAll('#enhancer-settings-content .md-slider');
        sliders.forEach(slider => {
            const s = slider as HTMLInputElement;
            const min = Number(s.min || 0);
            const max = Number(s.max || 100);
            const value = Number(s.value);
            const percent = ((value - min) / (max - min)) * 100;
            s.style.setProperty('--slider-percent', `${percent}%`);
        });
    }, [enhancerSettings]); // 当设置变化时重新计算

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof EnhancerSettings) => {
        const value = Number(e.target.value);
        handleSettingChange(key as any, value);
    };

    // 判断当前效果是否禁用了“生成数量”设置
    const isNumImagesDisabled = selectedTransformation?.isMultiStepVideo || selectedTransformation?.maxImages === 4;

    return (
        <div id="enhancer-settings-content">
            {/* 生成图片数量 */}
            <div className="settings-group">
                <label htmlFor="enhancer-num-images" style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('enhancer.numImages')}</label>
                <input
                    id="enhancer-num-images"
                    type="range"
                    min="1"
                    max="4"
                    value={enhancerSettings.numImages}
                    onChange={(e) => handleSliderChange(e, 'numImages')}
                    className="md-slider"
                    disabled={isNumImagesDisabled}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center' }}>
                    {isNumImagesDisabled ? t('enhancer.numImagesDisabled') : enhancerSettings.numImages}
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
                    {t('enhancer.numImagesDescription')}
                </p>
            </div>

            {/* 重试次数 (仅进阶模式) */}
            {isAdvancedMode && (
                 <div className="settings-group animate-fade-in-fast">
                    <label htmlFor="retry-count" style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('enhancer.retryCount')}</label>
                    <input
                        id="retry-count"
                        type="range"
                        min="0"
                        max="5"
                        value={enhancerSettings.retryCount}
                        onChange={(e) => handleSliderChange(e, 'retryCount')}
                        className="md-slider"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center' }}>{enhancerSettings.retryCount}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{t('enhancer.retryCountDescription')}</p>
                </div>
            )}
            
            {/* 开发者日志 (仅进阶模式) */}
            {isAdvancedMode && (
                 <div className="settings-group animate-fade-in-fast">
                    <h3 style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('enhancer.devLogsTitle')}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
                        {`Logs captured: ${logs.length}`}
                    </p>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
                        <button onClick={downloadLogs} className="btn btn-tonal" disabled={logs.length === 0}>
                            <span className="material-symbols-outlined">download</span>
                            {t('enhancer.downloadLogs')}
                        </button>
                         <button onClick={() => {
                            if (confirm(t('enhancer.clearLogsConfirm'))) {
                                clearLogs();
                            }
                         }} className="btn btn-tonal" disabled={logs.length === 0}>
                            <span className="material-symbols-outlined">delete</span>
                            {t('enhancer.clearLogs')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EnhancerSettingsModalComponent = React.FC<ModalProps> & {
    Content: React.FC<ContentProps>;
};

const EnhancerSettingsModal: EnhancerSettingsModalComponent = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) setIsClosing(false);
    }, [isOpen]);

    const handleCloseRequest = () => setIsClosing(true);

    const handleAnimationEnd = (e: React.AnimationEvent) => {
        if (e.target === e.currentTarget && isClosing) {
            onClose();
        }
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div 
          className={`modal-overlay ${isClosing ? 'animating-out' : 'animating-in'}`}
          onClick={handleCloseRequest}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{t('enhancer.settings')}</h2>
              <button onClick={handleCloseRequest} className="icon-btn ripple-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <EnhancerSettingsContent />
            </div>
          </div>
        </div>
    );
}

// 将内容组件挂载到模态框组件上
EnhancerSettingsModal.Content = EnhancerSettingsContent;

export default EnhancerSettingsModal;
