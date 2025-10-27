import React from 'react';
// 导入路由相关的组件
import { Routes, Route } from 'react-router-dom';

// --- 页面组件导入 (更新后) ---
import EnhancerPage from './app/page';
import LibraryPage from './app/library/page';
import ChatPage from './app/chat/page';

// --- 布局组件导入 (更新后) ---
import { MainLayout } from './app/layout';

/**
 * 重构后的 App 组件。
 * 它的唯一职责是定义路由结构。
 * 所有的共享UI、全局状态和副作用都由 MainLayout 处理。
 */
const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        {/* 每个页面组件现在作为 MainLayout 的子组件被渲染 */}
        <Route path="/" element={<EnhancerPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </MainLayout>
  );
};

export default App;