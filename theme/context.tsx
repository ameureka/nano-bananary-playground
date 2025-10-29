'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// 定义主题类型
type Theme = 'light' | 'dark';

// 定义主题上下文的类型
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void; // 切换主题的函数
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 使用 useState 管理当前主题状态
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      // 尝试从 localStorage 获取已保存的主题
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      // 检查用户系统偏好
      const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // 优先级：已保存的主题 > 系统偏好 > 默认亮色
      return savedTheme || (userPrefersDark ? 'dark' : 'light');
    } catch {
      // 如果 localStorage 访问失败，默认为暗色主题
      return 'dark';
    }
  });

  // 使用 useEffect 在主题变化时执行副作用
  useEffect(() => {
    try {
      // 将新主题保存到 localStorage
      localStorage.setItem('theme', theme);
      // 在 <html> 元素上设置 data-theme 属性，以便 CSS 可以根据主题应用不同样式
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
  }, [theme]);

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 通过上下文提供者将主题状态和函数传递给子组件
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子，方便在组件中使用主题上下文
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
