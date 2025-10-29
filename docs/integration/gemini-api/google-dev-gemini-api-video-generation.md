好的，这是根据您提供的文件内容转换的 Markdown 格式文档。

***

# Gemini API 文档

> **Veo 3.1 现已发布!** 如需了解新模型及其功能,请参阅[博文](https://cloud.google.com/blog/products/ai-machine-learning/google-veo-gemini-imagen-3-video-image-generation)和[文档](https://cloud.google.com/vertex-ai/docs/generative-ai/video/overview)。

> translated by Google: 此页面由 Cloud Translation API 翻译。

**本页内容**
*   文本转视频生成
*   图片转视频生成
*   使用参考图片
*   使用第一帧和最后一帧
*   延长 Veo 视频
*   处理异步操作
*   Veo API 参数和规范
*   Veo 提示指南
*   安全过滤器
*   提示撰写的基础知识
*   提示用户输入音频
*   使用参考图片进行提示
*   提示扩展
*   提示和输出示例
*   按写作要素划分的示例
*   否定提示
*   宽高比
*   限制
*   模型功能
*   模型版本
    *   Veo 3.1 预览版
    *   Veo 3.1 Fast 预览版
    *   Veo 3
    *   Veo 3 Fast
    *   Veo 2
*   后续步骤

---

[首页](https://ai.google.dev/gemini-api/docs?hl=zh-cn) > [Gemini API](https://ai.google.dev/gemini-api/docs/videos?hl=zh-cn) > Gemini API 文档

## 在 Gemini API 中使用 Veo 3.1 生成视频

Veo 3.1 是 Google 最先进的模型,可生成高保真度的 8 秒 720p 或 1080p 视频,这些视频具有惊人的逼真效果和原生生成的音频。您可以使用 Gemini API 以编程方式访问此模型。如需详细了解可用的 Veo 模型变体,请参阅模型版本部分。

Veo 3.1 在各种视觉和电影风格方面表现出色,并引入了多项新功能:

*   **视频扩展**: 扩展之前使用 Veo 生成的视频。
*   **指定帧生成**: 通过指定第一帧和最后一帧来生成视频。
*   **基于图片的指导**: 使用最多三张参考图片来指导生成的视频的内容。

如需详细了解如何编写有效的文本提示来生成视频,请参阅 [Veo 提示指南](#veo-提示指南)。

### 文本转视频生成

选择一个示例,了解如何生成包含对话、电影级真实感或创意动画的视频:

*   [对话和音效](#)
*   [电影级真实感](#)
*   [创意动画](#)

**JavaScript**
```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const prompt = `Drone shot following a classic red convertible driven by a man along a winding coastal road at sunset.
The convertible accelerates fast and the engine roars loudly.`;

let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt,
});

// Poll the operation status until the video is ready.
while (!operation.done) {
    console.log("Waiting for video generation to complete...")
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
        operation: operation,
    });
}

// Download the generated video.
ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: "realism_example.mp4",
});

console.log('Generated video saved to realism_example.mp4');
```

![Veo 3: Epic Drone Shot Following a Roaring Convertible at Sunset](https://i.ytimg.com/vi/y5hJQ73n3oM/maxresdefault.jpg)

### 图片转视频生成

以下代码演示了如何使用 Gemini 2.5 Flash Image (又称 Nano Banana) 生成图片,然后将该图片用作起始帧,以使用 Veo 3.1 生成视频。

**JavaScript**
```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const prompt = "Panning wide shot of a calico kitten sleeping in the sunshine";

// Step 1: Generate an image with Nano Banana.
const imageResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    prompt: prompt,
});

// Step 2: Generate video with Veo 3.1 using the image.
let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt,
    image: {
        imageBytes: imageResponse.generatedImages[0].image.imageBytes,
        mimeType: "image/png",
    },
});

// Poll the operation status until the video is ready.
while (!operation.done) {
    console.log("Waiting for video generation to complete...")
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
        operation: operation,
    });
}

// Download the video.
ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: "veo3_with_image_input.mp4",
});

console.log('Generated video saved to veo3_with_image_input.mp4');
```

### 使用参考图片

> **★ 注意**: 此功能仅适用于 Veo 3.1 型号

Veo 3.1 现在最多可接受 3 张参考图片,以指导生成的视频的内容。提供人物、角色或产品的图片,以便在输出视频中保留该主题的外观。

例如,使用 Nano Banana 生成的这三张图片作为参考,并搭配精心撰写的提示,即可生成以下视频:

**Python**
```python
import time
from google import genai
from google.generativeai import types

client = genai.Client()

prompt = "The video opens with a medium, eye-level shot of a beautiful woman with dark hair and warm brown eyes. She wears a floral dress and stylish sunglasses."

dress_reference = types.VideoGenerationReferenceImage(
    image=dress_image, # Generated separately with Nano Banana
    reference_type="asset"
)
sunglasses_reference = types.VideoGenerationReferenceImage(
    image=glasses_image, # Generated separately with Nano Banana
    reference_type="asset"
)
woman_reference = types.VideoGenerationReferenceImage(
    image=woman_image, # Generated separately with Nano Banana
    reference_type="asset"
)

operation = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    prompt=prompt,
    config=types.GenerateVideosConfig(
        reference_images=[dress_reference, glasses_reference, woman_reference],
    ),
)

# Poll the operation status until the video is ready.
while not operation.done:
    print("Waiting for video generation to complete...")
    time.sleep(10)
    operation = client.operations.get(operation)

# Download the video.
video = operation.response.generated_videos[0]
client.files.download(file=video.video)
video.video.save("veo3.1_with_reference_images.mp4")
print("Generated video saved to veo3.1_with_reference_images.mp4")
```

![Flamingo fashion cat-walk in a sun-drenched lagoon](https://storage.googleapis.com/gweb-aip-images/videos/Flamingo%20fashion%20cat-walk%20in%20a%20sun-drenched%20lagoon_Light.gif)

### 使用第一帧和最后一帧

> **★ 注意**: 此功能仅适用于 Veo 3.1 型号

借助 Veo 3.1,您可以使用插值或指定视频的第一帧和最后一帧来创建视频。如需了解如何编写有效的文本提示来生成视频,请参阅 [Veo 提示指南](#veo-提示指南)。

**Python**
```python
import time
from google import genai
from google.generativeai import types

client = genai.Client()

prompt = "A cinematic, haunting video. A ghostly woman with long white hair and a flowing dress swings gently on a rope swing in a misty, enchanted forest."

operation = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    prompt=prompt,
    image=first_image, # Generated separately with Nano Banana
    config=types.GenerateVideosConfig(
        last_frame=last_image # Generated separately with Nano Banana
    ),
)

# Poll the operation status until the video is ready.
while not operation.done:
    print("Waiting for video generation to complete...")
    time.sleep(10)
    operation = client.operations.get(operation)

# Download the video.
video = operation.response.generated_videos[0]
client.files.download(file=video.video)
video.video.save("veo3.1_with_interpolation.mp4")
print("Generated video saved to veo3.1_with_interpolation.mp4")
```

### 延长 Veo 视频

> **★ 注意**: 此功能仅适用于 Veo 3.1 型号

使用 Veo 3.1 可将之前使用 Veo 生成的视频延长 7 秒,最多可延长 20 次。

**输入视频限制:**

*   Veo 生成的视频时长上限为 141 秒。
*   Gemini API 仅支持 Veo 生成的视频的视频扩展功能。
*   输入视频应具有一定的时长、宽高比和尺寸:
    *   宽高比: 9:16 或 16:9
    *   分辨率: 720p
    *   视频时长: 不超过 141 秒

该扩展程序的输出是一个视频,其中包含用户输入的视频和生成的扩展视频,总时长最长为 148 秒。

此示例采用 Veo 生成的视频 `butterfly_video` (此处显示了其原始提示),并使用 `video` 参数和新提示对其进行扩展:

**Python**
```python
import time
from google import genai
from google.generativeai import types

client = genai.Client()

prompt = "Track the butterfly into the garden as it lands on an orange origami flower. A fluffy white puppy runs up and sniffs at the butterfly."

operation = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    video=butterfly_video,
    prompt=prompt,
    config=types.GenerateVideosConfig(
        number_of_videos=1,
        resolution="720p"
    ),
)

# Poll the operation status until the video is ready.
while not operation.done:
    print("Waiting for video generation to complete...")
    time.sleep(10)
    operation = client.operations.get(operation)

# Download the video.
video = operation.response.generated_videos[0]
client.files.download(file=video.video)
video.video.save("veo3.1_extension.mp4")
print("Generated video saved to veo3.1_extension.mp4")
```

![A beautiful day for origami and puppies!](https://storage.googleapis.com/gweb-aip-images/videos/A%20beautiful%20day%20for%20origami%20and%20puppies!_Light.gif)

### 处理异步操作

生成视频是一项计算密集型任务。当您向 API 发送请求时,它会启动一个长时间运行的作业,并立即返回一个 `operation` 对象。然后,您必须进行轮询,直到视频准备就绪 (以 `done` 状态为 `true` 表示)。

此流程的核心是一个轮询循环,用于定期检查作业的状态。

**JavaScript**
```javascript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

// After starting the job, you get an operation object.
let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: "A cinematic shot of a majestic lion in the savannah.",
});

// Alternatively, you can use operation.name to get the operation.
// operation = types.GenerateVideosOperation(name=operation.name)

// This loop checks the job status every 10 seconds.
while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    // Refresh the operation object to get the latest status.
    operation = await ai.operations.getVideosOperation({ operation });
}

// Once done, the result is in operation.response.
// ... process and download your video ...```

## Veo API 参数和规范

您可以在 API 请求中设置以下参数来控制视频生成过程。

| 参数 | 说明 | Veo 3.1 和 Veo 3.1 Fast | Veo 3 和 Veo 3 Fast | Veo 2 |
| :--- | :--- | :--- | :--- | :--- |
| **prompt** | 视频的文字说明。支持音频提示。 | string | string | string |
| **negativePrompt** | 描述视频中不应包含的内容的文字。 | string | string | string |
| **image** | 要添加动画效果的初始图片。 | Image 对象 | Image 对象 | Image 对象 |
| **lastFrame** | 插值视频要过渡到的最终图片。必须与 `image` 参数搭配使用。 | Image 对象 | Image 对象 | Image 对象 |
| **referenceImages** | 最多三张图片,用作风格和内容参考。 | `VideoGenerationReferenceImage` 对象 (仅限 Veo 3.1) | 无 | 无 |
| **video** | 用于视频广告附加信息的视频。 | Video 对象 | 无 | 无 |
| **aspectRatio** | 视频的宽高比。 | "16:9" (默认, 720p 和 1080p)、"9:16" (720p 和 1080p) | "16:9" (默认, 720p 和 1080p)、"9:16" (720p 和 1080p) | "16:9" (默认, 720p)、"9:16" (720p) |
| **resolution** | 视频的宽高比。 | "720p" (默认)、"1080p" (仅支持 8 秒时长) <br> "720p" 仅适用于扩展程序 | "720p" (默认)、"1080p" (仅限 16:9) | 不支持 |
| **durationSeconds** | 生成的视频的时长。 | "4", "6", "8"。 <br> 使用扩展或插值时 (同时支持 16:9 和 9:16) 以及使用 `referenceImages` 时 (仅支持 16:9),必须为 "8" | "4", "6", "8" | "5", "6", "8" |
| **personGeneration** | 控制人物生成。(有关地区限制,请参阅[限制](#限制)) | 文生视频和扩展功能: 仅限 `"allow_all"` <br> 图生视频、插帧和参考图片: 仅限 `"allow_adult"` | 文生视频: 仅限 `"allow_all"` <br> 图生视频: 仅限 `"allow_adult"` | 文生视频: `"allow_all"`, `"allow_adult"`, `"dont_allow"` <br> 图生视频: `"allow_adult"` 和 `"dont_allow"` |

请注意, `seed` 参数也适用于 Veo 3 模型。它不能保证确定性,但可以略微提高确定性。

您可以在请求中设置参数,来自定义视频生成。例如,您可以指定 `negativePrompt` 来引导模型。

**JavaScript**
```javascript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: "A cinematic shot of a majestic lion in the savannah.",
    config: {
        aspectRatio: "16:9",
        negativePrompt: "cartoon, drawing, low quality"
    },
});

// Poll the operation status until the video is ready.
while (!operation.done) {
    console.log("Waiting for video generation to complete...")
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
        operation: operation,
    });
}

// Download the generated video.
ai.files.download({
    file: operation.response.generatedVideos[0].video,
    downloadPath: "parameters_example.mp4",
});
console.log('Generated video saved to parameters_example.mp4');
```

## Veo 提示指南

本部分包含一些示例视频,展示了如何使用 Veo 创建视频,以及如何修改提示以生成不同的结果。

### 安全过滤器

Veo 会在 Gemini 中应用安全过滤条件,以帮助确保生成的视频和上传的照片不包含冒犯性内容。违反我们[条款](https://ai.google.dev/terms)和[准则](https://ai.google.dev/docs/responsible_ai)的提示会被屏蔽。

### 提示撰写的基础知识

好的提示应具有描述性且清晰明了。如要充分利用 Veo,请先确定核心创意,然后通过添加关键字和修饰符来完善创意,并在提示中加入视频专用术语。

您的提示应包含以下元素:

*   **正文**: 您希望在视频中呈现的对象、人物、动物或场景,例如城市景观、自然、车辆或小狗。
*   **动作**: 正文正在做的事情 (例如,走路、跑步或转头)。
*   **风格**: 使用特定的电影风格关键字 (例如科幻、恐怖片、黑色电影) 或动画风格关键字 (例如卡通) 指定创意方向。
*   **相机定位和运动**: [可选] 使用航拍、平视、俯拍、轨道拍摄或仰拍等术语控制相机的位置和运动。
*   **构图**: [可选] 拍摄镜头的构图方式,例如广角镜头、特写镜头、单人镜头或双人镜头。
*   **对焦和镜头效果**: [可选] 使用浅景深、深景深、柔焦、微距镜头和广角镜头等术语来实现特定的视觉效果。
*   **氛围**: [可选] 颜色和光线对场景的贡献,例如蓝色调、夜间或暖色调。

有关撰写提示的更多技巧

*   **使用描述性语言**: 使用形容词和副词为 Veo 描绘清晰的画面。
*   **增强面部细节**: 指定面部细节作为照片的焦点,例如在提示中使用 “portrait” (人像) 一词。

如需了解更全面的提示策略,请参阅[提示设计简介](https://ai.google.dev/docs/prompt_design_intro)。

### 提示用户输入音频

借助 Veo 3,您可以为音效、环境噪音和对话提供提示。该模型会捕捉这些提示的细微差别,以生成同步的音轨。

*   **对话**: 使用引号表示具体对话。(例如: “这一定是钥匙,” 他低声说道。)
*   **音效 (SFX)**: 明确描述声音。(示例: 轮胎发出刺耳的尖叫声,发动机发出轰鸣声。)
*   **环境噪音**: 描述环境的声景。(示例: 背景中回荡着微弱而诡异的嗡嗡声。)

### 使用参考图片进行提示

您可以利用 Veo 的图片转视频功能,使用一张或多张图片作为输入来引导生成的视频。Veo 会将输入图片用作初始帧。

借助 Veo 3.1,您可以参考图片或素材来指导生成的视频内容。提供最多三张单个人物、角色或产品的素材资源图片。Veo 会在输出视频中保留主题的外观。

使用 Veo 3.1,您还可以通过指定视频的第一帧和最后一帧来生成视频。

### 提示扩展

如需使用 Veo 3.1 延长 Veo 生成的视频,请将该视频用作输入内容,并提供可选的文本提示。“延长”功能会完成视频的最后一秒或 24 帧,并继续执行动作。

### 否定提示

排除提示用于指定您不希望在视频中包含的元素。
*   ❌ 请勿使用“没有”或“不”等指令性语言。(例如“无墙”)。
*   ✔ 请描述您不想看到的内容。(例如“墙、框架”)。

### 宽高比

您可以使用 Veo 指定视频的宽高比。

## 限制

*   **请求延迟时间**: 最短: 11 秒; 最长: 6 分钟 (高峰时段)。
*   **地区限制**: 在欧盟、英国、瑞士、中东和北非地区, `personGeneration` 的允许值为:
    *   **Veo 3**: 仅限 `allow_adult`。
    *   **Veo 2**: `dont_allow` 和 `allow_adult`。默认值为 `dont_allow`。
*   **视频保留期限**: 生成的视频会在服务器上存储 2 天,之后会被移除。如需保存本地副本,您必须在视频生成后的 2 天内下载视频。扩展视频会被视为新生成的视频。
*   **添加水印**: Veo 制作的视频会使用 [SynthID](https://deepmind.google/discover/blog/identifying-ai-generated-images-with-synthid/) (我们的 AI 生成内容水印添加和识别工具) 添加水印。

## 模型功能

| 功能 | 说明 | Veo 3.1 和 Veo 3.1 Fast | Veo 3 和 Veo 3 Fast | Veo 2 |
| :--- | :--- | :--- | :--- | :--- |
| **音频** | 原生生成包含音频的视频。 | 原生生成包含音频的视频。 | ✔ 始终开启 | ❌ 仅限静音 |
| **输入模态** | 用于生成的输入类型。 | 文生视频、图生视频、视频转视频 | 文生视频、图生视频 | 文生视频、图生视频 |
| **解决方法** | 视频的输出分辨率。 | 720p 和 1080p (仅限 8 秒时长) <br> 使用视频扩展广告时仅限 720p。 | 720p 和 1080p (仅限 16:9) | 720p |
| **帧速率** | 视频的输出帧速率。 | 24 帧/秒 | 24 帧/秒 | 24 帧/秒 |
| **视频时长** | 生成的视频的时长。 | 8 秒、6 秒、4 秒 <br> 仅在使用参考图片时为 8 秒 | 8 秒 | 5-8 秒 |
| **每个请求的视频数量** | 每个请求生成的视频数量。 | 1 | 1 | 1 或 2 |
| **状态和详细信息** | 型号供应情况和更多详细信息。 | [预览](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/model-versioning) | [稳定版](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/model-versioning) | [稳定版](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/model-versioning) |

## 模型版本

如需详细了解特定于 Veo 模型的用量,请参阅[价格](https://ai.google.dev/pricing)和[速率限制](https://ai.google.dev/gemini-api/docs/models/generative-language)页面。

### Veo 3.1 预览版

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `veo-3.1-generate-preview` |
| **支持的数据类型** | **输入**: 文字、图片 <br> **输出**: 带音频的视频 |
| **限制** | **文本输入**: 1,024 个 token <br> **输出视频**: 1 |
| **最新更新** | 2025 年 9 月 |

### Veo 3.1 Fast 预览版

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `veo-3.1-fast-generate-preview` |
| **支持的数据类型** | **输入**: 文字、图片 <br> **输出**: 带音频的视频 |
| **限制** | **文本输入**: 1,024 个 token <br> **输出视频**: 1 |
| **最新更新** | 2025 年 9 月 |

### Veo 3

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `veo-3.0-generate-001` |
| **支持的数据类型** | **输入**: 文字、图片 <br> **输出**: 带音频的视频 |
| **限制** | **文本输入**: 1,024 个 token <br> **输出视频**: 1 |
| **最新更新** | 2025 年 7 月 |

### Veo 3 Fast

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `veo-3.0-fast-generate-001` |
| **支持的数据类型** | **输入**: 文字、图片 <br> **输出**: 带音频的视频 |
| **限制** | **文本输入**: 1,024 个 token <br> **输出视频**: 1 |
| **最新更新** | 2025 年 7 月 |

### Veo 2

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `veo-2.0-generate-001` |
| **支持的数据类型** | **输入**: 文字、图片 <br> **输出**: 视频 |
| **限制** | **文本输入**: 不适用 <br> **图片输入**: 任意分辨率和宽高比, 文件大小不超过 20MB <br> **输出视频**: 最多 2 个 |
| **最新更新** | 2025 年 4 月 |

## 后续步骤

*   您可以尝试使用 [Veo 快速入门 Colab](https://colab.research.google.com/github/google/generative-ai-docs/blob/main/site/en/gemini-api/docs/Veo_Quickstart.ipynb) 和 [Veo 3.1 applet](https://experiments.google/veo-api),开始使用 Veo 3.1 API。
*   不妨参阅我们的[提示设计简介](https://ai.google.dev/docs/prompt_design_intro),了解如何撰写更好的提示。