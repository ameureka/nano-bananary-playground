好的，这是根据您提供的文件内容转换的 Markdown 格式文档。

***

# Gemini API 文档

> **Veo 3.1 现已发布!** 如需了解新模型及其功能,请参阅[博文](https://cloud.google.com/blog/products/ai-machine-learning/google-veo-gemini-imagen-3-video-image-generation)和[文档](https://cloud.google.com/vertex-ai/docs/generative-ai/video/overview)。

> translated by Google: 此页面由 Cloud Translation API 翻译。

**本页内容**
*   图片生成 (文本转图片)
*   图片编辑 (文字和图片转图片)
*   其他图片生成模式
*   提示指南和策略
*   用于生成图片的提示
*   用于修改图片的提示
*   最佳做法
*   限制
*   可选配置
*   输出类型
*   宽高比
*   何时使用 Imagen
*   后续步骤

---

[首页](https://ai.google.dev/gemini-api/docs?hl=zh-cn) > [Gemini API](https://ai.google.dev/gemini-api/docs?hl=zh-cn) > Gemini API 文档

## 使用 Gemini (又称 Nano Banana) 生成图片

Gemini 可以通过对话方式生成和处理图片。你可以通过文字、图片或两者结合的方式向 Gemini 发出提示,从而以前所未有的控制力来创建、修改和迭代视觉内容:

*   **Text-to-Image**: 根据简单或复杂的文本描述生成高质量图片。
*   **图片 + Text-to-Image (编辑)**: 提供图片,并使用文本提示添加、移除或修改元素、更改风格或调整色彩分级。
*   **多图到图 (合成和风格迁移)**: 使用多张输入图片合成新场景,或将一张图片的风格迁移到另一张图片上。
*   **迭代优化**: 通过对话在多轮互动中逐步优化图片,进行细微调整,直至达到理想效果。
*   **高保真文本渲染**: 准确生成包含清晰易读且位置合理的文本的图片,非常适合用于徽标、图表和海报。

所有生成的图片都包含 [SynthID](https://deepmind.google/discover/blog/identifying-ai-generated-images-with-synthid/) 水印。

### 图片生成 (文本转图片)

以下代码演示了如何根据描述性提示生成图片。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}

main();
```

![AI 生成的图片：Gemini 主题餐厅中的 Nano Banana 菜肴](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0c198642-4f16-430c-a63e-f1870daacb1b/gemini-native-image.png)
*AI 生成的图片: Gemini 主题餐厅中的 Nano Banana 菜肴*

### 图片编辑 (文字和图片转图片)

> **提醒**: 请确保您对上传的所有图片均拥有必要权利。请勿生成会侵犯他人权利的内容,包括会欺骗、骚扰或伤害他人的视频或图片。使用此生成式 AI 服务时须遵守我们的《[使用限制政策](https://ai.google.dev/terms)》。

以下示例演示了如何上传采用 base64 编码的图片。如需了解多张图片、较大载荷和支持的 MIME 类型,请参阅[图片理解页面](https://ai.google.dev/gemini-api/docs/prompting-multimodal?hl=zh-cn#image-understanding)。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const imagePath = "path/to/cat_image.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    { text: "Create a picture of my cat eating a nano-banana in a" +
            " 'fancy restaurant under the Gemini constellation'" },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}

main();
```

![AI 生成的猫吃迷你香蕉的图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/b8392fc6-c4d3-4886-8a90-348633ac501f/cat_eating_banana.png)
*AI 生成的猫吃迷你香蕉的图片*

### 其他图片生成模式

Gemini 还支持其他基于提示结构和上下文的图片互动模式,包括:

*   **文生图和文本 (交织)**: 输出包含相关文本的图片。
    *   提示示例: “生成一份图文并茂的海鲜饭食谱。”
*   **图片和文本转图片和文本 (交织)**: 使用输入图片和文本创建新的相关图片和文本。
    *   提示示例: (附带一张带家具的房间的照片) “我的空间还适合放置哪些颜色的沙发?你能更新一下图片吗?”
*   **多轮图片修改 (聊天)**: 以对话方式持续生成和修改图片。
    *   提示示例: [上传一张蓝色汽车的图片。]，“把这辆车变成敞篷车”,“现在将颜色更改为黄色。”

## 提示指南和策略

要掌握 Gemini 2.5 Flash 图片生成功能,首先要了解一个基本原则:

**描述场景,而不仅仅是列出关键字。** 该模型的核心优势在于其深厚的语言理解能力。与一连串不相关的字词相比,叙述性描述段落几乎总是能生成更好、更连贯的图片。

### 用于生成图片的提示

以下策略将帮助您创建有效的提示,以生成您想要的图片。

#### 1. 逼真场景
对于逼真的图片,请使用摄影术语。提及拍摄角度、镜头类型、光线和细节,引导模型生成逼真的效果。

**JavaScript**
```javascript
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, kind smile. He is holding a handcrafted ceramic bowl. The lighting is soft and natural, highlighting the textures of his skin and the ceramic bowl. Shot on a Sony A7R IV with a 90mm f/2.8 Macro lens.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("photorealistic_example.png", buffer);
      console.log("Image saved as photorealistic_example.png");
    }
  }
}

main();
```![一位年长的日本陶艺家的特写肖像，照片级真实感...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/06ddde7c-619f-4315-ae75-01e4ec91448b/photorealistic_example.png)
*一位年长的日本陶艺家的特写肖像,照片级真实感...*

#### 2. 风格化插图和贴纸
如需创建贴纸、图标或素材资源,请明确说明样式并要求使用透明背景。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "A kawaii-style sticker of a happy red panda wearing a tiny bamboo hat. It's munching on a green bamboo leaf. The sticker has a thick white border and a transparent background.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("red_panda_sticker.png", buffer);
      console.log("Image saved as red_panda_sticker.png");
    }
  }
}

