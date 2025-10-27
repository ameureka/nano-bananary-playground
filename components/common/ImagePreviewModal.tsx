// 'use client'
import React, { useState, useRef, useCallback, useEffect, WheelEvent, MouseEvent as ReactMouseEvent } from 'react';
// 导入国际化和工具函数
import { useTranslation } from '../../i18n/context';
import { dataUrlToFile, downloadImage } from '../../utils/fileUtils';

interface ImagePreviewModalProps {
  src: string | null; // 要预览的图片 URL
  onClose: () => void; // 关闭模态框的回调
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose }) => {
  const { t } = useTranslation();
  // 状态管理：图片的变换（缩放、平移）
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false); // 是否正在平移
  
  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 用于区分点击和拖动的 refs
  const isDraggingRef = useRef(false);
  const dragStartPoint = useRef({ x: 0, y: 0 });
  const lastPanPoint = useRef({ x: 0, y: 0 });

  // 重置图片变换，使其适应容器大小
  const resetTransform = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;
    const { naturalWidth: imgWidth, naturalHeight: imgHeight } = imageRef.current;

    // 计算合适的初始缩放比例
    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    // 设置变换，使图片居中
    setTransform({
      scale,
      x: (containerWidth - imgWidth * scale) / 2,
      y: (containerHeight - imgHeight * scale) / 2,
    });
  }, []);
  
  // 图片加载或窗口大小变化时，重置变换
  useEffect(() => {
    if (!src) return;
    const img = imageRef.current;
    const handleLoad = () => resetTransform();
    if (img) {
      img.addEventListener('load', handleLoad);
      if (img.complete) handleLoad(); // 如果图片已经加载完成，立即执行
    }
    window.addEventListener('resize', resetTransform);
    return () => {
        if (img) img.removeEventListener('load', handleLoad);
        window.removeEventListener('resize', resetTransform);
    };
  }, [src, resetTransform]);

  // 处理鼠标滚轮事件以进行缩放
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const newScale = transform.scale * (1 - e.deltaY * zoomIntensity * 0.1);
    const clampedScale = Math.max(0.1, Math.min(10, newScale)); // 限制缩放范围
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // 计算新的 x, y 坐标，使缩放中心在鼠标指针下
    const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.scale);
    const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.scale);
    setTransform({ scale: clampedScale, x: newX, y: newY });
  };
  
  // 鼠标按下，开始平移准备
  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // 只响应左键
    e.preventDefault();
    isDraggingRef.current = false; // 重置拖动状态
    dragStartPoint.current = { x: e.clientX, y: e.clientY };
    lastPanPoint.current = { x: e.clientX, y: e.clientY };
    setIsPanning(true);
  };
  
  // 鼠标移动，执行平移
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    // 如果移动距离超过阈值，则认为是拖动而不是点击
    if (!isDraggingRef.current && (Math.abs(e.clientX - dragStartPoint.current.x) > 5 || Math.abs(e.clientY - dragStartPoint.current.y) > 5)) {
        isDraggingRef.current = true;
    }
    const dx = e.clientX - lastPanPoint.current.x;
    const dy = e.clientY - lastPanPoint.current.y;
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
    lastPanPoint.current = { x: e.clientX, y: e.clientY };
  };
  
  // 鼠标松开，结束平移
  const handleMouseUp = () => {
    // 如果不是拖动（即一次点击），则关闭模态框
    if (isPanning && !isDraggingRef.current) onClose();
    setIsPanning(false);
  };

  // 处理分享功能
  const handleShare = async () => {
    if (!src) return;
    try {
      const file = await dataUrlToFile(src, 'generated-image.png');
      // 尝试使用 Web Share API
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Generated Image' });
      } else {
        // 如果不支持，则回退到下载
        downloadImage(src, 'generated-image.png');
      }
    } catch (error) {
      console.error('分享图片时出错:', error);
      alert('无法分享图片。');
    }
  };

  // 阻止事件冒泡
  const stopPropagation = (e: ReactMouseEvent) => e.stopPropagation();

  if (!src) return null;

  return (
    <div 
        ref={containerRef}
        className="preview-overlay-interactive"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 鼠标离开区域也结束平移
      >
        <img
          ref={imageRef}
          src={src}
          alt="Preview"
          className="preview-image-interactive"
          style={{ 
            cursor: isPanning ? 'grabbing' : 'grab', // 改变鼠标指针样式
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` 
          }}
        />
        {/* 操作按钮 */}
        <div className="preview-actions" onClick={stopPropagation} onMouseDown={stopPropagation}>
          <button className="icon-btn ripple-surface" title={t('imagePreview.resetView')} onClick={resetTransform}>
            <span className="material-symbols-outlined">zoom_in_map</span>
          </button>
          <button className="icon-btn ripple-surface" title={t('imagePreview.share')} onClick={handleShare}>
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
        {/* 关闭按钮 */}
        <button 
          className="icon-btn preview-close-btn ripple-surface" 
          onClick={onClose} 
          onMouseDown={stopPropagation}
          title={t('imagePreview.close')}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
  );
};

export default ImagePreviewModal;
