import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItems from '@theme/BlogPostItems';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogPostCard from '@site/src/components/BlogPostCard';
import type {Props} from '@theme/BlogListPage';
import styles from './styles.module.css';

function BlogListPageMetadata(props: Props): JSX.Element {
  const {metadata} = props;
  const {blogTitle, blogDescription} = metadata;
  return (
    <>
      <title>{blogTitle}</title>
      <meta property="og:title" content={blogTitle} />
      <meta name="description" content={blogDescription} />
      <meta property="og:description" content={blogDescription} />
    </>
  );
}

function BlogListPageHero(): JSX.Element {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          深度实践 · 理论探索
        </h1>
        <p className={styles.heroSubtitle}>
          探索 AI 工程化的理论基础与实践方法
        </p>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>篇文章</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>个系列</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>深度思考</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const {metadata, items} = props;
  
  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogContent}>
        <div className={styles.postsSection}>
          <h2 className={styles.sectionTitle}>最新文章</h2>
          <div className={styles.postsGrid}>
            {items.map(({content}) => {
              const {metadata: postMetadata, frontMatter} = content;
              return (
                <BlogPostCard
                  key={postMetadata.permalink}
                  title={postMetadata.title}
                  permalink={postMetadata.permalink}
                  date={postMetadata.date}
                  formattedDate={postMetadata.formattedDate}
                  readingTime={postMetadata.readingTime}
                  description={postMetadata.description || frontMatter.description}
                  tags={postMetadata.tags}
                />
              );
            })}
          </div>
          <BlogListPaginator metadata={metadata} />
        </div>
        
        <aside className={styles.blogSidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>关于博客</h3>
            <p className={styles.sidebarText}>
              DeepracticeX 是 deepractice.ai 的技术博客，
              专注于 AI 工程化的理论研究与实践探索。
            </p>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>核心主题</h3>
            <div className={styles.tagList}>
              <a href="/blog/tags/deep-practice" className={styles.tag}>深度实践</a>
              <a href="/blog/tags/ai" className={styles.tag}>AI</a>
              <a href="/blog/tags/theory" className={styles.tag}>理论</a>
              <a href="/blog/tags/cognitive-science" className={styles.tag}>认知科学</a>
              <a href="/blog/tags/monogent" className={styles.tag}>Monogent</a>
              <a href="/blog/tags/promptx" className={styles.tag}>PromptX</a>
            </div>
          </div>
          
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>系列文章</h3>
            <ul className={styles.seriesList}>
              <li><a href="#cognitive">认知与语义系列</a></li>
              <li><a href="#framework">框架设计系列</a></li>
              <li><a href="#practice">工程实践系列</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <Layout>
      <BlogListPageMetadata {...props} />
      <BlogListPageHero />
      <BlogListPageContent {...props} />
    </Layout>
  );
}