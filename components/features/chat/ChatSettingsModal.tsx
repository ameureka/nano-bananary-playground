'use client';

import React, { useState, useEffect } from 'react';
// 导入国际化、类型定义和子组件
import { useTranslation } from '@/i18n/context';
import type { ImageAspectRatio } from '@/types';
import { MaterialSwitch } from '../../common/MaterialSwitch';
// 导入 Zustand stores
import { useChatStore } from '@/store/chatStore';
import { useUiStore } from '@/store/uiStore';

// 定义设置类型
type ChatSettings = ReturnType<typeof useChatStore.getState>['chatSettings'];

interface ContentProps {}

/**
 * 聊天设置面板的内容部分。
 * 它可以被用在模态框（移动端）或侧边面板（桌面端）。
 */
const ChatSettingsContent: React.FC<ContentProps> = () => {
    const { t } = useTranslation();
    const chatSettings = useChatStore(s => s.chatSettings);
    const setChatSettings = useChatStore(s => s.setChatSettings);
    const isAdvancedMode = useUiStore(s => s.isAdvancedMode);

    // 通用的设置变更处理函数
    const handleSettingChange = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
        setChatSettings({ ...chatSettings, [key]: value });
    };

    // 确保滑块在加载时也能正确显示填充效果
    useEffect(() => {
        const sliders = document.querySelectorAll('#chat-settings-content .md-slider');
        sliders.forEach(slider => {
            const s = slider as HTMLInputElement;
            const min = Number(s.min || 0);
            const max = Number(s.max || 100);
            const value = Number(s.value);
            const percent = ((value - min) / (max - min)) * 100;
            s.style.setProperty('--slider-percent', `${percent}%`);
        });
    }, [chatSettings]); // 当设置变化时重新计算

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ChatSettings) => {
        const value = Number(e.target.value);
        handleSettingChange(key as any, value);
    };

    return (
        <div id="chat-settings-content">
            {/* 生成图片数量 */}
            <div className="settings-group">
                <label htmlFor="chat-num-images" style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('chat.numImages')}</label>
                <input
                    id="chat-num-images"
                    type="range"
                    min="1"
                    max="4"
                    value={chatSettings.numImages}
                    onChange={(e) => handleSliderChange(e, 'numImages')}
                    className="md-slider"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center' }}>{chatSettings.numImages}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{t('chat.numImagesDescription')}</p>
            </div>

             {/* 图片宽高比 */}
            <div className="settings-group">
                <h3 style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('chat.aspectRatio')}</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '0.5rem'}}>
                    {(['Auto', '1:1', '16:9', '9:16', '4:3', '3:4'] as const).map(ratio => (
                        <button
                            key={ratio}
                            onClick={() => handleSettingChange('aspectRatio', ratio)}
                            className={`btn ${chatSettings.aspectRatio === ratio ? 'btn-filled' : 'btn-tonal'} ripple-surface`}
                            style={{padding: '0 0.5rem', height: '36px', fontSize: '0.75rem'}}
                        >
                        {ratio === 'Auto' ? t('chat.aspectRatioAuto') : ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI 预处理 */}
            <div className="settings-group">
                <MaterialSwitch
                    label={t('chat.aiPreprocessing')}
                    checked={chatSettings.isAiPreprocessing}
                    onChange={(checked) => handleSettingChange('isAiPreprocessing', checked)}
                    description={t('chat.aiPreprocessingDescription')}
                />
                {chatSettings.isAiPreprocessing && (
                    <div className="animate-fade-in-fast" style={{paddingLeft: '1rem', borderLeft: '2px solid var(--md-sys-color-outline-variant)', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                         <MaterialSwitch
                            label={t('chat.sendImageWithPreprocessing')}
                            checked={chatSettings.sendImageWithPreprocessing}
                            onChange={(checked) => handleSettingChange('sendImageWithPreprocessing', checked)}
                            description={t('chat.sendImageWithPreprocessingDescription')}
                        />
                         <MaterialSwitch
                            label={t('chat.creativeDiversification')}
                            checked={chatSettings.creativeDiversification}
                            onChange={(checked) => handleSettingChange('creativeDiversification', checked)}
                            description={t('chat.creativeDiversificationDescription')}
                        />
                    </div>
                )}
            </div>
            
            {/* 对话历史长度 (仅进阶模式) */}
            {isAdvancedMode && (
                <div className="settings-group animate-fade-in-fast">
                    <label htmlFor="history-length" style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('chat.historyLength')}</label>
                    <input
                        id="history-length"
                        type="range"
                        min="0"
                        max="20"
                        step="2"
                        value={chatSettings.historyLength}
                        onChange={(e) => handleSliderChange(e, 'historyLength')}
                        className="md-slider"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center' }}>{chatSettings.historyLength}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{t('chat.historyDescription')}</p>
                </div>
            )}

            {/* 重试次数 (仅进阶模式) */}
            {isAdvancedMode && (
                 <div className="settings-group animate-fade-in-fast">
                    <label htmlFor="retry-count" style={{ fontWeight: 500, fontSize: '0.875rem' }}>{t('chat.retryCount')}</label>
                    <input
                        id="retry-count"
                        type="range"
                        min="0"
                        max="5"
                        value={chatSettings.retryCount}
                        onChange={(e) => handleSliderChange(e, 'retryCount')}
                        className="md-slider"
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center' }}>{chatSettings.retryCount}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{t('chat.retryCountDescription')}</p>
                </div>
            )}
        </div>
    );
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 使用复合组件模式，将 Content 作为 Modal 的一个属性
type ChatSettingsModalComponent = React.FC<ModalProps> & {
    Content: React.FC<ContentProps>;
};

const ChatSettingsModal: ChatSettingsModalComponent = ({ isOpen, onClose }) => {
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
              <h2 style={{ fontSize: '1.5rem' }}>{t('chat.settings')}</h2>
              <button onClick={handleCloseRequest} className="icon-btn ripple-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <ChatSettingsContent />
            </div>
          </div>
        </div>
    );
}

// 将内容组件挂载到模态框组件上
ChatSettingsModal.Content = ChatSettingsContent;

export default ChatSettingsModal;
