# 0004 · 中英文内容的组织与回退

日期：2026-11-04 · 状态：已采纳（中文内容在 M3 补齐）

## 决定

- 路由：英文在根路径，中文在 `/zh/…`（Astro i18n：`locales: ['en','zh']`，`defaultLocale: 'en'`，`prefixDefaultLocale: false`）。链接一律用 `getRelativeLocaleUrl()` 生成。
- 内容按目录分语言：`src/content/projects/en/anteater-mcp.mdx`、`src/content/projects/zh/anteater-mcp.mdx`。语言从 id 的第一段取，slug 是剩下的部分。
- 不用 Astro 内置的 `i18n.fallback`。在 `getStaticPaths` 里给每条英文内容都生成 `/zh/` 路由：有中文版就用中文版，没有就用英文版并显示"本页暂无中文版"提示。
- 界面文字（按钮、标题）放在 `src/i18n/ui.ts`，按语言取。

## 理由

- 文件名后缀（`anteater-mcp.en.mdx`）不可行：`glob()` 默认用 github-slugger 生成 id，点号会被处理掉，生成的 id 不能直接当 slug。
- 内置 fallback 只作用于 `src/pages` 下的页面，并且只能用英文内容替换中文页面，无法显示"缺翻译"提示，也不覆盖集合生成的详情页。
- 在代码里显式处理，行为一目了然，也方便以后加第三种语言。