main();
```![一张可爱风格的贴纸，上面是一只快乐的小熊猫...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0952d431-a080-496e-ab48-912f9e425624/red_panda_sticker.png)
*一张可爱风格的贴纸,上面是一只快乐的小熊猫...*

#### 3. 图片中的文字准确无误
Gemini 在呈现文字方面表现出色。清楚说明文字、字体样式 (描述性) 和整体设计。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "Create a modern, minimalist logo for a coffee shop called 'The Daily Grind'. The text should be in a clean, bold, sans-serif font. The logo should be circular and feature a stylized coffee bean in the center.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("logo_example.png", buffer);
      console.log("Image saved as logo_example.png");
    }
  }
}

main();
```

![为一家名为“The Daily Grind”的咖啡店设计一个现代简约的徽标...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0dd73ec4-498c-48c0-9d0a-9d9e6e4a2a1b/logo_example.png)
*为一家名为“The Daily Grind”的咖啡店设计一个现代简约的徽标...*

#### 4. 产品模型和商业摄影
非常适合为电子商务、广告或品牌宣传制作清晰专业的商品照片。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a plain, light gray background. The lighting should be soft and even, emphasizing the mug's clean lines and texture.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("product_mockup.png", buffer);
      console.log("Image saved as product_mockup.png");
    }
  }
}

main();
```![一张高分辨率的摄影棚灯光产品照片，拍摄的是一个极简的陶瓷咖啡杯...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/5a176846-5f11-4475-ae98-ab93d7c356b7/product_mockup.png)
*一张高分辨率的摄影棚灯光产品照片,拍摄的是一个极简的陶瓷咖啡杯...*

#### 5. 极简风格和负空间设计
非常适合用于创建网站、演示或营销材料的背景,以便在其中叠加文字。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a clean, off-white canvas with a subtle texture. The image should evoke a sense of calm and simplicity.";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("minimalist_design.png", buffer);
      console.log("Image saved as minimalist_design.png");
    }
  }
}

main();
```![一幅极简主义构图，画面中只有一片精致的红枫叶...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/4c235773-4560-40e9-a3d8-e320d369c9b5/minimalist_design.png)
*一幅极简主义构图,画面中只有一片精致的红枫叶...*

#### 6. 连续艺术 (漫画分格/故事板)
以角色一致性和场景描述为基础,为视觉故事讲述创建分格。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const prompt =
    "A single comic book panel in a gritty, noir art style with high-contrast black and white inks. In the foreground, a detective in a trench coat and fedora stands under a flickering streetlamp. Rain is pouring down, and the city streets are dark and reflective. The caption at the bottom reads: 'THE CITY WAS A TOUGH PLACE TO KEEP SECRETS.'";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("comic_panel.png", buffer);
      console.log("Image saved as comic_panel.png");
    }
  }
}

