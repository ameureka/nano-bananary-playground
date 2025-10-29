'use client';

export const dynamic = 'force-dynamic';

import React, { useRef, useEffect, useState, KeyboardEvent, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTranslation } from '@/i18n/context';
import type { ChatMessage } from '@/types';
import { useChatStore } from '@/store/chatStore';
import { useLayout } from '@/components/layout/LayoutContext';

/**
 * AI 聊天页面
 * 该页面现在通过 useLayout 钩子从父布局组件获取所需的回调函数。
 */
const ChatContent: React.FC = () => {
  const { t } = useTranslation();
  const {
    allPrompts, 
    setPreviewImageUrl: onImageClick, 
    onAttachImage, 
    openAssetLibraryModal,
    addChatInputImages
  } = useLayout();

  const {
    chatHistory, isPreprocessing, chatInputImages, chatInputText,
    isLoading, chatLoadingProgress, setChatInputText, removeChatInputImage,
    executeSendMessage, regenerateLastMessage, startEditingMessage,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatViewContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isAttachMenuClosing, setIsAttachMenuClosing] = useState(false);

  const handleSendMessage = useCallback(async (message: string, images: string[]) => {
      if ((!message.trim()) && images.length === 0) return;
      const historyForApi = [...chatHistory].slice(-useChatStore.getState().chatSettings.historyLength);
      executeSendMessage(message, images, historyForApi, allPrompts);
  }, [chatHistory, executeSendMessage, allPrompts]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInputText(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [chatInputText]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const toggleAttachMenu = () => {
    if (isLoading || isPreprocessing) return;
    if (isAttachMenuOpen) setIsAttachMenuClosing(true);
    else { setIsAttachMenuOpen(true); setIsAttachMenuClosing(false); }
  };
  const handleMenuAnimationEnd = () => {
    if (isAttachMenuClosing) { setIsAttachMenuOpen(false); setIsAttachMenuClosing(false); }
  };

  const onImportFromLibrary = () => openAssetLibraryModal({
    selectionMode: 'multiple',
    onSelect: (urls) => addChatInputImages(urls)
  });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
        if (!event.clipboardData) return;
        const imageFiles = Array.from(event.clipboardData.items)
            .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
            .map(item => item.getAsFile());

        if (imageFiles.length > 0 && imageFiles.some(f => f !== null)) {
            event.preventDefault();
            const imagePromises = imageFiles.filter((f): f is File => f !== null).map(file => 
              new Promise<string>(res => {
                  const reader = new FileReader();
                  reader.onload = (e) => res(e.target?.result as string);
                  reader.onerror = () => res('');
                  reader.readAsDataURL(file);
              })
            );
            Promise.all(imagePromises).then(imgs => addChatInputImages(imgs.filter(img => img)));
        }
    };

    const container = chatViewContainerRef.current;
    if (container) {
      container.addEventListener('paste', handlePaste);
      return () => container.removeEventListener('paste', handlePaste);
    }
  }, [addChatInputImages]);

  const handleSend = () => {
    if ((chatInputText.trim() || chatInputImages.length > 0) && !isLoading && !isPreprocessing) {
      handleSendMessage(chatInputText.trim(), chatInputImages);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  return (
    <div className="chat-view-container" ref={chatViewContainerRef}>
      <div className="chat-messages-container">
        {chatHistory.length === 0 && !isLoading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', marginBottom: '1rem', color: 'var(--md-sys-color-primary)' }}>auto_awesome</span>
                <p style={{maxWidth: '40ch', lineHeight: 1.5}}>{t('chat.intro')}</p>
            </div>
        )}
        {chatHistory.map((msg, index) => {
          const textParts = msg.parts.filter(p => p.text);
          const imageParts = msg.parts.filter(p => p.imageUrl);

          return (
            <div key={index} className={`chat-message ${msg.role}`}>
              {msg.role === 'user' && !isLoading && (
                  <div className="chat-bubble-actions">
                      <button onClick={() => startEditingMessage(index)} className="icon-btn ripple-surface" title={t('chat.edit')}>
                          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>edit</span>
                      </button>
                  </div>
              )}
              <div className="chat-bubble">
                {textParts.map((part, partIndex) => <p key={`text-${partIndex}`} style={{whiteSpace: 'pre-wrap'}}>{part.text}</p> )}
                {imageParts.length > 0 && (
                   <div className="chat-bubble-image-gallery">
                      {imageParts.map((part, partIndex) => (
                        <div key={`img-${partIndex}`} className="chat-image-wrapper"><img src={part.imageUrl!} alt="Content" onClick={() => onImageClick(part.imageUrl!)} /></div>
                      ))}
                   </div>
                )}
              </div>
              {msg.role === 'model' && !isLoading && index === chatHistory.length - 1 && (
                  <div className="chat-bubble-actions">
                      <button onClick={() => regenerateLastMessage(allPrompts)} className="icon-btn ripple-surface" title={t('chat.regenerate')}>
                          <span className="material-symbols-outlined" style={{fontSize: '18px'}}>refresh</span>
                      </button>
                  </div>
              )}
            </div>
          );
        })}
        {isLoading && (
            <div className="chat-message model">
                <div className="chat-bubble" style={{ minWidth: '140px' }}>
                    <div className="pseudo-progress-bar"><div className="pseudo-progress-bar-inner" style={{ width: `${chatLoadingProgress}%` }}></div></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        {chatInputImages.length > 0 && (
            <div className="chat-input-attachment-grid">
              {chatInputImages.map((image, index) => (
                <div key={index} className="chat-input-image-preview">
                    <img src={image} alt="Attachment preview" />
                    <button onClick={() => removeChatInputImage(index)} className="icon-btn remove-img-btn ripple-surface">
                        <span className="material-symbols-outlined" style={{fontSize: '18px'}}>close</span>
                    </button>
                </div>
              ))}
            </div>
        )}
        <div className="chat-input-area">
            <div style={{ position: 'relative' }}>
                <button className="icon-btn ripple-surface" onClick={toggleAttachMenu} disabled={isLoading || isPreprocessing} title={t('chat.attachImage')}><span className="material-symbols-outlined">add_circle</span></button>
                {isAttachMenuOpen && (
                    <div onAnimationEnd={handleMenuAnimationEnd} className={`chat-attach-menu ${isAttachMenuClosing ? 'animating-out' : 'animating-in'}`}>
                        <button className="btn btn-text ripple-surface" onClick={() => { onAttachImage(); toggleAttachMenu(); }} style={{ justifyContent: 'flex-start', color: 'var(--md-sys-color-on-surface-variant)'}}><span className="material-symbols-outlined">add_photo_alternate</span>{t('chat.attachImage')}</button>
                        <button className="btn btn-text ripple-surface" onClick={() => { onImportFromLibrary(); toggleAttachMenu(); }} style={{ justifyContent: 'flex-start', color: 'var(--md-sys-color-on-surface-variant)'}}><span className="material-symbols-outlined">photo_library</span>{t('chat.importFromLibrary')}</button>
                    </div>
                )}
            </div>
            <textarea ref={textareaRef} className="chat-input-textarea" rows={1} placeholder={t('chat.placeholder')} value={chatInputText} onInput={handleInput} onKeyDown={handleKeyDown} disabled={isLoading || isPreprocessing}/>
            <button className="icon-btn btn-filled ripple-surface" onClick={handleSend} disabled={isLoading || isPreprocessing || (!chatInputText.trim() && chatInputImages.length === 0)}>
                {isPreprocessing ? (<span className="material-symbols-outlined" style={{animation: 'spin 1s linear infinite'}}>progress_activity</span>) : (<span className="material-symbols-outlined">send</span>)}
            </button>
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  return (
    <MainLayout>
      <ChatContent />
    </MainLayout>
  );
};

export default ChatPage;