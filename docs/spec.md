# kazuha.me 站点规格

kazuha.me 是 Kazuha Mo 的个人主页与作品集：多页面、内容驱动。kazuha.org 归团队 Kazuha Hub，个人站不放在那里；各校的课程笔记站留在学校的空间里（目前是 ics.uci.edu/~kazuhak），主站只在 `/notes` 列出并外链过去。

技术决策的理由见 [`decisions/`](decisions/)，日常开发约定见 [`development.md`](development.md)，改内容见 [`content.md`](content.md)。

## 目标

- **受众**：实习招聘方、教授与研究合作者、同行开发者，以及不常上网的访客（如家人朋友）。
- **入口一眼可见**：所有可点的地方都是写着字的按钮或卡片，不依赖悬停、快捷键或隐藏手势。
- **手机优先**：390px 宽的手机上第一屏必须看到四张入口卡片；导航收进一个写着 "Menu" 的按钮。
- **长期维护**：内容放在数据文件和 MD/MDX 里，加文章、改经历不碰页面代码；共享部分做成组件，改一处全站生效。
- **设计参照**：外部设计画布「Kazuha 主站风格 Demo」第二行的 5 页多页原型。原型只作参考，不照搬代码。

## 技术栈

| 层     | 选择                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 框架   | Astro 7.x，纯静态输出，全站 TypeScript（`astro/tsconfigs/strict`）                                                             |
| 交互   | 原生 HTML + 少量内联 `<script>`，不引入 UI 框架（[ADR 0001](decisions/0001-no-ui-framework.md)）                               |
| 内容   | Content Collections（`src/content.config.ts`，`glob()` / `file()` + Zod schema）                                               |
| 写作   | MDX（`@astrojs/mdx`）                                                                                                          |
| 样式   | 普通 CSS：`src/styles/tokens.css` 放设计 token，组件用 Astro 自带的作用域 `<style>`（[ADR 0002](decisions/0002-plain-css.md)） |
| 字体   | Astro Fonts API + Fontsource，构建时下载并自托管（[ADR 0003](decisions/0003-self-hosted-fonts.md)）                            |
| 多语言 | 英文在根路径，中文在 `/zh/…`；内容按目录分语言，回退在代码里做（[ADR 0004](decisions/0004-i18n-layout.md)）                    |
| 部署   | Cloudflare Workers 静态资源（`wrangler.jsonc`），不需要 adapter                                                                |
| 包管理 | npm；Node 版本见 `.nvmrc`                                                                                                      |
| 检查   | `astro check`、ESLint、Prettier                                                                                                |

## 信息架构与路由

顶栏：Home · Projects · Blog · CV · Links · Notes。顺序和开关都在 `src/config/site.ts` 的 `nav` 里。第一篇文章发布前 Blog 关闭；暂不设 Research，研究作为一个项目放在 Projects 里。

| 路由               | 页面       | 说明                                                     |
| ------------------ | ---------- | -------------------------------------------------------- |
| `/`                | 首页       | 简介、Now 状态、四个入口卡片、精选项目、最近动态         |
| `/projects`        | 项目列表   | 按类别筛选（All / Open source / Research / Infra & web） |
| `/projects/[slug]` | 项目详情   | 由 `projects` 集合生成                                   |
| `/blog`            | 文章列表   | 按时间倒序，支持标签筛选                                 |
| `/blog/[slug]`     | 文章       | MDX 渲染                                                 |
| `/blog/tags/[tag]` | 标签页     | M3                                                       |
| `/cv`              | 网页版简历 | 含 "Download PDF"，PDF 放 `public/`                      |
| `/links`           | 所有链接   | 学校、我的网站、代码、联系方式分组                       |
| `/notes`           | 课程笔记   | 按学校列出各校的笔记站，数据来自 `notes.yaml`            |
| `/404`             | 404        | 带回首页按钮；`/zh/404` 为中文版                         |
| `/zh/...`          | 中文版     | 与英文同结构；缺翻译时显示英文并提示                     |
| `/rss.xml`         | RSS        | `@astrojs/rss`                                           |

外链规则：

- 指向其他站点的链接一律带 ↗ 图标，在新标签页打开（`target="_blank" rel="noopener"`），读屏软件会读出隐藏文字"在新标签页打开"。站内链接始终在当前标签页打开。
- Notes 是站内页面 `/notes`，不直接跳到某所学校。各校笔记站的地址写在 `src/data/notes.yaml`，换学校时加一条，旧的保留。
- 有正式产出（论文、preprint、poster）后再加 `/research`，并在 `nav` 里打开。