main();
```![采用粗犷的黑色电影艺术风格的单幅漫画书画面...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/72b904d0-4054-46c5-a6e5-4e015ac510b6/comic_panel.png)
*采用粗犷的黑色电影艺术风格的单幅漫画书画面...*

### 用于修改图片的提示

以下示例展示了如何提供图片以及文本提示,以进行编辑、构图和风格迁移。

#### 1. 添加和移除元素
提供图片并描述您的更改。模型将与原始图片的风格、光照和透视效果相匹配。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const imagePath = "/path/to/your/cat_photo.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    { text: "Using the provided image of my cat, please add a small, knitted wizard hat on its head. Make it look like it's sitting comfortably and naturally." },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("cat_with_hat.png", buffer);
      console.log("Image saved as cat_with_hat.png");
    }
  }
}

main();
```
**输入** | **输出**
--- | ---
![一张逼真的图片，内容是一只毛绒绒的姜黄色猫...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/6190abfd-ddda-4467-8c33-87a4ec21f92e/cat_photo.png) *一张逼真的图片,内容是一只毛绒绒的姜黄色猫...* | ![Using the provided image of my cat, please add a small, knitted wizard hat...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/a7c4ac9e-64d8-4b78-9f17-f327de0d6438/cat_with_hat.png) *Using the provided image of my cat, please add a small, knitted wizard hat...*

#### 2. 局部重绘 (语义遮盖)
通过对话定义“蒙版”,以修改图片的特定部分,同时保持其余部分不变。

**JavaScript**
```javascript
async function main() {
  const ai = new GoogleGenAI({});

  const imagePath = "/path/to/your/living_room.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
    { text: "Using the provided image of a living room, change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room exactly the same." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("living_room_edited.png", buffer);
      console.log("Image saved as living_room_edited.png");
    }
  }
}

main();
```**输入** | **输出**
--- | ---
![一张广角照片，拍摄的是一间光线充足的现代客厅...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/20a65384-cc09-411a-8240-86d1a129d2f2/living_room.png) *一张广角照片,拍摄的是一间光线充足的现代客厅...* | ![使用提供的客厅图片，将蓝色沙发更改为复古棕色真皮切斯特菲尔德沙发...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0c8d195e-17ca-4b08-b118-292850cc5d0d/living_room_edited.png) *使用提供的客厅图片,将蓝色沙发更改为复古棕色真皮切斯特菲尔德沙发...*

#### 3. 风格迁移
提供一张图片,并让模型以不同的艺术风格重新创作其内容。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const imagePath = "/path/to/your/city.png";
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const prompt = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
    { text: "Transform the provided photograph of a modern city street at night into the artistic style of Vincent van Gogh, with swirling brushstrokes and a vibrant, expressive color palette." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("city_style_transfer.png", buffer);
      console.log("Image saved as city_style_transfer.png");
    }
  }
}

main();
```
**输入** | **输出**
--- | ---
![一张逼真的高分辨率照片，拍摄的是繁忙的城市街道...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/f712b322-a9b0-4f81-bd5d-2092cc7ac2e1/city.png) | ![将提供的夜间现代城市街道照片改造成...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/ed17d74f-9e6b-4e6f-96a9-e0d014eb0234/city_style_transfer.png)

#### 4. 高级合成: 组合多张图片
提供多张图片作为上下文,以创建新的合成场景。这非常适合制作产品模型或创意拼贴画。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const imagePath1 = "/path/to/your/dress.png";
  const imageData1 = fs.readFileSync(imagePath1);
  const base64Image1 = imageData1.toString("base64");
  const imagePath2 = "/path/to/your/model.png";
  const imageData2 = fs.readFileSync(imagePath2);
  const base64Image2 = imageData2.toString("base64");

  const prompt = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image1,
      },
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image2,
      },
    },
    { text: "Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. She should be standing in a picturesque cobblestone street in a European city." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("fashion_ecommerce_shot.png", buffer);
      console.log("Image saved as fashion_ecommerce_shot.png");
    }
  }
}

main();
```
**输入值 1** | **输入值 2** | **输出**
--- | --- | ---
![一张专业拍摄的照片，照片中是一件蓝色印花夏季连衣裙...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0f6d1490-67a9-4623-a26b-d89063d8063f/dress.png) | ![Full-body shot of a woman with her hair in a bun...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/014f1418-f2b3-467a-85d8-4f11d137fef4/model.png) | ![创建专业的电子商务时尚照片...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/ff44061a-7b3c-4cf3-a72d-3466100eb664/fashion_ecommerce_shot.png)

