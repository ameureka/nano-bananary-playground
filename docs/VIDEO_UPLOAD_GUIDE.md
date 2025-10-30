# 如何在 GitHub README 中直接播放视频

## 方法一：通过 GitHub Issues 上传（推荐）

这是最简单的方法，GitHub 会自动托管你的视频。

### 步骤：

1. 在你的 GitHub 仓库中，进入 **Issues** 标签页
2. 点击 **New Issue** 创建一个新的 Issue
3. 在 Issue 的描述框中，直接**拖拽或粘贴**你的视频文件（支持 .mp4, .mov 等格式，最大 10MB）
4. GitHub 会自动上传并生成一个链接，格式类似：
   ```
   https://user-images.githubusercontent.com/12345678/123456789-abcd1234-5678-90ab-cdef-1234567890ab.mp4
   ```
5. **复制这个链接**（不要提交 Issue，可以直接关闭）
6. 在 README.md 中使用这个链接：

```markdown
<video src="你复制的视频链接" controls width="600"></video>
```

## 方法二：上传到仓库（适合小视频）

如果视频文件小于 100MB，可以直接提交到仓库。

### 步骤：

1. 在项目根目录创建 `docs/videos/` 文件夹
2. 将视频文件放入该文件夹，例如：`docs/videos/demo.mp4`
3. 提交到 GitHub
4. 在 README.md 中引用：

```markdown
<video src="./docs/videos/demo.mp4" controls width="600"></video>
```

或使用完整 URL：

```markdown
<video src="https://github.com/ameureka/nano-bananary-playground/raw/main/docs/videos/demo.mp4" controls width="600"></video>
```

## 方法三：使用 GitHub Releases

适合较大的视频文件。

### 步骤：

1. 进入仓库的 **Releases** 页面
2. 创建一个新的 Release 或编辑现有的 Release
3. 在 Release 描述中上传视频文件
4. 发布后，视频会有一个永久链接
5. 在 README 中使用该链接

## 示例代码

### 基本视频播放器

```markdown
<video src="你的视频链接" controls width="600"></video>
```

### 带有封面图的视频播放器

```markdown
<video src="你的视频链接" poster="封面图链接" controls width="600">
  Your browser does not support the video tag.
</video>
```

### 居中显示的视频

```markdown
<div align="center">
  <video src="你的视频链接" controls width="600"></video>
  <p>🎥 项目演示视频</p>
</div>
```

## 注意事项

1. **文件大小限制**：
   - Issues/PR 评论：最大 10MB
   - 仓库文件：最大 100MB
   - Releases：最大 2GB

2. **支持的格式**：
   - .mp4（推荐）
   - .mov
   - .webm

3. **视频优化建议**：
   - 压缩视频以减小文件大小
   - 使用 H.264 编码的 MP4 格式以获得最佳兼容性
   - 分辨率建议：1280x720 或 1920x1080

## 推荐工具

### 视频压缩工具：
- **HandBrake**（免费，跨平台）
- **FFmpeg**（命令行工具）
- **在线工具**：https://www.freeconvert.com/video-compressor

### FFmpeg 压缩命令示例：

```bash
# 压缩视频到合适大小
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 1000k -b:a 128k output.mp4

# 调整分辨率
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4
```

## 完成后

修改 README.md 中的视频部分，将注释的代码取消注释并替换为你的视频链接：

```markdown
<!-- 取消注释并替换链接 -->
<video src="https://user-images.githubusercontent.com/your-user-id/your-video.mp4" controls width="600"></video>
```

---

如有问题，请参考 [GitHub 文档](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files)
