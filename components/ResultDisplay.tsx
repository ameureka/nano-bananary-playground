// 'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';
// 导入类型定义
import type { GeneratedContent } from '../types';
// 导入国际化钩子
import { useTranslation } from '../i18n/context';
// 导入文件下载工具函数
import { downloadImage } from '../utils/fileUtils';

interface ResultDisplayProps {
  content: GeneratedContent; // 显示的内容（图片、视频、文本等）
  onImageClick: (imageUrl: string) => void; // 图片点击事件处理函数
  originalImageUrl: string | null; // 原始输入图片的 URL，用于对比
}

// 定义单图结果的视图模式
type ViewMode = 'result' | 'side-by-side' | 'slider';
// 定义两步操作结果的视图模式
type TwoStepViewMode = 'result' | 'grid' | 'slider';
// 定义滑块对比中可选的图片类型
type ImageSelection = 'Original' | 'Line Art' | 'Final Result';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onImageClick, originalImageUrl }) => {
  const { t } = useTranslation();
  // 状态管理
  const [viewMode, setViewMode] = useState<ViewMode>('slider'); // 单图结果的视图模式
  const [twoStepViewMode, setTwoStepViewMode] = useState<TwoStepViewMode>('slider'); // 两步结果的视图模式
  
  const sliderContainerRef = useRef<HTMLDivElement>(null); // 滑块容器的引用
  const [sliderPosition, setSliderPosition] = useState(50); // 滑块位置（百分比）
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖动滑块
  const [containerWidth, setContainerWidth] = useState(0); // 容器宽度，用于滑块计算
  
  // 两步结果滑块的左右图像选择
  const [sliderLeft, setSliderLeft] = useState<ImageSelection>('Original');
  const [sliderRight, setSliderRight] = useState<ImageSelection>('Final Result');

  // 当新内容生成时，重置视图模式
  useEffect(() => {
    if (content.imageUrl && originalImageUrl) {
      // 如果有可对比的图片，默认使用滑块视图
      if (content.secondaryImageUrl) {
        setTwoStepViewMode('slider');
      } else {
        setViewMode('slider');
      }
    } else {
      // 否则回退到结果视图
      if (content.secondaryImageUrl) {
        setTwoStepViewMode('result');
      } else {
        setViewMode('result');
      }
    }
  }, [content, originalImageUrl]);
  
  // 监听容器大小变化，更新容器宽度状态
  useEffect(() => {
    if (!sliderContainerRef.current) return;

    const observer = new ResizeObserver(entries => {
        if (entries[0]) {
            setContainerWidth(entries[0].contentRect.width);
        }
    });
    const currentRef = sliderContainerRef.current;
    if (currentRef) {
        observer.observe(currentRef);
        setContainerWidth(currentRef.getBoundingClientRect().width);
    }
    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, [viewMode, twoStepViewMode]);

  // 处理滑块拖动
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, [isDragging]);

  // 开始拖动
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
        e.preventDefault(); // 在移动端防止页面滚动
    }
    setIsDragging(true);
  }, []);

  // 结束拖动
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 添加全局事件监听器来处理拖动过程
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault(); // 拖动时防止滚动
        handleDragMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      window.addEventListener('touchcancel', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // 视图切换按钮组件
  const ViewSwitcherButton: React.FC<{ mode: TwoStepViewMode | ViewMode; currentMode: TwoStepViewMode | ViewMode; onClick: () => void; children: React.ReactNode }> = ({ mode, currentMode, onClick, children }) => (
      <button
        onClick={onClick}
        className={`btn ${currentMode === mode ? 'btn-filled' : 'btn-text'} ripple-surface`}
        style={{height: '32px', padding: '0 12px', fontSize: '0.75rem', borderRadius: '16px'}}
      >
        {children}
      </button>
  );

  // 视频结果的特殊视图
  if (content.videoUrl) {
    return (
      <div className="animate-fade-in" style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
        <div style={{width: '100%', flexGrow: 1, position: 'relative', backgroundColor: 'var(--md-sys-color-surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <video src={content.videoUrl} controls autoPlay loop muted style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
        </div>
      </div>
    );
  }

  // 两步操作结果的特殊视图（例如：线稿 -> 上色）
  if (content.secondaryImageUrl && content.imageUrl && originalImageUrl) {
    const imageMap: Record<ImageSelection, string> = { 'Original': originalImageUrl, 'Line Art': content.secondaryImageUrl, 'Final Result': content.imageUrl };
    const imageOptions: ImageSelection[] = ['Original', 'Line Art', 'Final Result'];
    const leftImageSrc = imageMap[sliderLeft];
    const rightImageSrc = imageMap[sliderRight];
    
    const twoStepViewModes: TwoStepViewMode[] = ['result', 'grid', 'slider'];

    return (
       <div className="animate-fade-in" style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', flexShrink: 0}}>
            <div style={{padding: '4px', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                {twoStepViewModes.map(mode => (
                    <ViewSwitcherButton key={mode} mode={mode} currentMode={twoStepViewMode} onClick={() => setTwoStepViewMode(mode)}>
                        {t(`resultDisplay.viewModes.${mode}`)}
                    </ViewSwitcherButton>
                ))}
            </div>
        </div>
        
        {/* '结果' 视图: 只显示中间和最终结果 */}
        {twoStepViewMode === 'result' && (
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexGrow: 1}}>
                <div style={{width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', flexGrow: 1}}>
                {[
                    { src: content.secondaryImageUrl, label: t('resultDisplay.labels.lineArt') },
                    { src: content.imageUrl, label: t('resultDisplay.labels.finalResult') },
                ].map(({ src, label }) => (
                    <div key={label} style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'var(--md-sys-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '4px', aspectRatio: '1/1'}}>
                      <img src={src!} alt={label} onClick={() => onImageClick(src!)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer'}} />
                      <div style={{position: 'absolute', bottom: '4px', right: '4px', fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>{label}</div>
                    </div>
                ))}
                </div>
            </div>
        )}
        {/* '网格' 视图: 显示原始、中间和最终结果 */}
        {twoStepViewMode === 'grid' && (
             <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexGrow: 1}}>
                <div style={{width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', flexGrow: 1}}>
                {[
                    { src: originalImageUrl, label: t('resultDisplay.labels.original') },
                    { src: content.secondaryImageUrl, label: t('resultDisplay.labels.lineArt') },
                    { src: content.imageUrl, label: t('resultDisplay.labels.finalResult') },
                ].map(({ src, label }) => (
                    <div key={label} style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'var(--md-sys-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '4px', aspectRatio: '1/1'}}>
                      <img src={src!} alt={label} onClick={() => onImageClick(src!)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer'}} />
                      <div style={{position: 'absolute', bottom: '4px', right: '4px', fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>{label}</div>
                    </div>
                ))}
                </div>
            </div>
        )}
        {/* '滑块' 视图: 可选择对比任意两个步骤 */}
        {twoStepViewMode === 'slider' && (
          <div style={{width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', flexShrink: 0}}>
                <select value={sliderLeft} onChange={e => setSliderLeft(e.target.value as ImageSelection)} className="btn btn-outlined" style={{height: '32px', padding: '0 8px'}}>
                    {imageOptions.map(opt => <option key={`left-${opt}`} value={opt}>{t(`resultDisplay.labels.${opt.toLowerCase().replace(/\s/g, '')}`)}</option>)}
                </select>
                <span>{t('resultDisplay.sliderPicker.vs')}</span>
                <select value={sliderRight} onChange={e => setSliderRight(e.target.value as ImageSelection)} className="btn btn-outlined" style={{height: '32px', padding: '0 8px'}}>
                    {imageOptions.map(opt => <option key={`right-${opt}`} value={opt}>{t(`resultDisplay.labels.${opt.toLowerCase().replace(/\s/g, '')}`)}</option>)}
                </select>
            </div>
            <div
                ref={sliderContainerRef}
                style={{ touchAction: 'none', position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none', backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline-variant)'}}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                {/* 右侧（底层）图片 */}
                <div style={{position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
                    <img key={rightImageSrc} src={rightImageSrc} alt={sliderRight} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                </div>
                {/* 左侧（上层）图片，通过设置宽度来裁剪显示 */}
                <div style={{position: 'absolute', inset: 0, zIndex: 20, overflow: 'hidden', pointerEvents: 'none', width: `${sliderPosition}%` }}>
                    <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${containerWidth}px`}}>
                        <img key={leftImageSrc} src={leftImageSrc} alt={sliderLeft} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                    </div>
                </div>
                {/* 滑块控制器 */}
                <div style={{position: 'absolute', top: 0, height: '100%', width: '2px', backgroundColor: 'var(--md-sys-color-inverse-surface)', cursor: 'ew-resize', pointerEvents: 'none', zIndex: 30, left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}>
                    <div style={{position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-inverse-surface)', border: '2px solid var(--md-sys-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--md-elevation-2)'}}>
                       <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-surface)'}}>compare_arrows</span>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 常规的单步结果对比视图
  if (content.imageUrl && originalImageUrl) {
    const viewModes: ViewMode[] = ['result', 'side-by-side', 'slider'];
    
    return (
       <div className="animate-fade-in" style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center', flexShrink: 0}}>
            <div style={{padding: '4px', backgroundColor: 'var(--md-sys-color-surface-variant)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                {viewModes.map(mode => (
                    <ViewSwitcherButton key={mode} mode={mode} currentMode={viewMode} onClick={() => setViewMode(mode)}>
                        {t(`resultDisplay.viewModes.${mode.replace(/-/g, '')}`)}
                    </ViewSwitcherButton>
                ))}
            </div>
        </div>
        
        {viewMode === 'result' && (
             <div style={{width: '100%', flexGrow: 1, position: 'relative', backgroundColor: 'var(--md-sys-color-surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={content.imageUrl} alt={t('resultDisplay.labels.generated')} onClick={() => onImageClick(content.imageUrl!)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer'}} />
             </div>
        )}
        {viewMode === 'side-by-side' && (
            <div style={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flexGrow: 1}}>
                {[
                    { src: originalImageUrl, label: t('resultDisplay.labels.original') },
                    { src: content.imageUrl, label: t('resultDisplay.labels.generated') },
                ].map(({ src, label }) => (
                    <div key={label} style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'var(--md-sys-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '4px'}}>
                        <img src={src} alt={label} onClick={() => onImageClick(src!)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer'}} />
                        <div style={{position: 'absolute', bottom: '4px', right: '4px', fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>{label}</div>
                    </div>
                ))}
            </div>
        )}
        {viewMode === 'slider' && (
            <div
                ref={sliderContainerRef}
                style={{ touchAction: 'none', position: 'relative', width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', cursor: 'ew-resize', userSelect: 'none', backgroundColor: 'var(--md-sys-color-surface)', border: '1px solid var(--md-sys-color-outline-variant)'}}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                <div style={{position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
                    <img key={content.imageUrl} src={content.imageUrl} alt={t('resultDisplay.labels.generated')} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                </div>
                
                <div style={{position: 'absolute', inset: 0, zIndex: 20, overflow: 'hidden', pointerEvents: 'none', width: `${sliderPosition}%`}}>
                    <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${containerWidth}px`}}>
                        <img key={originalImageUrl} src={originalImageUrl!} alt={t('resultDisplay.labels.original')} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                    </div>
                </div>

                <div style={{position: 'absolute', top: 0, height: '100%', width: '2px', backgroundColor: 'var(--md-sys-color-inverse-surface)', cursor: 'ew-resize', pointerEvents: 'none', zIndex: 30, left: `${sliderPosition}%`, transform: 'translateX(-50%)'}}>
                    <div style={{position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-inverse-surface)', border: '2px solid var(--md-sys-color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--md-elevation-2)'}}>
                       <span className="material-symbols-outlined" style={{color: 'var(--md-sys-color-surface)'}}>compare_arrows</span>
                    </div>
                </div>
            </div>
        )}
       </div>
    );
  }
  
  // 回退视图：当只有一个结果图片且没有原始图片可对比时
  if (content.imageUrl) {
     return (
        <div className="animate-fade-in" style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
             <div style={{width: '100%', flexGrow: 1, position: 'relative', backgroundColor: 'var(--md-sys-color-surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={content.imageUrl} alt={t('resultDisplay.labels.generated')} onClick={() => onImageClick(content.imageUrl!)} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'pointer'}} />
             </div>
        </div>
     );
  }
  
  // 如果没有任何内容可显示，则返回 null
  return null;
};

export default ResultDisplay;
