// 导入 React 核心库
import React from 'react';
// 导入 React DOM 客户端库
import ReactDOM from 'react-dom/client';
// 导入 react-router-dom 中的 HashRouter
import { HashRouter } from 'react-router-dom';
// 导入主应用组件 App
import App from './App';
// 导入新的 Providers 组件，用于封装所有上下文
import { Providers } from './providers';
// 导入全局样式表
import './styles/globals.css';

// 获取 HTML 中的根元素
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 创建 React 根并渲染应用
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Providers 组件现在负责所有上下文的提供 */}
    <Providers>
      {/* HashRouter 包裹 App 组件以提供路由功能 */}
      <HashRouter>
        <App />
      </HashRouter>
    </Providers>
  </React.StrictMode>
);