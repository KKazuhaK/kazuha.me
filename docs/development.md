# 开发约定

## 环境

- Node：版本见 `.nvmrc`（Astro 7 要求 ≥ 22.23.4）。
- 包管理：npm。不要提交其他包管理器的 lock 文件。

## 常用命令

| 命令                   | 作用                                                                              |
| ---------------------- | --------------------------------------------------------------------------------- |
| `npm install`          | 安装依赖                                                                          |
| `npm run dev`          | 本地开发服务器（`astro dev --background` 可在后台运行，用 `astro dev stop` 停止） |
| `npm run build`        | 构建到 `dist/`                                                                    |
| `npm run check`        | `astro check` 类型检查                                                            |
| `npm run lint`         | ESLint                                                                            |
| `npm run format`       | Prettier 格式化                                                                   |
| `npm run format:check` | 只检查格式，不改文件（CI 用）                                                     |
| `npm run preview:cf`   | 构建后用 `wrangler dev` 按线上方式预览                                            |
| `npm run deploy`       | 构建并 `wrangler deploy`（手动部署；平时由 Workers Builds 自动部署）              |

提交前至少跑一遍 `npm run check && npm run lint && npm run format:check && npm run build`。

## CI 与部署流程

- **GitHub Actions**（`.github/workflows/ci.yml`）：每个 PR 和每次推送到 `main` 都跑 `npm ci` → `check` → `lint` → `format:check` → `build`。它只做检查，不部署，也不需要任何密钥。
- **Cloudflare Workers Builds**：连接 GitHub 仓库后由 Cloudflare 拉取代码自己构建。推送到 `main` 时部署生产环境；其他分支生成预览链接。
- 两者互不依赖，Cloudflare 不等 CI 结果。`main` 目前没有分支保护，顺序靠手动遵守：PR 的 CI 通过后再合并，合并后 Cloudflare 才会部署。

## 目录结构

```
src/
  components/   展示组件（.astro）
  layouts/      BaseLayout 等页面骨架
  pages/        路由；页面只取数据、拼组件，不写个人信息
  content/      MD/MDX 内容（projects、posts），按 en/ zh/ 分目录
  data/         YAML 数据（updates、education、experience、teaching、links）
  config/       site.ts：名字、身份、导航、外链地址
  i18n/         界面文字与语言工具函数
  styles/       tokens.css（设计 token）、global.css（基础样式）
public/         头像、简历 PDF、favicon
docs/           规格、约定、决策记录
```

## 写代码的规则

- 页面和组件里不写死个人信息（学校、职位、邮箱、链接），一律从 `src/config/site.ts` 或数据文件读取。
- 颜色、字体、圆角、间距只用 `tokens.css` 里的变量，不在组件里写十六进制颜色。示意图里的专用颜色例外，写在该组件里并加注释。
- 可点元素必须是 `<a>` 或 `<button>`，有可见文字；纯图标按钮加 `aria-label`。触控区域至少 44×44px。
- 交互用原生 HTML + 少量内联脚本，脚本失效时内容仍然可用（见 [ADR 0001](decisions/0001-no-ui-framework.md)）。
- 外链用 `LinkButton`，或配合 `ExternalIcon` 手写：必须同时有 `target="_blank"`、`rel="noopener"` 和 `ExternalIcon`（↗ 图标 + "在新标签页打开"的隐藏文字）。
- 站内链接用 `getRelativeLocaleUrl()` 生成，不手写 `/zh/` 前缀。
- Astro 7 默认按 JSX 规则压缩 HTML，相邻行内元素之间的空格会被去掉；需要空格时显式写 `{" "}`。

## 决策记录

重要的技术选择写进 `docs/decisions/`，文件名 `NNNN-简短描述.md`，内容包括背景、决定、理由。推翻旧决定时新建一条，并把旧的一条状态改为"已被 NNNN 取代"。

## Git

- 分支按内容命名：`feat/…`、`fix/…`、`docs/…`、`content/…`。
- 提交信息用英文祈使句，第一行不超过 72 字符，例如 `Add mobile menu to header`。
- 合并到 `main` 走 PR，Workers Builds 会在 PR 上贴预览链接。
