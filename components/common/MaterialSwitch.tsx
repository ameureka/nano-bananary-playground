'use client';

import React from 'react';

// 定义 MaterialSwitch 组件的 Props
export const MaterialSwitch: React.FC<{
    label: string; // 开关旁边的标签文本
    checked: boolean; // 开关是否被选中
    onChange: (checked: boolean) => void; // 开关状态改变时的回调函数
    description?: string; // 鼠标悬停时显示的描述信息
}> = ({ label, checked, onChange, description }) => (
    // 使用 label 元素包裹，使得点击标签文本也能触发展示
    <label className="md-switch" title={description}>
        {/* 标签文本 */}
        <span style={{fontWeight: 500, fontSize: '0.875rem', flexGrow: 1}}>{label}</span>
        {/* 开关的容器 */}
        <div className="switch">
            {/* 隐藏的原生 checkbox，用于管理状态 */}
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            {/* 使用 span 元素通过 CSS 绘制开关的轨道和滑块 */}
            <span className="slider"></span>
        </div>
    </label>
);
