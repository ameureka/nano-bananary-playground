// 'use client'
import React from 'react';
// 导入类型和国际化工具
import type { GeneratedContent } from '../types';
import { useTranslation } from '../i18n/context';

interface HistoryPanelProps {
  isOpen: boolean; // 面板是否打开
  onClose: () => void; // 关闭面板的回调
  history: GeneratedContent[]; // 历史记录数组
  onUseImage: (imageUrl: string) => void; // "使用此图"按钮的回调
  onDownload: (url: string, type: string) => void; // "下载"按钮的回调
}

/**
 * 格式化时间戳为“多久以前”的字符串
 * @param timestamp - 时间戳 (ms)
 * @param t - 国际化函数
 * @returns 格式化后的字符串
 */
const formatTimeAgo = (timestamp: number, t: (key: string, subs?: any) => string): string => {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) return t('history.time.now');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t('history.time.minutesAgo', { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('history.time.hoursAgo', { count: hours });
  const days = Math.floor(hours / 24);
  return t('history.time.daysAgo', { count: days });
};

// 单个历史记录项组件
const HistoryItem: React.FC<{ item: GeneratedContent; onUseImage: (url: string) => void; onDownload: (url: string, type: string) => void; }> = ({ item, onUseImage, onDownload }) => {
    const { t } = useTranslation();
    // 动作按钮组件
    const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; isPrimary?: boolean; }> = ({ onClick, children, isPrimary }) => (
        <button 
            onClick={onClick}
            className={`btn ${isPrimary ? 'btn-filled' : 'btn-tonal'}`}
            style={{flex: 1, height: '36px'}}
        >
            {children}
        </button>
    );

    // 渲染内容的函数（图片或视频）
    // @param downloadType - 用于下载时生成更具体的文件名
    const renderContent = (url: string, type: 'video' | 'image', label?: string, downloadType?: string) => (
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        {type === 'video' ? (
          <video src={url} controls style={{borderRadius: '8px', width: '100%', objectFit: 'contain', backgroundColor: 'var(--md-sys-color-background)'}} />
        ) : (
          <img src={url} style={{borderRadius: '8px', width: '100%', objectFit: 'contain', backgroundColor: 'var(--md-sys-color-background)'}} alt={label || "生成结果"} />
        )}
        {label && <div style={{fontSize: '0.75rem', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)'}}>{label}</div>}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
            <ActionButton onClick={() => onDownload(url, downloadType || (type === 'video' ? 'video-result' : type))}>
                <span className="material-symbols-outlined">download</span>
                {t('history.save')}
            </ActionButton>
            {type !== 'video' && (
                <ActionButton onClick={() => onUseImage(url)} isPrimary>
                    <span className="material-symbols-outlined">edit</span>
                    {t('history.use')}
                </ActionButton>
            )}
        </div>
      </div>
    );
    
    return (
        <div className="card" style={{backgroundColor: 'var(--md-sys-color-surface)'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: '0.75rem'}}>
                    {item.transformationTitleKey && <h3 style={{fontSize: '0.875rem', fontWeight: 500}}>{t(item.transformationTitleKey)}</h3>}
                    {item.timestamp && <p style={{fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', whiteSpace: 'nowrap'}}>{formatTimeAgo(item.timestamp, t)}</p>}
                </div>

                {/* 使用的提示词（可折叠） */}
                {item.prompt && (
                  <details style={{fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)'}}>
                      <summary style={{cursor: 'pointer', fontWeight: 500}}>{t('history.promptUsed')}</summary>
                      <p style={{marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: '8px', wordBreak: 'break-word'}}>{item.prompt}</p>
                  </details>
                )}

                {/* 根据内容类型渲染 */}
                {item.videoUrl && renderContent(item.videoUrl, 'video')}
                {item.secondaryImageUrl && item.imageUrl && (
                    <>
                        {renderContent(item.secondaryImageUrl, 'image', t('history.lineArt'), 'line-art')}
                        {renderContent(item.imageUrl, 'image', t('history.finalResult'), 'final-result')}
                    </>
                )}
                {!item.videoUrl && !item.secondaryImageUrl && item.imageUrl && renderContent(item.imageUrl, 'image')}
            </div>
        </div>
    );
};

// 历史记录侧滑面板主组件
const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onUseImage, onDownload }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* 遮罩层 */}
      <div 
        style={{
            position: 'fixed', inset: 0, zIndex: 40, 
            backgroundColor: 'var(--md-sys-color-scrim)',
            opacity: isOpen ? 0.5 : 0,
            transition: 'opacity 300ms ease-in-out',
            pointerEvents: isOpen ? 'auto' : 'none'
        }} 
        onClick={onClose} 
      />
      
      {/* 面板内容 */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: '100%',
        maxWidth: '360px',
        backgroundColor: 'var(--md-sys-color-surface-variant)',
        borderLeft: '1px solid var(--md-sys-color-outline-variant)',
        boxShadow: 'var(--md-elevation-2)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 300ms ease-in-out',
        zIndex: 41
      }}>
        <div style={{padding: '1rem', borderBottom: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)'}}>{t('history.title')}</h2>
          <button onClick={onClose} className="icon-btn">
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{flexGrow: 1, overflowY: 'auto', padding: '1rem'}}>
          {history.length === 0 ? (
            // 历史记录为空时的提示
            <div style={{textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)', paddingTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                <span className="material-symbols-outlined" style={{fontSize: '2.5rem'}}>history</span>
                <p>{t('history.empty')}</p>
            </div>
          ) : (
            // 渲染历史记录列表
             <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {history.map((item, index) => (
                    <HistoryItem key={index} item={item} onUseImage={onUseImage} onDownload={onDownload} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
