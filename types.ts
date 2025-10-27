// 定义单个变换效果或类别的数据结构
export interface Transformation {
  key: string; // 唯一标识符
  titleKey: string; // 用于国际化的标题键
  icon: string; // Material Symbols 图标名称
  prompt?: string; // 发送给 AI 模型的默认提示词
  descriptionKey?: string; // 用于国际化的描述键
  items?: Transformation[]; // 如果是类别，则包含子效果项
  isMultiImage?: boolean; // 是否需要多个输入图像
  isSecondaryOptional?: boolean; // 第二个输入图像是否可选
  isTwoStep?: boolean; // 是否是分两步处理的效果
  stepTwoPrompt?: string; // 第二步处理的提示词
  primaryUploaderTitle?: string; // 主上传区域的标题键
  secondaryUploaderTitle?: string; // 次上传区域的标题键
  primaryUploaderDescription?: string; // 主上传区域的描述键
  secondaryUploaderDescription?: string; // 次上传区域的描述键
  isVideo?: boolean; // 是否是视频生成效果
  maxImages?: number; // 最大支持的输入图像数量
  isMultiStepVideo?: boolean; // 是否是先生成图片再生成视频的多步骤效果
  videoPrompt?: string; // 用于视频生成的提示词
  isStyleMimic?: boolean; // 是否是风格模仿效果
}

// 定义 AI 生成内容的数据结构
export interface GeneratedContent {
  imageUrl: string | null; // 生成的图片 URL (Data URL)
  text: string | null; // AI 返回的文本内容
  secondaryImageUrl?: string | null; // 用于两步效果的中间图片 URL
  videoUrl?: string; // 生成的视频 URL
  // 以下为用于历史记录的上下文信息
  timestamp?: number; // 生成时间戳
  prompt?: string; // 使用的提示词
  transformationTitleKey?: string; // 使用的效果的标题键
}

// 定义应用的主要视图类型
export type View = 'enhancer' | 'library' | 'chat';

// 定义聊天消息中单个部分的数据结构
export interface ChatMessagePart {
  text?: string; // 文本内容
  imageUrl?: string; // 图片 URL
}

// 定义单条聊天消息的数据结构
export interface ChatMessage {
  role: 'user' | 'model'; // 消息发送者角色：用户或模型
  parts: ChatMessagePart[]; // 消息包含的多个部分（文本或图片）
}

// 定义图像宽高比的类型
export type ImageAspectRatio = 'Auto' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
