import { create } from 'zustand';
// 导入Zustand的持久化中间件
import { persist, createJSONStorage } from 'zustand/middleware';

// --- TYPES (类型定义) ---
export interface LogEntry {
  timestamp: string; // 日志时间戳
  service: string; // 调用的服务名称 (例如 'editImage')
  model: string; // 使用的AI模型
  prompt: string; // 发送给模型的提示或输入
  status: 'success' | 'error'; // API调用状态
  result?: any; // 成功时的结果摘要
  errorDetails?: string; // 失败时的错误详情
}

// --- STATE (状态定义) ---
export interface LogState {
  logs: LogEntry[]; // 日志条目数组
}

// --- ACTIONS (操作定义) ---
export interface LogActions {
  addLog: (entry: Omit<LogEntry, 'timestamp'>) => void; // 添加一条新日志
  clearLogs: () => void; // 清空所有日志
  downloadLogs: () => void; // 下载所有日志为JSON文件
}

// --- STORE (完整的Store类型) ---
export type LogStore = LogState & LogActions;

// 创建日志的 Zustand store
export const useLogStore = create<LogStore>()(
  persist(
    (set, get) => ({
      // --- 默认状态 (Default State) ---
      logs: [],

      // --- 操作实现 (Actions) ---
      addLog: (entry) => {
        const newLog: LogEntry = {
          ...entry,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          // 将新日志添加到数组开头，并只保留最近的100条记录
          logs: [newLog, ...state.logs].slice(0, 100), 
        }));
      },
      clearLogs: () => set({ logs: [] }),
      downloadLogs: () => {
        const logs = get().logs;
        // 将日志数组格式化为美观的JSON字符串
        const dataStr = JSON.stringify(logs, null, 2);
        // 创建一个可下载的数据URI
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `bananary-logs-${new Date().toISOString()}.json`;

        // 创建一个临时的 a 标签来触发下载
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      },
    }),
    {
      name: 'bananary-log-storage', // 在localStorage中使用的键名
      storage: createJSONStorage(() => localStorage),
    }
  )
);
