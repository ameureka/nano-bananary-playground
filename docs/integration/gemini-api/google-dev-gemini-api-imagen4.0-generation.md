好的，这是根据您提供的文件内容转换的 Markdown 格式文档。

***

# Gemini API 文档

> **Veo 3.1 现已发布!** 如需了解新模型及其功能,请参阅[博文](https://cloud.google.com/blog/products/ai-machine-learning/google-veo-gemini-imagen-3-video-image-generation)和[文档](https://cloud.google.com/vertex-ai/docs/generative-ai/video/overview)。

> translated by Google: 此页面由 Cloud Translation API 翻译。

**本页内容**
*   使用 Imagen 模型生成图片
*   Imagen 配置
*   Imagen 提示指南
*   提示撰写的基础知识
*   在图片中生成文本
*   提示参数化
*   高级提示撰写技术
*   插图和艺术
*   模型版本
*   Imagen 4
*   Imagen 3

---

[首页](https://ai.google.dev/gemini-api/docs?hl=zh-cn) > [Gemini API](https://ai.google.dev/gemini-api/docs/imagen?hl=zh-cn) > Gemini API 文档

## 使用 Imagen 生成图片

Imagen 是 Google 的高保真图片生成模型,能够根据文本提示生成逼真且高品质的图片。所有生成的图片都包含 SynthID 水印。如需详细了解可用的 Imagen 模型变体,请参阅[模型版本](#模型版本)部分。

> ★ **注意**: 您还可以使用 Gemini 的内置多模态功能生成图片。如需了解详情,请参阅[图片生成指南](https://ai.google.dev/gemini-api/docs/generate-image?hl=zh-cn)。

### 使用 Imagen 模型生成图片

此示例演示了如何使用 Imagen 模型生成图片:

**JavaScript**
```javascript
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: 'Robot holding a red skateboard',
    config: {
      numberOfImages: 4,
    },
  });

  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    let imgBytes = generatedImage.image.imageBytes;
    const buffer = Buffer.from(imgBytes, "base64");
    fs.writeFileSync(`imagen-${idx}.png`, buffer);
    idx++;
  }
}

main();
```

![AI 生成的机器人手持红色滑板的图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0f9e3d1d-84e1-45d6-8809-775677d2d3a3/imagen-1.png)
*AI 生成的机器人手持红色滑板的图片*

### Imagen 配置

Imagen 目前仅支持英文提示和以下参数:

> ★ **注意**: 参数的命名惯例因编程语言而异。

*   `numberOfImages`: 要生成的图片数量,范围为 1 到 4 (含)。默认值为 4。
*   `imageSize`: 生成的图片的大小。仅 Standard 和 Ultra 型号支持此功能。支持的值为 1K 和 2K。默认值为 1K。
*   `aspectRatio`: 更改所生成图片的宽高比。支持的值包括 `"1:1"`、`"3:4"`、`"4:3"`、`"9:16"` 和 `"16:9"`。默认值为 `"1:1"`。
*   `personGeneration`: 允许模型生成人物图片。支持以下值:
    *   `"dont_allow"`: 禁止生成人物图片。
    *   `"allow_adult"`: 生成成人图像,但不生成儿童图像。这是默认值。
    *   `"allow_all"`: 生成包含成人和儿童的图片。

> ★ **注意**: 欧盟、英国、瑞士、中东和北非 (MENA) 地区不允许使用 `"allow_all"` 参数值。

## Imagen 提示指南

本部分 Imagen 指南介绍了修改文本转图片提示会如何产生不同的结果,并举例说明了您可以创建的图片。

### 提示撰写的基础知识

> ★ **注意**: 提示的长度上限为 480 个 token。

好的提示应具有描述性、清晰明了,并使用有意义的关键字和修饰符。首先,请考虑主题、背景和风格。

![提示结构图：主体、风格、背景和环境](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/078a99cc-5a33-40e1-88f5-fd650b6912ea/prompt-anatomy-example.png)
*图片文本: 一幅草图 (风格), 现代风格的公寓楼 (主体), 周围摩天大楼环绕 (背景和环境)。*

1.  **主体**: 对于任何提示,首先要考虑的都是主体:对象、人物、动物或场景。
2.  **背景和环境**: 与主体所处的背景或环境一样重要。请尝试将主体置于各种背景下。例如,白色背景、户外或室内环境下的工作室。
3.  **样式**: 最后,添加所需图片的样式。样式可以是常规内容 (绘画、照片、草图),也可以是非常具体的内容 (色粉画、木炭画、无透视三维绘图)。您还可以组合使用多种样式。

在撰写第一版提示后,请通过添加更多详细信息来优化提示,直到您获得所需的图片为止。迭代很重要。首先确定核心概念,然后在此核心概念的基础上进行优化和扩展,直到生成的图片接近您的构想为止。

| 提示: A park in the spring next to a lake | 提示: A park in the spring next to a lake, the sun sets across the lake, golden hour | 提示: A park in the spring next to a lake, the sun sets across the lake, golden hour, red wildflowers |
| :--- | :--- | :--- |
| ![春天湖边公园的图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/c36e4f34-1c39-49c9-ae5f-56df82531a89/park-lake-1.png) | ![春天湖边公园日落黄金时段的图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0c1f6d34-73d8-4a92-944a-f32b849646b1/park-lake-2.png) | ![春天湖边公园日落黄金时段与红色野花的图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/13d11b81-a4df-476c-8515-e23f5b73d9e8/park-lake-3.png) |

无论您的提示是简短的还是较长且详细的,Imagen 模型都可以将您的想法转换为详细的图片。通过迭代提示和添加详细信息来优化您的构想,直到您获得理想的结果。

| 您可以使用短提示快速生成图片。 | 您可以使用较长提示添加具体详细信息并构建图片。 |
| :--- | :--- |
| ![20多岁女性的特写照片，街头摄影风格，电影剧照，柔和的橙色暖色调](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/4618e77c-a45b-41ca-b962-42173f4e157e/woman-short-prompt.png) | ![迷人的20多岁女性照片，采用街头摄影风格。图像应看起来像电影剧照，带有柔和的橙色暖色调](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/200dd00b-6075-4d7a-85d1-9f931d87f7a7/woman-long-prompt.png) |
| **提示**: `close-up photo of a woman in her 20s, street photography, movie still, muted orange warm tones` | **提示**: `captivating photo of a woman in her 20s utilizing a street photography style. The image should look like a movie still with muted orange warm tones.` |

**关于 Imagen 提示撰写的其他建议:**

*   **使用描述性语言**: 使用详细的形容词和副词,为 Imagen 描绘清晰的画面。
*   **提供背景信息**: 根据需要,添加背景信息以帮助 AI 理解。
*   **参考特定艺术家或风格**: 如果您有特定的审美观,参考特定艺术家或艺术运动可能会有所帮助。
*   **使用提示工程工具**: 可考虑探索提示工程工具或资源,以帮助您优化提示并实现最佳结果。
*   **增强个人和群组图片中的面部细节**: 指定面部细节作为照片的焦点 (例如,在提示中使用 “portrait” 一词)。

### 在图片中生成文本

Imagen 模型可以在图片中添加文字,从而为创造性图片生成提供了更多可能性。请按照以下指南来充分利用此功能:

*   **自信地迭代**: 您可能需要重新生成图片,直到实现所需的外观为止。Imagen 的文本集成仍在不断发展,有时多次尝试才能获得最佳结果。
*   **简短明了**: 为获得最佳生成效果,请将文本长度限制在 25 个字符以内。
*   **多个短语**: 尝试使用两三个不同的词组来提供更多信息。为了让组合更清晰,请避免超过三个短语。
*   **指导放置**: 虽然 Imagen 可以尝试按指示放置文本,但您应该预料到偶尔会出现一些变化。此功能正在不断改进。
*   **启发性字体样式**: 指定一种常规字体样式,以巧妙地影响 Imagen 的选择。不要依赖精确的字体复制,而是期待富有创意的诠释。
*   **字体大小**: 指定字体大小或有关大小的一般指示 (例如,小、中、大) 以影响字体大小生成。

![一张带有粗体“Summerland”标题和“Summer never felt so good”口号的海报](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0c1753fd-e9da-412e-9edc-37207049405d/summerland-poster.png)
*提示: A poster with the text "Summerland" in bold font as a title, underneath this text is the slogan "Summer never felt so good"*

### 提示参数化

为了更好地控制输出结果,将发送给 Imagen 的输入参数化可能会有所帮助。例如,假设您希望客户能够为自己的企业生成徽标,并且希望确保徽标始终在纯色背景上生成。您还想限制客户端可以从菜单中选择的选项。

在此示例中,您可以创建一个类似于以下内容的参数化提示:

```
A {logo_style} logo for a {company_area} company on a solid color background. Include the text {company_name}.
```

在自定义界面中,客户可以使用菜单输入参数,并且他们选择的值会填充 Imagen 收到的提示。例如:

1.  **提示**: A `minimalist` logo for a `health care` company on a solid color background. Include the text `Journey`.
    ![为医疗保健公司“Journey”设计的三个极简主义徽标变体](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/7404e9c7-7429-4591-987d-418a22deac52/journey-logo.png)

2.  **提示**: A `modern` logo for a `software` company on a solid color background. Include the text `Silo`.
    ![为软件公司“Silo”设计的三个现代徽标变体](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/688cd2cc-85e7-4f6c-9418-49f2bce9bb0c/silo-logo.png)

3.  **提示**: A `traditional` logo for a `baking` company on a solid color background. Include the text `Seed`.
    ![为烘焙公司“Seed”设计的三个传统徽标变体](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0315cf39-865b-4375-9e6e-21958b10f845/seed-logo.png)

### 高级提示撰写技术

使用以下示例根据属性 (例如摄影描述符、形状和材料、历史艺术运动和图像质量修饰符) 创建更具体的提示。

#### 摄影

*   提示包括: “...的照片”

如需使用此风格,请先使用关键字,明确告诉 Imagen 您所需要的是照片。提示开头是 “一张...的照片”。例如:

| 提示: 一张厨房里木板上所放的咖啡豆的照片 | 提示: 一张厨房柜台上的巧克力棒的照片 | 提示: 一张背景为水的现代建筑的照片 |
| :--- | :--- | :--- |
| ![厨房木板上的咖啡豆照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/7b587a32-132d-4560-b021-3edffbb0b5d5/photo-of-coffee-beans.png) | ![厨房柜台上的巧克力棒照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/772c72b2-602c-4029-af0e-897d91ec885e/photo-of-chocolate.png) | ![背景为水的现代建筑照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/46e4df9c-3094-4384-ad61-26c7d12f4544/photo-of-architecture.png) |

#### 摄影修饰符

在以下示例中,您可以看到多个专用于照片的修饰符和参数。您可以组合使用多个修饰符,以便更精确地进行控制。

1.  **相机邻近性** - 特写,从远处拍摄
    | 提示: A close-up photo of coffee beans | 提示: A zoomed out photo of a small bag of coffee beans in a messy kitchen |
    | :--- | :--- |
    | ![咖啡豆特写照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/3a1c6a64-9226-4076-9ed5-5a242c75a9e7/coffee-beans-close-up.png) | ![凌乱厨房里一小袋咖啡豆的远景照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/9991206f-47ec-4467-ba42-c5184b259160/coffee-beans-zoomed-out.png) |
2.  **相机位置** - 航拍、仰拍
    | 提示: aerial photo of urban city with skyscrapers | 提示: A photo of a forest canopy with blue skies from below |
    | :--- | :--- |
    | ![带摩天大楼的城市航拍照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/8343f8fd-b413-41ed-94b2-a4f66179313a/aerial-photo-city.png) | ![从下方拍摄的带有蓝天的森林树冠照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/4f77c38c-f04b-4786-8f3e-8f553f1a2ac5/forest-canopy-below.png) |
3.  **光线** - 自然、舞台、暖、冷
    | 提示: studio photo of a modern arm chair, natural lighting | 提示: studio photo of a modern arm chair, dramatic lighting |
    | :--- | :--- |
    | ![现代扶手椅的摄影棚照片，自然光](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/5b95ac21-827d-4191-881b-50953c846931/arm-chair-natural-light.png) | ![现代扶手椅的摄影棚照片，戏剧性灯光](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/69668bdc-60c7-43ca-a083-d53956795f2d/arm-chair-dramatic-light.png) |
4.  **相机设置** - 运动模糊、柔焦、焦外成像、人像
    | 提示: photo of a city with skyscrapers from the inside of a car with motion blur | 提示: soft focus photograph of a bridge in an urban city at night |
    | :--- | :--- |
    | ![从车内拍摄的带有运动模糊的城市摩天大楼照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/28e930e4-b328-444f-801a-6d5598bb129c/city-motion-blur.png) | ![夜间城市桥梁的柔焦照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/f7f16bb3-f2fa-450f-a0e2-c4e97669d045/bridge-soft-focus.png) |
5.  **镜头类型** - 35 毫米、50 毫米、鱼眼、广角、微距
    | 提示: 叶子的照片, 微距镜头 | 提示: 街头摄影、纽约市、鱼眼镜头 |
    | :--- | :--- |
    | ![叶子的微距镜头照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/2fa3d7c0-d022-4819-86bd-9079a4d46813/leaf-macro-lens.png) | ![纽约市的鱼眼镜头街头摄影](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/a7a70a8d-1c39-4d6b-b467-f4e912f275e6/nyc-fisheye-lens.png) |
6.  **胶片类型** - 黑白、拍立得
    | 提示: a polaroid portrait of a dog wearing sunglasses | 提示: black and white photo of a dog wearing sunglasses |
    | :--- | :--- |
    | ![戴太阳镜的狗的拍立得肖像](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/d0347854-8c88-46da-bcf9-c6e082f421f1/dog-polaroid.png) | ![戴太阳镜的狗的黑白照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0724cf63-2287-43ca-a302-39f1c7e9a8d2/dog-black-and-white.png) |

### 插图和艺术

*   提示包括: “...的 painting”、“...的 sketch”

艺术风格各不相同,从铅笔素描等单色风格到超现实的数字艺术均有。例如,以下图片使用相同提示而使用不同风格:
*一辆背景是摩天大楼的棱角分明的运动型电动轿车的 `[art style or creation technique]`*

| 技术铅笔素描 | 木炭素描 | 彩色铅笔素描 |
| :--- | :--- | :--- |
| ![技术铅笔素描](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/13a073f1-e3fd-4411-9257-81ec01c71a34/car-technical-drawing.png) | ![木炭素描](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/995df001-c817-48de-b4d1-c299c82c3c1e/car-charcoal-drawing.png) | ![彩色铅笔素描](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/80b5ab25-3004-4d83-8a3c-b258673a5a1f/car-color-pencil-drawing.png) |
| **粉彩画** | **数字艺术** | **装饰艺术 (海报)** |
| ![粉彩画](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/a316715e-a6a3-4b95-a229-28c464c76b97/car-pastel-painting.png) | ![数字艺术](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/1f1d9326-17b5-4b53-8d38-66238b1d4285/car-digital-art.png) | ![装饰艺术海报](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/4c67eb94-738b-4b19-a9c6-281b312788e0/car-art-deco-poster.png) |

#### 形状和材料

*   提示包括: “...制作的...”、“...形状的...”

这项技术的一大优势是您可以创建以其他方式难以实现或无法实现的图像。例如,您可以用不同的材料和纹理重新创建公司徽标。

| 提示: a duffle bag made of cheese | 提示: neon tubes in the shape of a bird | 提示: an armchair made of paper, studio photo, origami style |
| :--- | :--- | :--- |
| ![由奶酪制成的行李袋](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0306c4b2-2900-47c7-b52b-7c3d10527ac0/cheese-duffle-bag.png) | ![鸟形状的霓虹灯管](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/aa75abcc-de1e-450f-a3d8-5b4d7971ac90/neon-bird.png) | ![由纸制成的扶手椅，折纸风格](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/3c41ac00-c97a-4b93-b1d5-950e393a521a/paper-armchair.png) |

#### 历史艺术参考

*   提示包括: “...风格的...”

多年来,某些风格已经成为标志。以下是一些您可以尝试的历史绘图或艺术风格想法。
*"generate an image in the style of [art period or movement]: a wind farm"*

| 印象派绘画风格 | 文艺复兴绘画风格 | 波普艺术风格 |
| :--- | :--- | :--- |
| ![印象派风格的风力发电场](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/8b66e6c4-1a9e-4c74-8806-00350d268d87/wind-farm-impressionist.png) | ![文艺复兴风格的风力发电场](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/684c3c2e-436d-4952-b88d-29c3628e4612/wind-farm-renaissance.png) | ![波普艺术风格的风力发电场](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/684b003a-c15f-4abf-9721-a3f815b81a44/wind-farm-pop-art.png) |

#### 图片质量修饰符

某些关键字可使模型知道您正在寻找高质量的资源。质量修饰符的示例包括:

*   **常规修饰符** - 高品质、精美、风格化
*   **照片** - 4K、HDR、摄影棚照片
*   **艺术、插图** - 由专业的、详细的

| 提示 (无质量修饰符): `a photo of a corn stalk` | 提示 (带质量修饰符): `4k HDR beautiful photo of a corn stalk taken by a professional photographer` |
| :--- | :--- |
| ![玉米秆的照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/ab92b95b-7b0f-48d1-9492-9a5c86801cae/corn-stalk-no-modifier.png) | ![专业摄影师拍摄的 4K HDR 精美玉米秆照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/996e3012-d961-4608-aa84-255d644d6718/corn-stalk-modifier.png) |

#### 宽高比

借助 Imagen 图片生成,您可以设置五种不同的图片宽高比。

1.  **方形 (1:1, 默认值)** - 标准方形照片。这种宽高比的常见用途包括社交媒体帖子。
2.  **全屏 (4:3)** - 这种宽高比通常用于媒体或电影。它也是大多数旧款 (非宽屏) 电视和中等格式相机的尺寸。它可水平拍摄更多场景 (与 1:1 相比),因而成为摄影的首选宽高比。
    | 提示: `close up of a musician's fingers playing the piano, black and white film, vintage (4:3 aspect ratio)` | 提示: `高档餐厅的炸薯条的专业工作室照片,采用美食杂志的风格 (宽高比为 4:3)` |
    | :--- | :--- |
    | ![音乐家弹钢琴手指的特写，黑白胶片，复古风格](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/b863d6b1-4f24-42b7-a36c-9c7482f5b667/piano-4-3.png) | ![高档餐厅炸薯条的专业工作室照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/a7c1b505-1a86-4f7f-a63e-63f59e9885fe/fries-4-3.png) |
3.  **纵向全屏 (3:4)** - 这是旋转 90 度的全屏宽高比。与 1:1 宽高比相比,这种宽高比可垂直拍摄更多场景。
    | 提示: `一位徒步旅行的女士,靴子的近处倒映在水坑中,背景是大山,广告风格,戏剧性的角度 (宽高比为 3:4)` | 提示: `aerial shot of a river flowing up a mystical valley (3:4 aspect ratio)` |
    | :--- | :--- |
    | ![徒步旅行女士在水坑中的倒影](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/dd480838-5182-4148-8f6a-637ffdfb8c2d/hiker-3-4.png) | ![河流流入神秘山谷的航拍照片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/13735166-7013-40e1-bd6b-59d042637213/river-3-4.png) |
4.  **宽屏 (16:9)** - 此宽高比已取代 4:3,现在是电视、显示器和手机屏幕 (横向) 的最常用宽高比。如果您想拍摄更多背景 (例如风景),请使用这种宽高比。
    ![穿着全白衣服的男人坐在沙滩上，特写，黄金时段光线 (16:9 宽高比)](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/28e37452-f1da-4581-9b1d-066ca5d9472d/man-on-beach-16-9.png)
    *提示: `a man wearing all white clothing sitting on the beach, close up, golden hour lighting (16:9 aspect ratio)`*
5.  **纵向 (9:16)** - 这种宽高比是宽屏,但进行了旋转。这是一种相对较新的宽高比,深受短视频应用 (例如 YouTube Shorts) 的欢迎。可将这种宽高比用于具有强烈垂直方向的较高对象,例如建筑物、树、瀑布或其他类似对象。
    ![一座巨大的摩天大楼的数字渲染，现代、宏伟、史诗般，背景是美丽的日落 (9:16 宽高比)](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/0c3132e0-bb15-46b0-8fef-950c40e53a81/skyscraper-9-16.png)
    *提示: `a digital render of a massive skyscraper, modern, grand, epic with a beautiful sunset in the background (9:16 aspect ratio)`*

### 逼真图片

> ★ **注意**: 在尝试创建逼真图片时,请将这些关键字作为一般指导。为了获得你想要的结果,必须使用这些关键字。

| 使用场景 | 镜头类型 | 焦距 | 其他详情 |
| :--- | :--- | :--- | :--- |
| 人物 (人像) | 定焦、变焦 | 24-35 毫米 | 黑白胶片、黑色电影、景深、双色调 (提及两种颜色) |
| 食品、昆虫、植物 (物体、静物) | 宏 | 60-105 毫米 | 高精度、精准聚焦、控制照明 |
| 体育运动、野生动物 (运动) | 远摄变焦 | 100-400 毫米 | 高速快门、动作或运动追踪 |
| 天文、风光 (广角) | 广角 | 10-24 毫米 | 长曝光、清晰对焦、长曝光、平滑的水或云 |

#### 人像

| 使用场景 | 镜头类型 | 焦距 | 其他详情 |
| :--- | :--- | :--- | :--- |
| 人物 (人像) | 定焦、变焦 | 24-35 毫米 | 黑白胶片、黑色电影、景深、双色调 (提及两种颜色) |

*   **提示**: `A woman, 35mm portrait, blue and grey duotones` (模型: `imagen-3.0-generate-002`)
    ![女性35毫米肖像，蓝灰双色调的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/04589d71-50e5-4f40-8646-cd7795eb9c0a/woman-duotones.png)
*   **提示**: `A woman, 35mm portrait, film noir` (模型: `imagen-3.0-generate-002`)
    ![女性35毫米肖像，黑色电影风格的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/4eb3d0a0-09fa-47c1-8bca-46de3dd338fd/woman-film-noir.png)

#### 对象

| 使用场景 | 镜头类型 | 焦距 | 其他详情 |
| :--- | :--- | :--- | :--- |
| 食品、昆虫、植物 (物体、静物) | 宏 | 60-105 毫米 | 高精度、精准聚焦、控制照明 |

*   **提示**: `竹芋的叶子、微距镜头、60 毫米` (模型: `imagen-3.0-generate-002`)
    ![竹芋叶子的60毫米微距镜头的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/8340d210-6c9f-4315-99d7-83d8a7c207d5/plant-leaf-macro.png)
*   **提示**: `一盘意大利面、100 毫米微距镜头` (模型: `imagen-3.0-generate-002`)
    ![一盘意大利面的100毫米微距镜头的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/3c3f9104-e593-4a1d-a345-420ef1e71788/pasta-macro.png)

#### 动画

| 使用场景 | 镜头类型 | 焦距 | 其他详情 |
| :--- | :--- | :--- | :--- |
| 体育运动、野生动物 (运动) | 远摄变焦 | 100-400 毫米 | 高速快门、动作或运动追踪 |

*   **提示**: `a winning touchdown, fast shutter speed, movement tracking` (模型: `imagen-3.0-generate-002`)
    ![胜利达阵，高速快门，运动追踪的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/3257cd44-7f41-4773-8263-88220268560e/touchdown-fast-shutter.png)
*   **提示**: `森林中奔跑的鹿、高速快门、运动追踪` (模型: `imagen-3.0-generate-002`)
    ![森林中奔跑的鹿，高速快门，运动追踪的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/f71777d8-f73a-4da2-a9b0-4f517228a192/deer-fast-shutter.png)

#### 广角

| 使用场景 | 镜头类型 | 焦距 | 其他详情 |
| :--- | :--- | :--- | :--- |
| 天文、风光 (广角) | 广角 | 10-24 毫米 | 长曝光、清晰对焦、长曝光、平滑的水或云 |

*   **提示**: `广阔的山脉、10 毫米风光广角` (模型: `imagen-3.0-generate-002`)
    ![广阔山脉的10毫米广角风景照片的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/299c5132-7ed3-4558-be58-29219b233a7e/mountains-wide-angle.png)
*   **提示**: `月亮的照片、天文摄影、10 毫米广角` (模型: `imagen-3.0-generate-002`)
    ![月亮的10毫米广角天文摄影照片的四张图片](https://prod-files-secure.s3.us-west-2.amazonaws.com/15295de3-f404-4331-b8a2-20c2b531505d/4405f693-018e-4a7b-a496-d0a0a552e428/moon-wide-angle.png)

## 模型版本

### Imagen 4

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `imagen-4.0-generate-001`, `imagen-4.0-ultra-generate-001`, `imagen-4.0-fast-generate-001` |
| **支持的数据类型** | **输入**: 文本 <br> **输出**: 图片 |
| **令牌限制** | **输入 token 限制**: 480 个 token (文本) <br> **输出图片**: 1 至 4 (超快/标准/快速) |
| **最新更新** | 2025 年 6 月 |

### Imagen 3

| 属性 | 说明 |
| :--- | :--- |
| **模型代码** | Gemini API: `imagen-3.0-generate-002` |
| **支持的数据类型** | **输入**: 文本 <br> **输出**: 图片 |
| **令牌限制** | **输入 token 限制**: 不适用 <br> **输出图片**: 最多 4 项 |
| **最新更新** | 2025 年 2 月 |

---
*如未另行说明,那么本页面中的内容已根据知识共享署名 4.0 许可获得了许可,并且代码示例已根据 Apache 2.0 许可获得了许可。有关详情,请参阅 Google 开发者网站政策。Java 是 Oracle 和/或其关联公司的注册商标。*
*最后更新时间 (UTC): 2025-09-25。*