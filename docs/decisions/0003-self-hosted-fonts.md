# 0003 · 字体自托管

日期：2026-11-04 · 状态：已采纳

## 决定

用 Astro Fonts API（`fontProviders.fontsource()`）在构建时下载 Instrument Serif、IBM Plex Sans、IBM Plex Mono，和站点一起部署。不链接 Google Fonts。

中文不加载 web font，回退到系统字体：

- 正文：PingFang SC → Noto Sans SC
- 标题：Songti SC → Noto Serif SC（Instrument Serif 只有拉丁字符集）

## 理由

- 部分访客在中国大陆，Google Fonts 在那里无法访问，页面会一直等字体。
- 自托管不向第三方发送访客信息，Fonts API 还会自动生成 preload 和尺寸匹配的回退字体，减少布局跳动。
- 中文 web font 体积太大，系统自带的苹方 / 思源已经足够。
