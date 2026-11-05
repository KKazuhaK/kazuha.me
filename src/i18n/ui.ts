import { getRelativeLocaleUrl } from 'astro:i18n';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const en = {
  navLabel: 'Main',
  nav_home: 'Home',
  nav_projects: 'Projects',
  nav_blog: 'Blog',
  nav_cv: 'CV',
  nav_links: 'Links',
  nav_notes: 'Notes',
  menu: 'Menu',
  close: 'Close',
  contactMe: 'Contact me',
  courseNotes: 'Course Notes',
  allLinks: 'All links',
  email: 'Email',
  github: 'GitHub',
  skipToContent: 'Skip to content',
  opensNewTab: '(opens in a new tab)',
  langEn: 'English',
  langZh: '中文',
  now: 'Now',
  projectsTitle: 'Projects',
  cvTitle: 'CV',
  linksTitle: 'Find me elsewhere',
  notFoundTitle: 'Page not found',
  notFoundBody: 'The page you are looking for does not exist or has moved.',
  backHome: 'Back to home',
  colon: ': ',
  homeHeading: 'Where would you like to go?',
  quickLinks: 'Quick links',
  tileProjectsSub: 'What I’ve built',
  tileProjectsAction: 'See projects',
  tileCvSub: 'Education & experience',
  tileCvAction: 'View CV',
  tileNotesSub: 'By school',
  tileNotesAction: 'See notes',
  tileLinksTitle: 'All my links',
  tileLinksSub: 'Sites, code, contact',
  tileLinksAction: 'See links',
  featuredProjects: 'Featured projects',
  allProjects: 'All projects',
  recentUpdates: 'Recent updates',
  present: 'present',
  expectedSuffix: ' (exp.)',
  kind_oss: 'Open source',
  kind_research: 'Research',
  kind_infra: 'Infra & web',
  filterAll: 'All',
  filterLabel: 'Filter projects',
  readCaseStudy: 'Read case study',
  seeContributions: 'See contributions',
  readMore: 'Read more',
  ctaAbout: ' (about {title})',
  exampleLabel: 'example',
  showingProjects: 'Showing {n} projects',
  showingOneProject: 'Showing 1 project',
  projectsIntro:
    'Things I’ve built or contributed to. Each one has a page explaining the problem, how it works and what I learned.',
  breadcrumb: 'Breadcrumb',
  metaRole: 'Role',
  metaYear: 'Year',
  metaStack: 'Stack',
  metaStatus: 'Status',
  status_active: 'Active',
  status_done: 'Done',
  'status_in-progress': 'In progress',
  viewSource: 'View source on GitHub',
  visitSite: 'Visit site',
  backToProjects: 'All projects',
  previousProject: 'Previous project',
  nextProject: 'Next project',
  moreProjects: 'More projects',
  fallbackNotice:
    'This page is not available in this language yet; showing the English version.',
  cvHeading: 'Curriculum Vitae',
  lastUpdated: 'Last updated',
  downloadPdf: 'Download PDF',
  cvEducation: 'Education',
  cvExperience: 'Experience',
  cvTeaching: 'Teaching',
  cvResearch: 'Research',
  cvSkills: 'Skills',
  withPerson: 'With ',
  linksIntro: 'Everything I run or belong to, in one place.',
  notesTitle: 'Course notes',
  notesIntro:
    'Study notes from each school I’ve attended. Each button opens that school’s notes site.',
  group_school: 'School',
  group_sites: 'My sites',
  group_code: 'Code',
  group_contact: 'Contact',
  avatarAlt: 'Photo of {name}',
} as const;

export type UiKey = keyof typeof en;