#### 5. 高保真细节保留
为确保在编辑过程中保留关键细节 (例如面部或徽标),请在编辑请求中详细描述这些细节。

**JavaScript**
```javascript
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const imagePath1 = "/path/to/your/woman.png";
  const imageData1 = fs.readFileSync(imagePath1);
  const base64Image1 = imageData1.toString("base64");
  const imagePath2 = "/path/to/your/logo.png";
  const imageData2 = fs.readFileSync(imagePath2);
  const base64Image2 = imageData2.toString("base64");

  const prompt = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image1,
      },
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image2,
      },
    },
    { text: "Take the first image of the woman with brown hair, blue eyes, and a neutral expression. Add the logo from the second image to a white t-shirt she is wearing. Make sure to preserve her facial features and the details of the logo." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("woman_with_logo.png", buffer);
      console.log("Image saved as woman_with_logo.png");
    }
  }
}

main();
```
**输入值 1** | **输入值 2** | **输出**
--- | --- | ---
![一位留着棕色头发、有着蓝色眼睛的女性的专业头像...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/436c841c-322b-42f4-a5e3-85f8f8b63e26/woman.png) | ![一个简单的现代徽标，包含字母“G”和“A”...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/68f54c34-a134-45e0-bb15-b77873a466a9/logo.png) | ![拍摄第一张照片，照片中的女子留着棕色头发，有着蓝色眼睛，面部表情平静...](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/755c3272-46ba-4a6c-941c-792ab8d89a44/woman_with_logo.png)

## 最佳做法

如需将效果从“好”提升到“出色”,请将以下专业策略融入您的工作流程。

*   **内容要非常具体**: 您提供的信息越详细,您对结果的控制就越强。请不要使用“奇幻盔甲”这样笼统的语言,而要具体描述盔甲,例如“装饰华丽的精灵板甲,蚀刻有银叶图案,带有高领和猎鹰翅膀形状的肩甲”。
*   **提供背景信息和意图**: 说明图片的用途。模型对上下文的理解会影响最终输出。例如,“为高端极简护肤品牌设计徽标”会比“设计徽标”产生更好的结果。
*   **迭代和优化**: 不要期望第一次尝试就能生成完美的图片。利用模型的对话特性进行小幅更改。然后,您可以继续提出提示,例如“效果很棒,但能让光线更暖一些吗?”或“保持所有内容不变,但让角色的表情更严肃一些。”
*   **使用分步说明**: 对于包含许多元素的复杂场景,请将提示拆分为多个步骤。“首先,创作一幅清晨薄雾笼罩的宁静森林背景。然后,在前景中添加一个长满苔藓的古老石祭坛。最后,在祭坛上放置一把发光的剑。”
*   **使用“语义负提示”**: 不要说“没有汽车”,而是积极地描述所需的场景:“一条空旷荒凉的街道,没有任何交通迹象。”
*   **控制相机**: 使用摄影和电影语言来控制构图。例如 `wide-angle shot`、`macro shot`、`low-angle perspective` 等字词。

## 限制

