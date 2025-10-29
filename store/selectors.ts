import type { EnhancerState } from './enhancerStore';

/**
 * 计算“生成”按钮是否禁用
 */
export const getGenerateDisabled = (
  s: Pick<EnhancerState, 'selectedTransformation' | 'isGenerating' | 'customPrompt' | 'primaryImageUrl' | 'secondaryImageUrl' | 'multiImageUrls'>
): boolean => {
  const { selectedTransformation, isGenerating, customPrompt, primaryImageUrl, secondaryImageUrl, multiImageUrls } = s;
  if (!selectedTransformation) return true;
  if (isGenerating) return true;

  if (selectedTransformation.isVideo) {
    return !customPrompt;
  }
  if (selectedTransformation.maxImages) {
    return !multiImageUrls?.length;
  }
  if (selectedTransformation.isMultiImage || selectedTransformation.isStyleMimic) {
    return !primaryImageUrl || !secondaryImageUrl;
  }
  if (selectedTransformation.prompt === 'CUSTOM') {
    return !customPrompt;
  }
  return !primaryImageUrl;
};

/**
 * 返回生成按钮文案所用的 i18n key
 */
export const getGenerateLabelKey = (
  s: Pick<EnhancerState, 'selectedTransformation'>
): 'app.createVideo' | 'app.generateImage' => {
  return s.selectedTransformation?.isVideo ? 'app.createVideo' : 'app.generateImage';
};

/**
 * 统一加载提示文案（当 store.loadingMessage 为空时给默认值）
 */
export const getLoadingMessage = (
  s: Pick<EnhancerState, 'isGenerating' | 'loadingMessage' | 'selectedTransformation'>
): string => {
  if (!s.isGenerating) return '';
  const msg = s.loadingMessage?.trim();
  if (msg) return msg;
  return s.selectedTransformation?.isVideo ? '正在生成视频…' : '正在生成图片…';
};