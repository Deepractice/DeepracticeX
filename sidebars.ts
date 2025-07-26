import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * DeepracticeX 侧边栏配置
 * 分为产品和社区两个独立的侧边栏
 */
const sidebars: SidebarsConfig = {
  // 产品侧边栏
  productSidebar: [
    {
      type: 'doc',
      id: 'products/index',
      label: '产品概览',
    },
    {
      type: 'category',
      label: 'PromptX',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'PromptX 文档',
        description: '专业的 AI 角色管理平台',
        slug: '/products/promptx',
      },
      items: [
        // 后续添加 PromptX 相关文档
      ],
    },
    {
      type: 'category',
      label: '研究',
      link: {
        type: 'doc',
        id: 'research/index',
      },
      items: [
        {
          type: 'category',
          label: 'Monogent 理论',
          collapsed: false,
          link: {
            type: 'generated-index',
            title: 'Monogent 理论体系',
            description: '探索 AI 认知系统的本质',
            slug: '/research/monogent',
          },
          items: [
            // 后续添加 Monogent 文章
          ],
        },
        // 可以添加 DPML、PATEOAS 等
      ],
    },
    {
      type: 'category',
      label: '资源',
      link: {
        type: 'doc',
        id: 'resources/index',
      },
      items: [
        // 后续添加教程、工具等
      ],
    },
  ],

  // 社区侧边栏
  communitySidebar: [
    {
      type: 'doc',
      id: 'community/index',
      label: '社区首页',
    },
    {
      type: 'category',
      label: '精彩对话',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: '社区精彩对话',
        description: '记录有价值的技术讨论',
        slug: '/community/conversations',
      },
      items: [
        // 后续添加对话记录
      ],
    },
    {
      type: 'category',
      label: '用户案例',
      link: {
        type: 'generated-index',
        title: '用户案例展示',
        description: '看看大家如何使用 deepractice 产品',
        slug: '/community/showcases',
      },
      items: [
        // 后续添加案例
      ],
    },
    {
      type: 'category',
      label: '贡献指南',
      link: {
        type: 'generated-index',
        title: '如何贡献',
        description: '一起让 AI 更触手可及',
        slug: '/community/contributing',
      },
      items: [
        // 后续添加贡献指南
      ],
    },
  ],

  // 如果需要保留原始教程（可以删除）
  tutorialSidebar: [
    {
      type: 'category',
      label: '教程',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};

export default sidebars;