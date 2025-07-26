import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface BlogPostCardProps {
  title: string;
  permalink: string;
  date: string;
  formattedDate: string;
  readingTime?: number;
  description?: string;
  tags?: Array<{
    label: string;
    permalink: string;
  }>;
}

export default function BlogPostCard({
  title,
  permalink,
  date,
  formattedDate,
  readingTime,
  description,
  tags = []
}: BlogPostCardProps): JSX.Element {
  return (
    <article className={styles.blogPostCard}>
      <Link to={permalink} className={styles.cardLink}>
        <div className={styles.cardContent}>
          <header>
            <h2 className={styles.postTitle}>{title}</h2>
            <div className={styles.postMeta}>
              <time dateTime={date}>{formattedDate}</time>
              {readingTime && (
                <>
                  <span className={styles.metaSeparator}>·</span>
                  <span>{Math.ceil(readingTime)} 分钟阅读</span>
                </>
              )}
            </div>
          </header>
          
          {description && (
            <p className={styles.postDescription}>{description}</p>
          )}
          
          <footer className={styles.postFooter}>
            <div className={styles.postTags}>
              {tags.slice(0, 3).map((tag) => (
                <span key={tag.permalink} className={styles.tag}>
                  #{tag.label}
                </span>
              ))}
            </div>
            <span className={styles.readMore}>
              阅读更多 →
            </span>
          </footer>
        </div>
      </Link>
    </article>
  );
}