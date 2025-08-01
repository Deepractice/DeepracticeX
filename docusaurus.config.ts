import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'DeepracticeX',
  tagline: 'Everything of Deepractice',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://x.deepractice.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Deepractice', // Usually your GitHub org/user name.
  projectName: 'DeepracticeX', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Deepractice/DeepracticeX/tree/main/',
          // 路由配置
          routeBasePath: 'docs',
          // 面包屑导航
          breadcrumbs: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Deepractice/DeepracticeX/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          // 博客列表默认展开全文
          truncateMarker: /<!--\s*more\s*-->/,
          blogListComponent: '@theme/BlogListPage',
          blogPostComponent: '@theme/BlogPostPage',
          // 侧边栏设置
          blogSidebarTitle: '最近文章',
          blogSidebarCount: 10,
          postsPerPage: 5,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'DeepracticeX',
      logo: {
        alt: 'DeepracticeX Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/',
          label: '首页',
          position: 'left',
          activeBaseRegex: '^/$',
        },
        {
          to: '/blog', 
          label: '博客', 
          position: 'left'
        },
        {
          type: 'docSidebar',
          sidebarId: 'productSidebar',
          position: 'left',
          label: '产品',
        },
        {
          type: 'docSidebar',
          sidebarId: 'communitySidebar',
          position: 'left',
          label: '社区',
        },
        {
          href: 'https://github.com/Deepractice/DeepracticeX',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '内容',
          items: [
            {
              label: '研究',
              to: '/docs/research',
            },
            {
              label: '产品',
              to: '/docs/products',
            },
            {
              label: '资源',
              to: '/docs/resources',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Deepractice',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/deepractice',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/deepractice',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '博客',
              to: '/blog',
            },
            {
              label: '官网',
              href: 'https://deepractice.ai',
            },
            {
              label: 'PromptX',
              href: 'https://github.com/Deepractice/promptx',
            },
          ],
        },
      ],
      copyright: `<a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener noreferrer" target="__blank">CC BY 4.0</a> | © ${new Date().getFullYear()} deepractice.ai`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;