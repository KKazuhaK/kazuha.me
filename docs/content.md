# 如何更新内容

页面只负责展示；下面这些改动都不需要碰组件或页面代码。

| 场景                             | 改哪里                                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 改名字、tagline、当前身份        | `src/config/site.ts` 的 `name`、`tagline`、`now`                                                                                                           |
| 导航加一项、调顺序、暂时隐藏     | `src/config/site.ts` 的 `nav`                                                                                                                              |
| 课程笔记换地址 / 新学校的笔记    | `src/data/notes.yaml`：改对应条目的 `url`，或给新学校加一条（旧的保留）                                                                                    |
| 新项目                           | `src/content/projects/en/<slug>.mdx`（中文版放 `zh/` 同名文件）                                                                                            |
| 新文章                           | `src/content/posts/en/<slug>.mdx`，自动进入列表、首页和 RSS；`draft: true` 时只在本地可见                                                                  |
| 首页"最近动态"                   | `src/data/updates.yaml` 加一条                                                                                                                             |
| 去别的学校读研                   | `src/data/education.yaml` 加一条；`site.ts` 的 `now` 改成新身份；`src/data/links.yaml` 的 `school` 组加新学校；有新笔记站就在 `src/data/notes.yaml` 加一条 |
| 换了工作 / 实习                  | `src/data/experience.yaml` 加一条，`site.ts` 的 `now` 视情况改                                                                                             |
| 助教 / 教学                      | `src/data/teaching.yaml`                                                                                                                                   |
| 研究经历 / 技能                  | `src/data/research.yaml` / `src/data/skills.yaml`                                                                                                          |
| 填邮箱、LinkedIn、头像、简历 PDF | `src/config/site.ts` 的 `email`、`social.linkedin`、`avatar`、`cv`（`[占位]` 表示未提供，对应链接不显示）                                                  |
| 加链接                           | `src/data/links.yaml`，`group` 选 `school` / `sites` / `code` / `contact`                                                                                  |
| 暂时隐藏某个链接                 | `src/data/links.yaml` 里给该条加 `enabled: false`，恢复时删掉或改成 `true`                                                                                 |
| 有了论文 / preprint / poster     | 新建 `publications` 集合和 `/research` 页，在 `site.ts` 的 `nav` 打开 Research                                                                             |
| 换简历 PDF                       | 替换 `public/` 下的 PDF，同时更新 CV 页对应的数据文件，两边保持一致                                                                                        |
| 换主色或字体                     | 只改 `src/styles/tokens.css`（字体文件本身在 `astro.config.mjs` 的 `fonts` 里）                                                                            |
| 加一种语言                       | `astro.config.mjs` 的 `i18n.locales` 加一项；`src/i18n/ui.ts` 补界面文字；内容加对应语言目录                                                               |

注意：

- YAML 数据每一条都要有唯一的 `id`，比如 `id: uci-bs`。
- 日期写成 `2026-11-04` 这样的格式；`updates.yaml` 的日期用带引号的字符串，只写已知的精度（`'2026-10'` 或 `'2026-10-26'`）。
- 改完跑一次 `npm run build`，schema 不对的话构建会直接报出哪个文件、哪个字段有问题。
