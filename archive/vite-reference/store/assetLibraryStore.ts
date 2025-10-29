import { create } from 'zustand';

// --- STATE (状态定义) ---
export interface AssetLibraryState {
  assetLibrary: string[]; // 存储所有图片URL的数组
  selectedAssets: Set<string>; // 存储当前选中的图片URL的集合
  isLibraryDragging: boolean; // 标记是否有文件正在拖拽到资产库视图上
}

// --- ACTIONS (操作定义) ---
export interface AssetLibraryActions {
  addImagesToLibrary: (urls: (string | null)[]) => void; // 向资产库添加一张或多张图片
  toggleAssetSelection: (src: string) => void; // 切换单张图片的选择状态
  toggleSelectAll: () => void; // 全选或取消全选
  clearAssetSelection: () => void; // 清除所有选择
  setIsLibraryDragging: (isDragging: boolean) => void; // 设置拖拽状态
}

// --- STORE (完整的Store类型) ---
export type AssetLibraryStore = AssetLibraryState & AssetLibraryActions;

// 创建资产库的 Zustand store
export const useAssetLibraryStore = create<AssetLibraryStore>()(
    (set) => ({
      // --- 默认状态 (Default State) ---
      assetLibrary: [],
      selectedAssets: new Set(),
      isLibraryDragging: false,

      // --- 操作实现 (Actions) ---
      addImagesToLibrary: (urls) => {
        // 过滤掉无效的 URL (null 或 undefined)
        const validUrls = urls.filter((url): url is string => !!url);
        if (validUrls.length > 0) {
          set((state) => ({
            // 使用 Set 确保不会有重复的图片 URL，然后转换为数组
            assetLibrary: Array.from(new Set([...validUrls, ...state.assetLibrary])),
          }));
        }
      },
      // 切换单张图片的选择状态
      toggleAssetSelection: (src) => set((state) => {
        const newSet = new Set(state.selectedAssets);
        newSet.has(src) ? newSet.delete(src) : newSet.add(src);
        return { selectedAssets: newSet };
      }),
      // 如果当前已全选，则取消全选；否则，全选所有图片
      toggleSelectAll: () => set((state) => ({
        selectedAssets: state.selectedAssets.size === state.assetLibrary.length ? new Set() : new Set(state.assetLibrary),
      })),
      // 清空选择
      clearAssetSelection: () => set({ selectedAssets: new Set() }),
      // 设置拖拽状态
      setIsLibraryDragging: (isDragging) => set({ isLibraryDragging: isDragging }),
    })
);