## 内容模型

会变的内容都在 `src/content/` 和 `src/data/`，页面只负责展示。

| 集合 / 文件  | 位置与 loader                                  | 字段                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects`   | `src/content/projects/{en,zh}/*.mdx`，`glob()` | `title`, `summary`, `kind`（`oss` / `research` / `infra`）, `year`, `role`, `stack: string[]`, `status`（`active` / `done` / `in-progress`）, `featured`, `order`, `cta`（界面文字的键：`readCaseStudy` / `seeContributions` / `readMore`，默认 `readCaseStudy`）, `highlights?: string[]`（卡片示意图里展示的要点，如 PR 标题）, `links: { github?, demo?, paper? }`（都是完整网址）, `cover?`（示意图名称） |
| `posts`      | `src/content/posts/{en,zh}/*.mdx`，`glob()`    | `title`, `description`, `date`, `updated?`, `tags: string[]`, `draft`, `relatedProject?`                                                                                                                                                                                                                                                                                                                      |
| `updates`    | `src/data/updates.yaml`，`file()`              | `id`, `date`（字符串，`YYYY-MM` 或 `YYYY-MM-DD`，只写已知的精度；页面显示 "Oct 2026"）, `text`, `href?`                                                                                                                                                                                                                                                                                                       |
| `education`  | `src/data/education.yaml`，`file()`            | `id`, `school`, `degree`, `field`, `division?`, `start`, `end`, `expected`, `notes: string[]`, `url`                                                                                                                                                                                                                                                                                                          |
| `research`   | `src/data/research.yaml`，`file()`             | `id`, `title`, `start`, `end?`, `with?`, `summary`                                                                                                                                                                                                                                                                                                                                                            |
| `skills`     | `src/data/skills.yaml`，`file()`               | `id`, `order`, `label`, `items: string[]`                                                                                                                                                                                                                                                                                                                                                                     |
| `experience` | `src/data/experience.yaml`，`file()`           | `id`, `title`, `org`, `location`, `start`, `end?`, `mode?`, `summary?`                                                                                                                                                                                                                                                                                                                                        |
| `teaching`   | `src/data/teaching.yaml`，`file()`             | `id`, `order`, `role`, `course`, `courseTitle?`, `org`, `term`, `notes?: string[]`                                                                                                                                                                                                                                                                                                                            |
| `links`      | `src/data/links.yaml`，`file()`                | `id`, `order`, `group`（`school` / `sites` / `code` / `contact`）, `name`, `sub`, `enabled?`（默认 `true`，`false` 时隐藏）, `url`（网址；站内路径如 `/notes`，会按当前语言加前缀；或 `github` / `linkedin` / `email` 之一，由代码从 `site.ts` 取值）, `display?`, `mark`, `cta`                                                                                                                              |
| `notes`      | `src/data/notes.yaml`，`file()`                | `id`, `order`, `school`（`/notes` 上按它分组）, `name`, `sub`, `url`, `mark`, `cta`                                                                                                                                                                                                                                                                                                                           |
| 站点配置     | `src/config/site.ts`                           | `url`, `name`, `tagline`, `intro`, `now: { label, org }`, `role: { title, org }`, `avatar`, `cv: { updated, pdf }`, `email`, `social`, `nav`                                                                                                                                                                                                                                                                  |

约定：

- `file()` 加载的 YAML 每条必须有唯一 `id`（loader 不自动生成）。
- 语言由目录决定（`en/`、`zh/`），不用文件名后缀，也不用 `lang` 字段。
- `draft: true` 的文章在生产构建里排除，本地可见。
- 列表排序在代码里显式做（按 `date` / `order`），不依赖集合返回顺序。
- 阅读时间在代码里从 `entry.body` 计算。Astro 7 默认的 Markdown 管线不是 remark，不用 remark 插件。

## 组件清单

所有页面套 `BaseLayout`，顶栏和页脚只存在一份。

| 组件                    | 用在               | 职责                                                                                    |
| ----------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `BaseLayout`            | 所有页面           | `<head>`（viewport、SEO、OG、字体）、Header、Footer                                     |
| `Header`                | 所有页面           | 读 `site.nav` 渲染桌面导航和手机菜单，按当前路由高亮                                    |
| `MobileMenu`            | Header             | "Menu / Close" 按钮 + 整列大按钮 + 语言切换 + Contact；`aria-expanded`                  |
| `LangSwitch`            | Header、MobileMenu | 一个不起眼的文字链接，指向另一种语言的同一页面（英文页显示“中文”，中文页显示“English”） |
| `Footer`                | 所有页面           | 版权、Email / GitHub / All links                                                        |
| `LinkButton`            | 全站               | 实心 / 描边 / 次要三种；外链自动加 ↗；最小高度 44px                                     |
| `QuickLinkTile`         | 首页               | 图标 + 标题 + 副标题 + 动作文字                                                         |
| `NowBadge`              | 首页               | 读 `site.now`                                                                           |
| `ProjectCard`           | 首页、/projects    | 封面或示意图、标签、简介、跳转按钮                                                      |
| `ProjectFilter`         | /projects          | 类别按钮，`aria-pressed`；无脚本时显示全部                                              |
| `ProjectMeta`           | 项目详情           | Role / Year / Stack                                                                     |
| `ArchDiagram`           | 项目详情、MDX      | 方框 + 箭头 SVG，手机纵向                                                               |
| `Breadcrumb`            | 子页面             | Home / Projects / …                                                                     |
| `PostCard` / `PostList` | 首页、/blog        | 标题、日期、标签、摘要                                                                  |
| `TimelineEntry`         | /cv                | 左时间右内容，手机上下排列                                                              |
| `UpdatesList`           | 首页               | 最近动态                                                                                |
| `LinkRow` / `LinkGroup` | /links、/notes     | 图标、名称、说明、网址、"Visit ↗"                                                       |
| `Prose`                 | 文章、项目详情     | MDX 正文排版                                                                            |

## 设计规范

浅灰底、白色卡片、衬线大标题、蓝色单一强调色；所有值都是 `src/styles/tokens.css` 里的 CSS 变量。

| Token             | 值                                 | 用途                                   |
| ----------------- | ---------------------------------- | -------------------------------------- |
| `--bg`            | `#f7f7f5`                          | 页面底色                               |
| `--surface`       | `#ffffff`                          | 卡片、顶栏                             |
| `--border`        | `#e2e4e9`                          | 卡片边框、分隔线                       |
| `--border-strong` | `#cfd3db`                          | 次按钮描边                             |
| `--text`          | `#16181d`                          | 正文、标题、主按钮底色                 |
| `--text-2`        | `#474c57`                          | 次要文字                               |
| `--text-3`        | `#5a5f6b`                          | 标签、日期                             |
| `--accent`        | `#2448c9`                          | 链接、当前导航、强调按钮               |
| `--accent-soft`   | `#eef1fb`                          | 当前导航底色、图标底色                 |
| 标题字体          | Instrument Serif 400               | h1 60px（手机 38px），卡片标题 26–30px |
| 正文字体          | IBM Plex Sans 400/500/600          | 15–18px                                |
| 等宽字体          | IBM Plex Mono 400/500              | 日期、标签、代码                       |
| 圆角              | 10px 按钮 · 16px 卡片              |                                        |
| 间距              | 8 的倍数；区块间 72px（手机 48px） |                                        |

已核对对比度（WCAG）：`--text-3` 在 `--bg` 上 5.96:1，`--accent` 在 `--bg` 上 6.88:1，白字在 `--accent` 上 7.38:1。`--border-strong` 在白底上只有 1.5:1，按钮靠文字识别所以合规；如果实测觉得次按钮不像按钮，可以调深到 3:1 以上。

中文回退字体：

- 正文：`'IBM Plex Sans', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif`
- 标题：`'Instrument Serif', 'Songti SC', 'Noto Serif SC', Georgia, serif`（Instrument Serif 只有拉丁字符）

交互与可读性：

- 可点元素都是真正的 `<a>` 或 `<button>`，有可见文字；纯图标按钮必须有 `aria-label`。
- 触控区域至少 44×44px；正文对比度至少 4.5:1。
- 悬停效果只是加分项，不承载信息。
- 断点 860px：以下切换为手机布局。
- 暗色模式放 M3，在 `:root[data-theme=dark]` 下重定义 token。

## 页面规格

**首页 `/`**

1. 头像 + 名字 + tagline（手机上头像 72px、名字 38px，同一行）。`site.avatar` 为 `[占位]` 时显示姓名首字母（KM）的灰色圆盘作为占位头像
2. `NowBadge` + 当前职位胶囊
3. "Where would you like to go?" 四个入口：Projects、CV、Course Notes（站内 `/notes`）、All my links（桌面 4 列；手机 2×2，隐藏副标题）
4. 一句话简介（手机上放在入口卡片之后，桌面放在 2 之后）
5. Featured projects（`featured: true`，2–3 个）+ "All projects →"
6. Recent updates（最新 3–5 条）
7. 有文章后加 "Latest writing"（最新 3 篇）

> 手机第一屏实测：照原型排列时，390×664 可视区域只放得下第一行入口卡片（487–632px），第二行在 644–789px。简介挪到卡片后面、收紧上边距后，四张卡片都能进入第一屏。M2 验收按 390×664 测。

**项目列表 `/projects`**：面包屑、标题、一句说明 → `ProjectFilter` → `ProjectCard` 网格，每张卡底部有 "Read case study →"。

**项目详情 `/projects/[slug]`**：面包屑、标题、summary → `ProjectMeta` → "View source on GitHub ↗"、"← All projects" → MDX 正文（The problem · How it works · Key decisions · What I'd do differently）→ 上一个 / 下一个项目。

**Blog**：列表显示标题、日期、阅读时间、标签、摘要；文章页显示标题、日期、标签、正文、相关项目、返回列表。

**CV `/cv`**：标题 + "Last updated" + Download PDF → Education · Experience · Teaching · Research · Skills，全部来自数据文件。

**Notes `/notes`**：标题 "Course notes" → 按学校分组，每行和 Links 页同样的样式，按钮打开该校的笔记站 ↗。

**Links `/links`**：标题 "Find me elsewhere" → 分组 School · My sites · Code · Contact → 每行图标、名称、说明、网址（手机隐藏）、"Visit ↗"。

## UI 细节（来自原型）

顶栏

- 白底，下边框 1px `--border`；内容最大宽 1120px，左右留白 24px（手机 16px）。
- 桌面：左边名字（18px / 600，链接回首页）；右边导航项是圆角 10px、高 44px 的文字按钮。当前页用 `--accent-soft` 底、`--accent` 字、600 字重，并设 `aria-current="page"`。导航右侧是语言切换：一个 `--text-3` 色、14px 的普通文字链接，没有边框和高亮，悬停才显示浅灰底。默认语言是英文，不做自动跳转。
- 手机：只剩名字和描边按钮 "☰ Menu"，展开后变 "✕ Close"。面板是整列 48px 高的大按钮，当前页高亮；底部放语言切换和全宽 Contact me 主按钮。

首页

- Now 胶囊：白底、描边、全圆角，前面 8px 绿色圆点（`#1f9d55`）。
- 入口卡片：白底、1.5px 描边、圆角 16px、内边距 22px（手机 16px）；左上 44px 圆角方块图标（`--accent-soft` 底、`--accent` 线性图标）；底部动作文字 accent 色 600 字重；悬停时描边变 accent、上浮 2px。
- 精选项目卡：顶部 150–168px 示意区，下面标题、简介和黑色实心 "Read case study →"。
- Recent updates：一张白色圆角卡片分行，左列 110px，等宽字体日期。

项目卡示意图（有截图后由 `cover` 替换）

- Anteater MCP：深色（`#11141b`）终端块，显示一次 `search_courses` 调用和结果。
- Canvas MCP：浅蓝底三行紫色（`#8250df`）"Merged" 徽章 + PR 标题。
- 研究：浅橙底六边形雷达图形（HEXACO 示意），不带数字。
- 课程笔记：浅绿底文档页面缩略。

按钮层级

- 主按钮：`--text` 黑底白字；强调动作（Contact me、Download PDF）用 accent 实心。
- 次按钮：白底 + 1px `--border-strong` 描边。
- 最小高度 44px（重要动作 48px），圆角 10px。

列表页与详情页

- Projects 筛选：全圆角胶囊，选中为黑底白字。
- 项目详情：内容区 820px；面包屑链接 accent 色；架构图三个方框横排、中间 accent 高亮，手机纵向、箭头转 90°；底部 "← All projects" 和 "Next project →" 两张卡片。
- CV：内容区 880px；小节标题 13px、大写、字距 0.08em；左 170px 日期列（手机上下排列）；右上 Download PDF 为 accent 主按钮。
- Links：左边 44px 彩色字母图标（学校 `#fff5db` / `#8a6100`，我的站点蓝，代码黑，联系方式绿）；网址用等宽字体（手机隐藏）；右边灰底 "Visit ↗"。

页脚：上方分隔线；左 "© 年份 Kazuha Mo"，右 Email · GitHub · All links。

## 面向未来的变更

任何身份变化都只改数据文件，页面结构里不出现写死的 "UC Irvine"。具体改哪个文件见 [`content.md`](content.md)。

## 部署

- 纯静态构建，Wrangler 部署到 Cloudflare Workers 静态资源，绑定 kazuha.me。
- DNS 在 M1 迁到 Cloudflare，M2 结束时绑定域名（nameserver 生效需要时间，提前做）。
- `wrangler.jsonc`：`assets.directory: "./dist"`、`assets.not_found_handling: "404-page"`；`html_handling` 用默认的 `auto-trailing-slash`，与 Astro 默认的 `build.format: "directory"` 一致。
- 缓存：`public/_headers` 给 `/_astro/*`（文件名带内容 hash 的 CSS、JS、字体）设 `Cache-Control: public, max-age=604800, immutable`（7 天；规则也会作用于 404，所以不设一年）；HTML 保持 Cloudflare 默认的每次重新验证，发布后立即生效。字体文件名按 Fontsource 带版本号的地址计算，改用 `@latest` 一类不带版本的字体来源前要先改掉这条规则。
- CI 与部署：只在 GitHub Actions 构建一次；`main` 检查通过后，CI 把构建产物推到 `deploy` 分支，Cloudflare Workers Builds 监听这个分支并直接 `wrangler deploy`，不再自己构建。不需要 Cloudflare 密钥，PR 不做预览（见 [`development.md`](development.md#ci-与部署流程)）。
- SEO：`@astrojs/sitemap`、canonical、Open Graph 图（M3 可自动生成）、`robots.txt`。
- 统计：如需要，用 Cloudflare Web Analytics（免费、无 cookie）。

## 内容原则

值等于或包含 `[占位]` 的数据视为“未提供”：对应的链接、按钮、行（Email、LinkedIn、简历 PDF、Last updated）不渲染，头像显示为姓名首字母圆形；项目正文里的文字占位保持可见，提醒本人补写。判断统一用 `src/config/site.ts` 的 `isPlaceholder()`。

只写真实发生过的事，不编数字、不夸大头衔；没有的信息用 `[占位]` 留空，上线前由本人补齐。

- 研究写成"进行中"的项目，如实描述做了什么（例如在 UCI OPENGPU 上用 Qwen2.5-7B 搭的 sycophancy 测量 pipeline），不写成已发表。
- 实习只写可以公开的部分。
- 项目详情里的 "Key decisions" 和 "What I'd do differently" 由本人撰写。
- 不放住址、电话；联系方式只留邮箱和公开主页。

待填：

- [ ] 头像照片
- [ ] 公开邮箱地址
- [ ] LinkedIn 链接
- [ ] 简历 PDF
- [ ] Anteater MCP：技术栈、问题描述、关键决策、复盘
- [ ] Canvas MCP：PR 编号与标题、上游仓库链接
- [ ] 研究项目页描述（与合作者确认可公开的范围）
- [ ] 实习的一句话描述
- [ ] 中文版文案
- [ ] 第一篇博客（候选：homelab 介绍、Anteater MCP 是怎么做的）

## 里程碑与验收

- [ ] **M1**：`npm run dev` 能跑；所有页面都用 `BaseLayout`；改 `site.nav` 一处，桌面和手机导航同时变化；`wrangler deploy` 成功并能通过 workers.dev 访问；DNS 已迁到 Cloudflare。
- [ ] **M2**：五个页面全部由数据文件和集合渲染，页面里没有写死的个人信息；390×664 可视区域内能看到四张入口卡片；所有按钮可用键盘 Tab 到达；kazuha.me 指向新站，HTTPS 正常。
- [ ] **M3**：新增一篇 `.mdx` 不改代码就出现在 /blog、首页和 RSS；`/zh/` 下页面可用，缺翻译时回退英文并提示；暗色模式。
- [ ] **M4**：待填清单全部勾完；Lighthouse 可访问性与性能 ≥ 90；`docs/content.md` 覆盖所有更新场景。
