'use client';

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string; // 要显示的消息
  onClose: () => void; // 关闭时的回调
  duration?: number; // 显示持续时间（毫秒）
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isClosing, setIsClosing] = useState(false);

  // 设置计时器，在持续时间结束后开始关闭动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, duration);

    // 清理函数：当组件卸载或依赖项变化时清除计时器
    return () => clearTimeout(timer);
  }, [duration, message]); // 如果消息或持续时间变化，重置计时器

  // 在关闭动画结束后调用 onClose 回调
  const handleAnimationEnd = () => {
    if (isClosing) {
      onClose();
    }
  };

  return (
    <div 
        className={`toast-container ${isClosing ? 'animating-out' : 'animating-in'}`}
        onAnimationEnd={handleAnimationEnd}
    >
        <div className="toast-message">{message}</div>
    </div>
  );
};
export default Toast;
