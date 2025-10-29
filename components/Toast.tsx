'use client';

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, message]); // Reset timer if message or duration changes

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
