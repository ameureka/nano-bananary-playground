import type { Transformation } from './types';

// 定义应用中所有可用的图像/视频变换效果
// 这是一个 Transformation 对象的数组，每个对象代表一个类别
export const TRANSFORMATIONS: Transformation[] = [
  {
    key: "category_viral", // 类别唯一标识
    titleKey: "transformations.categories.viral.title", // 国际化标题键
    icon: "celebration", // 图标
    items: [ // 该类别下的具体效果
      {
        key: "polaroid",
        titleKey: "transformations.effects.polaroid.title",
        prompt: "生成一张亲密合照的拍立得照片。照片带有略微的模糊效果，使用闪光灯在室内拍摄，仿佛派对刚结束。保持亲密又搞笑的姿势，捕捉到轻松有趣的氛围，带有温馨与幽默感",
        icon: "photo_camera",
        descriptionKey: "transformations.effects.polaroid.description",
        maxImages: 4, // 最多支持4张输入图片
      },
      {
        key: "dynamicPolaroid",
        titleKey: "transformations.effects.dynamicPolaroid.title",
        prompt: "生成一张亲密合照的拍立得照片。照片带有略微的模糊效果，使用闪光灯在室内拍摄，仿佛派对刚结束。保持亲密又搞笑的姿势，捕捉到轻松有趣的氛围，带有温馨与幽默感",
        videoPrompt: "Make this polaroid photo come to life with subtle, happy movements. The people should laugh and shift slightly, as if captured in a brief, joyful moment. Maintain the polaroid and flash photography aesthetic.",
        icon: "burst_mode",
        descriptionKey: "transformations.effects.dynamicPolaroid.description",
        maxImages: 4,
        isMultiStepVideo: true, // 标记为多步骤视频生成（先生成图片，再生成视频）
      },
      { 
        key: "figurine",
        titleKey: "transformations.effects.figurine.title", 
        prompt: "turn this photo into a character figure. Behind it, place a box with the character’s image printed on it, and a computer showing the Blender modeling process on its screen. In front of the box, add a round plastic base with the character figure standing on it. set the scene indoors if possible", 
        icon: "person_play",
        descriptionKey: "transformations.effects.figurine.description"
      },
      { 
        key: "cosplay",
        titleKey: "transformations.effects.cosplay.title", 
        prompt: "Generate a highly detailed photo of a girl cosplaying this illustration, at Comiket. Exactly replicate the same pose, body posture, hand gestures, facial expression, and camera framing as in the original illustration. Keep the same angle, perspective, and composition, without any deviation", 
        icon: "theater_comedy",
        descriptionKey: "transformations.effects.cosplay.description"
      },
       { 
        key: "funko",
        titleKey: "transformations.effects.funko.title", 
        prompt: "Transform the person into a Funko Pop figure, shown inside and next to its packaging.", 
        icon: "box",
        descriptionKey: "transformations.effects.funko.description"
      },
      { 
        key: "lego",
        titleKey: "transformations.effects.lego.title", 
        prompt: "Transform the person into a LEGO minifigure, inside its packaging box.", 
        icon: "toys",
        descriptionKey: "transformations.effects.lego.description"
      },
      { 
        key: "crochet",
        titleKey: "transformations.effects.crochet.title", 
        prompt: "Transform the subject into a handmade crocheted yarn doll with a cute, chibi-style appearance.", 
        icon: "styler",
        descriptionKey: "transformations.effects.crochet.description"
      },
      { 
        key: "plushie",
        titleKey: "transformations.effects.plushie.title", 
        prompt: "Turn the person in this photo into a cute, soft plushie doll.", 
        icon: "smart_toy",
        descriptionKey: "transformations.effects.plushie.description"
      },
      { 
        key: "keychain",
        titleKey: "transformations.effects.keychain.title", 
        prompt: "Turn the subject into a cute acrylic keychain, shown attached to a bag.", 
        icon: "key",
        descriptionKey: "transformations.effects.keychain.description"
      },
       {
        key: "minimalistIllustration",
        titleKey: "transformations.effects.minimalistIllustration.title",
        prompt: "Turn the people in these images into cute, black and white minimalist illustrations. Each person should be drawn with their unique characteristics and a fitting small prop. The lines should be elegant, and the hair should be a solid black block. Arrange all characters into a single grid image.",
        icon: "ink_highlighter",
        descriptionKey: "transformations.effects.minimalistIllustration.description",
        maxImages: 4,
      },
      {
        key: "papercraft",
        titleKey: "transformations.effects.papercraft.title",
        prompt: "Transform the subject of the image into a detailed, three-dimensional papercraft model. The model should have visible paper folds, tabs, and layered sections, giving it a tangible, handcrafted feel. Place the papercraft model standing on a wooden desk or tabletop. Scatter a few related craft items around it, such as a craft knife, a cutting mat, or small pieces of scrap paper, to create a workshop atmosphere.",
        icon: "gesture",
        descriptionKey: "transformations.effects.papercraft.description"
      },
    ]
  },
  {
    key: "category_photo",
    titleKey: "transformations.categories.photo.title",
    icon: "photo_library",
    items: [
      { 
        key: "hdEnhance",
        titleKey: "transformations.effects.hdEnhance.title", 
        prompt: "Enhance this image to high resolution, improving sharpness and clarity.", 
        icon: "hd",
        descriptionKey: "transformations.effects.hdEnhance.description"
      },
      { 
        key: "photorealistic",
        titleKey: "transformations.effects.photorealistic.title", 
        prompt: "Turn this illustration into a photorealistic version.", 
        icon: "magic_button",
        descriptionKey: "transformations.effects.photorealistic.description"
      },
      { 
        key: "fashion",
        titleKey: "transformations.effects.fashion.title", 
        prompt: "Transform the photo into a stylized, ultra-realistic fashion magazine portrait with cinematic lighting.", 
        icon: "photo_camera",
        descriptionKey: "transformations.effects.fashion.description"
      },
      { 
        key: "hyperrealistic",
        titleKey: "transformations.effects.hyperrealistic.title", 
        prompt: "Generate a hyper-realistic, fashion-style photo with strong, direct flash lighting, grainy texture, and a cool, confident pose.", 
        icon: "flare",
        descriptionKey: "transformations.effects.hyperrealistic.description"
      },
      { 
        key: "isolate",
        titleKey: "transformations.effects.isolate.title", 
        prompt: "Isolate the person in the masked area and generate a high-definition photo of them against a neutral background.", 
        icon: "center_focus_strong",
        descriptionKey: "transformations.effects.isolate.description"
      },
      { 
        key: "makeup",
        titleKey: "transformations.effects.makeup.title", 
        prompt: "Analyze the makeup in this photo and suggest improvements by drawing with a red pen.", 
        icon: "face",
        descriptionKey: "transformations.effects.makeup.description"
      },
      {
        key: "candidShot",
        titleKey: "transformations.effects.candidShot.title",
        prompt: "Recreate this image to look like a candid, casual snapshot taken spontaneously. The lighting should be imperfect, like a poorly lit indoor room or harsh overhead light. Add some plausible, everyday clutter around the main subject to enhance the 'unposed' feel, like a misplaced cup, a book, or a bag on a table. The composition should feel less deliberate and more like a quick, unplanned photo.",
        icon: "photo_camera",
        descriptionKey: "transformations.effects.candidShot.description"
      },
    ]
  },
  {
    key: "category_design",
    titleKey: "transformations.categories.design.title",
    icon: "design_services",
    items: [
       { 
        key: "architecture",
        titleKey: "transformations.effects.architecture.title", 
        prompt: "Convert this photo of a building into a miniature architecture model, placed on a cardstock in an indoor setting. Show a computer with modeling software in the background.", 
        icon: "construction",
        descriptionKey: "transformations.effects.architecture.description"
      },
      { 
        key: "productRender",
        titleKey: "transformations.effects.productRender.title", 
        prompt: "Turn this product sketch into a photorealistic 3D render with studio lighting.", 
        icon: "light",
        descriptionKey: "transformations.effects.productRender.description"
      },
      { 
        key: "industrialDesign",
        titleKey: "transformations.effects.industrialDesign.title", 
        prompt: "Turn this industrial design sketch into a realistic product photo, rendered with light brown leather and displayed in a minimalist museum setting.", 
        icon: "chair",
        descriptionKey: "transformations.effects.industrialDesign.description"
      },
      { 
        key: "iphoneWallpaper",
        titleKey: "transformations.effects.iphoneWallpaper.title", 
        prompt: "Turn the image into an iPhone lock screen wallpaper effect, with the phone's time (01:16), date (Sunday, September 16), and status bar information (battery, signal, etc.), with the flashlight and camera buttons at the bottom, overlaid on the image. The original image should be adapted to a vertical composition that fits a phone screen. The phone is placed on a solid color background of the same color scheme.",
        icon: "phone_iphone",
        descriptionKey: "transformations.effects.iphoneWallpaper.description"
      },
      { 
        key: "sodaCan",
        titleKey: "transformations.effects.sodaCan.title", 
        prompt: "Design a soda can using this image as the main graphic, and show it in a professional product shot.", 
        icon: "local_cafe",
        descriptionKey: "transformations.effects.sodaCan.description"
      },
    ]
  },
  {
    key: "category_tools",
    titleKey: "transformations.categories.tools.title",
    icon: "construction",
    items: [
       { 
        key: "customPrompt",
        titleKey: "transformations.effects.customPrompt.title", 
        prompt: "CUSTOM", // 特殊值，表示需要用户输入自定义提示
        icon: "edit_square",
        descriptionKey: "transformations.effects.customPrompt.description",
        isMultiImage: true, // 标记为支持多图输入
        isSecondaryOptional: true, // 第二张图是可选的
        primaryUploaderTitle: "transformations.effects.customPrompt.uploader1Title",
        primaryUploaderDescription: "transformations.effects.customPrompt.uploader1Desc",
        secondaryUploaderTitle: "transformations.effects.customPrompt.uploader2Title",
        secondaryUploaderDescription: "transformations.effects.customPrompt.uploader2Desc",
      },
      {
        key: "videoGeneration",
        titleKey: "transformations.video.title",
        icon: "movie",
        descriptionKey: "transformations.video.description",
        isVideo: true, // 标记为视频生成效果
        prompt: "CUSTOM",
      },
       { 
        key: "pose",
        titleKey: "transformations.effects.pose.title", 
        prompt: "Apply the pose from the second image to the character in the first image. Render as a professional studio photograph.",
        icon: "accessibility_new",
        descriptionKey: "transformations.effects.pose.description",
        isMultiImage: true,
        primaryUploaderTitle: "transformations.effects.pose.uploader1Title",
        primaryUploaderDescription: "transformations.effects.pose.uploader1Desc",
        secondaryUploaderTitle: "transformations.effects.pose.uploader2Title",
        secondaryUploaderDescription: "transformations.effects.pose.uploader2Desc",
      },
      {
        key: "styleMimic",
        titleKey: "transformations.effects.styleMimic.title",
        icon: "style",
        descriptionKey: "transformations.effects.styleMimic.description",
        isMultiImage: true,
        isStyleMimic: true, // 特殊标记，用于风格模仿逻辑
        primaryUploaderTitle: "transformations.effects.styleMimic.uploader1Title",
        primaryUploaderDescription: "transformations.effects.styleMimic.uploader1Desc",
        secondaryUploaderTitle: "transformations.effects.styleMimic.uploader2Title",
        secondaryUploaderDescription: "transformations.effects.styleMimic.uploader2Desc",
      },
      { 
        key: "expressionReference",
        titleKey: "transformations.effects.expressionReference.title", 
        prompt: "Change the expression of the character in the first image to match the expression of the character in the second image.",
        icon: "mood",
        descriptionKey: "transformations.effects.expressionReference.description",
        isMultiImage: true,
        primaryUploaderTitle: "transformations.effects.expressionReference.uploader1Title",
        primaryUploaderDescription: "transformations.effects.expressionReference.uploader1Desc",
        secondaryUploaderTitle: "transformations.effects.expressionReference.uploader2Title",
        secondaryUploaderDescription: "transformations.effects.expressionReference.uploader2Desc",
      },
      { 
        key: "lineArt", 
        titleKey: "transformations.effects.lineArt.title", 
        prompt: "Turn the image into a clean, hand-drawn line art sketch.", 
        icon: "edit", 
        descriptionKey: "transformations.effects.lineArt.description" 
      },
      { 
        key: "colorPalette",
        titleKey: "transformations.effects.colorPalette.title",
        prompt: "Turn this image into a clean, hand-drawn line art sketch.", // 第一步的提示
        stepTwoPrompt: "Color the line art using the colors from the second image.", // 第二步的提示
        icon: "palette",
        descriptionKey: "transformations.effects.colorPalette.description",
        isMultiImage: true,
        isTwoStep: true, // 标记为两步操作
        primaryUploaderTitle: "transformations.effects.colorPalette.uploader1Title",
        primaryUploaderDescription: "transformations.effects.colorPalette.uploader1Desc",
        secondaryUploaderTitle: "transformations.effects.colorPalette.uploader2Title",
        secondaryUploaderDescription: "transformations.effects.colorPalette.uploader2Desc",
      },
      { 
        key: "paintingProcess", 
        titleKey: "transformations.effects.paintingProcess.title", 
        prompt: "Generate a 4-panel grid showing the artistic process of creating this image, from sketch to final render.", 
        icon: "grid_on", 
        descriptionKey: "transformations.effects.paintingProcess.description" 
      },
      { 
        key: "markerSketch", 
        titleKey: "transformations.effects.markerSketch.title", 
        prompt: "Redraw the image in the style of a Copic marker sketch, often used in design.", 
        icon: "palette", 
        descriptionKey: "transformations.effects.markerSketch.description" 
      },
      { 
        key: "addIllustration",
        titleKey: "transformations.effects.addIllustration.title", 
        prompt: "Add a cute, cartoon-style illustrated couple into the real-world scene, sitting and talking.", 
        icon: "person_add",
        descriptionKey: "transformations.effects.addIllustration.description"
      },
      { 
        key: "background",
        titleKey: "transformations.effects.background.title", 
        prompt: "Change the background to a Y2K aesthetic style.", 
        icon: "wallpaper",
        descriptionKey: "transformations.effects.background.description"
      },
      { 
        key: "screen3d",
        titleKey: "transformations.effects.screen3d.title", 
        prompt: "For an image with a screen, add content that appears to be glasses-free 3D, popping out of the screen.", 
        icon: "tv",
        descriptionKey: "transformations.effects.screen3d.description"
      },
    ]
  },
  {
    key: "category_artistic",
    titleKey: "transformations.categories.effects.title",
    icon: "auto_awesome",
    items: [
      { key: "pixelArt", titleKey: "transformations.effects.pixelArt.title", prompt: "Redraw the image in a retro 8-bit pixel art style.", icon: "view_cozy", descriptionKey: "transformations.effects.pixelArt.description" },
      { key: "watercolor", titleKey: "transformations.effects.watercolor.title", prompt: "Transform the image into a soft and vibrant watercolor painting.", icon: "palette", descriptionKey: "transformations.effects.watercolor.description" },
      { key: "popArt", titleKey: "transformations.effects.popArt.title", prompt: "Reimagine the image in the style of Andy Warhol's pop art, with bold colors and screen-print effects.", icon: "color_lens", descriptionKey: "transformations.effects.popArt.description" },
      { key: "comicBook", titleKey: "transformations.effects.comicBook.title", prompt: "Convert the image into a classic comic book panel with halftones, bold outlines, and action text.", icon: "comic_bubble", descriptionKey: "transformations.effects.comicBook.description" },
      { key: "claymation", titleKey: "transformations.effects.claymation.title", prompt: "Recreate the image as a charming stop-motion claymation scene.", icon: "gesture", descriptionKey: "transformations.effects.claymation.description" },
      { key: "ukiyoE", titleKey: "transformations.effects.ukiyoE.title", prompt: "Redraw the image in the style of a traditional Japanese Ukiyo-e woodblock print.", icon: "tsunami", descriptionKey: "transformations.effects.ukiyoE.description" },
      { key: "stainedGlass", titleKey: "transformations.effects.stainedGlass.title", prompt: "Transform the image into a vibrant stained glass window with dark lead lines.", icon: "church", descriptionKey: "transformations.effects.stainedGlass.description" },
      { key: "origami", titleKey: "transformations.effects.origami.title", prompt: "Reconstruct the subject of the image using folded paper in an origami style.", icon: "interests", descriptionKey: "transformations.effects.origami.description" },
      { key: "neonGlow", titleKey: "transformations.effects.neonGlow.title", prompt: "Outline the subject in bright, glowing neon lights against a dark background.", icon: "lightbulb", descriptionKey: "transformations.effects.neonGlow.description" },
      { key: "doodleArt", titleKey: "transformations.effects.doodleArt.title", prompt: "Overlay the image with playful, hand-drawn doodle-style illustrations.", icon: "draw", descriptionKey: "transformations.effects.doodleArt.description" },
      { key: "vintagePhoto", titleKey: "transformations.effects.vintagePhoto.title", prompt: "Give the image an aged, sepia-toned vintage photograph look from the early 20th century.", icon: "photo_album", descriptionKey: "transformations.effects.vintagePhoto.description" },
      { key: "blueprintSketch", titleKey: "transformations.effects.blueprintSketch.title", prompt: "Convert the image into a technical blueprint-style architectural drawing.", icon: "design_services", descriptionKey: "transformations.effects.blueprintSketch.description" },
      { key: "glitchArt", titleKey: "transformations.effects.glitchArt.title", prompt: "Apply a digital glitch effect with datamoshing, pixel sorting, and RGB shifts.", icon: "signal_cellular_nodata", descriptionKey: "transformations.effects.glitchArt.description" },
      { key: "doubleExposure", titleKey: "transformations.effects.doubleExposure.title", prompt: "Create a double exposure effect, blending the image with a nature scene like a forest or a mountain range.", icon: "filter_hdr", descriptionKey: "transformations.effects.doubleExposure.description" },
      { key: "hologram", titleKey: "transformations.effects.hologram.title", prompt: "Project the subject as a futuristic, glowing blue hologram.", icon: "public", descriptionKey: "transformations.effects.hologram.description" },
      { key: "lowPoly", titleKey: "transformations.effects.lowPoly.title", prompt: "Reconstruct the image using a low-polygon geometric mesh.", icon: "change_history", descriptionKey: "transformations.effects.lowPoly.description" },
      { key: "charcoalSketch", titleKey: "transformations.effects.charcoalSketch.title", prompt: "Redraw the image as a dramatic, high-contrast charcoal sketch on textured paper.", icon: "brush", descriptionKey: "transformations.effects.charcoalSketch.description" },
      { key: "impressionism", titleKey: "transformations.effects.impressionism.title", prompt: "Repaint the image in the style of an Impressionist masterpiece, with visible brushstrokes and a focus on light.", icon: "format_paint", descriptionKey: "transformations.effects.impressionism.description" },
      { key: "cubism", titleKey: "transformations.effects.cubism.title", prompt: "Deconstruct and reassemble the subject in the abstract, geometric style of Cubism.", icon: "view_in_ar", descriptionKey: "transformations.effects.cubism.description" },
      { key: "steampunk", titleKey: "transformations.effects.steampunk.title", prompt: "Reimagine the subject with steampunk aesthetics, featuring gears, brass, and Victorian-era technology.", icon: "settings", descriptionKey: "transformations.effects.steampunk.description" },
      { key: "fantasyArt", titleKey: "transformations.effects.fantasyArt.title", prompt: "Transform the image into an epic fantasy-style painting, with magical elements and dramatic lighting.", icon: "swords", descriptionKey: "transformations.effects.fantasyArt.description" },
      { key: "graffiti", titleKey: "transformations.effects.graffiti.title", prompt: "Spray-paint the image as vibrant graffiti on a brick wall.", icon: "format_color_fill", descriptionKey: "transformations.effects.graffiti.description" },
      { key: "minimalistLineArt", titleKey: "transformations.effects.minimalistLineArt.title", prompt: "Reduce the image to a single, continuous, minimalist line drawing.", icon: "line_start", descriptionKey: "transformations.effects.minimalistLineArt.description" },
      { key: "storybook", titleKey: "transformations.effects.storybook.title", prompt: "Redraw the image in the style of a whimsical children's storybook illustration.", icon: "auto_stories", descriptionKey: "transformations.effects.storybook.description" },
      { key: "thermal", titleKey: "transformations.effects.thermal.title", prompt: "Apply a thermal imaging effect with a heat map color palette.", icon: "thermostat", descriptionKey: "transformations.effects.thermal.description" },
      { key: "risograph", titleKey: "transformations.effects.risograph.title", prompt: "Simulate a risograph print effect with grainy textures and limited, overlapping color layers.", icon: "print", descriptionKey: "transformations.effects.risograph.description" },
      { key: "crossStitch", titleKey: "transformations.effects.crossStitch.title", prompt: "Convert the image into a textured, handmade cross-stitch pattern.", icon: "styler", descriptionKey: "transformations.effects.crossStitch.description" },
      { key: "tattoo", titleKey: "transformations.effects.tattoo.title", prompt: "Redesign the subject as a classic American traditional style tattoo.", icon: "ink_pen", descriptionKey: "transformations.effects.tattoo.description" },
      { key: "psychedelic", titleKey: "transformations.effects.psychedelic.title", prompt: "Apply a vibrant, swirling, psychedelic art style from the 1960s.", icon: "psychology", descriptionKey: "transformations.effects.psychedelic.description" },
      { key: "gothic", titleKey: "transformations.effects.gothic.title", prompt: "Reimagine the scene with a dark, gothic art style, featuring dramatic shadows and architecture.", icon: "castle", descriptionKey: "transformations.effects.gothic.description" },
      { key: "tribal", titleKey: "transformations.effects.tribal.title", prompt: "Redraw the subject using patterns and motifs from traditional tribal art.", icon: "groups", descriptionKey: "transformations.effects.tribal.description" },
      { key: "dotPainting", titleKey: "transformations.effects.dotPainting.title", prompt: "Recreate the image using the dot painting technique of Aboriginal art.", icon: "scatter_plot", descriptionKey: "transformations.effects.dotPainting.description" },
      { key: "chalk", titleKey: "transformations.effects.chalk.title", prompt: "Draw the image as a colorful chalk illustration on a sidewalk.", icon: "border_color", descriptionKey: "transformations.effects.chalk.description" },
      { key: "sandArt", titleKey: "transformations.effects.sandArt.title", prompt: "Recreate the image as if it were made from colored sand.", icon: "grain", descriptionKey: "transformations.effects.sandArt.description" },
      { key: "mosaic", titleKey: "transformations.effects.mosaic.title", prompt: "Transform the image into a mosaic made of small ceramic tiles.", icon: "apps", descriptionKey: "transformations.effects.mosaic.description" },
      { key: "paperQuilling", titleKey: "transformations.effects.paperQuilling.title", prompt: "Reconstruct the subject using the art of paper quilling, with rolled and shaped strips of paper.", icon: "unfold_more", descriptionKey: "transformations.effects.paperQuilling.description" },
      { key: "woodCarving", titleKey: "transformations.effects.woodCarving.title", prompt: "Recreate the subject as a detailed wood carving.", icon: "carpenter", descriptionKey: "transformations.effects.woodCarving.description" },
      { key: "iceSculpture", titleKey: "transformations.effects.iceSculpture.title", prompt: "Transform the subject into a translucent, detailed ice sculpture.", icon: "ac_unit", descriptionKey: "transformations.effects.iceSculpture.description" },
      { key: "bronzeStatue", titleKey: "transformations.effects.bronzeStatue.title", prompt: "Turn the subject into a weathered bronze statue on a pedestal.", icon: "account_balance", descriptionKey: "transformations.effects.bronzeStatue.description" },
      { key: "galaxy", titleKey: "transformations.effects.galaxy.title", prompt: "Blend the image with a vibrant nebula and starry galaxy background.", icon: "satellite_alt", descriptionKey: "transformations.effects.galaxy.description" },
      { key: "fire", titleKey: "transformations.effects.fire.title", prompt: "Reimagine the subject as if it were formed from roaring flames.", icon: "local_fire_department", descriptionKey: "transformations.effects.fire.description" },
      { key: "water", titleKey: "transformations.effects.water.title", prompt: "Reimagine the subject as if it were formed from flowing, liquid water.", icon: "water_drop", descriptionKey: "transformations.effects.water.description" },
      { key: "smokeArt", titleKey: "transformations.effects.smokeArt.title", prompt: "Create the subject from elegant, swirling wisps of smoke.", icon: "air", descriptionKey: "transformations.effects.smokeArt.description" },
      { key: "vectorArt", titleKey: "transformations.effects.vectorArt.title", prompt: "Convert the photo into clean, scalable vector art with flat colors and sharp lines.", icon: "polyline", descriptionKey: "transformations.effects.vectorArt.description" },
      { key: "infrared", titleKey: "transformations.effects.infrared.title", prompt: "Simulate an infrared photo effect with surreal colors and glowing foliage.", icon: "camera", descriptionKey: "transformations.effects.infrared.description" },
      { key: "knitted", titleKey: "transformations.effects.knitted.title", prompt: "Recreate the image as a cozy, knitted wool pattern.", icon: "texture", descriptionKey: "transformations.effects.knitted.description" },
      { key: "etching", titleKey: "transformations.effects.etching.title", prompt: "Redraw the image as a classic black and white etching or engraving.", icon: "history_edu", descriptionKey: "transformations.effects.etching.description" },
      { key: "diorama", titleKey: "transformations.effects.diorama.title", prompt: "Turn the scene into a miniature 3D diorama inside a box.", icon: "inventory_2", descriptionKey: "transformations.effects.diorama.description" },
      { 
        key: "cyberpunk", 
        titleKey: "transformations.effects.cyberpunk.title", 
        prompt: "Transform the scene into a futuristic cyberpunk city.", 
        icon: "robot", 
        descriptionKey: "transformations.effects.cyberpunk.description" 
      },
      { 
        key: "vanGogh", 
        titleKey: "transformations.effects.vanGogh.title", 
        prompt: "Reimagine the photo in the style of Van Gogh's 'Starry Night'.", 
        icon: "star", 
        descriptionKey: "transformations.effects.vanGogh.description" 
      },
      {
        key: "kidsDoodle",
        titleKey: "transformations.effects.kidsDoodle.title",
        prompt: "Redraw the image in the style of a child's doodle on a piece of messy scratch paper. The drawing should have simple, wobbly lines and basic, slightly-outside-the-lines coloring, as if done with crayons or colored pencils. The scratch paper background should show faint traces of other unrelated scribbles or math problems, adding to the authenticity of a used piece of paper.",
        icon: "draw",
        descriptionKey: "transformations.effects.kidsDoodle.description"
      },
    ]
  },
];