*   为获得最佳性能,请使用以下语言:英语、西班牙语 (墨西哥)、日语 (日本)、中文 (中国)、印地语 (印度)。
*   图片生成不支持音频或视频输入。
*   模型并不总是会生成用户明确要求的确切数量的图片输出。
*   该模型在输入最多 3 张图片时效果最佳。
*   在为图片生成文字时,最好先生成文字,然后再要求生成包含该文字的图片,这样 Gemini 的效果会更好。
*   目前,欧洲经济区 (EEA)、瑞士 (CH) 和英国 (UK) 不支持上传儿童图片。
*   所有生成的图片都包含 [SynthID](https://deepmind.google/discover/blog/identifying-ai-generated-images-with-synthid/) 水印。

## 可选配置

您可以选择在 `generate_content` 调用的 `config` 字段中配置模型输出的响应模态和宽高比。

### 输出类型

默认情况下,模型会返回文本和图片响应 (即 `response_modalities=['Text', 'Image']`)。您可以使用 `response_modalities=['Image']` 将响应配置为仅返回图片而不返回文本。

**JavaScript**
```javascript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: prompt,
  config: {
    responseModalities: ['Image']
  }
});
```

### 宽高比

默认情况下,模型会使输出图片的大小与输入图片的大小保持一致,否则会生成 1:1 的正方形图片。您可以使用响应请求中 `image_config` 下的 `aspect_ratio` 字段来控制输出图片的宽高比,如下所示:

**JavaScript**
```javascript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: prompt,
  config: {
    imageConfig: {
      aspectRatio: "16:9",
    },
  }
});
```

下表列出了可用的不同宽高比以及生成的图片大小:

| 宽高比 | 分辨率 | 令牌 |
| :--- | :--- | :--- |
| 1:1 | 1024x1024 | 1290 |
| 2:3 | 832x1248 | 1290 |
| 3:2 | 1248x832 | 1290 |
| 3:4 | 864x1184 | 1290 |
| 4:3 | 1184x864 | 1290 |
| 4:5 | 896x1152 | 1290 |
| 5:4 | 1152x896 | 1290 |
| 9:16 | 768x1344 | 1290 |
| 16:9 | 1344x768 | 1290 |
| 21:9 | 1536x672 | 1290 |

## 何时使用 Imagen

除了使用 Gemini 的内置图片生成功能外,您还可以通过 Gemini API 访问我们专门的图片生成模型 [Imagen](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)。

| 属性 | Imagen | Gemini 原生图片 |
| :--- | :--- | :--- |
| **优势** | 迄今为止功能最强大的图片生成模型。建议用于生成逼真的图像、提高清晰度、改进拼写和排版。 | 默认建议。无与伦比的灵活性、情境理解能力以及简单易用的无蒙版编辑功能。能够进行多轮对话式编辑。 |
| **可用性** | 已全面推出 | 预览版 (允许用于生产环境) |
| **延迟时间** | 低: 针对近乎实时的性能进行了优化。 | 较高。其高级功能需要更多计算资源。 |
| **费用** | 经济实惠,适合执行专业任务。$0.02/图片至 $0.12/图片 | 基于 token 的定价。图片输出每 100 万个 token 的费用为 30 美元 (图片输出按每张图片 1,290 个 token 进行标记化,最高分辨率为 1024x1024 像素) |
| **推荐的任务** | • 图片质量、写实度、艺术细节或特定风格 (例如印象派、动漫) 是首要考虑因素。<br>• 融入品牌元素、风格,或生成徽标和产品设计。<br>• 生成高级拼写或排版。 | • 生成交织的文本和图片,以便将文本和图片无缝融合。<br>• 通过单个提示组合多张图片中的创意元素。<br>• 对图片进行高度精细的编辑,使用简单的语言指令修改单个元素,并以迭代方式处理图片。<br>• 将一张图片中的特定设计或纹理应用到另一张图片,同时保留原始对象的外形和细节。 |

如果您刚开始使用 Imagen 生成图片,**Imagen 4** 应该是您的首选模型。如果需要处理高级用例或需要最佳图片质量,请选择 **Imagen 4 Ultra** (请注意,该模型一次只能生成一张图片)。

## 后续步骤

*   如需查看更多示例和代码示例,请参阅[食谱指南](https://ai.google.dev/gemini-api/docs/cookbook/intro?hl=zh-cn)。
*   查看 [Veo 指南](https://ai.google.dev/gemini-api/docs/veo?hl=zh-cn),了解如何使用 Gemini API 生成视频。
*   如需详细了解 Gemini 模型,请参阅 [Gemini 模型](https://ai.google.dev/gemini-api/docs/models/gemini?hl=zh-cn)。

---
*如未另行说明,那么本页面中的内容已根据知识共享署名 4.0 许可获得了许可,并且代码示例已根据 Apache 2.0 许可获得了许可。有关详情,请参阅 Google 开发者网站政策。Java 是 Oracle 和/或其关联公司的注册商标。*
*最后更新时间 (UTC): 2025-10-02。*