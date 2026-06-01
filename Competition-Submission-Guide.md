# Quietly 比赛提交说明

## 1. 推荐提交材料

为了让评委可以直接理解和体验 Quietly，建议提交以下材料：

- 项目源码仓库：GitHub 或压缩包
- 在线演示地址：部署后的 Web Demo 链接
- 产品说明文档：`Quietly-Product-Brief.md`
- 项目运行说明：`README.md`
- 演示视频：1 到 3 分钟
- 截图：首屏、环境分析、声场切换、隐私说明

当前阶段不建议强行打包成微信小程序参赛。更稳妥的方式是提交 Web MVP，并在说明中写清楚后续将迁移到微信小程序。

## 2. 在线演示方式

推荐部署为一个可访问的网页链接，让评委无需安装即可体验。

可选平台：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

注意事项：

- 麦克风权限通常要求 HTTPS 环境。
- 本地 `http://127.0.0.1` 可以测试麦克风，但普通 `http` 线上地址可能无法获取麦克风权限。
- 内嵌预览器可能拿不到系统麦克风权限，建议用 Chrome 或 Edge 打开。

## 3. 本地运行方式

评委或开发者可以按以下方式本地运行：

```bash
npm install
npm run dev
```

启动后打开：

```text
http://127.0.0.1:5173/
```

如果只是查看生产构建：

```bash
npm run build
npm run preview
```

## 4. 打包方式

生成生产版本：

```bash
npm run build
```

构建产物会输出到：

```text
dist/
```

`dist/` 文件夹可以用于部署到静态网站平台。

## 5. 源码提交建议

建议提交完整源码，不要只提交 `dist/`。源码能让评委看到产品逻辑、技术实现和后续扩展能力。

推荐仓库结构：

```text
quietly-app/
  README.md
  Quietly-Product-Brief.md
  Competition-Submission-Guide.md
  package.json
  src/
  public/
  dist/
```

如果比赛平台只允许上传压缩包，可以整理为：

```text
Quietly-competition-package/
  README.md
  Quietly-Product-Brief.md
  Competition-Submission-Guide.md
  demo-video.mp4
  screenshots/
    home.png
    detection.png
    scenes.png
  source/
    quietly-app.zip
  links.md
```

## 6. 演示视频脚本

建议视频控制在 1 到 3 分钟。

### 开场

展示 Quietly 首屏，说明：

“Quietly 是一个移动端优先的 AI 声音掩蔽工具。它会本地分析环境声，并推荐适合当前环境的专注声场。”

### 功能演示

1. 点击开始分析。
2. 允许麦克风权限。
3. 展示实时环境状态和声场推荐。
4. 手动切换五个声场，展示插图、背景和音频氛围变化。
5. 展示隐私说明：不录音、不保存、不上传。

### 结尾

说明当前是 Web MVP，后续计划迁移到微信小程序，增强识别稳定性和个性化推荐。

## 7. 评委重点说明

建议在提交材料里强调三点：

- Quietly 解决的是“噪音干扰感”，不是承诺完全消除噪音。
- 当前版本采用本地环境声分析，保护隐私。
- MVP 已具备完整闭环：环境分析、噪音判断、声场推荐、视觉反馈、音频播放。

## 8. 当前版本限制

需要如实说明：

- 当前不是主动降噪。
- 当前不是训练后的大模型识别。
- 环境判断是基于音频特征的轻量规则引擎。
- 浏览器麦克风权限受系统、浏览器和 HTTPS 环境影响。
- 微信小程序版本需要后续重新适配。

这样的表达更可信，也更适合比赛评审。

## 9. GitHub 仓库建议

仓库首页建议包含：

- 产品一句话介绍
- Demo 链接
- 截图或动图
- 本地运行命令
- 核心功能列表
- 隐私说明
- 当前 MVP 边界
- 后续 Roadmap

提交前可以检查：

```bash
npm run build
```

确认构建通过后再上传。

## 10. 后续微信小程序路线

后续迁移小程序时，建议优先考虑：

- 使用 Taro 保留 React 组件开发体验
- 替换浏览器麦克风 API 为微信录音能力
- 使用微信音频播放器管理循环播放和淡入淡出
- 保留当前“声场数据结构”和“推荐逻辑”
- 将隐私授权流程做成小程序内的明确提示

第一版参赛更建议先交 Web MVP，因为它更容易让评委直接打开、直接看、直接听。