const zh: Record<UiKey, string> = {
  navLabel: '主导航',
  nav_home: '首页',
  nav_projects: '项目',
  nav_blog: '博客',
  nav_cv: '简历',
  nav_links: '链接',
  nav_notes: '笔记',
  menu: '菜单',
  close: '关闭',
  contactMe: '联系我',
  courseNotes: '课程笔记',
  allLinks: '所有链接',
  email: '邮箱',
  github: 'GitHub',
  skipToContent: '跳到正文',
  opensNewTab: '（在新标签页打开）',
  langEn: 'English',
  langZh: '中文',
  now: '目前',
  projectsTitle: '项目',
  cvTitle: '简历',
  linksTitle: '在别处找到我',
  notFoundTitle: '找不到这个页面',
  notFoundBody: '你访问的页面不存在，或已被移动。',
  backHome: '回到首页',
  colon: '：',
  homeHeading: '想去哪里看看？',
  quickLinks: '快速入口',
  tileProjectsSub: '我做过的东西',
  tileProjectsAction: '查看项目',
  tileCvSub: '教育与经历',
  tileCvAction: '查看简历',
  tileNotesSub: '按学校整理',
  tileNotesAction: '查看笔记',
  tileLinksTitle: '我的所有链接',
  tileLinksSub: '网站、代码、联系方式',
  tileLinksAction: '查看链接',
  featuredProjects: '精选项目',
  allProjects: '全部项目',
  recentUpdates: '最近动态',
  present: '至今',
  expectedSuffix: '（预计）',
  kind_oss: '开源',
  kind_research: '研究',
  kind_infra: '基础设施与网站',
  filterAll: '全部',
  filterLabel: '筛选项目',
  readCaseStudy: '阅读案例',
  seeContributions: '查看贡献',
  readMore: '了解更多',
  ctaAbout: '（{title}）',
  exampleLabel: '示例',
  showingProjects: '显示 {n} 个项目',
  showingOneProject: '显示 1 个项目',
  projectsIntro:
    '我做过或参与过的项目。每个项目都有一页，讲清楚问题、原理和我的收获。',
  breadcrumb: '面包屑',
  metaRole: '角色',
  metaYear: '年份',
  metaStack: '技术栈',
  metaStatus: '状态',
  status_active: '进行中',
  status_done: '已完成',
  'status_in-progress': '进行中',
  viewSource: '在 GitHub 查看源码',
  visitSite: '访问网站',
  backToProjects: '全部项目',
  previousProject: '上一个项目',
  nextProject: '下一个项目',
  moreProjects: '更多项目',
  fallbackNotice: '本页暂无中文版，以下为英文内容。',
  cvHeading: '个人简历',
  lastUpdated: '最后更新',
  downloadPdf: '下载 PDF',
  cvEducation: '教育',
  cvExperience: '经历',
  cvTeaching: '教学',
  cvResearch: '研究',
  cvSkills: '技能',
  withPerson: '合作者：',
  linksIntro: '我运营或所属的一切，都放在这里。',
  notesTitle: '课程笔记',
  notesIntro: '我在每所学校的学习笔记。每个按钮都会打开对应学校的笔记站。',
  group_school: '学校',
  group_sites: '我的网站',
  group_code: '代码',
  group_contact: '联系方式',
  avatarAlt: '{name} 的照片',
};

const dictionaries: Record<Locale, Record<UiKey, string>> = { en, zh };

export function getLocale(currentLocale: string | undefined): Locale {
  return (locales as readonly string[]).includes(currentLocale ?? '')
    ? (currentLocale as Locale)
    : defaultLocale;
}

/** Language of English-only data shown on a non-English page, else undefined. */
export function fallbackLang(locale: Locale): 'en' | undefined {
  return locale === 'en' ? undefined : 'en';
}

export function t(
  locale: Locale,
  key: UiKey,
  vars?: Record<string, string>,
): string {
  let text = dictionaries[locale][key];
  for (const [name, value] of Object.entries(vars ?? {})) {
    text = text.replaceAll(`{${name}}`, value);
  }
  return text;
}

/** Path for `path` (written without a locale prefix, e.g. "/cv") in `locale`. */
export function localizedPath(locale: Locale, path: string): string {
  return getRelativeLocaleUrl(locale, path === '/' ? '' : path);
}

/** Remove a leading locale segment and any trailing slash; "/" stays "/". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if ((locales as readonly string[]).includes(parts[0] ?? '')) parts.shift();
  return '/' + parts.join('/');
}

/** The same page as `pathname`, but in `target` locale. */
export function pathInLocale(pathname: string, target: Locale): string {
  return localizedPath(target, stripLocale(pathname));
}
