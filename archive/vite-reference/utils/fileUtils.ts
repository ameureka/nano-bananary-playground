


/**
 * 将 File 对象转换为 Base64 字符串。
 * @param file 要转换的文件。
 * @returns 返回一个包含 base64 字符串和 mimeType 的 Promise。
 */
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error("未能将文件读取为 Base64。"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * 将 Data URL 转换为 File 对象。
 * @param dataUrl 要转换的 Data URL。
 * @param filename 期望的文件名。
 * @returns 返回一个 File 对象的 Promise。
 */
export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

/**
 * 从 Data URL 加载图片。
 * @param dataUrl 图片的 Data URL。
 * @returns 返回一个解析为加载完成的 HTMLImageElement 的 Promise。
 */
export const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // 允许跨域加载图片以进行 canvas 操作
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error("从 Data URL 加载图片失败。"));
        img.src = dataUrl;
    });
};

/**
 * 将源图像的大小调整为与目标图像的尺寸相匹配。
 * @param sourceDataUrl 要调整大小的图像的 Data URL。
 * @param targetImage 具有目标尺寸的已加载的 HTMLImageElement。
 * @returns 返回一个解析为调整大小后图像的 Data URL 的 Promise。
 */
export const resizeImageToMatch = (sourceDataUrl: string, targetImage: HTMLImageElement): Promise<string> => {
     return new Promise((resolve, reject) => {
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
       if (!ctx) {
         return reject(new Error("无法获取 canvas 上下文。"));
       }
       
       const sourceImage = new Image();
       sourceImage.crossOrigin = "anonymous";
       sourceImage.onload = () => {
         canvas.width = targetImage.naturalWidth;
         canvas.height = targetImage.naturalHeight;
         
         ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
         resolve(canvas.toDataURL('image/png'));
       };
       sourceImage.onerror = () => reject(new Error("加载源图像以进行大小调整失败。"));
       sourceImage.src = sourceDataUrl;
     });
};


/**
 * 将字符串转换为其二进制表示形式。
 * @param text 要转换的字符串。
 * @returns 一个由 0 和 1 组成的字符串。
 */
const textToBinary = (text: string): string => {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
};

/**
 * 使用隐写术（LSB）将不可见的文本水印嵌入到图像中。
 * @param imageUrl 要添加水印的图像的 Data URL。
 * @param text 要嵌入的文本。
 * @returns 返回一个解析为带水印图像的 Data URL 的 Promise。
 */
export const embedWatermark = (imageUrl: string, text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return reject(new Error("无法获取 canvas 上下文。"));
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const watermarkText = text + "::END"; // 添加一个结束分隔符
            const binaryMessage = textToBinary(watermarkText);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 检查信息是否过长
            if (binaryMessage.length > data.length / 4 * 3) {
                 console.warn("水印对于图像来说太长了。跳过。");
                 return resolve(imageUrl); // 如果太长则返回原图
            }

            let messageIndex = 0;
            // 遍历像素数据，嵌入信息
            for (let i = 0; i < data.length && messageIndex < binaryMessage.length; i += 4) {
                // 嵌入到 R, G, B 通道
                for (let j = 0; j < 3 && messageIndex < binaryMessage.length; j++) {
                    const bit = parseInt(binaryMessage[messageIndex], 2);
                    // 清除最低有效位（LSB），然后设置它
                    data[i + j] = (data[i + j] & 0xFE) | bit;
                    messageIndex++;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error("加载图像以添加水印失败。"));
        img.src = imageUrl;
    });
};

/**
 * 以编程方式触发给定 Data URL 的文件下载。
 * @param url 要下载的文件的 Data URL。
 * @param filename 下载文件的期望名称。
 */
export const downloadImage = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 在图像的右下角添加一个可见的文本水印。
 * @param imageUrl 要添加水印的图像的 Data URL。
 * @param text 要显示的文本。
 * @returns 返回一个解析为带水印图像的 Data URL 的 Promise。
 */
export const addVisibleWatermark = (imageUrl: string, text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return reject(new Error("无法获取用于可见水印的 canvas 上下文。"));
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 水印样式
            const baseFontSize = Math.sqrt(img.width * img.height) / 80;
            const fontSize = Math.max(12, Math.min(baseFontSize, 50)); 
            
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // 半透明白色
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            
            // 为文本添加细微阴影以提高可读性
            ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
            ctx.shadowBlur = 5;

            const padding = fontSize;
            ctx.fillText(text, canvas.width - padding, canvas.height - padding);

            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error("加载图像以添加可见水印失败。"));
        img.src = imageUrl;
    });
};
