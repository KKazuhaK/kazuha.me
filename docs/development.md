# 开发约定

## 环境

- Node：版本见 `.nvmrc`（Astro 7 要求 ≥ 22.23.4）。
- 包管理：npm。不要提交其他包管理器的 lock 文件。

## 常用命令

| 命令                   | 作用                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `npm install`          | 安装依赖                                                                                |
| `npm run dev`          | 本地开发服务器（`astro dev --background` 可在后台运行，用 `astro dev stop` 停止）       |
| `npm run build`        | 构建到 `dist/`                                                                          |
| `npm run check`        | `astro check` 类型检查                                                                  |
| `npm run lint`         | ESLint                                                                                  |
| `npm run format`       | Prettier 格式化                                                                         |
| `npm run format:check` | 只检查格式，不改文件（CI 用）                                                           |
| `npm run preview:cf`   | 构建后用 `wrangler dev` 按线上方式预览                                                  |
| `npm run deploy`       | 构建并 `wrangler deploy`（手动部署，需要本地 `wrangler login`；平时推 `main` 自动部署） |

提交前至少跑一遍 `npm run check && npm run lint && npm run format:check && npm run build`。

## CI 与部署流程

```
push main ──► GitHub Actions：npm ci → check → lint → format:check → build
                 │ 全部通过
                 ▼
              把 dist/ 和 wrangler.jsonc 提交到 deploy 分支
                 │
                 ▼
              Cloudflare Workers Builds 监听 deploy 分支，只跑 npx wrangler deploy
```

- **只在 GitHub Actions 构建一次**（`.github/workflows/ci.yml`）。仓库是公开的，GitHub 托管的 runner 不计分钟。
  - `build` job：安装、检查、构建。它会运行第三方代码，所以只有只读权限，也不把 token 留在 git 配置里。
  - `publish` job：只在推送 `main` 且 `build` 通过时运行，不装依赖，只把构建产物推到 `deploy` 分支，所以只有它有写权限。
- **`deploy` 分支只放构建产物**，由 CI 生成，不要手动改。检查没过就不会推送，所以坏代码不会上线。构建结果和上次一样时不提交。
- **Cloudflare 不构建**：Workers Builds 的生产分支是 `deploy`，构建命令留空，部署命令 `npx wrangler@4.157.0 deploy`（版本和 `package-lock.json` 里的一致，升级 wrangler 时一起改）；`deploy` 分支没有 `package.json`，不装依赖，每次只占很少的构建分钟。非生产分支的构建是关闭的。
- **不需要任何 Cloudflare 密钥**：CI 只用 GitHub 自带的 `GITHUB_TOKEN` 推送 `deploy` 分支；Cloudflare 通过已授权的 GitHub App 拉取。
- **PR 只做检查，不做预览**。想看效果在本地跑 `npm run preview:cf`。
- 发布失败（例如推送 `deploy` 出错）时，正式站停在上一个版本；在 Actions 里对那次运行点 “Re-run jobs” 即可。
- 回滚：在 `main` 上 revert 后推送。Cloudflare 后台 Deployments 里的回滚只是临时的，下一次推 `main` 会重新部署。

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
- 小改动可以直接推 `main`；较大的改动走 PR，CI 在 PR 上检查。两种方式都要 CI 通过才会部署。
