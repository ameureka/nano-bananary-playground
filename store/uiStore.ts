import { create } from 'zustand';
// 导入Zustand的持久化中间件，用于将状态保存到localStorage
import { persist, createJSONStorage } from 'zustand/middleware';

// --- STATE (状态定义) ---
export interface UiState {
  isAdvancedMode: boolean; // 是否处于进阶模式
  toastMessage: string | null; // 全局提示消息的内容，为null时隐藏
}

// --- ACTIONS (操作定义) ---
export interface UiActions {
  setIsAdvancedMode: (isAdvanced: boolean) => void; // 设置进阶模式状态
  setToast: (message: string | null) => void; // 设置提示消息
}

// --- STORE (完整的Store类型) ---
export type UiStore = UiState & UiActions;

// 使用 create 函数创建 store
export const useUiStore = create<UiStore>()(
  // 使用 persist 中间件
  persist(
    // (set, get) => ({...}) 是Zustand创建store的固定写法
    (set, get) => ({
      // --- 默认状态 (Default State) ---
      isAdvancedMode: false,
      toastMessage: null,

      // --- 操作实现 (Actions) ---
      setIsAdvancedMode: (isAdvanced) => set({ isAdvancedMode: isAdvanced }),
      setToast: (message) => set({ toastMessage: message }),
    }),
    {
      name: 'bananary-ui-storage', // 在 localStorage 中使用的键名
      storage: createJSONStorage(() => localStorage), // 指定使用 localStorage
      // partialize 用于选择性地持久化部分状态，这里只保存 isAdvancedMode
      partialize: (state) => ({
        isAdvancedMode: state.isAdvancedMode,
      }),
    }
  )
);
