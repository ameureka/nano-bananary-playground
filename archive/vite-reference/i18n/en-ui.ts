// 该文件包含所有与用户界面 (UI) 相关的英文翻译文本。
export default {
  app: {
    title: "🍌 Banana PS Playground",
    history: "History",
    back: "Back",
    edit: "Edit",
    chooseAnotherEffect: "Choose Another Effect",
    generateImage: "Generate",
    generating: "Generating...",
    result: "Result",
    yourImageWillAppear: "Your generated image will appear here.",
    aspectRatio: "Aspect Ratio",
    chooseYourShot: "Choose your favorite shot to animate",
    regenerate: "Regenerate",
    createVideo: "Create Video",
    cancel: "Cancel",
    advancedMode: {
        activated: "✨ Advanced Mode Activated!",
        clicksRemaining: "Click {count} more times to enter Advanced Mode."
    },
    error: {
      uploadAndSelect: "Please upload an image and select an effect.",
      uploadOne: "Please upload at least one image.",
      uploadBoth: "Please upload both required images.",
      enterPrompt: "Please enter a prompt describing the change you want to see.",
      unknown: "An unknown error occurred.",
      useAsInputFailed: "Could not use the generated image as a new input.",
      selectOneToAnimate: "Please select an image to animate.",
    },
    loading: {
      step1: "Step 1: Creating line art...",
      step2: "Step 2: Applying color palette...",
      default: "Generating your masterpiece...",
      wait: "This can sometimes take a moment.",
      videoInit: "Initializing video generation...",
      videoPolling: "Processing video, this may take a few minutes...",
      videoFetching: "Finalizing and fetching your video...",
      generatingOptions: "Generating image options...",
      analyzingStyle: "Analyzing style...",
    },
    theme: {
        switchToLight: "Switch to light theme",
        switchToDark: "Switch to dark theme"
    }
  },
  sidebar: {
    homepage: "Homepage",
    library: "Asset Library",
    chat: "AI Chat",
    toggle: "Toggle sidebar"
  },
  bottomNav: {
    homepage: "Homepage",
    library: "Library",
    chat: "Chat"
  },
  chat: {
    title: "AI Chat",
    placeholder: "Ask me to create an image...",
    settings: "Chat Settings",
    historyLength: "Conversation History Length",
    historyDescription: "Number of past messages (user and AI) to send as context. More messages provide better context but may increase processing time.",
    save: "Save",
    intro: "I'm your creative AI assistant. Describe an image, and I'll bring it to life! For example, try 'a photorealistic image of a cat wearing a space helmet'.",
    attachImage: "Attach Image",
    importFromLibrary: "Import from Library",
    aiPreprocessing: "AI Pre-processing",
    aiPreprocessingDescription: "When enabled, an AI will first refine your prompt for better image generation results based on the app's capabilities.",
    sendImageWithPreprocessing: "Send images for context",
    sendImageWithPreprocessingDescription: "Allows the preprocessing AI to analyze attached images to create a more relevant prompt.",
    creativeDiversification: "Creative Diversification",
    creativeDiversificationDescription: "When enabled, the AI will generate a unique, creative prompt for each image, leading to more varied results. Only applies when preprocessing is on and generating more than one image.",
    numImages: "Number of Images",
    numImagesDescription: "Generate multiple image variations at once.",
    autoRetry: "Auto-retry on failure",
    autoRetryDescription: "Automatically retry up to 3 times if an image generation request fails. This may increase wait times on failure.",
    retryCount: "Retry Attempts",
    retryCountDescription: "Number of times to automatically retry a failed request. Set to 0 to disable.",
    aspectRatio: "Image Aspect Ratio",
    aspectRatioAuto: "Auto",
    confirmClear: "Are you sure you want to clear the entire conversation? This action cannot be undone.",
    regenerate: "Regenerate",
    edit: "Edit",
    clear: "Clear Chat"
  },
  assetLibrary: {
    emptyTitle: "Asset Library is Empty",
    emptyMessage: "Your generated images will appear here.",
    deleteConfirm: "Are you sure you want to delete this image?",
    deleteSelectedConfirm: "Are you sure you want to delete {count} selected images?",
    modalTitle: "Import from Library",
    importSelected: "Import ({count})",
    dropToAdd: "Drop to Add",
    actions: {
      enhance: "Enhance",
      download: "Download",
      delete: "Delete"
    }
  },
  imagePreview: {
    resetView: "Reset View",
    share: "Share",
    delete: "Delete",
    close: "Close"
  },
  topAppBar: {
    selected: "{count} selected",
    selectAll: "Select all assets",
    downloadSelected: "Download selected",
    deleteSelected: "Delete selected",
    cancel: "Cancel selection",
    upload: "Upload",
    import: "Import"
  },
  enhancer: {
    settings: "Enhancer Settings",
    numImages: "Number of Images",
    numImagesDescription: "Generate multiple image variations for applicable effects.",
    autoRetry: "Auto-retry on failure",
    autoRetryDescription: "Automatically retry up to 3 times if an image generation request fails.",
    retryCount: "Retry Attempts",
    retryCountDescription: "Number of times to automatically retry a failed request. Set to 0 to disable.",
    numImagesDisabled: "This effect has a fixed number of outputs.",
    imageOptionsTitle: "Choose your favorite variation",
    devLogsTitle: "Developer Logs",
    downloadLogs: "Download Logs",
    clearLogs: "Clear Logs",
    clearLogsConfirm: "Are you sure you want to clear all logs? This cannot be undone."
  },
  transformationSelector: {
    title: "Welcome to Banana PS Playground!",
    description: "86 creative effects ready to unlock. Choose a category to start your creative journey!",
    searchPlaceholder: "Search for an effect, or describe an idea...",
    aiSearch: "AI Search",
    aiSearchTooltip: "Describe what you want to do and let AI find the best effects!",
    aiSuggestionsTitle: "AI Suggestions",
    aiSearching: "AI is searching for you...",
    localResultsTitle: "Search Results",
    noResults: "No effects found. Try a different search or use AI Search for ideas!",
    promptLabel: "Prompt:"
  },
  imageEditor: {
    upload: "Click to upload",
    dragAndDrop: "or drag and drop",
    importFromLibrary: "Import from Library",
    drawMask: "Draw Mask",
    maskPanelInfo: "Draw on the image to create a mask for localized edits.",
    brushSize: "Brush Size",
    undo: "Undo",
    clearMask: "Clear Mask",
    tools: {
      brush: "Brush",
      polygon: "Polygon Select"
    },
    polygonInstructions: "Click to add points. Double-click to close the shape and fill."
  },
  resultDisplay: {
    viewModes: {
      result: "Result",
      grid: "Grid",
      slider: "Slider",
      sidebyside: "Side-by-Side"
    },
    labels: {
      original: "Original",
      generated: "Generated",
      lineArt: "Line Art",
      finalResult: "Final Result"
    },
    actions: {
      download: "Download",
      downloadBoth: "Download Both",
      downloadComparison: "Download Comparison",
      useAsInput: "Use as Input",
      useLineArtAsInput: "Use Line Art as Input",
      useFinalAsInput: "Use Final as Input"
    },
    sliderPicker: {
      vs: "vs"
    }
  },
  history: {
    title: "Generation History",
    empty: "Your generated images will appear here once you create something.",
    use: "Use",
    save: "Save",
    lineArt: "Line Art",
    finalResult: "Final Result",
    promptUsed: "Prompt Used:",
    time: {
      now: "Just now",
      minutesAgo: "{count}m ago",
      hoursAgo: "{count}h ago",
      daysAgo: "{count}d ago"
    }
  },
  error: {
    title: "An Error Occurred"
  },
};
