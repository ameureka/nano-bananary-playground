// 该文件包含所有与用户界面 (UI) 相关的中文翻译文本。
export default {
  app: {
    title: "🍌 香蕉PS乐园",
    history: "历史记录",
    back: "返回",
    edit: "编辑",
    chooseAnotherEffect: "选择其他效果",
    generateImage: "生成",
    generating: "生成中...",
    result: "结果",
    yourImageWillAppear: "您生成的图像将显示在这里。",
    aspectRatio: "宽高比",
    chooseYourShot: "选择你最喜欢的照片制作成动画",
    regenerate: "重新生成",
    createVideo: "创建视频",
    cancel: "取消",
    advancedMode: {
        activated: "✨ 已进入进阶模式！",
        clicksRemaining: "再点击 {count} 次进入进阶模式。"
    },
    error: {
      uploadAndSelect: "请上传图像并选择一个效果。",
      uploadOne: "请至少上传一张图片。",
      uploadBoth: "请上传两个所需的图像。",
      enterPrompt: "请输入一个描述您想看到的更改的提示。",
      unknown: "发生未知错误。",
      useAsInputFailed: "无法使用生成的图像作为新输入。",
      selectOneToAnimate: "请选择一张图片以制作动画。",
    },
    loading: {
        step1: "第1步：创建线稿...",
        step2: "第2步：应用调色板...",
        default: "正在生成您的杰作...",
        wait: "这有时可能需要一些时间。",
        videoInit: "正在初始化视频生成...",
        videoPolling: "正在处理视频，这可能需要几分钟...",
        videoFetching: "正在完成并获取您的视频...",
        generatingOptions: "正在生成图片选项...",
        analyzingStyle: "正在分析风格...",
    },
    theme: {
        switchToLight: "切换到浅色主题",
        switchToDark: "切换到深色主题"
    }
  },
  sidebar: {
    homepage: "主页",
    library: "资产库",
    chat: "AI 聊天",
    toggle: "切换侧边栏"
  },
  bottomNav: {
    homepage: "主页",
    library: "资产库",
    chat: "聊天"
  },
  chat: {
    title: "AI 聊天",
    placeholder: "让我为你画张图吧...",
    settings: "聊天设置",
    historyLength: "对话历史长度",
    historyDescription: "作为上下文发送的过去消息（用户和AI）的数量。更多的消息可以提供更好的上下文，但可能会增加处理时间。",
    save: "保存",
    intro: "我是你的创意AI助手。描述一幅图像，我就会把它变为现实！例如，试试‘一张猫戴着太空头盔的照片’。",
    attachImage: "附加图片",
    importFromLibrary: "从资产库导入",
    aiPreprocessing: "AI 预处理",
    aiPreprocessingDescription: "启用后，AI 将首先根据应用的功能优化您的提示，以获得更好的图像生成结果。",
    sendImageWithPreprocessing: "发送图片以获取上下文",
    sendImageWithPreprocessingDescription: "允许预处理 AI 分析附加的图片，以创建更相关的提示。",
    creativeDiversification: "创意多样化",
    creativeDiversificationDescription: "启用后，AI将为每张图片生成一个独特的创意提示，从而产生更多样化的结果。仅在AI预处理开启且生成图片数量大于1时生效。",
    numImages: "生成图片数量",
    numImagesDescription: "一次生成多个图片变体。",
    autoRetry: "失败时自动重试",
    autoRetryDescription: "如果图片生成请求失败，自动重试最多3次。这可能会增加失败时的等待时间。",
    retryCount: "重试次数",
    retryCountDescription: "自动重试失败请求的次数。设置为0以禁用。",
    aspectRatio: "图片宽高比",
    aspectRatioAuto: "自动",
    confirmClear: "您确定要清空整个对话吗？此操作无法撤销。",
    regenerate: "重新生成",
    edit: "编辑",
    clear: "清空对话"
  },
  assetLibrary: {
    emptyTitle: "资产库为空",
    emptyMessage: "您生成的图片将会出现在这里。",
    deleteConfirm: "您确定要删除这张图片吗？",
    deleteSelectedConfirm: "您确定要删除所选的 {count} 张图片吗？",
    modalTitle: "从资产库导入",
    importSelected: "导入 ({count})",
    dropToAdd: "拖放到此处添加",
    actions: {
      enhance: "增强",
      download: "下载",
      delete: "删除"
    }
  },
  imagePreview: {
    resetView: "重置视图",
    share: "分享",
    delete: "删除",
    close: "关闭"
  },
  topAppBar: {
    selected: "已选择 {count} 项",
    selectAll: "全选资产",
    downloadSelected: "下载所选",
    deleteSelected: "删除所选",
    cancel: "取消选择",
    upload: "上传",
    import: "导入"
  },
  enhancer: {
    settings: "主页设置",
    numImages: "生成图片数量",
    numImagesDescription: "为适用的效果生成多个图片变体。更改设置后请清除原图再重新添加，否则将无法应用设置。",
    autoRetry: "失败时自动重试",
    autoRetryDescription: "如果请求失败，自动重试最多3次。",
    retryCount: "重试次数",
    retryCountDescription: "自动重试失败请求的次数。设置为0以禁用。",
    numImagesDisabled: "此效果的输出数量是固定的。",
    imageOptionsTitle: "选择你最喜欢的变体",
    devLogsTitle: "开发者日志",
    downloadLogs: "下载日志",
    clearLogs: "清除日志",
    clearLogsConfirm: "您确定要清除所有日志吗？此操作无法撤销。"
  },
  transformationSelector: {
    title: "欢迎来到香蕉PS乐园！",
    description: "86种创意魔法等你解锁，选择一个类别开始你的创作之旅吧～",
    descriptionWithResult: "真有趣！你上一个创作已经准备好进行下一轮了。选择一个新的效果来继续这个创作链吧。",
    searchPlaceholder: "搜索效果，或描述一个想法...",
    aiSearch: "AI 搜索",
    aiSearchTooltip: "描述您想做什么，让AI找到最佳效果！",
    aiSuggestionsTitle: "AI 推荐",
    aiSearching: "AI 正在为您搜索...",
    localResultsTitle: "搜索结果",
    noResults: "未找到任何效果。请尝试其他搜索词或使用AI搜索获取灵感！",
    promptLabel: "提示词："
  },
  imageEditor: {
    upload: "点击上传",
    dragAndDrop: "或拖放文件",
    importFromLibrary: "从资产库导入",
    drawMask: "绘制蒙版",
    maskPanelInfo: "在图像上绘制以创建用于局部编辑的蒙版。",
    brushSize: "笔刷大小",
    undo: "撤销",
    clearMask: "清除蒙版",
    tools: {
      brush: "画笔",
      polygon: "多边形选择"
    },
    polygonInstructions: "点击添加点，双击闭合形状并填充。"
  },
  resultDisplay: {
    viewModes: {
      result: "结果",
      grid: "网格",
      slider: "滑块",
      sidebyside: "并排"
    },
    labels: {
      original: "原图",
      generated: "生成图",
      lineArt: "线稿",
      finalResult: "最终结果"
    },
    actions: {
      download: "下载",
      downloadBoth: "下载全部",
      downloadComparison: "下载对比图",
      useAsInput: "用作输入",
      useLineArtAsInput: "使用线稿作为输入",
      useFinalAsInput: "使用最终结果作为输入"
    },
    sliderPicker: {
      vs: "对"
    },
    empty: {
      title: "结果",
      description: "您生成的图像将显示在这里。"
    }
  },
  history: {
    title: "生成历史",
    empty: "一旦您创造了某些东西，您生成的图像就会出现在这里。",
    use: "使用",
    save: "保存",
    lineArt: "线稿",
    finalResult: "最终结果",
    promptUsed: "使用的提示词：",
    time: {
      now: "刚刚",
      minutesAgo: "{count}分钟前",
      hoursAgo: "{count}小时前",
      daysAgo: "{count}天前"
    }
  },
  error: {
    title: "发生错误"
  },
};
