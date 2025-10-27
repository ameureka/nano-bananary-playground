// 'use client'
import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title = '结果', description = '您生成的图像将显示在这里。', icon }) => {
  return (
    <div className="animate-fade-in" aria-live="polite" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240, border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-surface)' }}>
      <div style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)', padding: '1rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
          {icon ?? <span className="material-symbols-outlined" aria-hidden="true">image</span>}
        </div>
        <div style={{ fontWeight: 700, color: 'var(--md-sys-color-on-surface)', marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ fontSize: '0.875rem' }}>{description}</div>
      </div>
    </div>
  );
};

export default EmptyState;