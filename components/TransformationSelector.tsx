// 'use client'
import React, { useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
// 导入类型和国际化工具
import type { Transformation } from '../types';
import { useTranslation } from '../i18n/context';
// 导入服务器动作（或抽象的API调用）
import { getTransformationSuggestionsAction } from '../lib/actions';
// 导入加载动画组件
import LoadingSpinner from './common/LoadingSpinner';

interface TransformationSelectorProps {
  transformations: Transformation[]; // 所有效果类别
  onSelect: (transformation: Transformation) => void; // 选择效果后的回调
  hasPreviousResult: boolean; // 是否已有上一次生成的结果
  activeCategory: Transformation | null; // 当前展开的类别
  setActiveCategory: (category: Transformation | null) => void; // 设置当前展开的类别
  isAdvancedMode: boolean; // 是否处于进阶模式
}

const TransformationSelector: React.FC<TransformationSelectorProps> = ({ 
  transformations: categories, 
  onSelect, 
  hasPreviousResult,
  isAdvancedMode,
}) => {
  const { t } = useTranslation();
  
  // 状态管理
  const [searchQuery, setSearchQuery] = useState(''); // 搜索查询内容
  const [isAiSearching, setIsAiSearching] = useState(false); // AI 是否正在搜索
  const [aiSuggestions, setAiSuggestions] = useState<Transformation[]>([]); // AI 推荐的效果

  const [hoveredPrompt, setHoveredPrompt] = useState<{ prompt: string; key: string } | null>(null); // 鼠标悬停时显示的提示词
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; right?: number } | null>(null); // 提示词工具提示的位置
  const longPressTimer = useRef<number | null>(null); // 用于移动端长按的计时器
  const touchStartPos = useRef({ x: 0, y: 0 }); // 记录触摸起始位置

  // 将所有效果项扁平化为一个数组，以便于搜索
  const allTransformations = useMemo(() => {
    const flatList: Transformation[] = [];
    categories.forEach(category => {
        if (category.items) {
            flatList.push(...category.items);
        }
    });
    return flatList;
  }, [categories]);

  // 处理 AI 搜索
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiSuggestions([]);

    const transformationsForAI = allTransformations.map(trans => ({
        key: trans.key,
        title: t(trans.titleKey),
        description: t(trans.descriptionKey || '')
    }));

    // 调用 API 获取建议的 key
    const suggestedKeys = await getTransformationSuggestionsAction(searchQuery, transformationsForAI);
    
    // 根据返回的 key 找到对应的效果对象
    const suggestionsMap = new Map(allTransformations.map(t => [t.key, t]));
    const foundSuggestions = suggestedKeys
        .map(key => suggestionsMap.get(key))
        .filter((t): t is Transformation => !!t);

    setAiSuggestions(foundSuggestions);
    setIsAiSearching(false);
  };
  
  // 本地过滤效果（基于标题和描述）
  const filteredTransformations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allTransformations.filter(trans =>
        t(trans.titleKey).toLowerCase().includes(lowerCaseQuery) ||
        t(trans.descriptionKey || '').toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, allTransformations, t]);

  // 处理搜索输入框变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setAiSuggestions([]); // 输入时清除旧的 AI 建议
  };

  // --- 提示词工具提示的处理函数 ---
  const handleMouseEnter = (e: React.MouseEvent, trans: Transformation) => {
    if (!isAdvancedMode || !trans.prompt || trans.prompt === 'CUSTOM') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 300;
    
    let left = rect.left;
    if (left + tooltipWidth > window.innerWidth - 16) {
        left = window.innerWidth - tooltipWidth - 16;
    }

    setTooltipPosition({ top: rect.bottom + 8, left });
    setHoveredPrompt({ prompt: trans.prompt, key: trans.key });
  };
  const handleMouseLeave = () => {
    if (!isAdvancedMode) return;
    setHoveredPrompt(null);
    setTooltipPosition(null);
  };
  const handleTouchStart = (e: React.TouchEvent, trans: Transformation) => {
    if (!isAdvancedMode || !trans.prompt || trans.prompt === 'CUSTOM') return;
    touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    longPressTimer.current = window.setTimeout(() => {
        const rect = e.currentTarget.getBoundingClientRect();
        const tooltipWidth = 300;
        let left = rect.left;
        if (left + tooltipWidth > window.innerWidth - 16) {
            left = window.innerWidth - tooltipWidth - 16;
        }
        setTooltipPosition({ top: rect.bottom + 8, left });
        setHoveredPrompt({ prompt: trans.prompt, key: trans.key });
    }, 500); // 500毫秒算作长按
  };
  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setTimeout(() => {
        setHoveredPrompt(null);
        setTooltipPosition(null);
    }, 300);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const moveX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
    const moveY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
    if (moveX > 10 || moveY > 10) { // 如果手指移动太多，取消长按
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
    }
  };


  // 渲染效果网格的函数
  const renderGrid = (items: Transformation[]) => (
    <div className="effects-grid">
      {items.map((trans) => (
        <button
          key={trans.key}
          onClick={() => onSelect(trans)}
          className="card card-selectable ripple-surface effect-card"
          onMouseEnter={(e) => handleMouseEnter(e, trans)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={(e) => handleTouchStart(e, trans)}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          <div className="effect-card-header">
              <div className="effect-card-icon-wrapper">
                  <span className="material-symbols-outlined effect-card-icon">{trans.icon}</span>
              </div>
              <div className="effect-card-title">
                  {t(trans.titleKey)}
              </div>
          </div>
          <div className="effect-card-description-wrapper">
            <p className="effect-card-description-text">
              {t(trans.descriptionKey || '')}
            </p>
          </div>
          <span className="state-layer"></span>
        </button>
      ))}
    </div>
  );

  // 根据当前状态渲染主内容
  const renderContent = () => {
    if (isAiSearching) {
        return <LoadingSpinner message={t('transformationSelector.aiSearching')} />;
    }

    if (searchQuery.trim()) {
      const hasLocalResults = filteredTransformations.length > 0;
      const hasAiResults = aiSuggestions.length > 0;
      const noResults = !hasLocalResults && !hasAiResults;

      return (
        <div className="animate-fade-in-fast">
          {hasAiResults && (
            <div style={{marginBottom: '2rem'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1rem', textAlign: 'center'}}>{t('transformationSelector.aiSuggestionsTitle')}</h3>
                {renderGrid(aiSuggestions)}
            </div>
          )}
          {hasLocalResults && (
                <div style={{marginBottom: '2rem'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1rem', textAlign: 'center'}}>{t('transformationSelector.localResultsTitle')}</h3>
                {renderGrid(filteredTransformations)}
            </div>
          )}
          {noResults && (
            <div style={{textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)', padding: '2rem'}}>
              <span className="material-symbols-outlined" style={{fontSize: '3rem'}}>search_off</span>
              <p>{t('transformationSelector.noResults')}</p>
            </div>
          )}
        </div>
      );
    }

    // 默认视图：可折叠的类别
    return categories.map((category, index) => (
      <details
        key={category.key}
        className="category-details"
        open={index < 2} // 默认展开前两个类别
      >
        <summary className="category-summary ripple-surface">
          <span className="material-symbols-outlined">{category.icon}</span>
          {t(category.titleKey)}
          <span className="material-symbols-outlined icon">expand_more</span>
        </summary>
        <div className="category-content">
          {renderGrid(category.items || [])}
        </div>
      </details>
    ));
  };


  return (
    <div className="animate-fade-in main-container">
        <h2 style={{fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem', color: 'var(--md-sys-color-primary)'}}>{t('transformationSelector.title')}</h2>
        <p style={{fontSize: '1rem', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '2rem', maxWidth: '60ch', margin: '0 auto 2rem'}}>
        {hasPreviousResult 
            ? t('transformationSelector.descriptionWithResult')
            : t('transformationSelector.description')
        }
        </p>

        <div className="search-container">
            <input 
                type="text"
                className="search-input"
                placeholder={t('transformationSelector.searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
            <button 
              className="icon-btn ripple-surface" 
              onClick={handleAiSearch} 
              disabled={isAiSearching}
              title={t('transformationSelector.aiSearchTooltip')}
            >
                {isAiSearching ? (
                    <span className="material-symbols-outlined" style={{animation: 'spin 1s linear infinite'}}>progress_activity</span>
                ) : (
                    <span className="material-symbols-outlined">auto_awesome</span>
                )}
                <span className="state-layer"></span>
            </button>
        </div>
        
        {renderContent()}

        {/* 使用 Portal 将工具提示渲染到 body 的顶层，避免被父元素的 overflow 裁剪 */}
        {hoveredPrompt && tooltipPosition && ReactDOM.createPortal(
            <div style={{
                position: 'fixed',
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                backgroundColor: 'var(--md-sys-color-inverse-surface)',
                color: 'var(--md-sys-color-inverse-on-surface)',
                padding: '0.75rem',
                borderRadius: '8px',
                boxShadow: 'var(--md-elevation-2)',
                maxWidth: '300px',
                width: 'max-content',
                zIndex: 1100,
                pointerEvents: 'none',
                whiteSpace: 'pre-wrap',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                animation: 'fadeIn 0.15s ease-out'
            }}>
                <strong style={{color: 'var(--md-sys-color-inverse-primary)'}}>{t('transformationSelector.promptLabel')}</strong>
                <p style={{marginTop: '0.25rem', margin: 0, opacity: 0.9}}>{hoveredPrompt.prompt}</p>
            </div>,
            document.body
        )}
    </div>
  );
};

export default TransformationSelector;