'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTranslation } from '@/i18n/context';
import { useEnhancerStore } from '@/store/enhancerStore';
import { useUiStore } from '@/store/uiStore';
import { TRANSFORMATIONS } from '@/constants';
import type { GeneratedContent } from '@/types';
import TransformationSelector from '@/components/TransformationSelector';
import ResultDisplay from '@/components/ResultDisplay';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import TransformationInputArea from '@/components/features/enhancer/TransformationInputArea';
import { useLayout } from '@/components/layout/LayoutContext';
import { getGenerateDisabled, getGenerateLabelKey, getLoadingMessage } from '@/store/selectors';

/**
 * 图像增强器主页面
 * 该页面现在通过 useLayout 钩子从父布局组件获取所需的回调函数。
 */
const EnhancerContent: React.FC = () => {
    const { t } = useTranslation();
    const { openAssetLibraryModal: openAssetLibrary, setPreviewImageUrl } = useLayout();

    const isAdvancedMode = useUiStore(state => state.isAdvancedMode);

    const selectedTransformation = useEnhancerStore(s => s.selectedTransformation);
    const primaryImageUrl = useEnhancerStore(s => s.primaryImageUrl);
    const secondaryImageUrl = useEnhancerStore(s => s.secondaryImageUrl);
    const multiImageUrls = useEnhancerStore(s => s.multiImageUrls);
    const generatedContent = useEnhancerStore(s => s.generatedContent);
    const customPrompt = useEnhancerStore(s => s.customPrompt);
    const imageOptions = useEnhancerStore(s => s.imageOptions);
    const isGenerating = useEnhancerStore(s => s.isGenerating);
    const loadingMessage = useEnhancerStore(s => s.loadingMessage);
    const error = useEnhancerStore(s => s.error);
    const progress = useEnhancerStore(s => s.progress);
    const setSelectedTransformation = useEnhancerStore(s => s.setSelectedTransformation);
    const generateImage = useEnhancerStore(s => s.generateImage);
    const generateVideo = useEnhancerStore(s => s.generateVideo);

    const activeCategory = useEnhancerStore(state => state.activeCategory);
    const setActiveCategory = useEnhancerStore(state => state.setActiveCategory);

    const setSelectedOption = useEnhancerStore(state => state.setSelectedOption);
    const setGeneratedContent = useEnhancerStore(state => state.setGeneratedContent);
    const selectedOption = useEnhancerStore(state => state.selectedOption);

    if (!selectedTransformation) {
        return (
            <div className='enhancer-view-padding'>
                <TransformationSelector
                    transformations={TRANSFORMATIONS}
                    onSelect={setSelectedTransformation}
                    hasPreviousResult={!!primaryImageUrl || multiImageUrls.length > 0}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    isAdvancedMode={isAdvancedMode}
                />
            </div>
        );
    }

    const isGenerateDisabled = getGenerateDisabled({
        selectedTransformation,
        isGenerating,
        customPrompt,
        primaryImageUrl,
        secondaryImageUrl,
        multiImageUrls
    });
    const generateLabelKey = getGenerateLabelKey({ selectedTransformation });
    const spinnerMessage = getLoadingMessage({ isGenerating, loadingMessage, selectedTransformation });

    return (
        <div className='enhancer-view-padding'>
            <div className="animate-fade-in main-container" style={{ padding: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="enhancer-header">
                            <div className="enhancer-header-icon-wrapper">
                                <span className="material-symbols-outlined enhancer-header-icon">{selectedTransformation.icon}</span>
                            </div>
                            <div className="enhancer-header-text-wrapper">
                                <h2 className="enhancer-header-title">{t(selectedTransformation.titleKey)}</h2>
                                <p className="enhancer-header-description">{t(selectedTransformation.descriptionKey || '')}</p>
                            </div>
                        </div>

                        <TransformationInputArea
                            transformation={selectedTransformation}
                            onOpenAssetLibrary={(config) => openAssetLibrary(config)}
                        />

                        <button
                            className='btn btn-filled ripple-surface'
                            style={{ width: '100%', height: 48, marginTop: 'auto' }}
                            disabled={isGenerateDisabled}
                            aria-disabled={isGenerateDisabled}
                            aria-busy={isGenerating}
                            aria-label={t(generateLabelKey)}
                            data-loading={isGenerating ? 'true' : 'false'}
                            onClick={selectedTransformation.isVideo ? generateVideo : generateImage}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
                                    <span>{t('app.generating')}</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                    <span>{t(generateLabelKey)}</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '1rem', flexShrink: 0 }}>
                            {t('app.result')}
                        </h2>
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            {isGenerating && <LoadingSpinner message={spinnerMessage} progress={progress} />}
                            {error && <ErrorMessage message={error} />}

                            {!isGenerating && !error && imageOptions && imageOptions.length > 0 && (
                                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                                    <h3 style={{ fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        {selectedTransformation?.isMultiStepVideo ? t('app.chooseYourShot') : t('enhancer.imageOptionsTitle')}
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                                        {imageOptions.map((url, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (selectedTransformation?.isMultiStepVideo) {
                                                        setSelectedOption(url);
                                                    } else {
                                                        const newContent: GeneratedContent = {
                                                            imageUrl: url, text: null,
                                                            timestamp: Date.now(),
                                                            prompt: customPrompt || selectedTransformation?.prompt,
                                                            transformationTitleKey: selectedTransformation?.titleKey,
                                                        };
                                                        setGeneratedContent(newContent);
                                                        useEnhancerStore.setState(state => ({
                                                            enhancerHistory: [newContent, ...state.enhancerHistory]
                                                        }));
                                                        useEnhancerStore.setState({ imageOptions: null });
                                                    }
                                                }}
                                                className="ripple-surface"
                                                style={{
                                                    position: 'relative',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    border: '2px solid',
                                                    borderColor: (selectedTransformation?.isMultiStepVideo && selectedOption === url) 
                                                        ? 'var(--md-sys-color-primary)' 
                                                        : 'transparent',
                                                    transition: 'all 200ms',
                                                    padding: 0,
                                                    background: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Option ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        display: 'block',
                                                        aspectRatio: '1/1',
                                                        objectFit: 'contain',
                                                        backgroundColor: 'var(--md-sys-color-surface)'
                                                    }}
                                                />
                                                {selectedTransformation?.isMultiStepVideo && selectedOption === url && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backgroundColor: 'color-mix(in srgb, var(--md-sys-color-primary), transparent 70%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--md-sys-color-on-primary)' }}>
                                                            check_circle
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedTransformation?.isMultiStepVideo ? (
                                        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                            <button
                                                onClick={generateImage}
                                                className="btn btn-tonal ripple-surface"
                                            >
                                                <span className="material-symbols-outlined">refresh</span>
                                                {t('app.regenerate')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (selectedOption && selectedTransformation.videoPrompt) {
                                                        useEnhancerStore.setState({ 
                                                            primaryImageUrl: selectedOption,
                                                            customPrompt: selectedTransformation.videoPrompt,
                                                            imageOptions: null 
                                                        });
                                                        generateVideo();
                                                    } else {
                                                        useEnhancerStore.setState({ error: "请先选择一张图片以制作动画。" });
                                                    }
                                                }}
                                                disabled={!selectedOption || isGenerating}
                                                className="btn btn-filled ripple-surface"
                                            >
                                                <span className="material-symbols-outlined">movie</span>
                                                {t('app.createVideo')}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={generateImage}
                                            className="btn btn-tonal ripple-surface"
                                            style={{ width: '100%', marginTop: '1rem' }}
                                        >
                                            <span className="material-symbols-outlined">refresh</span>
                                            {t('app.regenerate')}
                                        </button>
                                    )}
                                </div>
                            )}

                            {!isGenerating && !error && !imageOptions && generatedContent && (
                                <ResultDisplay
                                    content={generatedContent}
                                    onImageClick={(url) => setPreviewImageUrl(url)}
                                    originalImageUrl={primaryImageUrl || null}
                                />
                            )}

                            {!isGenerating && !error && !imageOptions && !generatedContent && (
                                <div style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.7 }}>image</span>
                                    <p style={{ marginTop: '0.5rem' }}>{t('app.yourImageWillAppear')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EnhancerPage: React.FC = () => {
    return (
        <MainLayout>
            <EnhancerContent />
        </MainLayout>
    );
};

export default EnhancerPage;