'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
// 导入国际化钩子
import { useTranslation } from '@/i18n/context';

interface ImageEditorCanvasProps {
  onImageSelect: (file: File, dataUrl: string) => void; // 选择图片后的回调
  initialImageUrl: string | null; // 初始显示的图片 URL
  onMaskChange: (dataUrl: string | null) => void; // 蒙版变化时的回调
  onClearImage: () => void; // 清除图片的回调
  isMaskToolActive: boolean; // 蒙版工具是否激活
  onOpenAssetLibrary: () => void; // 打开资产库的回调
}

// 定义绘图工具类型
type DrawingTool = 'brush' | 'polygon';

const ImageEditorCanvas: React.FC<ImageEditorCanvasProps> = ({ onImageSelect, initialImageUrl, onMaskChange, onClearImage, isMaskToolActive, onOpenAssetLibrary }) => {
  const { t } = useTranslation();
  // Refs for canvas elements and container
  const imageCanvasRef = useRef<HTMLCanvasElement>(null); // 用于显示图片的 Canvas
  const maskCanvasRef = useRef<HTMLCanvasElement>(null); // 用于绘制蒙版的 Canvas
  const polygonPreviewCanvasRef = useRef<HTMLCanvasElement>(null); // 用于预览多边形绘制的 Canvas
  const containerRef = useRef<HTMLDivElement>(null); // 容器 div
  const sliderRef = useRef<HTMLInputElement>(null); // 笔刷大小滑块
  
  // State management
  const [image, setImage] = useState<HTMLImageElement | null>(null); // 加载的图片对象
  
  const [isDrawing, setIsDrawing] = useState(false); // 是否正在用画笔绘制
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null); // 上一个绘制点的位置
  const [brushSize, setBrushSize] = useState(20); // 笔刷大小
  const [history, setHistory] = useState<ImageData[]>([]); // 蒙版绘制历史，用于撤销

  const [isDragging, setIsDragging] = useState(false); // 是否正在拖放文件

  const [drawingTool, setDrawingTool] = useState<DrawingTool>('brush'); // 当前选择的绘图工具
  const [polygonPoints, setPolygonPoints] = useState<{x: number, y: number}[]>([]); // 多边形工具的点
  const [currentMousePos, setCurrentMousePos] = useState<{x: number, y: number} | null>(null); // 当前鼠标位置，用于预览多边形

  // 获取所有 canvas 的上下文
  const getCanvasContexts = useCallback(() => {
    const imageCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const polygonPreviewCanvas = polygonPreviewCanvasRef.current;
    const imageCtx = imageCanvas?.getContext('2d');
    const maskCtx = maskCanvas?.getContext('2d');
    const polygonPreviewCtx = polygonPreviewCanvas?.getContext('2d');
    return { imageCanvas, maskCanvas, polygonPreviewCanvas, imageCtx, maskCtx, polygonPreviewCtx };
  }, []);

  // 绘制图像到 imageCanvas，并调整所有 canvas 的大小
  const draw = useCallback(() => {
    const { imageCtx, imageCanvas, maskCanvas, polygonPreviewCanvas } = getCanvasContexts();
    const container = containerRef.current;

    if (!imageCtx || !imageCanvas || !image || !container) return;
    
    // 计算图片在容器内的显示尺寸，保持宽高比
    const contRatio = container.clientWidth / container.clientHeight;
    const imgRatio = image.width / image.height;

    let displayW, displayH, displayX, displayY;
    if (contRatio > imgRatio) {
        displayH = container.clientHeight;
        displayW = displayH * imgRatio;
    } else {
        displayW = container.clientWidth;
        displayH = displayW / imgRatio;
    }
    displayX = (container.clientWidth - displayW) / 2;
    displayY = (container.clientHeight - displayH) / 2;
    
    // 同步所有 canvas 的尺寸
    [imageCanvas, maskCanvas, polygonPreviewCanvas].forEach(canvas => {
        if(canvas) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
    });

    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.drawImage(image, displayX, displayY, displayW, displayH);

  }, [image, getCanvasContexts]);

  // 处理初始图片的加载
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        setImage(img);
        // 重置蒙版和历史记录
        setHistory([]);
        setPolygonPoints([]);
        const { maskCtx, maskCanvas } = getCanvasContexts();
        if (maskCtx && maskCanvas) {
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            onMaskChange(null);
        }
    };
    if (initialImageUrl) {
        img.src = initialImageUrl;
    } else {
        setImage(null);
    }
  }, [initialImageUrl, getCanvasContexts, onMaskChange]);
  
  // 在窗口大小变化时重绘 canvas
  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw, image]);

  // 保存当前蒙版状态到历史记录
  const saveToHistory = useCallback(() => {
    const { maskCtx, maskCanvas } = getCanvasContexts();
    if (maskCtx && maskCanvas) {
      setHistory(prev => [...prev, maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)]);
    }
  }, [getCanvasContexts]);

  // 清除蒙版
  const clearMask = useCallback(() => {
    const { maskCtx, maskCanvas } = getCanvasContexts();
    if (maskCtx && maskCanvas) {
      saveToHistory();
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      onMaskChange(null);
      setPolygonPoints([]);
      setHistory(prev => [...prev, maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)]);
    }
  }, [getCanvasContexts, onMaskChange, saveToHistory]);
  
  // 撤销上一步操作
  const handleUndo = useCallback(() => {
    const { maskCtx, maskCanvas } = getCanvasContexts();
    if (!maskCtx || !maskCanvas || history.length === 0) return;

    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    if (newHistory.length > 0) {
        maskCtx.putImageData(newHistory[newHistory.length - 1], 0, 0);
        onMaskChange(maskCanvas.toDataURL());
    } else {
        onMaskChange(null);
    }
  }, [getCanvasContexts, onMaskChange, history]);

  // 获取事件在 canvas 上的坐标
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent) => {
    const canvas = polygonPreviewCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    return { x, y };
  };

  // 画笔工具：开始绘制
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    saveToHistory();
    setIsDrawing(true);
    setLastPos(coords);
  };
  
  // 画笔工具：绘制过程
  const doDraw = (e: React.MouseEvent | React.TouchEvent | MouseEvent) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);
    if (!coords || !lastPos) return;
    const { maskCtx } = getCanvasContexts();
    if (maskCtx) {
      maskCtx.beginPath();
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
      maskCtx.strokeStyle = `${accentColor}b3`; // 70% 透明度
      maskCtx.lineWidth = brushSize;
      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      maskCtx.moveTo(lastPos.x, lastPos.y);
      maskCtx.lineTo(coords.x, coords.y);
      maskCtx.stroke();
    }
    setLastPos(coords);
  };
  
  // 画笔工具：停止绘制
  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
    onMaskChange(maskCanvasRef.current?.toDataURL() ?? null);
  };
  
  // 多边形工具：添加一个点
  const addPolygonPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    setPolygonPoints(prev => [...prev, coords]);
  };
  
  // 多边形工具：完成多边形并填充
  const finishPolygon = useCallback(() => {
    if (polygonPoints.length < 3) {
      setPolygonPoints([]);
      return;
    };
    saveToHistory();
    const { maskCtx } = getCanvasContexts();
    if (maskCtx) {
      maskCtx.beginPath();
      maskCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        maskCtx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      maskCtx.closePath();

      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
      maskCtx.fillStyle = `${accentColor}b3`;
      maskCtx.fill();

      onMaskChange(maskCanvasRef.current?.toDataURL() ?? null);
    }
    setPolygonPoints([]);
  }, [polygonPoints, getCanvasContexts, onMaskChange, saveToHistory]);
  
  // 实时预览多边形绘制
  useEffect(() => {
    const { polygonPreviewCtx, polygonPreviewCanvas } = getCanvasContexts();
    if (!polygonPreviewCtx || !polygonPreviewCanvas) return;

    polygonPreviewCtx.clearRect(0, 0, polygonPreviewCanvas.width, polygonPreviewCanvas.height);
    
    if (polygonPoints.length > 0) {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim();
      polygonPreviewCtx.strokeStyle = accentColor;
      polygonPreviewCtx.lineWidth = 2;
      polygonPreviewCtx.beginPath();
      polygonPreviewCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        polygonPreviewCtx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      // 连接到当前鼠标位置
      if (currentMousePos) {
        polygonPreviewCtx.lineTo(currentMousePos.x, currentMousePos.y);
      }
      polygonPreviewCtx.stroke();
    }
  }, [polygonPoints, currentMousePos, getCanvasContexts]);

  // 统一的鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (drawingTool === 'brush') startDrawing(e);
    else addPolygonPoint(e);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawingTool === 'brush') doDraw(e);
    else setCurrentMousePos(getCanvasCoordinates(e));
  };
  const handleMouseUp = () => {
    if (drawingTool === 'brush') stopDrawing();
  };
  const handleMouseLeave = () => {
    if (drawingTool === 'brush') stopDrawing();
    setCurrentMousePos(null);
  };
  const handleDoubleClick = () => {
    if (drawingTool === 'polygon') finishPolygon();
  };

  // 文件处理函数
  const handleFile = useCallback((file: File) => {
     const reader = new FileReader();
      reader.onload = (e) => { onImageSelect(file, e.target?.result as string); };
      reader.readAsDataURL(file);
  }, [onImageSelect]);
  
  // 监听剪贴板粘贴事件
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
        // 仅在没有加载图片时触发粘贴
        if (initialImageUrl || !event.clipboardData) return;
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    handleFile(file);
                    event.preventDefault(); // 阻止默认粘贴行为
                }
                break; 
            }
        }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleFile, initialImageUrl]);

  // 文件输入框变化和拖放事件
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) handleFile(event.target.files[0]);
  };
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); event.stopPropagation(); setIsDragging(false);
    if (event.dataTransfer.files?.[0]) handleFile(event.dataTransfer.files[0]);
  }, [handleFile]);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

  // 处理笔刷大小滑块变化，并更新 CSS 变量以实现轨道填充效果
  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setBrushSize(value);
      const min = Number(e.target.min || 5);
      const max = Number(e.target.max || 100);
      const percent = ((value - min) / (max - min)) * 100;
      e.target.style.setProperty('--slider-percent', `${percent}%`);
  };

  // 确保滑块在加载时也能正确显示填充
  useEffect(() => {
    if (sliderRef.current) {
        const slider = sliderRef.current;
        const min = Number(slider.min || 5);
        const max = Number(slider.max || 100);
        const percent = ((brushSize - min) / (max - min)) * 100;
        slider.style.setProperty('--slider-percent', `${percent}%`);
    }
  }, [brushSize, isMaskToolActive]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <div
            ref={containerRef}
            onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            style={{
                position: 'relative', width: '100%', aspectRatio: '1/1', 
                backgroundColor: 'var(--md-sys-color-surface)', 
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms ease', userSelect: 'none',
                padding: initialImageUrl ? '0' : '1rem',
                border: initialImageUrl ? '1px solid var(--md-sys-color-outline-variant)' : '2px dashed var(--md-sys-color-outline)',
                outline: isDragging ? '2px dashed var(--md-sys-color-primary)' : 'none',
                outlineOffset: '4px'
            }}
        >
            {/* 没有图片时的上传提示 */}
            {!initialImageUrl ? (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-surface-variant)', cursor: 'pointer', width: '100%', height: '100%', textAlign: 'center'}}>
                    <label htmlFor="file-upload" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, width: '100%'}}>
                      <span className="material-symbols-outlined" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>image</span>
                      <p style={{marginBottom: '0.5rem', fontSize: '0.875rem'}}><span style={{fontWeight: 500, color: 'var(--md-sys-color-primary)'}}>{t('imageEditor.upload')}</span> {t('imageEditor.dragAndDrop')}</p>
                    </label>
                    <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" style={{display: 'none'}}/>
                    <div className="uploader-actions" style={{display: 'flex', gap: '0.5rem', marginTop: 'auto', padding: '0 1rem 1rem 1rem', width: '100%'}}>
                        <button onClick={onOpenAssetLibrary} className="btn btn-tonal" style={{height: '36px', flexGrow: 1}}>
                            <span className="material-symbols-outlined">photo_library</span>
                            {t('imageEditor.importFromLibrary')}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* 显示图片和画布 */}
                    <button onClick={onClearImage} className="icon-btn" style={{position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 30, backgroundColor: 'color-mix(in srgb, var(--md-sys-color-scrim), transparent 50%)', color: 'var(--md-sys-color-inverse-on-surface)'}} aria-label="Remove image">
                        <span className="material-symbols-outlined">close</span>
                        <span className="state-layer"></span>
                    </button>
                    <canvas ref={imageCanvasRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none'}} />
                    <canvas ref={maskCanvasRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }} />
                    <canvas ref={polygonPreviewCanvasRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 3, touchAction: 'none', cursor: isMaskToolActive ? 'crosshair' : 'default'}} 
                        onMouseDown={isMaskToolActive ? handleMouseDown : undefined} 
                        onMouseMove={isMaskToolActive ? handleMouseMove : undefined} 
                        onMouseUp={isMaskToolActive ? handleMouseUp : undefined} 
                        onMouseLeave={isMaskToolActive ? handleMouseLeave : undefined}
                        onDoubleClick={isMaskToolActive ? handleDoubleClick : undefined}
                    />
                </>
            )}
        </div>
        {/* 蒙版工具面板 */}
        {initialImageUrl && isMaskToolActive && (
            <div className="card animate-fade-in-fast" style={{padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <p style={{fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant', margin: 0}}>{t('imageEditor.maskPanelInfo')}</p>
                
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button onClick={() => setDrawingTool('brush')} className={`btn ${drawingTool === 'brush' ? 'btn-filled' : 'btn-tonal'} ripple-surface`} style={{flex: 1, height: '36px'}}>
                        <span className="material-symbols-outlined">brush</span>
                        {t('imageEditor.tools.brush')}
                    </button>
                    <button onClick={() => setDrawingTool('polygon')} className={`btn ${drawingTool === 'polygon' ? 'btn-filled' : 'btn-tonal'} ripple-surface`} style={{flex: 1, height: '36px'}}>
                        <span className="material-symbols-outlined">pentagon</span>
                        {t('imageEditor.tools.polygon')}
                    </button>
                </div>

                {drawingTool === 'brush' && (
                  <div className="animate-fade-in-fast" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <label htmlFor="brush-size" style={{fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap'}}>{t('imageEditor.brushSize')}</label>
                      <input id="brush-size" ref={sliderRef} type="range" min="5" max="100" value={brushSize} onChange={handleBrushSizeChange} className="md-slider" />
                  </div>
                )}
                {drawingTool === 'polygon' && (
                  <p className="animate-fade-in-fast" style={{fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', margin: 0}}>
                    {t('imageEditor.polygonInstructions')}
                  </p>
                )}
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem'}}>
                    <button onClick={handleUndo} disabled={history.length === 0} className="btn btn-tonal ripple-surface">
                      <span className="material-symbols-outlined">undo</span>
                      {t('imageEditor.undo')}
                    </button>
                    <button onClick={clearMask} className="btn btn-tonal ripple-surface">
                      <span className="material-symbols-outlined">delete</span>
                      {t('imageEditor.clearMask')}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default ImageEditorCanvas;
