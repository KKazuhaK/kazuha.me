# 0002 · 样式用普通 CSS + 设计 token

日期：2026-11-04 · 状态：已采纳

## 决定

- 颜色、字体、圆角、间距全部写成 CSS 变量，集中在 `src/styles/tokens.css`。
- 全局基础样式（重置、正文排版）放在 `src/styles/global.css`。
- 组件样式写在组件自己的 `<style>` 里，由 Astro 自动限定作用域。
- 不用 CSS Modules，也不用 Tailwind。

## 理由

- Astro 的 `<style>` 默认只作用于当前组件，CSS Modules 解决的问题在这里已经不存在。
- 站点只有五六种页面，Tailwind 的工具类换不来多少效率，反而会让设计 token 分散到模板里。
- 换主色或字体只改 `tokens.css` 一个文件。
